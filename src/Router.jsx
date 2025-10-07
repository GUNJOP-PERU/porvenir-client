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
import HomeUsers from "./pages/management/Users";
import HomeVehicles from "./pages/management/Vehicles";

import Configuration from "./pages/Configuration";
// import ParetoTruck from "./pages/dashboard/ParetoTruck";
import HistoricalExtract from "./pages/dashboard/ProductionExtract/HistoricalExtract";
import ProductionLayout from "./pages/dashboard/ProductionExtract/ProductionLayout";
import RealTimeExtract from "./pages/dashboard/ProductionExtract/RealTimeExtract";
import ProductionMonth from "./pages/dashboard/ProductionMonth";
import ProductionTruck from "./pages/dashboard/ProductionTruck";
import TimeDistribution from "./pages/dashboard/TimeDistribution/TimeDistribution";
import TimeDistributionHistorical from "./pages/dashboard/TimeDistribution/TimeDistributionHistorical";
// import TimelineTruck from "./pages/dashboard/TimelineTruck";
import UnproductiveReport from "./pages/dashboard/UnproductiveReport";
import Utilization from "./pages/dashboard/Utilization";
import PageBeacon from "./pages/management/Beacon";
import PageCompany from "./pages/management/Company";
import PageDestiny from "./pages/management/Destiny";
import { NewPlanMonth } from "./pages/management/NewPlanMonth";
import PlanDay from "./pages/management/PlanDay";
import PlanMonth from "./pages/management/PlanMonth";
import PlanWeek from "./pages/management/PlanWeek";
import PageUbications from "./pages/management/Ubication";
import PageWap from "./pages/management/Wap";
import PageActivity from "./pages/monitoring/ActivityTruck";
import Checklist from "./pages/monitoring/Checklist";
import PageCycleTruck from "./pages/monitoring/CycleTruck";
import Incidence from "./pages/monitoring/Incidences";
import WorkerOrders from "./pages/monitoring/WorkerOrders";
import WeekReport from "./pages/dashboard/WeekReport";
// Beacon Real Time
import DetectionReportRT from "./pages/beaconRT/DetectionReport";
import RealTimeByDayRT from "./pages/beaconRT/RealTimeByWeek";
import RealTimeByHourRT from "./pages/beaconRT/RealTimeByTurn";
import TrackingRT from "./pages/beaconRT/Tracking";
// Beacon
import DetectionReport from "./pages/beacon/DetectionReport";
import BeaconDetectionTable from "./pages/beacon/BeaconDetectionTable";
import RealTimeByDay from "./pages/beacon/RealTimeByWeek";
import RealTimeByHour from "./pages/beacon/RealTimeByDayTruck";
import RealTimeByHourScoop from "./pages/beacon//RealTimeByDayScoop";
import RealTimeByMonth from "./pages/beacon/RealTimeByMonth";
import RealTimeTripsCount from "./pages/beacon/RealTimeTripsCount";
import Tracking from "./pages/beacon/Tracking";
import FleetStatus from "./pages/beacon/FleetStatus";
import TripsDescriptionRT from "./pages/beaconRT/TripsDescriptions";
import TripsDescription from "./pages/beacon/TripsDescriptions";

const protectedRoutes = [
  //Gestion
  // { path: "users", element: <HomeUsers /> },
  // { path: "vehicle", element: <HomeVehicles /> },
  // { path: "workOrder", element: <WorkerOrders /> },
  // { path: "checklist", element: <Checklist /> },
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
  { path: "dashboard/weekReport", element: <WeekReport /> },
  { path: "dashboard/unproductiveReport", element: <UnproductiveReport /> },
  { path: "dashboard/productionMonth", element: <ProductionMonth /> },
  { path: "dashboard/productionUV", element: <Utilization /> },
  { path: "dashboard/productionTruck", element: <ProductionTruck /> },

  // Beacon RT
  { path: "dashboard/beacon/detection-report-rt", element: <DetectionReportRT /> },
  { path: "dashboard/beacon/detection-report-turn-rt", element: <RealTimeByHourRT /> },
  { path: "dashboard/beacon/detection-report-week-rt", element: <RealTimeByDayRT /> },
  { path: "dashboard/beacon/trips-description-rt", element: <TripsDescriptionRT /> },

  //Dashboard-Beacon
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

