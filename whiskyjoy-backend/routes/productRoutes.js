const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/upload'); // 你的 multer 配置

// 1. 獲取篩選選單 (放在 :id 之前)
router.get('/get-filters', productController.getFilters);

// 獲取所有產品
router.get('/', productController.getAllProducts);

// 根據 ID 獲取單一產品
router.get('/:id', productController.getProductById);

// 創建新產品
router.post('/', productController.createProduct);

// 更新產品
router.put('/:id', productController.updateProduct);

// 刪除產品
router.delete('/:id', productController.deleteProduct);

module.exports = router;

// 💡 產品圖片上傳
router.post('/upload', upload.single('file'), productController.handleProductUpload);