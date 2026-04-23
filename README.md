<div align="center">

<img src="https://img.shields.io/badge/ReadMeAI-v1.0-2D6EF5?style=for-the-badge&logo=terminal&logoColor=white" alt="ReadMeAI" />

# ReadMeAI

### *Ship better documentation, automatically.*

**An AI-powered SaaS platform that scans your GitHub repositories and generates professional, structured README files — ready to push in one click.**

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-GitHub_OAuth-black?style=flat-square&logo=github)](https://next-auth.js.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

<br/>

[**Live Demo**](https://readme-ai.vercel.app) · [**Report Bug**](https://github.com/HaseebAhmad24-collab/ReadMeAi/issues) · [**Request Feature**](https://github.com/HaseebAhmad24-collab/ReadMeAi/issues)

</div>

---

## 📌 Why This Matters

Every great project deserves great documentation — but writing READMEs is tedious, repetitive, and often skipped.

**ReadMeAI solves this by:**
- 🔍 Intelligently scanning your repo's file structure, tech stack, and dependencies
- 🤖 Generating a polished, developer-centric README using Google Gemini AI
- 🚀 Pushing it directly to your GitHub repository in a single click

**No copy-pasting. No templates. Just ship.**

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **GitHub OAuth** | One-click login via GitHub — no passwords |
| 📂 **Repo Dashboard** | View all your repositories with search & language filters |
| 🧠 **AI-Powered Scanning** | Parses `package.json`, file structure, and `.env.example` |
| ✍️ **Live Preview** | Typewriter-style markdown preview before committing |
| 🚀 **One-Click Push** | Commits `README.md` directly to your repo's default branch |
| 📊 **Usage Tracking** | 3 free generations/month with dynamic limit display |
| 👑 **Admin Panel** | Role-based access control — admins bypass all limits |
| 🔔 **Toast Notifications** | Real-time feedback for limits, errors, and actions |
| 🗑️ **Account Deletion** | Full data teardown with confirmation dialog |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                         │
└──────────────────────────┬──────────────────────────────────┘
                           │ GitHub OAuth
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  Next.js 16 (App Router)                    │
│                                                             │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐ │
│  │  /dashboard │  │ /generate/   │  │    /settings       │ │
│  │  Repo List  │  │ [repoName]   │  │  Usage + Profile   │ │
│  └──────┬──────┘  └──────┬───────┘  └────────────────────┘ │
│         │                │                                  │
│         ▼                ▼                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   API Routes                           │ │
│  │  /api/repos  →  Octokit (GitHub REST API)             │ │
│  │  /api/repos/scan  →  Reads files, package.json        │ │
│  │  /api/readme/generate  →  Google Gemini AI            │ │
│  │  /api/readme/push  →  Octokit (commit to GitHub)      │ │
│  │  /api/user/delete  →  Supabase teardown               │ │
│  └───────────────────────────────┬────────────────────────┘ │
└──────────────────────────────────┼──────────────────────────┘
                                   │
           ┌───────────────────────┴──────────────────────┐
           │                                              │
           ▼                                              ▼
┌──────────────────────┐                    ┌────────────────────────┐
│   Supabase (DB)      │                    │  Google Gemini API     │
│                      │                    │                        │
│  users               │                    │  Structured prompt →   │
│  usage_tracking      │                    │  Professional README   │
│  generations         │                    │                        │
│  accounts / sessions │                    └────────────────────────┘
└──────────────────────┘
```

---

## 🔄 User Workflow

```
1. Login with GitHub OAuth
        │
        ▼
2. Dashboard → Browse & search your repositories
        │
        ▼
3. Select a repo → "Generate README"
        │
        ▼
4. AI Scanner runs:
   ├─ Reads file tree
   ├─ Parses package.json / requirements.txt
   └─ Detects tech stack & env vars
        │
        ▼
5. Gemini AI generates the README (live typewriter preview)
        │
        ▼
6. Review in Preview tab → Edit in Edit tab (if needed)
        │
        ▼
7. "Push to GitHub" → Commits README.md to default branch
        │
        ▼
8. 🎉 Success Page + Confetti
```

---

## 🛡️ Role-Based Access Control

```
┌─────────────┐         ┌─────────────────────────────────────────┐
│   User      │────────▶│  Max 3 README generations/month         │
│  (default)  │         │  Dynamic reset date (1st of next month) │
└─────────────┘         │  Upgrade to Pro prompt                  │
                        └─────────────────────────────────────────┘

┌─────────────┐         ┌─────────────────────────────────────────┐
│   Admin     │────────▶│  Unlimited generations                  │
│   (role)    │         │  No upgrade prompts shown               │
└─────────────┘         │  Admin badge in dashboard header        │
                        └─────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- A [GitHub OAuth App](https://github.com/settings/developers)
- A [Supabase](https://supabase.com) project
- A [Google AI Studio](https://aistudio.google.com) API key (Gemini)

### Installation

```bash
# Clone the repository
git clone https://github.com/HaseebAhmad24-collab/ReadMeAi.git
cd ReadMeAi

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your credentials (see below)

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file in the root:

```env
# GitHub OAuth
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# NextAuth
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000
```

---

## 🗄️ Database Schema

```sql
-- Users (synced from GitHub OAuth)
users (id, name, email, image, username, role, created_at)

-- Usage tracking (per month, per user)
usage_tracking (id, user_id, month_year, count, updated_at)

-- Generation history
generations (id, user_id, repo_name, readme_content, created_at)

-- NextAuth tables
accounts (id, userId, provider, providerAccountId, ...)
sessions (id, sessionToken, userId, expires)
```

---

## 📁 Project Structure

```
ReadMeAi/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/   # NextAuth handler
│   │   │   ├── repos/               # List & scan repos
│   │   │   ├── readme/generate/     # AI generation + limit check
│   │   │   ├── readme/push/         # GitHub commit
│   │   │   ├── history/             # Generation history
│   │   │   └── user/delete/         # Account deletion
│   │   ├── dashboard/               # Repo browser
│   │   ├── generate/[repoName]/     # Generation workflow
│   │   ├── settings/                # Profile & usage
│   │   ├── history/                 # Past generations
│   │   └── success/                 # Post-push success page
│   ├── components/
│   │   ├── dashboard/               # Sidebar, RepoCard
│   │   ├── landing/                 # Navbar, Hero, Pricing, etc.
│   │   ├── settings/                # DeleteAccountButton
│   │   ├── generate/                # Typewriter component
│   │   └── ui/                      # ShadCN components
│   └── lib/
│       ├── auth.ts                  # NextAuth config + RBAC
│       └── supabase.ts              # Supabase client helpers
├── supabase/                        # DB schema SQL
├── HANDOVER_NOTES.md                # Full developer context
└── README.md
```

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.2.4 (App Router, Turbopack) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4 + ShadCN UI |
| **Authentication** | NextAuth.js (GitHub OAuth) |
| **Database** | Supabase (PostgreSQL) |
| **AI** | Google Gemini (`gemini-2.0-flash`) |
| **GitHub API** | Octokit REST |
| **Animations** | Framer Motion |
| **Toasts** | Sonner |
| **Icons** | Lucide React |
| **Deployment** | Vercel *(planned)* |

---

## 📊 Current Limits & Plans

| | Free Plan | Pro Plan *(coming soon)* |
|---|---|---|
| Generations/month | 3 | Unlimited |
| Public repos | ✅ | ✅ |
| Private repos | ❌ | ✅ |
| AI Model | Standard | Advanced |
| Priority Support | ❌ | ✅ |
| Custom Templates | ❌ | ✅ |

---

## 🔐 Security Notes

- All API routes validate the user session server-side before any operation.
- Admin roles are set directly in Supabase — not accessible via any client-facing route.
- `.env.local`, `scratch/`, and `files/` directories are in `.gitignore` and never committed.
- Usage limits are enforced server-side — cannot be bypassed from the client.

---

## 🗺️ Roadmap

- [ ] **Stripe Integration** — Pro plan subscriptions
- [ ] **Private Repo Support** — Scan private repositories
- [ ] **README Templates** — Choose from Minimal, Detailed, Badge-heavy styles
- [ ] **Abuse Prevention** — Email-based limit tracking across account deletions
- [ ] **Vercel Deployment** — Production hosting + custom domain
- [ ] **Multi-language Support** — READMEs in multiple languages

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Check the [issues page](https://github.com/HaseebAhmad24-collab/ReadMeAi/issues).

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

**Built with ❤️ by [Haseeb Ahmad](https://github.com/HaseebAhmad24-collab)**

*Stop writing READMEs manually — let the AI do it.*

</div>
