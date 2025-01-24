import { useNavigation } from "@/hooks/userNavegation";
import { Link, useLocation } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

import clsx from "clsx";
import { NavUser } from "./Dashboard/nav-user";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";

export default function Header() {
  const paths = useNavigation();

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 justify-between bg-muted/50 px-6 border-b border-zinc-200">
        <div className="flex items-center gap-2 ">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Gestión de Listas</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Usuarios</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div>
          <NavUser />
        </div>
      </header>
      <div className="w-full left-0 py-2 flex flex-col justify-center gap-1 ">
        <div className="flex gap-2 border-b border-zinc-100 mx-8">
          {paths.map((route, index) => {
            return (
              <Link
                to={route.href}
                key={index}
                className="flex items-center justify-center"
              >
                <button
                  className={clsx(
                    " px-3",
                    route.active
                      ? "after:bg-primary border-b-2 border-primary"
                      : ""
                  )}
                >
                  <span
                    className={clsx(
                      " text-[10px]",
                      route.active ? " text-primary" : ""
                    )}
                  >
                    {route.name}
                  </span>
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
