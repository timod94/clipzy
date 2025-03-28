#!/bin/bash
LOG_FILE="/var/log/clipzy_frontend_user_data.log"
exec > >(tee -a $LOG_FILE) 2>&1
echo "Starting to prepare Clipzy Frontend setup at $(date)"

# Install dependencies
apt-get update -y
apt-get upgrade -y
apt-get install -y docker.io docker-compose git nodejs
usermod -aG docker ubuntu
systemctl enable docker
systemctl start docker

# Clone repo
git clone https://github.com/timod94/clipzy /home/ubuntu/clipzy

# Configure environment
cat <<EOT > /home/ubuntu/clipzy/.env
VITE_API_URL=http://${backend_ip}:5000
EOT

echo "Frontend setup prepared at $(date)"