# Use an official Node runtime as a parent image
FROM node:16-alpine AS build

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json to the working directory
COPY ./package*.json ./

# Install the dependencies
RUN npm install --force

# Copy the remaining application files to the working directory
COPY . .

# Build the application
RUN npm run build

# Install a simple HTTP server to serve static files
RUN npm install -g serve

EXPOSE 9001

CMD ["serve", "-s", "build", "-l", "9001"]