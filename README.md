# Clipzy

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
   ```bash
   git clone https://github.com/timod94/clipzy.git
   ```

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

