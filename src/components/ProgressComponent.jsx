import { useEffect, useState } from "react";

export function ProgressComponenet({ timer }) {
  const [timerValue, setTimerValue] = useState(timer);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerValue(prevTimerVal => {
       return prevTimerVal - 10;
      })
    }, 10);
  
    return () => {
      clearInterval(interval);
    }
  }, [timerValue])
  
  return (
    <progress max={timer} value={timerValue}/>
  );
}