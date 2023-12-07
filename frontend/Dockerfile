# Step 1: Use an official Node.js runtime as a parent image
FROM node:18

# Step 2: Set the working directory in the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json (or yarn.lock) files
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Bundle app source inside Docker image
COPY . .

# Step 6: Build the application for production
RUN npm run build

# Step 7: Use Nginx to serve the React application
FROM nginx:alpine

# Step 8: Copy the build output to replace the default Nginx contents.
COPY --from=0 /usr/src/app/build /usr/share/nginx/html

# Step 9: Expose port 80 to the outside once the container has launched
EXPOSE 80

# Step 10: Start Nginx and keep it running
CMD ["nginx", "-g", "daemon off;"]
