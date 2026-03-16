<template>
  <div class="product-detail-wrapper py-5">
    <div class="container">
      <div v-if="product" class="row align-items-center gx-lg-5">
        <div class="col-md-6 mb-5 mb-md-0">
          <div class="whisky-display-box">
            <div class="back-glow"></div>
            <img
              :src="product.product_image_url"
              alt="Product Image"
              class="img-fluid whisky-main-img"
            />
          </div>
        </div>

        <div class="col-md-6 text-start">
          <div class="whisky-info-card">
            <span class="whisky-label">WHISKY SELECTION</span>
            <h1 class="whisky-title mt-2">{{ product.product_name_zh }}</h1>
            <p class="whisky-subtitle text-white-50">
              {{ product.product_name_en }}
            </p>

            <div class="whisky-specs mt-5">
              <div class="spec-row">
                <span class="label">COUNTRY / 國家</span>
                <span class="value">{{ product.country_name_zh }}</span>
              </div>
              <div class="spec-row">
                <span class="label">REGION / 區域</span>
                <span class="value">{{ product.region_name_zh || "N/A" }}</span>
              </div>
              <div class="spec-row">
                <span class="label">CATEGORY / 種類</span>
                <span class="value">{{ product.category_name_zh }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-5">
        <div class="spinner-border text-amber" role="status"></div>
        <p class="text-amber mt-3">細心品味，資料載入中...</p>
      </div>

      <div class="section-divider my-5"></div>

      <div class="comment-wrapper">
        <CommentSection
          v-if="product"
          :productId="product.id"
          :currentUserId="currentUserId"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CommentSection from "@/components/CommentSection.vue"; // 引入評論元件

export default {
  props: ["productName"],
  components: {
    CommentSection,
  },
  computed: {
    ...mapGetters(["allProducts", "currentUser"]), // 獲取產品列表與當前用戶
    product() {
      // 根據 URL 中的 productName 匹配對應的產品
      if (this.allProducts.length === 0) {
        return null;
      }
      return this.allProducts.find(
        (product) =>
          product.product_name_en.replace(/\s+/g, "-") === this.productName,
      );
    },
    currentUserId() {
      return this.currentUser?.id || null; // 當前用戶 ID
    },
  },
  watch: {
    // 監聽 allProducts 改變，並觸發對應的處理
    allProducts(newVal) {
      if (newVal.length > 0) {
        this.product = this.allProducts.find(
          (product) =>
            product.product_name_en.replace(/\s+/g, "-") === this.productName,
        );
      }
    },
  },
  mounted() {
    // 確保頁面加載時獲取產品數據
    if (this.allProducts.length === 0) {
      this.$store.dispatch("fetchProducts"); // 確保發送請求獲取產品資料
    }
  },
};
</script>

<style scoped>
/* 主背景：對齊深夜炭藍 */
.product-detail-wrapper {
  background-color: #1a1c23;
  color: #fff;
  min-height: 100vh;
}

/* 左側圖片展示區 */
.whisky-display-box {
  position: relative;
  background: radial-gradient(
    circle at center,
    rgba(226, 201, 151, 0.08) 0%,
    transparent 70%
  );
  padding: 40px;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.whisky-main-img {
  max-height: 500px;
  object-fit: contain;
  /* 增加陰影讓酒瓶有立體感 */
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.5));
  z-index: 2;
}

.back-glow {
  position: absolute;
  width: 250px;
  height: 250px;
  background-color: #e2c997;
  filter: blur(120px);
  opacity: 0.15;
  z-index: 1;
}

/* 右側文字資訊 */
.whisky-label {
  color: #e2c997;
  font-size: 0.75rem;
  letter-spacing: 4px;
  font-weight: 700;
  border-bottom: 2px solid #e2c997;
  padding-bottom: 5px;
}

.whisky-title {
  font-size: 2.8rem;
  font-weight: 800;
  line-height: 1.2;
}

.whisky-subtitle {
  font-size: 1.1rem;
  font-style: italic;
  letter-spacing: 1px;
}

/* 規格清單：仿精品排版 */
.whisky-specs {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.spec-row {
  display: flex;
  flex-direction: column;
  border-left: 2px solid rgba(226, 201, 151, 0.3);
  padding-left: 15px;
}

.spec-row .label {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 1px;
}

.spec-row .value {
  font-size: 1.25rem;
  color: #fff;
  font-weight: 500;
}

/* 分隔線 */
.section-divider {
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    rgba(226, 201, 151, 0.3),
    transparent
  );
}

.text-amber {
  color: #e2c997;
}

/* 評論區容器微調 */
.comment-wrapper {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

/* 響應式 */
@media (max-width: 768px) {
  .whisky-title {
    font-size: 2rem;
  }
  .whisky-display-box {
    padding: 20px;
  }
}
</style>
