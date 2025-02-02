# Use the official Node.js image with Alpine Linux
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your backend runs on
EXPOSE 5000

# Command to run the backend server
CMD ["node", "server.js"]