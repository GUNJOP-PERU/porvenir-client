import IconArrowUp from "@/icons/IconArrowUp";
import clsx from "clsx";
import React, { Suspense, useMemo } from "react";

const CardItem = React.memo(
  ({ value, title, change, valueColor, unid, subtitle }) => {
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
      <div className="flex flex-col justify-center relative bg-zinc-100/50 rounded-xl py-2 px-4 min-w-[130px] h-[90px]">
        <span className="text-[10px] leading-3 font-semibold text-zinc-400 line-clamp-2 max-w-[100px] mb-2">
          {title}
        </span>
        <div className="flex items-center justify-between gap-1">
          <h1 className={`${valueColor} font-extrabold text-2xl leading-5`}>
            {value}
            <small>{unid}</small>
          </h1>
        </div>

        {change !== undefined && (
          <>
            <div
              data-tooltip-target="tooltip-default"
              className={clsx(
                "mt-0.5 flex items-center px-1 py-[2px] w-fit rounded-[5px]",
                change >= 85
                  ? "text-green-500"
                  : change >= 60
                  ? "bg-yellow-100"
                  : "bg-red-100" // Colores basados en el valor de change
              )}
            >
              <IconArrowUp
                className={clsx(
                  "w-3.5 h-3.5",
                  change >= 85
                    ? "fill-green-500"
                    : change >= 60
                    ? "fill-yellow-500"
                    : "fill-red-500 rotate-180" // Colores basados en el valor de change
                )}
              />

              <span
                className={clsx(
                  "text-[10px] leading-[8px] font-semibold",
                  getColorClass(change)
                )}
              >
                {`${(100 - change).toFixed(2)}%`}
              </span>
            </div>

            <div className=" absolute -top-3 left-0 -mt-[2px] flex flex-col group-focus-within:visible group-active:visible">
              <div className="flex min-w-max flex-col rounded-md bg-red-500 text-[8px] leading-[8px] font-bold text-white px-2.5 py-1.5 uppercase">
                {getTooltipText(change)}!
              </div>
              <div className="ml-1 -mt-[4px] inline-block overflow-hidden">
                <div className="h-2 w-2 origin-bottom-right rotate-45 transform bg-red-500 "></div>
              </div>
            </div>
          </>
        )}
        {subtitle !== undefined && (
          <span className="mt-0.5 text-[10px] leading-[8px] font-semiboldt text-zinc-600 text- ">
            {subtitle}
          </span>
        )}
      </div>
    );
  }
);
CardItem.displayName = "CardItem";
export default CardItem;
