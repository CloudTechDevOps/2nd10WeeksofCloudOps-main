resource "aws_vpc" "book-vpc" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "eks-vpc"
  }
}

resource "aws_internet_gateway" "books-ig" {
  vpc_id = aws_vpc.book-vpc.id

  tags = {
    Name = "eks-igw"
  }
}

resource "aws_subnet" "public" {
  count = length(var.public_subnet_cidrs)

  vpc_id                  = aws_vpc.book-vpc.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "eks-public-${count.index + 1}"
  }
}

resource "aws_subnet" "private" {
  count = length(var.private_subnet_cidrs)

  vpc_id            = aws_vpc.book-vpc.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name = "eks-private-${count.index + 1}"
  }
}

resource "aws_eip" "nat" {
  domain = "vpc"

  tags = {
    Name = "eks-nat-eip"
  }
}

resource "aws_nat_gateway" "books-nat" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public[0].id

  tags = {
    Name = "eks-nat"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.book-vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.books-ig.id
  }

  tags = {
    Name = "eks-public-rt"
  }
}

resource "aws_route_table_association" "public" {
  count = length(aws_subnet.public)

  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.book-vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.books-nat.id
  }

  tags = {
    Name = "eks-private-rt"
  }
}

resource "aws_route_table_association" "private" {
  count = length(aws_subnet.private)

  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}

resource "aws_security_group" "allow_all" {
  name        = "allow-all-sg"
  description = "Allow all inbound and outbound traffic"
  vpc_id      = aws_vpc.book-vpc.id

  ingress {
    description = "Allow all inbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "allow-all-sg"
  }
}

resource "aws_instance" "jumphost" {
  ami                    = var.jumphost_ami_id
  instance_type          = var.jumphost_instance_type
  # key_name               = var.jumphost_key_name
  subnet_id              = aws_subnet.public[0].id
  vpc_security_group_ids = [aws_security_group.allow_all.id]
  user_data              = var.install_tools_user_data

  root_block_device {
    volume_size = 30
  }

  tags = {
    Name = var.jumphost_name
  }
}
