import { motion } from 'framer-motion';

export default function TextOverlay({
  children,
  position = 'center', // 'top', 'center', 'bottom', 'top-left', 'top-right', 'bottom-left', 'bottom-right'
  animate = true,
  isInView = false,
  delay = 0,
  className = '',
}) {
  const positionClasses = {
    center: 'items-center justify-center',
    top: 'items-start justify-center pt-20',
    bottom: 'items-end justify-center pb-20',
    'top-left': 'items-start justify-start pt-20 pl-8 md:pl-20',
    'top-right': 'items-start justify-end pt-20 pr-8 md:pr-20',
    'bottom-left': 'items-end justify-start pb-20 pl-8 md:pl-20',
    'bottom-right': 'items-end justify-end pb-20 pr-8 md:pr-20',
    left: 'items-center justify-start pl-8 md:pl-20',
    right: 'items-center justify-end pr-8 md:pr-20',
  };

  const variants = animate
    ? {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.8,
            delay,
            ease: 'easeOut',
          },
        },
      }
    : {};

  return (
    <div
      className={`absolute inset-0 flex ${positionClasses[position]} pointer-events-none z-10 px-4 md:px-8`}
    >
      <motion.div
        variants={variants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className={`max-w-4xl pointer-events-auto ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
}
