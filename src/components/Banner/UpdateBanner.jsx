import { Sparkles } from "lucide-react";

/* eslint-disable react/prop-types */
export function UpdateBannerUpdateBanners({ onUpdate, onDismiss }) {
  return (
    <div
      className="bg-[#22ff991e] rounded-xl max-w-xs py-4 pl-3.5 pr-2 flex gap-2 select-none shadow-sm"
      style={{
        zIndex: 9999,
      }}
    >
      <div>
        <Sparkles className="size-5 text-green-600" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[13.5px] text-white font-bold leading-tight">
          ¡Nueva versión disponible!
        </span>
        <p className="text-[11.5px] text-zinc-50 opacity-85 leading-[0.8rem]">
         Nueva carga de planes: soporte para Excel, imágenes y entrada manual (copy-paste).
        </p>
        <div className="flex gap-4 mt-2">
          <button
            onClick={onUpdate}
            className="leading-none text-[11.5px] text-green-500 cursor-pointer font-semibold hover:underline hover:text-green-400"
          >
            Actualizar ahora
          </button>
          <button
            onClick={onDismiss}
            className="leading-none text-[11.5px] text-zinc-400 cursor-pointer font-semibold hover:underline hover:text-zinc-300"
          >
            Más tarde
          </button>
        </div>
      </div>
    </div>
  );
}
