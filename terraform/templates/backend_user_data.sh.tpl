#!/bin/bash
LOG_FILE="/var/log/clipzy_backend_user_data.log"
exec > >(tee -a $LOG_FILE) 2>&1
echo "Starting Clipzy Backend setup at $(date)"

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
cat <<EOT > /home/ubuntu/clipzy/backend/.env
BACKEND_URL=http://${aws_eip.clipzy_backend_eip.public_ip}:5000
FRONTEND_URL=http://${frontend_ip}:5173
MONGO_URI=mongodb://localhost:27017/clipzy
EOT

# Start services
cd /home/ubuntu/clipzy
docker-compose up -d

echo "Backend setup completed at $(date)"