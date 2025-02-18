import { CheckIcon, ChevronsUpDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import IconReducer from "@/icons/IconReducer";
import IconLogout from "@/icons/IconLogout";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/AuthStore";
import IconCheck from "@/icons/IconCheck";

export function NavUser() {
  const { profile } = useAuthStore();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    navigate("/login");
    logout();
    // logoutGlobal();
    // disconnectSocket();
  };


  return (
    <div className="w-full h-14 flex items-center justify-between p-4 border-b border-zinc-100 bg-zinc-50">
      <div>
        <IconReducer className="w-5 h-5 fill-zinc-400" />
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
             
              className="flex items-center justify-center gap-2 hover:bg-zinc-200 p-2 py-1 rounded-lg cursor-pointer"
            >
              <Avatar  className="h-8 w-8 relative overflow-visible ">
                {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                <AvatarFallback className="font-semibold text-sm bg-blue-500 text-white uppercase border-green-500 ">
                    {profile?.name?.charAt(0).toUpperCase() || ""}
                  </AvatarFallback>
                <div className="absolute inline-flex items-center justify-center w-[16px] h-[16px] text-xs font-normal text-white bg-green-500 border-2 border-zinc-50 rounded-[50%] -bottom-1.5 -right-1.5">
                  <IconCheck className="w-[8px] h-[8px] stroke-white" />
                </div>
              </Avatar>
              <div className="flex flex-col gap-0.5 mr-2 ">
                <span className=" text-xs font-bold leading-3 truncate">
                  {profile.name || ""}
                </span>
                <span className="text-[9.5px] font-semibold text-custom-1700 truncate capitalize text-zinc-500 leading-3">
                @{profile?.rol || ""}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
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
                    {profile?.name ||""}
                  </span>
                  <span className="text-[10px] font-semibold leading-3 text-custom-1700 truncate capitalize text-zinc-500 ">
                    @{profile?.rol || ""}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <div className="mt-2 px-1 py-0.5 rounded-md">
           
            {/* <DropdownMenuGroup>
              <DropdownMenuItem>
               
                Producción
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator /> */}

            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-500 focus:text-red-500 focus:bg-red-50"
            >
              <IconLogout className="stroke-red-600 " />
              Cerrar Sesión
            </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
