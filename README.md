# Clipzy

Clipzy is a platform for sharing and watching videos. Users can upload and view videos, with authentication. The videos are stored on AWS S3, and thumbnails are generated using FFmpeg.

## Technologies
- **Frontend**: React+Vite, CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: Auth.js, JWT, Google Auth
- **Containerization**: Docker Compose (for MongoDB and the full web app)
- **Cloud Storage**: AWS S3 (for videos and thumbnails)
- **Thumbnails**: Generated with FFmpeg

## Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/timod94/clipzy.git

2. Build and run the containers with Docker Compose:
    ```bash
    docker-compose up --build

3. This will start the application and MongoDB in seperate containers

For more details, you'll need to configure environment variables, set up domain names, and configure any cloud services like AWS.