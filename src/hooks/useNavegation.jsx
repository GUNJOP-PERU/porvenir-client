import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import IconPlan from "@/icons/Dashboard/IconPlan";
import IconRadar from "@/icons/IconRadar";
import { TbReportAnalytics } from "react-icons/tb";
import { FaTimeline } from "react-icons/fa6";
import {
  ChartArea,
  LandPlot,
  MapPin,
  Waypoints
} from "lucide-react";

export const useNavigation = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const paths = useMemo(
    () => [
      {
        title: "Gestión",
        items: [
          
          {
            name: "Ubicaciones",
            icon: <MapPin />,
            items: [
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
                name: "Plan Diario",
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
            icon: <ChartArea />,
            active: pathname === "/dashboard/beacon/underground-tracking",
          },
          {
            name: "Reporte por Turno",
            href: "/dashboard/beacon/detection-report-turn-rt",
            icon: <ChartArea />,
            active: pathname === "/dashboard/beacon/detection-report-turn-rt",
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
            name: "Utilización de flota",
            href: "/dashboard/beacon/production-status-rt",
            icon: <LandPlot />,
            active: pathname === "/dashboard/beacon/production-status-rt",
          },
          {
            name: "Seguimiento de Extracción",
            href: "/dashboard/beacon/seguimiento-de-extraccion",
            icon: <TbReportAnalytics />,
            active: pathname === "/dashboard/beacon/seguimiento-de-extraccion",
          }
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
            name: "Reporte por Dia Scoop",
            href: "dashboard/real-time-by-hour-scoop",
            icon: <ChartArea />,
            active: pathname === "/dashboard/real-time-by-hour-scoop",
          },
          {
            name: "Reporte por Semana",
            href: "/dashboard/real-time-by-day",
            icon: <ChartArea />,
            active: pathname === "/dashboard/real-time-by-day",
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
          }
        ],
      },
      {
        title: "Development",
        items: [
          {
            name: "Reporte de detección",
            href: "/dashboard/beacon/detection-report-rt",
            icon: <TbReportAnalytics />,
            active: pathname === "/dashboard/beacon/detection-report-rt",
          },
          {
            name: "Tracking Superficie",
            href: "/dashboard/development/tracking",
            icon: <IconRadar />,
            active: pathname === "/dashboard/development/tracking",
          },
          {
            name: "Tracking Subterraneo",
            href: "/dashboard/development/underground-tracking",
            icon: <ChartArea />,
            active: pathname === "/dashboard/development/underground-tracking",
          },
        ],
      },
    ],
    [pathname]
  );
  return paths;
};
