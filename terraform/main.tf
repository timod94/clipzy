provider "aws" {
  region = "eu-central-1"
}

#####################
# VPC & Netzwerk    #
#####################

resource "aws_vpc" "clipzy_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true

  tags = {
    Name = "clipzy-vpc"
  }
}

resource "aws_internet_gateway" "clipzy_igw" {
  vpc_id = aws_vpc.clipzy_vpc.id

  tags = {
    Name = "clipzy-igw"
  }
}

resource "aws_subnet" "clipzy_public_subnet" {
  vpc_id                  = aws_vpc.clipzy_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "eu-central-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "clipzy-public-subnet"
  }
}

resource "aws_route_table" "clipzy_public_rt" {
  vpc_id = aws_vpc.clipzy_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.clipzy_igw.id
  }

  tags = {
    Name = "clipzy-public-rt"
  }
}

resource "aws_route_table_association" "clipzy_public_association" {
  subnet_id      = aws_subnet.clipzy_public_subnet.id
  route_table_id = aws_route_table.clipzy_public_rt.id
}

#####################
# Security Group    #
#####################

resource "aws_security_group" "clipzy_sg" {
  name        = "clipzy-all-in-one-sg"
  description = "Security group for Clipzy application"
  vpc_id      = aws_vpc.clipzy_vpc.id

  ingress {
    description = "Clipzy backend"
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Clipzy frontend"
    from_port   = 5173
    to_port     = 5173
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "MongoDB (restricted to VPC)"
    from_port   = 27017
    to_port     = 27017
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.clipzy_vpc.cidr_block]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["149.172.2.94/32"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "clipzy-sg"
  }
}

#####################
# EC2 Instance      #
#####################

resource "aws_instance" "clipzy_app" {
  ami                    = "ami-0caef02b518350c8b"
  instance_type          = "t2.micro"
  key_name               = var.key_name
  subnet_id              = aws_subnet.clipzy_public_subnet.id
  vpc_security_group_ids = [aws_security_group.clipzy_sg.id]

  user_data = <<-EOF
    #!/bin/bash
    set -e

    apt-get update
    apt-get install -y docker.io docker-compose git

    usermod -aG docker ubuntu
    systemctl enable docker
    systemctl start docker

    git clone https://github.com/timod94/clipzy /home/ubuntu/clipzy

    while [ ! -e /dev/xvdf ]; do sleep 1; done

    if ! blkid /dev/xvdf; then
      mkfs.ext4 /dev/xvdf
    fi

    cd /home/ubuntu/clipzy
    mkdir -p data/db
    mount /dev/xvdf /home/ubuntu/clipzy/data/db

    echo "/dev/xvdf /home/ubuntu/clipzy/data/db ext4 defaults,nofail 0 2" >> /etc/fstab

    cat > /home/ubuntu/clipzy/.env <<EOL
    MONGO_URI=mongodb://mongo:27017/clipzy
    FRONTEND_URL=http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
    PORT=5000
    NODE_ENV=production
    EOL

  EOF

  tags = {
    Name = "clipzy-all-in-one"
  }
}

#####################
# Elastic IP        #
#####################

resource "aws_eip" "clipzy_eip" {
  instance   = aws_instance.clipzy_app.id
  depends_on = [aws_instance.clipzy_app]
}

#####################
# EBS Volume        #
#####################

resource "aws_ebs_volume" "clipzy_mongo_volume" {
  availability_zone = aws_instance.clipzy_app.availability_zone
  size              = 10
  type              = "gp3"


  tags = {
    Name = "clipzy-mongo-volume"
  }
}

resource "aws_volume_attachment" "clipzy_mongo_attach" {
  device_name = "/dev/xvdf"
  volume_id   = aws_ebs_volume.clipzy_mongo_volume.id
  instance_id = aws_instance.clipzy_app.id
}

#####################
# Output Values     #
#####################

output "clipzy_public_ip" {
  value = aws_eip.clipzy_eip.public_ip
}

output "clipzy_instance_id" {
  value = aws_instance.clipzy_app.id
}

#####################
# Variables         #
#####################

variable "key_name" {
  description = "SSH Key Pair Name"
  type        = string
  default     = "home"
}