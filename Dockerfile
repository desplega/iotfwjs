# Use node
FROM node:12.7.0-alpine

# Change working directory
WORKDIR /app

# To restart the app when edited
RUN npm install -g nodemon@1.19.1

# Copy installation package
COPY package.json /app/package.json

# Install dependencies
RUN npm install && npm ls
RUN mv /app/node_modules /node_modules

# Copy code
COPY . /app

# Expose API port to the outside
EXPOSE 80

# Launch application
CMD ["npm", "start"]