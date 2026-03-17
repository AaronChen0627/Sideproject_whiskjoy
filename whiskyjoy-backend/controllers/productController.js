const productModel = require("../models/productModel");

module.exports = {
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
        country_id, 
        region_id, 
        category_id, 
        brand_id 
      } = req.body;

      // 1. 檢查是否有重複名稱 (Model 已改為回傳物件或 null)
      const existingProduct = await productModel.findProductByName(product_name_zh, product_name_en);
      if (existingProduct) {
        return res.status(400).json({ message: "產品名稱（中/英）已存在" });
      }

      // 2. 找出相關 ID (修正表名為小寫，確保對應 SQL)
      const countryId = await productModel.findIdByName("countries", "country_name_zh", country_id);
      const categoryId = await productModel.findIdByName("categories", "category_name_zh", category_id);
      const brandId = await productModel.findIdByName("brands", "brand_name_zh", brand_id);
      const regionId = region_id ? await productModel.findIdByName("regions", "region_name_zh", region_id) : null;

      if (!countryId || !categoryId || !brandId) {
        return res.status(400).json({ message: "無效的國家、分類或品牌資訊" });
      }

      // 3. 插入產品 (insertProduct 會回傳新產生的 UUID)
      const newId = await productModel.insertProduct({
        product_name_zh,
        product_name_en,
        product_image_url,
        country_id: countryId,
        region_id: regionId,
        category_id: categoryId,
        brand_id: brandId,
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

      // 找出相關 ID (修正為小寫)
      const countryId = await productModel.findIdByName("countries", "country_name_zh", country_id);
      const categoryId = await productModel.findIdByName("categories", "category_name_zh", category_id);
      const brandId = await productModel.findIdByName("brands", "brand_name_zh", brand_id);
      const regionId = region_id ? await productModel.findIdByName("regions", "region_name_zh", region_id) : null;

      if (!countryId || !categoryId || !brandId) {
        return res.status(400).json({ message: "無效的國家、分類或品牌資訊" });
      }

      // 更新產品
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