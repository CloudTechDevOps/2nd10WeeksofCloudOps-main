#!/bin/sh

# Replace the placeholder in JavaScript files with the environment variable value
find /usr/local/apache2/htdocs -type f -exec sed -i "s|REACT_APP_API_BASE_URL_PLACEHOLDER|${REACT_APP_API_BASE_URL}|g" {} \;

# Start Apache HTTP Server
httpd-foreground
