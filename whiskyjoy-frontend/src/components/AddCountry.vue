<template>
  <div class="add-country-container">
    <form @submit.prevent="handleSubmit" class="whisky-form">
      <div class="form-group">
        <label for="zh_name"
          >國家中文名稱 <span class="required">*</span></label
        >
        <input
          id="zh_name"
          v-model="formData.country_name_zh"
          type="text"
          placeholder="例如：蘇格蘭"
          required
        />
      </div>

      <div class="form-group">
        <label for="en_name"
          >國家英文名稱 <span class="required">*</span></label
        >
        <input
          id="en_name"
          v-model="formData.country_name_en"
          type="text"
          placeholder="例如：Scotland"
          required
        />
      </div>

      <div class="region-section">
        <div class="region-header">
          <label>所屬產區 (選填)</label>
          <button type="button" class="add-region-btn" @click="addRegion">
            + 新增產區
          </button>
        </div>
        <p class="region-hint">
          ※ 通常只有蘇格蘭需要劃分產區，其他國家可留空。
        </p>

        <div
          v-for="(region, index) in formData.regions"
          :key="index"
          class="region-row"
        >
          <input
            v-model="region.region_name_zh"
            type="text"
            placeholder="產區中文 (例: 艾雷島)"
            required
          />
          <input
            v-model="region.region_name_en"
            type="text"
            placeholder="產區英文 (例: Islay)"
            required
          />
          <button
            type="button"
            class="remove-region-btn"
            @click="removeRegion(index)"
          >
            ✕
          </button>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="loading" class="submit-btn">
          {{ loading ? "提交中..." : "確認新增國家" }}
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

// 資料結構包含了 regions 陣列
const formData = reactive({
  country_name_zh: "",
  country_name_en: "",
  regions: [], // 預設為空陣列
});

// 新增一列產區輸入框
const addRegion = () => {
  formData.regions.push({ region_name_zh: "", region_name_en: "" });
};

// 移除指定的產區輸入框
const removeRegion = (index) => {
  formData.regions.splice(index, 1);
};

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
    const response = await axios.post("/api/countries", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.success) {
      // 成功後清空表單
      Object.assign(formData, {
        country_name_zh: "",
        country_name_en: "",
        regions: [],
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
.add-country-container {
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
.form-group label,
.region-header label {
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
  width: 100%;
}
input:focus {
  border-color: #e2c997;
}

/* 產區專屬樣式 */
.region-section {
  background: rgba(255, 255, 255, 0.02);
  padding: 15px;
  border-radius: 8px;
  border: 1px dashed rgba(226, 201, 151, 0.3);
}
.region-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}
.region-hint {
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 15px;
}
.add-region-btn {
  background: transparent;
  color: #4ade80;
  border: 1px solid #4ade80;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
}
.add-region-btn:hover {
  background: rgba(74, 222, 128, 0.1);
}
.region-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
}
.remove-region-btn {
  background: transparent;
  color: #ff4d4d;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 5px;
}
.remove-region-btn:hover {
  color: #cc0000;
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
