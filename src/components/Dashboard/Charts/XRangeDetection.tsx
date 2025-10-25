import { useMemo, useState, useEffect } from "react";
import { format } from "date-fns";
// Types
import type { UnitTripDetections } from "@/types/Beacon";
import Highcharts from "highcharts/highcharts-gantt";
import HighchartsReact from "highcharts-react-official";
import highchartsXrange from "highcharts/modules/xrange";
import { formatDurationMinutes } from "@/lib/utilsGeneral";
// Utils
import { getCurrentDay } from "@/utils/dateUtils";

// Inicializar módulo xrange
if (typeof highchartsXrange === "function") {
  (highchartsXrange as any)(Highcharts);
}
interface XRangeTripsChartProps {
  data: UnitTripDetections[];
}

const XRangeDetection = ({ data }: XRangeTripsChartProps) => {
  const [ shift, setShift ] = useState<string>(getCurrentDay().shift);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentDay = getCurrentDay();
      setShift(currentDay.shift);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getTimestamp = (dateValue: any): number => {
    if (typeof dateValue === 'string') {
      return new Date(dateValue).getTime();
    } else if (dateValue instanceof Date) {
      return dateValue.getTime();
    } else {
      return Number(dateValue);
    }
  };

  const allSeriesData: any[] = [];
  
  data.forEach((unit, unitIndex) => {
    const getTrackType = (track: any) => {
      const isMaintenanceDetection = track.ubicationType && (
        track.ubication?.toLowerCase().includes("taller") || 
        track.ubicationType?.toLowerCase().includes("mantenimiento")
      );
      const isBocaminaDetection = track.ubication?.toLowerCase().includes('bocamina') ||
        track.ubicationType?.toLowerCase().includes('bocamina');
      const isPlantaDetection = track.ubication?.toLowerCase().includes('planta') ||
        track.ubicationType?.toLowerCase().includes('planta');
      const isParqueoDetection = track.ubication?.toLowerCase() === 'parqueo';
      
      if (isPlantaDetection) return 'planta';
      if (isBocaminaDetection) return 'bocamina';
      if (isMaintenanceDetection) return 'mantenimiento';
      if (isParqueoDetection) return 'parqueo';
      return 'other';
    };

    const tracks = unit.tracks || [];
    const groupedTracks: any[] = [];
    
    for (let i = 0; i < tracks.length; i++) {
      const currentTrack = tracks[i];
      const currentType = getTrackType(currentTrack);
      
      // Solo agrupar si es parqueo o mantenimiento
      if (currentType === 'parqueo' || currentType === 'mantenimiento') {
        // Buscar tracks consecutivos del mismo tipo
        let endIndex = i;
        while (endIndex + 1 < tracks.length && getTrackType(tracks[endIndex + 1]) === currentType) {
          endIndex++;
        }
        
        if (endIndex > i) {
          // Crear un track agrupado
          const groupedTrack = {
            ...currentTrack,
            f_inicio: currentTrack.f_inicio,
            f_final: tracks[endIndex].f_final,
            ubication: currentTrack.ubication,
            ubicationType: currentTrack.ubicationType,
            isGrouped: true,
            groupSize: endIndex - i + 1,
            originalTracks: tracks.slice(i, endIndex + 1)
          };
          groupedTracks.push(groupedTrack);
          i = endIndex; // Saltar los tracks ya agrupados
        } else {
          groupedTracks.push({
            ...currentTrack,
            isGrouped: false,
            groupSize: 1,
            originalTracks: [currentTrack]
          });
        }
      } else {
        groupedTracks.push({
          ...currentTrack,
          isGrouped: false,
          groupSize: 1,
          originalTracks: [currentTrack]
        });
      }
    }

    let firstBocaminaFound = false; // Bandera para rastrear la primera bocamina
      
    groupedTracks.forEach((track: any, trackIndex: number) => {
      const currentTrackType = getTrackType(track);

      const startTime = getTimestamp(track.f_inicio);
      const endTime = getTimestamp(track.f_final);
      const duration = (endTime - startTime) / 1000 / 60;
      
      let color = "#10b981"; 
      
      if (currentTrackType === 'planta') {
        color = "#EF4444";
      } else if (currentTrackType === 'bocamina') {
        color = "#c77dff";
      } else if (currentTrackType === 'mantenimiento') {
        color = "#f3d111";
      } else if (currentTrackType === 'parqueo') {
        color = "#0508b3";
      }
      
      const trackTypeLabel = currentTrackType === 'planta' ? "Planta" :
                            currentTrackType === 'bocamina' ? "Bocamina" : 
                            currentTrackType === 'parqueo' ? "Parqueo" : 
                            currentTrackType === 'mantenimiento' ? "Mantenimiento" : "Otra Ubicación";

      allSeriesData.push({
        x: startTime,
        x2: endTime,
        y: unitIndex,
        color: color,
        borderWidth: 1,
        borderColor: "#000000",
        track: track,
        trackIndex: trackIndex + 1,
        isTrackDetection: true,
        trackType: currentTrackType,
        isPlanta: currentTrackType === 'planta',
        isBocamina: currentTrackType === 'bocamina',
        isMaintenance: currentTrackType === 'mantenimiento',
        isParqueo: currentTrackType === 'parqueo',
        isOther: currentTrackType === 'other',
        unitName: unit.unit.toUpperCase(),
        duration: duration,
        shift: track.shift,
        name: `${unit.unit} - ${trackTypeLabel}${track.isGrouped ? ` (${track.groupSize} agrupados)` : ''} #${trackIndex + 1}`,
        zIndex: 1,
        isGrouped: track.isGrouped,
        groupSize: track.groupSize
      });
    });
  });

  // Ordenar datos por z-index para asegurar el orden de renderizado
  const sortedData = allSeriesData.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
  
  const series = [{
    name: "Cronograma de Detecciones",
    pointWidth: 30,
    data: sortedData,
    tooltip: {
      pointFormatter: function(this: any) {
        // Si el point no debe mostrar tooltip, retornar undefined
        if (this.isTrackDetection && !this.showTooltip) {
          return false;
        }
        return undefined; // Usar el formatter por defecto
      }
    }
  }];

  const options: Highcharts.Options = useMemo(() => ({
    chart: {
      type: "xrange",
      height: (data.length * 110) + 80,
      animation: false,
      events: {
        render: function() {
          this.series.forEach((series: any) => {
            if (series.points) {
              series.points.forEach((point: any) => {
                if (point.dataLabel) {
                  point.dataLabel.show();
                }
              });
            }
          });
        }
      }
    },
    title: {
      text: "",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
      },
    },
    time: {
      timezone: 'America/Lima',
    },
    xAxis: [{
      // Eje X inferior
      type: "datetime",
      title: {
        text: "Tiempo",
      },
      labels: {
        format: "{value:%H:%M}",
      },
    }, {
      // Eje X superior
      type: "datetime",
      opposite: true,
      linkedTo: 0,
      title: {
        text: null,
      },
      labels: {
        format: "{value:%H:%M}",
      },
    }],
    yAxis: {
      title: {
        text: "",
      },
      categories: data.map((unit) => unit.unit.toUpperCase()),
      reversed: true,
      gridLineWidth: 1,
      gridLineColor: "#000000a9",
    },
    tooltip: {
      useHTML: true,
      outside: true,
      positioner: function(labelWidth: number, labelHeight: number, point: any) {
        return {
          x: point.plotX + 50,
          y: point.plotY - 220
        };
      },
      formatter: function (this: any) {
        const point = this.point;
        const track = point.track;
        const startTime = format(new Date(point.x), "HH:mm:ss");
        const endTime = format(new Date(point.x2), "HH:mm:ss");
        const duration = ((point.x2 - point.x) / 1000 / 60).toFixed(1);

        if (point.isTrackDetection) {
          
          const trackColor = point.trackType === 'planta' ? "#EF4444" :
                            point.trackType === 'bocamina' ? "#c77dff" : 
                            point.trackType === 'parqueo' ? "#3b82f6" :
                            point.trackType === 'mantenimiento' ? "#f59e0b" :
                            "#10b981"; // Verde para "other"
          
          return `
            <div style="
              background: linear-gradient(145deg, #1c1c1f, #232427);
              padding: 12px 14px;
              border-radius: 10px;
              color: #e5e5e5;
              font-family: 'Inter', sans-serif;
              font-size: 12px;
              box-shadow: 0 4px 10px rgba(0,0,0,0.45);
              border: 1px solid #2d2d32;
              min-width: 200px;
            ">
              <div style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 8px;
              ">
                <div style="font-weight: 700; font-size: 14px; color: #fff;">
                  🚚 ${point.unitName}
                </div>
                <span style="
                  font-size: 11px;
                  background: ${trackColor}15;
                  color: ${trackColor};
                  padding: 2px 8px;
                  border-radius: 6px;
                  font-weight: 600;
                ">
                  ${point.shift?.toUpperCase() || 'N/A'}
                </span>
              </div>
          
              <div style="
                color: ${trackColor};
                font-weight: 600;
                font-size: 13px;
                margin-bottom: 8px;
              ">
                ${point.trackType} - Track #${point.trackIndex}
                ${point.isGrouped ? `<span style="color: #ffa500; font-size: 11px; font-weight: 500;"> (${point.groupSize} agrupados)</span>` : ''}
              </div>
          
              <div style="margin-bottom: 8px; line-height: 1.5;">
                <div><b style="color:#bbb;">Inicio:</b> <span>${startTime}</span></div>
                <div><b style="color:#bbb;">Fin:</b> <span>${endTime}</span></div>
                <div><b style="color:#bbb;">Duración:</b> <span>${formatDurationMinutes(duration)}</span></div>
                ${point.isGrouped ? `<div><b style="color:#bbb;">Detecciones:</b> <span style="color: #ffa500;">${point.groupSize} consecutivas</span></div>` : ''}
              </div>
          
              <div style="
                border-top: 1px solid #2f2f2f;
                margin: 8px 0;
              "></div>
          
              <div style="line-height: 1.5;">
                <div><b style="color:#bbb;">Ubicación:</b></div>
                <div style="color:#ddd; font-weight: 500;">${track?.ubication || 'N/A'}</div>
                ${track?.ubicationType ? `<div style="color:#aaa; font-size: 11px;">Tipo: ${track.ubicationType}</div>` : ''}
                ${point.isGrouped ? `<div style="color:#aaa; font-size: 11px; margin-top: 4px;">✨ Detecciones consecutivas del mismo tipo fusionadas</div>` : ''}
              </div>
            </div>
          `;
        } else if (point.isBackground) {
          return `
            <div style="
              background: linear-gradient(145deg, #f8f9fa, #e9ecef);
              padding: 10px 12px;
              border-radius: 8px;
              color: #495057;
              font-family: 'Inter', sans-serif;
              font-size: 12px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              border: 1px solid #dee2e6;
              min-width: 180px;
            ">
              <div style="font-weight: 700; font-size: 13px; color: #343a40; margin-bottom: 6px;">
                🚚 ${point.unitName}
              </div>
              <div style="color: #6c757d; font-size: 11px; margin-bottom: 4px;">
                Período sin detecciones
              </div>
              <div style="line-height: 1.4;">
                <div><b style="color:#6c757d;">Inicio:</b> <span>${startTime}</span></div>
                <div><b style="color:#6c757d;">Fin:</b> <span>${endTime}</span></div>
                <div><b style="color:#6c757d;">Duración:</b> <span>${formatDurationMinutes(duration)}</span></div>
              </div>
            </div>
          `;
        }
      },
      backgroundColor: "#111214",
      borderWidth: 0,
      shadow: false,
      borderRadius: 8,
      style: {
        color: "#FFFFFF",
        fontSize: "12px",
      },
    },
    plotOptions: {
      xrange: {
        borderRadius: 4,
        borderWidth: 1,
        enableMouseTracking: true,
        dataLabels: {
          enabled: true,
          useHTML: true,
          allowOverlap: true,
          defer: false,
          formatter: function() {
            return null;
          },
          style: {
            color: "#FFFFFF",
            fontSize: "9px",
            fontWeight: "bold",
            textOutline: "none",
          },
          crop: false,
          overflow: 'allow'
        } as any,
      },
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    series: series as any,
  }), [data, allSeriesData,shift]);

  const chartHeight = (data.length * 104) + 15 ;
  const rowHeight = 108;

  return (
    <div className="w-full flex gap-2">
      <div className="flex-1">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
};

export default XRangeDetection;