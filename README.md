# TaskMaster - Next.js Task Management Application

TaskMaster is a modern task management application built with Next.js, Prisma, and SQLite. It allows users to create teams, manage tasks, and collaborate efficiently.

![TaskMaster](https://via.placeholder.com/800x400?text=TaskMaster+Screenshot)

## Features

- 🔐 User authentication with email/password and GitHub
- 👥 Team creation and management
- ✅ Task management with priorities, statuses, and due dates
- 📋 Subtasks for breaking down complex tasks
- 📎 File attachments for tasks
- 🔔 Real-time notifications for task assignments
- 📱 Responsive design for all devices

## Table of Contents

- [Installation](#installation)
  - [Installing Node.js](#installing-nodejs)
  - [Setting up the project](#setting-up-the-project)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Database Management](#database-management)

## Installation

### Installing Node.js

If you don't have Node.js installed, follow these steps:

#### Windows

1. Download the Node.js installer from [nodejs.org](https://nodejs.org/)
   - Choose the LTS (Long Term Support) version for better stability
2. Run the installer and follow the installation wizard
3. Verify the installation by opening Command Prompt and typing:
   ```
   node --version
   npm --version
   ```

#### macOS

**Option 1: Using the installer**

1. Download the Node.js installer from [nodejs.org](https://nodejs.org/)
2. Run the installer and follow the instructions
3. Verify the installation by opening Terminal and typing:
   ```
   node --version
   npm --version
   ```

**Option 2: Using Homebrew**

1. Install Homebrew if you don't have it:
   ```
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
2. Install Node.js:
   ```
   brew install node
   ```
3. Verify the installation:
   ```
   node --version
   npm --version
   ```

#### Linux (Ubuntu/Debian)

1. Update your package list:
   ```
   sudo apt update
   ```
2. Install Node.js and npm:
   ```
   sudo apt install nodejs npm
   ```
3. Verify the installation:
   ```
   node --version
   npm --version
   ```

For other Linux distributions, check the [Node.js downloads page](https://nodejs.org/en/download/package-manager/).

### Setting up the project

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/next-task-manager.git
   cd next-task-manager
   ```

   If you don't have Git installed:

   - Windows: Download from [git-scm.com](https://git-scm.com/download/win)
   - macOS: Install with Homebrew: `brew install git`
   - Linux: `sudo apt install git`

   Alternatively, you can download the project as a ZIP file from GitHub and extract it.

2. Install dependencies:
   ```
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory with the following variables:

   ```
   # Database
   DATABASE_URL="file:./prisma/dev.db"

   # Next Auth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"

   # GitHub OAuth (optional, for GitHub authentication)
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   ```

   To generate a secure random string for NEXTAUTH_SECRET, you can run:

   ```
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. For GitHub authentication (optional):
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Click "New OAuth App"
   - Fill in the application details:
     - Application name: TaskMaster
     - Homepage URL: http://localhost:3000
     - Authorization callback URL: http://localhost:3000/api/auth/callback/github
   - Register the application
   - Copy the Client ID and Client Secret to your `.env` file

## Running the Application

1. Initialize the database:

   ```
   npx prisma migrate dev --name init
   ```

2. Start the development server:

   ```
   npm run dev
   ```

3. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Database Management

- View and manage your database with Prisma Studio:

  ```
  npm run studio
  ```

  This will open a web interface at [http://localhost:5555](http://localhost:5555)

- Create a new migration after changing the schema:
  ```
  npx prisma migrate dev --name your_migration_name
  ```
