import { useNavigation } from "@/hooks/userNavegation";
import clsx from "clsx";
import React, { useState } from "react";
import { Link } from "react-router-dom";

export function NavMain() {
  const paths = useNavigation();

  return (
    <>
      <nav className="h-screen hidden md:flex w-[280px] border-r border-zinc-100 bg-zinc-100 flex-col ">
        <div className="w-full px-6 flex justify-between items-center h-14 border-b border-zinc-100">
          <img src="/src/assets/logo.svg" alt="" className="h-7 " />
        </div>
        <div className="w-full flex-1 overflow-y-auto px-3 md:px-6 py-4 ">
          {paths.map((section) => (
            <div key={section.title} className="mb-4">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold hidden md:inline">
                {section.title}
              </span>
              <ul className="w-full flex flex-col ">
                {section.items.map((item, index) => (
                  <Link to={item.href} key={index}>
                    <li
                      className={clsx(
                        "w-full h-8 flex items-center gap-2 text-[13px] py-1.5 px-3 rounded-lg cursor-pointer font-semibold hover:bg-white hover:text-zinc-600 transition ease-in-out duration-200  ",
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
      </nav>

    
    </>
  );
}
