# 🤖 ReadMeAi

**Generate professional, high-quality READMEs for your GitHub repositories in under 30 seconds.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Anthropic](https://img.shields.io/badge/AI-Anthropic%20%7C%20Gemini-orange?style=for-the-badge&logo=anthropic)](https://anthropic.com/)

ReadMeAi is an AI-powered automation tool designed to eliminate the chore of writing documentation. By connecting directly to your GitHub account, it scans your codebase, understands your project structure, and generates a comprehensive, professional README.md that you can push back to your repository with a single click.

---

## ✨ Features

- **GitHub OAuth Integration**: Securely connect your GitHub account to access your repositories.
- **Intelligent Codebase Scanning**: Automatically analyzes your project structure, dependencies (`package.json`), and core logic.
- **AI-Powered Documentation**: Leverages Anthropic (Claude) and Google (Gemini) models to generate high-quality technical content.
- **One-Click Push**: Push the generated documentation directly to your repository as a new commit or branch.
- **Generation History**: Keep track of all previously generated READMEs in a centralized dashboard.
- **Modern UI/UX**: Built with React 19, Framer Motion, and Shadcn UI for a fluid, responsive experience.
- **Real-time Progress**: Watch the AI "write" your documentation with interactive typewriter effects and progress tracking.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Backend**: [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (GitHub Provider)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **AI Engines**: [Anthropic SDK](https://www.anthropic.com/), [Google Generative AI](https://ai.google.dev/)
- **GitHub API**: [Octokit](https://octokit.github.io/rest.js/v40)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/), [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ 
- A GitHub Developer Account (for OAuth)
- A Supabase Project
- API Keys for Anthropic or Google Gemini

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/HaseebAhmad24-collab/ReadMeAi.git
   cd ReadMeAi
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add the following:
   ```env
   # Authentication
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   GITHUB_ID=your_github_client_id
   GITHUB_SECRET=your_github_client_secret

   # Database (Supabase)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key

   # AI Providers
   ANTHROPIC_API_KEY=your_anthropic_key
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
   ```

4. **Initialize Database:**
   Run the SQL script located in `supabase/schema.sql` within your Supabase SQL Editor to set up the required tables.

5. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## 📖 Usage

1. **Login**: Sign in using your GitHub account via the landing page.
2. **Select Repo**: Browse your public and private repositories in the dashboard.
3. **Generate**: Click "Generate" on a specific repository. The AI will scan your file structure and package manifest.
4. **Review & Edit**: Preview the generated Markdown in real-time.
5. **Deploy**: Click "Push to GitHub" to automatically update your repository's README.md.

---

## 📂 Project Structure

```text
src/
├── app/              # Next.js App Router (Pages & API Routes)
├── components/       # UI Components (Landing, Dashboard, UI primitives)
├── lib/              # Shared utilities (Auth, Supabase, GitHub Scanner)
├── proxy.ts          # API Proxy configurations
└── supabase/         # Database schema and migrations
```

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve ReadMeAi, please follow these steps:

1. Fork the project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by [Haseeb Ahmad](https://github.com/HaseebAhmad24-collab)**