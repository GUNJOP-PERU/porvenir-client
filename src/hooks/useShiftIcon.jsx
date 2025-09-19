import { useEffect, useState } from "react";
import IconDay from "@/icons/IconDay";
import IconNight from "@/icons/IconNight";

export const useShiftIcon = () => {
  const [isDayShift, setIsDayShift] = useState(null);

  useEffect(() => {
    const updateShift = () => {
      const now = new Date();
      const hours = now.getHours();

      if (hours >= 6 && hours < 18) {
        setIsDayShift(true); 
      } else {
        setIsDayShift(false); 
      }
    };

    updateShift(); 
    const interval = setInterval(updateShift, 1000 * 60); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-1 border border-zinc-700 rounded-[10px] py-0.5 pl-1.5 pr-2">
      <div className="inline-flex items-center justify-center w-8 h-8  rounded-[10px]">
        {isDayShift ? (
          <IconDay className="h-5 w-5 fill-orange-400" />
        ) : (
          <IconNight className="h-5 w-5 fill-sky-400" />
        )}
      </div>
      <div className="flex flex-col items-start gap-0.5 min-w-[40px]">
        <span className="text-[8px] text-zinc-400 leading-[8px]">Turno</span>
        <span className="text-[12px] font-semibold leading-[12px] text-zinc-200">
          {isDayShift ? "Día" : "Noche"}
        </span>
      </div>
    </div>
  );
};
