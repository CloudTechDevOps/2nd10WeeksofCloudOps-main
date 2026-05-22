output "db_instance_identifier" {
  description = "RDS instance identifier."
  value       = aws_db_instance.books-rds.identifier
}

output "db_endpoint" {
  description = "RDS endpoint."
  value       = aws_db_instance.books-rds.endpoint
}
