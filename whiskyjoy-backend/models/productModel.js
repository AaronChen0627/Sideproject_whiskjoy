const { v4: uuidv4 } = require('uuid');
const db = require("../db");

module.exports = {
  // 1. 取得篩選選單資料
  getFilters: async () => {
    const [countries] = await db.execute(`SELECT country_name_zh FROM countries ORDER BY country_name_zh ASC`);
    const [regions] = await db.execute(`SELECT region_name_zh FROM regions ORDER BY region_name_zh ASC`);
    const [categories] = await db.execute(`SELECT category_name_zh FROM categories ORDER BY category_name_zh ASC`);

    return {
      countries: countries.map(c => c.country_name_zh).filter(Boolean),
      regions: regions.map(r => r.region_name_zh).filter(Boolean),
      categories: categories.map(ca => ca.category_name_zh).filter(Boolean)
    };
  },

  // 2. 取得所有產品
  getAllProducts: async () => {
    const query = `
      SELECT p.id, p.product_name_zh, p.product_name_en, p.product_image_url,
             c.country_name_zh, r.region_name_zh, ca.category_name_zh,
             b.brand_name_zh, b.logo_url AS brand_logo_url
      FROM products p
      LEFT JOIN countries c ON p.country_id = c.id
      LEFT JOIN regions r ON p.region_id = r.id
      LEFT JOIN categories ca ON p.category_id = ca.id
      LEFT JOIN brands b ON p.brand_id = b.id;
    `;
    const [rows] = await db.execute(query);
    return rows;
  },

  // 3. 根據 ID 取得單一產品
  getProductById: async (id) => {
    const query = `
      SELECT p.*, c.country_name_zh, r.region_name_zh, ca.category_name_zh
      FROM products p
      LEFT JOIN countries c ON p.country_id = c.id
      LEFT JOIN regions r ON p.region_id = r.id
      LEFT JOIN categories ca ON p.category_id = ca.id
      WHERE p.id = ?;
    `;
    const [rows] = await db.execute(query, [id]);
    return rows[0] || null;
  },

  // 4. 新增產品
  async insertProduct(productData) {
    const newId = uuidv4();
    const query = `
      INSERT INTO products (id, product_name_zh, product_name_en, product_image_url, country_id, region_id, category_id, brand_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const { product_name_zh, product_name_en, product_image_url, country_id, region_id, category_id, brand_id } = productData;

    await db.execute(query, [
      newId, product_name_zh, product_name_en, product_image_url,
      country_id, region_id || null, category_id, brand_id
    ]);
    return newId;
  },

  // 5. 更新產品
  async updateProduct(id, productData) {
    const query = `
      UPDATE products
      SET product_name_zh = ?, product_name_en = ?, product_image_url = ?, country_id = ?, region_id = ?, category_id = ?, brand_id = ?
      WHERE id = ?
    `;
    const { product_name_zh, product_name_en, product_image_url, country_id, region_id, category_id, brand_id } = productData;
    await db.execute(query, [
      product_name_zh, product_name_en, product_image_url, 
      country_id, region_id || null, category_id, brand_id, id
    ]);
  },

  // 6. 刪除產品
  deleteProduct: async (id) => {
    const query = `DELETE FROM products WHERE id = ?`;
    const [result] = await db.execute(query, [id]);
    return result;
  }
};