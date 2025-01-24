import { useNavigation } from "@/hooks/userNavegation";
import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";

export function NavMain() {
  const paths = useNavigation();
  const location = useLocation();

  return (
    <nav className="w-full h-full ">
      <div className="w-full px-6 flex justify-between items-center h-14 border-b border-zinc-200">
        <img src="/src/assets/logo.svg" alt="" className="h-7" />
      </div>
      <div className="w-full px-6">
        <span className="text-[10px] text-zinc-400">GENERAL</span>
        <ul className="w-full flex flex-col">
          {paths.map((item, index) => {
            return (
              <Link to={item.href} key={index}>
                <li
                  className={clsx(
                    " w-full h-9 text-[13px] py-1.5 px-4 rounded-lg cursor-pointer",
                    item.active ? "bg-primary/10 text-primary" : ""
                  )}
                >
                  {item.name}
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
