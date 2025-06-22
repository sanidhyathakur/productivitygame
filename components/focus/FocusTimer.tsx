'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { toast } from 'sonner';

export function FocusTimer() {
  const { profile, updateProfile } = useUserProfile();
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const [totalTime, setTotalTime] = useState(25 * 60);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }, 1000);
    } else if (minutes === 0 && seconds === 0 && isActive) {
      // Timer completed
      handleTimerComplete();
      setIsActive(false);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const handleTimerComplete = async () => {
    if (!profile) return;

    const energyBonus = isWork ? 10 : 5;
    const candyBonus = isWork ? 3 : 1;

    try {
      await updateProfile({
        energy: Math.min(100, profile.energy + energyBonus),
        candy_points: profile.candy_points + candyBonus,
      });

      toast.success(
        `${isWork ? 'Focus' : 'Break'} session complete! +${energyBonus} energy, +${candyBonus} candy points`
      );

      // Switch to break/work mode
      const nextIsWork = !isWork;
      const nextDuration = nextIsWork ? 25 : 5;
      
      setIsWork(nextIsWork);
      setMinutes(nextDuration);
      setSeconds(0);
      setTotalTime(nextDuration * 60);
    } catch (error) {
      toast.error('Failed to complete focus session');
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    const duration = isWork ? 25 : 5;
    setMinutes(duration);
    setSeconds(0);
    setIsActive(false);
    setTotalTime(duration * 60);
  };

  const switchMode = (workMode: boolean) => {
    const duration = workMode ? 25 : 5;
    setIsWork(workMode);
    setMinutes(duration);
    setSeconds(0);
    setIsActive(false);
    setTotalTime(duration * 60);
  };

  const currentTime = minutes * 60 + seconds;
  const progress = ((totalTime - currentTime) / totalTime) * 100;

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Clock className="h-5 w-5" />
          Focus Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mode Toggle */}
        <div className="flex gap-2">
          <Button
            variant={isWork ? "default" : "outline"}
            size="sm"
            onClick={() => switchMode(true)}
            className="flex-1"
            disabled={isActive}
          >
            Work (25m)
          </Button>
          <Button
            variant={!isWork ? "default" : "outline"}
            size="sm"
            onClick={() => switchMode(false)}
            className="flex-1"
            disabled={isActive}
          >
            Break (5m)
          </Button>
        </div>

        {/* Timer Display */}
        <div className="text-center space-y-4">
          <div className={`text-6xl font-mono font-bold ${
            isWork ? 'text-purple-600' : 'text-green-600'
          }`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          
          <Progress 
            value={progress} 
            className={`h-3 ${isWork ? '[&>div]:bg-purple-500' : '[&>div]:bg-green-500'}`}
          />
          
          <p className="text-sm text-gray-600">
            {isWork ? 'Focus Time' : 'Break Time'} • +{isWork ? '10' : '5'} energy, +{isWork ? '3' : '1'} candy
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-2 justify-center">
          <Button onClick={toggleTimer} size="lg" className="px-8">
            {isActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {isActive ? 'Pause' : 'Start'}
          </Button>
          <Button onClick={resetTimer} variant="outline" size="lg">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}