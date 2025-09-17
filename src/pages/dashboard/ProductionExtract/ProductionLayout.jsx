import { NavLink, Outlet, useMatches } from "react-router-dom";

export default function ProductionLayout() {
  const matches = useMatches();
  const current = matches.find((m) => m.handle?.tabs);
  const tabs = current?.handle?.tabs ?? [];

  return (
    <>
      <aside className="w-full pb-1 mb-1 text-xs flex border-b border-zinc-100">
        {tabs.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive
                ? "font-bold text-primary relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-primary/50 px-2"
                : "text-zinc-400 px-2"
            }
          >
            {label}
          </NavLink>
        ))}
      </aside>
      <main className="flex-1 flex flex-col gap-2">
        <Outlet />
      </main>
    </>
  );
}
