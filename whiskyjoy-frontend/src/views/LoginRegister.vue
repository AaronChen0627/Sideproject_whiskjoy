<template>
  <div class="login-auth-container">
    <video class="auth-bg-video" autoplay loop muted playsinline>
      <source src="@/assets/Banner-video.webm" type="video/webm" />
    </video>

    <div class="auth-overlay d-flex align-items-center justify-content-center">
      <div class="login-card p-4 p-md-5 shadow-lg">
        <div class="text-center mb-5">
          <h2 class="auth-title fw-bold">
            {{ isRegister ? "Create Account" : "Welcome Back" }}
          </h2>
          <p class="auth-subtitle">
            {{
              isRegister
                ? "Sign up to share your whisky journey"
                : "Login to your unique note"
            }}
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <div
            v-if="errorMessage"
            class="error-message-container mb-4 text-center"
          >
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            {{ errorMessage }}
          </div>

          <div class="form-group mb-4">
            <label class="form-label">EMAIL ADDRESS</label>
            <input
              type="email"
              v-model="email"
              class="whisky-input"
              placeholder="Aaron@example.com"
              required
              @input="clearError"
            />
          </div>

          <div class="form-group mb-5">
            <label class="form-label">PASSWORD</label>
            <input
              type="password"
              v-model="password"
              class="whisky-input"
              placeholder="••••••••"
              required
              @input="clearError"
            />
          </div>

          <button
            type="submit"
            class="btn whisky-btn-primary w-100 mb-4 rounded-pill d-flex align-items-center justify-content-center"
            :disabled="isLoading"
          >
            <span
              v-if="isLoading"
              class="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            {{
              isRegister
                ? isLoading
                  ? "Registering..."
                  : "Register"
                : isLoading
                ? "Logging in..."
                : "Login"
            }}
          </button>
        </form>

        <div class="text-center mt-2">
          <button
            @click="toggleForm"
            class="btn whisky-btn-outline w-100 rounded-pill"
            :disabled="isLoading"
          >
            {{
              isRegister
                ? "Already have an account? Login"
                : "Don't have an account? Register"
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      isRegister: false, // 控制是否顯示註冊表單
      errorMessage: "", // 存放錯誤訊息
      isLoading: false, // 登入中狀態
    };
  },
  methods: {
    async handleSubmit() {
      this.errorMessage = "";
      this.isLoading = true;

      try {
        const action = this.isRegister ? "register" : "login";
        const response = await this.$store.dispatch(action, {
          email: this.email,
          password: this.password,
        });

        // 成功後的路由跳轉邏輯
        const routes = {
          "登入成功，趕快新增產品吧！": "/add-product",
          "您的資料都有了，趕快寫筆記吧！": "/note",
          "請先更新個人資料!": "/update-profile",
        };

        if (routes[response]) {
          this.$router.push(routes[response]);
        } else {
          this.errorMessage = response || "操作成功但未知的回應";
        }
      } catch (error) {
        console.error("Auth Error:", error);

        // 優化訊息顯示：若 auth.js 丟出的是 "Error: 訊息"，只取後面的文字
        const rawMessage = error.message || "認證過程中發生錯誤";
        this.errorMessage = rawMessage.replace(/^Error:\s*/, "");

        // 額外處理網路斷線情況
        if (rawMessage.toLowerCase().includes("network")) {
          this.errorMessage = "網路連線異常，請檢查伺服器狀態";
        }
      } finally {
        this.isLoading = false;
      }
    },
    toggleForm() {
      this.isRegister = !this.isRegister;
      this.email = "";
      this.password = "";
      this.errorMessage = "";
    },
    clearError() {
      this.errorMessage = "";
    },
  },
};
</script>

<style scoped>
/* --- 影片背景定位 --- */
.login-auth-container {
  position: relative;
  width: 100%;
  height: 100vh; /* 撐滿螢幕 */
  overflow: hidden;
}

.auth-bg-video {
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

.auth-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.55); /* 遮罩稍微加深，提升文字可讀性 */
  z-index: 2;
  padding: 20px;
}

/* --- 毛玻璃卡片 --- */
.login-card {
  max-width: 450px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.08); /* 極透明的白 */
  border: 1px solid rgba(226, 201, 151, 0.3); /* 琥珀金細邊框 */
  border-radius: 28px;
  backdrop-filter: blur(20px); /* 關鍵：強力的毛玻璃效果 */
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6);
  transition: transform 0.3s ease;
}

/* --- 文字樣式 --- */
.auth-title {
  color: #e2c997; /* 標題用琥珀金 */
  letter-spacing: 2px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.auth-subtitle {
  color: rgba(255, 255, 255, 0.85); /* 亮白色，在毛玻璃上很清楚 */
  font-size: 0.95rem;
  font-weight: 300;
  letter-spacing: 1px;
}

.form-label {
  color: #e2c997;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 1.5px;
  margin-bottom: 8px;
  display: block;
}

/* --- [關鍵修改] 琥珀金質感錯誤提示 --- */
.error-message-container {
  background-color: rgba(226, 201, 151, 0.15); /* 淡淡的金色背景 */
  border: 1px solid #e2c997; /* 金色邊框 */
  color: #e2c997; /* 金色文字 */
  padding: 12px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  /* 增加一點微弱的金色發光效果 */
  box-shadow: 0 0 15px rgba(226, 201, 151, 0.3);
  /* 動畫效果，讓它出現時更平滑 */
  animation: fadeInDown 0.4s ease;
}

/* --- 輸入框樣式 (透明質感) --- */
.whisky-input {
  background: rgba(255, 255, 255, 0.08) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: #fff !important;
  padding: 13px 18px;
  width: 100%;
  border-radius: 12px;
  transition: all 0.3s;
  font-size: 0.95rem;
}

.whisky-input:focus {
  border-color: #e2c997 !important;
  background: rgba(255, 255, 255, 0.12) !important;
  outline: none;
  box-shadow: 0 0 15px rgba(226, 201, 151, 0.4);
}

/* 調整 Placeholder 顏色 */
.whisky-input::placeholder {
  color: rgba(255, 255, 255, 0.4) !important;
}

/* --- 按鈕樣式 --- */
.whisky-btn-primary {
  background-color: #e2c997 !important;
  color: #000 !important;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  border: none;
  padding: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.whisky-btn-primary:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(226, 201, 151, 0.5) !important;
}

.whisky-btn-primary:active:not(:disabled) {
  transform: translateY(-1px) scale(0.98);
}

/* 停用狀態 (Loading 時) */
.whisky-btn-primary:disabled {
  background-color: #bfa577 !important; /* 較暗的金色 */
  opacity: 0.8;
  cursor: not-allowed;
}

.whisky-btn-outline {
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 0.85rem;
  font-weight: 400;
  letter-spacing: 1px;
  padding: 10px;
  transition: all 0.3s ease;
}

.whisky-btn-outline:hover:not(:disabled) {
  border-color: #e2c997;
  color: #e2c997;
  background-color: rgba(226, 201, 151, 0.1);
}

.whisky-btn-outline:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* --- 簡單的動畫 --- */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translate3d(0, -20px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

/* --- 手機版微調 --- */
@media (max-width: 576px) {
  .login-card {
    padding: 2rem !important;
    border-radius: 20px;
  }
  .auth-title {
    font-size: 2rem;
  }
}
</style>
