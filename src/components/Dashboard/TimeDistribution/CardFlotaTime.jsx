import { memo, useMemo, useRef, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highmaps";
import highchartsTilemap from "highcharts/modules/tilemap";
import { useGraphicData } from "@/hooks/useGraphicData";
import { useSocketTopicValue } from "@/hooks/useSocketValue";
import { ModalFloat } from "./ModalFloat";
import { Button } from "@/components/ui/button";
import { StatusDisplay } from "../StatusDisplay";
import { Disc2, LandPlot } from "lucide-react";

// Inicializar los módulos
if (typeof highchartsTilemap === "function") {
  highchartsTilemap(Highcharts);
}

const CardFlotaTime = memo(({ symbol, endpoint }) => {
  const [showModal, setShowModal] = useState(false);
  const chartRef = useRef(null);

  useSocketTopicValue(symbol, ["shift-variable", symbol]);

  const {
    data = [],
    isLoading,
    isError,
  } = useGraphicData(symbol, endpoint, "shift-variable");

  const fleetData = useMemo(() => {
    const regex = /(\d+)$/;

    return [...data]
      .sort((a, b) => {
        const nameA = a.name.replace(/\s*-\s*/g, "-").trim();
        const nameB = b.name.replace(/\s*-\s*/g, "-").trim();

        const matchA = nameA.match(regex);
        const matchB = nameB.match(regex);

        const numA = matchA ? parseInt(matchA[1], 10) : 0;
        const numB = matchB ? parseInt(matchB[1], 10) : 0;

        const prefixA = nameA.replace(regex, "");
        const prefixB = nameB.replace(regex, "");

        return prefixA.localeCompare(prefixB) || numA - numB || a.id - b.id;
      })
      .map((item, index) => ({
        ...item,
        x: index % 10,
        y: Math.floor(index / 10),
      }));
  }, [data]);

  const fleetCounts = useMemo(() => {
    return fleetData.reduce(
      (acc, item) => {
        acc[item.value] = (acc[item.value] || 0) + 1;
        return acc;
      },
      { 1: 0, 2: 0, 3: 0 }
    );
  }, [fleetData]); 

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
      colorAxis: {
        dataClasses: [
          { from: 1, to: 1, color: "#81c784", name: "Operativo" },
          { from: 2, to: 2, color: "#fff176", name: "Mantenimiento" },
          { from: 3, to: 3, color: "#ff9999", name: "Inoperativo" },
        ],
      },
      series: [
        {
          name: "Estado de Vehículos",
          data: fleetData,
          type: "tilemap",
          borderRadius: 6,
          tileShape: "square",
          dataLabels: {
            enabled: true,
            formatter: function () {
              if (this.point.value === 1) {
                const estadoEmoji =
                  this.point?.ordenTrabajo === "ACEPTADA" &&
                  this.point?.checklist === "COMPLETADA"
                    ? "🟢"
                    : this.point?.ordenTrabajo === "ACEPTADA"
                    ? "🟠"
                    : "🟡";
  
                return `${estadoEmoji} ${this.point.name}`;
              }
              return `${this.point.name}`;
            },

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
        useHTML: true,
        valueSuffix: " toneladas",
        backgroundColor: "#111214",
        borderWidth: 0,
        shadow: false,
        borderRadius: 10,
        padding: 20,
        style: {
          color: "#FFFFFF",
          fontSize: "11px",
        },
        formatter: function () {
          return `
                <div style="width: 180px; display: flex; flex-direction: column; gap: 0.05rem;">
                    <h4 style="text-align: center; margin-bottom: 5px; font-weight: bold; font-size: 1.2em;">${
                      this.point.name
                    }</h4>
                    <div style="display: flex; justify-content: space-between; width: 100%;">
                        <b style="color: #aeaeae;">Conductor</b> <span>${
                          this.point?.conductor || "--"
                        }</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; width: 100%;">
                        <b style="color: #aeaeae;">Capacidad</b> <span>${
                          this.point?.capacidad || "--"
                        }</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; width: 100%;">
                        <b style="color: #aeaeae;">Check List</b> <span>${
                          this.point?.checklist === "COMPLETADA"
                            ? "✅ COMPLETADA"
                            : "--"
                        }</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; width: 100%; ">
                    <b style="color: #aeaeae;">Orden de Trabajo</b> <span>${
                      this.point?.ordenTrabajo === "ACEPTADA"
                        ? "✅ ACEPTADA"
                        : "--"
                    }</span>                        
                    </div>
                    <div style="display: flex; justify-content: space-between; width: 100%;">
                        <b style="color: #aeaeae;">Área de trabajo</b> <span>${
                          this.point?.areaTrabajo || "--"
                        }</span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; width: 100%;">
                        <b style="color: #aeaeae;">Kilómetros</b> <span>${
                          this.point?.kilometros || "0"
                        } km</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; width: 100%;">
                        <b style="color: #aeaeae;">Hora de inicio</b> <span>${
                          this.point?.horaInicio || "--"
                        }</span>
                    </div>
                </div>
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

  if (isLoading || isError || !data || Object.keys(data).length === 0) {
    return (
      <StatusDisplay
        isLoading={isLoading}
        isError={isError}
        noData={!data || Object.keys(data).length === 0}
      />
    );
  }
  return (
    <>
      <div className="w-full flex flex-wrap gap-2 justify-between ">
        <div className="w-fit flex flex-col gap-1">
          <div className="flex items-end gap-2">
            <LandPlot className="text-green-500 w-4 h-4" />
            <h4 className="text-xs font-bold leading-3">Estado de Flota</h4>
          </div>
          <p className="text-[10.5px] text-zinc-400 leading-3">
            Disponibilidad de los vehículos.
          </p>
        </div>

        <div className="w-full xl:w-fit flex gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <div className="flex gap-2 items-center">
              <div className="w-1 rounded-[5px] h-7 bg-[#81c784]"></div>
              <div className="flex flex-col gap-[2px]">
                <span className="text-[9px] text-[#A6A6A6] leading-3 font-semibold">
                  OPERATIVO
                </span>
                <h4 className="text-sm leading-none font-bold">
                  {fleetCounts[1]}
                  <small> veh</small>
                </h4>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-1 rounded-[5px] h-7 bg-[#FFD700]"></div>
              <div className="flex flex-col gap-[2px]">
                <span className="text-[9px] text-[#A6A6A6] leading-3 font-semibold">
                  MANTENIMIENTO
                </span>
                <h4 className="text-sm leading-none font-bold">
                  {fleetCounts[2]}
                  <small> veh</small>
                </h4>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-1 rounded-[5px] h-7 bg-[#ff9999]"></div>
              <div className="flex flex-col gap-[2px]">
                <span className="text-[9px] text-[#A6A6A6] leading-3 font-semibold">
                  INOPERATIVO
                </span>
                <h4 className="text-sm leading-none font-bold">
                  {fleetCounts[3]}
                  <small> veh</small>
                </h4>
              </div>
            </div>
          </div>
          <div>
            <Button onClick={() => setShowModal(true)} className="px-3">
              <Disc2 className="w-4 h-4" />
              Estado
            </Button>
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
      <div className="flex items-center gap-2 mt-2 text-[10px]">
        <div className="flex items-center gap-1">
          <div className="size-3 rounded-full bg-yellow-300 border border-yellow-400"></div>
          <span className="leading-none">Pendiente</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="size-3 rounded-full bg-orange-500"></div>
          <span className="leading-none">Orden aceptada</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="size-3 rounded-full bg-green-500"></div>
          <span className="leading-none">Orden + Checklist aceptado</span>
        </div>
      </div>

      {showModal && (
        <ModalFloat
          data={data}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
});

CardFlotaTime.displayName = "CardFlotaTime";
export default CardFlotaTime;
