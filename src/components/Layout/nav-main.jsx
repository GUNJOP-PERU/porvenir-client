import React from "react";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import { useAuthStore } from "@/store/AuthStore";
import { useNavigation } from "@/hooks/useNavegation";
import IconConfiguration from "@/icons/Dashboard/IconConfiguration";
import { ChevronDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";


export function NavMain() {
  const { isCollapsed } = useAuthStore();
  const paths = useNavigation();
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div
      className={clsx(
        "hidden md:flex bg-[#000000] transition-all duration-300 ease-in-out relative",
        isCollapsed ? "w-14" : "w-60"
      )}
    >
      <nav className="h-screen w-full flex flex-col">
        {/* Logo */}
        <div className="w-full px-5 flex justify-between items-center h-14">
        <img
          src={isCollapsed ? "/gunjop.svg" : "/logo-white.svg"}
          alt="logo"
          className="h-7 mx-auto"
        />
        </div>

        <div className={clsx("w-full flex flex-col gap-3 flex-1 overflow-y-auto custom-scrollbar pt-2", isCollapsed ? "px-3" : "px-5")}>
          {paths.map((section) => (
            <div key={section.title} className="">
              <div className="flex w-full pb-1">
                <span className="truncate min-w-0 text-[8px] text-zinc-400 uppercase font-semibold">
                  {section.title}
                </span>
              </div>
              <ul className="w-full flex flex-col">
                {section.items.map((item) =>
                  item.items ? (
                    <NavGroup
                      key={item.name}
                      item={item}
                      isCollapsed={isCollapsed}
                    />
                  ) : (
                    <NavItem
                      key={item.name}
                      name={item.name}
                      href={item.href}
                      icon={item.icon}
                      active={item.active}
                      isCollapsed={isCollapsed}
                    />
                  )
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Configuración */}
        <div className={clsx("py-2 ", isCollapsed ? "px-3" : "px-5")}>
          <NavItem
            name="Configuración"
            href="/configuration"
            icon={<IconConfiguration />}
            active={pathname === "/configuration"}
            isCollapsed={isCollapsed}
          />
        </div>
      </nav>
    </div>
  );
}

const NavItem = ({ name, href, icon, active, isCollapsed }) => {
  const itemContent = (
    <li
      className={clsx(
        "group h-8 flex items-center gap-2 text-[13px] py-1.5 rounded-lg cursor-pointer font-semibold transition ease-in-out duration-200",
        isCollapsed ? "px-1 w-8 justify-center" : "px-3 w-full",
        active
          ? "bg-primary/[0.25] text-zinc-200 shadow-sm"
          : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
      )}
    >
      {icon &&
        React.cloneElement(icon, {
          className: clsx(
            "w-4 h-4 transition ease-in-out duration-200",
            active
              ? "text-primary animate-spin-once"
              : "text-zinc-500 group-hover:text-zinc-300"
          ),
        })}
      <span
        className={clsx(
          "block truncate max-w-[150px] leading-3 mt-0.5",
          isCollapsed && "hidden"
        )}
      >
        {name}
      </span>
    </li>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {href ? <Link to={href}>{itemContent}</Link> : itemContent}
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{name}</p>
      </TooltipContent>
    </Tooltip>
  );
};


const NavGroup = ({ item, isCollapsed }) => {
  const hasActiveChild = item.items.some((sub) => sub.active);

  return (
    <details className="relative group" open={hasActiveChild}>
      <summary
        className={clsx(
          "h-8 flex items-center gap-2 text-[13px] py-1.5 rounded-lg cursor-pointer font-semibold list-none transition ease-in-out duration-200 relative select-none",
          isCollapsed ? "px-1 w-8 justify-center" : "px-3 w-full",
          "text-zinc-500",
          hasActiveChild && "text-primary bg-primary/[0.25]",
          !hasActiveChild && "hover:bg-zinc-900 hover:text-zinc-300"
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
        {!isCollapsed && (
          <>
            <span
              className={clsx(
                "flex max-w-[150px] truncate text-ellipsis leading-3 mt-0.5",
                hasActiveChild && "text-primary"
              )}
            >
              {item.name}
            </span>
            <ChevronDown
              className={clsx(
                "h-4 w-4 absolute top-1/2 -translate-y-1/2 right-1.5 transition-transform duration-200",
                hasActiveChild ? "rotate-180 text-primary" : "text-zinc-500",
                "group-open:rotate-180"
              )}
            />
          </>
        )}
      </summary>

      {!isCollapsed && (
        <ul className="ml-6 mt-1 relative after:absolute after:-left-1 after:w-px after:h-full after:bg-zinc-700 after:top-0">
          {item.items.map((sub) => (
            <NavItem
              key={sub.name}
              name={sub.name}
              href={sub.href}
              active={sub.active}
              isCollapsed={false}
            />
          ))}
        </ul>
      )}
    </details>
  );
};
