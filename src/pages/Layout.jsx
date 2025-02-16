import { NavMain } from "@/components/Layout/nav-main";
import { NavUser } from "@/components/Layout/nav-user";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <main className="h-screen flex w-full overflow-hidden">
      <NavMain />
      <div
        className="w-screen h-screen bg-white text-gray-900
      dark:bg-gray-900 dark:text-white overflow-hidden flex flex-col"
      >
        <NavUser />
        <section className="flex-1 flex flex-col gap-x-4 gap-y-2 p-4 overflow-auto">
          <Outlet /> {/* Renderiza las rutas anidadas aquí */}
        </section>
      </div>
    </main>
  );
}
