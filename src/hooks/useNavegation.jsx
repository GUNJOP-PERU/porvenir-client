import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import IconCompany from "@/icons/Dashboard/IconCompany";
import IconVehicle from "@/icons/Dashboard/IconVehicle";
import IconLabor from "@/icons/Dashboard/IconLabor";
import IconPlan from "@/icons/Dashboard/IconPlan";
import IconWork from "@/icons/Dashboard/IconWork";
import IconChecklist from "@/icons/Dashboard/IconChecklist";
import IconCycle from "@/icons/Dashboard/IconCycle";
import IconActivity from "@/icons/Dashboard/IconActivity";
import IconDash1 from "@/icons/Dashboard/IconDash1";
import IconDash3 from "@/icons/Dashboard/IconDash3";
import IconDash5 from "@/icons/Dashboard/IconDash5";
import IconDash6 from "@/icons/Dashboard/IconDash6";
import IconTimeline from "@/icons/Dashboard/IconTimeline";
import IconRadar from "@/icons/IconRadar";
import { ChartBarStacked, ChartColumnStacked, ChartNoAxesCombined, FileChartPie } from "lucide-react";

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
            icon: <IconCompany />,
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
            icon: <IconLabor />,
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
          //   icon: <IconActivity />,
          //   items: [
          //     { name: "Ciclo Scoop", href: "/cycleScoop", active: pathname === "/cycleScoop" },
          //     { name: "Actividades Scoop", href: "/activityScoop", active: pathname === "/activityScoop" },
          //   ],
          // },
          {
            name: "Conectividad",
            icon: <IconCycle />,
            items: [
              {
                name: "Beacon",
                href: "/beacon",
                icon: <IconActivity />,
                active: pathname === "/beacon",
              },
              {
                name: "WAP",
                href: "/wap",
                icon: <IconActivity />,
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
            icon: <IconWork />,
            active: pathname === "/workOrder",
          },
          {
            name: "Checklist",
            href: "/checklist",
            icon: <IconChecklist />,
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
            icon: <IconDash1 />,
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
            icon: <IconDash5 />,
            active: pathname === "/dashboard/productionMonth",
          },
          {
            name: "Utilización y Velocidad",
            href: "/dashboard/productionUV",
            icon: <IconDash6 />,
            active: pathname === "/dashboard/productionUV",
          },
        ],
      },
      {
        title: "Beacon",
        items: [
          {
            name: "Acumulado por hora",
            href: "dashboard/real-time-by-hour",
            icon: <IconDash6 />,
            active: pathname === "/dashboard/real-time-by-hour",
          },
          {
            name: "Acumulado por día",
            href: "/dashboard/real-time-by-day",
            icon: <IconDash6 />,
            active: pathname === "/dashboard/real-time-by-day",
          },
          {
            name: "Acumulado por mes",
            href: "/dashboard/real-time-by-month",
            icon: <IconDash6 />,
            active: pathname === "/dashboard/real-time-by-month",
          },  
          {
            name: "Viajes por Turno",
            href: "/dashboard/real-time-trip-count",
            icon: <IconDash6 />,
            active: pathname === "/dashboard/real-time-trip-count",
          },  
          {
            name: "Tabla de Detección",
            href: "dashboard/beacon-detection-table",
            icon: <IconRadar />,
            active: pathname === "/dashboard/beacon-detection-table",
          },
        ],
      },
    ],
    [pathname]
  );

  return paths;
};
