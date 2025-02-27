# Use Node.js Alpine as a lightweight base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Set environment variable for React to use the correct port
ENV PORT=9001

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

# Expose the correct port
EXPOSE 9001

# Run the React app
CMD ["pnpm", "start"]
