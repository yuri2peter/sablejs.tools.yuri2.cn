/**
 * This file is generated automatically by naples scaffolding.
 * @create February 25o 2022, 5:42:31 pm
 * @author Yuri2
 */
import {
  handlerGetUploadedFile,
  handerPostUpload,
} from 'src/libs/naples/serverside/upload';

export default async function handler(req, res) {
  const method = req.method.toUpperCase();
  switch (method) {
    case 'GET':
      await handlerGetUploadedFile(req, res);
      break;
    case 'POST':
      await handerPostUpload(req, res, {
        maxFileSize: 4 * 1024 * 1024,
        urlSetter: id => '/api/naples/examples/upload?id=' + id,
      });
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
