import { useNavigation } from "@/hooks/userNavegation";
import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";

export function NavMain() {
  const paths = useNavigation();

  return (
    <nav className="w-full h-full">
      <div className="w-full px-6 flex justify-between items-center h-14 border-b border-zinc-200">
        <img src="/src/assets/logo.svg" alt="" className="h-7" />
      </div>
      <div className="w-full px-6 py-4">
        {paths.map((section) => (
          <div key={section.title} className="mb-4">
            <span className="text-[10px] text-zinc-400 uppercase font-semibold">{section.title}</span>
            <ul className="w-full flex flex-col">
              {section.items.map((item, index) => (
                <Link to={item.href} key={index}>
                  <li
                    className={clsx(
                      "w-full h-8 flex items-center gap-2 text-[13px] py-1.5 px-2 rounded-lg cursor-pointer font-semibold hover:bg-primary/10 ",
                      item.active ? "bg-primary/10 text-primary" : ""
                    )}
                  >
                    {item.icon}
                    {item.name}
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
