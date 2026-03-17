require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer'); 
const brandsRouter = require('./routes/brandRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();

// 1. 中介軟體配置
// 關鍵修正：明確允許 Authorization Header，解決 401 問題
app.use(cors({
  origin: '*', // 開發階段允許所有來源
  allowedHeaders: ['Content-Type', 'Authorization'], // 務必包含 Authorization
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// 2. 靜態資源：提供圖片存取路徑
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// 3. 業務路由掛載
app.use('/api/brands', brandsRouter);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/comments', commentRoutes);

app.get('/', (req, res) => res.send('妳好，香吟老師'));

// --- 全域錯誤處理器 ---
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false, 
        message: '上傳失敗：檔案大小不能超過 5MB' 
      });
    }
    return res.status(400).json({ 
      success: false, 
      message: `上傳錯誤: ${err.message}` 
    });
  }

  if (err.message === '僅支援 JPG, JPEG, 或 PNG 格式') {
    return res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }

  console.error('[Server Error]', err.stack);
  res.status(500).json({ 
    success: false, 
    message: '伺服器端發生了一些錯誤，請聯繫管理員' 
  });
});

module.exports = app;