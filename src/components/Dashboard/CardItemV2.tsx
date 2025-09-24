import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef,memo } from "react";
import { ArrowDownLeft, ArrowUp, TrendingUp } from "lucide-react";
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
  "mt-1.5 flex items-center px-1 py-[2px] w-fit rounded-[5px]",
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
      high: "text-green-500",
      medium: "text-yellow-500",
      low: "text-red-500",
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

interface  CardItemProps {
  value: number | string;
  title: string;
  change?: number;
  valueColor: string;
  unid: string;
  subtitle?: number;
  decimals?: number;
  subtitleUnid?: string;
  loading?: boolean;
}

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  duration?: number;
  loading?: boolean;
  className?: string;
}

const CardItem = memo(
  ({ value, title, change, valueColor, unid, subtitle, decimals = 0 ,subtitleUnid = "viajes", loading = false } : CardItemProps) => {
    const getChangeVariant = (val : number) =>
      val >= 85 ? "high" : val >= 60 ? "medium" : "low";

    return (
      <div className={`flex flex-col justify-center relative border border-zinc-100 shadow-sm rounded-xl py-2 px-4 h-24 md:h-[90px] bg-zinc-50 ${loading ? "opacity-50" : "opacity-100"}`}>
        <span className="text-[10px] leading-none font-semibold text-zinc-400 line-clamp-2 max-w-[150px] mb-1">
          {title}
        </span>

        <div className="flex items-center justify-between gap-1">
          <h1 className={`${valueColor} flex items-end gap-0.5 font-extrabold text-xl md:text-2xl`}>
            {typeof(value) === "string" ? value : <AnimatedNumber value={value || 0}  decimals={decimals} loading={loading} />}
            <small className="leading-none text-base">{unid}</small>
          </h1>
        </div>

        {change !== undefined && (
          <>
            <div className={cardStyles({ change: getChangeVariant(change) })}>
              <ArrowDownLeft
                className={iconStyles({ change: getChangeVariant(change) })}
              />
              <div
                className={textColorStyles({
                  change: getChangeVariant(change),
                })}
              >
                <AnimatedNumber  value={(100 - (change ?? 0))} decimals={2} loading={loading} className="!leading-[8px]"/>%
              </div>
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
          <div className="mt-1.5 text-[10px] leading-[8px] font-semibold text-zinc-700">
            De <AnimatedNumber value={subtitle || 0} loading={loading} /> {subtitleUnid}
          </div>
        )}
      </div>
    );
  }
);

CardItem.displayName = "CardItem";
export default CardItem;



export function AnimatedNumber({ value, decimals = 0, duration = 0.6, loading = false } :AnimatedNumberProps) {
  const count = useMotionValue(value);
  const previous = useRef(value);

  const formatted = useTransform(count, (v) => {
    let rounded = Math.round(v * Math.pow(10, decimals)) / Math.pow(10, decimals);
    if (Object.is(rounded, -0)) rounded = 0;
    return (
      rounded.toLocaleString("es-MX", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    );
  });

  useEffect(() => {
    if (loading) return;
    count.set(previous.current);
    const controls = animate(count, value, {
      duration,
      ease: "linear",
    });
    previous.current = value;
    return () => controls.stop();
  }, [value, duration, loading]);

  return <motion.span className="leading-none">{formatted}</motion.span>;
}

