FROM node:20-alpine

WORKDIR /app

# Install all dependencies (including dev) to build
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the TypeScript project
RUN npm run build

# Use production only dependencies
RUN npm prune --production

EXPOSE 3000

CMD ["node", "dist/arbitrator.js"]
