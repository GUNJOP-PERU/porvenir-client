import { cn } from "../lib/utils";

function SkeletonWrapper({ children, isLoading, fullWidth = true }) {
  if (!isLoading) return children;

  return (
    <div className={cn(fullWidth && "w-full h-full relative")}>
      <table className="min-w-full table-auto">
        <thead className="h-10">
          <tr>
            <th className="p-2  bg-zinc-100">
              <div className="h-6 bg-zinc-200 rounded w-full animate-pulse"></div>
            </th>
            <th className="p-2  bg-zinc-100">
              <div className="h-6 bg-zinc-200 rounded w-full animate-pulse"></div>
            </th>
            <th className="p-2  bg-zinc-100">
              <div className="h-6 bg-zinc-200 rounded w-full animate-pulse"></div>
            </th>
            <th className="p-2  bg-zinc-100">
              <div className="h-6 bg-zinc-200 rounded w-full animate-pulse"></div>
            </th>
            <th className="p-2  bg-zinc-100">
              <div className="h-6 bg-zinc-200 rounded w-full animate-pulse"></div>
            </th>
            <th className="p-2  bg-zinc-100">
              <div className="h-6 bg-zinc-200 rounded w-full animate-pulse"></div>
            </th>
            <th className="p-2  bg-zinc-100">
              <div className="h-6 bg-zinc-200 rounded w-full animate-pulse"></div>
            </th>
            <th className="p-2  bg-zinc-100">
              <div className="h-6 bg-zinc-200 rounded w-full animate-pulse"></div>
            </th>
            <th className="p-2  bg-zinc-100">
              <div className="h-6 bg-zinc-200 rounded w-full animate-pulse"></div>
            </th>
            <th className="p-2  bg-zinc-100">
              <div className="h-6 bg-zinc-200 rounded w-full animate-pulse"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="h-16 bg-zinc-100 ">
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            
          </tr>
          <tr className="h-16 bg-zinc-100 ">
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            
          </tr>
          <tr className="h-16 bg-zinc-100 ">
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            
          </tr>
          <tr className="h-16 bg-zinc-100 ">
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            
          </tr>
          <tr className="h-16 bg-zinc-100 ">
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            
          </tr>
          <tr className="h-16 bg-zinc-100 ">
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            
          </tr>
          <tr className="h-16 bg-zinc-100 ">
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            
          </tr>
          <tr className="h-16 bg-zinc-100 ">
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            
          </tr>
          <tr className="h-16 bg-zinc-100 ">
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            
          </tr>
          <tr className="h-16 bg-zinc-100 ">
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            <td className="p-2  bg-zinc-100">
              <div className="h-12 bg-zinc-200 rounded w-full animate-pulse"></div>
            </td>
            
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default SkeletonWrapper;
