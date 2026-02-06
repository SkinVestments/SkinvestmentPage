import { useState, useEffect } from 'react';

export const useWeeklyReset = () => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      
      // Obliczamy cel: Najbliższa środa, 01:00 UTC (co odpowiada 02:00 CET)
      let target = new Date();
      target.setUTCHours(1, 0, 0, 0); 
      target.setUTCDate(now.getUTCDate() + (3 - now.getUTCDay() + 7) % 7);

      // Jeśli dziś jest środa po 02:00, ustaw cel na przyszły tydzień
      if (target <= now) {
        target.setUTCDate(target.getUTCDate() + 7);
      }

      const diff = target.getTime() - now.getTime();
      
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);

      if (d > 0) {
        setTimeLeft(`${d}d ${h}h`);
      } else {
        setTimeLeft(`${h}h ${m}m`);
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 60000); // Odświeżaj co minutę
    return () => clearInterval(timer);
  }, []);

  return timeLeft;
};