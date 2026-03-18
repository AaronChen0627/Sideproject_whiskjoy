const brandModel = require('../models/brandModel');

// 1. 創建品牌
exports.createBrand = async (req, res) => {
  const { brand_name_zh, brand_name_en, logo_url } = req.body;

  try {
    // 基本驗證
    if (!brand_name_zh || !brand_name_en) {
      return res.status(400).json({ success: false, message: '中英文名稱皆為必填' });
    }

    // 檢查名稱是否已存在 (傳入 null 作為 excludeId)
    const exists = await brandModel.checkBrandExists(brand_name_zh, brand_name_en);
    if (exists) {
      return res.status(409).json({ success: false, message: '此品牌名稱（中或英）已存在' });
    }

    // 呼叫 Model 創建資料 (注意參數傳遞)
    const result = await brandModel.createBrand(brand_name_zh, brand_name_en, logo_url);

    res.status(201).json({
      success: true,
      message: '品牌創建成功',
      data: { id: result.id, brand_name_zh, brand_name_en, logo_url }
    });
  } catch (error) {
    console.error('Create Brand Error:', error);
    res.status(500).json({ success: false, message: '無法創建品牌', error: error.message });
  }
};

// 2. 取得所有品牌
exports.getAllBrands = async (req, res) => {
  try {
    const brands = await brandModel.getAllBrands();
    res.status(200).json({ success: true, data: brands });
  } catch (error) {
    console.error('Get All Brands Error:', error);
    res.status(500).json({ success: false, message: '無法獲取品牌列表' });
  }
};

// 3. 取得單一品牌
exports.getBrandById = async (req, res) => {
  try {
    const brand = await brandModel.getBrandById(req.params.id);
    if (!brand) {
      return res.status(404).json({ success: false, message: '找不到該品牌' });
    }
    res.status(200).json({ success: true, data: brand });
  } catch (error) {
    console.error('Get Brand Error:', error);
    res.status(500).json({ success: false, message: '獲取品牌失敗' });
  }
};

// 4. 更新品牌
exports.updateBrand = async (req, res) => {
  const { id } = req.params;
  const { brand_name_zh, brand_name_en, logo_url } = req.body;

  try {
    const exists = await brandModel.checkBrandExists(brand_name_zh, brand_name_en, id);
    if (exists) {
      return res.status(409).json({ success: false, message: '更新失敗：品牌名稱已衝突' });
    }

    const result = await brandModel.updateBrand(id, brand_name_zh, brand_name_en, logo_url);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: '品牌不存在或資料未變動' });
    }

    res.status(200).json({ success: true, message: '品牌已成功更新' });
  } catch (error) {
    console.error('Update Brand Error:', error);
    res.status(500).json({ success: false, message: '更新品牌失敗' });
  }
};

// 5. 刪除品牌
exports.deleteBrand = async (req, res) => {
  try {
    const result = await brandModel.deleteBrand(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: '品牌不存在' });
    }
    res.status(200).json({ success: true, message: '品牌已成功刪除' });
  } catch (error) {
    console.error('Delete Brand Error:', error);
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ success: false, message: '刪除失敗：該品牌下仍有產品關聯' });
    }
    res.status(500).json({ success: false, message: '刪除品牌失敗' });
  }
};