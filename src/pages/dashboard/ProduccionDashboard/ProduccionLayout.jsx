import { NavLink, Outlet } from "react-router-dom";

export default function ProduccionLayout() {
  return (
    <>
      <aside className="w-full pb-1 mb-1 text-xs flex border-b border-zinc-100">
        <NavLink
          to="realtime"
          className={({ isActive }) => 
            isActive
              ? "font-bold text-primary relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-primary/50 px-2"
              : "text-zinc-400 px-2"
          }
        >
          Tiempo Real
        </NavLink>
        <NavLink
          to="historico"
          className={({ isActive }) =>
            isActive
              ? "font-bold text-primary relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-primary/50 px-2"
              : "text-zinc-400 px-2"
          }
        >
          Histórico
        </NavLink>
      </aside>
      <main className="flex-1 flex flex-col gap-2">
        <Outlet />
      </main>
    </>
  );
}