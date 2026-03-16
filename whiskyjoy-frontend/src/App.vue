<template>
  <div id="app-container">
    <Header />

    <main>
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<script>
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default {
  name: "App",
  components: {
    Header,
    Footer,
  },
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  min-height: 100%;
  width: 100%;
  background-color: #000;
  overflow-x: hidden;
}

#app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.5);
}

main {
  flex: 1;
  width: 100%;
  /* --- 關鍵修正 --- */
  margin-top: 0; /* 移除推擠，讓內容直接從座標 (0,0) 開始，也就是頂到天 */
  display: block;
}

footer {
  width: 100%;
  flex-shrink: 0;
  background-color: #000;
}
</style>
