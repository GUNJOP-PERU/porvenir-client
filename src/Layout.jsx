import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/Dashboard/app-sidebar";
import Header from "./components/Header";

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full overflow-hidden">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 px-8 pt-0">{children}</main>
      </div>
    </SidebarProvider>
  );
}
