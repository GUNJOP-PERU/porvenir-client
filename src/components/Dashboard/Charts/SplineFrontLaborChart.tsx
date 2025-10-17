import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { roundAndFormat } from "@/lib/utilsGeneral";
import Progress from "./Progress";
import DonutChart from "./DonutChart";
// Types
import type { BeaconUnitTrip } from "@/types/Beacon";
import type { PlanDay } from "@/types/Plan";
import { useMemo } from "react";

interface SplineFrontLaborTrip extends BeaconUnitTrip {
  frontLabor: string;
}

interface SplineFrontLaborChartProps {
  title?: string;
  mineralWeight: number;
  trips: SplineFrontLaborTrip[];
  planDay: PlanDay[];
}

const SplineFrontLaborChart = ({ trips, mineralWeight, planDay }: SplineFrontLaborChartProps) => {
  const tripsByFrontLabor = useMemo(() => {
    const grouped = trips.reduce((acc, trip) => {
      const frontLabor = trip.frontLabor || 'Sin asignar';
      console.log("frontLabor:", frontLabor);
      if (!acc[frontLabor]) {
        acc[frontLabor] = 0;
      }
      acc[frontLabor]++;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([frontLabor, trips]) => ({
      frontLabor,
      trips
    }));
  }, [trips]);

  const chartData = planDay.map((plan) => {
    const tripData = tripsByFrontLabor.find(t => t.frontLabor === plan.frontLabor);
    return {
      frontLabor: plan.frontLabor,
      plannedTonnage: plan.tonnage,
      currentTonnage: (tripData ? tripData.trips : 0) * mineralWeight,
    }
  })

  const options = {
    chart: {
      type: "areaspline",
      height: 300,
      marginBottom: 50,
      marginTop: 50,
      marginLeft: 20,
      marginRight: 20,
      spacing: [0, 0, 0, 0],
      animation: false,
    },
    title: "",
    xAxis: [
      {
        categories: chartData.map(c => c.frontLabor),
        opposite: false,
        lineColor: "transparent",
        labels: {
          style: {
            color: "#1e1e1e",
            fontSize: "0.7em",
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
        name: "Plan",
        data: chartData.map(c => c.plannedTonnage),
        xAxis: 0,
        fillColor: "#b8b8b880",
        color: "#b8b8b8",
        areaColor: "#b8b8b880",
        animation: false,
        marker: {
          fillColor: "white",
          lineWidth: 2,
          lineColor: "#b8b8b8",
        },
        dataLabels: {
          enabled: true,
          style: {
            color: "#000000",
            fontSize: "11px",
            fontWeight: "bold",
            textOutline: "none"
          },
          formatter: function(this: any) {
            return `${roundAndFormat(this.y)} TM, ${Math.ceil(this.y / mineralWeight)} viajes`;
          }
        },
      },
      {
        name: "Real",
        data: chartData.map(c => c.currentTonnage),
        xAxis: 0,
        fillColor: "#ffa47a",
        color: "#ff5000",
        animation: false,
        marker: {
          fillColor: "white",
          lineWidth: 2,
          lineColor: "#ff5000",
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
            return `${roundAndFormat(this.y)} TM, ${Math.ceil(this.y / mineralWeight)} viajes`;
          }
        },
      },
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
      enabled: false,
      align: "left",
      verticalAlign: "bottom",
      layout: "vertical",
      floating: false,
      labelFormatter: function (this: any) {
        if (this.index === 0) {
          return `<span style='color:#000000'>${this.name}</span>`;
        } else {
          return `<span style='color:#A6A6A6'>${this.name}</span>`;
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
      symbolWidth: 10,
      symbolHeight: 9,
      symbolRadius: 2,
      itemMarginTop: 4,
      itemMarginBottom: 0,
      x: 0,
      y: 0,
    },
    credits: {
      enabled: false,
    },
  }

  // const chartKey = useMemo(() => {
  //   return JSON.stringify({
  //     dataLength: chartData?.length || 0,
  //     firstHour: chartData?.[0]?.hour || '',
  //     lastHour: chartData?.[chartData?.length - 1]?.hour || '',
  //     totalTrips: chartData?.reduce((acc, val) => acc + val.trips.length, 0) || 0,
  //   });
  // }, [chartData]);

  return (
    <div className="flex flex-col gap-0 flex-1">
      <HighchartsReact 
        highcharts={Highcharts} 
        options={options} 
        // key={chartKey}
      />
    </div>
  );
};

export default SplineFrontLaborChart;