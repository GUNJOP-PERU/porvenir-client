import ProgressBar from "@/components/Dashboard/Charts/ProgressBar";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useRef, useCallback } from "react";

interface DonutChartProps {
  title: string;
  size: "mini" | "small" | "medium";
  donutData: {
    total: number;
    currentValue: number;
    currentValueColor: string;
  };
  showPrediction?: boolean;
  progressBar?: {
    unit?: string;
    total: number;
    currentValue: number;
    prediction: number;
    currentValueColor: string;
    showDifference: boolean;
    forecastText: string;
  };
}

const DonutChart = ({
  title,
  donutData,
  progressBar,
  showPrediction = false,
  size = "medium",
}: DonutChartProps) => {
  const sizeMap = {
    mini: 60,
    small: 70,
    medium: 100,
  };
  const fontSizeMap = {
    mini: "11px",
    small: "15px",
    medium: "18px",
  };
  const fontSizeTitleMap = {
    mini: "11px",
    small: "12px",
    medium: "13px",
  };

  const chartRef = useRef(null); // Referencia al gráfico

  const options = {
    chart: {
      type: "pie",
      width: sizeMap[size],
      height: sizeMap[size],
      spacing: [0, 0, 0, 0],
      backgroundColor: "transparent",
      margin: [-6, -6, -6, -6],
    },
    title: {
      text: `${(
        (donutData?.currentValue / donutData?.total) * 100 || 0
      ).toFixed(1)}%`,
      verticalAlign: "middle",
      style: {
        fontSize: fontSizeMap[size],
        fontWeight: "bold",
        color: "#000",
      },
    },
    plotOptions: {
      pie: {
        innerSize: "65%",
        size: "100%",
        center: ["50%", "50%"],
        borderWidth: 1,
        borderRadius: 10,
        dataLabels: { enabled: false },
        startAngle: -90,
        endAngle: 90,
        states: {
          hover: {
            enabled: false,
          },
        },
      },
    },
    series: [
      {
        name: "",
        data: [
          {
            name: "Valor Actual",
            y: donutData?.currentValue || 0,
            color: donutData.currentValueColor || "#04c285",
          },
          {
            name: "Restante",
            y: (donutData?.total || 0) - (donutData?.currentValue || 0),
            color: "#d6d6df",
          },
        ],
      },
    ],
    credits: {
      enabled: false,
    },
    tooltip: { enabled: false },
    accessibility: { enabled: false },
  };

  const updateCenterText = useCallback(
    (chart) => {
      if (chart && chart.customLabel) {
        chart.customLabel.attr({
          text: `${(
            (donutData?.currentValue / donutData?.total) * 100 || 0
          ).toFixed(1)}%`,
        });
      }
    },
    [donutData]
  );

  useEffect(() => {
    if (chartRef.current) {
      updateCenterText(chartRef.current);
    }
  }, [donutData, updateCenterText]);

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="flex flex-col items-center justify-center max-w-28">
        {title && (
          <h3
            className={`font-bold text-center leading-none text-[${fontSizeTitleMap[size]}]`}
          >
            {title}
          </h3>
        )}
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          callback={(chart) => {
            chartRef.current = chart; // Guarda la referencia al gráfico
            updateCenterText(chart);
          }}
        />
      </div>
      {progressBar ? (
        <ProgressBar
          unit={progressBar.unit}
          showPrediction={showPrediction}
          progressBarData={{
            ...progressBar,
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default DonutChart;
