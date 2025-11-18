   # 🚀 2ndWeeksofCloudOps - 3 tier Application

✨This repository is created to learn and deploy  3-tier application on aws cloud. this project contain three layer Presentation, Application and database

## 🏠 Architecture
![Architecture of the application](architecture.gif)

## Tech stack

- React 
- Nodejs
- MySQL


**Note**: You should have nodejs installed on your system. [Node.js](https://nodejs.org/)

👉 let install dependency to run react application


```
1.Create rds database into private subnets
2.Create two private  servers in private subnets one is for frontend and another one is for backend
3.Create two TG and loadbalncers one is for frontend another one is for backend 
4.Create both loadblancers in public subnets only and loadbalancer type s internet facing only becuser internal loadbalncer not working for our project 
```
### ->>connect to backend server--
```
 git clone https://github.com/CloudTechDevOps/2nd10WeeksofCloudOps-main.git
   cd backend
```
 ### edit the .env file in bellow path if u dont have any .env file just create in below path
```
2nd10WeeksofCloudOps-main.git/backend/.env

### add this mater
DB_HOST=book.rds.com	#change rds endpoint
DB_USERNAME=admin	#cahnge to nyour rds user name 
DB_PASSWORD="veera"   # change to your rds password
PORT=3306
```
```
yum install mariadb105-server
```
#### SSH into backend server and then run test.sql script from backend to create tables and records 
```
mysql -h book.rds.com -u admin -p<password> < test.sql
```

### Backend deploy process ###
```
sudo dnf install -y nodejs

cd backend

npm install

npm install -g pm2

pm2 start index.js --name node-app

pm2 startup

sudo systemctl enable pm2-root

pm2 save
```
#### after that create backend tg and loadbalncer and check your loadbalncer is giving hello response or not 


# ---------------------------------- FrontEnd---------------------------------------

 ### Frontend deploy process ###
```
git clone https://github.com/CloudTechDevOps/2nd10WeeksofCloudOps-main.git
cd client 
```
##### edit the config.js
```
vi client/src/pages/config.js
  
const API_BASE_URL = "http://api.narni.co.in";
 ````
in above line change to your backend loadbalncer url
const API_BASE_URL = "http://backend-loadbalancer-url";
```
sudo dnf install -y nodejs
```
### then go to client directory 
### run below commands

### ****(Use npm run build:
### When preparing the app for deployment (e.g., to a server or hosting service like AWS, Netlify, or Vercel).
### Use npm start:
### During development or to start the app in production (for backend apps).)*****
```
npm install 
npm run build
sudo cp -r build/* /var/www/html
```
# your frontend part is completed 

### #### after that create frontend tg and loadbalncer and check your loadbalncer is giving project output along with books 
# add the books 

**Thank you so much for reading..😅**
