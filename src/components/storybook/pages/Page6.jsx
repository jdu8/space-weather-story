import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';
import ShaderAurora from '../effects/ShaderAurora';

// Page 6: Aurora Borealis Born
export default function Page6({ isInView }) {
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
        <Canvas3D
          showStars={true}
          showControls={false}
          camera={{ position: [0, 0, 8], fov: 70 }}
        >
          <ShaderAurora
            animationProgress={animationProgress}
            intensity={1.0}
            position={[0, 3.5, -5]}
            scale={[50, 15, 1]}
          />
          <ambientLight intensity={0.3} />
        </Canvas3D>
      )}

      <TextOverlay position="bottom" isInView={isInView}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: textProgress, y: textProgress > 0 ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="glass-strong px-10 py-6 rounded-2xl max-w-3xl"
          style={{
            background: 'rgba(10, 14, 39, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '2px solid rgba(0, 255, 136, 0.4)',
            boxShadow: '0 0 40px rgba(0, 255, 136, 0.3)',
          }}
        >
          <p
            className="text-center"
            style={{
              fontSize: 'clamp(18px, 2.5vw, 24px)',
              color: '#ffffff',
              lineHeight: 1.8,
              fontWeight: 300,
            }}
          >
            And there it is—the{' '}
            <strong style={{ color: '#00ff88', fontWeight: 600 }}>
              Aurora Borealis
            </strong>
            ! Brilliant curtains of green and purple light dance across the night sky,
            painting the heavens with Fiery's magnificent energy!
          </p>
        </motion.div>
      </TextOverlay>
    </>
  );
}
