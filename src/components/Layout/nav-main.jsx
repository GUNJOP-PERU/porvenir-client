import { useNavigation } from "@/hooks/userNavegation";
import clsx from "clsx";
import { Link } from "react-router-dom";

export function NavMain() {
  const paths = useNavigation();

  return (
    <nav className="h-screen w-16 md:w-72 border-r border-zinc-200 bg-zinc-100 flex flex-col ">
      <div className="w-full px-6 flex justify-between items-center h-14 border-b border-zinc-200">
        <img src="/src/assets/logo.svg" alt="" className="h-7" />
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
                      "w-full h-8 flex items-center gap-2 text-[13px] py-1.5 px-2 rounded-lg cursor-pointer font-semibold hover:bg-primary/10 ",
                      item.active ? "bg-primary/50 md:bg-primary/10 text-primary" : ""
                    )}
                  >
                    {item.icon}
                    <span className="hidden md:flex">{item.name}</span>
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

// <div className="bg-gray-100 text-gray-900 h-screen px-4 fixed w-16 md:w-64 border-r border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white">
// 			<h1 className='text-2xl font-bold hidden md:block mt-4 text-center italic'>CWY Shop</h1>
// 			<ul className='flex flex-col mt-5 text-xl'>
// 				<li className='flex items-center py-3 px-2 space-x-4 hover:rounded hover:cursor-pointer
//         hover:bg-blue-600 hover:text-white'>

// 					<span className='hidden md:inline'>Dashboard</span>
// 				</li>
// 				<li className="flex items-center py-3 px-2 space-x-4 hover:rounded hover:cursor-pointer
//         hover:text-white hover:bg-blue-600">

// 					<span className="hidden md:inline ">Orders</span>
// 				</li>
// 				<li className="flex items-center py-3 px-2 space-x-4 hover:rounded hover:cursor-pointer
//         hover:text-white hover:bg-blue-600">

// 					<span className="hidden md:inline ">Customers</span>
// 				</li>
// 				<li className="flex items-center py-3 px-2 space-x-4 hover:rounded hover:cursor-pointer
//         hover:text-white hover:bg-blue-600">

// 					<span className="hidden md:inline ">Users</span>
// 				</li>
// 				<li className="flex items-center py-3 px-2 space-x-4 hover:rounded hover:cursor-pointer
//         hover:text-white hover:bg-blue-600">

// 					<span className="hidden md:inline ">Products</span>
// 				</li>
// 				<li className="flex items-center py-3 px-2 space-x-4 hover:rounded hover:cursor-pointer
//         hover:text-white hover:bg-blue-600">

// 					<span className="hidden md:inline ">Settings</span>
// 				</li>
// 			</ul>
// 		</div>
