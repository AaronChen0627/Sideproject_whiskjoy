<template>
  <div class="admin-wrapper">
    <div class="admin-container">
      <nav class="filter-nav-container">
        <div class="filter-nav">
          <button
            :class="['nav-btn', { active: currentTab === 'brand' }]"
            @click="currentTab = 'brand'"
          >
            品牌列表
          </button>
          <button
            :class="['nav-btn', { active: currentTab === 'category' }]"
            @click="currentTab = 'category'"
          >
            分類列表
          </button>
          <button
            :class="['nav-btn', { active: currentTab === 'country' }]"
            @click="currentTab = 'country'"
          >
            國家列表
          </button>
        </div>
      </nav>

      <main class="content-card">
        <transition name="fade-blur" mode="out-in">
          <div v-if="currentTab === 'brand'" key="brand" class="tab-content">
            <div class="tab-header">
              <h2 class="section-title">品牌清單列表</h2>
              <button class="add-inline-btn" @click="showAddModal = true">
                <i class="bi bi-plus-lg"></i> 新增品牌
              </button>
            </div>
            <Brandlist ref="brandListRef" />
          </div>

          <div
            v-else-if="currentTab === 'category'"
            key="category"
            class="tab-content"
          >
            <div class="tab-header">
              <h2 class="section-title">分類清單列表</h2>
              <button class="add-inline-btn" @click="showAddModal = true">
                <i class="bi bi-plus-lg"></i> 新增分類
              </button>
            </div>
            <Categorylist ref="categoryListRef" />
          </div>

          <div
            v-else-if="currentTab === 'country'"
            key="country"
            class="tab-content"
          >
            <div class="tab-header">
              <h2 class="section-title">國家清單列表</h2>
              <button class="add-inline-btn" @click="showAddModal = true">
                <i class="bi bi-plus-lg"></i> 新增國家
              </button>
            </div>
            <Countrylist ref="countryListRef" />
          </div>
        </transition>
      </main>

      <transition name="fade">
        <div
          v-if="showAddModal"
          class="modal-overlay"
          @click.self="showAddModal = false"
        >
          <div class="modal-content shadow-lg">
            <div class="modal-header">
              <h3>新增{{ currentTabName }}資料</h3>
              <button class="close-btn" @click="showAddModal = false">
                &times;
              </button>
            </div>
            <div class="modal-body">
              <component :is="activeAddComponent" @success="handleSuccess" />
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from "vue";
import Brandlist from "@/components/Brandlist.vue";
import Categorylist from "@/components/Categorylist.vue";
import Countrylist from "@/components/Countrylist.vue";

import AddBrand from "@/components/AddBrand.vue";
import AddCategory from "@/components/AddCategory.vue";
import AddCountry from "@/components/AddCountry.vue";

const currentTab = ref("brand");
const showAddModal = ref(false);

// 定義 Refs 供遠端遙控
const brandListRef = ref(null);
const categoryListRef = ref(null);
const countryListRef = ref(null);

const currentTabName = computed(() => {
  const names = { brand: "品牌", category: "品項", country: "國家" };
  return names[currentTab.value];
});

const activeAddComponent = computed(() => {
  const components = {
    brand: AddBrand,
    category: AddCategory,
    country: AddCountry,
  };
  return components[currentTab.value];
});

// 【關鍵修復】：加入 async 和 nextTick
const handleSuccess = async () => {
  // 1. 先關閉彈窗
  showAddModal.value = false;

  // 2. 等待 Vue 處理完 Modal 關閉的 DOM 變化
  await nextTick();

  // 3. 呼叫對應的列表去抓取最新資料
  if (currentTab.value === "brand" && brandListRef.value) {
    brandListRef.value.fetchBrands();
  } else if (currentTab.value === "category" && categoryListRef.value) {
    categoryListRef.value.fetchCategories?.();
  } else if (currentTab.value === "country" && countryListRef.value) {
    countryListRef.value.fetchCountries?.();
  }
};
</script>

<style scoped>
/* 樣式保持你原本的設定不變 */
.admin-wrapper {
  min-height: 100vh;
  background-color: #0f0f0f;
  padding: 50px 20px;
  color: #fff;
}
.admin-container {
  max-width: 960px;
  margin: 0 auto;
}
.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(226, 201, 151, 0.1);
  margin-bottom: 25px;
  padding-bottom: 15px;
}
.section-title {
  color: #e2c997;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  border: none;
}
.add-inline-btn {
  background: transparent;
  color: #e2c997;
  border: 1px solid #e2c997;
  padding: 6px 16px;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}
.add-inline-btn:hover {
  background: #e2c997;
  color: #121212;
  box-shadow: 0 0 15px rgba(226, 201, 151, 0.3);
}
.filter-nav-container {
  display: flex;
  justify-content: center;
  margin-bottom: 35px;
}
.filter-nav {
  display: inline-flex;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(226, 201, 151, 0.2);
  padding: 6px;
  border-radius: 50px;
}
.nav-btn {
  background: transparent;
  border: none;
  padding: 10px 28px;
  color: #aaa;
  cursor: pointer;
  border-radius: 50px;
  transition: all 0.4s;
}
.nav-btn.active {
  background: #e2c997;
  color: #121212;
}
.content-card {
  background: rgba(25, 25, 25, 0.8);
  border: 1px solid rgba(226, 201, 151, 0.1);
  border-radius: 24px;
  padding: 40px;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
}
.modal-content {
  background: #1a1a1a;
  border: 1px solid rgba(226, 201, 151, 0.3);
  width: 100%;
  max-width: 500px;
  border-radius: 20px;
  padding: 30px;
}
.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
}
.fade-blur-enter-active,
.fade-blur-leave-active {
  transition: all 0.3s ease;
}
.fade-blur-enter-from {
  opacity: 0;
  filter: blur(8px);
}
</style>
