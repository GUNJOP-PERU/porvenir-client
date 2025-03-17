import { memo, useMemo, useRef } from "react";
import Highcharts from "highcharts/highmaps";
import HighchartsReact from "highcharts-react-official";
import highchartsTilemap from "highcharts/modules/tilemap";
import IconDash1 from "@/icons/Dashboard/IconDash1";
import { useGraphicData } from "@/hooks/useGraphicData";

// Inicializar los módulos
if (typeof highchartsTilemap === "function") {
  highchartsTilemap(Highcharts);
}

const CardFlotaTime = memo(({symbol, endpoint}) => {
  const chartRef = useRef(null);
  const {
    data = [],
    isLoading,
    isError,
  } = useGraphicData(symbol, endpoint);

  const fleetData = useMemo(() => {
    return data
      .sort((a, b) => {
        const regex = /([A-Za-z-]+)(\d+)/;
        const matchA = a.name.match(regex);
        const matchB = b.name.match(regex);

        if (!matchA || !matchB) return 0;

        const prefixA = matchA[1];
        const numA = parseInt(matchA[2], 10);
        const prefixB = matchB[1];
        const numB = parseInt(matchB[2], 10);

        return prefixA.localeCompare(prefixB) || numA - numB;
      })
      .map((item, index) => ({
        ...item,
        x: index % 10,
        y: Math.floor(index / 10),
      }));
  }, [data]); // Solo se recalcula si `data` cambia

  const fleetCounts = useMemo(() => {
    return fleetData.reduce(
      (acc, item) => {
        acc[item.value] = (acc[item.value] || 0) + 1;
        return acc;
      },
      { 1: 0, 2: 0, 3: 0 }
    );
  }, [fleetData]); // Se recalcula solo si `fleetData` cambia

  const options = useMemo(
    () => ({
      chart: {
        backgroundColor: "transparent",
        type: "tilemap",
        height: 280,
        inverted: true,
        spacing: 0,
        margin: 0,
      },
      title: {
        text: null,
      },
      subtitle: {
        text: null,
      },
      xAxis: {
        title: { text: null },
        lineColor: "transparent",
        alignTicks: false,
        crosshair: false,
        tickWidth: 0,
        tickLength: 0,
        labels: { enabled: false },
        gridLineWidth: 0,
      },
      yAxis: {
        title: { text: null },
        labels: { enabled: false },
        gridLineWidth: 0,
      },
      // yAxis: {
      //   plotLines: [
      //     {
      //       color: "blue",
      //       width: 5,
      //       value: 0.5, // Ajusta la posición de la línea divisoria
      //       zIndex: 5,
      //     },
      //   ],
      // },

      colorAxis: {
        dataClasses: [
          { from: 1, to: 1, color: "#81c784", name: "Operativo" }, // Amarillo
          { from: 2, to: 2, color: "#fff176", name: "Mantenimiento" }, // Rojo
          { from: 3, to: 3, color: "#ff9999", name: "Inoperativo" }, // Gris o cualquier otro color para 3
        ],
      },

      series: [
        {
          name: "Estado de Vehículos",
          data: fleetData,
          type: "tilemap",
          borderRadius: 6,
          tileShape: "square", // Cambiar a 'square', 'circle' o 'diamond'
          dataLabels: {
            enabled: true,
            format: "{point.name}",
            style: {
              fontSize: "0.6em",
              color: "#000",
              fontWeight: "bold",
              textOutline: "none",
            },
          },
        },
      ],

      tooltip: {
        valueSuffix: " toneladas",
        backgroundColor: "#111214",
        borderWidth: 0,
        shadow: false,
        borderRadius: 10,
        padding: 15,
        style: {
          color: "#FFFFFF",
          fontSize: "11px",
          fontWeight: "",
        },

        formatter: function () {
          return `
                <b>${this.point.name}</b><br>
                <b>Conductor:</b> ${this.point?.conductor || "--"}<br>
                <b>Capacidad:</b> ${this.point?.capacidad || "--"}<br>
                <b>Check List:</b> ${this.point?.checklist || "--"}<br>
                <b>Orden de Trabajo:</b> ${this.point?.ordenTrabajo || "--"}<br>
                <b>Área de trabajo:</b> ${this.point?.areaTrabajo || "--"}<br>
                <b>Producción:</b> ${this.point?.produccion || "--"}<br>
                <b>Kilómetros:</b> ${this.point?.kilometros || "0"} km<br>
                <b>Hora de inicio:</b> ${this.point?.horaInicio || "--"}
            `;
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
    [data, fleetData]
  );

  if (isLoading)
    return (
      <div className="bg-zinc-200 rounded-2xl h-[330px] w-full animate-pulse"></div>
    );
  if (isError)
    return (
      <div className="flex items-center justify-center h-[330px] w-full ">
        <span className="text-[10px] text-red-500">Ocurrió un error</span>
      </div>
    );
  return (
    <>
      <div className="w-full flex justify-between ">
        <div className="w-full flex flex-col gap-1">
          <div className="flex items-end gap-2">
            <IconDash1 className="text-zinc-500 w-4 h-4" />
            <h4 className="text-xs font-bold leading-3">Estado de Flota</h4>
          </div>
          <p className="text-[10.5px] text-zinc-400 leading-3">
            Disponibilidad y rendimiento de los vehículos.
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex gap-2 items-center">
            <div className="w-1 rounded-[5px] h-7 bg-[#81c784]"></div>
            <div className="flex flex-col ">
              <h4 className="text-xs leading-3 font-semibold">
                {fleetCounts[1]}
                <small>veh</small>
              </h4>
              <span className="text-[9px] text-[#A6A6A6] leading-3">
                Operativo
              </span>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-1 rounded-[5px] h-7 bg-[#fff176]"></div>
            <div className="flex flex-col ">
              <h4 className="text-xs leading-3 font-semibold">
                {fleetCounts[2]}
                <small>veh</small>
              </h4>
              <span className="text-[9px] text-[#A6A6A6] leading-3">
                Mantenimiento
              </span>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-1 rounded-[5px] h-7 bg-[#ff9999]"></div>
            <div className="flex flex-col ">
              <h4 className="text-xs leading-3 font-semibold">
                {fleetCounts[3]}
                <small>veh</small>
              </h4>
              <span className="text-[9px] text-[#A6A6A6] leading-3">
                Inoperativo
              </span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ width: "100%", overflowX: "auto" }}>
        <HighchartsReact
          ref={chartRef}
          highcharts={Highcharts}
          options={options}
        />
      </div>
    </>
  );
});

CardFlotaTime.displayName = "CardFlotaTime";
export default CardFlotaTime;
