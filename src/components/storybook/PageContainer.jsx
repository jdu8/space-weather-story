import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PageNavigation from './PageNavigation';

export default function PageContainer({
  id,
  children,
  onPageEnter,
  onPageExit,
  backgroundColor = 'transparent',
  currentPage,
  totalPages,
  onReplay,
  onNext,
}) {
  const pageRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting && entry.intersectionRatio >= 0.5;

        if (inView !== isInView) {
          setIsInView(inView);

          if (inView) {
            onPageEnter?.();
          } else {
            onPageExit?.();
          }
        }
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '0px',
      }
    );

    if (pageRef.current) {
      observer.observe(pageRef.current);
    }

    return () => {
      if (pageRef.current) {
        observer.unobserve(pageRef.current);
      }
    };
  }, [onPageEnter, onPageExit, isInView]);

  const handleReplay = () => {
    setReplayKey((prev) => prev + 1);
    if (onReplay) {
      onReplay();
    }
  };

  return (
    <div
      ref={pageRef}
      id={id}
      className="page"
      style={{
        scrollSnapAlign: 'start',
        height: '100vh',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: backgroundColor,
      }}
      data-in-view={isInView}
    >
      {children({ isInView, replayKey })}

      {/* Navigation buttons - only show when page is in view */}
      {isInView && currentPage && totalPages && (
        <PageNavigation
          currentPage={currentPage}
          totalPages={totalPages}
          onReplay={handleReplay}
          onNext={onNext}
        />
      )}
    </div>
  );
}
