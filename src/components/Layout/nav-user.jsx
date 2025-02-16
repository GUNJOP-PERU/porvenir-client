import { ChevronsUpDown, LogOut } from "lucide-react";
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

export function NavUser() {
  const { profile } = useAuthStore();
  const logout = useAuthStore((state) => state.logout);
  const user = {
    name: "James Poma",
    email: "m@example.com",
    avatar: "/src/assets/avatars/men/13.png",
  };

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
              size="lg"
              className="flex items-center justify-center gap-2 hover:bg-zinc-200 p-2 py-1 rounded-lg cursor-pointer"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback></AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight mr-2">
                <span className=" text-xs font-bold leading-3 truncate">
                  {profile.name || "Anonimo"}{" "}
                </span>
                <span className="text-[9.5px] font-semibold text-custom-1700 truncate capitalize text-zinc-500 leading-3">
                  {profile.email || "m@example.com"}
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
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                {/* <Sparkles /> */}
                Producción
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleLogout}>
              <IconLogout className="stroke-zinc-600" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
