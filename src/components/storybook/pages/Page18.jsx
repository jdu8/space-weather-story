import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { motion } from 'framer-motion';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';
import * as THREE from 'three';

// Early warning system diagram
function WarningSystemDiagram({ animationProgress }) {
  const texture = useLoader(TextureLoader, '/sprites/051_early_warning_system_diagram.png');

  return (
    <sprite position={[0, 0.5, 0]} scale={[8, 6, 1]}>
      <spriteMaterial map={texture} transparent opacity={animationProgress} />
    </sprite>
  );
}

// Mission control
function MissionControl({ animationProgress }) {
  const texture = useLoader(TextureLoader, '/sprites/034_mission_control.png');

  return (
    <sprite position={[0, -2, 1]} scale={[10, 3, 1]}>
      <spriteMaterial map={texture} transparent opacity={animationProgress} />
    </sprite>
  );
}

// Alert indicators
function AlertIndicators({ animationProgress }) {
  const indicatorsRef = useRef();

  useFrame((state) => {
    if (!indicatorsRef.current) return;
    const time = state.clock.getElapsedTime();

    indicatorsRef.current.children.forEach((indicator, i) => {
      if (indicator.scale) {
        const pulse = 1 + Math.sin(time * 3 + i * 0.5) * 0.15;
        indicator.scale.setScalar(pulse * 0.4);
      }
    });
  });

  const positions = [
    [-3, 2, 1],
    [0, 2.5, 1],
    [3, 2, 1],
  ];

  return (
    <group ref={indicatorsRef}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={animationProgress * 1.5}
            transparent
            opacity={animationProgress}
          />
        </mesh>
      ))}
    </group>
  );
}

// Countdown timer effect
function CountdownDisplay({ animationProgress }) {
  const hours = Math.max(0, Math.floor((1 - animationProgress) * 72));

  return (
    <mesh position={[0, 1.5, 2]}>
      <planeGeometry args={[3, 0.8]} />
      <meshBasicMaterial
        color="#00ff88"
        transparent
        opacity={animationProgress * 0.5}
      />
    </mesh>
  );
}

// Page 18: Early Warning Systems
export default function Page18({ isInView }) {
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
        <WarningSystemDiagram animationProgress={animationProgress} />
        <MissionControl animationProgress={animationProgress} />
        <AlertIndicators animationProgress={animationProgress} />
        <CountdownDisplay animationProgress={animationProgress} />

        <pointLight position={[0, 2, 3]} intensity={2} color="#00ff88" />
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
            border: '2px solid rgba(0, 255, 136, 0.4)',
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
            Early Warning Systems
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
            And then—a breakthrough! Scientists can now{' '}
            <strong style={{ color: '#00ff88' }}>predict Fiery's arrival 1-3 days ahead</strong>.
            When they see an eruption on the Sun, they can warn the world: "Fiery is coming.
            Get ready."
          </p>
        </motion.div>
      </TextOverlay>
    </>
  );
}
