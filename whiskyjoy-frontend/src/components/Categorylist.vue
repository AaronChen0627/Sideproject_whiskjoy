<template>
  <div class="category-list-container">
    <div v-if="loading" class="loading-state">資料載入中...</div>

    <div v-else class="table-responsive">
      <table class="category-table">
        <thead>
          <tr>
            <th>分類中文名稱</th>
            <th>分類英文名稱</th>
            <th class="actions-col">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category.id">
            <td>{{ category.category_name_zh }}</td>
            <td>{{ category.category_name_en }}</td>
            <td class="actions">
              <button @click="deleteCategory(category)" class="delete-btn">
                刪除
              </button>
            </td>
          </tr>
          <tr v-if="categories.length === 0">
            <td colspan="3" class="empty-msg">目前尚物品項資料</td>
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

const categories = ref([]);
const loading = ref(false);
const message = ref("");
const isError = ref(false);

const fetchCategories = async () => {
  loading.value = true;
  message.value = "";
  try {
    const response = await axios.get("/api/categories");
    if (response.data.success) {
      // 根據後端回傳結構微調，通常是 data.data 或 data.categories
      categories.value = response.data.data || response.data.categories || [];
    }
  } catch (error) {
    console.error("Fetch Categories Error:", error);
    isError.value = true;
    message.value = "無法獲取品項列表";
  } finally {
    loading.value = false;
  }
};

const deleteCategory = async (category) => {
  // 刪除提示改用中文名稱
  if (!confirm(`確定要刪除品項「${category.category_name_zh}」嗎？`)) return;

  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.delete(`/api/categories/${category.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success) {
      alert("刪除成功！");
      fetchCategories();
    }
  } catch (error) {
    console.error("Delete Error:", error);
    alert(error.response?.data?.message || "刪除失敗");
  }
};

onMounted(() => {
  fetchCategories();
});

// 【確保有這行，讓父元件 View 可以遙控刷新】
defineExpose({
  fetchCategories,
});
</script>

<style scoped>
/* 樣式對應 Brandlist，將前綴改為 category 以策安全 */
.category-list-container {
  padding: 20px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
}
.category-table {
  width: 100%;
  border-collapse: collapse;
  color: #fff;
  text-align: left;
}
.category-table th {
  background: rgba(226, 201, 151, 0.1);
  color: #e2c997;
  padding: 12px;
  border-bottom: 1px solid rgba(226, 201, 151, 0.3);
}
.category-table td {
  padding: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

/* 固定操作欄位的寬度，畫面比較好看 */
.actions-col {
  width: 100px;
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
