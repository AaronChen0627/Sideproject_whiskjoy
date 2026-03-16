# 使用官方的 Node.js 镜像作为基础镜像
FROM node:18 AS build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目文件到容器
COPY . .

# 构建 Vue 应用
RUN npm run build

# 使用 nginx 作为生产环境的服务器
FROM nginx:alpine

# 复制构建后的文件到 nginx 的静态资源目录
COPY --from=build /app/dist /usr/share/nginx/html

# 暴露 80 端口
EXPOSE 80

# 启动 nginx 服务器
CMD ["nginx", "-g", "daemon off;"]

