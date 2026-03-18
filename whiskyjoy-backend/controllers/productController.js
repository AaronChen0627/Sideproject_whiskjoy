const productModel = require('../models/productModel');

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

  // 4. 創建產品 (對應 router.post('/'))
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

  // 💡 補上：處理圖片上傳 (對應 router.post('/upload'))
  handleProductUpload: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "請上傳檔案" });
      }
      // 回傳圖片網址或檔案名稱
      res.status(200).json({ 
        message: "上傳成功", 
        imageUrl: `/uploads/${req.file.filename}` 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};