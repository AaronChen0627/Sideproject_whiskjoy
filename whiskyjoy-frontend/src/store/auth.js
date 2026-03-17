import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// --- 💡 建立 Axios 實例並配置攔截器 ---
const api = axios.create({
  // 在開發環境(8080)會透過 vue.config.js 代理，生產環境則直接發送
  baseURL: '/' 
});

// 請求攔截器：每次發送 API 前自動塞入 Token
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
  currentUser: (state) => state.user,
  // 💡 方便前端補全圖片路徑的 Getter
  fullAvatarUrl: (state) => {
    if (!state.user?.avatar_url) return null;
    if (state.user.avatar_url.startsWith('http')) return state.user.avatar_url;
    // 開發環境補上 3000 埠，生產環境(Nginx)則不用
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
      const { token, user } = response.data;

      if (token) {
        const decoded = jwtDecode(token);
        sessionStorage.setItem('token', token);
        commit('setToken', token);
        commit('setUserId', decoded.id);
      }
      if (user) {
        sessionStorage.setItem('user', JSON.stringify(user));
        commit('setUser', user);
      }
      return response.data.message;
    } catch (error) {
      throw new Error(error.response?.data?.message || '登入失敗');
    }
  },

  // 3. 登出
  logout({ commit }) {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    commit('clearAuth');
  },

  // 4. 更新用戶資料
  async updateUserProfile({ commit, state }, { account, avatar_url }) {
    try {
      // 使用配置了攔截器的 api 實例，會自動帶上 Authorization Header
      const response = await api.put('/api/auth/profile', { account, avatar_url });
      
      const updatedUser = {
        ...state.user,
        account,
        avatar_url
      };

      commit('setUser', updatedUser);
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      return response.data.message;
    } catch (error) {
      // 💡 如果報「未提供認證標記」，會在這裡被捕獲
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
  state,
  getters,
  actions,
  mutations,
};