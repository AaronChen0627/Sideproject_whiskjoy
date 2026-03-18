import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import NoteView from '@/views/NoteView.vue';
import ResetPassword from '@/views/ResetPassword.vue';
import ProductDetails from '@/views/ProductDetails.vue';
import AboutView from '@/views/AboutView.vue';
import LoginRegister from '@/views/LoginRegister.vue';
import AddProduct from '@/views/AddProduct.vue';
import Addlist from '@/views/Addlist.vue';
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
    path: '/login',
    name: 'login-register',
    component: LoginRegister,
    meta: { requiresAuth: false },
  },
  {
    path: '/create-profile',
    name: 'create-profile',
    component: CreateProfile,
    meta: { requiresAuth: false },
  },
  {
    path: '/update-profile',
    name: 'update-profile',
    component: UpdateProfile,
    meta: { requiresAuth: true }, // 通常更新個人資料需要登入
  },
  {
    path: '/add-product',
    name: 'add-product',
    component: AddProduct,
    meta: { requiresAuth: true },
  },
  {
    path: '/add-list',
    name: 'add-list',
    component: Addlist,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL || '/'),
  routes,
});

/**
 * 路由守衛：統一管理跳轉邏輯
 */
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token');

  // 1. 如果要去登入頁，但已經有 token 了，直接踢回首頁
  if (to.path === '/login' && token) {
    return next({ path: '/' });
  }

  // 2. 如果要去的地方需要權限 (requiresAuth)，但沒有 token，導向登入頁
  if (to.meta.requiresAuth && !token) {
    return next({ path: '/login' });
  }

  // 3. 其餘情況放行
  next();
});

export default router;