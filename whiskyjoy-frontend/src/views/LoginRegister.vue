<template>
  <div class="login-auth-container">
    <video class="auth-bg-video" autoplay loop muted playsinline>
      <source src="@/assets/Banner-video.webm" type="video/webm" />
    </video>

    <div class="auth-overlay d-flex align-items-center justify-content-center">
      <transition name="pop-in">
        <div v-if="successMessage" class="success-popup-container">
          <div class="success-popup-card shadow-lg text-center p-4">
            <i class="bi bi-check-circle-fill success-icon mb-3"></i>
            <h4 class="popup-title mb-3">恭喜您！</h4>
            <p class="popup-message mb-4">{{ successMessage }}</p>
            <button
              @click="closeSuccessAndLogin"
              class="btn whisky-btn-primary rounded-pill w-100"
            >
              立刻登入
            </button>
          </div>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="!successMessage" class="login-card p-4 p-md-5 shadow-lg">
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
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginRegister",
  data() {
    return {
      email: "",
      password: "",
      isRegister: false,
      errorMessage: "",
      successMessage: "",
      isLoading: false,
    };
  },
  methods: {
    async handleSubmit() {
      this.errorMessage = "";
      this.isLoading = true;

      try {
        const action = this.isRegister ? "register" : "login";

        // 💡 這裡拿到的 response 就是 Action 回傳的 data 物件
        const response = await this.$store.dispatch(action, {
          email: this.email,
          password: this.password,
        });

        if (this.isRegister) {
          this.successMessage = "註冊成功！請登入。";
          this.isRegister = false;
          this.password = "";
          return;
        }

        // --- 🚀 修正跳轉判斷 ---
        // 優先從 response 拿，拿不到再從 state 拿（雙重保險）
        const userData = response?.user || this.$store.state.user;

        if (userData) {
          if (userData.role === "admin") {
            this.$router.push("/add-product");
            return;
          }

          // 💡 判斷邏輯：只要 account 和 avatar_url 「都有值」就進 Note
          const hasAccount = !!userData.account;
          const hasAvatar = !!userData.avatar_url;

          if (hasAccount && hasAvatar) {
            this.$router.push("/note");
          } else {
            this.$router.push("/create-profile");
          }
        } else {
          this.$router.push("/create-profile");
        }
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.isLoading = false;
      }
    },
    closeSuccessAndLogin() {
      this.successMessage = "";
    },
    toggleForm() {
      this.isRegister = !this.isRegister;
      this.email = "";
      this.password = "";
      this.errorMessage = "";
      this.successMessage = "";
    },
    clearError() {
      this.errorMessage = "";
    },
  },
};
</script>

<style scoped>
/* 提示彈窗 CSS */
.success-popup-container {
  position: absolute;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
}

.success-popup-card {
  max-width: 400px;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.45);
  border: 2px solid rgba(226, 201, 151, 0.8);
  border-radius: 24px;
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.7);
}

.success-icon {
  font-size: 3rem;
  color: #e2c997;
  text-shadow: 0 0 15px rgba(226, 201, 151, 0.6);
  display: block;
}

.popup-title {
  color: #fff;
  font-weight: 700;
  letter-spacing: 1.5px;
}

.popup-message {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  line-height: 1.6;
  letter-spacing: 0.5px;
}

/* 動畫 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pop-in-enter-active,
.pop-in-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.pop-in-enter-from,
.pop-in-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* UI 基本樣式 */
.login-auth-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
.auth-bg-video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 100%;
  min-height: 100%;
  object-fit: cover;
  z-index: 1;
}
.auth-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.55);
  z-index: 2;
  padding: 20px;
}
.login-card {
  max-width: 450px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(226, 201, 151, 0.3);
  border-radius: 28px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6);
}
.auth-title {
  color: #e2c997;
  letter-spacing: 2px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}
.auth-subtitle {
  color: rgba(255, 255, 255, 0.85);
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
.error-message-container {
  background-color: rgba(226, 201, 151, 0.15);
  border: 1px solid #e2c997;
  color: #e2c997;
  padding: 12px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
}
.whisky-input {
  background: rgba(255, 255, 255, 0.08) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: #fff !important;
  padding: 13px 18px;
  width: 100%;
  border-radius: 12px;
  font-size: 0.95rem;
}
.whisky-input:focus {
  border-color: #e2c997 !important;
  box-shadow: 0 0 15px rgba(226, 201, 151, 0.4);
  outline: none;
}
.whisky-btn-primary {
  background-color: #e2c997 !important;
  color: #000 !important;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  border: none;
  padding: 14px;
}
.whisky-btn-primary:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(226, 201, 151, 0.5) !important;
}
.whisky-btn-outline {
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 10px;
}
</style>
