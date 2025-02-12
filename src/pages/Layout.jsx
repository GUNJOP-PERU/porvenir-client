import { NavMain } from "@/components/Layout/nav-main";
import { NavUser } from "@/components/Layout/nav-user";

export default function Layout({ children }) {
  return (
    <main className="h-screen flex w-full overflow-hidden">
      <NavMain />
      <div
        className="w-screen h-screen bg-gray-50 text-gray-900
      dark:bg-gray-900 dark:text-white overflow-hidden flex flex-col"
      >
        <NavUser />
        <section className="flex-1 flex flex-col gap-x-4 gap-y-2 p-4 overflow-auto">
          {children}
        </section>
      </div>
    </main>
  );
}
