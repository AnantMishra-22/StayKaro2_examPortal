import { useEffect, useRef } from 'react';

/** Countdown hook – returns live MM:SS string */
export function useCountdown(initialSeconds: number) {
  const endTimeRef = useRef(Date.now() + initialSeconds * 1000);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const getTime = () => {
    const remaining = Math.max(0, Math.floor((endTimeRef.current - Date.now()) / 1000));
    const h = Math.floor(remaining / 3600);
    const m = Math.floor((remaining % 3600) / 60);
    const s = remaining % 60;
    if (h > 0) return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  };

  return { getTime, isWarning: () => (endTimeRef.current - Date.now()) < 300000 };
}

/** Anti-cheat hook – detects tab switches */
export function useAntiCheat(onViolation: (count: number) => void) {
  const countRef = useRef(0);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        countRef.current += 1;
        onViolation(countRef.current);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [onViolation]);

  return { violationCount: countRef.current };
}
