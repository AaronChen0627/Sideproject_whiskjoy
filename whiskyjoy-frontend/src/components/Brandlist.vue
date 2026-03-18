<template>
  <div class="brand-list-container">
    <div v-if="loading" class="loading-state">資料載入中...</div>

    <div v-else class="table-responsive">
      <table class="brand-table">
        <thead>
          <tr>
            <th>Logo</th>
            <th>中文名稱</th>
            <th>英文名稱</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="brand in brands" :key="brand.id">
            <td class="logo-cell">
              <img
                v-if="brand.logo_url"
                :src="brand.logo_url"
                alt="Brand Logo"
                class="brand-logo-img"
              />
              <span v-else class="no-logo">無</span>
            </td>
            <td>{{ brand.brand_name_zh }}</td>
            <td>{{ brand.brand_name_en }}</td>
            <td class="actions">
              <button @click="deleteBrand(brand)" class="delete-btn">
                刪除
              </button>
            </td>
          </tr>
          <tr v-if="brands.length === 0">
            <td colspan="4" class="empty-msg">目前尚無品牌資料</td>
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

const brands = ref([]);
const loading = ref(false);
const message = ref("");
const isError = ref(false);

const fetchBrands = async () => {
  loading.value = true;
  message.value = "";
  try {
    const response = await axios.get("/api/brands");
    if (response.data.success) {
      brands.value = response.data.data || response.data.brands || [];
    }
  } catch (error) {
    console.error("Fetch Brands Error:", error);
    isError.value = true;
    message.value = "無法獲取品牌列表";
  } finally {
    loading.value = false;
  }
};

const deleteBrand = async (brand) => {
  if (!confirm(`確定要刪除品牌「${brand.brand_name_zh}」嗎？`)) return;

  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.delete(`/api/brands/${brand.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success) {
      alert("刪除成功！");
      fetchBrands();
    }
  } catch (error) {
    console.error("Delete Error:", error);
    alert(error.response?.data?.message || "刪除失敗");
  }
};

onMounted(() => {
  fetchBrands();
});

// 【確保有這行】
defineExpose({
  fetchBrands,
});
</script>

<style scoped>
/* 樣式保持不變 */
.brand-list-container {
  padding: 20px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
}
.brand-table {
  width: 100%;
  border-collapse: collapse;
  color: #fff;
  text-align: left;
}
.brand-table th {
  background: rgba(226, 201, 151, 0.1);
  color: #e2c997;
  padding: 12px;
  border-bottom: 1px solid rgba(226, 201, 151, 0.3);
}
.brand-table td {
  padding: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.logo-cell {
  width: 80px;
}
.brand-logo-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  background: #fff;
  border-radius: 4px;
}
.no-logo {
  font-size: 0.8rem;
  color: #666;
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
