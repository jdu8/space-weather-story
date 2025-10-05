import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { motion } from 'framer-motion';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';

// Science guy bobbing
function ScienceGuyBobbing({ animationProgress }) {
  const spriteRef = useRef();
  const texture = useLoader(TextureLoader, '/sprites/061_science_guy.png');

  useFrame((state) => {
    if (!spriteRef.current) return;
    const time = state.clock.getElapsedTime();

    // Gentle bobbing motion
    spriteRef.current.position.y = Math.sin(time * 1.5) * 0.3;
  });

  return (
    <sprite ref={spriteRef} position={[0, 0, 2]} scale={[5, 5, 1]}>
      <spriteMaterial map={texture} transparent opacity={animationProgress} />
    </sprite>
  );
}

// Page 25: Scientists Dream
export default function Page25({ isInView }) {
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
          camera={{ position: [0, 0, 10], fov: 60 }}
        >
          <ScienceGuyBobbing animationProgress={animationProgress} />

          <pointLight position={[0, 2, 3]} intensity={2} color="#ffaa00" />
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
            background: 'rgba(26, 58, 79, 0.9)',
            backdropFilter: 'blur(16px)',
            border: '2px solid rgba(255, 170, 0, 0.5)',
            boxShadow: '0 0 30px rgba(255, 170, 0, 0.2)',
          }}
        >
          <h3
            className="text-center font-bold mb-4"
            style={{
              fontSize: 'clamp(24px, 3vw, 32px)',
              color: '#ffaa00',
              textShadow: '0 0 20px rgba(255, 170, 0, 0.4)',
            }}
          >
            What If...? 💡
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
            But some scientists started asking a new question: "What if we could do more than just{' '}
            <em>survive</em> Fiery's visits? What if we could{' '}
            <strong style={{ color: '#ffaa00' }}>capture this energy</strong>? Billions of tons
            of plasma, traveling at incredible speeds—what if we could turn it into power?"
          </p>
        </motion.div>
      </TextOverlay>
    </>
  );
}
