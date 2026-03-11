# ── Stage 1: install deps + generate Prisma client + compile ─────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

# Install all deps (including devDeps for tsc + ts-node)
RUN npm ci

COPY src ./src
COPY tsconfig.json ./

# Generate the Prisma client (writes to node_modules/.prisma)
# then compile TypeScript → dist/
RUN npx prisma generate && npm run build

# ── Stage 2: lean production image ───────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install production deps only (includes `prisma` for release_command)
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev

# Copy generated Prisma client from build stage
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy compiled application
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]
