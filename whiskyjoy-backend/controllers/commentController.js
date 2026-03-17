const {
  checkCommentExists,
  createComment,
  getCommentsByProductFromDb,
  updateCommentInDb,
  deleteCommentInDb,
} = require('../models/commentModel');

/**
 * 新增評論
 * 邏輯：檢查重複 -> 產生 UUID (於 Model) -> 存入資料庫
 */
const addComment = async (req, res) => {
  const { productId, comment } = req.body;
  const userId = req.user.id; // 從 authMiddleware 取得

  try {
    // 1. 檢查是否已經評論過（避免觸發 Unique Key 錯誤）
    const commentExists = await checkCommentExists(userId, productId);
    if (commentExists) {
      return res.status(400).json({ message: '您已經對該產品發表過評論' });
    }

    // 2. 創建評論 (Model 會回傳包含 id 的物件)
    const result = await createComment(userId, productId, comment);
    
    res.status(201).json({ 
      success: true,
      message: '評論創建成功', 
      commentId: result.id // 回傳新產生的 UUID
    });
  } catch (error) {
    console.error('創建評論失敗:', error);
    res.status(500).json({ message: '無法創建評論' });
  }
};

/**
 * 獲取特定產品的所有評論
 */
const getCommentsByProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const comments = await getCommentsByProductFromDb(productId);
    
    // 統一回傳格式，即使空陣列也回傳 200
    res.status(200).json({ 
      success: true,
      comments: comments || [] 
    });
  } catch (error) {
    console.error('獲取產品評論時出錯:', error);
    res.status(500).json({ message: '無法獲取產品評論' });
  }
};

/**
 * 更新評論
 */
const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { comment } = req.body;
  const userId = req.user.id;

  try {
    const result = await updateCommentInDb(commentId, userId, comment);
    
    // affectedRows 為 0 代表 ID 不存在，或該評論不屬於目前登入用戶
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '找不到該評論，或者您無權更新' });
    }
    
    res.status(200).json({ success: true, message: '評論更新成功' });
  } catch (error) {
    console.error('更新評論時出錯:', error);
    res.status(500).json({ message: '無法更新評論' });
  }
};

/**
 * 刪除評論
 */
const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  try {
    const result = await deleteCommentInDb(commentId, userId);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '找不到該評論，或者您無權刪除' });
    }
    
    res.status(200).json({ success: true, message: '評論刪除成功' });
  } catch (error) {
    console.error('刪除評論時出錯:', error);
    res.status(500).json({ message: '無法刪除評論' });
  }
};

module.exports = {
  addComment,
  getCommentsByProduct,
  updateComment,
  deleteComment,
};