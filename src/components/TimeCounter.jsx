import { useEffect, useState } from "react";

function getTimeDiff(fromDate, toDate) {
  const start = new Date(fromDate);
  const end = toDate ? new Date(toDate) : new Date();
  let diff = Math.max(0, end - start);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);
  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * (1000 * 60);
  const seconds = Math.floor(diff / 1000);

  // Formatea con ceros a la izquierda
  const pad = (n) => n.toString().padStart(2, "0");
  return {
    days: pad(days),
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
  };
}

export function TimeElapsedCounter({ from, to }) {
  const [elapsed, setElapsed] = useState(getTimeDiff(from, to));

  useEffect(() => {
    if (to) {
      setElapsed(getTimeDiff(from, to));
      return;
    }
    const interval = setInterval(() => {
      setElapsed(getTimeDiff(from));
    }, 1000); // actualiza cada segundo
    return () => clearInterval(interval);
  }, [from, to]);

  return (
    <div className="flex flex-col gap-1 justify-center">
      <div className="grid grid-cols-[repeat(4,100px)] grid-rows-1 justify-center">
        <p className="flex justify-center font-bold text-[13px]">DIAS</p>
        <p className="flex justify-center font-bold text-[13px]">HORAS</p>
        <p className="flex justify-center font-bold text-[13px]">MINUTOS</p>
        <p className="flex justify-center font-bold text-[13px]">SEGUNDOS</p>
      </div>
      <div className="grid grid-cols-[repeat(4,100px)] grid-rows-1 justify-center">
        <p className="flex justify-center font-bold text-[24px]">{elapsed.days}</p>
        <p className="flex justify-center font-bold text-[24px]">{elapsed.hours}</p>
        <p className="flex justify-center font-bold text-[24px]">{elapsed.minutes}</p>
        <p className="flex justify-center font-bold text-[24px]">{elapsed.seconds}</p>
      </div>
    </div>
  );
}