# Team Task Manager

A collaborative **Team Task Management** application built with **Next.js 15 (App Router)**. This project supports team-based task assignment, subtask management, file uploads, and authentication, providing a modular and scalable foundation for managing team productivity.

---

## 🚀 Features

- 🔐 Authentication with **NextAuth**
- 👥 Team creation, invitation, and management
- ✅ Task & Subtask assignment per team and user
- 📁 File upload and management API
- 🧪 Upload testing components
- 📊 Dashboard with task and team views
- ⚙️ User profile & settings
- 🎯 Clean modular API routes using App Router

---

## 📁 Folder Structure

```bash
/app
├── api
│   ├── auth/[...nextauth]/route.ts       # NextAuth config
│   ├── register/route.ts                 # User registration API
│   ├── tasks/                            # Task management
│   │   ├── route.ts
│   │   └── [id]/subtasks/[subtaskId]/route.ts
│   ├── teams/                            # Team management
│   │   ├── [id]/members/[memberId]/route.ts
│   │   └── [id]/tasks/route.ts
│   ├── users/me/route.ts                 # Authenticated user info
│   ├── test-upload/route.ts             # Upload test API
│   ├── test-file-upload/route.ts
│   └── uploads/route.ts
│
├── dashboard                             # Protected dashboard routes
│   ├── layout.tsx                        # Dashboard layout
│   ├── loading.tsx                       # Loading skeleton
│   ├── page.tsx                          # Dashboard homepage
│   ├── tasks/                            # Task views
│   │   ├── create/page.tsx
│   │   └── [id]/page.tsx
│   └── teams/                            # Team views
│       ├── create/page.tsx
│       └── [id]/invite/page.tsx
│
├── login/page.tsx                        # Login page
├── register/page.tsx                     # Register page
├── settings/loading.tsx                  # Settings page skeleton
├── layout.tsx                            # Root layout
├── providers.tsx                         # Context providers
├── globals.css                           # Global styles
├── favicon.ico
└── test-upload/page.tsx                  # File upload testing
````

---

## 🛠️ Tech Stack

* **Framework**: Next.js 15 (App Router)
* **Styling**: Tailwind CSS / CSS Modules
* **Auth**: NextAuth.js
* **Database**: Prisma with MySql
* **File Upload**: API-based upload endpoints
* **Deployment**: Vercel 

---

## 🧪 Development

### Install dependencies

```bash
npm install
# or
yarn
```

### Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

---

## ✅ To-Do

* [ ] Finalize subtask editing
* [ ] Add team role-based permissions
* [ ] Integrate persistent database (e.g. Prisma + PostgreSQL)
* [ ] Add notification system
* [ ] Improve UI/UX with component library (e.g. ShadCN or Radix UI)

---

## 📄 License

MIT License © 2025

---

## 🙌 Author

Developed by **Ahmed Qassem** – [@AhmedQassemDev2004](https://github.com/AhmedQassemDev2004)

