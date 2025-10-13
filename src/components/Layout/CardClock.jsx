import { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";

function CardClock() {
  const [time, setTime] = useState(dayjs());
  dayjs.locale("es"); 

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(dayjs());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden lg:flex items-center justify-center gap-2 px-2 text-center">
      <p className="font-extrabold text-2xl leading-none text-zinc-400 capitalize">
        {time.format("dddd, D MMMM")}
      </p>
      <h1 className="font-extrabold text-2xl leading-8">
        <span className="text-primary">{time.format("HH:mm")}</span>
        <span className="text-zinc-500">:{time.format("ss")}</span>
      </h1>
    </div>
  );
}

export default CardClock;
