import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from ".";
import DayPage from "./Day";
import EditPage from "./Edit";
import HomeFrontLabor from "./FrontLabor";
import Layout from "./Layout";
import HomeUsers from "./Users";
import HomeVehicles from "./Vehicle";
import WeekPage from "./Week";
import WorkerOrder from "./WorkerOrder";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Checklist from "./Checklist";
import PlanDay from "./PlanDay";
import { useEffect, useState } from "react";
import PageCompany from "./Company";
import PageActivity from "./Activity";
import PageCycle from "./Cycle";


function App() {
  const queryClient = new QueryClient();

  const [isOnline, setIsOnline] = useState(false);
  const [msg, setMSG] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "ononline" in window &&
      "onoffline" in window
    ) {
      setIsOnline(window.navigator.onLine);
      if (!window.ononline) {
        window.addEventListener("online", () => {
          setIsOnline(true);
        });
      }
      if (!window.onoffline) {
        window.addEventListener("offline", () => {
          setIsOnline(false);
        });
      }
    }
  }, []);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsOnline(navigator.onLine);

      const handleOnline = () => {
        setIsOnline(true);
        console.log("con internet")
      };

      const handleOffline = () => {
        setIsOnline(false);
        console.log("sin internet")       
      };

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/edit/:id" element={<EditPage />} />
          <Route path="/week" element={<WeekPage />} />
          <Route path="/day" element={<DayPage />} />
          <Route path="/users" element={<HomeUsers />} />
          <Route path="/frontLabor" element={<HomeFrontLabor />} />
          <Route path="/vehicle" element={<HomeVehicles />} />
          <Route path="/workOrder" element={<WorkerOrder />} />
          <Route path="/checklist" element={<Checklist />} />
          <Route path="/planDay" element={<PlanDay />} />
          <Route path="/company" element={<PageCompany />} />
          <Route path="/cycle" element={<PageCycle />} />
          <Route path="/activity" element={<PageActivity />} />
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
