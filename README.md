# Latern

Latern is an educational platform designed to help students and beginners learn how to write mathematical expressions using LaTeX.

The project focuses on making LaTeX math notation accessible through interactive exercises, guided hints, domain-based learning paths, and progression tracking.

Instead of learning LaTeX syntax by reading documentation, users learn by practicing directly inside the application.

## Tech Stack

### Backend

* Python 3.13
* Django
* Django Ninja
* PostgreSQL
* Docker / Docker Compose

### Frontend

* Next.js
* React
* TypeScript
* KaTeX

---

# Getting Started

## Prerequisites

Make sure you have installed:

* Docker
* Docker Compose

---

# Installation

## 1. Clone the repository

```bash
git clone <repository-url>
cd latern
```

---

## 2. Start the containers

```bash
docker compose up --build
```

This will start:

* the Django backend
* the PostgreSQL database

---

## 3. Run database migrations

Open another terminal:

```bash
docker compose exec backend uv run python manage.py migrate
```

---

## 4. Create a superuser

```bash
docker compose exec backend uv run python manage.py createsuperuser
```

---

## 5. Access the application

### Django Admin

```txt
http://localhost:8000/admin
```

### API Documentation (Swagger)

```txt
http://localhost:8000/api/docs
```

---

# Database Access

The PostgreSQL container is exposed locally on port `5432`.

You can connect using tools such as DBeaver with the following credentials:

| Field    | Value     |
| -------- | --------- |
| Host     | localhost |
| Port     | 5432      |
| Database | latern    |
| Username | latern    |
| Password | latern    |

---

# API Overview (not finished yet)

## Authentication

| Method | Endpoint        |
| ------ | --------------- |
| POST   | `/api/register` |
| POST   | `/api/login`    |
| POST   | `/api/logout`   |
| GET    | `/api/me`       |

## Exercises

| Method | Endpoint                      |
| ------ | ----------------------------- |
| GET    | `/api/exercises`              |
| GET    | `/api/exercises/{id}`         |
| POST   | `/api/exercises/{id}/attempt` |
| GET    | `/api/me/progress`            |


---

# Vision

Latern aims to become a modern learning platform for mathematical writing and technical note-taking using LaTeX.

The long-term goal is to provide:

* adaptive learning paths
* domain-specific exercise systems
* gamification
* collaborative exercise creation
* advanced LaTeX training workflows
