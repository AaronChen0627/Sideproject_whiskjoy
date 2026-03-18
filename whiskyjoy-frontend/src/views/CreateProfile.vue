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
          <div
            class="avatar-container mx-auto position-relative"
            @click="$refs.fileInput.click()"
            :class="{ uploading: loading }"
            title="點擊更換頭像"
          >
            <img
              v-if="avatarUrl"
              :src="avatarUrl"
              alt="Preview"
              class="preview-img"
            />
            <div
              v-else
              class="preview-placeholder d-flex align-items-center justify-content-center h-100"
            >
              <span class="fs-1 text-gold">{{
                account ? account.charAt(0).toUpperCase() : "U"
              }}</span>
            </div>

            <div class="upload-badge">
              <i v-if="!loading" class="bi bi-camera-fill"></i>
              <span v-else class="spinner-border spinner-border-sm"></span>
            </div>
          </div>
          <p class="mt-3 text-gold fs-7 fw-bold ls-2">CLICK TO UPLOAD AVATAR</p>

          <input
            type="file"
            ref="fileInput"
            @change="handleFileUpload"
            accept="image/*"
            hidden
          />
        </div>

        <form @submit.prevent="updateProfile" class="auth-form">
          <div
            v-if="statusMsg"
            :class="['status-msg mb-4', isError ? 'error' : 'success']"
          >
            {{ statusMsg }}
          </div>

          <div class="form-group mb-5">
            <label class="text-white-50 mb-2 fs-7 ms-2">DISPLAY NAME</label>
            <input
              type="text"
              v-model="account"
              class="whisky-input"
              placeholder="您的稱呼"
              required
            />
          </div>

          <div class="form-actions">
            <button
              type="submit"
              class="btn whisky-btn-primary w-100 rounded-pill d-flex align-items-center justify-content-center py-3"
              :disabled="loading"
            >
              <span
                v-if="loading"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              <span class="fw-bold ls-1">{{
                loading ? "處理中..." : "儲存並進入我的筆記"
              }}</span>
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
    ...mapState({
      user: (state) => state.user,
    }),
  },
  watch: {
    user: {
      handler(newVal) {
        if (newVal) {
          // 初始化載入現有資料
          if (!this.account) this.account = newVal.account || "";
          if (!this.avatarUrl) this.avatarUrl = newVal.avatar_url || "";
        }
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions(["updateUserProfile"]),

    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      // 檢查檔案大小 (前端初步過濾)
      if (file.size > 2 * 1024 * 1024) {
        this.isError = true;
        this.statusMsg = "檔案不能超過 2MB";
        return;
      }

      this.loading = true;
      this.statusMsg = "正在處理圖片...";

      const formData = new FormData();
      formData.append("file", file); // 💡 注意：對齊後端 upload.single('file')

      try {
        const savedToken = sessionStorage.getItem("token");

        // 發送至後端 API
        const response = await this.$axios.post("/api/auth/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${savedToken}`,
          },
        });

        if (response.data.success) {
          this.avatarUrl = response.data.url; // 拿到伺服器回傳的路徑
          this.isError = false;
          this.statusMsg = "圖片上傳成功！";
        }
      } catch (error) {
        console.error("上傳失敗:", error);
        this.isError = true;
        this.statusMsg = error.response?.data?.message || "圖片上傳失敗";
      } finally {
        this.loading = false;
      }
    },

    async updateProfile() {
      if (!this.account.trim()) {
        this.isError = true;
        this.statusMsg = "帳號名稱不能為空";
        return;
      }

      this.loading = true;
      try {
        // 呼叫 Vuex Action 更新資料庫中的 Profile
        await this.updateUserProfile({
          account: this.account,
          avatar_url: this.avatarUrl,
        });

        this.isError = false;
        this.statusMsg = "更新成功！即將進入筆記...";

        // 延遲 1 秒後導向主頁
        setTimeout(() => this.$router.push("/note"), 1000);
      } catch (error) {
        this.isError = true;
        this.statusMsg = error.message || "更新失敗";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* 基本佈局 */
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
  background-color: rgba(0, 0, 0, 0.65);
  z-index: 2;
  padding: 20px;
}

/* 卡片與容器 */
.profile-card {
  max-width: 420px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(226, 201, 151, 0.25);
  border-radius: 30px;
  backdrop-filter: blur(20px);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
}

.avatar-container {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  border: 2px solid #e2c997;
  padding: 5px;
  background-color: rgba(0, 0, 0, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-container:hover {
  transform: scale(1.05);
  border-color: #fff;
  box-shadow: 0 0 25px rgba(226, 201, 151, 0.4);
}

.preview-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.upload-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: #e2c997;
  color: #000;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

/* 輸入框設計 */
.whisky-input {
  background: rgba(0, 0, 0, 0.3) !important;
  border: 1px solid rgba(226, 201, 151, 0.3) !important;
  color: #e2c997 !important;
  text-align: center;
  border-radius: 15px;
  padding: 15px;
  width: 100%;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.whisky-input:focus {
  border-color: #e2c997 !important;
  box-shadow: 0 0 15px rgba(226, 201, 151, 0.3);
  background: rgba(0, 0, 0, 0.5) !important;
  outline: none;
}

/* 按鈕設計 */
.whisky-btn-primary {
  background: linear-gradient(135deg, #e2c997 0%, #b89a5e 100%) !important;
  color: #1a1a1a !important;
  border: none;
  font-size: 1.1rem;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.whisky-btn-primary:hover:not(:disabled) {
  transform: translateY(-3px);
  filter: brightness(1.1);
  box-shadow: 0 10px 25px rgba(226, 201, 151, 0.4);
}

/* 文字與輔助類 */
.text-gold {
  color: #e2c997;
}
.fs-7 {
  font-size: 0.8rem;
}
.ls-1 {
  letter-spacing: 1px;
}
.ls-2 {
  letter-spacing: 2px;
}

.status-msg {
  padding: 12px;
  border-radius: 12px;
  text-align: center;
  font-size: 0.9rem;
}
.status-msg.success {
  background: rgba(40, 167, 69, 0.2);
  color: #85ff9e;
  border: 1px solid rgba(40, 167, 69, 0.3);
}
.status-msg.error {
  background: rgba(220, 53, 69, 0.2);
  color: #ff8585;
  border: 1px solid rgba(220, 53, 69, 0.3);
}

.auth-title {
  color: #e2c997;
  letter-spacing: 4px;
}
</style>
