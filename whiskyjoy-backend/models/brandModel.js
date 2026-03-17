const db = require('../db');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  // 檢查品牌是否存在 (修正為小寫 brands)
  checkBrandExists: async (brand_name_zh, brand_name_en) => {
    const query = `
      SELECT id FROM brands 
      WHERE brand_name_zh = ? OR brand_name_en = ?
      LIMIT 1
    `;
    const [rows] = await db.execute(query, [brand_name_zh, brand_name_en]);
    return rows.length > 0;
  },

  // 創建品牌 (內部直接產生 ID 並回傳)
  createBrand: async (brand_name_zh, brand_name_en, logo_url) => {
    const newId = uuidv4(); // 在內部產生 UUID
    const query = `
      INSERT INTO brands (id, brand_name_zh, brand_name_en, logo_url)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [newId, brand_name_zh, brand_name_en, logo_url]);
    
    // 回傳產生的 ID，這樣 Controller 才能拿到 ID 傳給前端
    return { id: newId, ...result };
  },

  // 獲取所有品牌
  getAllBrands: async () => {
    const query = 'SELECT * FROM brands';
    const [results] = await db.execute(query);
    return results;
  },

  // 獲取單個品牌
  getBrandById: async (id) => {
    const query = 'SELECT * FROM brands WHERE id = ?';
    const [results] = await db.execute(query, [id]);
    if (results.length === 0) {
      return null; // 建議回傳 null，讓 Controller 決定怎麼處理 Error
    }
    return results[0];
  },

  // 更新品牌
  updateBrand: async (id, brand_name_zh, brand_name_en, logo_url) => {
    const query = `
      UPDATE brands 
      SET brand_name_zh = ?, brand_name_en = ?, logo_url = ?
      WHERE id = ?
    `;
    const [result] = await db.execute(query, [brand_name_zh, brand_name_en, logo_url, id]);
    return result;
  },

  // 刪除品牌
  deleteBrand: async (id) => {
    const query = 'DELETE FROM brands WHERE id = ?';
    const [result] = await db.execute(query, [id]);
    return result;
  },
};