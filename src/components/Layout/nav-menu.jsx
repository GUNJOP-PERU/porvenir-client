import { useNavigation } from "@/hooks/useNavegation";
import IconClose from "@/icons/IconClose";
import IconMenu from "@/icons/IconMenu";
import clsx from "clsx";
import React, { useState } from "react";
import { Link } from "react-router-dom";

export function NavMenu() {
  const paths = useNavigation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex gap-4 items-center md:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-8 w-8 p-2 bg-[#000000] hover:bg-zinc-800 text-white rounded-[8px] cursor-pointer  transition-colors ease-out duration-500 "
        >
          <IconMenu className="w-4 h-4 text-zinc-400" />
        </button>
        <img src="./logo-white.svg" alt="" className="h-7 " />
      </div>
      {/* Overlay (Fondo negro semitransparente) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/70 transition-opacity duration-300 animate-fade-in md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-[75%] bg-[#000000] transition-transform duration-300 z-[9999] md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-screen relative">
          <div className="w-full px-4 py-4 flex gap-4 items-center h-14 border-b border-zinc-900">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 bg-[#000000] hover:bg-zinc-800 cursor-pointer rounded-[8px] w-8 h-8 transition-colors ease-out duration-500"
            >
              <IconClose className="w-4 h-4 fill-zinc-600" />
            </button>
            <img src="./logo-white.svg" alt="" className="h-7" />
          </div>
          <div className="flex flex-col gap-4 w-full flex-1 overflow-y-auto px-6 py-4 ">
            {paths.map((section) => (
              <div key={section.title} className="">
                <span className="text-[8px] text-zinc-500 uppercase font-semibold inline">
                  {section.title}
                </span>
                <ul className="w-full flex flex-col ">
                  {section.items.map((item, index) => (
                    <Link
                      to={item.href}
                      key={index}
                      onClick={() => setIsOpen(false)}
                    >
                      <li
                        className={clsx(
                          "w-full h-[34px] flex items-center gap-2 text-[13px] py-1.5 px-3 rounded-lg cursor-pointer font-semibold hover:bg-[#1D1D1D] hover:text-zinc-200 transition ease-in-out duration-200 ",
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
