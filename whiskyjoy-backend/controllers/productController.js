const productModel = require('../models/productModel');
const path = require('path');
const fs = require('fs');

module.exports = {
  // 1. 取得篩選選單
  getFilters: async (req, res) => {
    try {
      const filters = await productModel.getFilters();
      res.status(200).json(filters);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 2. 取得所有產品
  getAllProducts: async (req, res) => {
    try {
      const products = await productModel.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 3. 取得單一產品
  getProductById: async (req, res) => {
    try {
      const product = await productModel.getProductById(req.params.id);
      if (!product) return res.status(404).json({ message: "找不到產品" });
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 4. 創建產品
  createProduct: async (req, res) => {
    try {
      const newId = await productModel.insertProduct(req.body);
      res.status(201).json({ id: newId, message: "產品創建成功" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 5. 更新產品
  updateProduct: async (req, res) => {
    try {
      await productModel.updateProduct(req.params.id, req.body);
      res.status(200).json({ message: "產品更新成功" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 6. 刪除產品
  deleteProduct: async (req, res) => {
    try {
      await productModel.deleteProduct(req.params.id);
      res.status(200).json({ message: "產品已刪除" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 7. ✅ 處理產品圖片上傳（修正版）
  handleProductUpload: async (req, res) => {
    try {
      // 1️⃣ 檢查檔案
      if (!req.file) {
        return res.status(400).json({ message: "請上傳檔案" });
      }

      // 2️⃣ 建立資料夾
      const uploadDir = path.join(__dirname, '../public/uploads/products');

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // 3️⃣ 產生檔名（🔥 關鍵）
      const ext = path.extname(req.file.originalname);
      const fileName = `product-${Date.now()}${ext}`;

      // 4️⃣ 寫入檔案（🔥 核心）
      const fullPath = path.join(uploadDir, fileName);
      await fs.promises.writeFile(fullPath, req.file.buffer);

      // 5️⃣ 回傳 URL
      const imageUrl = `/uploads/products/${fileName}`;

      res.status(200).json({
        message: "上傳成功",
        imageUrl
      });

    } catch (error) {
      console.error("Product Upload Error:", error);
      res.status(500).json({ message: "圖片上傳失敗" });
    }
  }
};