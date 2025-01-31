import {  SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/Layout/app-sidebar";
import Header from "../components/Header";

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="h-svh w-full overflow-hidden flex flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 px-5 pb-4">{children}</main>
      </div>
    </SidebarProvider>
  );
}
