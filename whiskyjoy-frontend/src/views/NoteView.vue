<template>
  <div class="product-page-wrapper">
    <Filter @update-filters="applyFilters" />

    <ProductList :filteredProducts="paginatedProducts" />

    <div
      v-if="totalPages > 1"
      class="pagination-container d-flex justify-content-center py-5"
    >
      <button
        class="pagination-btn"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        <i class="bi bi-arrow-left"></i> 上一頁
      </button>

      <span class="page-number px-4">
        {{ currentPage }} / {{ totalPages }}
      </span>

      <button
        class="pagination-btn"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        下一頁 <i class="bi bi-arrow-right"></i>
      </button>
    </div>
  </div>
</template>

<script>
import Filter from "@/components/Filter.vue";
import ProductList from "@/components/ProductList.vue";
import { mapActions } from "vuex";

export default {
  components: { Filter, ProductList },
  data() {
    return {
      filters: { country: "", region: "", category: "" },
      filteredProducts: [], // 這是過濾後的「完整」清單
      // 💡 這裡新增分頁變數
      currentPage: 1,
      itemsPerPage: 12, // 一頁顯示 12 支，剛好是桌面版 4 欄 x 3 列
    };
  },
  computed: {
    // 💡 核心邏輯 1：計算總頁數
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    },
    // 💡 核心邏輯 2：計算「當前這一頁」該顯示哪幾支產品
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredProducts.slice(start, end);
    },
  },
  methods: {
    ...mapActions(["fetchProducts"]),
    applyFilters(filters) {
      this.filters = filters;
      this.currentPage = 1; // 💡 重點：切換篩選條件時，必須強制跳回第一頁
      this.getFilteredProducts();
    },
    async getFilteredProducts() {
      await this.fetchProducts();

      this.filteredProducts = this.$store.getters.allProducts.filter(
        (product) => {
          return (
            (!this.filters.country ||
              product.country_name_zh === this.filters.country) &&
            (!this.filters.region ||
              product.region_name_zh === this.filters.region) &&
            // 💡 修正這裡：將 product.category 改為 product.category_name_zh
            (!this.filters.category ||
              product.category_name_zh === this.filters.category)
          );
        },
      );
    },
    // 💡 換頁方法
    changePage(page) {
      this.currentPage = page;
      // 換頁後自動捲回頂部，這對使用者體驗很重要
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  },
  mounted() {
    this.getFilteredProducts();
  },
};
</script>

<style scoped>
/* 為了搭配你的 Whisky 質感，加一點簡單的樣式 */
.pagination-container {
  background-color: #1a1c23; /* 對齊你的背景色 */
}
.pagination-btn {
  background: transparent;
  border: 1px solid #e2c997;
  color: #e2c997;
  padding: 8px 20px;
  border-radius: 50px;
  transition: 0.3s;
}
.pagination-btn:hover:not(:disabled) {
  background: #e2c997;
  color: #000;
}
.pagination-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.page-number {
  color: #fff;
  font-weight: 300;
  letter-spacing: 2px;
}
</style>
