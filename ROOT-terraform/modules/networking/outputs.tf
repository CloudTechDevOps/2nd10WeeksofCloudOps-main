output "vpc_id" {
  description = "VPC ID."
  value       = aws_vpc.book-vpc.id
}

output "public_subnet_ids" {
  description = "Public subnet IDs."
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "Private subnet IDs."
  value       = aws_subnet.private[*].id
}

output "security_group_id" {
  description = "Shared security group ID."
  value       = aws_security_group.allow_all.id
}

output "jumphost_public_ip" {
  description = "Public IP address of the jumphost server."
  value       = aws_instance.jumphost.public_ip
}
