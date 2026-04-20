import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileNav } from "@/components/dashboard/MobileNav";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-secondary">
      <Sidebar />
      <main className="flex-1 lg:ml-[240px] flex flex-col pb-24 lg:pb-0">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
