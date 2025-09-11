import { useShiftIcon } from "@/hooks/useShiftIcon";
import CardClock from "../CardClock";
import { NavMenu } from "./nav-menu";
import GlobalSearch from "./nav-global-search";
import { NavUser } from "./nav-user";
import { useAuthStore } from "@/store/AuthStore";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function AppSidebar() {
  const { isCollapsed, setIsCollapsed } = useAuthStore();
  return (
    <div className="bg-[#000000] w-full h-14 flex items-center justify-between p-4  ">
      <div className="hidden md:flex items-center gap-1 ">
      <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-md hover:bg-[#1D1D1D] text-zinc-400 hover:text-white transition-colors"
          aria-label={isCollapsed ? "Expandir menú" : "Contraer menú"}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
        <GlobalSearch />
        <CardClock />
      </div>
      <NavMenu />
      <div className="flex items-center gap-2">
        {useShiftIcon()}
        <NavUser />
      </div>
    </div>
  );
}
