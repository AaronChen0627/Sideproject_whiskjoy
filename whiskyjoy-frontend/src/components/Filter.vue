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
              <option
                v-for="country in options.countries"
                :key="country"
                :value="country"
              >
                {{ country }}
              </option>
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
              <option
                v-for="region in options.regions"
                :key="region"
                :value="region"
              >
                {{ region }}
              </option>
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
              <option
                v-for="category in options.categories"
                :key="category"
                :value="category"
              >
                {{ category }}
              </option>
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
import axios from "axios"; // 如果你沒安裝 axios，可以用原生 fetch

export default {
  data() {
    return {
      selectedCountry: "",
      selectedRegion: "",
      selectedCategory: "",
      // 初始化為空陣列，等待 API 回傳
      options: {
        countries: [],
        regions: [],
        categories: [],
      },
    };
  },
  computed: {
    canSelectRegion() {
      return this.selectedCountry === "蘇格蘭";
    },
  },
  mounted() {
    // 組件掛載後立即執行
    this.getFilterData();
  },
  methods: {
    // 真正的 API 請求函數
    async getFilterData() {
      try {
        // 替換成你實際的 API EndPoint
        const response = await axios.get("/api/products/get-filters");
        console.log("API 回傳的篩選原始資料：", response.data);
        // 假設後端回傳格式為 { countries: [...], regions: [...], categories: [...] }
        if (response.data) {
          this.options = response.data;
        }
      } catch (error) {
        console.error("無法取得篩選選單資料:", error);
        // 這裡可以加入一些錯誤處理，例如顯示錯誤訊息
      }
    },

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
/* 保持你原本的所有 CSS 樣式，不做任何更動 */
.filter-wrapper {
  background-color: #1a1c23;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.filter-glass-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(226, 201, 151, 0.15);
  border-radius: 50px;
  padding: 15px 40px;
  display: flex;
  align-items: center;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.filter-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 140px;
}
.whisky-label {
  color: #e2c997;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  margin-bottom: 5px;
  margin-left: 10px;
}
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
  background-color: #242731;
  color: #fff;
}
.is-disabled {
  opacity: 0.3;
}
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
@media (max-width: 768px) {
  .filter-glass-card {
    border-radius: 20px;
    padding: 20px;
  }
}
</style>
