
import { useState, useEffect, useRef } from 'react';

interface CountUpOptions {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
}

export function useCountUp({
  end,
  start = 0,
  duration = 2000,
  delay = 0,
  prefix = '',
  suffix = ''
}: CountUpOptions) {
  const [count, setCount] = useState(start);
  const countRef = useRef(start);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    countRef.current = start;
    const startTime = performance.now() + delay;
    const endValue = end;

    const animateCount = (currentTime: number) => {
      if (currentTime < startTime) {
        requestAnimationFrame(animateCount);
        return;
      }
      
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const currentCount = Math.floor(progress * (endValue - start) + start);

      if (countRef.current !== currentCount) {
        countRef.current = currentCount;
        setCount(currentCount);
      }

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    requestAnimationFrame(animateCount);
  }, [start, end, duration, delay, isVisible]);

  return {
    value: `${prefix}${count}${suffix}`,
    ref: elementRef
  };
}
