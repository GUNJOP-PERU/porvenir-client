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
import ParetoTruck from "./pages/dashboard/ParetoTruck";
import HistoricalExtract from "./pages/dashboard/ProductionExtract/HistoricalExtract";
import ProductionLayout from "./pages/dashboard/ProductionExtract/ProductionLayout";
import RealTimeExtract from "./pages/dashboard/ProductionExtract/RealTimeExtract";
import ProductionMonth from "./pages/dashboard/ProductionMonth";
import ProductionTruck from "./pages/dashboard/ProductionTruck";
import TimeDistribution from "./pages/dashboard/TimeDistribution/TimeDistribution";
import TimeDistributionHistorical from "./pages/dashboard/TimeDistribution/TimeDistributionHistorical";
import TimelineTruck from "./pages/dashboard/TimelineTruck";
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
// Beacon
import DetectionReport from "./pages/beacon/DetectionReport";
import BeaconTrip from "./pages/beacon/BeaconTrip";
import BeaconDetectionTable from "./pages/beacon/BeaconDetectionTable";
import RealTimeByDay from "./pages/beacon/RealTimeByWeek";
import RealTimeByHour from "./pages/beacon/RealTimeByDayTruck";
import RealTimeByHourScoop from "./pages/beacon//RealTimeByDayScoop";
import RealTimeByMonth from "./pages/beacon/RealTimeByMonth";
import BocaminaDetection from "./pages/beacon/BocaminaDetection";
import RealTimeTripsCount from "./pages/beacon/RealTimeTripsCount";
import Tracking from "./pages/beacon/Tracking";
import FleetStatus from "./pages/beacon/FleetStatus";

const protectedRoutes = [
  //Gestion
  { path: "users", element: <HomeUsers /> },
  { path: "labor", element: <HomeLabor /> },
  { path: "vehicle", element: <HomeVehicles /> },
  { path: "workOrder", element: <WorkerOrders /> },
  { path: "checklist", element: <Checklist /> },
  { path: "planDay", element: <PlanDay /> },
  { path: "planMonth", element: <PlanMonth /> },
  { path: "planWeek", element: <PlanWeek /> },
  { path: "newPlanMonth", element: <NewPlanMonth /> },
  { path: "company", element: <PageCompany /> },
  { path: "cycleTruck", element: <PageCycleTruck /> },
  { path: "activityTruck", element: <PageActivity /> },
  { path: "destiny", element: <PageDestiny /> },
  { path: "incidence", element: <Incidence /> },
  { path: "ubications", element: <PageUbications /> },
  { path: "beacon", element: <PageBeacon /> },
  { path: "wap", element: <PageWap /> },

  //Dashboard
  // { path: "dashboard/timelineTruck", element: <TimelineTruck /> },
  // { path: "dashboard/paretoTruck", element: <ParetoTruck /> },
  {
    path: "/",
    element: <ProductionLayout />,
    handle: {
      tabs: [
        { to: "", label: "Tiempo Real" },
        { to: "historical", label: "Histórico" },
      ],
    },
    children: [
      { index: true, element: <RealTimeExtract /> },
      { path: "historical", element: <HistoricalExtract /> },
    ],
  },
  {
    path: "dashboard/timeDistribution",
    element: <ProductionLayout />,
    handle: {
      tabs: [
        { to: "realtime", label: "Tiempo Real" },
        { to: "historical", label: "Histórico" },
      ],
    },
    children: [
      { index: true, element: <Navigate to="realtime" replace /> },
      { path: "realtime", element: <TimeDistribution /> },
      { path: "historical", element: <TimeDistributionHistorical /> },
    ],
  },
  { path: "dashboard/weekReport", element: <WeekReport /> },
  { path: "dashboard/unproductiveReport", element: <UnproductiveReport /> },
  { path: "dashboard/productionMonth", element: <ProductionMonth /> },
  { path: "dashboard/productionUV", element: <Utilization /> },
  { path: "dashboard/productionTruck", element: <ProductionTruck /> },

  //Dashboard-Beacon
  { path: "dashboard/detection-report", element: <DetectionReport /> },
  { path: "dashboard/beacon-trip-v2", element: <BeaconTrip /> },
  { path: "dashboard/real-time-by-hour-truck", element: <RealTimeByHour /> },
  { path: "dashboard/real-time-by-hour-scoop", element: <RealTimeByHourScoop /> },
  { path: "dashboard/real-time-by-day", element: <RealTimeByDay /> },
  { path: "dashboard/real-time-by-month", element: <RealTimeByMonth /> },
  { path: "dashboard/trip-count", element: <RealTimeTripsCount /> },
  { path: "dashboard/beacon-detection-table", element: <BeaconDetectionTable/>,},
  { path: "dashboard/bocamina-detection", element: <BocaminaDetection /> },
  { path: "dashboard/tracking", element: <Tracking /> },
  { path: "dashboard/fleet-status", element: <FleetStatus /> },

  //Configuración
  { path: "configuration", element: <Configuration /> },
];

export default function Router() {
  const isAuth = useAuthStore((state) => state.isAuth);

  const protectedChildren = protectedRoutes.map(({ path, element }) => ({
    path,
    element,
  }));

  protectedChildren.push({
    index: true,
    element: <Navigate to="/" replace />, 
  });

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
            {
              index: true,
              element: <Navigate to="/" replace />,
            },
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
