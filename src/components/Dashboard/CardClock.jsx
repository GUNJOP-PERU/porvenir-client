import React, { useState, useEffect, useCallback, useMemo } from "react";

function CardClock() {
  const [time, setTime] = useState("");

  const updateClock = useCallback(() => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    setTime(`${hours}:${minutes}:${seconds}`);
  }, []);

  useEffect(() => {
    updateClock(); // Ejecutar una vez al montar
    const timer = setInterval(updateClock, 1000);
    
    return () => clearInterval(timer);
  }, [updateClock]); 

  const formattedTime = useMemo(() => {
    const [hours, minutes, seconds] = time.split(":");
    return { hours, minutes, seconds };
  }, [time]);

  return (
    <div className="flex items-center justify-center bg-zinc-100/50 rounded-2xl py-2 px-4 w-[150px]">
      <h1 className="font-extrabold text-2xl leading-8">
        <span className="text-yellow-600">{formattedTime.hours}</span>
        <span className="text-zinc-400">
          :{formattedTime.minutes}:{formattedTime.seconds}
        </span>
        <small className="text-[12px] text-zinc-400 leading-[8px]">H</small>
      </h1>
    </div>
  );
}

export default CardClock;
