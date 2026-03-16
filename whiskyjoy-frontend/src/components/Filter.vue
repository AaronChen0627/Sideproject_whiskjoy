<template>
  <div class="filter-wrapper py-4">
    <div class="filter-glass-card">
      <div
        class="d-flex justify-content-center align-items-center flex-wrap gap-4"
      >
        <div class="filter-item">
          <label class="whisky-label">COUNTRY</label>
          <div class="select-wrapper">
            <select
              v-model="selectedCountry"
              class="whisky-select"
              @change="handleCountryChange"
            >
              <option value="">所有國家</option>
              <option value="蘇格蘭">蘇格蘭</option>
              <option value="愛爾蘭">愛爾蘭</option>
              <option value="日本">日本</option>
              <option value="美國">美國</option>
              <option value="臺灣">臺灣</option>
            </select>
          </div>
        </div>

        <div class="filter-item" :class="{ 'is-disabled': !canSelectRegion }">
          <label class="whisky-label">REGION</label>
          <div class="select-wrapper">
            <select
              v-model="selectedRegion"
              :disabled="!canSelectRegion"
              class="whisky-select"
              @change="updateFilters"
            >
              <option value="">所有區域</option>
              <option value="低地區">低地區</option>
              <option value="高地區">高地區</option>
              <option value="斯貝賽區">斯貝賽區</option>
              <option value="艾雷島區">艾雷島區</option>
              <option value="島嶼區">島嶼區</option>
              <option value="坎貝爾鎮">坎貝爾鎮</option>
            </select>
          </div>
        </div>

        <div class="filter-item">
          <label class="whisky-label">CATEGORY</label>
          <div class="select-wrapper">
            <select
              v-model="selectedCategory"
              class="whisky-select"
              @change="updateFilters"
            >
              <option value="">所有種類</option>
              <option value="單一麥芽">單一麥芽</option>
              <option value="原桶強度">原桶強度</option>
              <option value="單桶">單桶</option>
              <option value="調和式">調和式</option>
              <option value="穀物">穀物</option>
              <option value="波本">波本</option>
            </select>
          </div>
        </div>

        <div class="filter-action">
          <button @click="resetFilters" class="reset-btn">
            <i class="bi bi-arrow-counterclockwise"></i> RESET
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
      selectedCountry: "",
      selectedRegion: "",
      selectedCategory: "",
    };
  },
  computed: {
    canSelectRegion() {
      return this.selectedCountry === "蘇格蘭";
    },
  },
  methods: {
    handleCountryChange() {
      if (this.selectedCountry !== "蘇格蘭") {
        this.selectedRegion = "";
      }
      this.updateFilters();
    },
    updateFilters() {
      this.$emit("update-filters", {
        country: this.selectedCountry,
        region: this.selectedRegion,
        category: this.selectedCategory,
      });
    },
    resetFilters() {
      this.selectedCountry = "";
      this.selectedRegion = "";
      this.selectedCategory = "";
      this.updateFilters();
    },
  },
};
</script>

<style scoped>
/* 1. 修正父容器：加入 flex 並置中 */
.filter-wrapper {
  background-color: #1a1c23;
  display: flex; /* 啟用 Flex */
  justify-content: center; /* 水平置中 */
  align-items: center; /* 垂直置中 (視需求) */
  width: 100%;
}

/* 2. 修正毛玻璃外殼 */
.filter-glass-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(226, 201, 151, 0.15);
  border-radius: 50px;
  padding: 15px 40px;
  /* 移除 display: inline-block; 改用 flex 讓內容在裡面也排整齊 */
  display: flex;
  align-items: center;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* 為了 Safari */
}

.filter-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 140px;
}

/* 標籤設計：琥珀金小字 */
.whisky-label {
  color: #e2c997;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  margin-bottom: 5px;
  margin-left: 10px;
}

/* 隱藏原生 Select 樣式，自定義外觀 */
.select-wrapper {
  position: relative;
  width: 100%;
}

.whisky-select {
  background: transparent !important;
  border: none !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: #fff !important;
  font-size: 0.9rem;
  padding: 5px 10px;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
}

.whisky-select:focus {
  outline: none;
  border-bottom-color: #e2c997 !important;
}

.whisky-select option {
  background-color: #242731; /* 選項背景也要深色 */
  color: #fff;
}

/* 禁用狀態 */
.is-disabled {
  opacity: 0.3;
}

/* 重置按鈕 */
.reset-btn {
  background: transparent;
  border: 1px solid rgba(226, 201, 151, 0.4);
  color: #e2c997;
  padding: 8px 20px;
  border-radius: 30px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 1px;
  transition: all 0.3s;
  height: 40px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.reset-btn:hover {
  background: #e2c997;
  color: #1a1c23;
  box-shadow: 0 0 15px rgba(226, 201, 151, 0.3);
}

/* 響應式調整 */
@media (max-width: 768px) {
  .filter-glass-card {
    border-radius: 20px;
    padding: 20px;
  }
}
</style>
