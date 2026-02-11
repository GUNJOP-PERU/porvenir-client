import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import IconPlan from "@/icons/Dashboard/IconPlan";
import { GiMineWagon } from "react-icons/gi";
import { TbReportAnalytics } from "react-icons/tb";
import { FaTimeline } from "react-icons/fa6";
import { useAuthStore } from "@/store/AuthStore";
import {
  ChartArea,
  ChartBarStacked,
  ChartColumnStacked,
  ChartNoAxesCombined,
  CopyCheck,
  Eye,
  FileChartPie,
  LandPlot,
  MapPin,
  Pickaxe,
  Radar,
  Settings,
  Waypoints,
} from "lucide-react";
import IconVehicle from "@/icons/Dashboard/IconVehicle";

export const useNavigation = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const userType = useAuthStore((state) => state.type);

  const paths = useMemo(() => {
    const basePaths = [
      {
        name: "Producción en Tiempo Real",
        icon: <Radar />,
        items: [
          {
            name: "Tracking Superficie",
            href: "/",
            icon: <Radar />,
            active: pathname === "/",
          },
          {
            name: "Tracking Subterraneo",
            href: "/dashboard/beacon/underground-tracking",
            icon: <GiMineWagon />,
            active: pathname === "/dashboard/beacon/underground-tracking",
          },
          {
            name: "Carguío y Transporte de Mineral por Turno",
            href: "/dashboard/beacon/detection-report-turn-mineral-rt",
            icon: <ChartArea />,
            active:
              pathname === "/dashboard/beacon/detection-report-turn-mineral-rt",
          },
          {
            name: "Carguío y Transporte de Estéril por Turno",
            href: "/dashboard/beacon/detection-report-turn-esteril-rt",
            icon: <ChartArea />,
            active:
              pathname === "/dashboard/beacon/detection-report-turn-esteril-rt",
          },
          {
            name: "Carguío Mineral",
            href: "/dashboard/beacon/detection-report-scoop-mineral-rt",
            icon: <ChartArea />,
            active:
              pathname ===
              "/dashboard/beacon/detection-report-scoop-mineral-rt",
          },
          {
            name: "Carguío Estéril",
            href: "/dashboard/beacon/detection-report-scoop-esteril-rt",
            icon: <ChartArea />,
            active:
              pathname ===
              "/dashboard/beacon/detection-report-scoop-esteril-rt",
          },
          {
            name: "Carguío Semanal Mineral",
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
            name: "Seguimiento de Transporte",
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
        name: "Producción Histórico",
        icon: <TbReportAnalytics />,
        items: [
          {
            name: "Detección de Bocaminas y Destinos",
            href: "dashboard/detection-report",
            icon: <TbReportAnalytics />,
            active: pathname === "/dashboard/detection-report",
          },
          {
            name: "Carguío Mineral por Turno",
            href: "dashboard/real-time-by-hour-truck",
            icon: <ChartArea />,
            active: pathname === "/dashboard/real-time-by-hour-truck",
          },
          {
            name: "Carguío Semanal Mineral",
            href: "/dashboard/real-time-by-day",
            icon: <ChartArea />,
            active: pathname === "/dashboard/real-time-by-day",
          },
          {
            name: "Carguío Mensual Mineral",
            href: "/dashboard/real-time-by-month",
            icon: <ChartArea />,
            active: pathname === "/dashboard/real-time-by-month",
          },
          {
            name: "Carguío por Turno Esteril",
            href: "dashboard/time-by-hour-scoop",
            icon: <ChartArea />,
            active: pathname === "/dashboard/time-by-hour-scoop",
          },
          {
            name: "Carguío por Semana Esteril",
            href: "/dashboard/real-time-by-day-scoop",
            icon: <ChartArea />,
            active: pathname === "/dashboard/real-time-by-day-scoop",
          },
          {
            name: "Carguío Mensual Esteril",
            href: "/dashboard/real-time-by-month-scoop",
            icon: <ChartArea />,
            active: pathname === "/dashboard/real-time-by-month-scoop",
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
            icon: <Radar />,
            active: pathname === "/dashboard/beacon-detection-table",
          },

          {
            name: "Linea de Tiempo por Turno / Histórico",
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
      {
        name: "Tablet / Análisis",
        icon: <TbReportAnalytics />,
        items: [
          {
            name: "Carguío y Transporte",
            href: "/tablet/productionExtract/realtime",
            icon: <ChartColumnStacked />,
            active:
              pathname === "/tablet/productionExtract/realtime" ||
              pathname === "/tablet/productionExtract/historical",
          },
          {
            name: "Distribución de tiempo",
            href: "/tablet/timeDistribution/realtime",
            icon: <ChartBarStacked />,
            active:
              pathname === "/tablet/timeDistribution/realtime" ||
              pathname === "/tablet/timeDistribution/historical",
          },
          {
            name: "Carguío Semanal",
            href: "/tablet/week-report",
            icon: <FileChartPie />,
            active: pathname === "/tablet/week-report",
          },
          {
            name: "Carguío de Improductivos",
            href: "/tablet/unproductive-report",
            icon: <ChartNoAxesCombined />,
            active: pathname === "/tablet/unproductive-report",
          },
          // {
          //   name: "Producción Mensual",
          //   href: "/tablet/productionMonth",
          //   icon: <ChartArea />,
          //   active: pathname === "/tablet/productionMonth",
          // },
          // {
          //   name: "Utilización y Velocidad",
          //   href: "/tablet/utilization",
          //   icon: <ChartArea />,
          //   active: pathname === "/tablet/utilization",
          // },
        ],
      },
    ];

    if (userType === "plan-editor") {
      return [
        {
          name: "Gestión General Undis",
          icon: <Settings />,
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
                  active:
                    pathname === "/planMonth" ||
                    pathname === "/newPlanMonth" ||
                    pathname === "/editPlanMonth",
                },
              ],
            },
          ],
        },
      ];
    }

    if (userType === "admin" || userType === "edit") {
      return [
        {
          name: "Gestión General Undis",
          icon: <Settings />,
          items: [
            {
              name: "General",
              icon: <MapPin />,
              items: [
                {
                  name: "Compañia",
                  href: "/company",
                  active: pathname === "/company",
                },
                {
                  name: "Usuarios",
                  href: "/users",
                  active: pathname === "/users",
                },
                {
                  name: "Equipos",
                  href: "/vehicles",
                  active: pathname === "/vehicles",
                },
              ],
            },
            {
              name: "Ubicaciones",
              icon: <MapPin />,
              items: [
                {
                  name: "Veta",
                  href: "/veta",
                  active: pathname === "/veta",
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
                  active:
                    pathname === "/planWeek" ||
                    pathname.startsWith("/plan/weekly"),
                },
                {
                  name: "Plan Mensual",
                  href: "/planMonth",
                  active:
                    pathname === "/planMonth" ||
                    pathname.startsWith("/plan/monthly"),
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
          name: "Monitoreo de Equipos",
          icon: <Eye />,
          items: [
            {
              name: "Trabajos planificados",
              href: "/workOrder",
              icon: <Pickaxe />,
              active: pathname === "/workOrder",
            },
            {
              name: "Checklist",
              href: "/checklist",
              icon: <CopyCheck />,
              active: pathname === "/checklist",
            },
            {
              name: "Truck",
              icon: <IconVehicle />,
              items: [
                {
                  name: "Ciclos Truck",
                  href: "/cycleTruck",
                  active: pathname === "/cycleTruck",
                },
                {
                  name: "Actividades Truck",
                  href: "/activityTruck",
                  active: pathname === "/activityTruck",
                },
                {
                  name: "Incidencias Truck",
                  href: "/incidence",
                  active: pathname === "/incidence",
                },
              ],
            },
          ],
        },
        ...basePaths,
      ];
    }

    return basePaths;
  }, [pathname, userType]);
  return paths;
};
