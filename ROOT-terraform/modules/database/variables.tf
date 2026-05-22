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

variable "private_subnet_ids" {
  description = "Private subnet IDs for the DB subnet group."
  type        = list(string)
}

variable "vpc_security_group_ids" {
  description = "Security group IDs attached to the RDS instance."
  type        = list(string)
}

variable "allocated_storage" {
  description = "Allocated RDS storage in GB."
  type        = number
  default     = 20
}

variable "engine" {
  description = "Database engine."
  type        = string
  default     = "mysql"
}

variable "engine_version" {
  description = "Database engine version."
  type        = string
  default     = "8.4.8"
}

variable "instance_class" {
  description = "RDS instance class."
  type        = string
  default     = "db.t3.micro"
}
