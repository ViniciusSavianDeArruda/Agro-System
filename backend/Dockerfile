# Use official Node.js image as the base
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN pnpm run build

# Expose the port your app runs on (ajuste se necessário)
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
