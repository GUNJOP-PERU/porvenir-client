import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import IconVehicle from "@/icons/Dashboard/IconVehicle";
import IconPlan from "@/icons/Dashboard/IconPlan";
import IconRadar from "@/icons/IconRadar";
import { SiRedmine } from "react-icons/si";
import {
  Building2,
  ChartArea,
  ChartBarStacked,
  ChartColumnStacked,
  ChartNoAxesCombined,
  CopyCheck,
  FileChartPie,
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
            name: "General",
            icon: <Building2 />,
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
                name: "Vehiculos",
                href: "/vehicle",
                active: pathname === "/vehicle",
              },
            ],
          },
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
          // {
          //   name: "Scoop",
          //   items: [
          //     { name: "Ciclo Scoop", href: "/cycleScoop", active: pathname === "/cycleScoop" },
          //     { name: "Actividades Scoop", href: "/activityScoop", active: pathname === "/activityScoop" },
          //   ],
          // },
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
        title: "Monitoreo",
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
      {
        title: "Análisis",
        items: [
          {
            name: "Reporte de extracción",
            href: "/",
            icon: <ChartColumnStacked />,
            active: pathname === "/" || pathname.startsWith("/historical")
          },
          {
            name: "Distribución de tiempo",
            href: "/dashboard/timeDistribution/realtime",
            icon: <ChartBarStacked />,
            active: pathname === "/dashboard/timeDistribution/realtime" || pathname === "/dashboard/timeDistribution/historical",
          },
          {
            name: "Reporte Semanal",
            href: "/dashboard/weekReport",
            icon: <FileChartPie />,
            active: pathname === "/dashboard/weekReport",
          },
          {
            name: "Reporte de Improductivos",
            href: "/dashboard/unproductiveReport",
            icon: <ChartNoAxesCombined />,
            active: pathname === "/dashboard/unproductiveReport",
          },
          {
            name: "Producción Truck",
            href: "/dashboard/productionTruck",
            icon: <ChartArea />,
            active: pathname === "/dashboard/productionTruck",
          },
          // {
          //   name: "Timeline Truck",
          //   href: "/dashboard/timelineTruck",
          //   icon: <IconTimeline />,
          //   active: pathname === "/dashboard/timelineTruck",
          // },
          // {
          //   name: "Pareto Truck",
          //   href: "/dashboard/paretoTruck",
          //   icon: <IconDash3 />,
          //   active: pathname === "/dashboard/paretoTruck",
          // },
          {
            name: "Producción Mensual",
            href: "/dashboard/productionMonth",
            icon: <ChartArea />,
            active: pathname === "/dashboard/productionMonth",
          },
          {
            name: "Utilización y Velocidad",
            href: "/dashboard/productionUV",
            icon: <ChartArea />,
            active: pathname === "/dashboard/productionUV",
          },
        ],
      },
      {
        title: "Beacon",
        items: [
          // {
          //   name: "Acumulado por hora",
          //   href: "dashboard/real-time-by-hour",
          //   icon: <ChartArea />,
          //   active: pathname === "/dashboard/real-time-by-hour",
          // },
          {
            name: "Acumulado por día",
            href: "/dashboard/real-time-by-day",
            icon: <ChartArea />,
            active: pathname === "/dashboard/real-time-by-day",
          },
          // {
          //   name: "Acumulado por mes",
          //   href: "/dashboard/real-time-by-month",
          //   icon: <ChartArea />,
          //   active: pathname === "/dashboard/real-time-by-month",
          // },  
          {
            name: "Detección de Viajes",
            href: "/dashboard/trip-count",
            icon: <ChartArea />,
            active: pathname === "/dashboard/trip-count",
          },
          {
            name: "Detección de Bocamina",
            href: "/dashboard/bocamina-detection",
            icon: <SiRedmine />,
            active: pathname === "/dashboard/bocamina-detection",
          },
          {
            name: "Tabla de Detección",
            href: "dashboard/beacon-detection-table",
            icon: <IconRadar />,
            active: pathname === "/dashboard/beacon-detection-table",
          },
          {
            name: "Tracking",
            href: "dashboard/tracking",
            icon: <IconRadar />,
            active: pathname === "/dashboard/tracking",
          },
        ],
      },
    ],
    [pathname]
  );

  return paths;
};
