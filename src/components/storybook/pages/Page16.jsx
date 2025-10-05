import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { motion } from 'framer-motion';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';
import ShaderAurora from '../effects/ShaderAurora';

// Fiery confused
function FieryConfused({ animationProgress }) {
  const spriteRef = useRef();
  const texture = useLoader(TextureLoader, '/sprites/004_fiery_confused.png');

  useFrame((state) => {
    if (!spriteRef.current) return;
    const time = state.clock.getElapsedTime();

    // Gentle swaying (confused body language)
    spriteRef.current.rotation.z = Math.sin(time * 0.8) * 0.05;
    spriteRef.current.position.y = Math.sin(time * 1.2) * 0.15;
  });

  return (
    <sprite ref={spriteRef} position={[0, 0, 2]} scale={[5, 5, 1]}>
      <spriteMaterial map={texture} transparent opacity={animationProgress} />
    </sprite>
  );
}


// Page 16: Fiery's Confusion
export default function Page16({ isInView }) {
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
  const questionProgress = Math.max(0, (animationProgress - 0.5) * 2);

  return (
    <>
      {isInView && (
        <Canvas3D
        showStars={true}
        showControls={false}
        camera={{ position: [0, 0, 8], fov: 60 }}
      >
        <ShaderAurora
          animationProgress={animationProgress}
          colors={['#00ff88', '#b47aff', '#00ffff']}
          intensity={0.6}
          position={[0, 1, -8]}
          scale={[40, 12, 1]}
        />
        <FieryConfused animationProgress={animationProgress} />

        <pointLight position={[0, 0, 5]} intensity={1} color="#ff8844" />
        <ambientLight intensity={0.3} />
      </Canvas3D>
      )}

      <TextOverlay position="bottom" isInView={isInView}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: textProgress, y: textProgress > 0 ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="glass-strong px-10 py-8 rounded-2xl max-w-4xl"
          style={{
            background: 'rgba(42, 21, 32, 0.9)',
            backdropFilter: 'blur(16px)',
            border: '2px solid rgba(255, 170, 0, 0.4)',
            boxShadow: '0 0 30px rgba(255, 170, 0, 0.2)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: questionProgress,
              scale: questionProgress > 0 ? 1 : 0.9,
            }}
            transition={{ delay: 0.3 }}
            className="text-center mb-4"
          >
            <div
              className="inline-block text-6xl mb-4"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(255, 170, 0, 0.4))',
              }}
            >
              🤔
            </div>
          </motion.div>
          <h3
            className="text-center font-bold mb-4"
            style={{
              fontSize: 'clamp(24px, 3vw, 32px)',
              color: '#ffaa00',
              textShadow: '0 0 20px rgba(255, 170, 0, 0.4)',
              fontFamily: "'Fredoka', 'Comic Sans MS', cursive",
            }}
          >
            "Why are they scared?"
          </h3>
          <p
            className="text-center italic"
            style={{
              fontSize: 'clamp(16px, 2.2vw, 20px)',
              color: '#ffffff',
              lineHeight: 1.8,
              fontWeight: 300,
            }}
          >
            "I'm doing the same thing I've always done. I still make the beautiful auroras...
            They used to <strong style={{ color: '#00ff88' }}>dance</strong> when I visited.
            They used to <strong style={{ color: '#00ff88' }}>celebrate</strong>. What changed?"
          </p>
        </motion.div>
      </TextOverlay>
    </>
  );
}
