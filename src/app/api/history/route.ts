import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabaseService } from "@/lib/supabase";

export async function GET() {
  const session = (await getServerSession(authOptions)) as any;

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseService();

  try {
    const { data, error } = await supabase
      .from("generations")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error fetching history:", error);
      return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Fatal error in history API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
