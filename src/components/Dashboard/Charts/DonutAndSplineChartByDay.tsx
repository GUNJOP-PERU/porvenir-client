import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { roundAndFormat } from "@/lib/utilsGeneral";
// Types
import type { BeaconUnitTrip } from "@/types/Beacon";
import { useMemo } from "react";

interface IDonutAndSplineChartByHourProps {
  title?: string;
  mineralWeight: number;
  chartColor?: string;
  chartData: {
    date: string;
    label?: string;
    trips: BeaconUnitTrip[];
  }[];
  planDay: {
    totalTonnage: number;
    totalTonnageBlending: number;
    totalTonnageModificado: number;
    planWeek: {
      date: string;
      tonnage: number;
    }[];
    planDataBlending: {
      date: string;
      tonnage: number;
    }[];
    planDataModificado: {
      date: string;
      tonnage: number;
    }[];
  }
}

const DonutAndSplineChartByDay = ({ chartColor= "#ff5000", chartData, mineralWeight, planDay }: IDonutAndSplineChartByHourProps) => {
  const xLabels = chartData.map((item) => item.label) 
  const tripsCounts = chartData.map(
    (item) => item.trips.length * mineralWeight
  );
  const acummulativeTripsCounts = tripsCounts.map((trip, index) =>
    trip === 0
      ? NaN
      : tripsCounts.slice(0, index + 1).reduce((acc, val) => acc + val, 0)
  );

  const accumulativePlanData = planDay.planWeek.map((p, i) => 
    planDay.planWeek.slice(0, i + 1).reduce((acc, val) => acc + val.tonnage, 0)
  );

  const accumulativePlanDataBlending = planDay.planDataBlending.map((p, i) => 
    planDay.planDataBlending.slice(0, i + 1).reduce((acc, val) => acc + val.tonnage, 0)
  );

  const accumulativePlanDataModificado = planDay.planDataModificado.map((p, i) => 
    planDay.planDataModificado.slice(0, i + 1).reduce((acc, val) => acc + val.tonnage, 0)
  );

  const options = {
    chart: {
      type: "areaspline",
      height: 300,
      marginBottom: 90,
      marginTop: 40,
      marginLeft: 50,
      marginRight: 0,
      spacing: [0, 0, 0, 0],
      animation: false,
    },
    title: "",
    xAxis: [
      {
        categories: acummulativeTripsCounts.map(
          (value) => `${roundAndFormat(value)} TM`
        ),
        opposite: false,
        lineColor: "transparent",
        labels: {
          style: {
            color: "#1e1e1e",
            textDecoration: "underline",
            fontSize: "0.9em",
            fontWeight: "bold",
          },
        },
      },
      {
        categories: accumulativePlanDataModificado.map(
          (value) => `${roundAndFormat(value)} TM`
        ),
        opposite: false,
        linkedTo: 0,
        lineColor: "transparent",
        labels: {
          y: 0,
          style: {
            color: "#00000080",
            fontSize: "0.7em",
            fontWeight: "bold",
          },
        },
      },
      {
        categories: accumulativePlanDataBlending.map(
          (value) => `${roundAndFormat(value)} TM`
        ),
        opposite: false,
        linkedTo: 0,
        lineColor: "transparent",
        labels: {
          y: 0,
          style: {
            color: "#00000080",
            fontSize: "0.7em",
            fontWeight: "bold",
          },
        },
      },
      {
        categories: accumulativePlanData.map(
          (value) => `${roundAndFormat(value)} TM`
        ),
        opposite: false,
        linkedTo: 0,
        lineColor: "transparent",
        labels: {
          y: 0,
          style: {
            color: "#00000080",
            fontSize: "0.7em",
            fontWeight: "bold",
          },
        },
      },
      {
        categories: xLabels,
        opposite: true,
        linkedTo: 0,
        lineColor: "transparent",
        labels: {
          style: {
            color: "#00000080",
            fontSize: "0.8em",
            fontWeight: "bold",
          },
        },
      },
    ],
    yAxis: {
      title: { text: "" },
      opposite: true,
      labels: { enabled: false },
      gridLineColor: "#D9D9D9",
      gridLineWidth: 0.5,
      gridLineDashStyle: "Dash",
    },
    series: [
      {
        name: "Real",
        data: acummulativeTripsCounts,
        xAxis: 0,
        fillColor: chartColor + "80",
        color: chartColor,
        animation: false,
        marker: {
          fillColor: "white",
          lineWidth: 2,
          lineColor: chartColor,
        },
        dataLabels: {
          enabled: true,
          style: {
            color: "#ff5000",
            fontSize: "12px",
            fontWeight: "bold",
            textOutline: "none"
          },
          formatter: function(this: any) {
            return `${roundAndFormat(this.y)} TM <br/> ${Math.ceil(this.y / mineralWeight)}V`;
          }
        },
      },
      {
        name: "Plan",
        data: accumulativePlanData,
        xAxis: 1,
        fillColor: "#b8b8b880",
        color: "#b8b8b8",
        areaColor: "#b8b8b880",
        animation: false,
        marker: {
          fillColor: "white",
          lineWidth: 2,
          lineColor: "#b8b8b8",
        },
        zones: acummulativeTripsCounts.map((realValue, index) => {
          const hasRealData = realValue !== undefined && !isNaN(realValue) && realValue > 0;
          return {
            value: index,
            dashStyle: hasRealData ? 'Solid' : 'Dash',
            color: hasRealData ? "#757575" : "#bdbdbd",
            fillColor: hasRealData ? "#f5f5f580" : "#f5f5f520"
          };
        }),
        zoneAxis: 'x',
      }
    ],
    tooltip: {
      shared: true,
      backgroundColor: "#111214",
      borderWidth: 0,
      shadow: false,
      borderRadius: 10,
      padding: 12,
      style: {
        color: "#FFFFFF",
        fontSize: "0.65em",
      },
      pointFormatter: function (this: any) {
        return `<span style="color:${this.color}">●</span> ${
          this.series.name
        }: <b>${roundAndFormat(this.y)} TM</b><br/>`;
      },
    },

    legend: {
      align: "left",
      verticalAlign: "bottom",
      layout: "vertical",
      floating: false,
      labelFormatter: function (this: any) {
        if (this.index === 0) {
          return `
          <span style='display: flex; align-items: center; color:#000000'>
            <span style='width: 8px; height: 8px; background-color: #ff5000; border-radius: 5px; display: inline-block; margin-right: 4px;'></span>
            Real
          </span>`;
        } else {
          return `
            <div style="display: flex; flex-direction: column; gap: 7px;">
              <span style='color:#A6A6A6'>
                <span style='width:8px; height: 8px; border-color: #A6A6A6; border-width: 2px; border-style: solid; transform: rotate(45deg); display: inline-block; margin-right: 5px;'></span>  
                P.Campo
              </span>
              <span style='color:#A6A6A6'>
                <span style='width:8px; height: 8px; border-color: #A6A6A6; border-width: 2px; border-style: solid; display: inline-block; margin-right: 5px;'></span>  
                P.Blending
              </span>
              <span style='color:#A6A6A6'>
                <span style='width:8px; height: 8px; border-color: #A6A6A6; border-width: 2px; border-style: solid; display: inline-block; margin-right: 5px;'></span>  
                P.Semanal
              </span>
            </div>
          `;
        }
      },
      useHTML: true,
      itemStyle: {
        color: "#A6A6A6",
        fontSize: "0.55em",
        fontWeight: "600",
        textTransform: "uppercase",
      },
      itemHoverStyle: { color: "black" },
      symbolWidth: 0,
      symbolHeight: 0,
      symbolRadius: 2,
      itemMarginTop: 6,
      itemMarginBottom: 0,
      x: 0,
      y: 6,
    },
    credits: {
      enabled: false,
    },
  }

  const chartKey = useMemo(() => {
    return JSON.stringify({
      dataLength: chartData?.length || 0,
      totalTrips: chartData?.reduce((acc, val) => acc + val.trips.length, 0) || 0,
    });
  }, [chartData]);

  return (
    <div className="flex flex-col gap-0">
      <HighchartsReact 
        highcharts={Highcharts} 
        options={options} 
        key={chartKey}
      />
    </div>
  );
};

export default DonutAndSplineChartByDay;
