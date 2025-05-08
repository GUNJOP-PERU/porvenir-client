import { useNavigation } from "@/hooks/useNavegation";
import IconConfiguration from "@/icons/Dashboard/IconConfiguration";
import clsx from "clsx";
import React from "react";
import { Link, useLocation } from "react-router-dom";

export function NavMain() {
  const paths = useNavigation();
  const location = useLocation();
  const pathname = location.pathname;
  return (
    <nav className="h-screen hidden md:flex w-[300px] bg-[#000000] flex-col ">
      <div className="w-full px-6 flex justify-center items-center h-14 ">
        <img src="/src/assets/logo-white.svg" alt="" className="h-7 " />
      </div>
      <div className="w-full flex-1 overflow-y-auto px-5 py-4 ">
        {paths.map((section) => (
          <div key={section.title} className="mb-4">
            <span className="text-[8px] text-zinc-500 uppercase font-semibold hidden md:inline">
              {section.title}
            </span>
            <ul className="w-full flex flex-col ">
              {section.items.map((item, index) => (
                <Link to={item.href} key={index}>
                  <li
                    className={clsx(
                      "w-full h-[34px] flex items-center gap-2 text-[13px] py-1.5 px-3 rounded-lg cursor-pointer font-semibold hover:bg-[#1D1D1D] hover:text-zinc-200 transition ease-in-out duration-200  ",
                      item.active
                        ? "bg-[#1D1D1D] text-zinc-200 shadow-sm"
                        : "text-zinc-600"
                    )}
                  >
                    {React.cloneElement(item.icon, {
                      className: clsx(
                        "w-4 h-4",
                        item.active
                          ? "text-primary animate-spin-once"
                          : "text-zinc-600"
                      ),
                    })}
                    <span className="flex max-w-[150px] truncate text-ellipsis  leading-3 mt-0.5">
                      {item.name}
                    </span>
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="py-5 px-4">
      <ul>
        <Link to="/configuration">
          <li
            className={clsx(
              "w-full h-[34px] flex items-center gap-2 text-[13px] py-1.5 px-3 rounded-lg cursor-pointer font-semibold hover:bg-[#1D1D1D] hover:text-zinc-200 transition ease-in-out duration-200",pathname === "/configuration"
              ? "bg-[#1D1D1D] text-zinc-200 "
              : "text-zinc-600"
            )}
          >
            <IconConfiguration
              className={clsx(
                "w-4 h-4 ",
                pathname === "/configuration"
                  ? "text-primary animate-spin-once"
                  : "text-zinc-600"
              )}
            />
            <span className="flex max-w-[150px] truncate text-ellipsis leading-3 mt-0.5">
              Configuración
            </span>
          </li>
        </Link>
      </ul>
    </div>
    </nav>
  );
}
