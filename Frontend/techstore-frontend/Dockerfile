FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
# Copy toàn bộ code mới nhất
COPY . .
# Ép buộc Next.js xóa mọi cache và build lại sạch sẽ
RUN rm -rf .next && npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
# Đảm bảo lệnh chạy server đúng
CMD ["npm", "start"]