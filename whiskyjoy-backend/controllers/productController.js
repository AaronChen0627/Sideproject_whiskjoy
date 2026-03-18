const productModel = require("../models/productModel");
const path = require('path');
const fs = require('fs');

module.exports = {
  /**
   * 💡 [新增] 處理產品圖片上傳邏輯
   * 將圖片儲存至 public/uploads/products/
   */
  handleProductUpload: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: '未收到檔案' });
      }

      // 1. 定義儲存目錄 (uploads/products)
      const uploadDir = path.join(__dirname, '../public/uploads/products');
      
      // 2. 自動建立資料夾 (如果不存在)
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // 3. 產生唯一的檔名 (避免重複)
      const ext = path.extname(req.file.originalname);
      const fileName = `product-${Date.now()}${ext}`;
      const fullPath = path.join(uploadDir, fileName);

      // 4. 將 Multer 的 Buffer 寫入實體檔案系統
      await fs.promises.writeFile(fullPath, req.file.buffer);

      // 5. 回傳前端可訪問的相對 URL
      const fileUrl = `/uploads/products/${fileName}`;
      
      console.log('✅ 產品圖片儲存成功:', fileUrl);

      res.status(200).json({ 
        success: true, 
        url: fileUrl 
      });
    } catch (error) {
      console.error('❌ Product Upload Error:', error);
      res.status(500).json({ success: false, message: '伺服器儲存圖片失敗' });
    }
  },

  // 取得所有產品
  getAllProducts: async (req, res) => {
    try {
      const products = await productModel.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "獲取產品清單失敗", error });
    }
  },

  // 根據 ID 獲取單一產品
  getProductById: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await productModel.getProductById(id);
      
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ message: "找不到該產品" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "獲取產品失敗", error });
    }
  },

  // 刪除產品
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await productModel.getProductById(id);
  
      if (!product) {
        return res.status(404).json({ message: "產品不存在" });
      }
  
      await productModel.deleteProduct(id);
      res.status(200).json({ message: "產品已成功刪除" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "刪除產品失敗", error });
    }
  },

  // 新增產品
createProduct: async (req, res) => {
  try {
    const { 
      product_name_zh, 
      product_name_en, 
      product_image_url, 
      country_id,  // 這邊前端傳過來的已經是 UUID 了
      region_id,   // 這邊前端傳過來的已經是 UUID 了
      category_id, // 這邊前端傳過來的已經是 UUID 了
      brand_id     // 這邊前端傳過來的已經是 UUID 了
    } = req.body;

    // 1. 檢查是否有重複名稱
    const existingProduct = await productModel.findProductByName(product_name_zh, product_name_en);
    if (existingProduct) {
      return res.status(400).json({ message: "產品名稱（中/英）已存在" });
    }

    // 2. 【核心修正】直接驗證這些 ID 是否存在 (或是直接使用它們)
    // 既然前端傳的就是 ID，我們直接把這些 ID 丟進 insertProduct 即可
    // 如果你依然想做安全檢查，可以改成 checkIdExists，但最快的方法是直接使用：
    
    if (!country_id || !category_id || !brand_id) {
      return res.status(400).json({ message: "缺少必要的國家、分類或品牌資訊" });
    }

    // 3. 插入產品資料
    const newId = await productModel.insertProduct({
      product_name_zh,
      product_name_en,
      product_image_url,
      country_id, // 直接使用前端傳來的 UUID
      region_id,  // 直接使用前端傳來的 UUID 或 null
      category_id,// 直接使用前端傳來的 UUID
      brand_id,   // 直接使用前端傳來的 UUID
    });

    res.status(201).json({ 
      message: "產品新增成功", 
      id: newId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "伺服器錯誤", error });
  }
},

  // 更新產品
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { 
        product_name_zh, 
        product_name_en, 
        product_image_url, 
        country_id, 
        region_id, 
        category_id, 
        brand_id 
      } = req.body;

      const countryId = await productModel.findIdByName("countries", "country_name_zh", country_id);
      const categoryId = await productModel.findIdByName("categories", "category_name_zh", category_id);
      const brandId = await productModel.findIdByName("brands", "brand_name_zh", brand_id);
      const regionId = region_id ? await productModel.findIdByName("regions", "region_name_zh", region_id) : null;

      if (!countryId || !categoryId || !brandId) {
        return res.status(400).json({ message: "無效的國家、分類或品牌資訊" });
      }

      await productModel.updateProduct(id, {
        product_name_zh,
        product_name_en,
        product_image_url,
        country_id: countryId,
        region_id: regionId,
        category_id: categoryId,
        brand_id: brandId,
      });

      res.status(200).json({ message: "產品更新成功" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "伺服器錯誤", error });
    }
  },
};