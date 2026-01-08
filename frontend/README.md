# CoEdit Frontend

A modern, real-time collaborative document editing application built with React, Vite, and Tailwind CSS.

## Features

- **Real-time Collaboration**: Edit documents simultaneously with other users using WebSocket connections
- **User Authentication**: Secure login and registration with JWT tokens
- **Document Management**: Create, edit, delete, and organize documents
- **Permission System**: Share documents with specific users as viewers or editors
- **Version History**: Track changes and restore previous versions
- **Comments**: Add and manage comments on documents
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router 7** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS 4** - Utility-first CSS framework
- **SockJS + STOMP** - WebSocket for real-time features
- **PropTypes** - Runtime type checking

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, fonts, etc.
│   ├── components/        # Reusable UI components
│   │   ├── auth/          # Authentication components
│   │   ├── common/        # Shared components (Button, Input, Modal, etc.)
│   │   └── layout/        # Layout components (Navbar, etc.)
│   ├── context/           # React context providers
│   │   ├── AuthContext.jsx
│   │   ├── DocumentContext.jsx
│   │   └── NotificationContext.jsx
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   │   ├── Dashboard.jsx
│   │   ├── DocumentEditor.jsx
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   ├── Register.jsx
│   │   ├── SharedDocs.jsx
│   │   └── NotFound.jsx
│   ├── routes/            # Route configuration
│   ├── services/          # API and WebSocket services
│   ├── styles/            # Global styles
│   └── utils/             # Utility functions and constants
├── .env.example           # Environment variables template
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
└── README.md              # This file
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on `http://localhost:8005`

### Installation

1. Clone the repository and navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create environment file:

   ```bash
   cp .env.example .env
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## API Integration

The frontend connects to a Spring Boot backend API:

- **Base URL**: `http://localhost:8005/api`
- **WebSocket**: `http://localhost:8005/ws`

### API Endpoints

| Endpoint                      | Method | Description              |
| ----------------------------- | ------ | ------------------------ |
| `/auth/login`                 | POST   | User login               |
| `/auth/register`              | POST   | User registration        |
| `/auth/me`                    | GET    | Get current user         |
| `/documents`                  | GET    | List user's documents    |
| `/documents`                  | POST   | Create document          |
| `/documents/{id}`             | GET    | Get document by ID       |
| `/documents/{id}`             | PUT    | Update document          |
| `/documents/{id}`             | DELETE | Delete document          |
| `/documents/{id}/permissions` | GET    | Get document permissions |
| `/documents/{id}/permissions` | POST   | Add permission           |
| `/documents/{id}/comments`    | GET    | Get document comments    |
| `/documents/{id}/comments`    | POST   | Add comment              |
| `/documents/{id}/versions`    | GET    | Get version history      |

## WebSocket Topics

- `/topic/document/{documentId}` - Document edit events
- `/topic/document/{documentId}/cursors` - Cursor position updates
- `/topic/document/{documentId}/presence` - User presence notifications

## Environment Variables

| Variable        | Description      | Default                    |
| --------------- | ---------------- | -------------------------- |
| `VITE_API_URL`  | Backend API URL  | `http://localhost:8005`    |
| `VITE_WS_URL`   | WebSocket URL    | `http://localhost:8005/ws` |
| `VITE_APP_NAME` | Application name | `CoEdit`                   |

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License.
