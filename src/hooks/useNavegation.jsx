import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import IconVehicle from "@/icons/Dashboard/IconVehicle";
import IconPlan from "@/icons/Dashboard/IconPlan";
import IconRadar from "@/icons/IconRadar";
import { SiRedmine } from "react-icons/si";
import { TbReportAnalytics } from "react-icons/tb";
import { FaTimeline } from "react-icons/fa6";
import {
  Building2,
  ChartArea,
  ChartBarStacked,
  ChartColumnStacked,
  ChartNoAxesCombined,
  CopyCheck,
  FileChartPie,
  LandPlot,
  MapPin,
  Pickaxe,
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
            name: "Tracking",
            href: "/",
            icon: <IconRadar />,
            active: pathname === "/",
          },
          {
            name: "Seguimiento Subterraneo",
            href: "/dashboard/beacon/underground-tracking",
            icon: <ChartArea />,
            active: pathname === "/dashboard/beacon/underground-tracking",
          },
          {
            name: "Reporte de detección",
            href: "/dashboard/beacon/detection-report-rt",
            icon: <TbReportAnalytics />,
            active: pathname === "/dashboard/beacon/detection-report-rt",
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
            name: "Estado de la flota",
            href: "dashboard/fleet-status",
            icon: <LandPlot />,
            active: pathname === "/dashboard/fleet-status",
          },
          {
            name: "Linea de Tiempo",
            href: "/dashboard/beacon/trips-description",
            icon: <FaTimeline />,
            active: pathname === "/dashboard/beacon/trips-description",
          }
        ],
      },
    ],
    [pathname]
  );
  return paths;
};
