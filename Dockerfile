FROM node:20-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y git curl && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Hugging Face Spaces exposes port 7860
ENV PORT=7860
EXPOSE 7860

# Start WhatsApp Agent
CMD ["node", "dist/index.js"]
