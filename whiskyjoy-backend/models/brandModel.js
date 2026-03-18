const db = require('../db');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  /**
   * 檢查品牌是否存在
   * @param {string} zh - 中文名
   * @param {string} en - 英文名
   * @param {string|null} excludeId - 排除特定 ID (用於更新時的重複檢查)
   */
  checkBrandExists: async (zh, en, excludeId = null) => {
    let query = `
      SELECT id FROM brands 
      WHERE (brand_name_zh = ? OR brand_name_en = ?)
    `;
    const params = [zh, en];

    if (excludeId) {
      query += ` AND id != ? `;
      params.push(excludeId);
    }

    const [rows] = await db.execute(query + ' LIMIT 1', params);
    return rows.length > 0;
  },

// models/brandModel.js

createBrand: async (brand_name_zh, brand_name_en, logo_url) => {
  const newId = uuidv4();
  const query = `
    INSERT INTO brands (id, brand_name_zh, brand_name_en, logo_url)
    VALUES (?, ?, ?, ?)
  `;
  // 強制將 undefined 轉為 null，防止 mysql2 報錯
  const [result] = await db.execute(query, [
    newId, 
    brand_name_zh ?? null, 
    brand_name_en ?? null, 
    logo_url ?? null
  ]);
  return { id: newId, affectedRows: result.affectedRows };
},

updateBrand: async (id, brand_name_zh, brand_name_en, logo_url) => {
  const query = `
    UPDATE brands 
    SET 
      brand_name_zh = COALESCE(?, brand_name_zh), 
      brand_name_en = COALESCE(?, brand_name_en), 
      logo_url = COALESCE(?, logo_url)
    WHERE id = ?
  `;
  // 這裡也要補上 ?? null，確保 COALESCE 能正確運作
  const [result] = await db.execute(query, [
    brand_name_zh ?? null, 
    brand_name_en ?? null, 
    logo_url ?? null, 
    id
  ]);
  return result;
},

  getAllBrands: async () => {
    // 優化：明確指定欄位，並按照中文名稱排序，提升後台易讀性
    const query = `
      SELECT id, brand_name_zh, brand_name_en, logo_url 
      FROM brands 
      ORDER BY brand_name_zh ASC
    `;
    const [results] = await db.execute(query);
    return results;
  },

  getBrandById: async (id) => {
    const query = 'SELECT id, brand_name_zh, brand_name_en, logo_url FROM brands WHERE id = ?';
    const [results] = await db.execute(query, [id]);
    return results.length > 0 ? results[0] : null;
  },

  updateBrand: async (id, brand_name_zh, brand_name_en, logo_url) => {
    // 優化：使用 COALESCE 確保如果傳入 null/undefined 時保留原值，或者使用動態 SQL
    const query = `
      UPDATE brands 
      SET 
        brand_name_zh = COALESCE(?, brand_name_zh), 
        brand_name_en = COALESCE(?, brand_name_en), 
        logo_url = COALESCE(?, logo_url)
      WHERE id = ?
    `;
    const [result] = await db.execute(query, [brand_name_zh, brand_name_en, logo_url, id]);
    return result;
  },

  deleteBrand: async (id) => {
    // 這裡維持原樣，但 Controller 端建議用 try-catch 處理 foreign key constraint 報錯
    const query = 'DELETE FROM brands WHERE id = ?';
    const [result] = await db.execute(query, [id]);
    return result;
  },
};