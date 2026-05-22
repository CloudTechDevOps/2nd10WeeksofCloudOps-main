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
  description = "Availability zones used by the public and private subnets."
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

# variable "jumphost_key_name" {
#   description = "EC2 key pair name for the public jumphost server."
#   type        = string
# }

variable "jumphost_name" {
  description = "Name tag for the public jumphost server."
  type        = string
}


variable "install_tools_user_data" {
  description = "User data script used to install tools on the public jumphost server."
  type        = string
}
