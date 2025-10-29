import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { ProtectedRoute } from "./hooks/useProtectedRoute";
import { useAuthStore } from "./store/AuthStore";
import PageError from "./pages/404";
import Layout from "./pages/Layout";
import Login from "./pages/login/Login";
import HomeLabor from "./pages/management/Labor";
import Configuration from "./pages/Configuration";
// import ParetoTruck from "./pages/dashboard/ParetoTruck";
// import ProductionMonth from "./pages/dashboard/ProductionMonth";
// import ProductionTruck from "./pages/dashboard/ProductionTruck";
// import TimelineTruck from "./pages/dashboard/TimelineTruck";
// import UnproductiveReport from "./pages/dashboard/UnproductiveReport";
// import Utilization from "./pages/dashboard/Utilization";
// import HistoricalExtract from "./pages/dashboard/ProductionExtract/HistoricalExtract";
// import ProductionLayout from "./pages/dashboard/ProductionExtract/ProductionLayout";
// import RealTimeExtract from "./pages/dashboard/ProductionExtract/RealTimeExtract";
// import TimeDistribution from "./pages/dashboard/TimeDistribution/TimeDistribution";
// import TimeDistributionHistorical from "./pages/dashboard/TimeDistribution/TimeDistributionHistorical";
import PageBeacon from "./pages/management/Beacon";
import PageDestiny from "./pages/management/Destiny";
import { NewPlanMonth } from "./pages/management/NewPlanMonth";
import PlanDay from "./pages/management/PlanDay";
import PlanMonth from "./pages/management/PlanMonth";
import PlanWeek from "./pages/management/PlanWeek";
import PageUbications from "./pages/management/Ubication";
import PageWap from "./pages/management/Wap";
import HomeUsers from "./pages/management/Users";
// import HomeVehicles from "./pages/management/Vehicles";
// import HistoricalExtract from "./pages/dashboard/ProductionExtract/HistoricalExtract";
// import ProductionLayout from "./pages/dashboard/ProductionExtract/ProductionLayout";
// import RealTimeExtract from "./pages/dashboard/ProductionExtract/RealTimeExtract";
// import TimeDistribution from "./pages/dashboard/TimeDistribution/TimeDistribution";
// import TimeDistributionHistorical from "./pages/dashboard/TimeDistribution/TimeDistributionHistorical";
// import PageCompany from "./pages/management/Company";
// import PageActivity from "./pages/monitoring/ActivityTruck";
// import Checklist from "./pages/monitoring/Checklist";
// import PageCycleTruck from "./pages/monitoring/CycleTruck";
// import Incidence from "./pages/monitoring/Incidences";
// import WorkerOrders from "./pages/monitoring/WorkerOrders";
// import Tracking from "./pages/beacon/Tracking";
// import WeekReport from "./pages/dashboard/WeekReport";

// Beacon Real Time
import RealTimeByDayRT from "./pages/beaconRT/RealTimeByWeekMineral";
import RealTimeByHourMineralRT from "./pages/beaconRT/RealTimeByTurnMineral";
import RealTimeByMonthRT from "./pages/beaconRT/RealTimeByMonth";
import TrackingRT from "./pages/beaconRT/Tracking";
import UtilizacionDeFlota from "./pages/beaconRT/UtilizacionDeFlota";
import UndergroundTracking from "./pages/beaconRT/UndergroundTracking";
import SeguimientoDeExtraccion from "./pages/beaconRT/SeguimientoDeExtraccion";
// Beacon
import DetectionReport from "./pages/beacon/DetectionReport";
import BeaconDetectionTable from "./pages/beacon/BeaconDetectionTable";
import RealTimeByDay from "./pages/beacon/ReportByWeek";
import RealTimeByHour from "./pages/beacon/ReportByTurnTruck";
import RealTimeByHourScoop from "./pages/beacon//RealTimeByDayScoop";
import RealTimeByMonth from "./pages/beacon/RealTimeByMonth";
import RealTimeTripsCount from "./pages/beacon/DetectionTrip";
import FleetStatus from "./pages/beacon/FleetStatus";
import TripsDescriptionRT from "./pages/beaconRT/TripsDescriptions";
import TripsDescription from "./pages/beacon/TripsDescriptions";
// Development
import TimelineDetectionReport from "./pages/development/TimelineDetectionReport";
import TrackingDevelopment from "./pages/development/Tracking";
import UndergroundTrackingDevelopment from "./pages/development/UndergroundTracking";
import UpdateTruckPlanDay from "./pages/beaconRT/UpdateTruckPlanDay";

