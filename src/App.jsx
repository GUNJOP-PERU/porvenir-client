import { ToastProvider } from "./hooks/useToaster";
import { SocketProvider } from "./context/SocketContext";
import { GlobalDataProvider } from "./context/GlobalDataContext";
import Router from "./Router";
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { register } from "timeago.js";
import es from "timeago.js/lib/lang/es";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
// Styles
import "handsontable/styles/handsontable.min.css";
import "handsontable/styles/ht-theme-main.min.css";

ModuleRegistry.registerModules([AllCommunityModule]);
register("es", es);
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <SocketProvider>
          <GlobalDataProvider>
            <Router />
          </GlobalDataProvider>
        </SocketProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
