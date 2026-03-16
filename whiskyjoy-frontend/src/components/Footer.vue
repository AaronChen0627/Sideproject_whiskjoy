<template>
  <footer class="footer-container">
    <p class="footer-text">© Aaron 2026</p>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped>
.footer-container {
  /* 設定黑色底 */
  background-color: #000;
  /* 增加一點點頂部的細線，增加層次感 (選用) */
  border-top: 1px solid #222;

  /* 置中對齊 */
  display: flex;
  justify-content: center;
  align-items: center;

  /* 設定高度 */
  padding: 0.3rem 0;
  width: 100%;
}

.footer-text {
  /* 白灰色 */
  color: #888;
  font-size: 0.5rem;
  letter-spacing: 1px;
  margin: 0;
  /* 確保字體稍微輕一點更有質感 */
  font-weight: 300;
}
</style>
