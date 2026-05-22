terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.25.0"
    }
  }

 

  required_version = ">= 1.6.3"
}

provider "aws" {
  region = var.region
}


module "networking" {
  source = "../modules/networking"

  vpc_cidr                = var.vpc_cidr
  public_subnet_cidrs     = var.public_subnet_cidrs
  private_subnet_cidrs    = var.private_subnet_cidrs
  availability_zones      = var.availability_zones
  jumphost_ami_id         = var.jumphost_ami_id
  jumphost_instance_type  = var.jumphost_instance_type
  # jumphost_key_name       = var.jumphost_key_name
  jumphost_name           = var.jumphost_name
  install_tools_user_data = templatefile("${path.module}/install-tools.sh", {})
}

module "eks" {
  source = "../modules/eks"

  cluster_name         = var.cluster_name
  cluster_version      = var.cluster_version
  private_subnet_ids   = module.networking.private_subnet_ids
  public_subnet_id     = module.networking.public_subnet_ids[0]
  security_group_id    = module.networking.security_group_id
  node_instance_types  = var.node_instance_types
  node_desired_size    = var.node_desired_size
  node_max_size        = var.node_max_size
  node_min_size        = var.node_min_size
}

module "database" {
  source = "../modules/database"

  db_identifier          = var.db_identifier
  db_name                = var.db_name
  db_username            = var.db_username
  db_password            = var.db_password
  private_subnet_ids     = module.networking.private_subnet_ids
  vpc_security_group_ids = [module.networking.security_group_id]
  allocated_storage      = var.allocated_storage
  engine                 = var.engine
  engine_version         = var.engine_version
  instance_class         = var.instance_class
}
