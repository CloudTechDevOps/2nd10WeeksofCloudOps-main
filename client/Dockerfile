# FROM node:18 AS build

# # Set the working directory
# WORKDIR /app

# # Copy package.json and package-lock.json
# COPY package.json package-lock.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the application code
# COPY . .
# #ENV REACT_APP_API_BASE_URL=http://backend

# # Build the React application
# RUN npm run build

# # Stage 2: Serve the application with Apache HTTP Server
# FROM httpd:2.4
# #RUN echo 'ServerName http://backend' >> /usr/local/apache2/conf/httpd.conf

# # Copy the build output from the previous stage
# COPY --from=build /app/build /usr/local/apache2/htdocs/

# # Expose port 80
# EXPOSE 80

# # Start Apache HTTP Server
# CMD ["httpd-foreground"]

# Stage 1: Build React App
FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve with Apache HTTP Server
FROM httpd:2.4

# Copy the build output from the previous stage
COPY --from=build /app/build /usr/local/apache2/htdocs/

# Copy the startup script
# COPY entrypoint.sh /entrypoint.sh
# RUN chmod +x /entrypoint.sh

# Expose port 80
EXPOSE 80

# Run the script before starting Apache
 CMD ["httpd-foreground"]

#CMD ["/entrypoint.sh"]
