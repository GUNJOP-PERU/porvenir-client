import { roundAndFormat } from "@/lib/utilsGeneral";
import { AnimatedNumber } from "../CardItem";
import "./styles.css"

interface ProgressProps {
  title?: string;
  value?: number;
  total?: number;
  color?: string;
  unit?: string;
  className?: string;
  showLegend?: boolean;
  prediction?: number;
  predictionText?: string;
  size?: "small" | "medium" | "large";
}

export default function Progress({
  title,
  value = 0,
  total = 0,
  color = "#fac34c",
  unit = "TM",
  prediction,
  predictionText,
  className = "border border-zinc-100 shadow-sm rounded-xl p-4",
  showLegend = true,
  size = "medium"
} : ProgressProps) {
  const progress = total > 0 ? Math.min((value / total) * 100, 100) : 0;
  const predictionPosition = prediction !== undefined ? Math.min((prediction / total) * 100, 100) : 0;
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

        <div className="relative flex-1 h-8 bg-[#b8b8b8] rounded-full">
          <div
            className="h-full rounded-full flex items-center"
            style={{ width: `${progress}%`, backgroundColor: color }}
          >
            <h1 className="absolute left-0 top-0 h-full flex flex-row items-center gap-1 font-bold text-xs text-white lg:text-xs pl-4">
              Completado <AnimatedNumber value={value} loading={false} /> de {roundAndFormat(total)} {unit}
            </h1>
          </div>
          {prediction !== undefined && prediction > 0 && (
            <div
              style={{
                height: "calc(100% + 15px)",
                left:`${predictionPosition}%`,
                borderLeft: `2px dotted ${color || "#032e20"}`
              }}
              className="absolute bottom-0"
            >
              <p
                className="absolute top-0 right-0 flex flex-row gap-2 items-center font-semibold text-[12px]"
                style={{
                  bottom: "calc(100% + 0px)"
                }}
              >
                {predictionText ? predictionText : "Forecast"}
                <span
                  className="text-white py-0.5 px-2 rounded-xl text-[11px] text-nowrap"
                  style={{backgroundColor: `${color || "#04c285"}`}}
                >
                  {prediction} {unit}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
