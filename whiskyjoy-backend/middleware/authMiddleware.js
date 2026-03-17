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

module.exports = { authenticateUser };