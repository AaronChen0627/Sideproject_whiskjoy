import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // 解析 token 的函數

const state = {
  token: sessionStorage.getItem('token') || null,
  user: JSON.parse(sessionStorage.getItem('user')) || null,
  userId: null, 
};

const getters = {
  isAuthenticated: (state) => !!state.token,
  token: (state) => state.token,
  user: (state) => state.user,
  userId: (state) => state.userId,
  currentUser: (state) => state.user,
  getUser: (state) => state.user,
};

const actions = {
// 註冊動作
  async register({ commit }, { email, password }) {
    try {
      // 1. 確保路徑正確
      const response = await axios.post(`/api/register`, { email, password });
      
      // 2. 拿到資料後先做基礎檢查
      const data = response.data;
      const token = data.token;

      if (token) {
        try {
          const decoded = jwtDecode(token);
          const userId = decoded.userId;
          commit('setToken', token);
          commit('setUserId', userId);
          sessionStorage.setItem('token', token);
        } catch (decodeError) {
          console.error("Token 解析失敗，但註冊可能已成功:", decodeError);
        }
      }

      // 3. 儲存用戶資料 (確保 data.user 存在)
      if (data.user) {
        commit('setUser', data.user);
        sessionStorage.setItem('user', JSON.stringify(data.user));
      }

      // 4. 回傳後端的成功訊息 (例如: "註冊成功")
      return data.message || "註冊成功";

    } catch (error) {
      // 這裡抓取後端回傳的 400/500 錯誤訊息
      const errorMsg = error.response?.data?.message || error.response?.data || '註冊出錯，請稍後再試';
      console.error('註冊 Action 捕捉錯誤:', errorMsg);
      throw new Error(errorMsg);
    }
  },

  // 登入動作 (同步優化結構)
  async login({ commit }, { email, password }) {
    try {
      const response = await axios.post(`/api/login`, { email, password });
      const data = response.data;
      const token = data.token;

      if (token) {
        const decoded = jwtDecode(token);
        commit('setToken', token);
        commit('setUserId', decoded.userId);
        sessionStorage.setItem('token', token);
      }

      if (data.user) {
        commit('setUser', data.user);
        sessionStorage.setItem('user', JSON.stringify(data.user));
      }

      return data.message || "登入成功";
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data || '登入出錯，請稍後再試';
      throw new Error(errorMsg);
    }
  },

  // 登出動作
  logout({ commit }) {
    commit('clearToken');
    commit('clearUser');
    commit('clearUserId');  // 清除 userId
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  },

  // 更新用戶資料
  async updateUserProfile({ commit }, { account, avatar_url }) {
    try {
      const token = sessionStorage.getItem('token');
      console.log("Updating user profile with:", { account, avatar_url });

      const response = await axios.put(
        `api/user/profile`, 
        { account, avatar_url },
        {
          headers: {
            'Authorization': `Bearer ${token}`, // 強制帶入最新 Token
            Authorization: `Bearer ${token}`, // 使用 Bearer Token 進行認證
          },
        }
      );
      
      // 更新成功後，更新 store 中的用戶資料
      commit('setUser', response.data);
      sessionStorage.setItem('user', JSON.stringify(response.data)); // 儲存更新後的資料

      return response.data.message;
    } catch (error) {
      console.error("Profile update failed:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || '更新資料失敗');
    }
  },
};

const mutations = {
  setToken: (state, token) => {
    state.token = token;
  },
  setUser: (state, user) => {
    state.user = user;
  },
  setUserId: (state, userId) => {
    state.userId = userId;  // 儲存 userId
  },
  clearToken: (state) => {
    state.token = null;
  },
  clearUser: (state) => {
    state.user = null;
  },
  clearUserId: (state) => {
    state.userId = null;  // 清除 userId
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
