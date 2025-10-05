import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function PageContainer({
  id,
  children,
  onPageEnter,
  onPageExit,
  backgroundColor = 'transparent'
}) {
  const pageRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

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
      {children({ isInView })}
    </div>
  );
}
