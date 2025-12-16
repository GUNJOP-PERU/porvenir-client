import { roundAndFormat } from "@/lib/utilsGeneral";
import { AnimatedNumber } from "../CardItem";
import "./styles.css";

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
  size = "medium",
}: ProgressProps) {
  const visualMax = Math.max(total, prediction ?? 0);

  const progressPercent = visualMax > 0 ? (value / visualMax) * 100 : 0;
  const totalPercent = visualMax > 0 ? (total / visualMax) * 100 : 0;
  const predictionPercent =
    prediction !== undefined && visualMax > 0
      ? (prediction / visualMax) * 100
      : 0;

  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      {title && (
        <span className="font-bold text-[10px] mb-1 uppercase leading-none text-zinc-500">
          {title}
        </span>
      )}

      <div className="flex flex-col gap-1">
        {/* Leyenda */}
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

        <div
          className="relative flex-1 h-8 flex gap-[1px] rounded"
          style={{
            backgroundColor:
              value === 0 || (total === 0 && (prediction ?? 0) === 0)
                ? "#b8b8b8"
                : "transparent",
          }}
        >
          <div
            className="h-8 bg-[#b8b8b8] rounded overflow-hidden"
            style={{ width: `${totalPercent}%` }}
          >
            <div
              className="h-full flex items-center"
              style={{ width: `${progressPercent}%`, backgroundColor: color }}
            >
              <h1 className="absolute left-0 top-0 h-full flex flex-row items-center gap-1 font-bold text-[10px] text-white pl-2.5 whitespace-nowrap">
                Extraído <AnimatedNumber value={value} loading={false} /> de{" "}
                {roundAndFormat(total)} {unit}
              </h1>
            </div>
          </div>

          {prediction !== undefined && prediction > total && (
            <div
              className="h-8 bg-black/50 rounded"
              style={{
                width: `${predictionPercent - totalPercent}%`,
              }}
            />
          )}

          {total > 0 && value > total && (
            <div
              className="h-8 bg-green-500 rounded"
              style={{
                width: `${((value - total) / visualMax) * 100}%`,
              }}
            />
          )}

          {prediction !== undefined && prediction > 0 && (
            <div
              className="absolute bottom-0 "
              style={{
                left: `${predictionPercent}%`,
                height: "calc(100% + 15px)",
                borderLeft: `2px dotted ${color}`,
              }}
            >
              <p
                className="absolute top-0 right-0 flex flex-row gap-1 items-center font-semibold text-[11px] leading-none"
                style={{
                  bottom: "calc(100% + 0px)",
                  whiteSpace: "nowrap",
                  transform:
                    predictionPercent > 50 ? "translateX(-100%)" : "none",
                  left: 0,
                  right: predictionPercent > 50 ? "auto" : 0,
                }}
              >
                {predictionText || "Forecast"}
                <span
                  className="text-white py-0.5 px-1 rounded-[4px] text-[11px] leading-none text-nowrap"
                  style={{ backgroundColor: color }}
                >
                  {prediction} <small>{unit}</small>
                </span>
              </p>
            </div>
          )}
        </div>
        {value < total && (
          <span className="text-right font-bold text-[10px] leading-none text-red-600">
            Faltante -{roundAndFormat(total - value)} {unit}
          </span>
        )}
        {value > total && (
          <span className="text-right font-bold text-[10px] leading-none text-green-600">
            Excedente +{roundAndFormat(value - total)} {unit}
          </span>
        )}
      </div>
    </div>
  );
}
