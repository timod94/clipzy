terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    http = {
      source  = "hashicorp/http"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = "eu-central-1"
  default_tags {
    tags = {
      Project     = "Clipzy"
      Environment = "Production"
    }
  }
}

locals {
  project_name = "clipzy"
  common_tags = {
    Terraform   = "true"
    Environment = "production"
  }
}

data "http" "my_ip" {
  url = "https://ifconfig.me/ip"
}

module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "${local.project_name}-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["eu-central-1a", "eu-central-1b"]
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnets = []

  enable_nat_gateway = false
  enable_vpn_gateway = false

  tags = local.common_tags
}

resource "aws_security_group" "clipzy_web_sg" {
  name        = "${local.project_name}-web-sg"
  description = "Clipzy web security group"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["${chomp(data.http.my_ip.response_body)}/32"]
  }

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
    from_port   = 5000
    to_port     = 5000
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
    from_port   = 27017
    to_port     = 27017
    protocol    = "tcp"
    cidr_blocks = ["${chomp(data.http.my_ip.response_body)}/32"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.common_tags, {
    Name = "${local.project_name}-web-sg"
  })
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

#########################
# Elastic IPs zuerst definieren
#########################
resource "aws_eip" "clipzy_frontend_eip" {
  domain = "vpc"
  tags = merge(local.common_tags, {
    Name = "${local.project_name}-frontend-eip"
  })
}

resource "aws_eip" "clipzy_backend_eip" {
  domain = "vpc"
  tags = merge(local.common_tags, {
    Name = "${local.project_name}-backend-eip"
  })
}

#########################
# Frontend-Instanz
#########################
resource "aws_instance" "clipzy_frontend" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = "t2.micro"
  key_name                    = "home"
  vpc_security_group_ids      = [aws_security_group.clipzy_web_sg.id]
  subnet_id                   = module.vpc.public_subnets[0]
  associate_public_ip_address = true

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  user_data = templatefile("${path.module}/templates/frontend_user_data.sh.tpl", {
    backend_ip = aws_eip.clipzy_backend_eip.public_ip
  })

  tags = merge(local.common_tags, {
    Name = "${local.project_name}-frontend"
  })
}

#########################
# Backend-Instanz
#########################
resource "aws_instance" "clipzy_backend" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = "t2.micro"
  key_name                    = "home"
  vpc_security_group_ids      = [aws_security_group.clipzy_web_sg.id]
  subnet_id                   = module.vpc.public_subnets[1]
  associate_public_ip_address = true

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  user_data = templatefile("${path.module}/templates/backend_user_data.sh.tpl", {
    frontend_ip = aws_eip.clipzy_frontend_eip.public_ip
  })

  tags = merge(local.common_tags, {
    Name = "${local.project_name}-backend"
  })
}

#########################
# EIP-Zuordnung nachträglich
#########################
resource "aws_eip_association" "frontend_eip_assoc" {
  instance_id   = aws_instance.clipzy_frontend.id
  allocation_id = aws_eip.clipzy_frontend_eip.id
}

resource "aws_eip_association" "backend_eip_assoc" {
  instance_id   = aws_instance.clipzy_backend.id
  allocation_id = aws_eip.clipzy_backend_eip.id
}

#########################
# Outputs
#########################
output "frontend_public_ip" {
  value = aws_eip.clipzy_frontend_eip.public_ip
}

output "backend_public_ip" {
  value = aws_eip.clipzy_backend_eip.public_ip
}

output "ssh_command_frontend" {
  value = "ssh -i ~/.ssh/clipzy-key.pem ubuntu@${aws_eip.clipzy_frontend_eip.public_ip}"
}

output "ssh_command_backend" {
  value = "ssh -i ~/.ssh/clipzy-key.pem ubuntu@${aws_eip.clipzy_backend_eip.public_ip}"
}

output "application_urls" {
  value = {
    frontend = "http://${aws_eip.clipzy_frontend_eip.public_ip}:5173"
    backend  = "http://${aws_eip.clipzy_backend_eip.public_ip}:5000"
    mongo    = "mongodb://${aws_eip.clipzy_backend_eip.public_ip}:27017"
  }
}