FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies including serve
RUN npm ci --omit=dev && npm cache clean --force

# Copy source code and build
COPY . .
RUN npm run build

# Expose port
EXPOSE 3000

# Serve the built files
CMD ["npx", "serve", "-s", "dist", "-l", "3000"]