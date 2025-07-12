# Hack4Impact-UMD Application Portal

This repository contains the source code for the Hack4Impact-UMD application portal.

## 📂 Directory Structure

### Frontend

```
frontend/
├── public/              # Static assets
└── src/
    ├── components/      # Reusable React components
    ├── config/          # Firebase and React Query configuration
    ├── contexts/        # React contexts for state management
    ├── hooks/           # Custom React hooks
    ├── lib/             # Utility functions
    ├── pages/           # Top-level page components
    ├── services/        # Services for interacting with the backend
    ├── types/           # TypeScript type definitions
    └── utils/           # Miscellaneous utility functions
```

### Backend

```
backend/
└── functions/
    ├── src/
    │   ├── middleware/  # Express middleware
    │   ├── models/      # Data models
    │   ├── routes/      # API routes
    │   ├── types/       # TypeScript type definitions
    │   └── utils/       # Utility functions
    └── lib/             # Compiled JavaScript code
```

## 🚀 Building and Running Locally

### Frontend

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```

### Backend

1.  Navigate to the `backend/functions` directory:
    ```bash
    cd backend/functions
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Build the project:
    ```bash
    npm run build
    ```
4.  Run the Firebase emulators:
    ```bash
    npm run serve
    ```