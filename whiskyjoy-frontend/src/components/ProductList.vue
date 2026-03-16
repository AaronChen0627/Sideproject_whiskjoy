<template>
  <div class="product-grid-container py-5">
    <div class="container">
      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        <router-link
          v-for="product in filteredProducts"
          :key="product.id"
          :to="`/product/${product.product_name_en.replace(/\s+/g, '-')}`"
          class="col text-decoration-none"
        >
          <div class="whisky-card">
            <div class="card-img-wrapper">
              <img
                :src="product.product_image_url"
                class="product-img"
                :alt="product.product_name_zh"
              />
              <div class="img-overlay"></div>
            </div>

            <div class="card-content">
              <span class="category-tag">{{
                product.category_name_zh || "Single Malt"
              }}</span>
              <p class="en-title">{{ product.product_name_en }}</p>
              <h5 class="zh-title">{{ product.product_name_zh }}</h5>

              <div class="info-footer">
                <span class="region">
                  <i class="bi bi-geo-alt-fill me-1"></i>
                  {{ product.country_name_zh }}
                  <template v-if="product.region_name_zh">
                    · {{ product.region_name_zh }}</template
                  >
                </span>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    filteredProducts: Array,
  },
};
</script>

<style scoped>
/* 容器背景：對齊 About 頁面的深炭藍 */
.product-grid-container {
  background-color: #1a1c23;
  min-height: 100vh;
}

/* 威士忌卡片核心樣式 */
.whisky-card {
  background-color: #242731; /* 層次深灰藍 */
  border: 1px solid rgba(226, 201, 151, 0.1);
  border-radius: 20px;
  overflow: hidden;
  height: 100%;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  position: relative;
}

.whisky-card:hover {
  transform: translateY(-10px);
  border-color: #e2c997;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4), 0 0 15px rgba(226, 201, 151, 0.1);
}

/* 圖片處理 */
.card-img-wrapper {
  position: relative;
  background: #fff; /* 酒瓶圖片通常是白底，這裡用白色承接 */
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow: hidden;
}

.product-img {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
  transition: transform 0.6s ease;
  z-index: 2;
}

.whisky-card:hover .product-img {
  transform: scale(1.1);
}

/* 圖片下方的裝飾陰影 */
.img-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40%;
  background: linear-gradient(to top, rgba(36, 39, 49, 1), transparent);
  z-index: 1;
}

/* 內容區 */
.card-content {
  padding: 1.5rem;
  text-align: left; /* 改為靠左對齊更具現代感 */
}

.category-tag {
  display: inline-block;
  font-size: 0.65rem;
  color: #e2c997;
  border: 1px solid #e2c997;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 0.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.en-title {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 0.3rem;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.zh-title {
  font-size: 1.1rem;
  color: #fff;
  font-weight: 600;
  margin-bottom: 1rem;
  line-height: 1.4;
  height: 3rem; /* 固定高度防止排版跳動 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.info-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 0.8rem;
  display: flex;
  align-items: center;
}

.region {
  font-size: 0.8rem;
  color: #e2c997;
  opacity: 0.8;
}

/* 移除預設連結藍色 */
.text-decoration-none {
  text-decoration: none;
}
</style>
