import { ToastProvider } from "./hooks/useToaster";
import { SocketProvider } from "./context/SocketContext";
import { GlobalDataProvider } from "./context/GlobalDataContext";
import Router from "./Router";
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { register } from "timeago.js";

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
// Styles
import "handsontable/styles/handsontable.min.css";
import "handsontable/styles/ht-theme-main.min.css";
import { TooltipProvider } from "./components/ui/tooltip";

ModuleRegistry.registerModules([AllCommunityModule]);
const customLocale = function (_number, index) {
  const table = [
    ['justo ahora', 'ahora mismo'],
    ['hace %s seg', 'en %s seg'],
    ['hace 1 min', 'en 1 min'],
    ['hace %s min', 'en %s min'],
    ['hace 1 h', 'en 1 h'],
    ['hace %s h', 'en %s h'],
    ['hace 1 d', 'en 1 d'],
    ['hace %s d', 'en %s d'],
    ['hace 1 sem', 'en 1 sem'],
    ['hace %s sem', 'en %s sem'],
    ['hace 1 mes', 'en 1 mes'],
    ['hace %s mes', 'en %s mes'],
    ['hace 1 año', 'en 1 año'],
    ['hace %s años', 'en %s años'],
  ];
  return table[index] || ['hace mucho', 'en mucho'];
};
register("es", customLocale);
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
      <ToastProvider>
        <SocketProvider>
          <GlobalDataProvider>
            <Router />
          </GlobalDataProvider>
        </SocketProvider>
      </ToastProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
