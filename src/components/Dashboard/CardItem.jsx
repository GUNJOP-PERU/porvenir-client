import IconArrowUp from "@/icons/IconArrowUp";
import { memo } from "react";
import NumberFlow from "@number-flow/react";
import { cva } from "class-variance-authority";

const textColorStyles = cva("text-[10px] leading-[8px] font-bold", {
  variants: {
    change: {
      high: "text-green-500",
      medium: "text-yellow-500",
      low: "text-red-500",
    },
  },
});

const cardStyles = cva(
  "mt-0.5 flex items-center px-1 py-[2px] w-fit rounded-[5px]",
  {
    variants: {
      change: {
        high: "bg-green-100",
        medium: "bg-yellow-100",
        low: "bg-red-100",
      },
    },
  }
);

const iconStyles = cva("w-3.5 h-3.5", {
  variants: {
    change: {
      high: "fill-green-500",
      medium: "fill-yellow-500",
      low: "fill-red-500 rotate-180",
    },
  },
});

const tooltipStyles = cva(
  "min-w-max flex-col rounded-md text-[8px] leading-[8px] font-bold text-white px-2 py-[4px] uppercase flex items-center justify-center",
  {
    variants: {
      change: {
        high: "bg-green-500",
        medium: "bg-yellow-500",
        low: "bg-red-500",
      },
    },
  }
);

const tooltipArrowStyles = cva(
  "h-2 w-2 origin-bottom-right rotate-45 transform",
  {
    variants: {
      change: {
        high: "bg-green-500",
        medium: "bg-yellow-500",
        low: "bg-red-500",
      },
    },
  }
);

const CardItem = memo(
  ({ value, title, change, valueColor, unid, subtitle, decimals = 2 ,subtitleUnid = "viajes"}) => {
    const getChangeVariant = (val) =>
      val >= 85 ? "high" : val >= 60 ? "medium" : "low";

    return (
      <div className="flex flex-col justify-center relative border border-[#ededed] shadow rounded-xl py-2 px-4 h-[100px] md:h-[90px]">
        <span className="text-[10px] leading-3 font-semibold text-zinc-400 line-clamp-2 max-w-[150px]">
          {title}
        </span>

        <div className="flex items-center justify-between gap-1">
          <h1 className={`${valueColor} font-extrabold text-2xl leading-none`}>
            <NumberFlow value={value || 0}  format={{ notation:'standard', style: 'decimal', maximumFractionDigits: decimals }} suffix={unid} className="!leading-4" />            
          </h1>
         
        </div>

        {change !== undefined && (
          <>
            <div className={cardStyles({ change: getChangeVariant(change) })}>
              <IconArrowUp
                className={iconStyles({ change: getChangeVariant(change) })}
              />
              <span
                className={textColorStyles({
                  change: getChangeVariant(change),
                })}
              >
                <NumberFlow  value={(100 - (change ?? 0))}  format={{ notation:'standard', style: 'decimal', maximumFractionDigits: 2 }} className="!leading-[8px]"/>%
              </span>
            </div>

            <div className="absolute -top-2 right-0 flex flex-col group-focus-within:visible group-active:visible z-20">
              <div
                className={tooltipStyles({ change: getChangeVariant(change) })}
              >
                <span className="mt-[1px]">
                  {change >= 85
                    ? "Excelente"
                    : change >= 60
                    ? "Bien"
                    : "A mejorar"}
                  !
                </span>
              </div>
              <div className="ml-1 -mt-[4px] inline-block overflow-hidden">
                <div
                  className={tooltipArrowStyles({
                    change: getChangeVariant(change),
                  })}
                ></div>
              </div>
            </div>
          </>
        )}

        {subtitle !== undefined && (
          <span className=" text-[10px] leading-[8px] font-semibold text-zinc-600">
            De <NumberFlow value={subtitle || 0}  format={{ notation:'standard', style: 'decimal', maximumFractionDigits: 2 }} /> {subtitleUnid}
          </span>
        )}
      </div>
    );
  }
);

CardItem.displayName = "CardItem";
export default CardItem;
