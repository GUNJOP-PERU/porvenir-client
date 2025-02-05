import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ProtectedRoute } from "./hooks/ProtectedRoute";
import HomePage from "./pages";
import PageError from "./pages/404";
import DayPage from "./pages/Day";
import EditPage from "./pages/Edit";
import Layout from "./pages/Layout";
import WeekPage from "./pages/Week";
import ParetoScoop from "./pages/dashboard/ParetoScoop";
import ParetoTruck from "./pages/dashboard/ParetoTruck";
import ProductionMonth from "./pages/dashboard/ProductionMonth";
import ProductionScoop from "./pages/dashboard/ProductionScoop";
import ProductionTruck from "./pages/dashboard/ProductionTruck";
import ProductionUV from "./pages/dashboard/ProductionUV";
import PageActivityScoop from "./pages/gestion/ActivityScoop";
import PageActivity from "./pages/gestion/ActivityTruck";
import Checklist from "./pages/gestion/Checklist";
import PageCompany from "./pages/gestion/Company";
import PageCycleScoop from "./pages/gestion/CycleScoop";
import PageCycle from "./pages/gestion/CycleTruck";
import HomeFrontLabor from "./pages/gestion/FrontLabor";
import { NewPlanMonth } from "./pages/gestion/NewPlanMonth";
import PlanDay from "./pages/gestion/PlanDay";
import PlanMonth from "./pages/gestion/PlanMonth";
import HomeUsers from "./pages/gestion/Users";
import HomeVehicles from "./pages/gestion/Vehicle";
import WorkerOrder from "./pages/gestion/WorkerOrder";
import PageLogin from "./pages/login/Login";
import { useAuthStore } from "./store/AuthStore";

function App() {
  const queryClient = new QueryClient();

  const isAuth = useAuthStore((state) => state.isAuth);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<PageLogin />} />
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<PageError />} />
            <Route element={<ProtectedRoute isAllowed={isAuth} />}>
              <Route path="/edit/:id" element={<EditPage />} />
              <Route path="/week" element={<WeekPage />} />
              <Route path="/day" element={<DayPage />} />
              <Route path="/users" element={<HomeUsers />} />
              <Route path="/frontLabor" element={<HomeFrontLabor />} />
              <Route path="/vehicle" element={<HomeVehicles />} />
              <Route path="/workOrder" element={<WorkerOrder />} />
              <Route path="/checklist" element={<Checklist />} />
              <Route path="/planDay" element={<PlanDay />} />
              {/* <Route path="/planWeek" element={<PlanWeek />} /> */}
              <Route path="/planMonth" element={<PlanMonth />} />
              <Route path="/newPlanMonth" element={<NewPlanMonth />} />
              <Route path="/company" element={<PageCompany />} />
              <Route path="/cycleTruck" element={<PageCycle />} />
              <Route path="/cycleScoop" element={<PageCycleScoop />} />
              <Route path="/activityTruck" element={<PageActivity />} />
              <Route path="/activityScoop" element={<PageActivityScoop />} />

              //Dashboard routes
              <Route path="/dashboard/productionScoop" element={<ProductionScoop />} />
              <Route path="/dashboard/productionTruck" element={<ProductionTruck />} />
              <Route path="/dashboard/paretoTruck" element={<ParetoTruck />} />
              <Route path="/dashboard/paretoScoop" element={<ParetoScoop />} />
              <Route path="/dashboard/productionMonth" element={<ProductionMonth />} />
              <Route path="/dashboard/productionUV" element={<ProductionUV />} />
            </Route>
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

{
  /* <main className="h-screen w-screen z-50 flex flex-col bg-white overflow-hidden">
</main> */
}
