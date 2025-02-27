# Use the Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Install the dependencies
RUN npm install -g pnpm

# Copy package.json and package-lock.json (if present) to leverage Docker cache
COPY package.json pnpm-lock.yaml ./

# Install dependencies using npm
RUN pnpm install

# Copy the entire app code
COPY . .

# Expose the port for the application
EXPOSE 9001

# Start the application
CMD ["pnpm", "start"]