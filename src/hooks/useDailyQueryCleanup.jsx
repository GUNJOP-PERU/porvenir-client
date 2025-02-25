
import { useEffect } from "react";

export const useDailyQueryCleanup = () => {


  useEffect(() => {
    const now = new Date();
    const targetTime = new Date();
    targetTime.setHours(6, 30, 0, 0);

    if (now > targetTime) {
      targetTime.setDate(targetTime.getDate() + 1);
    }

    const timeUntilCleanup = targetTime - now;

    const timeoutId = setTimeout(() => {
      console.log("🔥 Limpiando queries...");
      
    }, timeUntilCleanup);

    return () => clearTimeout(timeoutId);
  }, []);
};
