import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// --- 💡 建立 Axios 實例 ---
const api = axios.create({
  baseURL: '/' 
});

// 請求攔截器
api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

const state = {
  token: sessionStorage.getItem('token') || null,
  user: JSON.parse(sessionStorage.getItem('user')) || null,
  userId: sessionStorage.getItem('token') ? jwtDecode(sessionStorage.getItem('token')).id : null, 
};

const getters = {
  isAuthenticated: (state) => !!state.token,
  user: (state) => state.user,
  currentUser: (state) => state.user,
  // 💡 自動補全路徑的 Getter (這在 Navbar 頭像很有用)
  fullAvatarUrl: (state) => {
    if (!state.user?.avatar_url) return null;
    if (state.user.avatar_url.startsWith('http')) return state.user.avatar_url;
    const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';
    return `${baseUrl}${state.user.avatar_url}`;
  }
};

const actions = {
  // 1. 註冊
  async register(_, { email, password }) {
    try {
      const response = await api.post(`/api/auth/register`, { email, password });
      return response.data.message;
    } catch (error) {
      throw new Error(error.response?.data?.message || '註冊失敗');
    }
  },

  // 2. 登入
  async login({ commit }, { email, password }) {
    try {
      const response = await api.post(`/api/auth/login`, { email, password });
      const data = response.data;
      if (data.token) {
        const decoded = jwtDecode(data.token);
        sessionStorage.setItem('token', data.token);
        commit('setToken', data.token);
        commit('setUserId', decoded.id);
      }
      if (data.user) {
        sessionStorage.setItem('user', JSON.stringify(data.user));
        commit('setUser', data.user);
      }
      return data; 
    } catch (error) {
      throw new Error(error.response?.data?.message || '登入失敗');
    }
  },

  // 💡 3. 新增：獲取用戶最新資料 (解決預先載入問題)
  async getUserInfo({ commit }) {
    try {
      // 對接你剛剛在後端改好的 /userinfo 路由
      const response = await api.get('/api/auth/userinfo');
      
      if (response.data.success) {
        const userData = response.data.user;
        // 更新 Vuex 與 SessionStorage 保持同步
        commit('setUser', userData);
        sessionStorage.setItem('user', JSON.stringify(userData));
        return userData;
      }
    } catch (error) {
      console.error('getUserInfo Error:', error);
      throw error;
    }
  },

  // 4. 登出
  logout({ commit }) {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    commit('clearAuth');
  },

  // 5. 更新用戶資料
  async updateUserProfile({ commit, state }, { account, avatar_url }) {
    try {
      const response = await api.put('/api/auth/profile', { account, avatar_url });
      
      // 更新後的資料
      const updatedUser = {
        ...state.user,
        account,
        avatar_url
      };

      commit('setUser', updatedUser);
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      return response.data.message;
    } catch (error) {
      throw new Error(error.response?.data?.message || '更新資料失敗');
    }
  },
};

const mutations = {
  setToken: (state, token) => state.token = token,
  setUser: (state, user) => state.user = user,
  setUserId: (state, userId) => state.userId = userId,
  clearAuth: (state) => {
    state.token = null;
    state.user = null;
    state.userId = null;
  }
};

export default {
  // 注意：如果你在 store/index.js 是用 modules 引入的，這裡可能需要 namespaced: true
  state,
  getters,
  actions,
  mutations,
};