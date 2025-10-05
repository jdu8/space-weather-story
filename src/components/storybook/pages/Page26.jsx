import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TextOverlay from '../TextOverlay';

// Page 26: Space Collectors Concept - A Potential Future
export default function Page26({ isInView }) {
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (!isInView) {
      setAnimationProgress(0);
      return;
    }

    const duration = 4000;
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

  const textProgress = Math.max(0, Math.min(animationProgress * 2, 1));

  return (
    <>
      {/* Full-bleed video */}
      {isInView && (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <video
            src="/videos/maybe.mp4"
            autoPlay
            muted
            playsInline
            loop
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}

      <TextOverlay position="bottom" isInView={isInView}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: textProgress, y: textProgress > 0 ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="glass-strong px-10 py-8 rounded-2xl max-w-4xl"
          style={{
            background: 'rgba(26, 58, 79, 0.9)',
            backdropFilter: 'blur(16px)',
            border: '2px solid rgba(0, 255, 136, 0.5)',
            boxShadow: '0 0 30px rgba(0, 255, 136, 0.2)',
          }}
        >
          <h3
            className="text-center font-bold mb-4"
            style={{
              fontSize: 'clamp(24px, 3vw, 32px)',
              color: '#00ff88',
              textShadow: '0 0 20px rgba(0, 255, 136, 0.4)',
            }}
          >
            A Potential Future 🌟
          </h3>
          <p
            className="text-center"
            style={{
              fontSize: 'clamp(16px, 2.2vw, 20px)',
              color: '#ffffff',
              lineHeight: 1.8,
              fontWeight: 300,
            }}
          >
            Imagine a future where{' '}
            <strong style={{ color: '#00ff88' }}>massive orbital collectors</strong> harness the
            power of solar storms. Satellites with electromagnetic fields capture CME particles,
            converting their incredible kinetic energy into clean electricity. What was once a
            threat could become{' '}
            <strong style={{ color: '#00ff88' }}>humanity's greatest energy source</strong>—cosmic
            wind farms powering our civilization!
          </p>
        </motion.div>
      </TextOverlay>
    </>
  );
}
