import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import IconPlan from "@/icons/Dashboard/IconPlan";
import IconRadar from "@/icons/IconRadar";
import { GiMineWagon } from "react-icons/gi";
import { TbReportAnalytics } from "react-icons/tb";
import { FaTimeline } from "react-icons/fa6";
import { useAuthStore } from "@/store/AuthStore";
import {
  ChartArea,
  LandPlot,
  MapPin,
  Waypoints
} from "lucide-react";

export const useNavigation = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const userType = useAuthStore((state) => state.type);

  const paths = useMemo(() => {
    const basePaths = [
      {
        title: "Beacon Tiempo Real",
        items: [
          {
            name: "Tracking Superficie",
            href: "/",  
            icon: <IconRadar />,
            active: pathname === "/",
          },
          {
            name: "Tracking Subterraneo",
            href: "/dashboard/beacon/underground-tracking",
            icon: <GiMineWagon />,
            active: pathname === "/dashboard/beacon/underground-tracking",
          },
          {
            name: "Reporte por Turno Mineral",
            href: "/dashboard/beacon/detection-report-turn-mineral-rt",
            icon: <ChartArea />,
            active: pathname === "/dashboard/beacon/detection-report-turn-mineral-rt",
          },
          {
            name: "Reporte por Semana",
            href: "/dashboard/beacon/detection-report-week-rt",
            icon: <ChartArea />,
            active: pathname === "/dashboard/beacon/detection-report-week-rt",
          },
          {
            name: "Linea de Tiempo por Turno",
            href: "/dashboard/beacon/trips-description-rt",
            icon: <FaTimeline />,
            active: pathname === "/dashboard/beacon/trips-description-rt",
          },
          {
            name: "Disponibilidad de la flota",
            href: "dashboard/fleet-status",
            icon: <LandPlot />,
            active: pathname === "/dashboard/fleet-status",
          },
          {
            name: "Registro de Ingreso y Salida",
            href: "/dashboard/beacon/utilizacion-de-flota",
            icon: <LandPlot />,
            active: pathname === "/dashboard/beacon/utilizacion-de-flota",
          },
          {
            name: "Seguimiento de Extracción",
            href: "/dashboard/beacon/seguimiento-de-extraccion",
            icon: <TbReportAnalytics />,
            active: pathname === "/dashboard/beacon/seguimiento-de-extraccion",
          },
          {
            name: "Labor/Plan diario",
            href: "/dashboard/beacon/update-truck-plan-day",
            icon: <TbReportAnalytics />,
            active: pathname === "/dashboard/beacon/update-truck-plan-day",
          },
          {
            name: "Disponibilidad Hora a Hora",
            href: "/dashboard/beacon/availability",
            icon: <TbReportAnalytics />,
            active: pathname === "/dashboard/beacon/availability",
          },
        ],
      },
      {
        title: "Beacon Histórico",
        items: [
          {
            name: "Reporte de detección",
            href: "dashboard/detection-report",
            icon: <TbReportAnalytics />,
            active: pathname === "/dashboard/detection-report",
          },
          {
            name: "Reporte por Dia Camion",
            href: "dashboard/real-time-by-hour-truck",
            icon: <ChartArea />,
            active: pathname === "/dashboard/real-time-by-hour-truck",
          },
          {
            name: "Reporte por Semana",
            href: "/dashboard/real-time-by-day",
            icon: <ChartArea />,
            active: pathname === "/dashboard/real-time-by-day",
          },
          {
            name: "Reporte por Mes",
            href: "/dashboard/real-time-by-month",
            icon: <ChartArea />,
            active: pathname === "/dashboard/real-time-by-month",
          },
          {
            name: "Detección de Viajes",
            href: "/dashboard/trip-count",
            icon: <ChartArea />,
            active: pathname === "/dashboard/trip-count",
          },
          {
            name: "Tabla de Detección",
            href: "dashboard/beacon-detection-table",
            icon: <IconRadar />,
            active: pathname === "/dashboard/beacon-detection-table",
          },
          
          {
            name: "Linea de Tiempo",
            href: "/dashboard/beacon/trips-description",
            icon: <FaTimeline />,
            active: pathname === "/dashboard/beacon/trips-description",
          },

          {
            name: "Viajes Realizados",
            href: "/dashboard/beacon/trips",
            icon: <FaTimeline />,
            active: pathname === "/dashboard/beacon/trips",
          },
          {
            name: "Historial de Cambios",
            href: "/dashboard/change-history",
            icon: <FaTimeline />,
            active: pathname === "/dashboard/change-history",
          },
        ],
      },
      // {
      //   title: "Development",
      //   items: [
      //     {
      //       name: "Linea de Tiempo de Detección",
      //       href: "/dashboard/development/timeline-detection-report",
      //       icon: <TbReportAnalytics />,
      //       active: pathname === "/dashboard/development/timeline-detection-report",
      //     },
      //     {
      //       name: "Tracking Superficie",
      //       href: "/dashboard/development/tracking",
      //       icon: <IconRadar />,
      //       active: pathname === "/dashboard/development/tracking",
      //     },
      //     {
      //       name: "Tracking Subterraneo",
      //       href: "/dashboard/development/underground-tracking",
      //       icon: <ChartArea />,
      //       active: pathname === "/dashboard/development/underground-tracking",
      //     },
      //   ],
      // },
    ];

    if(userType === "plan-editor") {
      return [
        {
          title: "Gestión",
          items: [
            {
              name: "Planes",
              icon: <IconPlan />,
              items: [
                {
                  name: "Plan Turno",
                  href: "/planDay",
                  active: pathname === "/planDay",
                },
                {
                  name: "Plan Semanal",
                  href: "/planWeek",
                  active: pathname === "/planWeek",
                },
                {
                  name: "Plan Mensual",
                  href: "/planMonth",
                  active: pathname === "/planMonth",
                },
              ],
            }
          ],
        },
      ];
    }

    if (userType === "admin" || userType === "edit") {
      return [
        {
          title: "Gestión",
          items: [
            {
              name: "Ubicaciones",
              icon: <MapPin />,
              items: [
                {
                  name: "Usuarios",
                  href: "/users",
                  active: pathname === "/users",
                },
                {
                  name: "Vehiculos",
                  href: "/vehicles",
                  active: pathname === "/vehicles",
                },
                {
                  name: "Origen / Labor",
                  href: "/labor",
                  active: pathname === "/labor",
                },
                {
                  name: "Destinos",
                  href: "/destiny",
                  active: pathname === "/destiny",
                },
                {
                  name: "Bocaminas",
                  href: "/ubications",
                  active: pathname === "/ubications",
                },
              ],
            },
            {
              name: "Planes",
              icon: <IconPlan />,
              items: [
                {
                  name: "Plan Turno",
                  href: "/planDay",
                  active: pathname === "/planDay",
                },
                {
                  name: "Plan Semanal",
                  href: "/planWeek",
                  active: pathname === "/planWeek",
                },
                {
                  name: "Plan Mensual",
                  href: "/planMonth",
                  active: pathname === "/planMonth",
                },
              ],
            },
            {
              name: "Conectividad",
              icon: <Waypoints />,
              items: [
                {
                  name: "Beacon",
                  href: "/beacon",
                  active: pathname === "/beacon",
                },
                {
                  name: "WAP",
                  href: "/wap",
                  active: pathname === "/wap",
                },
              ],
            },
          ],
        },
        ...basePaths
      ];
    }

    return basePaths;
  }, [pathname, userType]);
  return paths;
};
