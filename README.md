# SkillSync
# SkillSync

> Connect skills and jobs with an Express API and Vite frontend.

![GitHub stars](https://img.shields.io/github/stars/abhiikyaa/SkillSync?style=for-the-badge&logo=github) ![GitHub forks](https://img.shields.io/github/forks/abhiikyaa/SkillSync?style=for-the-badge&logo=github) ![GitHub issues](https://img.shields.io/github/issues/abhiikyaa/SkillSync?style=for-the-badge&logo=github) ![Last commit](https://img.shields.io/github/last-commit/abhiikyaa/SkillSync?style=for-the-badge&logo=github) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white) ![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## 📑 Table of Contents

- [Description](#description)
- [Key Features](#key-features)
- [Use Cases](#use-cases)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Key Dependencies](#key-dependencies)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Contributing](#contributing)

## 📝 Description

SkillSync is a full-stack web application designed to bridge the gap between user profiles, specialized skills, and job opportunities. Built with a decoupled architecture, the platform features a robust Express.js backend API and a modern React frontend styled with Tailwind CSS and powered by Vite. The system is designed to facilitate skill management and job correlation in a structured and scalable environment.

On the server side, the Express application structures its core business logic around modular routes for authentication, user profiles, skills, and job listings. It incorporates critical middleware such as Express Rate Limit to prevent abuse, CORS for secure cross-origin communication, and Multer for handling file uploads. Supabase is leveraged for database management, ensuring reliable data persistence and seamless user management.

## ✨ Key Features

- **🔑 Authentication and Profile Management** — Provides dedicated routing for secure user onboarding, authentication, and profile customization.
- **💼 Skill and Job Tracking** — Manages skill sets and job positions through structured backend routes to align talent with open opportunities.
- **🤖 AI Routing Integration** — Includes dedicated endpoints designed to handle intelligent features and automated matching logic.
- **🛡️ API Rate Limiting** — Secures backend resources by restricting clients to a maximum of 100 requests per 15 minutes.
- **📂 File Upload Handling** — Integrates Multer middleware to process multipart form data and handle file uploads within the API.

## 🎯 Use Cases

- Building a centralized platform where job seekers can document their technical skills and discover matching job postings.
- Developing a secure, rate-limited portal with React, Express, and Supabase that serves as a baseline for AI-driven career matching tools.
- Setting up a local development environment with mock data using the built-in database seeding script.

## 🛠️ Tech Stack

- 🚀 **Express.js**
- 🟨 **JavaScript**
- 🟩 **Supabase**
- 🌬️ **Tailwind CSS**
- ⚡ **Vite**

**Notable libraries:** Multer

## ⚡ Quick Start

```bash

# 1. Clone the repository
git clone https://github.com/abhiikyaa/SkillSync.git

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

## 📦 Key Dependencies

```
@google/genai: ^1.50.1
@supabase/supabase-js: ^2.39.0
cors: ^2.8.5
dotenv: ^16.3.1
express: ^4.18.2
express-rate-limit: ^7.1.5
multer: ^1.4.5-lts.1
pdf-parse: ^1.1.1
```

## 🚀 Available Scripts

- **dev** — `npm run dev`
- **start** — `npm run start`
- **seed** — `npm run seed`

## 🌐 API Endpoints

Detected endpoints (best-effort scan):

```
GET /api/health
```

## 📁 Project Structure

```
.
├── backend
│   ├── package.json
│   ├── scripts
│   │   └── seedDatabase.js
│   └── src
│       ├── index.js
│       ├── lib
│       │   └── supabase.js
│       ├── middleware
│       │   └── auth.js
│       ├── routes
│       │   ├── ai.js
│       │   ├── auth.js
│       │   ├── jobs.js
│       │   ├── skills.js
│       │   └── users.js
│       └── services
│           ├── aiService.js
│           ├── matchingEngine.js
│           ├── resumeParser.js
│           └── skillGapEngine.js
└── frontend
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── src
    │   ├── App.jsx
    │   ├── components
    │   │   └── common
    │   │       └── AppLayout.jsx
    │   ├── context
    │   │   └── AuthContext.jsx
    │   ├── index.css
    │   ├── lib
    │   │   ├── api.js
    │   │   └── supabase.js
    │   ├── main.jsx
    │   └── pages
    │       ├── CareerAdvisorPage.jsx
    │       ├── DashboardPage.jsx
    │       ├── LandingPage.jsx
    │       ├── LoginPage.jsx
    │       ├── OtherPages.jsx
    │       ├── RegisterPage.jsx
    │       └── SkillGapPage.jsx
    ├── tailwind.config.js
    └── vite.config.js
```

## 🛠️ Development Setup

### Node.js / JavaScript
1. Install Node.js (v18+ recommended)
2. Install dependencies: `npm install` (or `yarn` / `pnpm install` / `bun install`)
3. Start the dev server: see the **Quick Start** above

## 👥 Contributing

Contributions are welcome! Here's the standard flow:

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/abhiikyaa/SkillSync.git`
3. **Branch**: `git checkout -b feature/your-feature`
4. **Commit**: `git commit -m 'feat: add some feature'`
5. **Push**: `git push origin feature/your-feature`
6. **Open** a pull request

Please follow the existing code style and include tests for new behavior where applicable.

---
*This README was generated with ❤️ by [ReadmeBuddy](https://readmebuddy.com)*
