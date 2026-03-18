const jwt = require('jsonwebtoken');
const AuthModel = require('../models/authModel');

/**
 * 驗證用戶身份的中間件
 */
const authenticateUser = async (req, res, next) => {
  // 1. 取得標頭並檢查格式
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '未提供認證標記 (Token)' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2. 解碼 Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 對應 Login 時產生的 Payload { id: user.id, ... }
    const userId = decoded.id; 

    if (!userId) {
      return res.status(401).json({ message: 'Token 資訊無效' });
    }

    // 3. 查找用戶確保用戶確實存在於資料庫 (使用了 await，所以上面必須是 async)
    const user = await AuthModel.findById(userId); 

    if (!user) {
      return res.status(401).json({ message: '用戶不存在或已被刪除' });
    }

    // 4. 將用戶資料附加到 req 物件中
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next(); 
  } catch (error) {
    console.error('Authentication Error:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: '認證已過期，請重新登入' });
    }
    
    return res.status(401).json({ message: '認證無效' });
  }
};
const isAdmin = (req, res, next) => {
  // 檢查 req.user 是否存在（確保已經過 authenticateUser）
  // 檢查 role 是否為 'admin' (對應你 SQL Schema 的 enum)
  if (req.user && req.user.role === 'admin') {
    return next(); // 是管理員，放行
  }

  // 若不是管理員，回傳 403 Forbidden
  return res.status(403).json({ 
    success: false, 
    message: '權限不足，此操作僅限管理員執行' 
  });
};
module.exports = { 
  authenticateUser, 
  isAdmin 
};