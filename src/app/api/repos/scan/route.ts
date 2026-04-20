import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { scanRepo } from "@/lib/scanner";

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as any;
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { repoName } = await req.json();
    if (!repoName) {
      return NextResponse.json({ error: "Repo name is required" }, { status: 400 });
    }

    const owner = session.user.username;
    if (!owner) {
      return NextResponse.json({ error: "GitHub username not found in session" }, { status: 400 });
    }
    
    const results = await scanRepo(repoName, owner, session.accessToken);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Scan error:", error);
    return NextResponse.json({ error: "Failed to scan repository" }, { status: 500 });
  }
}
