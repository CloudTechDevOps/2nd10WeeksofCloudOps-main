### Docker file MySQL ##

# Use the official MySQL image from the Docker Hub
FROM mysql:8.0

# Expose MySQL port
EXPOSE 3306

# Copy the initialization script to the container
COPY test.sql /docker-entrypoint-initdb.d/

# Start MySQL server
CMD ["mysqld"]
