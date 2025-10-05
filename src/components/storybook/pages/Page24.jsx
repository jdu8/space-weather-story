import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { motion } from 'framer-motion';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';
import ShaderAurora from '../effects/ShaderAurora';

// Fiery dancing (happy again)
function FieryDancing({ animationProgress }) {
  const spriteRef = useRef();
  const texture = useLoader(TextureLoader, '/sprites/005_fiery_dancing.png');

  useFrame((state) => {
    if (!spriteRef.current) return;
    const time = state.clock.getElapsedTime();

    // Dancing motion
    spriteRef.current.position.y = Math.sin(time * 2) * 0.3;
    spriteRef.current.rotation.z = Math.sin(time * 1.5) * 0.1;
    spriteRef.current.position.x = Math.sin(time * 0.8) * 0.5;
  });

  return (
    <sprite ref={spriteRef} position={[0, 0, 2]} scale={[4, 4, 1]}>
      <spriteMaterial map={texture} transparent opacity={animationProgress} />
    </sprite>
  );
}


// Page 24: Prepared Aurora - Beautiful lights return, humanity is ready
export default function Page24({ isInView }) {
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (!isInView) {
      setAnimationProgress(0);
      return;
    }

    const duration = 5000;
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
          {/* Full-width ShaderAurora like Page 6 */}
          <ShaderAurora
            animationProgress={animationProgress}
            colors={['#00ff88', '#b47aff', '#00ffff']}
            intensity={1.0}
            position={[0, 3.5, -5]}
            scale={[50, 15, 1]}
          />
          <FieryDancing animationProgress={animationProgress} />

          <pointLight position={[0, 3, 3]} intensity={1.5} color="#00ff88" />
          <ambientLight intensity={0.4} />
        </Canvas3D>
      )}

      <TextOverlay position="bottom" isInView={isInView}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: textProgress, y: textProgress > 0 ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="glass-strong px-10 py-8 rounded-2xl max-w-4xl"
          style={{
            background: 'rgba(26, 42, 58, 0.9)',
            backdropFilter: 'blur(16px)',
            border: '2px solid rgba(0, 255, 136, 0.5)',
            boxShadow: '0 0 40px rgba(0, 255, 136, 0.3)',
          }}
        >
          <h3
            className="text-center font-bold mb-4"
            style={{
              fontSize: 'clamp(26px, 3.5vw, 36px)',
              color: '#00ff88',
              textShadow: '0 0 30px rgba(0, 255, 136, 0.5)',
            }}
          >
            The Aurora Returns 🌌
          </h3>
          <p
            className="text-center mb-4"
            style={{
              fontSize: 'clamp(16px, 2.2vw, 20px)',
              color: '#ffffff',
              lineHeight: 1.8,
              fontWeight: 300,
            }}
          >
            And when Fiery arrives now, the auroras are just as beautiful as they've always been.
            People gather to watch the dancing lights—but this time,{' '}
            <strong style={{ color: '#00ff88' }}>humanity is ready</strong>.
          </p>
          <p
            className="text-center italic"
            style={{
              fontSize: 'clamp(16px, 2vw, 18px)',
              color: '#b47aff',
              lineHeight: 1.8,
            }}
          >
            No fear. No panic. Just wonder, preparation, and resilience.
          </p>
        </motion.div>
      </TextOverlay>
    </>
  );
}
