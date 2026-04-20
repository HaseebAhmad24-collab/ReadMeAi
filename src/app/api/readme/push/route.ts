import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Octokit } from "octokit";

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as any;
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { repoName, content } = await req.json();
    if (!repoName || !content) {
      return NextResponse.json({ error: "Missing repoName or content" }, { status: 400 });
    }

    const owner = session.user.username;
    const octokit = new Octokit({ auth: session.accessToken });

    // 1. Get current README SHA if it exists
    let sha: string | undefined;
    try {
      const { data: currentFile } = await octokit.rest.repos.getContent({
        owner,
        repo: repoName,
        path: "README.md",
      });
      if ("sha" in currentFile) {
        sha = currentFile.sha;
      }
    } catch (e) {
      // File doesn't exist, this is fine for new README
    }

    // 2. Create or update file
    await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo: repoName,
      path: "README.md",
      message: "docs: add AI-generated README via ReadMeAI",
      content: Buffer.from(content).toString("base64"),
      sha,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Push error:", error);
    return NextResponse.json({ error: "Failed to push to GitHub" }, { status: 500 });
  }
}
