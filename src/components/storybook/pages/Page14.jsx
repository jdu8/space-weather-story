import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TextOverlay from '../TextOverlay';
// Page 14: Technology Fails (video background)
export default function Page14({ isInView }) {
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
      {isInView && (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <video
            src="/videos/cme_panic.mp4"
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
            background: 'rgba(58, 5, 32, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '2px solid rgba(255, 0, 51, 0.5)',
            boxShadow: '0 0 40px rgba(255, 0, 51, 0.3)',
          }}
        >
          <h3
            className="text-center font-bold mb-4"
            style={{
              fontSize: 'clamp(26px, 3.5vw, 36px)',
              color: '#ff0033',
              textShadow: '0 0 30px rgba(255, 0, 51, 0.6)',
            }}
          >
            Systems Failing
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
            <strong style={{ color: '#ff0033' }}>Satellites tumble</strong> out of control.{' '}
            <strong style={{ color: '#ff6b35' }}>Transformers explode</strong>.{' '}
            <strong style={{ color: '#ffaa00' }}>GPS signals vanish</strong>. Power grids teeter
            on the edge of collapse. The world that depends on technology is suddenly vulnerable.
          </p>
        </motion.div>
      </TextOverlay>
    </>
  );
}
