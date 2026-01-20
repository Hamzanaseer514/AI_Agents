import React, { useState, useEffect } from 'react';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: '00', minutes: '00', seconds: '00' });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const deadline = new Date();
      deadline.setUTCHours(15, 0, 0, 0); 

      if (now.getTime() > deadline.getTime()) {
        deadline.setDate(deadline.getDate() + 1);
      }

      const diff = deadline.getTime() - now.getTime();
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mt-auto pt-4">
      <p className="text-muted-foreground mb-2 text-sm font-semibold">Submit before 3 PM GMT to match today!</p>
      <div className="flex justify-center gap-2 text-3xl font-bold text-foreground">
        <div>{timeLeft.hours}<span className="text-base text-muted-foreground ml-1">h</span></div>
        <div>:</div>
        <div>{timeLeft.minutes}<span className="text-base text-muted-foreground ml-1">m</span></div>
        <div>:</div>
        <div>{timeLeft.seconds}<span className="text-base text-muted-foreground ml-1">s</span></div>
      </div>
    </div>
  );
};

export default CountdownTimer;