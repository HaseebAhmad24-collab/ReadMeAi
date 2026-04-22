import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabaseService } from "@/lib/supabase";

export async function DELETE(req: Request) {
  const session = (await getServerSession(authOptions)) as any;
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseService();
  const userId = session.user.id;

  try {
    // We explicitly delete related data if there's no ON DELETE CASCADE configured
    // Delete from usage tracking
    await supabase.from("usage_tracking").delete().eq("user_id", userId);
    
    // Delete from generations
    await supabase.from("generations").delete().eq("user_id", userId);
    
    // Delete from NextAuth tables
    await supabase.from("accounts").delete().eq("userId", userId);
    await supabase.from("sessions").delete().eq("userId", userId);

    // Finally, delete the user
    const { error } = await supabase.from("users").delete().eq("id", userId);

    if (error) {
      console.error("Failed to delete user:", error);
      return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Account deletion error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
