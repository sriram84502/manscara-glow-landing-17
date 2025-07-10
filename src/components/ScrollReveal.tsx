
import React, { useRef, useEffect, useState, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  animation?: 'fade-in' | 'fade-up' | 'fade-right' | 'fade-left' | 'scale-up';
  delay?: number;
  threshold?: number;
  className?: string;
  id?: string; // Added id property to fix the TypeScript error
}

const animationClasses = {
  'fade-in': 'opacity-0 transition-opacity duration-1000 ease-out',
  'fade-up': 'opacity-0 translate-y-10 transition-all duration-1000 ease-out',
  'fade-right': 'opacity-0 -translate-x-10 transition-all duration-1000 ease-out',
  'fade-left': 'opacity-0 translate-x-10 transition-all duration-1000 ease-out',
  'scale-up': 'opacity-0 scale-95 transition-all duration-1000 ease-out',
};

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fade-up',
  delay = 0,
  threshold = 0.1,
  className = '',
  id, // Added id to component props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay, threshold]);

  return (
    <div
      ref={ref}
      id={id} // Pass id to the div element
      className={`${animationClasses[animation]} ${className} ${isVisible ? 'opacity-100 translate-y-0 translate-x-0 scale-100' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
