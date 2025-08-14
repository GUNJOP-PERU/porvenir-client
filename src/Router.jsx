import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "./store/AuthStore";
import { ProtectedRoute } from "./hooks/useProtectedRoute";

import Layout from "./pages/Layout";
import PageError from "./pages/404";
import Login from "./pages/login/Login";

import HomeUsers from "./pages/gestion/Users";
import HomeVehicles from "./pages/gestion/Vehicles";
import HomeLabor from "./pages/gestion/Labor";

import ProductionMonth from "./pages/dashboard/ProductionMonth";
import ProductionTruck from "./pages/dashboard/ProductionTruck";
import ProductionScoop from "./pages/dashboard/ProductionScoop";
import TimelineScoop from "./pages/dashboard/TimelineScoop";
import TimelineTruck from "./pages/dashboard/TimelineTruck";
import ParetoTruck from "./pages/dashboard/ParetoTruck";
import ParetoScoop from "./pages/dashboard/ParetoScoop";
import Utilization from "./pages/dashboard/Utilization";
import Checklist from "./pages/gestion/Checklist";
import PlanMonth from "./pages/gestion/PlanMonth";
import PlanDay from "./pages/gestion/PlanDay";
import { NewPlanMonth } from "./pages/gestion/NewPlanMonth";
import PageCompany from "./pages/gestion/Company";
import PageCycleScoop from "./pages/gestion/CycleScoop";
import PageCycleTruck from "./pages/gestion/CycleTruck";
import PageActivityScoop from "./pages/gestion/ActivityScoop";
import PageActivity from "./pages/gestion/ActivityTruck";
import Configuration from "./pages/Configuration";
import WorkerOrders from "./pages/gestion/WorkerOrders";
import PageDestiny from "./pages/gestion/Destiny";
import Incidence from "./pages/gestion/Incidences";
import PlanWeek from "./pages/gestion/PlanWeek";
import PageUbications from "./pages/gestion/Ubication";
import PageBeacon from "./pages/gestion/Beacon";
import PageWap from "./pages/gestion/Wap";
import RealTimeByHour from "./pages/dashboard/RealTimeByHour";
import RealTimeByDay from "./pages/dashboard/RealTimeByDay";
import RealTimeTripsCount from "./pages/dashboard/RealTimeTripsCount";

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
  { path: "cycleScoop", element: <PageCycleScoop /> },
  { path: "activityTruck", element: <PageActivity /> },
  { path: "activityScoop", element: <PageActivityScoop /> },
  { path: "destiny", element: <PageDestiny /> },
  { path: "incidence", element: <Incidence /> },
  { path: "ubications", element: <PageUbications /> },
  { path: "beacon", element: <PageBeacon /> },
  { path: "wap", element: <PageWap /> },

  //Dashboard
  { path: "dashboard/productionScoop", element: <ProductionScoop /> },
  { path: "dashboard/timelineScoop", element: <TimelineScoop /> },
  { path: "dashboard/timelineTruck", element: <TimelineTruck /> },
  { path: "dashboard/paretoTruck", element: <ParetoTruck /> },
  { path: "dashboard/paretoScoop", element: <ParetoScoop /> },
  { path: "dashboard/productionMonth", element: <ProductionMonth /> },
  { path: "dashboard/productionUV", element: <Utilization /> },
  { path: "dashboard/real-time-by-hour", element: <RealTimeByHour /> },
  { path: "dashboard/real-time-by-day", element: <RealTimeByDay /> },
  { path: "dashboard/real-time-trip-count", element: <RealTimeTripsCount /> },

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
    element: <ProductionTruck />,
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
          children: protectedChildren,
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
