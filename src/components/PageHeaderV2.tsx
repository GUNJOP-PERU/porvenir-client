import { ButtonRefresh } from "./ButtonRefresh";
import { Button } from "./ui/button";
import { CircleFadingPlus } from "lucide-react";

interface  PageHeaderProps {
  title: string,
  description: string,
  count?: number,
  actions?: JSX.Element,
  refetch: () => void,
  isFetching: boolean,
  setDialogOpen: boolean,
  className?: string,
  status?: {
    value: number,
    color: string
  }[]
}

export default function PageHeader({
  title,
  description,
  count,
  actions,
  refetch,
  isFetching,
  setDialogOpen,
  className,
  status
} : PageHeaderProps ) {
  return (
    <div className={`flex flex-wrap gap-2 justify-between ${className}`}>
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-md lg:text-xl font-bold leading-none">{title}</h1>
          {count && (
            <span className="text-[10px] text-zinc-500 bg-zinc-100 rounded-[6px] min-w-5 w-fit h-5 flex items-center justify-center px-1 font-bold">
              {count}
            </span>
          )}
          {status && 
            status.map((stat, index) => (
              <span key={index} className={`text-[10px] text-white rounded-[6px] min-w-5 w-fit h-5 flex items-center justify-center px-1 font-bold`} style={{backgroundColor: stat.color}}>
                {stat.value}
              </span>
          ))}
        </div>
        {description && <p className="text-zinc-400 text-[10.5px] lg:text-xs">{description}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {setDialogOpen && (
          <Button onClick={() => setDialogOpen(true)} className="flex items-center gap-2 !min-w-9 md:!min-w-[100px] px-2 md:px-3 ">
            <CircleFadingPlus className="size-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Añadir nuevo
            </span>
          </Button>
        )}
        {actions}
        <div className="flex flex-col justify-end">
          {refetch && <ButtonRefresh refetch={refetch} isFetching={isFetching} />}
        </div>
      </div>
    </div>
  );
}
