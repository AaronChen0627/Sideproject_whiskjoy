<template>
  <div class="banner-container">
    <video
      class="banner-video"
      autoplay
      loop
      muted
      playsinline
      ref="bannerVideo"
    >
      <source src="@/assets/Banner-video.webm" type="video/webm" />
    </video>

    <div class="banner-overlay">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-md-10 col-lg-8 text-center">
            <h1 class="whisky-title">WHISKY JOY</h1>
            <p class="whisky-subtitle">enjoy & share your note</p>

            <router-link :to="startLink">
              <button class="btn whisky-btn mt-4">
                <span class="btn-text">{{
                  isAuthenticated ? "Write Now" : "Start Discovery"
                }}</span>
                <i class="bi bi-compass ms-2"></i>
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Banner",
  computed: {
    // 1. 從 Vuex 引入登入狀態
    // 假設你的 store 裡有個 getter 叫 isAuthenticated
    ...mapGetters(["isAuthenticated"]),

    // 2. 根據登入狀態決定導向哪裡
    startLink() {
      // 如果已登入，導向產品清單頁面 (例如 /note)
      // 如果未登入，則導向登入頁面
      return this.isAuthenticated ? "/note" : "/login";
    },
  },
};
</script>

<style scoped>
/* --- 容器與背景影片 --- */
.banner-container {
  position: relative;
  width: 100%;
  height: 100vh; /* 強制全螢幕頂天立地 */
  overflow: hidden;
  background-color: #000;
}

.banner-video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  object-fit: cover;
  z-index: 1;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4); /* 加深遮罩，提升文字可讀性 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

/* --- 文字樣式 --- */
.whisky-title {
  color: #fff;
  font-size: clamp(3rem, 8vw, 5rem); /* 自適應字體大小 */
  font-weight: 800;
  letter-spacing: 8px;
  margin-bottom: 0.5rem;
  text-shadow: 0px 4px 15px rgba(0, 0, 0, 0.8);
}

.whisky-subtitle {
  color: #d1d1d1;
  font-size: clamp(1rem, 3vw, 1.5rem);
  font-weight: 300;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 2rem;
}

/* --- 美化 Start 按鈕 (琥珀金質感) --- */
.whisky-btn {
  background: transparent;
  color: #e2c997; /* 經典琥珀金 */
  border: 1px solid #e2c997;
  padding: 15px 45px;
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: 2px;
  border-radius: 50px;
  text-transform: uppercase;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  box-shadow: 0 0 15px rgba(226, 201, 151, 0.1);
  position: relative;
  overflow: hidden;
}

/* 懸停效果：背景填滿、文字變黑、上浮 */
.whisky-btn:hover {
  background-color: #e2c997 !important;
  color: #000 !important;
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(226, 201, 151, 0.4);
}

/* 按鈕點擊效果 */
.whisky-btn:active {
  transform: translateY(-2px) scale(0.98);
}

/* --- 手機版微調 --- */
@media (max-width: 768px) {
  .whisky-title {
    letter-spacing: 4px;
  }
  .whisky-btn {
    padding: 12px 30px;
    font-size: 0.9rem;
  }
}
</style>
