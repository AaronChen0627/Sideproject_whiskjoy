const categoryModel = require('../models/categoryModel');

// 1. 創建分類
exports.createCategory = async (req, res) => {
  const { category_name_zh, category_name_en } = req.body;

  try {
    if (!category_name_zh || !category_name_en) {
      return res.status(400).json({ success: false, message: '中英文名稱皆為必填' });
    }

    const exists = await categoryModel.checkCategoryExists(category_name_zh, category_name_en);
    if (exists) {
      return res.status(409).json({ success: false, message: '此分類名稱已存在' });
    }

    const result = await categoryModel.createCategory(category_name_zh, category_name_en);

    res.status(201).json({
      success: true,
      message: '分類創建成功',
      data: { id: result.id, category_name_zh, category_name_en }
    });
  } catch (error) {
    console.error('Create Category Error:', error);
    res.status(500).json({ success: false, message: '無法創建分類' });
  }
};

// 2. 取得所有分類
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.getAllCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: '獲取分類清單失敗' });
  }
};

// 3. 更新分類
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { category_name_zh, category_name_en } = req.body;

  try {
    const exists = await categoryModel.checkCategoryExists(category_name_zh, category_name_en, id);
    if (exists) {
      return res.status(409).json({ success: false, message: '更新衝突：分類名稱已存在' });
    }

    const result = await categoryModel.updateCategory(id, category_name_zh, category_name_en);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: '找不到該分類' });
    }

    res.status(200).json({ success: true, message: '分類更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '更新分類失敗' });
  }
};

// 4. 刪除分類
exports.deleteCategory = async (req, res) => {
  try {
    await categoryModel.deleteCategory(req.params.id);
    res.status(200).json({ success: true, message: '分類已成功刪除' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ success: false, message: '刪除失敗：已有產品屬於此分類' });
    }
    res.status(500).json({ success: false, message: '刪除分類失敗' });
  }
};