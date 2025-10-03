import { useMemo, useState, useEffect } from "react";
import { format } from "date-fns";
// Types
import type { BeaconCycle, BeaconUnitTrip } from "@/types/Beacon";
import Highcharts from "highcharts/highcharts-gantt";
import HighchartsReact from "highcharts-react-official";
import highchartsXrange from "highcharts/modules/xrange";
// Utils
import { getCurrentDay } from "@/utils/dateUtils";

// Inicializar módulo xrange
if (typeof highchartsXrange === "function") {
  (highchartsXrange as any)(Highcharts);
}
interface XRangeTripsChartProps {
  data: (BeaconCycle & { allTrips: BeaconUnitTrip[] })[];
}

const XRangeTripsChart = ({ data }: XRangeTripsChartProps) => {
  const [ shift, setShift ] = useState<string>(getCurrentDay().shift);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentDay = getCurrentDay();
      setShift(currentDay.shift);
    }, 10000); // 10 segundos

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
  const bocaminaAnnotations: any[] = [];
  let bocaminaCounter = 0; // Contador global para alternar posición de labels
  
  data.forEach((unit, unitIndex) => {
    unit.allTrips.forEach((trip, tripIndex) => {
      const tripStartTime = getTimestamp(trip.startDate);
      const tripEndTime = getTimestamp(trip.endDate);
      
      // Determinar color del viaje según si tiene destino
      const hasDestination = trip.endUbication && trip.endUbication.trim() !== "";
      const tripColor = hasDestination ? "#10b981" : "#6b7280"; // Verde si tiene destino, gris si no
      
      allSeriesData.push({
        x: tripStartTime,
        x2: tripEndTime,
        y: unitIndex,
        color: tripColor,
        borderColor: "#000000",
        borderWidth: 1,
        trip: trip,
        tripIndex: tripIndex + 1,
        isFullTrip: true,
        hasDestination: hasDestination,
        unitName: unit.unit.toUpperCase(),
        name: `${unit.unit} - Viaje ${tripIndex + 1}${hasDestination ? '' : ' (Sin destino)'}`
      });

      const detections = Array.isArray(trip.trip) ? trip.trip : [trip.trip];
      
      const specialPeriods: any[] = [];
      let currentMaintenancePeriod: any = null;
      
      detections.forEach((detection, detectionIndex) => {
        const isMaintenanceDetection = detection.ubicationType && (
          detection.ubication?.toLowerCase().includes("taller saturno")
        );

        const isBocaminaDetection = detection.ubication?.toLowerCase().includes('bocamina') ||
          detection.ubicationType?.toLowerCase().includes('bocamina');

        if (isBocaminaDetection) {
          if (currentMaintenancePeriod) {
            specialPeriods.push(currentMaintenancePeriod);
            currentMaintenancePeriod = null;
          }
          
          const startTime = getTimestamp(detection.f_inicio);
          const endTime = getTimestamp(detection.f_final);
          const duration = (endTime - startTime) / 1000 / 60; // duración en minutos
          
          const bocaminaPeriod = {
            startTime: startTime,
            endTime: endTime,
            detections: [detection],
            startIndex: detectionIndex,
            type: 'bocamina',
            hasLabel: duration > 0,
            bocaminaIndex: bocaminaCounter++
          };
          
          specialPeriods.push(bocaminaPeriod);
        }
        else if (isMaintenanceDetection) {
          const currentStartTime = getTimestamp(detection.f_inicio);
          
          const canConsolidate = currentMaintenancePeriod && 
            ((currentStartTime - currentMaintenancePeriod.endTime) / 1000 / 60) < 5;
          
          if (!currentMaintenancePeriod || !canConsolidate) {
            if (currentMaintenancePeriod) {
              specialPeriods.push(currentMaintenancePeriod);
            }
            
            currentMaintenancePeriod = {
              startTime: currentStartTime,
              endTime: getTimestamp(detection.f_final),
              detections: [detection],
              startIndex: detectionIndex,
              type: 'maintenance'
            };
          } else {
            currentMaintenancePeriod.endTime = getTimestamp(detection.f_final);
            currentMaintenancePeriod.detections.push(detection);
          }
        }
        else {
          if (currentMaintenancePeriod) {
            specialPeriods.push(currentMaintenancePeriod);
            currentMaintenancePeriod = null;
          }
        }
      });

      if (currentMaintenancePeriod) {
        specialPeriods.push(currentMaintenancePeriod);
      }

      specialPeriods.forEach((period, periodIndex) => {
        const color = period.type === 'bocamina' ? "#3b82f6" : "#f59e0b";
        const periodType = period.type === 'bocamina' ? "Bocamina" : "Mantenimiento";
        
        allSeriesData.push({
          x: period.startTime,
          x2: period.endTime,
          y: unitIndex,
          color: color,
          borderWidth: 1,
          borderColor: "transparent",
          trip: trip,
          specialPeriod: period,
          tripIndex: tripIndex + 1,
          periodIndex: periodIndex + 1,
          isSpecialDetection: true,
          isBocamina: period.type === 'bocamina',
          isMaintenance: period.type === 'maintenance',
          unitName: unit.unit.toUpperCase(),
          name: `${unit.unit} - ${periodType} ${tripIndex + 1}.${periodIndex + 1}`
        });
      });
    });
  });

  const series = [{
    name: "Cronograma de Viajes",
    pointWidth: 30,
    data: allSeriesData,
  }];

  const options: Highcharts.Options = useMemo(() => ({
    chart: {
      type: "xrange",
      height: Math.max(data.length * 120),
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
    xAxis: {
      type: "datetime",
      title: {
        text: "Tiempo",
      },
      labels: {
        format: "{value:%H:%M}",
      },
      min: (() => {
        const today = new Date();
        if (shift === "dia") {
          return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 6, 0, 0).getTime();
        } else {
          return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0, 0).getTime();
        }
      })(),
      max: (() => {
        const today = new Date();
        if (shift === "dia") {
          return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0, 0).getTime();
        } else {
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          return new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 6, 0, 0).getTime();
        }
      })(),
    },
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
          y: Math.max(point.plotY - 160)
        };
      },
      formatter: function (this: any) {
        const point = this.point;
        const trip: BeaconUnitTrip = point.trip;
        const detection = point.detection;
        const startTime = format(new Date(point.x), "HH:mm:ss");
        const endTime = format(new Date(point.x2), "HH:mm:ss");
        const duration = ((point.x2 - point.x) / 1000 / 60).toFixed(1);

        if (point.isFullTrip) {
          const detections = Array.isArray(trip.trip) ? trip.trip : [trip.trip];
          const allLocations = [...new Set(detections
            .filter((d: any) => d.ubication && d.ubication.trim() !== '')
            .map((d: any) => d.ubication)
          )].join(', ');
          
          const routeText = point.hasDestination 
            ? `${trip.startUbication} → ${trip.endUbication}`
            : `${trip.startUbication} (Sin destino definido)`;
          
          return `
            <div style="padding: 8px;">
              <b>Viaje #${point.tripIndex}${point.hasDestination ? '' : ' - Sin Destino'}</b><br/>
              <b>Unidad:</b> ${point.unitName}<br/>
              <b>Inicio:</b> ${startTime}<br/>
              <b>Fin:</b> ${endTime}<br/>
              <b>Duración:</b> ${duration} min<br/>
              <b>Ruta:</b> ${routeText}<br/>
              <b>Turno:</b> ${trip.shift}<br/>
            </div>
          `;
        } else {
          const specialPeriod = point.specialPeriod;
          const detectionCount = specialPeriod.detections.length;
          const locations = [...new Set(specialPeriod.detections.map((d: any) => d.ubication))].join(', ');
          const periodType = point.isBocamina ? "Bocamina" : "Mantenimiento";
          
          return `
            <div style="padding: 8px;">
              <b>Período de ${periodType} - Viaje #${point.tripIndex}</b><br/>
              <b>Unidad:</b> ${point.unitName}<br/>
              <b>Inicio:</b> ${startTime}<br/>
              <b>Fin:</b> ${endTime}<br/>
              <b>Duración:</b> ${duration} min<br/>
              <b>Detecciones:</b> ${detectionCount}<br/>
              <b>Ubicaciones:</b> ${locations}
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
        dataLabels: {
          enabled: true,
          useHTML: true,
          allowOverlap: true,
          defer: false,
          formatter: function(this: any) {
            // Para bocaminas con duración > 0, mostrar etiqueta especial
            if (this.point.isBocamina && this.point.specialPeriod?.hasLabel) {
              const timeLabel = new Date(this.point.x).toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
              });
              const duration = ((this.point.x2 - this.point.x) / 1000 / 60).toFixed(1);
              const bocaminaName = this.point.specialPeriod.detections[0].ubication;
              const bocaminaIndex = this.point.specialPeriod.bocaminaIndex;
              
              const isEven = bocaminaIndex % 2 === 0;
              const topPosition = isEven ? -33 : 32;
              
              return `<div
                        style="
                        background: rgba(0, 0, 0, 0.9);
                        color: white;
                        width: 80px;
                        padding: 3px 6px;
                        border-radius: 3px;
                        border: 1px solid #000000;
                        font-size: 9px;
                        font-weight: bold;
                        position: relative;
                        top: ${topPosition}px; z-index: 1;
                        white-space: nowrap;"
                      >
                        ${bocaminaName}<br/>${timeLabel} / ${duration} min
                      </div>`;
            }
            
            // Formato estándar para otros elementos
            if (this.point.isFullTrip) {
              return `V${this.point.tripIndex}`;
            } else if(this.point.isMaintenance) {
              const prefix = "M";
              return `${prefix}${this.point.tripIndex}.${this.point.periodIndex}`;
            }
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

  return (
    <div className="w-full">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default XRangeTripsChart;
