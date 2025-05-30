
import { ToastProvider } from "./hooks/useToaster";
import { SocketProvider } from "./context/SocketContext";
import Router from "./Router";
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { register } from "timeago.js";
import es from "timeago.js/lib/lang/es";

import "handsontable/styles/handsontable.min.css";
import "handsontable/styles/ht-theme-main.min.css";

register("es", es);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <ToastProvider>
          <Router />
        </ToastProvider>
      </SocketProvider>
    </QueryClientProvider>
  );
}

export default App;
