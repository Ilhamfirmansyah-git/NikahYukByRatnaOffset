'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
  labelStyle?: string;
  numberStyle?: string;
  containerStyle?: string;
  unitLabels?: { hari: string; jam: string; menit: string; detik: string };
}

interface TimeLeft {
  hari: number;
  jam: number;
  menit: number;
  detik: number;
}

function calculateTimeLeft(target: string): TimeLeft {
  const difference = new Date(target).getTime() - Date.now();
  if (difference <= 0) return { hari: 0, jam: 0, menit: 0, detik: 0 };
  return {
    hari: Math.floor(difference / (1000 * 60 * 60 * 24)),
    jam: Math.floor((difference / (1000 * 60 * 60)) % 24),
    menit: Math.floor((difference / 1000 / 60) % 60),
    detik: Math.floor((difference / 1000) % 60),
  };
}

export default function CountdownTimer({
  targetDate,
  labelStyle = 'text-xs uppercase tracking-widest opacity-70',
  numberStyle = 'text-4xl font-bold',
  containerStyle = 'flex gap-4 justify-center',
  unitLabels = { hari: 'Hari', jam: 'Jam', menit: 'Menit', detik: 'Detik' },
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: unitLabels.hari, value: timeLeft.hari },
    { label: unitLabels.jam, value: timeLeft.jam },
    { label: unitLabels.menit, value: timeLeft.menit },
    { label: unitLabels.detik, value: timeLeft.detik },
  ];

  return (
    <div className={containerStyle}>
      {units.map((unit) => (
        <div key={unit.label} className="flex flex-col items-center min-w-[60px]">
          <span className={numberStyle}>{String(unit.value).padStart(2, '0')}</span>
          <span className={labelStyle}>{unit.label}</span>
        </div>
      ))}
    </div>
  );
}
