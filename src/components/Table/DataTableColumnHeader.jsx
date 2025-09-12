import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function DataTableColumnHeader({
  column,
  title,
  className,
}) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const handleClick = () => {
    if (!column.getIsSorted()) {
      column.toggleSorting(false);
    } else if (column.getIsSorted() === 'asc') {
      column.toggleSorting(true);
    } else {
      column.clearSorting();
    }
  };
  
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <button        
        className="-ml-3 flex items-center space-x-2"
        onClick={handleClick}
      >
        <span className="text-[10px]">{title}</span>
        {column.getIsSorted() === "desc" ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "asc" ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : (
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        )}
      </button>
    </div>
  );
}
