<template>
  <div class="user-info">
    <div class="avatar-wrapper" @click="toggleDropdown">
      <img
        v-if="user && user.avatar_url"
        :src="user.avatar_url"
        alt="Avatar"
        class="user-avatar"
      />

      <div v-else class="avatar-placeholder">
        {{ userInitial }}
      </div>
    </div>

    <span class="user-account ms-2" v-if="user">{{
      user.account || "User"
    }}</span>

    <transition name="fade">
      <div v-show="dropdownVisible" class="dropdown-custom shadow-lg">
        <div class="dropdown-header">帳戶管理</div>
        <router-link to="/profile" class="dropdown-item">個人資料</router-link>
        <div class="dropdown-divider"></div>
        <button @click="logout" class="dropdown-item logout-text">登出</button>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dropdownVisible: false,
    };
  },
  computed: {
    // 取得用戶帳號的第一個字，若無則顯示 'U'
    userInitial() {
      return this.user?.account
        ? this.user.account.charAt(0).toUpperCase()
        : "U";
    },
  },
  methods: {
    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.user-info {
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
}

/* 頭像外框與發光效果 */
.avatar-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #e2c997; /* 琥珀金邊框 */
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(226, 201, 151, 0.2);
}

.avatar-wrapper:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(226, 201, 151, 0.4);
}

.user-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 沒頭貼時的灰色圓圈樣式 */
.avatar-placeholder {
  width: 100%;
  height: 100%;
  background-color: #444; /* 深灰色背景 */
  color: #e2c997; /* 金色文字 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.user-account {
  color: #e2c997;
  font-weight: 500;
  font-size: 0.9rem;
}

/* 下拉選單美化 (毛玻璃) */
.dropdown-custom {
  position: absolute;
  top: 55px;
  right: 0;
  background: rgba(26, 26, 26, 0.95); /* 深色背景 */
  backdrop-filter: blur(10px);
  border: 1px solid rgba(226, 201, 151, 0.3);
  border-radius: 12px;
  width: 160px;
  padding: 8px 0;
  z-index: 2000;
}

.dropdown-header {
  padding: 8px 16px;
  font-size: 0.75rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 10px 16px;
  color: white;
  text-decoration: none;
  background: none;
  border: none;
  text-align: left;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.dropdown-item:hover {
  background-color: rgba(226, 201, 151, 0.1);
  color: #e2c997;
}

.logout-text {
  color: #ff4d4d; /* 登出文字用紅色稍微警示 */
}

.dropdown-divider {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
  margin: 4px 0;
}

/* 動畫效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
