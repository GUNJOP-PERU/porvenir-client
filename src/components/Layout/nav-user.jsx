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

export function NavUser() {


  const user = {
    name: "James Poma",
    email: "m@example.com",
    avatar: "/src/assets/avatars/men/13.png",
  };

  return (
    <div className="w-full h-14 flex items-center justify-between p-4 border-b border-zinc-100 bg-zinc-50">
      <div>
      <IconReducer className="w-5 h-5 fill-zinc-400"/>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              size="lg"
              className="flex"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback >CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight mr-2">
                <span className="truncate font-bold">{user.name}</span>
                <span className="truncate text-xs text-zinc-500">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          
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
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                {/* <BadgeCheck /> */}
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                {/* <CreditCard /> */}
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                {/* <Bell /> */}
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
