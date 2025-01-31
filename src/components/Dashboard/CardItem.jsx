import IconArrowUp from "@/icons/IconArrowUp";
import clsx from "clsx";

function CardItem({ value, title, change, valueColor, unid }) {
  const getColorClass = (value) => {
    if (value >= 85) return "text-green-500";
    if (value >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getTooltipText = (value) => {
    if (value >= 85) return "Excelente";
    if (value >= 60) return "Bien";
    return "a mejorar";
  };

  return (
    <div className="flex flex-col justify-center relative">
      <div className="flex justify-between gap-1">
        <h1 className={`${valueColor} font-extrabold text-2xl leading-7`}>
          {value}
          <small>{unid}</small>
        </h1>
      </div>
      <span className="text-[10px] font-semibold text-zinc-700">{title}</span>

      {change !== undefined && (
        <>
          <div
            className="mt-2 flex items-center"
            data-tooltip-target="tooltip-default"
          >
            <IconArrowUp
              className={clsx(
                "w-3.5 h-3.5",
                change >= 85
                  ? "text-green-500"
                  : change >= 60
                  ? "text-yellow-500"
                  : "text-red-500" // Colores basados en el valor de change
              )}
            />

            <span
              className={clsx(
                "text-[10px] leading-[8px] font-bold",
                getColorClass(change)
              )}
            >
              {`${(100 - change).toFixed(2)}% ${getTooltipText(change)}`}
            </span>
          </div>
         

          <div class=" absolute -top-3 left-0 -mt-[2px] flex flex-col group-focus-within:visible group-active:visible">
            <div class="flex min-w-max flex-col rounded-md bg-red-500 text-[8px] leading-[8px] font-bold text-white px-2.5 py-1.5 uppercase">
              {getTooltipText(change)}!
            </div>
            <div class="ml-1 -mt-[4px] inline-block overflow-hidden">
              <div class="h-2 w-2 origin-bottom-right rotate-45 transform bg-red-500 "></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CardItem;
