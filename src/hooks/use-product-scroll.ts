import { useState, useEffect, useRef, useCallback } from 'react';
import { getStoryStateAtProgress, STORY_STAGES, ProductStoryStage } from '../lib/product-animation';

export interface ProductScrollState {
  progress: number;
  smoothProgress: number;
  stageIndex: number;
  currentStage: ProductStoryStage;
  isScrolling: boolean;
  scrollToProgress: (targetProgress: number) => void;
  scrollToStage: (stageIndex: number) => void;
}

export function useProductScroll(containerRef: React.RefObject<HTMLElement | null>): ProductScrollState {
  const [progress, setProgress] = useState(0);
  const [smoothProgress, setSmoothProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const targetProgressRef = useRef(0);
  const currentSmoothRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Smooth progress loop using Lerp
  useEffect(() => {
    const updateSmooth = () => {
      const diff = targetProgressRef.current - currentSmoothRef.current;
      if (Math.abs(diff) > 0.0005) {
        currentSmoothRef.current += diff * 0.12;
        setSmoothProgress(currentSmoothRef.current);
        const story = getStoryStateAtProgress(currentSmoothRef.current);
        setStageIndex(story.stageIndex);
      } else {
        currentSmoothRef.current = targetProgressRef.current;
        setSmoothProgress(targetProgressRef.current);
        const story = getStoryStateAtProgress(targetProgressRef.current);
        setStageIndex(story.stageIndex);
      }
      rafIdRef.current = requestAnimationFrame(updateSmooth);
    };

    rafIdRef.current = requestAnimationFrame(updateSmooth);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalHeight = containerRef.current.scrollHeight || containerRef.current.offsetHeight;
    const scrollableDistance = totalHeight - windowHeight;

    if (scrollableDistance <= 0) return;

    // Calculate progress based on container's top offset relative to viewport
    const scrolled = -rect.top;
    const rawProgress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

    targetProgressRef.current = rawProgress;
    setProgress(rawProgress);

    setIsScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, [containerRef]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [handleScroll]);

  const scrollToProgress = useCallback(
    (targetProgress: number) => {
      if (!containerRef.current) return;
      const totalHeight = containerRef.current.scrollHeight || containerRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollableDistance = totalHeight - windowHeight;
      const containerTop = containerRef.current.offsetTop;
      const targetScrollY = containerTop + targetProgress * scrollableDistance;

      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth',
      });
    },
    [containerRef]
  );

  const scrollToStage = useCallback(
    (targetStageIdx: number) => {
      const stage = STORY_STAGES[targetStageIdx];
      if (stage) {
        scrollToProgress(stage.progressStart);
      }
    },
    [scrollToProgress]
  );

  const currentStage = STORY_STAGES[stageIndex] || STORY_STAGES[0];

  return {
    progress,
    smoothProgress,
    stageIndex,
    currentStage,
    isScrolling,
    scrollToProgress,
    scrollToStage,
  };
}
