import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Page 30: Final Inspirational Page - Simple and Powerful
export default function Page30({ isInView }) {
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (!isInView) {
      setAnimationProgress(0);
      return;
    }

    const duration = 3000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setAnimationProgress(progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [isInView]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #2a1f3a 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Starfield background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(2px 2px at 20% 30%, white, transparent), radial-gradient(2px 2px at 60% 70%, white, transparent), radial-gradient(1px 1px at 50% 50%, white, transparent), radial-gradient(1px 1px at 80% 10%, white, transparent), radial-gradient(2px 2px at 90% 60%, white, transparent)',
          backgroundSize: '200px 200px',
          opacity: 0.3,
        }}
      />

      {/* Main text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: animationProgress,
          scale: animationProgress > 0 ? 1 : 0.8,
        }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        style={{
          textAlign: 'center',
          padding: '2rem',
          maxWidth: '1200px',
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{
            opacity: animationProgress,
            y: animationProgress > 0 ? 0 : 30,
          }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{
            fontSize: 'clamp(48px, 8vw, 120px)',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #00ff88, #00d9ff, #b47aff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.2,
            marginBottom: '2rem',
            textShadow: '0 0 60px rgba(0, 255, 136, 0.3)',
          }}
        >
          YOU CAN BE THE ONE
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{
            opacity: animationProgress,
            y: animationProgress > 0 ? 0 : 30,
          }}
          transition={{ duration: 1, delay: 0.6 }}
          style={{
            fontSize: 'clamp(36px, 6vw, 90px)',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #ffaa00, #ff6b35)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.2,
            textShadow: '0 0 60px rgba(255, 170, 0, 0.3)',
          }}
        >
          TO MAKE THIS REALITY
        </motion.h2>

        {/* Glowing effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: animationProgress * 0.5,
            scale: animationProgress > 0 ? 1.5 : 0,
          }}
          transition={{ duration: 2, delay: 0.9 }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(0, 255, 136, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />
      </motion.div>
    </div>
  );
}
