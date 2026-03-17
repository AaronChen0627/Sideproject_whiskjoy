const brandModel = require('../models/brandModel');

// 1. 創建品牌
exports.createBrand = async (req, res) => {
  const { brand_name_zh, brand_name_en, logo_url } = req.body;

  try {
    const exists = await brandModel.checkBrandExists(brand_name_zh, brand_name_en);
    if (exists) {
      return res.status(400).json({ message: '此品牌名稱（中或英）已存在' });
    }

    const newId = await brandModel.createBrand({ brand_name_zh, brand_name_en, logo_url });

    res.status(201).json({
      success: true,
      message: '品牌創建成功',
      brand: { id: newId, brand_name_zh, brand_name_en, logo_url }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '無法創建品牌' });
  }
};

// 2. 取得所有品牌
exports.getAllBrands = async (req, res) => {
  try {
    const brands = await brandModel.getAllBrands();
    res.status(200).json({ success: true, brands });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '無法獲取品牌列表' });
  }
};

// 3. 取得單一品牌
exports.getBrandById = async (req, res) => {
  try {
    const brand = await brandModel.getBrandById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: '找不到該品牌' });
    }
    res.status(200).json({ success: true, brand });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '獲取品牌失敗' });
  }
};

// 4. 更新品牌
exports.updateBrand = async (req, res) => {
  const { id } = req.params;
  const { brand_name_zh, brand_name_en, logo_url } = req.body;

  try {
    // 檢查名稱是否與其他品牌衝突
    const exists = await brandModel.checkBrandExists(brand_name_zh, brand_name_en, id);
    if (exists) {
      return res.status(400).json({ message: '更新失敗：品牌名稱已存在' });
    }

    const result = await brandModel.updateBrand(id, { brand_name_zh, brand_name_en, logo_url });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '品牌不存在' });
    }

    res.status(200).json({ success: true, message: '品牌已成功更新' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '更新品牌失敗' });
  }
};

// 5. 刪除品牌
exports.deleteBrand = async (req, res) => {
  try {
    const result = await brandModel.deleteBrand(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '品牌不存在' });
    }
    res.status(200).json({ success: true, message: '品牌已成功刪除' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '刪除品牌失敗' });
  }
};