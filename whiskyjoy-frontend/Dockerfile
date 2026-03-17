# --- 第一階段：構建 ---
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- 第二階段：生產運行 ---
FROM nginx:alpine

# 1. 複製你剛寫好的 nginx.conf (關鍵修改)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 2. 複製構建後的檔案
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]