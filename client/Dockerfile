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

# Serve with 'serve'
FROM node:16-alpine

WORKDIR /app

# Install 'serve'
RUN npm install -g serve

# Copy build output from previous stage
COPY --from=build /app/build /app/build

# Expose the port serve will run on
EXPOSE 9001

# Start the static file server
CMD ["serve", "-s", "build", "-l", "9001"]