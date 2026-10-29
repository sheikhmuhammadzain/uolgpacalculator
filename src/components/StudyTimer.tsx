import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';

export const StudyTimer = () => {
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: number;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      // Notification when timer ends
      if (Notification.permission === 'granted') {
        new Notification('Study Timer', {
          body: 'Time to take a break!',
        });
      }
    }

    return () => clearInterval(interval);
  }, [isActive, time]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
      <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
        Study Timer
      </h3>
      <div className="text-4xl font-mono mb-6">{formatTime(time)}</div>
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTimer}
          className="w-12 h-12 rounded-full"
        >
          {isActive ? <Pause size={20} /> : <Play size={20} />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={resetTimer}
          className="w-12 h-12 rounded-full"
        >
          <RotateCcw size={20} />
        </Button>
      </div>
    </div>
  );
};