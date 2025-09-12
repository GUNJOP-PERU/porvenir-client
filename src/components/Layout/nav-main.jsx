import React from "react";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import { useAuthStore } from "@/store/AuthStore";
import { useNavigation } from "@/hooks/useNavegation";
import IconConfiguration from "@/icons/Dashboard/IconConfiguration";
import { ChevronDown } from "lucide-react";

export function NavMain() {
  const { isCollapsed } = useAuthStore();
  const paths = useNavigation();
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div
      className={clsx(
        "hidden md:flex bg-[#000000] transition-all duration-300 ease-in-out relative",
        isCollapsed ? "w-[80px]" : "w-[300px]"
      )}
    >
      <nav className="h-screen w-full flex flex-col">
        <div className="w-full px-5 flex justify-between items-center h-14">
          {!isCollapsed && (
            <img src="./logo-white.svg" alt="" className="h-7" />
          )}
          {isCollapsed && (
            <img src="./gunjop.svg" alt="" className="h-7 mx-auto" />
          )}
        </div>
        <div className="w-full flex-1 overflow-y-auto custom-scrollbar px-5">
          {paths.map((section) => (
            <div key={section.title} className="mb-4">
              <span className="text-[8px] text-zinc-400 uppercase font-semibold hidden md:inline">
                {section.title}
              </span>
              <ul className="w-full flex flex-col">
                {section.items.map((item, index) => {
                  if (item.items) {
                    const hasActiveChild = item.items.some(
                      (subItem) => subItem.active
                    );
                    return (
                      <details
                        key={item.name}
                        className="relative group"
                        open={hasActiveChild} // mantiene abierto si algún hijo está activo
                      >
                        <summary
                          className={clsx(
                            "h-8 flex items-center gap-2 text-[13px] py-1.5 rounded-lg cursor-pointer font-semibold list-none transition ease-in-out duration-200 relative select-none",
                            isCollapsed
                              ? "px-1 w-8 justify-center"
                              : "px-3 w-full",
                            "text-zinc-500",
                            hasActiveChild && "text-primary bg-primary/[0.25]",
                            !hasActiveChild &&
                              "hover:bg-zinc-900 hover:text-zinc-300" 
                          )}
                        >
                          {React.cloneElement(item.icon, {
                            className: clsx(
                              "w-4 h-4 transition ease-in-out duration-200",
                              hasActiveChild
                                ? "text-primary animate-spin-once"
                                : "text-zinc-500 group-hover:text-zinc-300"
                            ),
                          })}
                          <span
                            className={clsx(
                              "flex max-w-[150px] truncate text-ellipsis leading-3 mt-0.5",
                              isCollapsed ? "hidden" : "",
                              hasActiveChild && "text-primary"
                            )}
                          >
                            {item.name}
                          </span>
                          {!isCollapsed && (
                            <ChevronDown
                              className={clsx(
                                "h-4 w-4 absolute top-1/2 -translate-y-1/2 right-1.5 transition-transform duration-200",
                                hasActiveChild
                                  ? "rotate-180 text-primary"
                                  : "text-zinc-500",
                                "group-open:rotate-180"
                              )}
                            />
                          )}
                        </summary>

                        {!isCollapsed && (
                          <ul className="ml-6 mt-1 relative after:absolute after:-left-1 after:w-px after:h-full after:bg-zinc-700 after:top-0">
                            {item.items.map((subItem) => (
                              <li key={subItem.name}>
                                <Link to={subItem.href}>
                                  <div
                                    className={clsx(
                                      "h-8 flex items-center gap-2 text-[13px] py-1.5 rounded-lg cursor-pointer font-semibold transition ease-in-out duration-200 px-3 w-full select-none",
                                      subItem.active
                                        ? "bg-primary/[0.25] text-zinc-200 shadow-sm"
                                        : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
                                    )}
                                  >
                                    <span className="flex max-w-[150px] truncate text-ellipsis leading-3 mt-0.5">
                                      {subItem.name}
                                    </span>
                                  </div>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </details>
                    );
                  }

                  return (
                    <Link to={item.href} key={index} className="relative ">
                      <li
                        className={clsx(
                          "group h-8 flex items-center gap-2 text-[13px] py-1.5 rounded-lg cursor-pointer font-semibold  transition ease-in-out duration-200 ",
                          isCollapsed
                            ? "px-1 w-8 justify-center"
                            : "px-3 w-full",
                          item.active
                            ? "bg-primary/[0.25] text-zinc-200 shadow-sm"
                            : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
                        )}
                      >
                        {React.cloneElement(item.icon, {
                          className: clsx(
                            "w-4 h-4 transition ease-in-out duration-200",
                            item.active
                              ? "text-primary animate-spin-once"
                              : "text-zinc-500 group-hover:text-zinc-300"
                          ),
                        })}
                        <span
                          className={clsx(
                            "flex max-w-[150px] truncate text-ellipsis leading-3 mt-0.5 ",
                            isCollapsed ? "hidden" : ""
                          )}
                        >
                          {item.name}
                        </span>
                        {isCollapsed && (
                          <div className="fixed left-[calc(50px+0.5rem)] ml-2 px-2 py-1 flex items-center justify-center bg-zinc-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 elevation-100">
                            {item.name}
                          </div>
                        )}
                      </li>
                    </Link>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Configuración */}
        <div className="py-5 px-4">
          <ul>
            <Link to="/configuration" className="relative group">
              <li
                className={clsx(
                  "w-full h-8 flex items-center gap-2 text-[13px] py-1.5 px-3 rounded-lg cursor-pointer font-semibold transition ease-in-out duration-200",
                  pathname === "/configuration"
                    ? "bg-primary/[0.25] text-zinc-200 "
                    : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
                )}
              >
                <IconConfiguration
                  className={clsx(
                    "w-4 h-4 transition ease-in-out duration-200",
                    pathname === "/configuration"
                      ? "text-primary animate-spin-once"
                      : "text-zinc-500 group-hover:text-zinc-300"
                  )}
                />
                <span
                  className={clsx(
                    "flex max-w-[150px] truncate text-ellipsis leading-3 mt-0.5 ",
                    isCollapsed ? "hidden" : ""
                  )}
                >
                  Configuración
                </span>
                {isCollapsed && (
                  <div className="fixed left-[calc(50px+0.5rem)] ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity duration-200 z-[9999] shadow-lg">
                    Configuración
                  </div>
                )}
              </li>
            </Link>
          </ul>
        </div>
      </nav>
    </div>
  );
}
