provider "aws" {
  region = "eu-central-1"
}

# Variablen
variable "ssh_ip" {
  description = "Zulässige IP für SSH-Zugriff"
  default     = "149.172.2.94"
}

variable "key_name" {
  description = "Name des SSH Key Pairs"
  default     = "home"
}

# VPC Configuration
resource "aws_vpc" "clipzy_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "clipzy-vpc"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "clipzy_igw" {
  vpc_id = aws_vpc.clipzy_vpc.id

  tags = {
    Name = "clipzy-igw"
  }
}

# Public Subnets
resource "aws_subnet" "public_subnet_1" {
  vpc_id            = aws_vpc.clipzy_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "eu-central-1a"

  tags = {
    Name = "clipzy-public-subnet-1"
  }
}

resource "aws_subnet" "public_subnet_2" {
  vpc_id            = aws_vpc.clipzy_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "eu-central-1b"

  tags = {
    Name = "clipzy-public-subnet-2"
  }
}

# Route Table
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.clipzy_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.clipzy_igw.id
  }

  tags = {
    Name = "clipzy-public-rt"
  }
}

# Route Table Associations
resource "aws_route_table_association" "public_1" {
  subnet_id      = aws_subnet.public_subnet_1.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "public_2" {
  subnet_id      = aws_subnet.public_subnet_2.id
  route_table_id = aws_route_table.public_rt.id
}

# Security Groups
resource "aws_security_group" "frontend_sg" {
  name        = "frontend-sg"
  description = "Security group for frontend instance"
  vpc_id      = aws_vpc.clipzy_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5173
    to_port     = 5173
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.ssh_ip]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "frontend-sg"
  }
}

resource "aws_security_group" "backend_sg" {
  name        = "backend-sg"
  description = "Security group for backend instance"
  vpc_id      = aws_vpc.clipzy_vpc.id

  ingress {
    from_port       = 5000
    to_port         = 5000
    protocol        = "tcp"
    security_groups = [aws_security_group.frontend_sg.id]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.ssh_ip]
  }

  ingress {
    from_port   = 27017
    to_port     = 27017
    protocol    = "tcp"
    self        = true
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "backend-sg"
  }
}

# Elastic IPs
resource "aws_eip" "frontend_eip" {
  domain = "vpc"
  tags = {
    Name = "frontend-eip"
  }
}

resource "aws_eip" "backend_eip" {
  domain = "vpc"
  tags = {
    Name = "backend-eip"
  }
}

# EBS Volume for MongoDB
resource "aws_ebs_volume" "mongodb_data" {
  availability_zone = "eu-central-1b"
  size             = 20
  type             = "gp3"

  tags = {
    Name = "mongodb-data"
  }
}

# EC2 Instances
resource "aws_instance" "frontend" {
  ami           = "ami-0caef02b518350c8b" # Ubuntu 22.04 LTS
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.public_subnet_1.id
  associate_public_ip_address = true

  vpc_security_group_ids = [aws_security_group.frontend_sg.id]
  key_name               = var.key_name

  root_block_device {
    volume_size = 8
    volume_type = "gp3"
  }

  user_data = <<-EOF
              #!/bin/bash
              apt-get update -y
              apt-get upgrade -y
              apt-get install -y docker.io docker-compose git nodejs npm
              usermod -aG docker ubuntu
              systemctl enable docker
              systemctl start docker

              git clone https://github.com/timod94/clipzy /home/ubuntu/clipzy
              cd /home/ubuntu/clipzy/frontend
              npm install
              npm run build
              docker-compose up -d
              EOF

  tags = {
    Name = "frontend-instance"
  }
}

resource "aws_instance" "backend" {
  ami           = "ami-0caef02b518350c8b" # Ubuntu 22.04 LTS
  instance_type = "t2.small"
  subnet_id     = aws_subnet.public_subnet_2.id
  associate_public_ip_address = true

  vpc_security_group_ids = [aws_security_group.backend_sg.id]
  key_name               = var.key_name

  root_block_device {
    volume_size = 8
    volume_type = "gp3"
  }

  user_data = <<-EOF
              #!/bin/bash
              # Basisinstallation
              apt-get update -y
              apt-get upgrade -y
              apt-get install -y docker.io docker-compose git nodejs npm
              usermod -aG docker ubuntu
              systemctl enable docker
              systemctl start docker

              # EBS Volume vorbereiten
              mkfs -t ext4 /dev/sdf
              mkdir /data
              mount /dev/sdf /data
              echo "/dev/sdf /data ext4 defaults,nofail 0 2" >> /etc/fstab

              # Applikation
              git clone https://github.com/timod94/clipzy /home/ubuntu/clipzy
              cd /home/ubuntu/clipzy/backend
              docker-compose up -d
              EOF

  tags = {
    Name = "backend-instance"
  }
}

# EBS Volume Attachment
resource "aws_volume_attachment" "mongodb_data_att" {
  device_name = "/dev/sdf"
  volume_id   = aws_ebs_volume.mongodb_data.id
  instance_id = aws_instance.backend.id
  skip_destroy = true
}

# EIP Associations
resource "aws_eip_association" "frontend_eip_assoc" {
  instance_id   = aws_instance.frontend.id
  allocation_id = aws_eip.frontend_eip.id
}

resource "aws_eip_association" "backend_eip_assoc" {
  instance_id   = aws_instance.backend.id
  allocation_id = aws_eip.backend_eip.id
}

# Output Values
output "frontend_public_ip" {
  value = aws_eip.frontend_eip.public_ip
}

output "backend_public_ip" {
  value = aws_eip.backend_eip.public_ip
}