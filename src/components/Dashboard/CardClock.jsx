import React, { useState, useEffect } from "react";

function CardClock() {
  const [time, setTime] = useState("");

  const updateClock = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    setTime(`${hours}:${minutes}:${seconds}`);
  };

  useEffect(() => {
    updateClock(); 
    const timer = setInterval(updateClock, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-center   ">
      <h1 className="font-extrabold text-2xl leading-8">
        <span className="text-yellow-600">{time.split(":")[0]}</span>
        <span className="text-zinc-400">
          :{time.split(":")[1]}:{time.split(":")[2]}
        </span>
        <small className="text-[12px] text-zinc-400 leading-[8px]">H</small>
      </h1>
    </div>
  );
}

export default CardClock;
