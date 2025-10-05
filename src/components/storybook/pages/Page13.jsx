import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { motion } from 'framer-motion';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';

// Fiery arriving (same as always)
function FieryArriving({ animationProgress }) {
  const spriteRef = useRef();
  const texture = useLoader(TextureLoader, '/sprites/003_fiery_happy.png');

  useFrame((state) => {
    if (!spriteRef.current) return;
    const time = state.clock.getElapsedTime();
    spriteRef.current.position.y = Math.sin(time * 1.2) * 0.2;
  });

  return (
    <sprite ref={spriteRef} position={[0, 0, 2]} scale={[4, 4, 1]}>
      <spriteMaterial map={texture} transparent opacity={animationProgress} />
    </sprite>
  );
}

// Page 13: Modern CME Strike
export default function Page13({ isInView }) {
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

  const textProgress = Math.max(0, Math.min(animationProgress * 2, 1));

  return (
    <>
      {isInView && (
        <Canvas3D
        showStars={true}
        showControls={false}
        camera={{ position: [0, 0, 8], fov: 60 }}
      >
        <FieryArriving animationProgress={animationProgress} />
        <pointLight position={[0, 0, 5]} intensity={2} color="#ff8844" />
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
            background: 'rgba(42, 21, 32, 0.9)',
            backdropFilter: 'blur(16px)',
            border: '2px solid rgba(255, 107, 53, 0.3)',
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
            And here comes Fiery again—doing exactly what she's{' '}
            <strong style={{ color: '#ff8844' }}>always</strong> done. The same beautiful dance
            through space, the same arrival at Earth... but this time, everything is different.
          </p>
        </motion.div>
      </TextOverlay>
    </>
  );
}
