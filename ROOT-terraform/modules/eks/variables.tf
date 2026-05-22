variable "cluster_name" {
  description = "EKS cluster name."
  type        = string
}

variable "cluster_version" {
  description = "EKS Kubernetes version."
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs for the EKS cluster and node group."
  type        = list(string)
}

variable "public_subnet_id" {
  description = "Public subnet ID for the EKS helper instance."
  type        = string
}

variable "security_group_id" {
  description = "Security group ID for the EKS helper instance."
  type        = string
}

variable "node_instance_types" {
  description = "Instance types for the EKS node group."
  type        = list(string)
  default     = ["t3.medium"]
}

variable "node_desired_size" {
  description = "Desired number of nodes."
  type        = number
  default     = 4
}

variable "node_max_size" {
  description = "Maximum number of nodes."
  type        = number
  default     = 6
}

variable "node_min_size" {
  description = "Minimum number of nodes."
  type        = number
  default     = 1
}

