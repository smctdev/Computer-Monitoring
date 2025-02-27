# Use Node.js Alpine as a lightweight base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy only package.json and lock file first (for caching)
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Build the React app
RUN pnpm run build

# Install serve to serve the production build
RUN pnpm add -g serve

# Expose the correct port
EXPOSE 9001

# Run the production build using serve
CMD ["serve", "-s", "build", "-l", "9001"]
