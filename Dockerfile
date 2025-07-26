# Use Node.js 18 on Ubuntu (most reliable)
FROM node:18-slim

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-dev \
    python3-distutils \
    python3-setuptools \
    build-essential \
    sqlite3 \
    libsqlite3-dev \
    wget \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies and rebuild sqlite3
RUN npm install && npm rebuild sqlite3 --build-from-source

# Copy application code
COPY . .

# Create directory for SQLite database
RUN mkdir -p /app/database

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/test || exit 1

# Start application
CMD ["npm", "start"]