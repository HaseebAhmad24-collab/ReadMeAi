# ReadMeAI — Full Handover Notes

This document provides complete context for any AI agent or developer continuing work on the ReadMeAI platform.

---

## 🚀 Project Overview

ReadMeAI is a professional SaaS platform that automates GitHub README generation using Google Gemini AI. Users connect via GitHub OAuth, select a repository, and the AI scans the codebase to produce a professional, structured README — which can then be pushed directly to GitHub in one click.

### Tech Stack
- **Framework**: Next.js 16.2.4 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + ShadCN UI components
- **Auth**: NextAuth.js (GitHub Provider)
- **Database**: Supabase (PostgreSQL) — user sync, usage tracking, generation history
- **AI**: Google Gemini (via `@google/generative-ai` SDK)
- **GitHub Integration**: Octokit REST API (scanning repos, pushing files)
- **Toast Notifications**: Sonner

---

## ✅ Completed Features (All Sessions)

### 1. Authentication & User Sync
- GitHub OAuth fully integrated via NextAuth.js.
- `src/lib/auth.ts`: Custom `signIn` callback syncs GitHub profile to Supabase `users` table on every login.
- **Self-Healing JWT Sessions**: The `jwt` callback re-queries Supabase on every token refresh to ensure `role` is always in sync — prevents stale admin roles.

### 2. Role-Based Access Control (RBAC)
- Users have a `role` field in Supabase (`admin` or `user`).
- **Admin accounts** bypass all usage limits and see special UI states ("Admin Plan", "Admin Access" badge in dashboard header).
- **Standard users** are limited to 3 README generations per month.
- Role is set manually in Supabase `users` table (no UI for this yet).
- **Current Accounts**:
  - `HaseebAhmad24-collab` → `admin` (unlimited)
  - `frankchantu-boop` → `user` (3/month limit)

### 3. Repository Dashboard (`/dashboard`)
- Fetches all user repos via Octokit.
- Search by name + filter by programming language.
- Skeleton loading states on repo cards.
- `src/components/dashboard/RepoCard.tsx` shows repo status (No README, Generated, etc.).
- Admin badge shown in header for admin users.

### 4. Generation Engine (`/generate/[repoName]`)
- **Scanner**: Calls `/api/repos/scan` — reads file structure, `package.json`, `.env.example`.
- **AI Generation**: Structured Gemini prompt generates a professional README.
- **UI**: Split-screen — left panel shows scan phases, right panel shows live typewriter preview.
- **Usage Limit Check**: Before generating, `/api/readme/generate` checks `usage_tracking` table. If limit (3) is reached, returns `403` error.
- **Error Handling**:
  - On limit reached: Toast error is shown (`sonner`) — **no page crash, no red dev overlay**.
  - "Push to GitHub" button is **disabled** and relabeled "Limit Reached" — **prevents error text from being pushed to GitHub**.
  - "READY TO PUSH" floating badge is hidden on error state.
  - All `console.error` replaced with `console.warn` to bypass Next.js 16 dev overlay.

### 5. GitHub Push Integration (`/api/readme/push`)
- One-click push via Octokit.
- Detects default branch automatically.
- Creates or updates `README.md` in the repository root.
- On success, redirects to `/success?url=<repo_url>`.

### 6. Success Page (`/success`)
- Confetti animation on load.
- Links to view repo on GitHub and go back to Dashboard.
- Wrapped in `<Suspense>` to fix Next.js static prerendering build error (`useSearchParams`).

### 7. Settings Page (`/settings`)
- **Profile Section**: Avatar, name, email, GitHub username.
- **Plan & Usage Section**:
  - Dynamically fetches usage count from Supabase `usage_tracking` table (server-rendered).
  - Shows `X of 3 used` for standard users, `Unlimited access` for admins.
  - Progress bar reflects real usage.
  - Reset date is **dynamically calculated** — always shows the 1st of next month.
  - "Upgrade to Pro" button hidden for admins.
- **Danger Zone**:
  - "Delete Account" button opens a confirmation dialog.
  - On confirm, calls `/api/user/delete` which deletes: usage tracking, generation history, NextAuth tokens, and the user record from Supabase.
  - After deletion, user is auto-signed out and redirected to home page.

### 8. History Page (`/history`)
- Shows past generated READMEs pulled from Supabase `generations` table.

### 9. Upgrade to Pro — Placeholder UI
- **Landing Navbar**: "Upgrade to Pro" button (outline, accent colored) shown between nav links and login button.
- **Dashboard Sidebar**: Gradient "Upgrade to Pro" button shown below the usage pill (hidden for admins).
- **Pricing Section**: Pro plan "Get Started" button shows a Toast instead of triggering GitHub login.
- **Toast Message**: `"Pro features are currently in testing! 🚀"` with description `"We'll notify you as soon as Pro plans are live. Stay tuned!"`

