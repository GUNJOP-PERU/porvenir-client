import { format } from "date-fns";
// Types
import type { BeaconCycle, BeaconUnitTrip } from "@/types/Beacon";
import Highcharts from "highcharts/highcharts-gantt";
import HighchartsReact from "highcharts-react-official";
import highchartsXrange from "highcharts/modules/xrange";

if (typeof highchartsXrange === "function") {
  highchartsXrange(Highcharts);
}
interface XRangeTripsChartProps {
  data: (BeaconCycle & { allTrips: BeaconUnitTrip[] })[];
}

const XRangeTripsChart = ({ data }: XRangeTripsChartProps) => {
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
    unit.allTrips.forEach((trip, tripIndex) => {
      const tripStartTime = getTimestamp(trip.startDate);
      const tripEndTime = getTimestamp(trip.endDate);
      
      allSeriesData.push({
        x: tripStartTime,
        x2: tripEndTime,
        y: unitIndex,
        color: "#10b981",
        borderColor: "#000000",
        borderWidth: 1,
        trip: trip,
        tripIndex: tripIndex + 1,
        isFullTrip: true,
        unitName: unit.unit.toUpperCase(),
        name: `${unit.unit} - Viaje ${tripIndex + 1}`
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
          
          specialPeriods.push({
            startTime: getTimestamp(detection.f_inicio),
            endTime: getTimestamp(detection.f_final),
            detections: [detection],
            startIndex: detectionIndex,
            type: 'bocamina'
          });
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

  const options: Highcharts.Options = {
    chart: {
      type: "xrange",
      height: Math.max(400, data.length * 45),
    },
    title: {
      text: "Cronograma de Viajes por Unidad",
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
    },
    yAxis: {
      title: {
        text: "Unidades",
      },
      categories: data.map((unit) => unit.unit.toUpperCase()),
      reversed: true,
      gridLineWidth: 1,
      gridLineColor: "#000000a9",
    },
    tooltip: {
      useHTML: true,
      formatter: function (this: any) {
        const point = this.point;
        const trip: BeaconUnitTrip = point.trip;
        const detection = point.detection;
        const startTime = format(new Date(point.x), "HH:mm:ss");
        const endTime = format(new Date(point.x2), "HH:mm:ss");
        const duration = ((point.x2 - point.x) / 1000 / 60).toFixed(2);

        if (point.isFullTrip) {
          const detections = Array.isArray(trip.trip) ? trip.trip : [trip.trip];
          const allLocations = [...new Set(detections
            .filter((d: any) => d.ubication && d.ubication.trim() !== '')
            .map((d: any) => d.ubication)
          )].join(', ');
          return `
            <div style="padding: 8px;">
              <b>Viaje #${point.tripIndex}</b><br/>
              <b>Unidad:</b> ${point.unitName}<br/>
              <b>Inicio:</b> ${startTime}<br/>
              <b>Fin:</b> ${endTime}<br/>
              <b>Duración:</b> ${duration} min<br/>
              <b>Ruta:</b> ${trip.startUbication} → ${trip.endUbication}<br/>
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
          formatter: function(this: any) {
            if (this.point.isFullTrip) {
              return `V${this.point.tripIndex}`;
            } else {
              const prefix = this.point.isBocamina ? "B" : "M";
              return `${prefix}${this.point.tripIndex}.${this.point.periodIndex}`;
            }
          },
          style: {
            color: "#FFFFFF",
            fontSize: "9px",
            fontWeight: "bold",
            textOutline: "none",
          },
        },
      },
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    series: series as any,
  };

  return (
    <div className="w-full">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default XRangeTripsChart;
