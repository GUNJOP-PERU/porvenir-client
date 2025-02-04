import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from "./pages";
import PageActivity from "./pages/gestion/ActivityTruck";
import Checklist from "./pages/gestion/Checklist";
import PageCompany from "./pages/gestion/Company";
import PageCycle from "./pages/gestion/CycleTruck";
import DayPage from "./pages/Day";
import EditPage from "./pages/Edit";
import HomeFrontLabor from "./pages/gestion/FrontLabor";
import Layout from "./pages/Layout";
import PlanDay from "./pages/gestion/PlanDay";
import HomeUsers from "./pages/gestion/Users";
import HomeVehicles from "./pages/gestion/Vehicle";
import WeekPage from "./pages/Week";
import WorkerOrder from "./pages/gestion/WorkerOrder";
import PageError from "./pages/404";
import DashboardTurno from "./pages/dashboard/Turno";
import PageLogin from "./pages/login/Login";
import { ProtectedRoute } from "./hooks/ProtectedRoute";
import { useAuthStore } from "./store/AuthStore";
import DashboardTruck from "./pages/dashboard/Truck";
import DashboardAvanceMes from "./pages/dashboard/AvanceMes";
import DashboardScoop from "./pages/dashboard/Scoop";
import PageCycleScoop from "./pages/gestion/CycleScoop";
import PlanWeek from "./pages/gestion/PlanWeek";
import PlanMonth from "./pages/gestion/PlanMonth";
import { NewPlanMonth } from "./pages/gestion/NewPlanMonth";
import PageActivityScoop from "./pages/gestion/ActivityScoop";

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
              <Route path="/planWeek" element={<PlanWeek />} />
              <Route path="/planMonth" element={<PlanMonth />} />
              <Route path="/newPlanMonth" element={<NewPlanMonth />} />
              <Route path="/company" element={<PageCompany />} />
              <Route path="/cycleTruck" element={<PageCycle />} />
              <Route path="/cycleScoop" element={<PageCycleScoop />} />
              <Route path="/activityTruck" element={<PageActivity />} />
              <Route path="/activityScoop" element={<PageActivityScoop />} />
              <Route path="/dashboard/turno" element={<DashboardTurno />} />
              <Route path="/dashboard/scoop" element={<DashboardScoop />} />
              <Route path="/dashboard/truck" element={<DashboardTruck />} />
              <Route path="/dashboard/month" element={<DashboardAvanceMes />} />
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
