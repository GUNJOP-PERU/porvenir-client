import { Activity, Trash2, Wifi, WifiOff } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useSocket } from "@/context/SocketContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { countItems } from "@/lib/utilsGeneral";

export default function TruckRealTime() {
  // Sacamos los datos del contexto con seguridad extrema
  const socketCtx = useSocket() || {};
  const connected = socketCtx.connected ?? false;
  const events = Array.isArray(socketCtx.events) ? socketCtx.events : [];
  const lastEvent = socketCtx.lastEvent || null;
  const clearEvents = socketCtx.clearEvents || (() => {});

  // Formateador de fechas según el snippet del usuario (es-CL)
  function formatTs(ts) {
    try {
      if (!ts) return "—";
      return new Date(ts).toLocaleString('es-CL', {
        dateStyle: 'short',
        timeStyle: 'medium',
      });
    } catch {
      return ts || "—";
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Tiempo real"
        description="Eventos en tiempo real vía Socket.IO (Secundario: 3012 - mqtt:data)."
        count={countItems(events)}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            {/* Badge de Conectividad */}
            <div className={`flex items-center gap-2 px-3 h-8 rounded-full border text-[11px] font-bold transition-all ${
              connected 
                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                : "bg-zinc-50 text-zinc-500 border-zinc-200"
            }`}>
              <div className={`size-2 rounded-full ${connected ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"}`} />
              {connected ? (
                <span className="flex items-center gap-1.5"><Wifi className="size-3" /> Conectado</span>
              ) : (
                <span className="flex items-center gap-1.5"><WifiOff className="size-3" /> Desconectado</span>
              )}
            </div>

            {events.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearEvents}
                className="h-8 text-[11px] font-bold gap-2 border-zinc-200 hover:bg-zinc-50"
              >
                <Trash2 className="size-3.5 text-zinc-500" />
                Limpiar Historial
              </Button>
            )}
          </div>
        }
      />

      {/* Sección del Último Evento */}
      {lastEvent && (
        <Card className="border-zinc-200 shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3 bg-zinc-50/50 border-b border-zinc-100">
            <div className="space-y-0.5">
              <CardTitle className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                Último evento recibido
              </CardTitle>
            </div>
            <Activity className="size-4 text-emerald-500 animate-pulse" strokeWidth={2.5} />
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-tight">Topic</span>
                <p className="font-mono text-xs text-zinc-700 bg-zinc-100 px-2 py-1 rounded w-fit border border-zinc-200">
                  {lastEvent.topic || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-tight">Unit ID</span>
                <p className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit border border-blue-100">
                  {lastEvent.unitId || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-tight">Timestamp</span>
                <p className="text-xs text-zinc-600 font-medium whitespace-nowrap">
                  {formatTs(lastEvent.ts)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-tight">Payload (JSON)</span>
              <pre className="max-h-[300px] overflow-auto rounded-lg bg-zinc-900 p-4 text-[11px] text-zinc-300 font-mono leading-relaxed shadow-inner scrollbar-thin scrollbar-thumb-zinc-700">
                {JSON.stringify(lastEvent.data, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historial de Eventos */}
      <Card className="border-zinc-200 shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-zinc-100 bg-zinc-50/20">
          <CardTitle className="text-sm font-bold">Historial Detallado</CardTitle>
          <CardDescription className="text-[11px]">
            Últimos {(events || []).length} eventos (los más recientes primero)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {(events || []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-zinc-50/30">
              <Activity className="size-8 text-zinc-200 mb-2" />
              <p className="text-xs text-zinc-400 font-medium whitespace-pre-line text-center">
                {connected
                  ? "Aún no hay eventos. \n Los datos vía Socket.IO aparecerán aquí automáticamente."
                  : "Por favor, reconecta al servidor para recibir eventos en tiempo real."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50/50">
                    <th className="px-5 py-3 text-[10px] uppercase font-bold text-zinc-500 border-b border-zinc-100">Hora</th>
                    <th className="px-5 py-3 text-[10px] uppercase font-bold text-zinc-500 border-b border-zinc-100">Tópico</th>
                    <th className="px-5 py-3 text-[10px] uppercase font-bold text-zinc-500 border-b border-zinc-100">Unit ID</th>
                    <th className="px-5 py-3 text-[10px] uppercase font-bold text-zinc-500 border-b border-zinc-100">Datos (Resumen)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {(events || []).map((ev, i) => (
                    <tr key={`${ev?.ts}-${i}`} className="hover:bg-zinc-50 transition-colors group">
                      <td className="px-5 py-3 text-[11px] font-medium text-zinc-500 tabular-nums whitespace-nowrap">
                        {formatTs(ev?.ts)}
                      </td>
                      <td className="px-5 py-3">
                        <span className="font-mono text-[10px] text-zinc-600 bg-zinc-100/80 px-1.5 py-0.5 rounded border border-zinc-200/50">
                          {ev?.topic || "N/A"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="font-mono text-[11px] font-bold text-blue-700/80">
                          {ev?.unitId || "N/A"}
                        </span>
                      </td>
                      <td className="px-5 py-3 max-w-[300px] truncate">
                        <code className="text-[10px] text-zinc-400 bg-zinc-50 px-1 rounded truncate block border border-zinc-100">
                          {typeof ev?.data === "object"
                            ? JSON.stringify(ev?.data).slice(0, 80) + (JSON.stringify(ev?.data).length > 80 ? '…' : '')
                            : String(ev?.data)}
                        </code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
