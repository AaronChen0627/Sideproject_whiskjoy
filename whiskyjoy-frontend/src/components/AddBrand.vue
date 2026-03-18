<template>
  <div class="add-brand-container">
    <form @submit.prevent="handleSubmit" class="whisky-form">
      <div class="form-group">
        <label for="zh_name"
          >品牌中文名稱 <span class="required">*</span></label
        >
        <input
          id="zh_name"
          v-model="formData.brand_name_zh"
          type="text"
          placeholder="例如：麥卡倫"
          required
        />
      </div>

      <div class="form-group">
        <label for="en_name"
          >品牌英文名稱 <span class="required">*</span></label
        >
        <input
          id="en_name"
          v-model="formData.brand_name_en"
          type="text"
          placeholder="例如：The Macallan"
          required
        />
      </div>

      <div class="form-group">
        <label for="logo">Logo 圖片網址 (選填)</label>
        <input
          id="logo"
          v-model="formData.logo_url"
          type="url"
          placeholder="https://example.com/logo.png"
        />
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="loading" class="submit-btn">
          {{ loading ? "提交中..." : "確認新增品牌" }}
        </button>
      </div>

      <p v-if="message" :class="['message', { error: isError }]">
        {{ message }}
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits } from "vue";
import axios from "axios";

const emit = defineEmits(["success"]);

const loading = ref(false);
const message = ref("");
const isError = ref(false);

const formData = reactive({
  brand_name_zh: "",
  brand_name_en: "",
  logo_url: "",
});

const handleSubmit = async () => {
  loading.value = true;
  message.value = "";
  isError.value = false;

  const rawToken = sessionStorage.getItem("token");
  if (!rawToken || rawToken === "null" || rawToken === "undefined") {
    message.value = "找不到登入憑證，請重新登入";
    isError.value = true;
    loading.value = false;
    return;
  }

  try {
    const token = String(rawToken).trim();

    const response = await axios.post("/api/brands", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.success) {
      // 成功後立即清空並通知父元件
      Object.assign(formData, {
        brand_name_zh: "",
        brand_name_en: "",
        logo_url: "",
      });
      emit("success");
    }
  } catch (error) {
    isError.value = true;
    if (error.response) {
      console.error("API Error:", error.response.data);
      message.value = error.response.data.message || "新增失敗";
    } else {
      message.value = error.message || "發生未知錯誤";
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* 樣式保持不變 */
.add-brand-container {
  padding: 10px;
}
.whisky-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.form-group label {
  color: #e2c997;
  font-size: 0.9rem;
  font-weight: 500;
}
.required {
  color: #ff4d4d;
}
input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(226, 201, 151, 0.3);
  border-radius: 8px;
  padding: 12px;
  color: #fff;
  outline: none;
  transition: border-color 0.3s;
}
input:focus {
  border-color: #e2c997;
}
.submit-btn {
  width: 100%;
  background: #e2c997;
  color: #121212;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
}
.submit-btn:hover:not(:disabled) {
  background: #c9b07a;
  transform: translateY(-2px);
}
.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.message {
  text-align: center;
  font-size: 0.9rem;
  margin-top: 10px;
  color: #4ade80;
}
.message.error {
  color: #ff4d4d;
}
</style>
