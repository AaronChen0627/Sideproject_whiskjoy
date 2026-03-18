<template>
  <div class="admin-page-wrapper">
    <div class="admin-card p-4 p-md-5">
      <div class="text-center mb-4">
        <h2 class="admin-title fw-bold">ADD NEW PRODUCT</h2>
        <p class="admin-subtitle text-white-50">新增威士忌品項至資料庫</p>
      </div>

      <form @submit.prevent="handleSubmit" class="admin-form">
        <div class="col-12 mb-4">
          <label class="admin-label">產品照片</label>
          <div
            class="product-upload-box d-flex flex-column align-items-center justify-content-center"
            @click="$refs.fileInput.click()"
            :class="{ 'has-img': product_image_url }"
          >
            <img
              v-if="product_image_url"
              :src="getFullUrl(product_image_url)"
              class="product-preview"
            />
            <div v-else class="text-center text-white-50">
              <i class="bi bi-image fs-1 mb-2"></i>
              <p>點擊上傳威士忌瓶身照片</p>
            </div>
            <input
              type="file"
              ref="fileInput"
              hidden
              @change="handleFileUpload"
              accept="image/*"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="admin-label"
              >中文名稱 <span class="text-danger">*</span></label
            >
            <input
              type="text"
              v-model="product_name_zh"
              class="whisky-input"
              placeholder="例如：百富 12年"
              required
            />
          </div>
          <div class="col-md-6 mb-3">
            <label class="admin-label"
              >英文名稱 <span class="text-danger">*</span></label
            >
            <input
              type="text"
              v-model="product_name_en"
              class="whisky-input"
              placeholder="例如：Balvenie 12Y"
              required
            />
          </div>

          <div class="col-md-6 mb-3">
            <label class="admin-label"
              >品牌 <span class="text-danger">*</span></label
            >
            <select
              v-model="brand_id"
              class="whisky-input select-dark"
              required
            >
              <option value="" disabled>請選擇品牌</option>
              <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                {{ brand.brand_name_zh }} ({{ brand.brand_name_en }})
              </option>
            </select>
          </div>

          <div class="col-md-6 mb-3">
            <label class="admin-label"
              >類別 <span class="text-danger">*</span></label
            >
            <select
              v-model="category_id"
              class="whisky-input select-dark"
              required
            >
              <option value="" disabled>請選擇類別</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.category_name_zh }}
              </option>
            </select>
          </div>

          <div class="col-md-6 mb-3">
            <label class="admin-label"
              >國家 <span class="text-danger">*</span></label
            >
            <select
              v-model="country_id"
              @change="handleCountryChange"
              class="whisky-input select-dark"
              required
            >
              <option value="" disabled>請選擇國家</option>
              <option v-for="c in countries" :key="c.id" :value="c.id">
                {{ c.country_name_zh }}
              </option>
            </select>
          </div>

          <div class="col-md-6 mb-3" v-if="availableRegions.length > 0">
            <label class="admin-label"
              >區域 <span class="text-danger">*</span></label
            >
            <select
              v-model="region_id"
              class="whisky-input select-dark"
              required
            >
              <option value="" disabled>請選擇產區</option>
              <option v-for="r in availableRegions" :key="r.id" :value="r.id">
                {{ r.region_name_zh }}
              </option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          class="btn whisky-btn-primary w-100 rounded-pill py-3 mt-4"
          :disabled="isUploading"
        >
          <span
            v-if="isUploading"
            class="spinner-border spinner-border-sm me-2"
          ></span>
          {{ isUploading ? "圖片上傳中..." : "確認新增產品" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      product_name_zh: "",
      product_name_en: "",
      product_image_url: "",
      brand_id: "",
      country_id: "",
      region_id: "",
      category_id: "",
      isUploading: false,

      // 用來存放從 DB 撈回來的資料
      brands: [],
      categories: [],
      countries: [],
    };
  },
  computed: {
    // 根據選擇的國家，動態過濾出對應的產區
    availableRegions() {
      if (!this.country_id) return [];
      const selectedCountry = this.countries.find(
        (c) => c.id === this.country_id,
      );
      return selectedCountry && selectedCountry.regions
        ? selectedCountry.regions
        : [];
    },
  },
  async created() {
    // 元件建立時，一口氣把三個選單的資料撈回來
    await Promise.all([
      this.fetchBrands(),
      this.fetchCategories(),
      this.fetchCountries(),
    ]);
  },
  methods: {
    // --- 獲取下拉選單資料 ---
    async fetchBrands() {
      try {
        const res = await axios.get("/api/brands");
        this.brands = res.data.data || res.data.brands || [];
      } catch (e) {
        console.error("獲取品牌失敗", e);
      }
    },
    async fetchCategories() {
      try {
        const res = await axios.get("/api/categories");
        this.categories = res.data.data || res.data.categories || [];
      } catch (e) {
        console.error("獲取類別失敗", e);
      }
    },
    async fetchCountries() {
      try {
        const res = await axios.get("/api/countries");
        this.countries = res.data.data || res.data.countries || [];
      } catch (e) {
        console.error("獲取國家失敗", e);
      }
    },

    // --- 處理邏輯 ---
    handleCountryChange() {
      // 當國家改變時，清空已經選擇的產區
      this.region_id = "";
    },

    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.isUploading = true;
      const formData = new FormData();
      formData.append("file", file); // 這裡的 "file" 要對應後端的 upload.single("file")

      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.post("/api/products/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("後端回傳的完整資料:", res.data);

        // ✅ 修正重點：將 .url 改成 .imageUrl
        if (res.data && res.data.imageUrl) {
          this.product_image_url = res.data.imageUrl;
        }
      } catch (e) {
        console.error("上傳失敗細節:", e.response);
        alert(e.response?.data?.message || "圖片上傳失敗");
      } finally {
        this.isUploading = false;
      }
    },

    getFullUrl(path) {
      const baseUrl =
        process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";
      return `${baseUrl}${path}`;
    },

    async handleSubmit() {
      if (!this.product_image_url) {
        return alert("請先上傳產品圖片");
      }

      // 如果該國家有產區，但使用者沒選，阻擋送出
      if (this.availableRegions.length > 0 && !this.region_id) {
        return alert("請選擇產區");
      }

      try {
        const token = sessionStorage.getItem("token");
        await axios.post(
          "/api/products",
          {
            product_name_zh: this.product_name_zh,
            product_name_en: this.product_name_en,
            product_image_url: this.product_image_url,
            country_id: this.country_id,
            region_id: this.region_id || null, // 如果沒產區就傳 null
            category_id: this.category_id,
            brand_id: this.brand_id,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        alert("產品新增成功！");
        this.$router.push("/note"); // 根據你的路由設定調整跳轉頁面
      } catch (e) {
        alert("新增失敗：" + (e.response?.data?.message || e.message));
      }
    },
  },
};
</script>

