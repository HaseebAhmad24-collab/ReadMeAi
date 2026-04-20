import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Octokit } from "octokit";

export async function GET() {
  const session = (await getServerSession(authOptions)) as any;

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 0 });
  }

  const octokit = new Octokit({ auth: session.accessToken });

  try {
    // Fetch all user repositories
    const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: "updated",
      per_page: 100,
    });

    const formattedRepos = repos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      updated_at: repo.updated_at,
      private: repo.private,
      html_url: repo.html_url,
      // We'll add status badge logic later based on Supabase 'generations' table
    }));

    return NextResponse.json(formattedRepos);
  } catch (error) {
    console.error("Error fetching repos:", error);
    return NextResponse.json({ error: "Failed to fetch repositories" }, { status: 0 });
  }
}
