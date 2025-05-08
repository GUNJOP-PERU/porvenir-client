import { useShiftIcon } from "@/hooks/useShiftIcon";
import { useNavigation } from "@/hooks/useNavegation";
import IconLeft from "@/icons/IconLeft";
import CardClock from "../Dashboard/CardClock";
import { NavMenu } from "./nav-menu";
import GlobalSearch from "./nav-global-search";
import { NavUser } from "./nav-user";

export function AppSidebar() {
  const paths = useNavigation();
  const activeItem = paths
    .flatMap((section) => section.items) // Convertir en un solo array de items
    .find((item) => item.active); // Buscar el que tiene `active: true`

  return (
    <div className="bg-[#000000] w-full h-14 flex items-center justify-between p-4  ">
      <div className="hidden md:flex items-center gap-1 ">
        {/* <span className="text-xs font-semibold text-zinc-500">Gunjop</span>
        <IconLeft className="w-4 h-4 text-zinc-500" />
        <span className="text-xs font-semibold text-zinc-200">
          {activeItem ? activeItem.name : "Página desconocida"}
        </span> */}
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
