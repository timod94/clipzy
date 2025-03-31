# Clipzy

Clipzy is a platform for securely uploading, viewing and sharing videos. Users can upload their videos, which are then only visible on their profile page. A share button can be used to generate a video share page where they can be shared securely with others.

## Technologies

### Frontend
- **React + Vite** (modern, high-performance web app)
- CSS** (styling)
- **Video.js** (for optimized video playback)
- **CloudFront** (CDN for efficient provision of videos)

### Backend
- **Node.js + Express** (REST API for authentication and video management)
- MongoDB** (database, stored as a volume in AWS)
- Auth.js, JWT, Google Auth** (authentication)
- AWS S3** (cloud storage for videos and thumbnails)
- **FFmpeg** (generation of thumbnails from videos)
- Terraform** (infrastructure as code for deployment)
- **Docker Compose** (containerization for the entire application)

## Installation

1. **Clone repository:**
   ```bash
   git clone https://github.com/timod94/clipzy.git
   ```

2. start **Docker container:**
   ```bash
   docker-compose up --build
   ```
   This starts the application and MongoDB in separate containers.

3 **More configurations:**
   - Set environment variables** (database connections, AWS credentials etc.)
   - Configure domain names**
   - **Set up AWS services such as S3 and CloudFront**


## Features
- Secure video management**: Only the user sees his uploaded videos.
- **Video gallery**: All own videos on the profile page.
- **Share function**: Generation of a secure video share page via button.
- **Optimized playback**: Use of Video.js and CloudFront for best possible performance.
- Scalable infrastructure**: Automated deployment with Terraform.

## License
MIT License


