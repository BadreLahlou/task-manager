
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

interface TimerButtonProps {
  isRunning?: boolean;
  timeLogged: number;
  className?: string;
  onTimeUpdate?: (newTime: number) => void;
  onStart?: () => void;
  onPause?: () => void;
}

export const TimerButton = ({
  isRunning: initialIsRunning = false,
  timeLogged: initialTimeLogged = 0,
  className = '',
  onTimeUpdate,
  onStart,
  onPause
}: TimerButtonProps) => {
  const [isRunning, setIsRunning] = useState(initialIsRunning);
  const [timeLogged, setTimeLogged] = useState(initialTimeLogged);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timer, setTimer] = useState<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setIsRunning(initialIsRunning);
  }, [initialIsRunning]);

  useEffect(() => {
    setTimeLogged(initialTimeLogged);
  }, [initialTimeLogged]);

  useEffect(() => {
    if (isRunning) {
      // Record start time
      setStartTime(Date.now() - timeLogged * 1000);
      
      // Update timer every second
      const interval = setInterval(() => {
        if (startTime) {
          const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
          setTimeLogged(elapsedSeconds);
          if (onTimeUpdate) onTimeUpdate(elapsedSeconds);
        }
      }, 1000);
      
      setTimer(interval);
    } else if (timer) {
      clearInterval(timer);
      setTimer(null);
      setStartTime(null);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, startTime, onTimeUpdate]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    const newRunningState = !isRunning;
    setIsRunning(newRunningState);
    
    if (newRunningState && onStart) {
      onStart();
    } else if (!newRunningState && onPause) {
      onPause();
    }
  };

  return (
    <Button 
      variant={isRunning ? "default" : "outline"} 
      className={`gap-2 ${isRunning ? 'animate-pulse-subtle' : ''} ${className}`}
      onClick={toggleTimer}
    >
      {isRunning ? (
        <>
          <Pause className="h-3.5 w-3.5" />
          <span>{formatTime(timeLogged)}</span>
        </>
      ) : (
        <>
          <Play className="h-3.5 w-3.5" />
          <span>{timeLogged > 0 ? formatTime(timeLogged) : 'Start Timer'}</span>
        </>
      )}
    </Button>
  );
};
