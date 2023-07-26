# Use an official Node.js runtime as the base image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install --production

# Copy the rest of the app code to the working directory
COPY . .

# Expose the port that your Node.js app is listening on
EXPOSE 3000

# Set the command to run the app when the container starts
CMD ["node", "server.js"]
