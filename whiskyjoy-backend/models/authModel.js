const db = require('../db'); // 你的資料庫 pool 配置
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const AuthModel = {
  // 1. 根據 ID 查找用戶
  async findById(userId) {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
    return rows[0];
  },

  // 2. 根據 email 查找用戶
  async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  // 3. 創建新用戶 (支援 Transaction)
async createUser(email, passwordHash, account, connection) {
  const userUuid = uuidv4();    // 給 users 表用
  const profileUuid = uuidv4(); // 給 user_profiles 表用

  // 1. 寫入 users (不傳 role，讓它用 SQL 的 DEFAULT 'user')
  const userSql = 'INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)';
  await connection.execute(userSql, [userUuid, email, passwordHash]);

  // 2. 寫入 user_profiles (必須傳入三個參數：id, user_id, account)
  const profileSql = 'INSERT INTO user_profiles (id, user_id, account) VALUES (?, ?, ?)';
  await connection.execute(profileSql, [profileUuid, userUuid, account]);

  return userUuid;
},

  // 4. 查找用戶個人資料
  async findUserProfile(userId) {
    const [rows] = await db.execute('SELECT * FROM user_profiles WHERE user_id = ?', [userId]);
    return rows[0];
  },

  // 5. 創建用戶資料 (支援 Transaction)
  async createUserProfile(userId, account, avatar_url = null, connection = db) {
    const profileId = uuidv4(); // Profile 也要一個 UUID
    const query = 'INSERT INTO user_profiles (id, user_id, account, avatar_url) VALUES (?, ?, ?, ?)';
    
    await connection.execute(query, [profileId, userId, account, avatar_url]);
    
    return profileId;
  },

  // 6. 更新用戶資料
  async updateUserProfile(userId, account, avatar_url) {
    const existingProfile = await this.findUserProfile(userId);

    if (!existingProfile) {
      return await this.createUserProfile(userId, account, avatar_url);
    }

    const [result] = await db.execute(
      'UPDATE user_profiles SET account = ?, avatar_url = ? WHERE user_id = ?',
      [account, avatar_url, userId]
    );
    return result.affectedRows;
  },

  // 7. 驗證密碼
  async verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
  },
};

module.exports = AuthModel;