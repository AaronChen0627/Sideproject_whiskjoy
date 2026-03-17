# 1. 使用輕量級的 node-slim
FROM node:18-slim

# 2. 設定工作目錄
WORKDIR /app

# 3. 複製依賴清單 (這裡不需要安裝 libvips-dev 了)
COPY package*.json ./

# 4. 安裝依賴 (單純的 JS 依賴安裝，非常快)
RUN npm install

# 5. 複製所有程式碼
COPY . .

# 6. 建立圖片儲存資料夾
RUN mkdir -p public/uploads/avatars public/uploads/products

# 7. 暴露端口
EXPOSE 3000

# 8. 啟動程式
CMD ["npm", "start"]