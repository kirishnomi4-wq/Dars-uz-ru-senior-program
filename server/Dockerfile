# dars-api — LMS serverida ishga tushirish uchun image (Node 22, PostgreSQL 16 tashqarida).
# Yig'ish:   docker build -t dars-api:local --build-arg GIT_SHA=$(git rev-parse --short HEAD) .
# Ishlatish: docker-compose.deploy.yml (postgres + migrate + api + backup)
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
COPY migrations ./migrations
COPY tools ./tools
COPY data ./data
ARG GIT_SHA=unknown
ENV GIT_SHA=$GIT_SHA
# Konteyner ichida hamma interfeysga tinglaydi; tashqariga faqat compose/proksi chiqaradi.
ENV HOST=0.0.0.0
ENV PORT=3001
USER node
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3001/api/v1/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "src/index.js"]
