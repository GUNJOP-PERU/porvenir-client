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
    <div className="hidden lg:flex items-center justify-center px-2">
      <h1 className="font-extrabold text-2xl leading-8">
        <span className="text-primary">
          {formattedTime.hours}:{formattedTime.minutes}
        </span>
        <span className="text-zinc-500">:{formattedTime.seconds}</span>
      </h1>
    </div>
  );
}

export default CardClock;
