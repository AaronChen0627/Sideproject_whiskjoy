<template>
  <div class="about-page">
    <section class="about-hero">
      <div
        class="hero-overlay d-flex align-items-center justify-content-center text-center"
      >
        <div class="hero-content">
          <h1 class="brand-title">WHISKY JOY</h1>
          <div class="title-underline"></div>
          <p class="brand-slogan">探索生命之水的奧秘</p>
        </div>
      </div>
    </section>

    <section class="container py-5">
      <div class="row align-items-center py-5">
        <div class="col-lg-6 mb-4 mb-lg-0">
          <div class="image-stack">
            <img
              src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop"
              alt="Whisky"
              class="main-img"
            />
            <div class="img-accent-border"></div>
          </div>
        </div>
        <div class="col-lg-6 ps-lg-5">
          <h2 class="section-title mb-4">關於 WHISKY JOY</h2>
          <p class="description">
            我們不是單純的紀錄工具，而是一個屬於「品味者」的靜謐角落。在 WHISKY
            JOY，每一張筆記都是對釀酒工藝的致敬。從蘇格蘭高地的清爽花香，到艾雷島沉穩的泥煤氣息，我們幫您鎖住那一抹稍縱即逝的微醺記憶。
          </p>
          <div class="brand-values d-flex gap-4 mt-4">
            <div class="value-item">
              <span class="value-num">01</span>
              <span class="value-text">真實紀錄</span>
            </div>
            <div class="value-item">
              <span class="value-num">02</span>
              <span class="value-text">深度交流</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="features-section py-5">
      <div class="container">
        <div class="row g-4">
          <div class="col-md-4" v-for="(item, index) in features" :key="index">
            <div class="feature-card">
              <div class="icon-box">{{ item.icon }}</div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      features: [
        {
          title: "品飲筆記",
          desc: "詳細紀錄色澤、聞香、口感與尾韻。",
          icon: "🥃",
        },
        { title: "社群互動", desc: "與全球同好交換品飲心得。", icon: "🤝" },
        { title: "窖藏管理", desc: "建立屬於您自己的數位酒窖。", icon: "🏛️" },
      ],
    };
  },
};
</script>

<style scoped>
/* 關鍵顏色定義 */
:root {
  --bg-deep: #1a1c23; /* 深炭灰藍 (代替純黑) */
  --bg-soft: #242731; /* 稍微亮的層次色 */
  --gold: #e2c997; /* 琥珀金 */
  --gold-dim: rgba(226, 201, 151, 0.6);
}

.about-page {
  background-color: #1a1c23; /* 深炭藍背景 */
  color: #e0e0e0;
  min-height: 100vh;
  font-family: "Playfair Display", serif;
}

/* 英雄區設計 */
.about-hero {
  height: 50vh;
  background-image: url("https://images.unsplash.com/photo-1551021211-139a9b7cd1b2?q=80&w=2000");
  background-size: cover;
  background-position: center;
  position: relative;
}

.hero-overlay {
  background: radial-gradient(
    circle,
    rgba(26, 28, 35, 0.7) 0%,
    rgba(26, 28, 35, 0.95) 100%
  );
  height: 100%;
}

.brand-title {
  color: var(--gold);
  font-size: 3.5rem;
  letter-spacing: 10px;
  margin-bottom: 0.5rem;
}

.title-underline {
  width: 60px;
  height: 3px;
  background: var(--gold);
  margin: 0 auto 1.5rem;
}

/* 圖片堆疊效果 */
.image-stack {
  position: relative;
  padding: 20px;
}

.main-img {
  width: 100%;
  border-radius: 8px;
  position: relative;
  z-index: 2;
  filter: grayscale(20%);
}

.img-accent-border {
  position: absolute;
  top: 0;
  right: 0;
  width: 80%;
  height: 80%;
  border: 2px solid var(--gold);
  z-index: 1;
  border-radius: 8px;
}

/* 文字排版 */
.section-title {
  color: var(--gold);
  font-weight: 700;
  letter-spacing: 2px;
}

.description {
  line-height: 1.8;
  color: #b0b0b0;
  font-size: 1.1rem;
}

.value-num {
  color: var(--gold);
  font-size: 1.5rem;
  font-weight: bold;
  display: block;
}

/* 卡片設計 */
.features-section {
  background-color: #15171e; /* 稍微再深一點的藍 */
}

.feature-card {
  background: var(--bg-soft);
  padding: 3rem 2rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.4s ease;
  text-align: center;
}

.feature-card:hover {
  border-color: var(--gold);
  transform: translateY(-10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.icon-box {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.feature-card h3 {
  color: var(--gold);
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.feature-card p {
  color: #888;
  font-size: 0.9rem;
}
</style>
