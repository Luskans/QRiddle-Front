import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import moment from 'moment';


export default function Chronometer({ startTime }: { startTime: string }) {
  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  
  useEffect(() => {
    const updateTimer = () => {
      const start = moment(startTime);
      const now = moment();
      const duration = moment.duration(now.diff(start));
      
      const hours = String(Math.floor(duration.asHours())).padStart(2, '0');
      const minutes = String(duration.minutes()).padStart(2, '0');
      const seconds = String(duration.seconds()).padStart(2, '0');
      
      setElapsedTime(`${hours}:${minutes}:${seconds}`);
    };
    
    updateTimer();
    
    const intervalId = setInterval(updateTimer, 1000);
    
    return () => clearInterval(intervalId);
  }, [startTime]);
  
  return (
    <Text className="text-dark dark:text-light text-xl text-center">
      {elapsedTime}
    </Text>
  );
}