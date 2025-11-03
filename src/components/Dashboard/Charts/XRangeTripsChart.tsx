import { useMemo, useState, useEffect } from "react";
import { format } from "date-fns";
// Types
import type { BeaconCycle, BeaconUnitTrip } from "@/types/Beacon";
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
  data: (BeaconCycle & { allTrips: BeaconUnitTrip[] })[];
}

const XRangeTripsChart = ({ data }: XRangeTripsChartProps) => {
  const [ shift, setShift ] = useState<string>(getCurrentDay().shift);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentDay = getCurrentDay();
      setShift(currentDay.shift);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const tableData = useMemo(() => {
    return data.map(unit => {
      const tripsWithDestination = unit.allTrips.filter(trip => 
        (trip.endUbication && trip.endUbication.trim() !== '') &&
        trip.remanejo === false
      );
      
      const totalTrips = tripsWithDestination.length;
      const totalDuration = unit.allTrips.reduce((acc, trip) => {
        return acc + trip.tripDurationMin;
      }, 0);
      
      const avgDuration = totalTrips > 0 ? totalDuration / totalTrips : 0;
      const totalHours = totalDuration / 60;
      const avgSubterraneo = tripsWithDestination.filter((trip) => trip.location === "Subterraneo").reduce((acc, trip) => acc + trip.tripDurationMin, 0) / (tripsWithDestination.filter((trip) => trip.location === "Subterraneo").length || 1);
      const avgSuperficie = tripsWithDestination.filter((trip) => trip.location === "Superficie").reduce((acc, trip) => acc + trip.tripDurationMin, 0) / (tripsWithDestination.filter((trip) => trip.location === "Superficie").length || 1);
      
      return {
        unit: unit.unit.toUpperCase(),
        totalTrips,
        totalHours: totalHours.toFixed(1),
        avgDuration: avgDuration.toFixed(1),
        avgSubterraneo: avgSubterraneo,
        avgSuperficie: avgSuperficie,
      };
    });
  }, [data]);

  const totals = useMemo(() => {
    const totalTrips = tableData.reduce((acc, row) => acc + row.totalTrips, 0);
    const totalHours = tableData.reduce((acc, row) => acc + parseFloat(row.totalHours), 0);
    const avgDuration = tableData.reduce((acc, row) => acc + parseFloat(row.avgDuration), 0);
    const avgSubterraneo = tableData.reduce((acc, row) => acc + row.avgSubterraneo, 0) / tableData.length;
    const avgSuperficie = tableData.reduce((acc, row) => acc + row.avgSuperficie, 0) / tableData.length;

    return {
      totalTrips,
      totalHours,
      avgDuration,
      avgSubterraneo,
      avgSuperficie,
    }
  }, [tableData]);

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
  let bocaminaCounter = 0;
  
  data.forEach((unit, unitIndex) => {
    let validTripCounter = 0;
    let remanejoCounter = 0;
    
    unit.allTrips.forEach((trip, tripIndex) => {
      const tripStartTime = getTimestamp(trip.startDate);
      const tripEndTime = getTimestamp(trip.endDate);
      const isDesmonte = trip.tripType === "Desmonte";
      const isRemanejo = trip.remanejo;
      const isSuperficie = trip.location === "Superficie";
      const isSubterraneo = trip.location === "Subterraneo";
      const isCompleteTrip = trip.endUbication && trip.endUbication.trim() !== "";

      let tripColor = "#dbdbdb";
      if (isDesmonte) {
        tripColor = "#3c3c3c";
      } else if (isRemanejo) {
        tripColor = "#f9c83e";
      } else if (isSuperficie) {
        tripColor = "#0aa7f0";
      } else if (isSubterraneo) {
        tripColor = "#096bdb";
      }
      
      const displayTripIndex = isCompleteTrip && !isRemanejo ? ++validTripCounter : 0;
      const displayRemanejoIndex = isRemanejo ? ++remanejoCounter : 0;
      
      allSeriesData.push({
        x: tripStartTime,
        x2: tripEndTime,
        y: unitIndex,
        color: tripColor,
        borderColor: "#000000",
        borderWidth: 1,
        trip: trip,
        tripIndex: displayTripIndex,
        remanejoIndex: displayRemanejoIndex,
        originalTripIndex: tripIndex + 1,
        isFullTrip: true,
        hasDestination: isCompleteTrip,
        unitName: unit.unit.toUpperCase(),
        remanejo: isRemanejo,
        name: `${unit.unit} - ${isCompleteTrip ? `Viaje ${displayTripIndex}` : 'Otros'}`
      });

      const detections = Array.isArray(trip.trip) ? trip.trip : [trip.trip];
      const specialPeriods: any[] = [];

      detections.forEach((detection, detectionIndex) => {
        const isMaintenanceDetection = detection.ubicationType && (
          detection.ubication?.toLowerCase().includes("taller saturno")
        );
        const isBocaminaDetection = detection.ubication?.toLowerCase().includes('bocamina') ||
          detection.ubicationType?.toLowerCase().includes('bocamina');
        const isParking = detection.ubication?.toLowerCase().includes('parqueo') ||
          detection.ubicationType?.toLowerCase().includes('parqueo');

        if (isBocaminaDetection) {
          const startTime = getTimestamp(detection.f_inicio);
          const endTime = getTimestamp(detection.f_final);
          
          const bocaminaPeriod = {
            startTime: startTime,
            endTime: endTime,
            detections: [detection],
            startIndex: detectionIndex,
            type: 'bocamina',
            bocaminaIndex: bocaminaCounter++
          };
          
          specialPeriods.push(bocaminaPeriod);
        }
        else if (isMaintenanceDetection) {
          const startTime = getTimestamp(detection.f_inicio);
          const endTime = getTimestamp(detection.f_final);

          const maintenancePeriod = {
            startTime: startTime,
            endTime: endTime,
            detections: [detection],
            startIndex: detectionIndex,
            type: 'maintenance',
          };
          specialPeriods.push(maintenancePeriod);
        } else if (isParking) {
          const startTime = getTimestamp(detection.f_inicio);
          const endTime = getTimestamp(detection.f_final);

          const parkingPeriod = {
            startTime: startTime,
            endTime: endTime,
            detections: [detection],
            startIndex: detectionIndex,
            type: 'parking',
          };
          specialPeriods.push(parkingPeriod);
        }
      });

      specialPeriods.forEach((period, periodIndex) => {
        const color = period.type === 'bocamina' ? "#66d20e" : period.type === "maintenance" ? "#fa4a4a" : "#8c00ff";
        const periodType = period.type === 'bocamina' ? "Bocamina" : period.type === "maintenance" ? "Mantenimiento" : "Parqueo";

        const parentTrip = allSeriesData.find(item => 
          item.trip === trip && item.isFullTrip
        );
        const parentTripIndex = parentTrip ? parentTrip.tripIndex : tripIndex + 1;
        
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
          isBocamina: period.type === 'bocamina',
          isMaintenance: period.type === 'maintenance',
          isParking: period.type === 'parking',
          remanejo: isRemanejo,
          periodType: periodType,
          unitName: unit.unit.toUpperCase(),
          name: `${unit.unit} - ${periodType} ${parentTripIndex > 0 ? parentTripIndex : 'S/N'}.${periodIndex + 1}`
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
      height: (data.length * 60) + 80,
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
    },
    time: {
      timezone: 'America/Lima',
    },
    xAxis: [{
      type: "datetime",
      title: {
        text: "Tiempo",
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
      min: (() => {
        const today = new Date();
        if (shift === "dia") {
          return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 7, 0, 0).getTime();
        } else {
          if (0 <= today.getHours() && today.getHours() < 7) {
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 19, 0, 0).getTime();
          }
          return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 19, 0, 0).getTime();
        }
      })(),
      max: (() => {
        const today = new Date();
        if (shift === "dia") {
          return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 19, 0, 0).getTime();
        } else {
          if (0 <= today.getHours() && today.getHours() < 7) {
            return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 7, 0, 0).getTime();
          }
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          return new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 7, 0, 0).getTime();
        }
      })(),
    }, {
      type: "datetime",
      opposite: true,
      linkedTo: 0,
      title: {
        text: null,
      },
      labels: {
        style: {
          color: "#A6A6A6",
          fontSize: "0.8rem",
          fontWeight: "600",
        },
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
      labels: {
        align: "right",
        useHTML: true,
        formatter: function () {
          const labelText = this.value.toString().split("-").pop();
          return `<div style="
            background-color:#f0f0f0;
            padding:2px 6px;
            border-radius:6px;
            color:#6e6d7a;
            font-weight:700;
            text-align:left;
            display:inline-block;
            width:35px;
            height:35px;
            display:flex;
            flex-direction:column;
            align-items:center;
            line-height:1;
            justify-content:center;
            gap:1px;
          ">
          <span style="font-weight:700;font-size:0.4rem;">CAM</span>
          <span style="font-weight:800;font-size:0.9rem;">
          ${labelText}</span>
          </div>`;
        },
      },
    },
    tooltip: {
      useHTML: true,
      outside: true,
      positioner: function(labelWidth: number, labelHeight: number, point: any) {
        return {
          x: point.plotX + 50,
          y: point.plotY - 150
        };
      },
      formatter: function (this: any) {
        const point = this.point;
        const trip: BeaconUnitTrip = point.trip;
        const startTime = format(new Date(point.x), "HH:mm:ss");
        const endTime = format(new Date(point.x2), "HH:mm:ss");
        const duration = ((point.x2 - point.x) / 1000 / 60).toFixed(1);
        const remanejo = trip.remanejo ? "Sí" : "No";

        if (point.isFullTrip) {
          const routeText = point.hasDestination
            ? `${trip.startUbication} → ${trip.endUbication}`
            : `${trip.startUbication} ---`;

          let tooltipColor = "#6b7280";
          let tooltipColorAlpha = "#6b728015";

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
                  background: ${tooltipColorAlpha};
                  color: ${tooltipColor};
                  padding: 2px 8px;
                  border-radius: 6px;
                  font-weight: 600;
                ">
                  ${trip.shift.toUpperCase()}
                </span>
              </div>
              <div style="margin-bottom: 8px; line-height: 1.5;">
                <div><b style="color:#bbb;">Inicio:</b> <span>${startTime}</span></div>
                <div><b style="color:#bbb;">Fin:</b> <span>${endTime}</span></div>
                <div><b style="color:#bbb;">Duración:</b> <span>${formatDurationMinutes(duration)}</span></div>
                <div><b style="color:#bbb;">Remanejo:</b> <span>${remanejo}</span></div>
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
          const periodType = point.periodType;

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
              <b style="color:${point.color}">
                ${periodType.toUpperCase()}
              </b>
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
          formatter: function(this: any) {
            if (this.point.isBocamina) {
              const bocaminaIndex = this.point.specialPeriod?.bocaminaIndex || 0;
              const isEven = bocaminaIndex % 2 === 0;
              const topPosition = isEven ? "20px" : "-20px";
              
              return `
                <div style="
                  width: 25px;
                  height: 25px;
                  background-color: #FFFFFF;
                  border-radius: 50%;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  transform: translateX(-50%);
                  position: relative;
                  top: ${topPosition};
                  margin-bottom: 0px;
                  overflow: hidden;
                ">
                  <img src="/mine_icon_v2.png" style="width: 15px; height: 15px; object-fit: contain;" alt="Mine" />
                </div>
              `;
            } else if (this.point.isFullTrip && this.point.hasDestination && this.point.remanejo === false) {
              return `V${this.point.tripIndex}`;
            } else if(this.point.isFullTrip && this.point.hasDestination && this.point.remanejo === true) {
              return `R${this.point.remanejoIndex}`;
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
  }), [data, allSeriesData, shift]);

  const chartHeight = (data.length * 64) + 15 ;
  const rowHeight = 59;

  return (
    <div className="w-full flex gap-2">
      <div className="flex-1">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
      
      <div className="w-[350px] min-w-[350px] flex flex-col mt-[-40px]">
        <div className="bg-gray-100 border border-gray-200 rounded-t-lg px-3 py-1">
          <div className="grid grid-cols-4 gap-1 text-xs font-semibold text-gray-700">
            <div className="text-center">Viajes</div>
            <div className="text-center">Horas</div>
            <div className="text-center">Avg. Subterráneo</div>
            <div className="text-center">Avg. Superficie</div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 px-3 py-2 border-t-2 border-t-gray-400 h-[40px]">
          <div className="grid grid-cols-4 gap-1 text-xs font-bold text-gray-800">
            <div className="text-center text-black">{totals.totalTrips}</div>
            <div className="text-center text-black">{totals.totalHours.toFixed(1)}h</div>
            <div className="text-center text-black">
              {totals.avgSubterraneo >= 60 ? `${(totals.avgSubterraneo / 60).toFixed(1)}hrs` : `${totals.avgSubterraneo.toFixed(1)}min`}
            </div>
            <div className="text-center text-black">
              {totals.avgSuperficie >= 60 ? `${(totals.avgSuperficie / 60).toFixed(1)}hrs` : `${totals.avgSuperficie.toFixed(1)}min`}
            </div>
          </div>
        </div>

        <div className="relative" style={{ height: `${chartHeight}px` }}>
          {tableData.map((row, index) => (
            <div 
              key={row.unit}
              className="absolute w-full bg-white border-l border-r border-gray-200 px-3 flex items-center"
              style={{ 
                top: `${index * rowHeight}px`,
                height: `${rowHeight}px`,
                borderBottom: '1px solid #f3f4f6'
              }}
            >
              <div className="grid grid-cols-4 gap-1 text-xs w-full">
                <div className="font-bold text-black text-center">{row.totalTrips}</div>
                <div className="font-bold text-black text-center">{row.totalHours}h</div>
                <div className="font-bold text-black text-center">
                  {row.avgSubterraneo >= 60 ? `${(row.avgSubterraneo / 60).toFixed(1)}hrs` : `${row.avgSubterraneo.toFixed(1)}min`}
                </div>
                <div className="font-bold text-black text-center">
                  {row.avgSuperficie >= 60 ? `${(row.avgSuperficie / 60).toFixed(1)}hrs` : `${row.avgSuperficie.toFixed(1)}min`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default XRangeTripsChart;
