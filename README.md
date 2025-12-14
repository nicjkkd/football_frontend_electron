# Football Manager Client

A modern desktop application for managing football leagues, teams, and players. Built with Electron, React, and TypeScript.

## 🚀 Features

- **Dashboard**: Overview of your football management system.
- **League Management**: Create, update, and delete leagues.
- **Team Management**: Manage teams within leagues.
- **Player Management**: Add and track players.
- **Real-time Updates**: Live data synchronization using WebSockets.
- **Modern UI**: Sleek interface with Glassmorphism effects and Tailwind CSS.
- **Theme Support**: Full Dark and Light mode support.

## 🛠️ Tech Stack

- **Core**: [Electron](https://www.electronjs.org/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Routing**: [TanStack Router](https://tanstack.com/router)
- **State & Data**: [React Query](https://tanstack.com/query/latest)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) or **Bun**
- **npm** (usually comes with Node.js)

## ⚙️ Setup & Installation

1.  **Clone the repository** (if applicable) or navigate to the project directory.

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Backend Configuration**:
    The application connects to a backend server at `http://localhost:3000/api`. Ensure your backend service is running on this port before starting the client.

## 💻 Running the App

To start the application in development mode (with Hot Module Replacement):

```bash
npm run dev
```

This command will:

1.  Start the Vite development server for the React frontend.
2.  Launch the Electron window.

## 📦 Building for Production

To build the application for distribution, use the following commands based on your target platform:

- **macOS (Arm64):**

  ```bash
  npm run dist:mac
  ```

- **Windows (x64):**

  ```bash
  npm run dist:win
  ```

- **Linux (x64):**
  ```bash
  npm run dist:linux
  ```

The build artifacts (installers/executables) will be generated in the `dist` or `release` folder (depending on configuration).

## 📂 Project Structure

```
├── src/
│   ├── electron/        # Electron main process source code
│   │   ├── main.ts      # Main entry point for Electron
│   ├── ui/              # React frontend source code
│   │   ├── api/         # API integration (Axios calls)
│   │   ├── components/  # Reusable UI components
│   │   ├── constants.ts # Global constants (API URL, etc.)
│   │   ├── context/     # React Context providers (Theme, etc.)
│   │   ├── hooks/       # Custom React hooks
│   │   ├── routes/      # Application pages/routes
│   │   ├── main.tsx     # React entry point
│   │   └── index.css    # Global styles (Tailwind imports)
├── electron-builder.json # Configuration for building the app
├── package.json          # Project dependencies and scripts
├── vite.config.ts        # Vite configuration
└── tailwind.config.js    # Tailwind CSS configuration
```

## 🐛 Troubleshooting

- **API Connection Error**: If you see "Error fetching leagues", ensure your backend server is running on port 3000.
- **Native Module Errors**: If you encounter issues with native modules after switching Node versions, try running `npm rebuild` or deleting `node_modules` and re-installing.
