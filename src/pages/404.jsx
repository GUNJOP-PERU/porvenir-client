import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PageError() {
  const navigate = useNavigate();

  return (
    <div className="absolute inset-0 m-auto max-w-[240px] flex flex-col items-center justify-center gap-2 text-center">
      <img src="/error.svg" alt="illustration" className="w-40" />
      <span className="text-lg font-semibold leading-5">
        Lo sentimos, no se puede encontrar la página
      </span>
      <p className="text-xs text-zinc-500 mb-4">
        La página que estabas buscando parece haber sido movida, eliminada o no
        existe.
      </p>
      <Button onClick={() => navigate("/")}>
        <SendHorizontal className="w-5 h-5  text-white rotate-180" /> Regresar al Inicio
      </Button>
    </div>
  );
}
