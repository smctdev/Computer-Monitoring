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

# Use a lightweight Node.js image to serve the static files
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Install a simple static file server
RUN npm install -g serve

# Copy the built files
COPY --from=build /app/build /app

# Expose port 9001
EXPOSE 9001

# Start the server
CMD ["serve", "-s", ".", "-l", "9001"]
