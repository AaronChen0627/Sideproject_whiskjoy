const db = require('../db');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  // --- 國家部分 (Countries) ---
  
  checkCountryExists: async (zh, en, excludeId = null) => {
    let query = `SELECT id FROM countries WHERE (country_name_zh = ? OR country_name_en = ?)`;
    const params = [zh, en];
    if (excludeId) {
      query += ` AND id != ? `;
      params.push(excludeId);
    }
    const [rows] = await db.execute(query + ' LIMIT 1', params);
    return rows.length > 0;
  },

  createCountry: async (zh, en) => {
    const newId = uuidv4();
    const query = `INSERT INTO countries (id, country_name_zh, country_name_en) VALUES (?, ?, ?)`;
    await db.execute(query, [newId, zh, en]);
    return { id: newId };
  },

  getAllCountries: async () => {
    // 獲取國家清單
    const query = `SELECT * FROM countries ORDER BY country_name_zh ASC`;
    const [results] = await db.execute(query);
    return results;
  },

  // 進階：獲取所有國家及其底下的區域 (Left Join)
  getCountriesWithRegions: async () => {
    const query = `
      SELECT 
        c.id as country_id, c.country_name_zh, c.country_name_en,
        r.id as region_id, r.region_name_zh, r.region_name_en
      FROM countries c
      LEFT JOIN regions r ON c.id = r.country_id
      ORDER BY c.country_name_zh, r.region_name_zh
    `;
    const [results] = await db.execute(query);
    return results;
  },

  // --- 區域部分 (Regions) ---

  createRegion: async (country_id, zh, en) => {
    const newId = uuidv4();
    const query = `INSERT INTO regions (id, country_id, region_name_zh, region_name_en) VALUES (?, ?, ?, ?)`;
    await db.execute(query, [newId, country_id, zh, en]);
    return { id: newId };
  },

  getRegionsByCountry: async (country_id) => {
    const query = `SELECT * FROM regions WHERE country_id = ? ORDER BY region_name_zh ASC`;
    const [results] = await db.execute(query, [country_id]);
    return results;
  },

  deleteCountry: async (id) => {
    // 註：SQL 有 ON DELETE CASCADE，所以刪除國家會自動刪除相關區域
    const [result] = await db.execute('DELETE FROM countries WHERE id = ?', [id]);
    return result;
  }
};