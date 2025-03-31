# Clipzy

<<<<<<< HEAD
Clipzy ist eine Plattform zum sicheren Hochladen, Anschauen und Teilen von Videos. Nutzer können ihre Videos hochladen, die dann ausschließlich auf ihrer Profilseite sichtbar sind. Über einen Share-Button lässt sich eine Video-Share-Page generieren, über die sie sicher mit anderen geteilt werden können.

## Technologien

### Frontend
- **React + Vite** (moderne, performante Web-App)
- **CSS** (Styling)
- **Video.js** (für optimierte Videowiedergabe)
- **CloudFront** (CDN zur effizienten Bereitstellung der Videos)

### Backend
- **Node.js + Express** (REST API für Authentifizierung und Videoverwaltung)
- **MongoDB** (Datenbank, gespeichert als Volume in AWS)
- **Auth.js, JWT, Google Auth** (Authentifizierung)
- **AWS S3** (Cloud-Speicher für Videos und Thumbnails)
- **FFmpeg** (Generierung von Thumbnails aus Videos)
- **Terraform** (Infrastructure as Code für das Deployment)
- **Docker Compose** (Containerisierung für die gesamte Anwendung)

## Installation

1. **Repository klonen:**
=======
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
>>>>>>> refs/remotes/origin/main
   ```bash
   git clone https://github.com/timod94/clipzy.git
   ```

<<<<<<< HEAD
2. **Docker-Container starten:**
   ```bash
   docker-compose up --build
   ```
   Dies startet die Anwendung und MongoDB in separaten Containern.

3. **Weitere Konfigurationen:**
   - **Environment-Variablen setzen** (Datenbankverbindungen, AWS-Zugangsdaten etc.)
   - **Domainnamen konfigurieren**
   - **AWS-Dienste wie S3 und CloudFront einrichten**

## Features
- **Sichere Videoverwaltung**: Nur der Nutzer sieht seine hochgeladenen Videos.
- **Video-Galerie**: Alle eigenen Videos auf der Profilseite.
- **Teilen-Funktion**: Generierung einer sicheren Video-Share-Page per Button.
- **Optimierte Wiedergabe**: Nutzung von Video.js und CloudFront für bestmögliche Performance.
- **Skalierbare Infrastruktur**: Automatisiertes Deployment mit Terraform.

## Lizenz
MIT License
=======
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

>>>>>>> refs/remotes/origin/main

