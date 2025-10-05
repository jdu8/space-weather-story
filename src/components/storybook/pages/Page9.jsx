import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { motion } from 'framer-motion';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';
import ShaderAurora from '../effects/ShaderAurora';
import * as THREE from 'three';

// Fiery arriving (happy version)
function FieryArriving({ animationProgress }) {
  const spriteRef = useRef();
  const texture = useLoader(TextureLoader, '/sprites/003_fiery_happy.png');

  useFrame((state) => {
    if (!spriteRef.current) return;
    const time = state.clock.getElapsedTime();
    spriteRef.current.position.y = Math.sin(time * 1.2) * 0.2;
  });

  const xPos = -8 + animationProgress * 8;
  const scale = 2 + animationProgress * 2;

  return (
    <sprite ref={spriteRef} position={[xPos, 1, 2]} scale={[scale, scale, 1]}>
      <spriteMaterial map={texture} transparent />
    </sprite>
  );
}


// Year 1859 title as 3D text
function Year1859Title({ animationProgress }) {
  const opacity = Math.max(0, (animationProgress - 0.2) * 2);

  return null; // Will be rendered as HTML overlay instead
}


// Page 10: 1859 Carrington Event
export default function Page10({ isInView }) {
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
          camera={{ position: [0, 0, 10], fov: 70 }}
        >
          <ShaderAurora
            animationProgress={animationProgress}
            intensity={2.5}
            position={[0, 3.5, -8]}
            scale={[60, 20, 1]}
          />
          <FieryArriving animationProgress={animationProgress} />

          <ambientLight intensity={0.3} />
        </Canvas3D>
      )}

      {/* Year 1859 Title Overlay */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: Math.max(0, (animationProgress - 0.2) * 2),
          scale: animationProgress > 0.2 ? 1 : 0.8
        }}
        transition={{ duration: 0.8 }}
        style={{
          position: 'absolute',
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(64px, 10vw, 120px)',
            fontWeight: 900,
            color: '#fff',
            textShadow: '0 0 60px rgba(255, 0, 100, 0.8), 0 0 100px rgba(255, 0, 100, 0.5)',
            letterSpacing: '0.1em',
            fontFamily: "'Impact', 'Arial Black', sans-serif",
            WebkitTextStroke: '2px rgba(255, 0, 100, 0.5)',
            margin: 0,
          }}
        >
          1859
        </h1>
      </motion.div>

      <TextOverlay position="bottom" isInView={isInView}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: textProgress, y: textProgress > 0 ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="glass-strong px-10 py-8 rounded-2xl max-w-4xl"
          style={{
            background: 'rgba(42, 21, 32, 0.9)',
            backdropFilter: 'blur(16px)',
            border: '2px solid rgba(255, 0, 100, 0.5)',
            boxShadow: '0 0 40px rgba(255, 0, 100, 0.3)',
          }}
        >
          <h3
            className="text-center font-bold mb-4"
            style={{
              fontSize: 'clamp(26px, 3.5vw, 36px)',
              color: '#ff0066',
              textShadow: '0 0 30px rgba(255, 0, 100, 0.6)',
            }}
          >
            The Carrington Event
          </h3>
          <p
            className="text-center"
            style={{
              fontSize: 'clamp(16px, 2.2vw, 22px)',
              color: '#ffffff',
              lineHeight: 1.8,
              fontWeight: 300,
            }}
          >
            September 1859: Fiery created the{' '}
            <strong style={{ color: '#ff0066' }}>most powerful auroras ever recorded</strong>
            ! So bright, people could read newspapers at midnight. Auroras appeared as far south
            as the Caribbean. It was magnificent... but humanity was about to change.
          </p>
        </motion.div>
      </TextOverlay>
    </>
  );
}
