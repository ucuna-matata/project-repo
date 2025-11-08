import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { clsx } from 'clsx';

interface TimerProps {
  initialSeconds: number;
  onExpire?: () => void;
  className?: string;
}

export function Timer({ initialSeconds, onExpire, className }: TimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpire?.();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, onExpire]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isLow = secondsLeft < 30;
  const isVeryLow = secondsLeft < 10;

  return (
    <div className={clsx('inline-flex items-center gap-2', className)}>
      <Clock className={clsx('h-5 w-5', isVeryLow && 'text-red-600', isLow && !isVeryLow && 'text-yellow-600')} />
      <span
        className={clsx(
          'font-mono text-lg font-semibold',
          isVeryLow && 'text-red-600',
          isLow && !isVeryLow && 'text-yellow-600',
          !isLow && 'text-gray-700'
        )}
      >
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
