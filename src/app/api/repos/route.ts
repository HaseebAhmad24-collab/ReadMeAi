import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Octokit } from "octokit";
import { getSupabaseService } from "@/lib/supabase";

export async function GET() {
  const session = (await getServerSession(authOptions)) as any;

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 0 });
  }

  const octokit = new Octokit({ auth: session.accessToken });
  const supabase = getSupabaseService();

  try {
    // 1. Fetch all user repositories from GitHub
    const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: "updated",
      per_page: 100,
    });

    // 2. Fetch all generated READMEs from Supabase for this user
    const { data: generatedRepos } = await supabase
      .from("generations")
      .select("repo_name")
      .eq("user_id", session.user.id);

    const generatedSet = new Set(generatedRepos?.map(g => g.repo_name) || []);

    // 3. Format and attach status
    const formattedRepos = repos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      updated_at: repo.updated_at,
      private: repo.private,
      html_url: repo.html_url,
      has_readme: generatedSet.has(repo.name), // Dynamic status
    }));

    return NextResponse.json(formattedRepos);
  } catch (error) {
    console.error("Error fetching repos:", error);
    return NextResponse.json({ error: "Failed to fetch repositories" }, { status: 0 });
  }
}
