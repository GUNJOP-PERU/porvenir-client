import { roundAndFormat } from "@/lib/utilsGeneral";
import { AnimatedNumber } from "../CardItem";

interface ProgressProps {
  title?: string;
  value?: number;
  total?: number;
  color?: string;
  unit?: string;
  className?: string;
  showLegend?: boolean;
  size?: "small" | "medium" | "large";
}

export default function Progress({
  title,
  value = 0,
  total = 0,
  color = "#fac34c",
  unit = "TM",
  className = "border border-zinc-100 shadow-sm rounded-xl p-4",
  showLegend = true,
  size = "medium"
} : ProgressProps) {
  const progress = total > 0 ? Math.min((value / total) * 100, 100) : 0;

  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      {title && (
        <span className="font-bold text-[10px] mb-1 uppercase leading-none text-zinc-500">
          {title}
        </span>
      )}
      <div className="flex gap-2">
        {showLegend && (
          <div className="flex items-center justify-between gap-1">
            <h1 className="flex items-end gap-1 font-extrabold text-xl lg:text-xl">
              <AnimatedNumber value={value} loading={false} />
              <small className="leading-none text-xs mb-0.5" style={{ color }}>
                / {roundAndFormat(total)}{" "}
                <span className="text-zinc-400 font-bold">{unit}</span>
              </small>
            </h1>
          </div>
        )}

        <div className="flex-1 h-8 bg-[#b8b8b8] rounded-full overflow-hidden relative">
          <div
            className="h-full rounded-full flex items-center"
            style={{ width: `${progress}%`, backgroundColor: color }}
          >
            <h1 className="absolute left-0 top-0 h-full flex flex-row items-center gap-1 font-bold text-xs text-white lg:text-xs pl-4">
              Completado <AnimatedNumber value={value} loading={false} /> de {roundAndFormat(total)} {unit}
            </h1>
            {/* <span className="text-zinc-900 text-[10px] leading-none mt-0.5 font-bold ml-2">
              {progress.toFixed(1)}%
            </span> */}
          </div>
        </div>
      </div>
    </div>
  );
}
