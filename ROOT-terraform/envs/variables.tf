variable "region" {
  description = "AWS region."
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC."
  type        = string
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets."
  type        = list(string)
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets."
  type        = list(string)
}

variable "availability_zones" {
  description = "Availability zones used by subnets."
  type        = list(string)
}

variable "jumphost_ami_id" {
  description = "AMI ID for the public jumphost server."
  type        = string
}

variable "jumphost_instance_type" {
  description = "Instance type for the public jumphost server."
  type        = string
}

variable "jumphost_key_name" {
  description = "EC2 key pair name for the public jumphost server."
  type        = string
}

variable "jumphost_name" {
  description = "Name tag for the public jumphost server."
  type        = string
}

# variable "iam_role_name" {
#   description = "IAM role name for the public jumphost server."
#   type        = string
# }

# variable "iam_instance_profile_name" {
#   description = "IAM instance profile name for the public jumphost server."
#   type        = string
# }

variable "cluster_name" {
  description = "EKS cluster name."
  type        = string
}

variable "cluster_version" {
  description = "EKS Kubernetes version."
  type        = string
}

variable "node_instance_types" {
  description = "Instance types for the EKS node group."
  type        = list(string)
}

variable "node_desired_size" {
  description = "Desired number of EKS nodes."
  type        = number
}

variable "node_max_size" {
  description = "Maximum number of EKS nodes."
  type        = number
}

variable "node_min_size" {
  description = "Minimum number of EKS nodes."
  type        = number
}


variable "db_identifier" {
  description = "RDS instance identifier."
  type        = string
}

variable "db_name" {
  description = "Initial database name."
  type        = string
}

variable "db_username" {
  description = "RDS master username."
  type        = string
}

variable "db_password" {
  description = "RDS master password."
  type        = string
  sensitive   = true
}

variable "allocated_storage" {
  description = "Allocated RDS storage in GB."
  type        = number
}

variable "engine" {
  description = "Database engine."
  type        = string
}

variable "engine_version" {
  description = "Database engine version."
  type        = string
}

variable "instance_class" {
  description = "RDS instance class."
  type        = string
}
