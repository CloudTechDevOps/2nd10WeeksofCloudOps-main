-- crate a amazon-linux ec2 instance and connect to the instance

-- create a rds  mysql database for this project

-- install the git,docker and docker compose by follwing commands.run the following commands individually
```sh
sudo yum install git -y
sudo yum install docker -y #linux 2023
sudo usermod -aG docker ec2-user
newgrp docker
sudo service docker start
sudo chmod 777 /var/run/docker.sock
docker version
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose version
``` 
-- after above process clone the repo by follwing command
```sh   
git clone https://github.com/CloudTechDevOps/2nd10WeeksofCloudOps-main.git
```  
-- switch to repo 
```sh    
cd 2nd10WeeksofCloudOps-main
```  
-- edit the config.js file in follwing path vi clinet/src/pages/config.js
```javascript
// const API_BASE_URL = "http://25.41.26.237:84"; // on live backend server which is running on port 84
const API_BASE_URL = "http://publicip:portNumber";
export default API_BASE_URL;
-- pasate your publicip and port {http://public-ip:86}
```
make sure you EDIT above file depends on your scenario


-- update the rds detailes in docker-compose.yaml

-- after completeing the above process just run docker compose file by following command
```sh    
docker-compose up -d
```   
-- for above command will deploy the frontend,backend containers

-- next install the mariadb or mysql on your servr for database inilize purpose 
```sh    
sudo yum install mariadb105-server -y
```    
--after that chaange into you project backend dirictroy then run the follwing command 
```sh    
mysql -h <rds-end-point> -u admin -p<passowrd> < test.sql
mysql -h book-rds.c1u4kewc6r37.ap-south-1.rds.amazonaws.com -u admin -pveeranarni < test.sql   ## example command chamge the values
```    
-- then search the public-ip:84 port in broswer you will get the appliaction deployment then add the book
    --------------------------THANKYOU------------------------------------------------------------