<style scoped>
/* 樣式保持你原來的酷炫設計 */
.admin-page-wrapper {
  min-height: 100vh;
  background: #0a0a0a;
  padding: 60px 20px;
  color: white;
}
.admin-card {
  max-width: 850px;
  margin: auto;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(226, 201, 151, 0.2);
  border-radius: 35px;
  backdrop-filter: blur(20px);
}
.admin-title {
  color: #e2c997;
  letter-spacing: 3px;
}
.admin-label {
  color: #e2c997;
  font-size: 0.8rem;
  font-weight: 600;
  margin-left: 10px;
  margin-bottom: 8px;
  display: block;
}
.product-upload-box {
  width: 100%;
  height: 250px;
  background: rgba(0, 0, 0, 0.4);
  border: 2px dashed rgba(226, 201, 151, 0.3);
  border-radius: 20px;
  cursor: pointer;
  transition: 0.3s;
  overflow: hidden;
}
.product-upload-box:hover {
  border-color: #e2c997;
  background: rgba(226, 201, 151, 0.05);
}
.product-preview {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 15px;
}
.whisky-input {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(226, 201, 151, 0.2) !important;
  color: white !important;
  border-radius: 12px;
  padding: 12px;
  width: 100%;
}
.whisky-input:focus {
  border-color: #e2c997 !important;
  box-shadow: 0 0 10px rgba(226, 201, 151, 0.2);
  outline: none;
}
/* 下拉選單特別處理 */
.select-dark option {
  background-color: #1a1a1a;
  color: #fff;
}
.whisky-btn-primary {
  background: linear-gradient(135deg, #e2c997 0%, #b89a5e 100%) !important;
  color: black !important;
  border: none;
  font-weight: bold;
}
</style>
