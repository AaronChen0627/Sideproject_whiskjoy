const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // 💡 1. 代理 API：讓前端 8080 能連到後端 3000 的資料庫邏輯
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      // 💡 2. 代理圖片：讓前端 8080 能連到後端 3000 的圖片檔案
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: { '^/uploads': '/uploads' }
      }
    }
  }
});