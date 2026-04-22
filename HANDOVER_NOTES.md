# ReadMeAI Handover Notes

This document provides context for any AI agent or developer continuing the work on the ReadMeAI platform.

## 🚀 Project Overview
ReadMeAI is a professional SaaS platform designed to automate GitHub README generation using Anthropic Claude 3.5 Sonnet.

### Tech Stack
- **Framework**: Next.js 16.2.4 (App Router) with Turbopack.
- **Language**: TypeScript.
- **Styling**: Tailwind CSS 4 + ShadCN UI components.
- **Auth**: NextAuth.js (GitHub Provider).
- **Database**: Supabase (PostgreSQL) - Handles user sync, usage tracking, and audit logs.
- **AI**: Anthropic SDK (Claude 3.5 Sonnet).
- **Integration**: Octokit (GitHub REST API) for scanning repos and pushing files.

---

## ✅ Completed Milestones

### 1. Authentication & User Sync
- GitHub OAuth integrated.
- `src/lib/auth.ts`: Custom `signIn` callback to sync GitHub profile data to Supabase `users` table.

### 2. Repository Dashboard
- Fetches user repositories via Octokit.
- Includes search, language filtering, and skeleton loading states.
- `src/components/dashboard/RepoCard.tsx`: Visual status for repos (No README, Generated, etc.).

### 3. Generation Engine (`src/app/generate/[repoName]`)
- **Scanner**: Analyzes file structure, `package.json`, and `.env.example`.
- **AI Logic**: Structured prompt engineering to Claude for professional, developer-centric READMEs.
- **UI**: Split-screen workflow with typewriter reveal and live Markdown preview.

### 4. GitHub Push Integration
- One-click commit and push functionality using Octokit.
- Handles branch detection and file creation.

### 5. Settings & Profile
- User information and GitHub link display.
- **Dynamic Usage Tracking**: Server-rendered limit status pulling from Supabase `usage_tracking` table. Displays dynamic reset dates based on the next calendar month.
- **Account Deletion**: Full teardown API (`/api/user/delete`) that deletes user history, usage tracking, NextAuth tokens, and the user's Supabase record, returning them to a clean state.

### 6. Role-Based Access Control (RBAC) & Limits
- Standard Users are restricted to 3 README generations per month.
- `admin` users bypass usage limits entirely and have specific UI states.
- Implemented **Self-Healing Auth Sessions**: Since NextAuth JWTs can become stale, the system queries the Supabase `users` table during the `jwt` callback to ensure the `role` is perfectly synced.
- **Error Handling**: Custom Toast UI (`sonner`) implemented for limit exhaustion. Bypassed Next.js 16 Development overlays by switching `console.error` to `console.warn` for handled application exceptions.

---

## ⚡ Critical Technical Nuances (IMPORTANT)
> [!WARNING]
> **Next.js 16 Migration**: This project uses Next.js 16 (beta/alpha).
> - `middleware.ts` has been replaced by `proxy.ts`.
> - The exported function must be named `proxy`.
> - Check `src/proxy.ts` for reference.

> [!CAUTION]
> **Lucide React Issues**:
> `lucide-react@1.8.0` with Turbopack has issues resolving brand icons (`Github`, `Twitter`, `Linkedin`). 
> **DO NOT** import these from the library. Instead, use the inline SVGs already implemented in `Footer.tsx`, `Navbar.tsx`, and `GeneratePage`.

---

## 🛠️ Environment Variables (.env.local)
Ensure these are set for the app to function locally:
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` (GitHub OAuth App)
- `ANTHROPIC_API_KEY` (Claude API)
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Supabase Client)
- `SUPABASE_SERVICE_ROLE_KEY` (Used in backend for user upserts/locks)
- `NEXTAUTH_SECRET` / `NEXTAUTH_URL`

---

## 📋 Pending Tasks / Road Map
1. **Stripe Integration**: Implement Pro subscription flow ($9/mo) for unlimited generations.
2. **README Templates**: Allow users to choice from different styles (Minimal, Detailed, Modern).
3. **Multi-language Support**: Add i18n for generated READMEs.
4. **Production Deployment**: Vercel deployment and domain configuration.
5. **Database Schema**: Ensure `supabase/schema.sql` is fully applied in production.
