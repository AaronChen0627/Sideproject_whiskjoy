const db = require('../db');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  // 檢查分類是否存在 (支援排除 ID 用於更新)
  checkCategoryExists: async (zh, en, excludeId = null) => {
    let query = `SELECT id FROM categories WHERE (category_name_zh = ? OR category_name_en = ?)`;
    const params = [zh, en];
    if (excludeId) {
      query += ` AND id != ? `;
      params.push(excludeId);
    }
    const [rows] = await db.execute(query + ' LIMIT 1', params);
    return rows.length > 0;
  },

  createCategory: async (category_name_zh, category_name_en) => {
    const newId = uuidv4();
    const query = `INSERT INTO categories (id, category_name_zh, category_name_en) VALUES (?, ?, ?)`;
    const [result] = await db.execute(query, [newId, category_name_zh, category_name_en]);
    return { id: newId, affectedRows: result.affectedRows };
  },

  getAllCategories: async () => {
    const query = `SELECT id, category_name_zh, category_name_en FROM categories ORDER BY category_name_zh ASC`;
    const [results] = await db.execute(query);
    return results;
  },

  updateCategory: async (id, category_name_zh, category_name_en) => {
    const query = `
      UPDATE categories 
      SET category_name_zh = COALESCE(?, category_name_zh), 
          category_name_en = COALESCE(?, category_name_en)
      WHERE id = ?
    `;
    const [result] = await db.execute(query, [category_name_zh, category_name_en, id]);
    return result;
  },

  deleteCategory: async (id) => {
    const [result] = await db.execute('DELETE FROM categories WHERE id = ?', [id]);
    return result;
  }
};