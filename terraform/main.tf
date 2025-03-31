provider "aws" {
  region = "eu-central-1"
}

resource "aws_instance" "clipzy_app" {
  ami           = "ami-0caef02b518350c8b" # Ubuntu 22.04
  instance_type = "t2.medium"
  key_name      = var.key_name
  security_groups = [aws_security_group.clipzy_sg.name]

  user_data = <<-EOF
              #!/bin/bash
              set -e

              # Docker installieren
              apt-get update
              apt-get install -y docker.io docker-compose
              usermod -aG docker ubuntu
              systemctl enable docker
              systemctl start docker
              
              # App klonen
              git clone https://github.com/timod94/clipzy /home/ubuntu/clipzy
              cd /home/ubuntu/clipzy
              
              # Umgebungsvariablen setzen
              cat > .env <<EOL
              MONGO_URI=mongodb://mongo:27017/clipzy
              FRONTEND_URL=http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
              PORT=5000
              NODE_ENV=production
              EOL
              
              # Container manuell starten
              # .env bearbeiten
              EOF

  tags = {
    Name = "clipzy-all-in-one"
  }
}

resource "aws_security_group" "clipzy_sg" {
  name = "clipzy-all-in-one-sg"
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
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
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
}

resource "aws_eip" "clipzy_eip" {
  instance = aws_instance.clipzy_app.id
  depends_on = [aws_instance.clipzy_app]
}

variable "key_name" {
  description = "SSH Key Pair Name"
  type        = string
  default     = "home"
}
