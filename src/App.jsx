import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ProtectedRoute } from "./hooks/ProtectedRoute";
import PageError from "./pages/404";
import DayPage from "./pages/Day";
import EditPage from "./pages/Edit";
import Layout from "./pages/Layout";

import ParetoScoop from "./pages/dashboard/ParetoScoop";
import ParetoTruck from "./pages/dashboard/ParetoTruck";
import ProductionMonth from "./pages/dashboard/ProductionMonth";
import ProductionScoop from "./pages/dashboard/ProductionScoop";
import ProductionTruck from "./pages/dashboard/ProductionTruck";
import Utilization from "./pages/dashboard/Utilization";

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

const queryClient = new QueryClient();

function App() {
  const isAuth = useAuthStore((state) => state.isAuth);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Ruta pública para Login */}
          <Route path="/login" element={<PageLogin />} />
          <Route path="*" element={<PageError />} />

          {/* Rutas protegidas dentro de Layout */}
          <Route element={<ProtectedRoute isAllowed={isAuth} />}>
            <Route element={<Layout />}>
              <Route  path="/users"  element={<HomeUsers />} />
              {/* <Route path="/edit/:id" element={<EditPage />} /> */}
              <Route path="/day" element={<DayPage />} />
              <Route path="/frontLabor" element={<HomeFrontLabor />} />
              <Route path="/vehicle" element={<HomeVehicles />} />
              <Route path="/workOrder" element={<WorkerOrder />} />
              <Route path="/checklist" element={<Checklist />} />
              <Route path="/planDay" element={<PlanDay />} />
              <Route path="/planMonth" element={<PlanMonth />} />
              <Route path="/newPlanMonth" element={<NewPlanMonth />} />
              <Route path="/company" element={<PageCompany />} />
              <Route path="/cycleTruck" element={<PageCycle />} />
              <Route path="/cycleScoop" element={<PageCycleScoop />} />
              <Route path="/activityTruck" element={<PageActivity />} />
              <Route path="/activityScoop" element={<PageActivityScoop />} />

              {/* Dashboard */}
              <Route index element={<ProductionTruck />} />
              <Route path="/dashboard/productionScoop" element={<ProductionScoop />} />
              <Route path="/dashboard/paretoTruck" element={<ParetoTruck />} />
              <Route path="/dashboard/paretoScoop" element={<ParetoScoop />} />
              <Route path="/dashboard/productionMonth" element={<ProductionMonth />} />
              <Route path="/dashboard/productionUV" element={<Utilization />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
