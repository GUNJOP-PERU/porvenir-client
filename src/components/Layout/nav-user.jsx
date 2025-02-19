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

import IconMenu from "@/icons/IconMenu";
import { useNavigation } from "@/hooks/userNavegation";
import { Link } from "react-router-dom";
import clsx from "clsx";
import React, { useState } from "react";
import IconClose from "@/icons/IconClose";

export function NavUser() {
  const paths = useNavigation();
  const [isOpen, setIsOpen] = useState(false);
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
    <>
      <div className="w-full h-14 flex items-center justify-between p-4 border-b border-zinc-100 bg-zinc-50">
        <div className="">
          <div className="flex gap-4 items-center ">
            <button
              onClick={() => setIsOpen(true)}
              className="flex md:hidden h-8 w-8 p-2 bg-zinc-50 text-white rounded-[8px] cursor-pointer hover:bg-zinc-200 transition-colors ease-out duration-500 "
            >
              <IconMenu className="w-4 h-4 text-zinc-400" />
            </button>
            <img src="/src/assets/logo.svg" alt="" className="h-7 flex md:hidden" />
          </div>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center justify-center gap-2 hover:bg-zinc-200 p-2 py-1 rounded-lg cursor-pointer transition-colors ease-out duration-500">
                <Avatar className="h-8 w-8 relative overflow-visible ">
                  {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                  <AvatarFallback className="font-semibold text-sm bg-blue-500 text-white uppercase border-green-500 ">
                    {profile?.name?.charAt(0).toUpperCase() || ""}
                  </AvatarFallback>
                  <div className="absolute inline-flex items-center justify-center w-[16px] h-[16px] text-xs font-normal text-white bg-green-500 border-2 border-zinc-50 rounded-[50%] -bottom-1.5 -right-1.5">
                    <IconCheck className="w-[8px] h-[8px] stroke-white" />
                  </div>
                </Avatar>
                <div className="hidden md:flex flex-col gap-0.5 mr-2 ">
                  <span className=" text-xs font-bold leading-3 truncate">
                    {profile.name || ""}
                  </span>
                  <span className="text-[9.5px] font-semibold text-custom-1700 truncate capitalize text-zinc-500 leading-3">
                    @{profile?.rol || ""}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 hidden md:flex" />
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
      {/* Overlay (Fondo negro semitransparente) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/70 transition-opacity duration-300 animate-fade-in"
          onClick={() => setIsOpen(false)} 
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-zinc-100 transition-transform duration-300 z-[9999] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-screen relative">
          <div className="w-full px-4 py-4 flex gap-4 items-center h-14 border-b border-zinc-200">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 bg-zinc-100 hover:bg-zinc-200 cursor-pointer rounded-[8px] w-8 h-8 transition-colors ease-out duration-500"
            >
              <IconClose className="w-4 h-4 fill-zinc-400" />
            </button>
            <img src="/src/assets/logo.svg" alt="" className="h-7" />
          </div>
          <div className="w-full flex-1 overflow-y-auto px-3 md:px-6 py-4 ">
            {paths.map((section) => (
              <div key={section.title} className="mb-4">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold inline">
                  {section.title}
                </span>
                <ul className="w-full flex flex-col ">
                  {section.items.map((item, index) => (
                     <Link to={item.href} key={index} onClick={() => setIsOpen(false)}>
                      <li
                        className={clsx(
                          "w-full h-8 flex items-center gap-2 text-[13px] py-1.5 px-3 rounded-lg cursor-pointer font-semibold hover:bg-white hover:text-zinc-600 transition ease-in-out duration-200 ",
                          item.active
                            ? "bg-white text-zinc-600 shadow-sm"
                            : "text-zinc-400"
                        )}
                      >
                        {React.cloneElement(item.icon, {
                          className: clsx(
                            "w-4 h-4",
                            item.active
                              ? "text-primary animate-spin-once"
                              : "text-zinc-400"
                          ),
                        })}
                        <span className="flex leading-3 mt-0.5">
                          {item.name}
                        </span>
                      </li>
                    </Link>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
