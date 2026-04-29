# FROM node:18

# WORKDIR /app

# COPY . .

# RUN npm install
# RUN npm run build

# RUN npm install -g http-server

# EXPOSE 3000

# CMD ["http-server", "build", "-p", "3000"]

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
