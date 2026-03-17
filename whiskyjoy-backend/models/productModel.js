const { v4: uuidv4 } = require('uuid'); // 1. 引入 UUID
const db = require("../db");

module.exports = {
  // 取得所有產品
  getAllProducts: async () => {
    const query = `
      SELECT 
        p.id, 
        p.product_name_zh, 
        p.product_name_en, 
        p.product_image_url,
        c.country_name_zh,
        c.country_name_en,
        r.region_name_zh,
        r.region_name_en,
        ca.category_name_zh,
        ca.category_name_en,
        b.brand_name_zh,
        b.brand_name_en,
        b.logo_url AS brand_logo_url
      FROM products p
      LEFT JOIN countries c ON p.country_id = c.id
      LEFT JOIN regions r ON p.region_id = r.id
      LEFT JOIN categories ca ON p.category_id = ca.id
      LEFT JOIN brands b ON p.brand_id = b.id;
    `;
    const [rows] = await db.execute(query);
    return rows;
  },

  // 刪除產品
  deleteProduct: async (id) => {
    const query = `DELETE FROM products WHERE id = ?`;
    const [result] = await db.execute(query, [id]);
    return result;
  },

  // 根據 ID 取得單一產品
  getProductById: async (id) => {
    const query = `
      SELECT 
        p.id, 
        p.product_name_zh, 
        p.product_name_en, 
        p.product_image_url,
        c.country_name_zh,
        c.country_name_en,
        r.region_name_zh,
        r.region_name_en,
        ca.category_name_zh,
        ca.category_name_en,
        b.brand_name_zh,
        b.brand_name_en,
        b.logo_url AS brand_logo_url
      FROM products p
      LEFT JOIN countries c ON p.country_id = c.id
      LEFT JOIN regions r ON p.region_id = r.id
      LEFT JOIN categories ca ON p.category_id = ca.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.id = ?;
    `;
    const [rows] = await db.execute(query, [id]);
    return rows[0] || null;
  },

  // 檢查產品是否已存在
  async findProductByName(product_name_zh, product_name_en) {
    const query = `
      SELECT id FROM products
      WHERE product_name_zh = ? OR product_name_en = ?
      LIMIT 1
    `;
    const [results] = await db.execute(query, [product_name_zh, product_name_en]);
    return results[0] || null; // 建議回傳單一物件或 null 較好判斷
  },

  // 根據名稱取得 ID
  async findIdByName(table, nameColumn, name) {
    const query = `SELECT id FROM ${table.toLowerCase()} WHERE ${nameColumn} = ?`;
    const [results] = await db.execute(query, [name]);
    return results.length > 0 ? results[0].id : null;
  },

  // 新增產品 (修正：手動傳入產生的 UUID)
  async insertProduct(productData) {
    const newId = uuidv4(); // 2. 產生 UUID
    const query = `
      INSERT INTO products (
        id, 
        product_name_zh, 
        product_name_en, 
        product_image_url, 
        country_id, 
        region_id, 
        category_id, 
        brand_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const { 
      product_name_zh, 
      product_name_en, 
      product_image_url, 
      country_id, 
      region_id, 
      category_id, 
      brand_id 
    } = productData;

    await db.execute(query, [
      newId, // 3. 將 UUID 放入第一個問號
      product_name_zh,
      product_name_en,
      product_image_url,
      country_id,
      region_id || null,
      category_id,
      brand_id,
    ]);

    return newId; // 4. 回傳產生的 ID 給 Controller
  },

  // 更新產品
  async updateProduct(id, productData) {
    const query = `
      UPDATE products
      SET product_name_zh = ?, product_name_en = ?, product_image_url = ?, country_id = ?, region_id = ?, category_id = ?, brand_id = ?
      WHERE id = ?
    `;
    const { product_name_zh, product_name_en, product_image_url, country_id, region_id, category_id, brand_id } = productData;
    await db.execute(query, [
      product_name_zh,
      product_name_en,
      product_image_url,
      country_id,
      region_id || null,
      category_id,
      brand_id,
      id,
    ]);
  },
};