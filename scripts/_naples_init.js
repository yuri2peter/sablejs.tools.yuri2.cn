const fs = require('fs-extra');
const path = require('path');

(function () {
  // init some files
  fs.ensureFileSync(path.join(__dirname, '../.naples_filepath_mark'));
  fs.ensureFileSync(path.join(__dirname, '../.env.local'));
  fs.ensureFileSync(path.join(__dirname, '../.env.production.local'));
})();