### 10. Toast Notification System (Sonner)
- `sonner` installed and `<Toaster />` added to root `layout.tsx`.
- Configured with `theme="light"` and `richColors` for clear font visibility.
- Used in: generation limit errors, upgrade prompts, account deletion feedback.

### 11. Production Deployment (Vercel)
- **Live URL**: `https://read-me-ai-coral.vercel.app`
- **Environment Variables**: Fully configured in Vercel Dashboard (GitHub OAuth, Gemini, Supabase).
- **GitHub OAuth Sync**: Redirect URIs updated to production domain in GitHub Developer settings.
- **Production Readiness**: All `console.log` statements in `src/lib/auth.ts` removed to ensure clean logs and avoid Next.js dev overlay issues.

---

## ⚡ Critical Technical Nuances (MUST READ)

> [!WARNING]
> **Next.js 16 Migration**: This project uses Next.js 16 (beta/alpha).
> - `middleware.ts` has been replaced by `proxy.ts`.
> - The exported function must be named `proxy`.
> - Check `src/proxy.ts` for reference.

> [!CAUTION]
> **Lucide React Issues**:
> `lucide-react@1.8.0` with Turbopack has issues resolving brand icons (`Github`, `Twitter`, `Linkedin`).
> **DO NOT** import these from the library. Use inline SVGs already in `Footer.tsx`, `Navbar.tsx`, and `GeneratePage`.

> [!CAUTION]
> **Next.js Dev Overlay**:
> Next.js 16 intercepts `console.error()` in dev mode and shows a full-screen red overlay.
> All handled application errors (limit reached, push failed, etc.) use `console.warn()` instead.

> [!NOTE]
> **Supabase `monthYear` Format**:
> Usage tracking uses format `"MM-YYYY"` (e.g., `"04-2026"`). This is produced by:
> ```ts
> new Date().toLocaleString("en-US", { month: "2-digit", year: "numeric" }).replace("/", "-")
> ```
> The UI uses the same format to query the correct month's record.

---

## 🛠️ Environment Variables (`.env.local`)

```env
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GEMINI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=https://read-me-ai-coral.vercel.app
```

---

## 🗃️ Supabase Tables Used

| Table | Purpose |
|---|---|
| `users` | Stores user profile, role (`admin`/`user`) |
| `accounts` | NextAuth OAuth tokens |
| `sessions` | NextAuth session data |
| `usage_tracking` | Monthly generation count per user |
| `generations` | History of generated READMEs |

---

## 📁 Key Files Reference

| File | Purpose |
|---|---|
| `src/lib/auth.ts` | NextAuth config, JWT/session callbacks, self-healing role sync |
| `src/lib/supabase.ts` | Supabase client helpers |
| `src/app/api/readme/generate/route.ts` | Core generation API — checks limits, calls Gemini, records usage |
| `src/app/api/readme/push/route.ts` | Pushes README to GitHub via Octokit |
| `src/app/api/user/delete/route.ts` | Full account deletion API |
| `src/app/dashboard/layout.tsx` | Fetches usage count server-side, passes to Sidebar |
| `src/components/dashboard/Sidebar.tsx` | Usage pill, Upgrade to Pro button |
| `src/components/settings/DeleteAccountButton.tsx` | Client component for account deletion flow |
| `src/components/landing/Pricing.tsx` | Pricing section — Pro plan triggers toast |
| `src/components/ui/sonner.tsx` | Toast config — light theme, richColors |

---

## 📋 Road Map / Pending Tasks

1. **Stripe Integration**: Pro subscription ($9/mo) for unlimited generations. Implement after traffic is confirmed.
2. **Abuse Prevention (Email Tracking)**: When Stripe is added, track limits by GitHub email (not just user ID) to prevent account-delete-and-recreate abuse.
3. **README Templates**: Let users pick styles (Minimal, Detailed, Badge-heavy, etc.).
4. **Private Repo Support**: Currently only public repos are scanned.
5. **Multi-language README**: i18n support for generated content.

---

## 💡 Business Context

- **Strategy**: Launch first, add payments when traffic arrives (Lean Startup approach).
- **Free Tier**: 3 generations/month — enough to demonstrate value, creates natural upgrade pressure.
- **Admin Role**: Used for internal testing and owner access (no UI to set this — done directly in Supabase).
- **Account Deletion**: Currently hard-deletes all data. When Stripe is added, switch to soft-delete or email-based tracking to prevent free limit abuse.
