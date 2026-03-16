import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios';

import 'normalize.css/normalize.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// --- 自動偵測 IP 並設定後端位址 ---
// 獲取目前瀏覽器網址列的 hostname (例如: 161.153.10.15 或 localhost)
const currentHost = window.location.hostname;

// 動態設定：如果你目前在開發環境且 hostname 是 localhost，連向 3000
// 如果是在 Oracle Cloud，currentHost 會自動變成 161.153.10.15
axios.defaults.baseURL = `http://${currentHost}:3000/`;
axios.defaults.timeout = 10000; 

// --------------------------------

// 請求攔截器：自動附加 token 到請求頭
axios.interceptors.request.use(
    config => {
      const token = store.getters['user/getToken'];
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

const app = createApp(App);

// 註冊 axios 為全域屬性
app.config.globalProperties.$axios = axios;

app.use(store)
   .use(router)
   .mount('#app');