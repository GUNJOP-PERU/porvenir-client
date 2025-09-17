import { useGraphicData } from "@/hooks/useGraphicData";
import IconDash1 from "@/icons/Dashboard/IconDash1";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highmaps";
import highchartsTilemap from "highcharts/modules/tilemap";
import { memo, useMemo, useRef, useState } from "react";
import { ModalFloat } from "./ModalFloat";
import { Button } from "@/components/ui/button";
import { Disc2, LandPlot } from "lucide-react";
import { useSocketTopicValue } from "@/hooks/useSocketValue";
import { StatusDisplay } from "../StatusDisplay";

// Inicializar los módulos
if (typeof highchartsTilemap === "function") {
  highchartsTilemap(Highcharts);
}

const CardFlotaTime = memo(({ symbol, endpoint }) => {
  const [showModal, setShowModal] = useState(false);
  const chartRef = useRef(null);

  useSocketTopicValue(symbol, [
        "shift-variable",
        symbol,
      ]);
      
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
          tileShape: "square", // Cambiar a 'square', 'circle' o 'diamond'
          dataLabels: {
            enabled: true,
            formatter: function () {
              return this.point.name.toUpperCase();
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
        useHTML: true, // Habilita HTML dentro del tooltip
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
      <div className="w-full flex justify-between ">
        <div className="w-full flex flex-col gap-1">
          <div className="flex items-end gap-2">
            <LandPlot className="text-green-500 w-4 h-4" />
            <h4 className="text-xs font-bold leading-3">Estado de Flota</h4>
          </div>
          <p className="text-[10.5px] text-zinc-400 leading-3">
            Disponibilidad de los vehículos.
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
          </div>{" "}
          <div>
            <Button onClick={() => setShowModal(true)}>
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
