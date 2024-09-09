resource "aws_db_instance" "rds" {
  allocated_storage      = 20
  identifier = "book-rds"
  db_subnet_group_name   = aws_db_subnet_group.sub-grp.id
  engine                 = "mysql"
  engine_version         = "8.0.32"
  instance_class         = "db.t3.micro"
  multi_az               = true
  db_name                = "mydb"
  username               = "admin"
  password               = "srivardhan"
  skip_final_snapshot    = true
  vpc_security_group_ids = [aws_security_group.security-group.id]
  depends_on = [ aws_db_subnet_group.sub-grp ]
  publicly_accessible = true
  backup_retention_period = 7

  
  tags = {
    DB_identifier = "book-rds"
  }
}

resource "aws_db_subnet_group" "sub-grp" {
  name       = "main"
  subnet_ids = [aws_subnet.public-subnet1.id, aws_subnet.public-subnet2.id]

  tags = {
    Name = "My DB subnet group"
  }
}
