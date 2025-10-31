import { useNavigation } from "@/hooks/useNavegation";
import IconClose from "@/icons/IconClose";
import IconMenu from "@/icons/IconMenu";
import clsx from "clsx";
import { ChevronDown, Settings } from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/AuthStore";

export function NavMenu() {
  const paths = useNavigation();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const userType = useAuthStore((state) => state.type);
  const pathname = location.pathname;

  return (
    <>
      <div className="flex gap-4 items-center md:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-8 w-8 p-2 bg-[#000000] hover:bg-zinc-800 text-white rounded-[8px] cursor-pointer  transition-colors ease-out duration-500 "
        >
          <IconMenu className="w-4 h-4 text-zinc-400" />
        </button>
        <div className="w-full  flex justify-center items-center h-14 ">
          <img src="/logo-white.svg" alt="logo" className="h-6" />
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/70 transition-opacity duration-300 animate-fade-in md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <div
        className={`fixed left-0 top-0 h-full w-[75%] bg-[#000000] transition-transform duration-300 z-[9999] md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-screen relative flex flex-col">
          <div className="w-full px-4 py-4 flex gap-4 items-center h-14 border-b border-zinc-900">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 bg-[#000000] hover:bg-zinc-800 cursor-pointer rounded-[8px] w-8 h-8 transition-colors ease-out duration-500"
            >
              <IconClose className="w-4 h-4 fill-zinc-400" />
            </button>
            <img src="/logo-white.svg" alt="logo" className="h-6" />
          </div>
          <div className="flex flex-col gap-4 w-full flex-1 overflow-y-auto custom-scrollbar px-6 py-4 ">
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
                      onClose={() => setIsOpen(false)} 
                    />
                  ) : (
                    <NavItem
                      key={item.name}
                      name={item.name}
                      href={item.href}
                      icon={item.icon}
                      active={item.active}
                      onClose={() => setIsOpen(false)} 
                    />
                  )
                )}
              </ul>
            </div>
          ))}
          </div>
          {userType === "admin" &&
            <div className="py-2 px-3">
              <NavItem
                name="Configuración"
                href="/configuration"
                icon={<Settings />}
                active={pathname === "/configuration"}
                onClose={() => setIsOpen(false)} 
              />
            </div>
          }
        </div>
      </div>
    </>
  );
}

const NavItem = ({ name, href, icon, active, onClose }) => {
  const itemContent = (
    <li
      className={clsx(
        "group h-8 flex items-center gap-2 text-[13px] py-1.5 px-3 w-full rounded-lg cursor-pointer font-semibold transition ease-in-out duration-200",
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
      <span className="block truncate max-w-[150px] leading-3 mt-0.5">
        {name}
      </span>
    </li>
  );

  return href ? <Link to={href} onClick={onClose}>{itemContent}</Link> : itemContent;
};

const NavGroup = ({ item, onClose }) => {
  const hasActiveChild = item.items.some((sub) => sub.active);

  return (
    <details className="relative group" open={hasActiveChild}>
      <summary
        className={clsx(
          "h-8 flex items-center gap-2 text-[13px] py-1.5 px-3 w-full rounded-lg cursor-pointer font-semibold list-none transition ease-in-out duration-200 relative select-none",
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
      </summary>

      <ul className="ml-6 mt-1 relative after:absolute after:-left-1 after:w-px after:h-full after:bg-zinc-700 after:top-0">
        {item.items.map((sub) => (
          <NavItem
            key={sub.name}
            name={sub.name}
            href={sub.href}
            active={sub.active}
            onClose={onClose}
          />
        ))}
      </ul>
    </details>
  );
};

