import { Low, JSONFile } from 'lowdb';
import { lock, deepCopy } from '@yuri2/utils-general';
import fs from 'fs-extra';
import fsPath from 'path';
import formidable from 'formidable';
import { uuid } from '@yuri2/utils-general';
import { getProjectDirectory } from './index';

const cache = { uploadDb: null };
const symbolUpdateUploadDbData = Symbol();

function getDirUploads() {
  return fsPath.join(getProjectDirectory(), 'persists/naples/uploads/files/');
}

/**
 * 获取db对象，用于处理upload信息的本地化
 * @returns db
 */
async function getUploadDb() {
  if (cache.uploadDb) return cache.uploadDb;
  let db;
  // Should not create an empty file, lowdb will do this correctly.
  const dirUploadData =
    getProjectDirectory() + 'persists/naples/uploads/data.json';
  const adapter = new JSONFile(dirUploadData);
  db = new Low(adapter);
  await db.read();
  db.data = db.data || { files: [] };
  cache.uploadDb = db;
  return db;
}

/**
 * 修改UploadDbData(使用lock保证不会写入脏数据)
 * @param {function} funcEditDataSync 一个同步函数用于修改data
 * @return {Promise} 保存数据到本地文件
 */
export async function updateUploadDbData(funcEditDataSync) {
  await lock(async () => {
    const db = await getUploadDb();
    funcEditDataSync(db.data);
    await db.write();
  }, [symbolUpdateUploadDbData]);
}

/**
 * 根据ID获取上传文件的信息
 * @param {string} id 文件ID
 * @returns {Promise<object>} 文件信息
 */
export async function getUploadFileInfoById(id) {
  const db = await getUploadDb();
  const fileInfo = db.data.files.find(file => file.id === id);
  return fileInfo ? deepCopy(fileInfo) : null;
}

/**
 * 标记一个上传文件的被使用状态（许久未被使用的文件将会被自动清理）
 * @param {string} id 文件ID
 * @param {boolean} used 是否被使用
 * @param {string} usage 用途（仅记录）
 * @returns {Promise<boolean>} success
 */
export async function setUploadFileUsedState(id, used, usage = 'N/A') {
  let success = false;
  const hasFile = !!(await getUploadFileInfoById(id));
  if (!hasFile) {
    return false;
  }
  await updateUploadDbData(data => {
    const fileInfo = data.files.find(file => file.id === id);
    if (fileInfo) {
      fileInfo.used = used;
      fileInfo.usage = usage;
      success = true;
    }
  });
  return success;
}

/**
 * 标准已上传文件静态输出所调用的API handler(GET)
 * @param {*} req
 * @param {*} res
 * @returns
 */
export async function handlerGetUploadedFile(req, res) {
  const {
    query: { id },
  } = req;
  const fileInfo = await getUploadFileInfoById(id);
  if (!fileInfo) {
    return res.status(404).end('Resources not found');
  }
  res.writeHead(200, {
    'content-type': fileInfo.mimetype,
    'cache-control': 'public, max-age=999999',
  });
  const stream = fs.createReadStream(
    fsPath.join(getProjectDirectory(), fileInfo.filePath)
  );
  stream.pipe(res);
  stream.on('end', () => {
    // res.end();
  });
}

/**
 * 标准上传文件所调用的API handler(POST)
 * 临时保存已上传文件至persists目录下，API返回文件id和访问地址
 * @param {*} req
 * @param {*} res
 * @param {<{maxFileSize, urlSetter}>}
 * maxFileSize {number} 最大支持的文件大小（byte）
 * urlSetter {function} GET访问路由生成器，形如 (id) => '/api/naples/upload?id=' + id
 * mimetypeFilter {function} mimetype过滤器，必须返回bool，形如 mimetype => mimetype && mimetype.includes("image");
 * @returns
 */
export async function handerPostUpload(req, res, options = {}) {
  const defaultOptions = {
    maxFileSize: 4 * 1024 * 1024,
    urlSetter: id => '/api/naples/upload?id=' + id,
    mimetypeFilter: mimetype => mimetype && mimetype.includes('image'),
  };
  const { maxFileSize, urlSetter, mimetypeFilter } = {
    ...defaultOptions,
    ...options,
  };
  // prepare for upload
  const dirUploads = getDirUploads();
  await fs.ensureDir(dirUploads);
  const form = formidable({
    uploadDir: dirUploads,
    maxFileSize,
    minFileSize: 0,
    allowEmptyFiles: true,
    filter: function ({ name, originalFilename, mimetype }) {
      // keep only images
      return mimetypeFilter(mimetype);
    },
  });
  const newFile = await new Promise((resolve, reject) => {
    form.parse(req, function (err, fields, files) {
      resolve(err ? null : files.file);
    });
  });
  if (!newFile)
    return res
      .status(415)
      .end('File is too large or has a unsupported mime type.');

  // save file info
  let fileData;
  await (async () => {
    const { newFilename, originalFilename, mimetype, size } = newFile;
    const id = uuid();
    const now = new Date();
    fileData = {
      id,
      url: urlSetter(id),
      used: false,
      usage: 'N/A',
      originalFilename,
      extname: originalFilename.split('.').pop() || '',
      newFilename,
      filePath: fsPath.join('persists/naples/uploads/files', newFilename),
      mimetype,
      size,
      updateTime: now.getTime(),
      updateTimeString: now.toISOString(),
    };
    await updateUploadDbData(data => {
      data.files.push(fileData);
    });
    uploadFileGc().catch(e => {
      console.warn('Upload files gc failed:', e);
    });
  })();
  res.status(200).json({ id: fileData.id, url: fileData.url });
}

/**
 * 对许久未使用的(3600s)上传文件进行垃圾回收
 * @param {boolean} ignoreChance 是否忽略概率。默认存在一个概率0.05，即平均每上传20个文件执行一次垃圾回收
 */
async function uploadFileGc(ignoreChance = false) {
  const EXPIRE_TIME = 3600; // s
  const od = ignoreChance ? 1 : 0.05;
  if (Math.random() > od) {
    // ignore;
    return;
  }
  let deleteJobs = [];
  await updateUploadDbData(data => {
    const now = new Date().getTime();
    // 查找超过$EXPIRE_TIME 的未使用的文件
    const gcFiles = data.files.filter(
      f => !f.used && now - f.updateTime > EXPIRE_TIME * 1000
    );
    // 删除文件
    deleteJobs = gcFiles.map(f =>
      fs.remove(fsPath.join(getProjectDirectory(), f.filePath)).catch(() => {})
    );
    // 清除data相应的条目
    const gcFilesIds = new Set(gcFiles.map(f => f.id));
    data.files = data.files.filter(f => !gcFilesIds.has(f.id));
  });
  await Promise.all(deleteJobs);
}
