# AI-Assisted Research Project & Publication Tracker

## 1. Project Overview

The AI-Assisted Research Project & Publication Tracker is a web-based application designed to help researchers manage their research projects and publications in one place.

The system provides authentication, role-based access control, project management, publication management, user management, search, and pagination.

The application has a FastAPI backend, React frontend, and SQLite database.

---

## 2. Main Features

### Authentication
- User login using username and password
- JWT-based authentication
- Secure password hashing using bcrypt
- Protected API endpoints

### Role-Based Access Control
The system supports two roles:

- Admin
- Researcher

Admins can:
- Manage users
- Create, view, update, and delete users
- Manage projects and publications

Researchers can:
- View projects
- Create and manage publications
- Access researcher-level functionality

### Project Management
- Create research projects
- View research projects
- Update projects
- Delete projects
- Track project status
- Associate projects with users

### Publication Management
- Create publications
- View publications
- Update publications
- Delete publications
- Store authors, journal, publication year, DOI, and project information

### Search
Users can search:
- Projects by title
- Publications by title, author, or journal

### Pagination
The frontend provides pagination for:
- Projects
- Publications

---

## 3. Technologies Used

### Backend
- Python
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic
- JWT Authentication
- Passlib / bcrypt

### Frontend
- React
- JavaScript
- Vite
- CSS

### Development Tools
- Visual Studio Code
- Uvicorn
- npm

---

## 4. Project Structure

```text
AI Research tracker
│
├── main.py
├── database.py
├── models.py
├── schemas.py
├── research_tracker.db
│
├── routers
│   ├── auth.py
│   ├── project.py
│   ├── publication.py
│   ├── user.py
│   └── roles.py
│
├── frontend
│   ├── src
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md