# Base Node.js Image
FROM node:20-slim

# Working Directory inside container
WORKDIR /app

# Copy package dependencies
COPY package*.json ./

# Install npm packages
RUN npm install --include=optional

# Copy frontend source code
COPY . .

# Expose Vite dev port
EXPOSE 5173

# Start Vite server for container
CMD ["npm", "run", "dev", "--", "--host"]