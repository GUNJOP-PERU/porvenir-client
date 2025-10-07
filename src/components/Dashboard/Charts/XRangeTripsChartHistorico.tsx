import { useMemo } from "react";
import { format } from "date-fns";
// Types
import type { BeaconCycle, BeaconUnitTrip } from "@/types/Beacon";
import Highcharts from "highcharts/highcharts-gantt";
import HighchartsReact from "highcharts-react-official";
import highchartsXrange from "highcharts/modules/xrange";
import { StatusDisplay } from "../StatusDisplay";
import { formatDurationMinutes } from "@/lib/utilsGeneral";

// Inicializar módulo xrange
if (typeof highchartsXrange === "function") {
  (highchartsXrange as any)(Highcharts);
}
interface XRangeTripsChartProps {
  data: (BeaconCycle & { allTrips: BeaconUnitTrip[] })[];
  isLoading?: boolean;
  isError?: boolean;
}

const XRangeTripsChartHistorico = ({
  data,
  isLoading,
  isError,
}: XRangeTripsChartProps) => {
  const getTimestamp = (dateValue: any): number => {
    if (typeof dateValue === "string") {
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
    let validTripCounter = 0; // Contador solo para viajes con destino

    unit.allTrips.forEach((trip, tripIndex) => {
      const tripStartTime = getTimestamp(trip.startDate);
      const tripEndTime = getTimestamp(trip.endDate);

      // Determinar color del viaje según si tiene destino
      const hasDestination =
        trip.endUbication && trip.endUbication.trim() !== "";
      const tripColor = hasDestination ? "#10b981" : "#3F7D58"; // Verde si tiene destino, gris si no

      // Solo incrementar contador para viajes con destino
      const displayTripIndex = hasDestination ? ++validTripCounter : 0;

      allSeriesData.push({
        x: tripStartTime,
        x2: tripEndTime,
        y: unitIndex,
        color: tripColor,
        borderColor: "#000000",
        borderWidth: 1,
        trip: trip,
        tripIndex: displayTripIndex, // Usar el contador de viajes válidos
        originalTripIndex: tripIndex + 1, // Mantener índice original para otros usos
        isFullTrip: true,
        hasDestination: hasDestination,
        unitName: unit.unit.toUpperCase(),
        name: `${unit.unit} - ${
          hasDestination ? `Viaje ${displayTripIndex}` : "Sin destino"
        }`,
      });

      const detections = Array.isArray(trip.trip) ? trip.trip : [trip.trip];

      const specialPeriods: any[] = [];
      let currentMaintenancePeriod: any = null;

      detections.forEach((detection, detectionIndex) => {
        const isMaintenanceDetection =
          detection.ubicationType &&
          detection.ubication?.toLowerCase().includes("taller saturno");

        const isBocaminaDetection =
          detection.ubication?.toLowerCase().includes("bocamina") ||
          detection.ubicationType?.toLowerCase().includes("bocamina");

        if (isBocaminaDetection) {
          if (currentMaintenancePeriod) {
            specialPeriods.push(currentMaintenancePeriod);
            currentMaintenancePeriod = null;
          }

          const startTime = getTimestamp(detection.f_inicio);
          const endTime = getTimestamp(detection.f_final);
          const duration = (endTime - startTime) / 1000; // duración en minutos
          if (duration >= 15) {
            const bocaminaPeriod = {
              startTime: startTime,
              endTime: endTime,
              detections: [detection],
              startIndex: detectionIndex,
              type: "bocamina",
              hasLabel: duration >= 15,
              bocaminaIndex: bocaminaCounter++,
            };

            specialPeriods.push(bocaminaPeriod);
          }
        } else if (isMaintenanceDetection) {
          const currentStartTime = getTimestamp(detection.f_inicio);

          const canConsolidate =
            currentMaintenancePeriod &&
            (currentStartTime - currentMaintenancePeriod.endTime) / 1000 / 60 <
              5;

          if (!currentMaintenancePeriod || !canConsolidate) {
            if (currentMaintenancePeriod) {
              specialPeriods.push(currentMaintenancePeriod);
            }

            currentMaintenancePeriod = {
              startTime: currentStartTime,
              endTime: getTimestamp(detection.f_final),
              detections: [detection],
              startIndex: detectionIndex,
              type: "maintenance",
            };
          } else {
            currentMaintenancePeriod.endTime = getTimestamp(detection.f_final);
            currentMaintenancePeriod.detections.push(detection);
          }
        } else {
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
        const color = period.type === "bocamina" ? "#3b82f6" : "#f59e0b";
        const periodType =
          period.type === "bocamina" ? "Bocamina" : "Mantenimiento";

        // Obtener el tripIndex correcto del viaje padre
        const parentTrip = allSeriesData.find(
          (item) => item.trip === trip && item.isFullTrip
        );
        const parentTripIndex = parentTrip
          ? parentTrip.tripIndex
          : tripIndex + 1;

        allSeriesData.push({
          x: period.startTime,
          x2: period.endTime,
          y: unitIndex,
          color: color,
          borderWidth: 1,
          borderColor: "transparent",
          trip: trip,
          specialPeriod: period,
          tripIndex: parentTripIndex,
          periodIndex: periodIndex + 1,
          isSpecialDetection: true,
          isBocamina: period.type === "bocamina",
          isMaintenance: period.type === "maintenance",
          unitName: unit.unit.toUpperCase(),
          name: `${unit.unit} - ${periodType} ${
            parentTripIndex > 0 ? parentTripIndex : "S/N"
          }.${periodIndex + 1}`,
        });
      });
    });
  });

  const series = [
    {
      name: "Cronograma de Viajes",
      pointWidth: 30,
      data: allSeriesData,
    },
  ];

  const options: Highcharts.Options = useMemo(
    () => ({
      chart: {
        type: "xrange",
        height: Math.max(data.length * 120),
        // marginLeft: 90,
        animation: false,
        events: {
          render: function () {
            this.series.forEach((series: any) => {
              if (series.points) {
                series.points.forEach((point: any) => {
                  if (point.dataLabel) {
                    point.dataLabel.show();
                  }
                });
              }
            });
          },
        },
      },
      title: {
        text: "",
      },
      time: {
        timezone: "America/Lima",
      },
      xAxis: {
        type: "datetime",
        title: {
          text: "",
        },
        lineColor: "#A6A6A650",
        labels: {
          style: {
            color: "#A6A6A6",
            fontSize: "0.8rem",
            fontWeight: "600",
          },
          format: "{value:%H:%M}",
        },
      },
      yAxis: {
        title: {
          text: "",
        },
        categories: data.map((unit) => unit.unit.toUpperCase()),
        reversed: true,
        gridLineWidth: 1,
        gridLineColor: "#A6A6A650",
        labels: {
          align: "right",
          marginLeft: 50,
          marginRight: 50,
          formatter: function () {
            return String(this.value).replace(/-/g, "-<br>");
          },
          style: {
            color: "#6e6d7a",
            fontSize: "0.8rem",
            fontWeight: "700",
            textAlign: "left",
          },
        },
      },
      tooltip: {
        useHTML: true,
        outside: true,
        positioner: function (
          labelWidth: number,
          labelHeight: number,
          point: any
        ) {
          return {
            x: point.plotX + 50,
            y: Math.max(point.plotY - 160),
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
            const detections = Array.isArray(trip.trip)
              ? trip.trip
              : [trip.trip];
            const allLocations = [
              ...new Set(
                detections
                  .filter((d: any) => d.ubication && d.ubication.trim() !== "")
                  .map((d: any) => d.ubication)
              ),
            ].join(", ");

            const routeText = point.hasDestination
              ? `${trip.startUbication} → ${trip.endUbication}`
              : `${trip.startUbication} (Sin destino definido)`;

            const tripLabel = point.hasDestination
              ? `Viaje #${point.tripIndex}`
              : "Sin Destino";

            return `
           <div style="
    background: linear-gradient(145deg, #1c1c1f, #232427);
    padding: 14px 16px;
    border-radius: 10px;
    color: #e5e5e5;
    font-family: 'Inter', sans-serif;
    font-size: 12.5px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.45);
    border: 1px solid #2d2d32;
    min-width: 220px;
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
        background: #10b98115;
        color: #10b981;
        padding: 2px 8px;
        border-radius: 6px;
        font-weight: 600;
      ">
        ${trip.shift.toUpperCase()}
      </span>
    </div>

    <div style="
      color: #10b981;
      font-weight: 600;
      font-size: 12px;
      margin-bottom: 8px;
    ">
      ${tripLabel}
    </div>

    <div style="margin-bottom: 8px; line-height: 1.5;">
      <div><b style="color:#bbb;">Inicio:</b> <span>${startTime}</span></div>
      <div><b style="color:#bbb;">Fin:</b> <span>${endTime}</span></div>
      <div><b style="color:#bbb;">Duración:</b> <span>${formatDurationMinutes(duration)}</span></div>
    </div>

    <div style="
      border-top: 1px solid #2f2f2f;
      margin: 8px 0;
    "></div>

    <div style="line-height: 1.5;">
      <div><b style="color:#bbb;">Ruta:</b></div>
      <div style="color:#ddd; font-weight: 500;">${routeText}</div>
    </div>
  </div>
          `;
          } else {
            const specialPeriod = point.specialPeriod;
            const detectionCount = specialPeriod.detections.length;
            const locations = [
              ...new Set(specialPeriod.detections.map((d: any) => d.ubication)),
            ].join(", ");
            const periodType = point.isBocamina ? "Bocamina" : "Mantenimiento";

            const tripReference =
              point.tripIndex > 0 ? `Viaje #${point.tripIndex}` : "Sin destino";

            return `
            <div style="
              padding: 10px 14px;
              background: #1e1f22;
              border-radius: 8px;
              color: #f5f5f5;
              font-family: 'Inter', sans-serif;
              font-size: 12px;
              line-height: 1.5;
              box-shadow: 0 2px 6px rgba(0,0,0,0.4);
            ">
              <div style="font-weight: 700; font-size: 14px; color: #fff; margin-bottom: 6px;">
                🚚 ${point.unitName}
              </div>

              <div style="margin-bottom: 6px;">
                <b style="color:${point.isBocamina ? "#3b82f6" : "#f59e0b"}">
                  ${periodType.toUpperCase()}
                </b>
                <span style="color:#aaa;"> — ${tripReference}</span>
              </div>

              <div style="margin-bottom: 4px;">
                <b style="color:#ccc;">Inicio:</b> <span>${startTime}</span><br/>
                <b style="color:#ccc;">Fin:</b> <span>${endTime}</span><br/>
                <b style="color:#ccc;">Duración:</b> <span>${formatDurationMinutes(
                  duration
                )}</span>
              </div>

              <hr style="border: none; border-top: 1px solid #333; margin: 6px 0;" />

              <div style="margin-top: 4px;">
                <b style="color:#ccc;">Detecciones:</b> ${detectionCount}<br/>
                <b style="color:#ccc;">Ubicaciones:</b><br/>
                <span style="color:#ddd;">${locations}</span>
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
          dataLabels: {
            enabled: true,
            useHTML: true,
            allowOverlap: true,
            defer: false,
            formatter: function (this: any) {
              // Para bocaminas con duración > 0, mostrar etiqueta especial
              if (this.point.isBocamina && this.point.specialPeriod?.hasLabel) {
                const timeLabel = new Date(this.point.x).toLocaleTimeString(
                  "es-ES",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                );
                const duration = (
                  (this.point.x2 - this.point.x) /
                  1000 /
                  60
                ).toFixed(1);
                const bocaminaName =
                  this.point.specialPeriod.detections[0].ubication;
                const bocaminaIndex = this.point.specialPeriod.bocaminaIndex;

                const isEven = bocaminaIndex % 2 === 0;
                const topPosition = isEven ? -33 : 32;

                return `<div
                        style="
                        background: #D0DDD0;
                        color: #3F4F44;
                        width: 80px;
                        padding: 3px 6px;
                        border-radius: 5px;                       
                        font-size: 0.6rem;
                        font-weight: bold;
                        position: relative;
                        top: ${topPosition}px; z-index: 1;
                        white-space: nowrap;"
                      >
                        ${bocaminaName}<br/> <span style="color:#000000">${timeLabel} / ${formatDurationMinutes(
                  duration
                )}</span>
                      </div>`;
              }

              // Formato estándar para otros elementos
              if (this.point.isFullTrip && this.point.hasDestination) {
                // Solo mostrar "V" si el viaje tiene destino
                return `V${this.point.tripIndex}`;
              } else if (this.point.isMaintenance) {
                const prefix = "M";
                return `${prefix}${this.point.tripIndex}.${this.point.periodIndex}`;
              }
              // No mostrar label para viajes sin destino
            },
            style: {
              color: "#FFFFFF",
              fontSize: "9px",
              fontWeight: "bold",
              textOutline: "none",
            },
            crop: false,
            overflow: "allow",
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
    }),
    [data, allSeriesData]
  );

  if (isLoading || isError || !data || data.length === 0)
    return (
      <StatusDisplay
        isLoading={isLoading}
        isError={isError}
        noData={!data || data.length === 0}
        height="80vh"
      />
    );

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default XRangeTripsChartHistorico;
