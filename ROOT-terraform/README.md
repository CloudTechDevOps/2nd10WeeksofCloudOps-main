## process
- switch to envs
- change the required terrafrom.tfvars vales
- terraform commands
```
terraform init
terraform
terraform apply
```
- after that ,network,database,eks  will be created
- if you want to run indivuduallly
  ```
  terraform apply -target=module.networking
  terraform apply -target=module.eks
  terraform apply -target=module.database
  ```
