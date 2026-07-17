FROM node:20-alpine AS builder
WORKDIR /app

# Kopyahin muna ang package files at prisma folder
COPY package*.json ./
COPY prisma ./prisma                 # <-- IMPORTANT: Kopyahin ang prisma folder bago mag-install

# Ngayon mag-install ng dependencies (tatakbo ang prisma generate)
RUN npm install

# Kopyahin ang natitirang files
COPY . .

# Build ang Next.js at i-compile ang server
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/server ./server
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
