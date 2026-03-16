<template>
  <div class="profile-page-wrapper">
    <video class="auth-bg-video" autoplay loop muted playsinline>
      <source src="@/assets/Banner-video.webm" type="video/webm" />
    </video>

    <div class="auth-overlay d-flex align-items-center justify-content-center">
      <div class="profile-card p-4 p-md-5">
        <div class="text-center mb-4">
          <h2 class="auth-title fw-bold">PROFILE SETTINGS</h2>
          <p class="auth-subtitle text-white-50">完善您的威士忌筆記帳戶</p>
        </div>

        <div class="avatar-preview-section text-center mb-5">
          <div class="avatar-container mx-auto">
            <img
              v-if="avatarUrl"
              :src="avatarUrl"
              alt="Preview"
              class="preview-img"
            />
            <div v-else class="preview-placeholder">
              <span class="fs-1">{{
                account ? account.charAt(0).toUpperCase() : "U"
              }}</span>
            </div>
          </div>
          <p class="mt-3 text-gold fs-7">AVATAR PREVIEW</p>
        </div>

        <form @submit.prevent="updateProfile" class="auth-form">
          <div
            v-if="statusMsg"
            :class="['status-msg mb-4', isError ? 'error' : 'success']"
          >
            {{ statusMsg }}
          </div>

          <div class="form-group mb-4">
            <label class="form-label">ACCOUNT NAME</label>
            <input
              type="text"
              v-model="account"
              class="whisky-input"
              placeholder="您的稱呼"
              required
            />
          </div>

          <div class="form-group mb-5">
            <label class="form-label">AVATAR IMAGE URL</label>
            <input
              type="url"
              v-model="avatarUrl"
              class="whisky-input"
              placeholder="https://example.com/photo.jpg"
            />
            <small class="text-white-50 mt-2 d-block fs-8"
              >請貼上公開的圖片連結</small
            >
          </div>

          <div class="d-flex gap-3">
            <button
              type="button"
              @click="$router.push('/note')"
              class="btn whisky-btn-outline w-50 rounded-pill"
              :disabled="loading"
            >
              取消
            </button>
            <button
              type="submit"
              class="btn whisky-btn-primary w-50 rounded-pill d-flex align-items-center justify-content-center"
              :disabled="loading"
            >
              <span
                v-if="loading"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              {{ loading ? "更新中..." : "儲存變更" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      account: "",
      avatarUrl: "",
      loading: false,
      statusMsg: "",
      isError: false,
    };
  },
  computed: {
    // 從 Vuex 取得 user 狀態
    ...mapState({
      user: (state) => state.user,
    }),
  },
  // 核心修正：使用監聽器代替 mounted
  watch: {
    user: {
      handler(newVal) {
        if (newVal) {
          // 只有在本地變數還是空的時候才自動填入，避免覆蓋掉使用者正在輸入的內容
          if (!this.account) this.account = newVal.account || "";
          if (!this.avatarUrl) this.avatarUrl = newVal.avatar_url || "";
        }
      },
      immediate: true, // 組件一建立就立刻執行一次
    },
  },
  methods: {
    ...mapActions(["updateUserProfile"]),
    async updateProfile() {
      // 1. 基本前端驗證
      if (!this.account.trim()) {
        this.isError = true;
        this.statusMsg = "帳號名稱不能為空";
        return;
      }

      this.loading = true;
      this.statusMsg = "";

      try {
        // 2. 呼叫 Vuex Action
        // 這裡確保 Key 名稱與後端 Controller 解構的名稱一致 (account, avatar_url)
        await this.updateUserProfile({
          account: this.account,
          avatar_url: this.avatarUrl,
        });

        this.isError = false;
        this.statusMsg = "資料更新成功！正在導向...";

        // 3. 成功後延遲導向
        setTimeout(() => {
          this.$router.push("/note");
        }, 1500);
      } catch (error) {
        // 4. 捕捉後端傳回的 400 或 500 錯誤
        console.error("更新失敗詳情:", error);
        this.isError = true;
        this.statusMsg = error.message || "更新失敗，請檢查格式或網路連線";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* 核心容器與影片背景 (沿用 Login 邏輯) */
.profile-page-wrapper {
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
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 2;
  padding: 20px;
}

/* 毛玻璃卡片 */
.profile-card {
  max-width: 500px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(226, 201, 151, 0.3);
  border-radius: 30px;
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
}

/* 頭像預覽環 */
.avatar-container {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid #e2c997;
  padding: 4px;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.3);
  box-shadow: 0 0 20px rgba(226, 201, 151, 0.3);
}

.preview-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.preview-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e2c997;
  font-weight: bold;
}

/* 文字與輸入框 (琥珀金質感) */
.auth-title {
  color: #e2c997;
  letter-spacing: 3px;
}

.text-gold {
  color: #e2c997;
}
.fs-7 {
  font-size: 0.75rem;
}
.fs-8 {
  font-size: 0.65rem;
}

.form-label {
  color: #e2c997;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 1.5px;
  margin-bottom: 8px;
  display: block;
}

.whisky-input {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: #fff !important;
  padding: 12px 18px;
  width: 100%;
  border-radius: 12px;
  transition: all 0.3s;
}

.whisky-input:focus {
  border-color: #e2c997 !important;
  box-shadow: 0 0 15px rgba(226, 201, 151, 0.3);
  outline: none;
}

/* 按鈕樣式 */
.whisky-btn-primary {
  background-color: #e2c997 !important;
  color: #000 !important;
  font-weight: 700;
  border: none;
}

.whisky-btn-outline {
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.whisky-btn-outline:hover {
  border-color: #e2c997;
  color: #e2c997;
}

/* 狀態提示 */
.status-msg {
  padding: 10px;
  border-radius: 10px;
  font-size: 0.9rem;
  text-align: center;
}
.status-msg.success {
  background: rgba(40, 167, 69, 0.2);
  color: #28a745;
  border: 1px solid #28a745;
}
.status-msg.error {
  background: rgba(226, 201, 151, 0.2);
  color: #e2c997;
  border: 1px solid #e2c997;
}
</style>
