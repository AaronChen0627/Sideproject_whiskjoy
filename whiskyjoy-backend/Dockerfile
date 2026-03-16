# 建議使用 Node 18 以上，因為你的 mysql2 套件較新
FROM node:18-alpine

# 設定容器內的工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴 (只安裝生產環境需要的)
RUN npm install --production

# 複製所有代碼
COPY . .

# 確保 uploads 資料夾存在於 public 之下
RUN mkdir -p public/uploads

# 暴露 3000 端口
EXPOSE 3000

# 啟動應用程式 (會執行 node ./bin/www)
CMD ["npm", "start"]