const multer = require('multer');

// 只負責把檔案截下來存進記憶體 (Buffer)
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 } // 限制 2MB
});

module.exports = upload;