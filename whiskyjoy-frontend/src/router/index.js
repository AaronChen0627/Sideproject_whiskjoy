import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import NoteView from '@/views/NoteView.vue';
import ResetPassword from '@/views/ResetPassword.vue';
import ProductDetails from '@/views/ProductDetails.vue';
import AboutView from '@/views/AboutView.vue';
import LoginRegister from '@/views/LoginRegister.vue';
import AddProduct from '@/views/AddProduct.vue'; // 新增 AddProduct 頁面
import Addlist from '@/views/Addlist.vue'
import CreateProfile from '@/views/CreateProfile.vue';
import UpdateProfile from '@/views/UpdateProfile.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/note',
    name: 'note',
    component: NoteView,
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
  },
  {
    path: '/auth/reset-password/:token',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: { requiresAuth: false },
  },
  {
    path: '/product/:productName',
    name: 'ProductDetails',
    component: ProductDetails,
    props: true,
  },
  {
    path: '/login', // 新增 LoginRegister 的路由
    name: 'login-register',
    component: LoginRegister,
    meta: { requiresAuth: false }, // 不需要认证
  },
  {
    path: '/create-profile', // 新增的路由
    name: 'create-profile',
    component: CreateProfile, // 綁定 CreateProfile 頁面
    meta: { requiresAuth: false }, // 不需要身份驗證
  },
    {
    path: '/update-profile', // 新增的路由
    name: 'update-profile',
    component: UpdateProfile, // 綁定 CreateProfile 頁面
    meta: { requiresAuth: false }, // 不需要身份驗證
  },
  {
    path: '/add-product', // 新增 AddProduct 路由
    name: 'add-product',
    component: AddProduct, // 綁定 AddProduct 頁面
    meta: { requiresAuth: true }, // 需要身份驗證
  },
  {
    path: '/add-list', 
    name: 'add-list',
    component: Addlist, 
    meta: { requiresAuth: true }, // 需要身份驗證
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL || '/'),
  routes,
});

// 路由守衛，檢查是否需要認證
router.beforeEach((to, from, next) => {
  // 💡 修正：對齊 Vuex 存入的名稱 "token"
  const token = sessionStorage.getItem('token'); 
  
  if (to.meta.requiresAuth && !token) {
    // 如果該頁面需要權限但沒有 token，導向登入
    next('/login');
  } else {
    // 允許通過
    next();
  }
});

export default router;
