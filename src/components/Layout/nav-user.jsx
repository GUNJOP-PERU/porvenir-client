import IconCheck from "@/icons/IconCheck";
import { useAuthStore } from "@/store/AuthStore";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function NavUser() {
  const { profile } = useAuthStore();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    navigate("/login");
    logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center justify-center gap-2 hover:bg-zinc-800 p-2 py-1 rounded-lg cursor-pointer transition-colors ease-out duration-500">
          <Avatar className="h-8 w-8 relative overflow-visible ">
            {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
            <AvatarFallback className="font-semibold text-sm bg-primary text-white uppercase border-none  ">
              {profile?.name?.charAt(0).toUpperCase() || ""}
            </AvatarFallback>
            <div className="absolute inline-flex items-center justify-center w-[16px] h-[16px] text-xs font-normal text-white bg-green-500 border-2 border-black rounded-[50%] -bottom-1.5 -right-1.5">
              <IconCheck className="w-[8px] h-[8px] stroke-white" />
            </div>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-44 "
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="text-[10px] text-zinc-400">
          Mi cuenta
        </DropdownMenuLabel>
        <DropdownMenuLabel className="p-0 font-normal ">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 relative overflow-visible capitalize ">
              <AvatarFallback className="font-semibold text-sm bg-zinc-100 text-custom-1900 uppercase">
                {profile?.name?.charAt(0).toUpperCase() || ""}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5 ">
              <span className="text-[13px] font-medium leading-4 truncate">
                {profile?.name || ""}
              </span>
              <span className="text-[10px] font-semibold leading-3 text-custom-1700 truncate capitalize text-zinc-500 ">
                @{profile?.rol || ""}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <div className="mt-2 px-1 py-0.5 rounded-md">
                 <DropdownMenuItem
            onClick={handleLogout}
            className="text-red-500 focus:text-red-500 focus:bg-red-50"
          >
            <LogOut className="text-red-600 " />
            Cerrar Sesión
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
