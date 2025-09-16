import { roundAndFormat } from "@/lib/utilsGeneral";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highcharts.src.js";
import highchartsHeatmap from "highcharts/modules/heatmap";
import { useMemo, useRef } from "react";
import { StatusDisplay } from "../StatusDisplay";

// Inicializar los módulos
if (typeof highchartsHeatmap === "function") {
  highchartsHeatmap(Highcharts);
}

const HeatMap = ({ data, isLoading, isError }) => {
  const chartRef = useRef(null);

  const xCategories = useMemo(() => {
    return [
      ...new Set(data?.map((item) => item?.destiny?.trim()?.toUpperCase())),
    ];
  }, [data]);

  const yCategories = useMemo(() => {
    return [
      ...new Set(data?.map((item) => item?.origin?.trim()?.toUpperCase())),
    ];
  }, [data]);

  const heatmapData = useMemo(() => {
    const map = {};
    data?.forEach((item) => {
      const xi = xCategories.indexOf(item?.destiny?.trim()?.toUpperCase());
      const yi = yCategories.indexOf(item?.origin?.trim()?.toUpperCase());
      if (xi === -1 || yi === -1) return;
      const key = `${xi}-${yi}`;
      map[key] = (map[key] || 0) + (item.tonnage || 0);
    });

    const result = [];
    for (let xi = 0; xi < xCategories.length; xi++) {
      for (let yi = 0; yi < yCategories.length; yi++) {
        const key = `${xi}-${yi}`;
        const ton = map[key];
        result.push([xi, yi, ton && ton > 0 ? ton : null]);
      }
    }
    return result;
  }, [data, xCategories, yCategories]);

  const totalParrillas = useMemo(() => {
    const viajes =
      data?.filter((item) => {
        const destino = item.destiny?.toLowerCase() || "";
        return destino.includes("parrilla") || destino.includes("pocket");
      }) || [];

    return {
      viajes: viajes.length,
      toneladas: viajes.reduce((sum, item) => sum + (item.tonnage || 0), 0),
    };
  }, [data]);

  const totalSuperficie = useMemo(() => {
    const viajes =
      data?.filter((item) => {
        const destino = item.destiny?.toLowerCase() || "";
        return destino.includes("cancha 100") || destino.includes("faja 4");
      }) || [];

    return {
      viajes: viajes.length,
      toneladas: viajes.reduce((sum, item) => sum + (item.tonnage || 0), 0),
    };
  }, [data]);

  const totalGeneral = data?.length || 0;
  const totalTonnage = data?.reduce(
    (sum, item) => sum + (item.tonnage || 0),
    0
  );

  const options = useMemo(
    () => ({
      chart: {
        backgroundColor: "transparent",
        type: "heatmap",
        plotBorderWidth: 0,
        height: 280,
        marginTop: 0,
        marginBottom: 30,
        marginRight: 3,
      },
      title: { text: null },
      xAxis: {
        categories: xCategories,
        lineColor: "transparent",
        alignTicks: false,
        crosshair: true,
        tickWidth: 0,
        tickLength: 0,
        labels: {
          style: {
            color: "#A1A1AA",
            fontSize: "0.6em",
            fontWeight: "bold",
          },
          rotation: 0,
        },
        gridLineWidth: 0,
        gridLineColor: "transparent",
      },
      yAxis: {
        categories: yCategories,
        title: {
          text: "",
        },
        labels: {
          style: {
            color: "#A1A1AA",
            fontSize: "0.6em",
            fontWeight: "bold",
          },
        },
        gridLineWidth: 0,
        gridLineColor: "transparent",
      },
      colorAxis: {
        min: 0,
        stops: [
          [0, "#e0f3f8"], // Azul claro
          [0.5, "#abd9e9"], // Azul medio
          [0.75, "#74add1"], // Azul fuerte
          [1, "#4575b4"], // Azul oscuro
        ],
      },
      series: [
        {
          name: "Valores",
          data: heatmapData,
          borderWidth: 2,
          borderColor: "#ffffff80",
          borderRadius: 5,
          nullColor: "#e0f3f870",
          dataLabels: {
            enabled: true,
            color: "#000000",
            formatter: function () {
              return this.point.value === null ? "" : this.point.value;
            },
            style: {
              fontSize: "0.7em",
              color: "#000",
              fontWeight: "bold",
              textOutline: "none",
            },
          },
        },
      ],

      tooltip: {
        backgroundColor: "#111214",
        borderWidth: 0,
        shadow: false,
        borderRadius: 10,
        padding: 10,
        style: {
          color: "#FFFFFF",
          fontSize: "0.65em",
        },
        formatter: function () {
          return (
            "<b><span style='color:#eaeaea;'>" +
            roundAndFormat(this.point.value) +
            " TM" +
            "</span></b> <br/> <b><span style='color:#F59E0B;'>" +
            "● " +
            this.series.xAxis.categories[this.point.x] +
            "</span></b> <br/> <b><span style='color:#10B981;'>" +
            "● " +
            this.series.yAxis.categories[this.point.y] +
            "</span></b>"
          );
        },
      },
      legend: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: false,
      },

      accessibility: {
        enabled: false,
      },
    }),
    [heatmapData, xCategories, yCategories]
  );

  if (isLoading || isError || !data || data.length === 0)
    return (
      <StatusDisplay
        isLoading={isLoading}
        isError={isError}
        noData={!data || data.length === 0}
      />
    );

  return (
    <div className="flex flex-col gap-2 py-2">
      <div className="w-full grid grid-cols-3 gap-2 mb-2">
        <div className="flex flex-col bg-zinc-50 px-4 py-2 rounded-lg">
          <span className="text-[10px] text-zinc-400">Parrillas</span>
          <b className="leading-none text-sky-400 font-extrabold text-xl">
            {totalParrillas.viajes} <small>viajes</small>
          </b>
          <span className="mt-1 text-xs leading-none text-zinc-500 font-bold">
            Total {roundAndFormat(totalParrillas.toneladas)} <small>TM</small>
          </span>
        </div>
        <div className="flex flex-col bg-zinc-50 px-4 py-2 rounded-lg">
          <span className="text-[10px] text-zinc-500">Superficie</span>
          <b className="leading-none text-sky-600 font-extrabold text-xl">
            {totalSuperficie.viajes} <small>viajes</small>
          </b>
          <span className="mt-1 text-xs leading-none text-zinc-500 font-bold">
            Total {roundAndFormat(totalSuperficie.toneladas)} <small>TM</small>
          </span>
        </div>
        <div className="flex flex-col bg-zinc-50 px-4 py-2 rounded-lg">
          <span className="text-[10px] text-zinc-400">Totales</span>
          <b className="leading-none text-sky-800 font-extrabold text-xl">
            {totalGeneral} <small>viajes</small>
          </b>
          <span className="mt-1 text-xs leading-none text-zinc-500 font-bold">
            {roundAndFormat(totalTonnage)} <small>TM</small>
          </span>
        </div>
      </div>
      <HighchartsReact
        ref={chartRef}
        highcharts={Highcharts}
        options={options}
      />
    </div>
  );
};

export default HeatMap;
