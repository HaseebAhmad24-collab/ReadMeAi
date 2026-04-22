import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabaseService } from "@/lib/supabase";

async function getUsageCount(userId: string) {
  const supabase = getSupabaseService();
  const monthYear = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
  const { data } = await supabase
    .from("generations")
    .select("count")
    .eq("user_id", userId)
    .eq("month_year", monthYear)
    .single();
  return data?.count || 0;
}

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions) as any;
  const usageCount = session?.user?.id ? await getUsageCount(session.user.id) : 0;

  return (
    <div className="flex min-h-screen bg-secondary">
      <Sidebar usageCount={usageCount} userPlan={session?.user?.role === "admin" ? "admin" : "free"} />
      <main className="flex-1 lg:ml-[240px] flex flex-col pb-24 lg:pb-0">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
