import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";
import { getSupabaseService } from "@/lib/supabase";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as any;
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseService();
  const userId = session.user.id;
  const monthYear = new Date().toLocaleString("en-US", { month: "2-digit", year: "numeric" }).replace("/", "-");

  // 1. Check Usage Limit
  const { data: usage, error: usageError } = await supabase
    .from("usage_tracking")
    .select("count")
    .eq("user_id", userId)
    .eq("month_year", monthYear)
    .single();

  if (usage && usage.count >= 3) {
    return NextResponse.json({ error: "Monthly limit reached. Please upgrade to Pro." }, { status: 403 });
  }

  try {
    const { scanData } = await req.json();
    if (!scanData) {
      return NextResponse.json({ error: "Scan data is required" }, { status: 400 });
    }

    const { metadata, fileTree, fileContents } = scanData;

    const prompt = `
      You are an expert technical writer and senior software engineer. 
      Your goal is to generate a professional, high-quality README.md for the following repository.
      
      REPOSITORY METADATA:
      Name: ${metadata.name}
      Description: ${metadata.description}
      Primary Language: ${metadata.language}
      Topics: ${metadata.topics?.join(", ")}
      URL: ${metadata.url}
      
      FILE STRUCTURE (Partial):
      ${fileTree.join("\n")}
      
      KEY FILE CONTENTS:
      ${Object.entries(fileContents)
        .map(([path, content]) => `--- FILE: ${path} ---\n${content}`)
        .join("\n\n")}
        
      INSTRUCTIONS:
      1. Write the README in clear, professional Markdown.
      2. Include these sections:
         - Project Title & Catchy Description
         - Tech Stack (use standard shield badges)
         - Features (bullet points)
         - Installation Guide (based on project type, e.g., npm install, pip install)
         - Usage Examples
         - Environment Variables (if .env.example found)
         - Contributing & License
      3. Use a tone that is confident and helpful.
      4. Do not include placeholders like "[Your Name]" - use context or general terms.
      5. Only output the Markdown content itself.
    `;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4000,
      system: "You are an expert developer specializing in documentation. Generate ONLY the README.md content.",
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.content[0].type === "text" ? response.content[0].text : "";

    // 2. Increment Usage Count
    if (usage) {
      await supabase
        .from("usage_tracking")
        .update({ count: usage.count + 1 })
        .eq("id", (usage as any).id);
    } else {
      await supabase.from("usage_tracking").insert({
        user_id: userId,
        month_year: monthYear,
        count: 1,
      });
    }

    return NextResponse.json({ readme: content });
  } catch (error) {
    console.error("AI Generation error:", error);
    return NextResponse.json({ error: "Failed to generate README" }, { status: 500 });
  }
}
