#  TaskFlow - Project Task Manager

<div align="center">

![TaskFlow Logo](https://img.shields.io/badge/TaskFlow-Project%20Manager-blue?style=for-the-badge&logo=clipboard)

**A modern full-stack application for managing projects and tasks with authentication**

[![Java](https://img.shields.io/badge/Java-17-orange?style=flat-square&logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=flat-square&logo=docker)](https://www.docker.com/)

</div>

---

##  Demo Video

 **[Watch Demo Video](YOUR_VIDEO_LINK_HERE)** - A quick walkthrough of the application features

---

##  Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)

---

##  Features

###  Authentication
- User registration and login
- JWT-based authentication
- Secure password encryption with BCrypt
- Protected API routes

###  Project Management
- Create, read, update, delete projects
- Project search functionality
- Track project progress
- View all projects in an organized dashboard

###  Task Management
- Full CRUD operations on tasks
- Task prioritization (Low, Medium, High, Urgent)
- Due date tracking
- Mark tasks as complete/incomplete
- Filter tasks by status (All, Pending, Completed, Overdue)
- Search tasks within a project

###  Progress Tracking
- Real-time progress calculation
- Visual progress bars
- Statistics dashboard
- Project status indicators

---

##  Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Java 17** | Programming language |
| **Spring Boot 3.2** | Application framework |
| **Spring Security** | Authentication & authorization |
| **Spring Data JPA** | Database access |
| **JWT (jjwt)** | Token-based authentication |
| **PostgreSQL** | Relational database |
| **Maven** | Build tool & dependency management |
| **Lombok** | Reduce boilerplate code |
| **SpringDoc OpenAPI** | API documentation |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **TypeScript** | Type-safe JavaScript |
| **Vite** | Build tool |
| **Tailwind CSS** | Styling |
| **React Router v6** | Navigation |
| **Axios** | HTTP client |
| **Headless UI** | Accessible components |
| **Heroicons** | Icons |
| **React Hot Toast** | Notifications |
| **date-fns** | Date utilities |

### DevOps
| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |
| **Nginx** | Reverse proxy & static files |

---

##  Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Frontend │────▶│  Spring Boot    │────▶│   PostgreSQL    │
│  (Port 3000)    │     │  (Port 8080)    │     │   (Port 5432)   │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │
        │                       │
        ▼                       ▼
   Tailwind CSS           JWT Security
   React Router           REST API
   Axios                  JPA/Hibernate
```

---

##  Prerequisites

Before you begin, ensure you have the following installed:

- **Java JDK 17+** - [Download](https://adoptium.net/)
- **Maven 3.9+** - [Download](https://maven.apache.org/download.cgi)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **PostgreSQL 14+** - [Download](https://www.postgresql.org/download/)
- **Docker & Docker Compose** (optional) - [Download](https://www.docker.com/products/docker-desktop/)

---

##  Installation & Setup

### Option 1: Using Docker Compose (Recommended)

The easiest way to run the entire stack:

```bash
# Clone the repository
git clone https://github.com/yourusername/project-task-manager.git
cd project-task-manager

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

Access the application:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html

### Option 2: Manual Setup

#### 1. Database Setup

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE taskmanager_db;

# Exit
\q
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies and run
./mvnw spring-boot:run

# Or build and run JAR
./mvnw clean package -DskipTests
java -jar target/project-task-manager-1.0.0.jar
```

The backend will start on **http://localhost:8080**

#### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on **http://localhost:3000**

---

##  Demo Credentials

Two demo accounts are created automatically:

| Email | Password | Role |
|-------|----------|------|
| `demo@taskmanager.com` | `demo123` | User |
| `admin@taskmanager.com` | `admin123` | Admin |

---

##  API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and get JWT token |

### Project Endpoints (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/projects` | Get all user projects |
| `GET` | `/api/projects/{id}` | Get project by ID |
| `POST` | `/api/projects` | Create new project |
| `PUT` | `/api/projects/{id}` | Update project |
| `DELETE` | `/api/projects/{id}` | Delete project |
| `GET` | `/api/projects/{id}/progress` | Get project progress |
| `GET` | `/api/projects/search?query=` | Search projects |

### Task Endpoints (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/projects/{id}/tasks` | Get all tasks |
| `GET` | `/api/projects/{id}/tasks/{taskId}` | Get task by ID |
| `POST` | `/api/projects/{id}/tasks` | Create new task |
| `PUT` | `/api/projects/{id}/tasks/{taskId}` | Update task |
| `DELETE` | `/api/projects/{id}/tasks/{taskId}` | Delete task |
| `PATCH` | `/api/projects/{id}/tasks/{taskId}/toggle` | Toggle completion |
| `PATCH` | `/api/projects/{id}/tasks/{taskId}/complete` | Mark as complete |
| `GET` | `/api/projects/{id}/tasks/overdue` | Get overdue tasks |
| `GET` | `/api/projects/{id}/tasks/search?query=` | Search tasks |

### Interactive API Documentation

Visit **http://localhost:8080/swagger-ui.html** for interactive API documentation.

---

## Project Structure

```
project-task-manager/
├── backend/
│   ├── src/main/java/com/taskmanager/
│   │   ├── config/           # Security, OpenAPI configs
│   │   ├── controller/       # REST controllers
│   │   ├── dto/              # Request/Response DTOs
│   │   │   ├── request/
│   │   │   └── response/
│   │   ├── entity/           # JPA entities
│   │   ├── exception/        # Custom exceptions
│   │   ├── repository/       # JPA repositories
│   │   ├── security/         # JWT components
│   │   └── service/          # Business logic
│   ├── src/main/resources/
│   │   └── application.yml   # Configuration
│   ├── src/test/             # Unit tests
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── auth/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   ├── projects/
│   │   │   └── tasks/
│   │   ├── contexts/         # React contexts
│   │   ├── services/         # API services
│   │   ├── types/            # TypeScript types
│   │   ├── utils/            # Utility functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

##  Configuration

### Backend Configuration (`application.yml`)

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/taskmanager_db
    username: postgres
    password: postgres

jwt:
  secret: YOUR_SECRET_KEY
  expiration: 86400000  # 24 hours
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SPRING_DATASOURCE_URL` | Database URL | `jdbc:postgresql://localhost:5432/taskmanager_db` |
| `SPRING_DATASOURCE_USERNAME` | DB username | `postgres` |
| `SPRING_DATASOURCE_PASSWORD` | DB password | `postgres` |
| `JWT_SECRET` | JWT signing key | (configured in app) |
| `JWT_EXPIRATION` | Token validity (ms) | `86400000` |

---

##  Running Tests

### Backend Tests

```bash
cd backend
./mvnw test
```

### Frontend Tests

```bash
cd frontend
npm run test
```

---

##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

##  Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)

---

<div align="center">


</div>
