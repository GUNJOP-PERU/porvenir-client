import { AppSidebar } from "@/components/Layout/app-sidebar";
import { NavMain } from "@/components/Layout/nav-main";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <main className="h-screen flex w-full overflow-hidden bg-black">
      <NavMain />
      <div className="w-screen h-screen overflow-hidden flex flex-col">
        <AppSidebar />
        <section className="flex-1 flex flex-col gap-x-4 gap-y-2 px-6 py-5 pb-2 overflow-auto relative rounded-none md:rounded-xl bg-white">
          <Outlet />
        </section>
      </div>
    </main>
  );
}
