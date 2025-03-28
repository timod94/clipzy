#!/bin/bash

# Initialize Terraform
cd terraform
terraform init
terraform apply -auto-approve

# Get the output values
FRONTEND_IP=$(terraform output -raw frontend_public_ip)
BACKEND_IP=$(terraform output -raw backend_public_ip)

# Create environment files
cat > frontend/.env.production << EOL
VITE_API_URL=http://${BACKEND_IP}:5000
VITE_APP_URL=http://${FRONTEND_IP}:5173
EOL

cat > backend/.env.production << EOL
FRONTEND_URL=http://${FRONTEND_IP}:5173
MONGO_URI=mongodb://mongo:27017/clipzy
JWT_SECRET=${JWT_SECRET:-$(openssl rand -hex 32)}
SESSION_SECRET=${SESSION_SECRET:-$(openssl rand -hex 32)}
EOL

# Copy files to EC2 instances
echo "Copying frontend files..."
scp -i ~/.ssh/home.pem -r frontend docker-compose.frontend.yml ubuntu@${FRONTEND_IP}:~/clipzy/

echo "Copying backend files..."
scp -i ~/.ssh/home.pem -r backend docker-compose.backend.yml ubuntu@${BACKEND_IP}:~/clipzy/

echo "Deployment completed!"
echo "Frontend URL: http://${FRONTEND_IP}:5173"
echo "Backend URL: http://${BACKEND_IP}:5000"