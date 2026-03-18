const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const AuthModel = require('../models/authModel');
const db = require('../db'); 

// JWT 密鑰
const JWT_SECRET = process.env.JWT_SECRET;

exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.id; // 從 Token 解析出來的 ID
    if (!userId) return res.status(401).json({ success: false, message: '未授權' });

    // 這裡去 Model 撈取最新的 Profile 
    const profile = await AuthModel.findUserProfile(userId);

    if (!profile) {
      return res.status(404).json({ success: false, message: '找不到 Profile' });
    }

    res.json({
      success: true,
      user: {
        account: profile.account,
        avatar_url: profile.avatar_url
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '伺服器錯誤' });
  }
};

/**
 * 1. 註冊用戶 (整合 Transaction)
 */
exports.register = async (req, res) => {
  const { email, password, account } = req.body;

  const connection = await db.getConnection(); 
  try {
    await connection.beginTransaction();

    const existingUser = await AuthModel.findByEmail(email);
    if (existingUser) {
      await connection.rollback();
      return res.status(400).json({ message: '此信箱已經註冊過了' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const defaultAccount = account || null;
    
    // 建立 User 與 Profile
    await AuthModel.createUser(email, passwordHash, defaultAccount, connection);

    await connection.commit();
    res.status(201).json({ success: true, message: '註冊成功，請登入' });
  } catch (error) {
    await connection.rollback();
    console.error('Register Error:', error);
    res.status(500).json({ message: '伺服器錯誤' });
  } finally {
    connection.release();
  }
};

/**
 * 2. 登入用戶
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await AuthModel.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: '信箱或密碼錯誤' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: '信箱或密碼錯誤' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const profile = await AuthModel.findUserProfile(user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        account: profile ? profile.account : '新用戶',
        avatar_url: profile ? profile.avatar_url : null
      },
      message: user.role === 'admin' 
        ? '歡迎回來，管理員！' 
        : '登入成功'
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

/**
 * 3. 更新用戶個人資料
 */
exports.updateProfile = async (req, res) => {
  const { account, avatar_url } = req.body;
  const userId = req.user?.id;

  try {
    if (!account) {
      return res.status(400).json({ message: '帳號名稱不能為空' });
    }

    if (!userId) {
      return res.status(401).json({ message: '未經授權' });
    }

    // 更新 Profile 表
    await AuthModel.updateUserProfile(userId, account, avatar_url);

    res.status(200).json({ 
      success: true, 
      message: '資料更新成功',
      data: { account, avatar_url } 
    });

  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: '伺服器更新失敗' });
  }
};

/**
 * 4. 處理圖片上傳
 */
exports.handleUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: '請上傳檔案' });
    }

    const uploadDir = path.join(__dirname, '../public/uploads/avatars');
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const ext = path.extname(req.file.originalname); 
    const fileName = `avatar-${Date.now()}${ext}`;
    const fullPath = path.join(uploadDir, fileName);

    await fs.promises.writeFile(fullPath, req.file.buffer);

    const fileUrl = `/uploads/avatars/${fileName}`;

    res.status(200).json({
      success: true,
      message: '圖片上傳成功！',
      url: fileUrl
    });
  } catch (error) {
    console.error('Upload Controller Error:', error);
    res.status(500).json({ success: false, message: '伺服器處理圖片失敗' });
  }
};