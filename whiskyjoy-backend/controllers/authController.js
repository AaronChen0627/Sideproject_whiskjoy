const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const AuthModel = require('../models/authModel');
const db = require('../db'); // 引入 db 以支援 Transaction

// JWT 密鑰
const JWT_SECRET = process.env.JWT_SECRET;

// 1. 註冊用戶 (整合 Transaction)
exports.register = async (req, res) => {
  const { email, password, account } = req.body; // 建議註冊時就讓使用者填 account

  const connection = await db.getConnection(); // 取得連線以開啟事務
  try {
    await connection.beginTransaction();

    // 檢查用戶是否已經註冊
    const existingUser = await AuthModel.findByEmail(email);
    if (existingUser) {
      await connection.rollback();
      return res.status(400).json({ message: '此信箱已經註冊過了' });
    }

    // 密碼加密
    const passwordHash = await bcrypt.hash(password, 10);

    // 創建新用戶 (Model 內部會產生 UUID 並建立 Profile)
    const defaultAccount = account || null
    await AuthModel.createUser(email, passwordHash, defaultAccount, connection);

    await connection.commit();
    res.status(201).json({ success: true, message: '註冊成功，請登入' });
  } catch (error) {
    await connection.rollback();
    console.error('Register Error:', error);
    res.status(500).json({ message: '伺服器錯誤，請稍後再試' });
  } finally {
    connection.release();
  }
};

// 2. 登入用戶
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

    // --- 重點修正：Payload 欄位名稱要跟 Middleware 對齊 ---
    // 我們統一使用 id 而非 userId
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      JWT_SECRET,
      { expiresIn: '24h' } // 建議開發時設長一點
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
        : '登入成功，開始你的威士忌筆記吧！'
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 3. 更新用戶個人資料
exports.updateProfile = async (req, res) => {
  const { account, avatar_url } = req.body;
  const userId = req.user?.id; // 💡 建議加個 ? 防止 req.user 為空

  try {
    if (!account) {
      return res.status(400).json({ message: '帳號名稱不能為空' });
    }

    if (!userId) {
      return res.status(401).json({ message: '未經授權的請求' });
    }

    // 執行更新
    await AuthModel.updateUserProfile(userId, account, avatar_url);

    // 💡 只要上面沒 throw error，就代表 SQL 執行成功
    res.status(200).json({ 
      success: true, 
      message: '資料更新成功',
      data: { account, avatar_url } 
    });

  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: '伺服器更新失敗：' + error.message });
  }
};
// 4. 處理圖片上傳後的邏輯 (使用 fs 取代 Sharp)
exports.handleUpload = async (req, res) => {
  try {
    // 檢查 Multer 是否有攔截到檔案
    if (!req.file) {
      return res.status(400).json({ success: false, message: '請上傳檔案' });
    }

    // 1. 定義儲存目錄
    const uploadDir = path.join(__dirname, '../public/uploads/avatars');
    console.log('實體路徑為:', uploadDir); // 看看這行印出來的路徑在 Docker 裡對不對
    // 2. 確保資料夾存在
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 3. 產生新的檔名 (因為 memoryStorage 沒有 filename，我們要自己產生)
    const ext = path.extname(req.file.originalname); 
    const fileName = `avatar-${Date.now()}${ext}`;
    const fullPath = path.join(uploadDir, fileName);

    // 4. ✅ 關鍵：直接將記憶體中的 Buffer 寫入檔案系統
    await fs.promises.writeFile(fullPath, req.file.buffer);

    // 5. 回傳 URL
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