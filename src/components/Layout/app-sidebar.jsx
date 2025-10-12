import { useShiftIcon } from "@/hooks/useShiftIcon";
import CardClock from "./CardClock";
import { NavMenu } from "./nav-menu";
import GlobalSearch from "./nav-global-search";
import { NavUser } from "./nav-user";
import { useAuthStore } from "@/store/AuthStore";
import { PanelRightClose, PanelRightOpen } from "lucide-react";

export function AppSidebar() {
  const { isCollapsed, setIsCollapsed } = useAuthStore();
  return (
    <div className="bg-primary-black w-full h-14 flex items-center justify-between pr-4 pl-4 xl:pl-0  ">
      <div className="hidden md:flex items-center gap-1 ">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-md hover:bg-[#1D1D1D] text-zinc-400 hover:text-white transition-colors"
          aria-label={isCollapsed ? "Expandir menú" : "Contraer menú"}
        >
          {isCollapsed ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
        </button>
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
