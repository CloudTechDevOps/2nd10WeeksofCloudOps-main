pipeline {
    agent any
    parameters {
        string(name: 'ACTION', defaultValue: 'apply', description: 'Terraform action: apply or destroy')    
    }
    stages {
        stage('Checkout from Git'){
            steps{
                echo 'git checkout'
            }
        }
        stage('Terraform version'){
             steps{
                 sh 'terraform --version'
             }
        }
        stage('Terraform init'){
             steps{
                 dir('eks-terraform') {
                 sh 'terraform init --reconfigure'  
                }
             }
        }
        stage('Terraform validate'){
             steps{
                 dir('eks-terraform') {
                      sh 'terraform validate'
                   }
             }
        }
        stage('Terraform plan'){
             steps{
                 dir('eks-terraform') {
                      sh 'terraform plan'
                   }
             }
        }
        stage('Terraform apply/destroy'){
              steps{
                  dir('eks-terraform') {
                       sh "terraform ${params.ACTION} -auto-approve"
                   }
              }
         }
    }
}
