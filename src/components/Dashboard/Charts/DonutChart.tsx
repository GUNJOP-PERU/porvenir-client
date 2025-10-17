import ProgressBar from "@/components/Dashboard/Charts/ProgressBar";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useRef, useCallback } from "react";

interface DonutChartProps {
  title: string;
  size: "mini" | "small" | "medium" | "large" | "xlarge";
  type?: "donut" | "pie";
  donutData: {
    total: number;
    currentValue: number;
    currentValueColor: string;
  };
  showPrediction?: boolean;
  progressBar?: {
    unit: string;
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
  type = "donut",
}: DonutChartProps) => {
  const sizeMap = {
    mini: 60,
    small: 70,
    medium: 100,
    large: 120,
    xlarge: 180,
  };
  const fontSizeMap = {
    mini: "11px",
    small: "15px",
    medium: "18px",
    large: "20px",
    xlarge: "30px",
  };
  const fontSizeTitleMap = {
    mini: "11px",
    small: "12px",
    medium: "13px",
    large: "14px",
    xlarge: "20px",
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
      text: `${Math.round((donutData.total ? donutData?.currentValue / donutData?.total : 0) * 100)}%`,
      verticalAlign: "middle",
      style: {
        fontSize: fontSizeMap[size],
        fontWeight: "bold",
        color: "#000",
      },
    },
    plotOptions: {
      pie: {
        innerSize: "75%",
        size: "100%",
        center: type === "donut" ? ["50%", "50%"] : ["50%", "55%"],
        borderWidth: 1,
        borderRadius: 10,
        dataLabels: { enabled: false },
        startAngle: type === "donut" ? -0 : -100,
        endAngle: type === "donut" ? 0 : 100,
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
            color: "#b8b8b8",
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
      <div className="flex flex-col items-center justify-center w-full">
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
            chartRef.current = chart;
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
