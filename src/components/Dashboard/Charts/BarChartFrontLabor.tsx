import type { BeaconUnitTrip } from "@/types/Beacon";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";

interface SplineFrontLaborTrip extends BeaconUnitTrip {
  frontLabor: string;
}

interface BarChartFrontLaborProps {
  title?: string;
  trips: SplineFrontLaborTrip[];
  color: string;
}

const BarChartFrontLabor = ({
  title = "Frentes de Labor",
  trips,
  color,
}: BarChartFrontLaborProps) => {
  const dataLabor = useMemo(() => {
    const grouped = trips.reduce((acc, trip) => {
      const frontLabor = trip.frontLabor || "Sin asignar";
      console.log("frontLabor:", frontLabor);
      if (!acc[frontLabor]) {
        acc[frontLabor] = 0;
      }
      acc[frontLabor]++;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([frontLabor, trips]) => ({
      frontLabor,
      trips,
    }));
  }, [trips]);

  console.log(dataLabor);

  const options: Highcharts.Options = {
    chart: {
      type: "column",
      height: 300,
      backgroundColor: "transparent",
      animation: false,
    },
    title: {
      text: "",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#333",
      },
    },
    xAxis: {
      categories: dataLabor.map((item) => item.frontLabor),
      title: {
        text: "",
      },
      labels: {
        style: {
          color: "#666",
          fontWeight: "bold",
          fontSize: "0.6rem",
        },
        formatter: function (this: any) {
          const parts = String(this.value).split("_");
          return parts.length >= 3 ? parts.slice(2).join("_") : this.value;
        },
      },
    },
    yAxis: {
      min: 0,
      max: 7,
      title: {
        text: "",
      },
      labels: {
        style: {
          color: "#666",
          fontSize: "12px",
        },
      },
      gridLineColor: "#E0E0E0",
    },
    plotOptions: {
      column: {
        borderRadius: 4,
        pointPadding: 0.05,
        groupPadding: 0,
        borderWidth: 0,
        animation: false,
        dataLabels: {
          enabled: true,
          style: {
            color: "#333",
            fontSize: "11px",
            fontWeight: "bold",
            textOutline: "none",
          },
          formatter: function (this: any) {
            return this.y.toFixed(1);
          },
        },
      },
    },
    series: [
      {
        name: "Producción",
        type: "column",
        data: dataLabor.map((item, index) => ({
          y: item.trips,
          color: color,
        })),
        showInLegend: false,
      },
    ],
    tooltip: {
      backgroundColor: "#111214",
      borderWidth: 0,
      shadow: false,
      borderRadius: 8,
      style: {
        color: "#FFFFFF",
        fontSize: "12px",
      },
      formatter: function (this: any) {
        return `<b>${this.x}</b><br/>Valor: ${this.y.toFixed(1)}`;
      },
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
  };

  return (
    <div className="w-full">
      <h3 className="text-white bg-[#ff5000] font-bold text-center py-1 px-2">
        {title}
      </h3>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default BarChartFrontLabor;
