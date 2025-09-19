import ProgressBar from "@/components/Dashboard/Charts/ProgressBar"
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useRef, useCallback } from "react";

interface DonutChartProps {
  title: string,
  size: "mini" | "small" | "medium",
  donutData: {
    total: number,
    currentValue: number,
    currentValueColor: string
  },
  showPrediction?: boolean,
  progressBar?: {
    unit: string,
    total: number,
    currentValue: number,
    prediction: number,
    currentValueColor: string,
    showDifference: boolean,
    forecastText: string
  }
}

const DonutChart = ({ title, donutData, progressBar, showPrediction = false, size = "medium" } : DonutChartProps) => {
  const sizeMap = {
    mini: 60,
    small: 80,
    medium: 100
  };
  const fontSizeMap = {
    mini: "11px",
    small: "15px",
    medium: "20px"
  };

  const chartRef = useRef(null); // Referencia al gráfico

  const options = {
    chart: {
      type: "pie",
      width: sizeMap[size] ,
      height: sizeMap[size], 
      spacing: [0, 0, 0, 0],
      events: {
        load() {
          const chart = this;
          chart.customLabel = chart.renderer
            .text(
              `${(donutData?.currentValue / donutData?.total * 100).toFixed(1) || 0}%`,
              chart.plotWidth / 2 + chart.plotLeft,
              chart.plotHeight / 2 + chart.plotTop + 5
            )
            .css({
              color: "#000",
              fontSize: fontSizeMap[size],
              fontWeight: "bold",
              textAlign: "center",
            })
            .attr({
              align: "center",
              zIndex: 5,
            })
            .add();
        },
      },
    },
    title: {
      text: "",
    },
    plotOptions: {
      pie: {
        innerSize: "75%",
        dataLabels: {
          enabled: false,
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
  };

  const updateCenterText = useCallback((chart) => {
    if (chart && chart.customLabel) {
      chart.customLabel.attr({
        text: `${((donutData?.currentValue / donutData?.total) * 100 || 0).toFixed(1)}%`,
      });
    }
  }, [donutData]);

  useEffect(() => {
    if (chartRef.current) {
      updateCenterText(chartRef.current);
    }
  }, [donutData, updateCenterText]); // Escucha cambios en donutData y updateCenterText

  return (
    <div className="flex flex-col items-center justify-center">
      {title &&
        <h3 className={`font-bold text-center text-[${fontSizeMap[size]}]`}>
          {title}
        </h3>
      }
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        callback={(chart) => {
          chartRef.current = chart; // Guarda la referencia al gráfico
          updateCenterText(chart);
        }}
      />
      {progressBar ?
        <ProgressBar
          unit={progressBar.unit}
          showPrediction={showPrediction}
          progressBarData={{
            ...progressBar
          }}
        />
        :<></>
      }
    </div>
  );
};

export default DonutChart;