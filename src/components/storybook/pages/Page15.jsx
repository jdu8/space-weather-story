import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { motion } from 'framer-motion';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';

// City skyline
function CitySkyline({ animationProgress }) {
  const texture = useLoader(TextureLoader, '/sprites/032_city_skyline_night.png');

  return (
    <sprite position={[0, -1, -3]} scale={[12, 4, 1]}>
      <spriteMaterial map={texture} transparent opacity={animationProgress} />
    </sprite>
  );
}

// Flickering lights effect
function FlickeringLights({ animationProgress }) {
  const lightsRef = useRef();

  useFrame((state) => {
    if (!lightsRef.current) return;
    const time = state.clock.getElapsedTime();

    // Random flickering
    lightsRef.current.children.forEach((light, i) => {
      if (light.intensity !== undefined) {
        const flicker = Math.random() > 0.7 ? 0 : 1;
        light.intensity = flicker * (0.5 + Math.sin(time * 5 + i) * 0.3);
      }
    });
  });

  const lights = [];
  for (let i = 0; i < 15; i++) {
    lights.push(
      <pointLight
        key={i}
        position={[(i - 7) * 0.8, -1 + Math.random() * 2, -2]}
        color="#ff6b35"
        intensity={0.5}
        distance={2}
      />
    );
  }

  return <group ref={lightsRef}>{lights}</group>;
}

// Alert/warning text overlay
function AlertOverlay({ animationProgress }) {
  const alertProgress = Math.max(0, (animationProgress - 0.3) * 1.43);

  return (
    <mesh position={[0, 2, 0]}>
      <planeGeometry args={[6, 1]} />
      <meshBasicMaterial
        color="#ff0033"
        transparent
        opacity={alertProgress * 0.3 * (Math.sin(Date.now() * 0.005) * 0.3 + 0.7)}
      />
    </mesh>
  );
}

// Page 15: Human Fear
export default function Page15({ isInView }) {
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
        showStars={false}
        showControls={false}
        camera={{ position: [0, 0, 8], fov: 60 }}
        backgroundColor="#0a0510"
      >
        <CitySkyline animationProgress={animationProgress} />
        <FlickeringLights animationProgress={animationProgress} />
        <AlertOverlay animationProgress={animationProgress} />

        <ambientLight intensity={0.1} />
      </Canvas3D>
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
            🚨 SOLAR STORM WARNING 🚨
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
            News alerts flash across every screen. Emergency broadcasts interrupt regular
            programming. Cities brace for blackouts. People panic as they realize how fragile
            their connected world really is.
          </p>
        </motion.div>
      </TextOverlay>
    </>
  );
}
