# Reverse Proxy & Backend Setup (Amazon Linux)

This repository contains an Nginx reverse-proxy configuration that serves a React frontend and proxies API requests to a backend at private IP `172.31.23.9`.

This README explains how to install Nginx on Amazon Linux, deploy the provided `proxy.conf`, deploy a React build to Nginx, and set up a sample Node.js backend on an Amazon Linux instance (the backend expected at `172.31.23.9`).

## Files
- proxy.conf — Nginx server block (this file)

## Behavior summary (from `proxy.conf`)
- Listens on port 80.
- Routes requests starting with `/api/` to `http://172.31.23.9/`.
  - Example: `GET /api/books` -> proxied to `http://172.31.23.9/books`.
- Serves a React single-page app from `/usr/share/nginx/html` and falls back to `index.html` for client routes.


## Install Nginx on Amazon Linux 2
Run the following on the public-facing EC2 (nginx) instance.

### After cloneing your your config.js file url must be /api only
once chek in your config file
```
const API_BASE_URL = "/api";  // dont change it.

```
```bash
sudo yum update -y
sudo yum install -y nginx
# Enable and start nginx
sudo systemctl enable --now nginx
```
```bash
sudo vi /etc/nginx/conf.d/reverse-proxy.conf
```
# Verify
2. Test and reload nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Notes about the included `proxy.conf`:
- The `location ^~ /api/` block uses `proxy_pass http://172.31.23.9/;` so requests like `/api/foo` are forwarded to `http://172.31.23.9/foo` (the `/api/` prefix is removed). This is intentional to keep backend routes unchanged.

## Deploy React build to Nginx
On the machine where you build the React app (or directly on the nginx server):

```bash
# build (on your dev machine or CI)
npm install
npm run build

# Copy the build files to nginx root on the nginx host
sudo rm -rf /usr/share/nginx/html/*
sudo cp -r build/* /usr/share/nginx/html/

# reload nginx
sudo systemctl reload nginx
```

If your React app expects the app to be served at `/` this config will work as-is because the `location /` block uses `try_files` to return `index.html` for client routes.

## Sample Backend Setup (Amazon Linux) — Node.js / Express
These instructions create a minimal API that listens on port 80 and matches the `proxy_pass` target.
