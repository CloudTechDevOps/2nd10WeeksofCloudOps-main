terraform {
  required_providers {
    aws = {
        source = "hashicorp/aws"
        version = ">= 5.25.0"
    }
  }

  backend "s3" {
    bucket = "veerasir22"
    key    = "eks/terraform.tfstate"
    region = "ap-southeast-2"
  }

  required_version = ">= 1.6.3"
}
