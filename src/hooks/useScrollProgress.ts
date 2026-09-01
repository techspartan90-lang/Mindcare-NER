import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to obtain window or container scroll progress normalized between 0.0 and 1.0,
 * smoothed with requestAnimationFrame.
 */
export function useScrollProgress(containerRef?: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const totalHeight = containerRef.current.offsetHeight;
        const scrolled = windowHeight - rect.top;
        const maxScroll = totalHeight + windowHeight;
        targetProgress.current = Math.max(0, Math.min(1, scrolled / maxScroll));
      } else {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;
        targetProgress.current = docHeight > 0 ? Math.max(0, Math.min(1, currentScroll / docHeight)) : 0;
      }
    };

    const updateLoop = () => {
      const diff = targetProgress.current - currentProgress.current;
      if (Math.abs(diff) > 0.001) {
        currentProgress.current += diff * 0.1;
        setProgress(currentProgress.current);
      }
      rafId.current = requestAnimationFrame(updateLoop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
    rafId.current = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [containerRef]);

  return progress;
}
