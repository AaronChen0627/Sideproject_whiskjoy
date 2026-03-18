<template>
  <div class="country-list-container">
    <div v-if="loading" class="loading-state">資料載入中...</div>

    <div v-else class="table-responsive">
      <table class="country-table">
        <thead>
          <tr>
            <th class="name-col">國家名稱 (中/英)</th>
            <th>包含產區 (Regions)</th>
            <th class="actions-col">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="country in countries" :key="country.id">
            <td>
              <div class="country-name-zh">{{ country.country_name_zh }}</div>
              <div class="country-name-en">{{ country.country_name_en }}</div>
            </td>
            <td>
              <div
                v-if="country.regions && country.regions.length > 0"
                class="region-tags"
              >
                <span
                  v-for="(region, index) in country.regions"
                  :key="index"
                  class="region-badge"
                >
                  {{ region.region_name_zh }}
                </span>
              </div>
              <span v-else class="no-region">-</span>
            </td>
            <td class="actions">
              <button @click="deleteCountry(country)" class="delete-btn">
                刪除
              </button>
            </td>
          </tr>
          <tr v-if="countries.length === 0">
            <td colspan="3" class="empty-msg">目前尚無國家資料</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-if="message" :class="['status-msg', { error: isError }]">
      {{ message }}
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const countries = ref([]);
const loading = ref(false);
const message = ref("");
const isError = ref(false);

const fetchCountries = async () => {
  loading.value = true;
  message.value = "";
  try {
    const response = await axios.get("/api/countries");
    if (response.data.success) {
      // 確保即使後端沒有回傳 regions 屬性，也不會報錯
      const data = response.data.data || response.data.countries || [];
      countries.value = data.map((c) => ({
        ...c,
        regions: c.regions || [], // 安全性處理
      }));
    }
  } catch (error) {
    console.error("Fetch Countries Error:", error);
    isError.value = true;
    message.value = "無法獲取國家列表";
  } finally {
    loading.value = false;
  }
};

const deleteCountry = async (country) => {
  if (
    !confirm(
      `確定要刪除國家「${country.country_name_zh}」嗎？相關的產區也會一併刪除。`,
    )
  )
    return;

  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.delete(`/api/countries/${country.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.success) {
      alert("刪除成功！");
      fetchCountries();
    }
  } catch (error) {
    console.error("Delete Error:", error);
    alert(error.response?.data?.message || "刪除失敗");
  }
};

onMounted(() => {
  fetchCountries();
});

defineExpose({
  fetchCountries,
});
</script>

<style scoped>
.country-list-container {
  padding: 20px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
}
.country-table {
  width: 100%;
  border-collapse: collapse;
  color: #fff;
  text-align: left;
}
.country-table th {
  background: rgba(226, 201, 151, 0.1);
  color: #e2c997;
  padding: 12px;
  border-bottom: 1px solid rgba(226, 201, 151, 0.3);
}
.country-table td {
  padding: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  vertical-align: middle;
}

/* 欄位寬度控制 */
.name-col {
  width: 250px;
}
.actions-col {
  width: 100px;
}

/* 國家名稱排版 */
.country-name-zh {
  font-weight: 500;
  font-size: 1.05rem;
}
.country-name-en {
  font-size: 0.85rem;
  color: #888;
  margin-top: 4px;
}

/* 產區標籤樣式 */
.region-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.region-badge {
  background: rgba(226, 201, 151, 0.15);
  color: #e2c997;
  padding: 4px 10px;
  border-radius: 50px;
  font-size: 0.85rem;
  border: 1px solid rgba(226, 201, 151, 0.3);
}
.no-region {
  color: #666;
  font-style: italic;
}

.delete-btn {
  background: #ff4d4d;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}
.delete-btn:hover {
  background: #cc0000;
}
.status-msg {
  margin-top: 20px;
  text-align: center;
}
.status-msg.error {
  color: #ff4d4d;
}
.empty-msg {
  text-align: center;
  padding: 40px !important;
  color: #888;
}
</style>
