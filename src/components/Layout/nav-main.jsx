/* eslint-disable react/prop-types */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import { useAuthStore } from "@/store/AuthStore";
import { useNavigation } from "@/hooks/useNavegation";
import { ChevronDown, Settings } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function NavMain() {
  const { isCollapsed } = useAuthStore();
  const paths = useNavigation();
  const location = useLocation();
  const userType = useAuthStore((state) => state.type);
  const pathname = location.pathname;

  return (
    <div
      className={clsx(
        "hidden md:flex bg-primary-black transition-all duration-300 ease-in-out relative shrink-0 overflow-hidden",
        isCollapsed ? "w-14" : "w-60",
      )}
    >
      <nav className="h-screen w-full flex flex-col">
        <div
          className={clsx(
            "w-full  flex justify-center items-center h-14",
            isCollapsed ? "px-3" : "px-5",
          )}
        >
          <img
            src={isCollapsed ? "/gunjop.svg" : "/logo-white.svg"}
            alt="logo"
            className={clsx(isCollapsed ? "size-6" : "h-6")}
          />
        </div>

        <div
          className={clsx(
            "w-full flex flex-col gap-3 flex-1 overflow-y-auto custom-scrollbar pt-2",
            isCollapsed ? "px-3" : "px-5",
          )}
        >
          {paths.map((section) => (
            <div key={section.name} className="">
              <NavTitle item={section} isCollapsed={isCollapsed}>
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
                    ),
                  )}
                </ul>
              </NavTitle>
            </div>
          ))}
        </div>
        {userType === "admin" && (
          <div className={clsx("py-2 ", isCollapsed ? "px-3" : "px-5")}>
            <NavItem
              name="Configuración"
              href="/configuration"
              icon={<Settings />}
              active={pathname === "/configuration"}
              isCollapsed={isCollapsed}
            />
          </div>
        )}
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
          ? "bg-primary/[0.20] text-zinc-200 shadow-sm"
          : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300",
      )}
    >
      {icon &&
        React.cloneElement(icon, {
          className: clsx(
            "w-4 h-4 transition ease-in-out duration-200",
            active
              ? "text-primary animate-spin-once"
              : "text-zinc-500 group-hover:text-zinc-300",
          ),
        })}
      <span
        className={clsx(
          "block truncate max-w-[150px] leading-3 mt-0.5",
          isCollapsed && "hidden",
        )}
      >
        {name}
      </span>
    </li>
  );

  if (isCollapsed) {
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
  }

  return href ? <Link to={href}>{itemContent}</Link> : itemContent;
};

const NavGroup = ({ item, isCollapsed }) => {
  const hasActiveChild = item.items.some((sub) => sub.active);
  const activeChild = item.items.find((sub) => sub.active);

  const tooltipContent = hasActiveChild ? (
    <div className="flex flex-col gap-1">
      <p className="font-semibold">
        {item.name} / {activeChild?.name}
      </p>
    </div>
  ) : (
    <p className="font-semibold">{item.name}</p>
  );

  const summary = (
    <summary
      className={clsx(
        "h-8 flex items-center gap-2 text-[13px] py-1.5 rounded-lg cursor-pointer font-semibold list-none transition ease-in-out duration-200 relative select-none",
        isCollapsed ? "px-1 w-8 justify-center" : "px-3 w-full",
        "text-zinc-500",
        hasActiveChild && "text-primary bg-primary/[0.20]",
        !hasActiveChild && "hover:bg-zinc-900 hover:text-zinc-300",
      )}
    >
      {React.cloneElement(item.icon, {
        className: clsx(
          "w-4 h-4 transition ease-in-out duration-200",
          hasActiveChild
            ? "text-primary animate-spin-once"
            : "text-zinc-500 group-hover:text-zinc-300",
        ),
      })}
      {!isCollapsed && (
        <>
          <span
            className={clsx(
              "flex max-w-[150px] truncate text-ellipsis leading-3 mt-0.5",
              hasActiveChild && "text-primary",
            )}
          >
            {item.name}
          </span>
          <ChevronDown
            className={clsx(
              "h-4 w-4 absolute top-1/2 -translate-y-1/2 right-1.5 transition-transform duration-200",
              hasActiveChild ? "rotate-180 text-primary" : "text-zinc-500",
              "group-open:rotate-180",
            )}
          />
        </>
      )}
    </summary>
  );

  return (
    <details className="relative group" open={hasActiveChild}>
      {isCollapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>{summary}</TooltipTrigger>
          <TooltipContent side="right">{tooltipContent}</TooltipContent>
        </Tooltip>
      ) : (
        summary
      )}

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
const NavTitle = ({ item, isCollapsed, children }) => {
  const hasActive = item.items?.some(
    (i) => i.active || i.items?.some((s) => s.active),
  );

  return (
    <details className="group/title" open={hasActive}>
      <summary className="flex items-center justify-between w-full py-2 cursor-pointer select-none border-t border-zinc-700">
        <span className="truncate text-[9px] text-zinc-400 uppercase font-semibold">
          {item.name}
        </span>

        {!isCollapsed && (
          <ChevronDown
            className="h-3 w-3 text-zinc-500 transition-transform 
          group-open/title:rotate-180"
          />
        )}
      </summary>

      {!isCollapsed && children}
    </details>
  );
};