const protectedRoutes = [
  { path: "users", element: <HomeUsers /> },
  { path: "planDay", element: <PlanDay /> },
  { path: "planMonth", element: <PlanMonth /> },
  { path: "planWeek", element: <PlanWeek /> },
  { path: "newPlanMonth", element: <NewPlanMonth /> },
  // { path: "company", element: <PageCompany /> },
  // { path: "cycleTruck", element: <PageCycleTruck /> },
  // { path: "activityTruck", element: <PageActivity /> },
  // { path: "incidence", element: <Incidence /> },
  { path: "labor", element: <HomeLabor /> },
  { path: "destiny", element: <PageDestiny /> },
  { path: "ubications", element: <PageUbications /> },
  { path: "beacon", element: <PageBeacon /> },
  { path: "wap", element: <PageWap /> },

  // Beacon RT
  { path: "dashboard/beacon/detection-report-turn-mineral-rt", element: <RealTimeByHourMineralRT /> },
  { path: "dashboard/beacon/detection-report-week-rt", element: <RealTimeByDayRT /> },
  { path: "dashboard/beacon/detection-report-month-rt", element: <RealTimeByMonthRT /> },
  { path: "dashboard/beacon/trips-description-rt", element: <TripsDescriptionRT /> },
  { path: "dashboard/beacon/underground-tracking", element: <UndergroundTracking /> },
  { path: "dashboard/beacon/seguimiento-de-extraccion", element: <SeguimientoDeExtraccion /> },
  { path: "dashboard/beacon/utilizacion-de-flota", element: <UtilizacionDeFlota /> },
   { path: "dashboard/beacon/update-truck-plan-day", element: <UpdateTruckPlanDay /> },
  // Historico Beacon
  { path: "/", element: <TrackingRT /> },
  { path: "dashboard/detection-report", element: <DetectionReport /> },
  { path: "dashboard/real-time-by-hour-truck", element: <RealTimeByHour /> },
  { path: "dashboard/real-time-by-hour-scoop", element: <RealTimeByHourScoop /> },
  { path: "dashboard/real-time-by-day", element: <RealTimeByDay /> },
  { path: "dashboard/real-time-by-month", element: <RealTimeByMonth /> },
  { path: "dashboard/trip-count", element: <RealTimeTripsCount /> },
  { path: "dashboard/beacon-detection-table", element: <BeaconDetectionTable /> },
  { path: "dashboard/fleet-status", element: <FleetStatus /> },
  { path: "dashboard/", element: <FleetStatus /> },
  { path: "dashboard/beacon/trips-description", element: <TripsDescription /> },
  // Development
  { path: "dashboard/development/tracking", element: <TrackingDevelopment /> },
  { path: "dashboard/development/timeline-detection-report", element: <TimelineDetectionReport /> },
  { path: "dashboard/development/underground-tracking",element: <UndergroundTrackingDevelopment />},
 

  //Configuración
  { path: "configuration", element: <Configuration /> },
];

export default function Router() {
  const isAuth = useAuthStore((state) => state.isAuth);

  const router = createBrowserRouter([
    {
      path: "/login",
      element: isAuth ? <Navigate to="/" replace /> : <Login />,
    },
    {
      element: <ProtectedRoute isAllowed={isAuth} />,
      children: [
        {
          element: <Layout />,
          children: [
            ...protectedRoutes,
          ],
        },
      ],
    },
    {
      path: "*",
      element: <PageError />,
    },
  ]);

  return <RouterProvider router={router} />;
}

  // { path: "dashboard/weekReport", element: <WeekReport /> },
  // { path: "dashboard/unproductiveReport", element: <UnproductiveReport /> },
  // { path: "dashboard/productionMonth", element: <ProductionMonth /> },
  // { path: "dashboard/productionUV", element: <Utilization /> },
  // { path: "dashboard/productionTruck", element: <ProductionTruck /> },
  // { path: "newPlanMonth", element: <NewPlanMonth /> },
  // { path: "company", element: <PageCompany /> },
  // { path: "cycleTruck", element: <PageCycleTruck /> },
  // { path: "activityTruck", element: <PageActivity /> },
  // { path: "incidence", element: <Incidence /> },

  //Gestion
  // { path: "users", element: <HomeUsers /> },
  // { path: "vehicle", element: <HomeVehicles /> },
  // { path: "workOrder", element: <WorkerOrders /> },
  // { path: "checklist", element: <Checklist /> },
  //Dashboard
  // { path: "dashboard/timelineTruck", element: <TimelineTruck /> },
  // { path: "dashboard/paretoTruck", element: <ParetoTruck /> },
  // {
  //   path: "/",
  //   element: <ProductionLayout />,
  //   handle: {
  //     tabs: [
  //       { to: "", label: "Tiempo Real" },
  //       { to: "historical", label: "Histórico" },
  //     ],
  //   },
  //   children: [
  //     { index: true, element: <RealTimeExtract /> },
  //     { path: "historical", element: <HistoricalExtract /> },
  //   ],
  // },
  // {
  //   path: "dashboard/timeDistribution",
  //   element: <ProductionLayout />,
  //   handle: {
  //     tabs: [
  //       { to: "realtime", label: "Tiempo Real" },
  //       { to: "historical", label: "Histórico" },
  //     ],
  //   },
  //   children: [
  //     { index: true, element: <Navigate to="realtime" replace /> },
  //     { path: "realtime", element: <TimeDistribution /> },
  //     { path: "historical", element: <TimeDistributionHistorical /> },
  //   ],
  // },