import { useShiftIcon } from "@/hooks/useShiftIcon";
import CardClock from "../Dashboard/CardClock";
import { NavMenu } from "./nav-menu";
import GlobalSearch from "./nav-global-search";
import { NavUser } from "./nav-user";

export function AppSidebar() {
  return (
    <div className="bg-[#000000] w-full h-14 flex items-center justify-between p-4  ">
      <div className="hidden md:flex items-center gap-1 ">
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
