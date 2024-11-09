# TRS-Archive

## Overview

A robust technical review system with a React + TypeScript frontend and Django REST framework backend, designed to streamline document review workflows for academic and research submissions in various fields of robotics.

## Key Features

- **Secure Authentication**: JWT-based login.
- **Role-Based Access**: Admin, Editor, and Reviewer roles with specific permissions.
- **Interactive Document Review**: Supports PDF uploads, text-based reviews, and threaded comments.
- **Real-Time Status Tracking**: Editors monitor review progress, and users receive updates.
- **Maintenance Mode**: Admin-configurable downtime message.

## Additional Features

- **User Management**: Admins can search, manage, and temporarily suspend users.
- **Categorization**: Organized categories and sub-categories, with dropdown and forum-style navigation.
- **User Profiles**: Profile pages include institute, position, and research area, viewable by others in read-only mode.
- **Submission Workflow**: Users submit articles; editors assign reviewers and track status.
- **Reviewer System**: Reviewers can provide text and PDF feedback; editors receive notifications on review completion.
- **Analytics for Editors**: Summary panels with submission metrics, reviewer activity, and graphical data.
- **Notifications & Timestamps**: Automated email updates and timestamps for key actions.

## Technology Stack

### Frontend
- React with TypeScript
- Vite build tool
- ESLint configuration

### Backend
- Django REST Framework
- JWT Authentication
- PostgreSQL
- Python Virtual Environment

### React + TypeScript Setup
- Vite configuration
- HMR enabled
- ESLint integration


## Quick Start

### Frontend Setup
```bash
cd "TRS WebSite"
npm install
npm run dev
```

### ESLint Configuration
```json
{
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "project": ["./tsconfig.json", "./tsconfig.node.json"],
    "tsconfigRootDir": "__dirname"
  }
}
```

### Backend Setup

#### Setup Virtual Environment
```bash
pip install virtualenv
virtualenv venv
source venv/bin/activate
```
#### Install dependencies
```bash
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers Pillow python-dotenv
```

#### Run the server
```bash
cd backend
python manage.py runserver
```

### Project Structure

TRS-archive/
├── backend/
│   ├── api/
│   │   ├── migrations/
│   │   ├── views/
│   │   └── models.py
│   └── manage.py
└── TRS WebSite/
    ├── src/
    ├── package.json
    └── vite.config.ts

### APIs

- /api/users/ - User management
- /api/categories/ - Category management
- /api/reviews/ - Review operations
- /api/posts/ - Post management
- /api/comments/ - Comment system

### Core Functionality

- Review Management System
- Document Version Control
- User Role Management
- Category & Subcategory Organization
- Comment Threading
- Status Tracking

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing
1. Fork the repository
2. Create a feature branch
3. Implement changes
4. Submit a pull request 