import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSupabaseService } from "@/lib/supabase";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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
    .select("count, id")
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
      You are an expert technical writer and senior software engineer specializing in documentation.
      Your goal is to generate a professional, high-quality README.md for the following repository.
      
      REPOSITORY METADATA:
      Name: ${metadata.name}
      Description: ${metadata.description}
      Primary Language: ${metadata.language}
      Topics: ${metadata.topics?.join(", ")}
      URL: ${metadata.url}
      
      FILE STRUCTURE:
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
         - Installation Guide (based on project type)
         - Usage Examples
         - Environment Variables (if .env.example found)
         - Contributing & License
      3. Use a tone that is confident and helpful.
      4. Only output the Markdown content itself. Do not include any intro or outro text.
    `;

    // Use Gemini Flash Latest (Verified working with available quota)
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    // 2. Increment Usage Count
    if (usage) {
      await supabase
        .from("usage_tracking")
        .update({ count: usage.count + 1 })
        .eq("id", usage.id);
    } else {
      await supabase.from("usage_tracking").insert({
        user_id: userId,
        month_year: monthYear,
        count: 1,
      });
    }

    // 3. Save generation to history
    await supabase.from("generations").insert({
      user_id: userId,
      repo_name: metadata.name,
      repo_url: metadata.url,
      readme_content: content,
    });

    return NextResponse.json({ readme: content });
  } catch (error) {
    console.error("AI Generation error:", error);
    return NextResponse.json({ error: "Failed to generate README" }, { status: 500 });
  }
}
