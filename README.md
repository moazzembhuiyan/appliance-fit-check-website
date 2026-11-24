<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0F172A,50:1E3A8A,100:38BDF8&height=180&section=header&text=Appliance%20Fit%20Check&fontSize=40&fontColor=ffffff&fontAlignY=36&desc=Will%20your%20appliance%20fit%3F%20Check%20before%20you%20buy&descAlignY=58&descSize=16" alt="Appliance Fit Check" />

<p><b>🌐 Web Application</b></p>

<p>
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radixui&logoColor=white" alt="Radix UI" />
  <img src="https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux Toolkit" />
  <img src="https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white" alt="React Hook Form" />
  <img src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white" alt="Zod" />
  <img src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
</p>

</div>

## 📖 Overview

A modern frontend for **Appliance Fit Check** — a tool that helps people check whether an appliance will fit their space before buying. Includes guides, user accounts and a personal dashboard of saved checks, connected to an existing backend API.

## ✨ Key Features

### 🧰 Core

- Appliance **fit-check** tool
- Guides with dynamic article pages
- About, FAQ and Contact pages

### 👤 Accounts

- Register, login, OTP verification, forgot & reset password
- Personal dashboard with saved check history
- Profile & settings
- Session-expired and unauthorized handling

### ⚙️ Quality

- Form validation with React Hook Form + Zod
- Toast notifications with Sonner
- Unit tests with Vitest
- Responsive, accessible UI with Radix primitives

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) · React 19 |
| **Language** | JavaScript |
| **Styling** | Tailwind CSS · class-variance-authority |
| **UI** | Radix UI · Motion · Lucide |
| **State** | Redux Toolkit |
| **Forms** | React Hook Form · Zod |
| **Testing** | Vitest |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
git clone https://github.com/moazzembhuiyan/appliance-fit-check-website.git
cd appliance-fit-check-website
npm install
```

### Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_APP_STORE_URL=
NEXT_PUBLIC_PLAY_STORE_URL=
NEXT_ALLOWED_DEV_ORIGINS=
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL |
| `NEXT_PUBLIC_SITE_URL` | Public URL of this site |
| `NEXT_PUBLIC_APP_STORE_URL` | App Store link |
| `NEXT_PUBLIC_PLAY_STORE_URL` | Google Play link |
| `NEXT_ALLOWED_DEV_ORIGINS` | Allowed dev origins (optional) |

### Run

```bash
npm run dev
# open http://localhost:3000
```

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests (Vitest) |

## 📁 Project Structure

```text
src/
├── app/            # Public pages, auth pages & (account) area
├── components/     # UI components
├── lib/api/        # Backend API integration
├── store/          # Redux store
├── context/ · hooks/
└── assets/
```

## 📝 More Documentation

Detailed developer notes are available in [`docs/NOTES.md`](docs/NOTES.md).

---

<div align="center">

### 👨‍💻 Developed by [Moazzem Hossen Bhuiyan](https://github.com/moazzembhuiyan)

<sub>Mobile App Developer (React Native) • Web Developer</sub>

<p>
  <a href="https://github.com/moazzembhuiyan"><img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub" /></a>
  <a href="https://www.linkedin.com/in/moazzem-hossen-bhuiyan-325432331/"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
  <a href="mailto:moazzembhuiyan394@gmail.com"><img src="https://img.shields.io/badge/Email-EA4335?style=flat-square&logo=gmail&logoColor=white" alt="Email" /></a>
</p>

<sub>⭐ If you like this project, consider giving it a star!</sub>

</div>
