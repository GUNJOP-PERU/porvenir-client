import { AppSidebar } from "@/components/Layout/app-sidebar";
import { NavMain } from "@/components/Layout/nav-main";
import { Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  const location = useLocation();
  const isTrackingPage = location.pathname === "/dashboard/tracking" || location.pathname === "/dashboard/fleet-status";
  return (
    <main className="h-screen flex w-full overflow-hidden bg-black">
      <NavMain />
      <div className="w-screen h-screen overflow-hidden flex flex-col">
        <AppSidebar />
        <section  className={`flex-1 flex flex-col gap-x-4 gap-y-2 relative rounded-none md:rounded-xl ${
            isTrackingPage ? "bg-black" : "bg-white px-4 py-4 pb-2 lg:px-6 lg:py-5 overflow-auto "
          }`}>
          <Outlet />
        </section>
      </div>
    </main>
  );
}
