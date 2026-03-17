const { v4: uuidv4 } = require('uuid'); // 1. 引入 UUID
const pool = require('../db'); 

// 檢查用戶是否對某產品已經評論
const checkCommentExists = async (userId, productId) => {
  const query = 'SELECT id FROM comments WHERE user_id = ? AND product_id = ? LIMIT 1'; // 只拿 id 且 limit 1 效能較佳
  const [rows] = await pool.query(query, [userId, productId]);
  return rows.length > 0;
};

// 創立新評論 (改由 JS 端產生 ID)
const createComment = async (userId, productId, comment) => {
  const newId = uuidv4(); // 2. 產生 UUID
  const query = 'INSERT INTO comments (id, user_id, product_id, comment) VALUES (?, ?, ?, ?)';
  const [result] = await pool.query(query, [newId, userId, productId, comment]);
  
  // 建議回傳包含 ID 的資訊，方便前端立刻顯示新評論
  return { id: newId, ...result };
};

const getCommentsByProductFromDb = async (productId) => {
  try {
    const query = `
      SELECT 
        c.id,
        c.user_id,
        c.product_id,
        c.comment,
        c.created_at,
        c.updated_at,
        up.account,
        up.avatar_url
      FROM 
        comments c
      JOIN 
        user_profiles up ON c.user_id = up.user_id
      WHERE 
        c.product_id = ?
      ORDER BY c.created_at DESC; -- 3. 通常評論要由新到舊排序
    `;
    const [rows] = await pool.query(query, [productId]);
    return rows;
  } catch (error) {
    console.error('Database Error:', error); // 印出實際錯誤方便你除錯
    throw new Error('資料庫查詢失敗');
  }
};

// 更新評論
const updateCommentInDb = async (commentId, userId, comment) => {
  const query = 'UPDATE comments SET comment = ? WHERE id = ? AND user_id = ?';
  const [result] = await pool.query(query, [comment, commentId, userId]);
  return result;
};

// 刪除評論
const deleteCommentInDb = async (commentId, userId) => {
  const query = 'DELETE FROM comments WHERE id = ? AND user_id = ?';
  const [result] = await pool.query(query, [commentId, userId]);
  return result;
};

module.exports = {
  checkCommentExists,
  createComment,
  getCommentsByProductFromDb,
  updateCommentInDb,
  deleteCommentInDb,
};