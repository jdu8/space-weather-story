import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';
import * as THREE from 'three';

// Time-lapse evolution of lights
function EvolvingLights({ animationProgress }) {
  const lightsRef = useRef();

  // Campfires -> candles -> gas lamps -> electric lights
  const stage = Math.floor(animationProgress * 4);

  useFrame((state) => {
    if (!lightsRef.current) return;
    const time = state.clock.getElapsedTime();

    lightsRef.current.children.forEach((light, i) => {
      if (light.intensity !== undefined) {
        light.intensity = light.userData.baseIntensity * (1 + Math.sin(time * 2 + i) * 0.1);
      }
    });
  });

  const createLightGrid = (count, spread, color, intensity) => {
    const lights = [];
    const gridSize = Math.sqrt(count);

    for (let i = 0; i < count; i++) {
      const x = ((i % gridSize) / gridSize - 0.5) * spread;
      const z = (Math.floor(i / gridSize) / gridSize - 0.5) * spread - 5;
      const y = -2;

      lights.push(
        <pointLight
          key={i}
          position={[x, y, z]}
          color={color}
          intensity={intensity}
          distance={3}
          userData={{ baseIntensity: intensity }}
        />
      );
    }

    return lights;
  };

  let lights = [];
  let lightColor = '#ff6600';

  if (stage === 0) {
    // Campfires - scattered, warm orange
    lights = createLightGrid(5, 12, '#ff6600', 1.5);
    lightColor = '#ff6600';
  } else if (stage === 1) {
    // Candles - more numerous, dimmer
    lights = createLightGrid(12, 14, '#ffaa44', 0.8);
    lightColor = '#ffaa44';
  } else if (stage === 2) {
    // Gas lamps - brighter, more organized
    lights = createLightGrid(20, 16, '#ffcc66', 1.2);
    lightColor = '#ffcc66';
  } else {
    // Electric lights - grid pattern, bright white
    lights = createLightGrid(40, 20, '#ffffff', 1.5);
    lightColor = '#ffffff';
  }

  return (
    <>
      <group ref={lightsRef}>{lights}</group>
      <mesh position={[0, -3, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[25, 12]} />
        <meshStandardMaterial
          color="#1a1a2e"
          emissive={lightColor}
          emissiveIntensity={animationProgress * 0.1}
        />
      </mesh>
    </>
  );
}

// Silhouette of evolving civilization
function CivilizationSilhouette({ animationProgress }) {
  const stage = Math.floor(animationProgress * 4);

  const shapes = [
    // Stage 0: Simple huts
    [[-4, -2, 0, 1.5, 2], [0, -2, 0, 1.5, 2], [4, -2, 0, 1.5, 2]],
    // Stage 1: Small houses
    [[-5, -2, 0, 2, 2.5], [-1.5, -2, 0, 2, 2.5], [2, -2, 0, 2, 2.5], [5, -2, 0, 1.5, 2]],
    // Stage 2: Buildings
    [[-6, -2, 0, 2, 3.5], [-3, -2, 0, 2.5, 4], [0, -2, 0, 2, 3], [3, -2, 0, 2.5, 4.5], [6, -2, 0, 1.5, 2.5]],
    // Stage 3: Skyscrapers
    [[-6, -2, 0, 1.5, 5], [-4, -2, 0, 1.5, 6.5], [-1, -2, 0, 2, 7], [2, -2, 0, 1.5, 6], [5, -2, 0, 2, 5.5]],
  ];

  const currentShapes = shapes[Math.min(stage, 3)];

  return (
    <group position={[0, 0, -3]}>
      {currentShapes.map(([x, y, z, width, height], i) => (
        <mesh key={i} position={[x, y + height / 2, z]}>
          <boxGeometry args={[width, height, 0.5]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
      ))}
    </group>
  );
}

// Page 9: Humans Evolve
export default function Page9({ isInView }) {
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (!isInView) {
      setAnimationProgress(0);
      return;
    }

    const duration = 6000;
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

  const stage = Math.floor(animationProgress * 4);
  const stageNames = ['Campfires', 'Candles', 'Gas Lamps', 'Electric Lights'];

  return (
    <>
      {isInView && (
        <Canvas3D
        showStars={true}
        showControls={false}
        camera={{ position: [0, 0, 12], fov: 60 }}
      >
        <EvolvingLights animationProgress={animationProgress} />
        <CivilizationSilhouette animationProgress={animationProgress} />

        <ambientLight intensity={0.2} />
      </Canvas3D>
      )}

      <TextOverlay position="bottom" isInView={isInView}>
        <motion.div
          key={stage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-strong px-10 py-6 rounded-2xl max-w-3xl"
          style={{
            background: 'rgba(26, 21, 32, 0.9)',
            backdropFilter: 'blur(16px)',
            border: '2px solid rgba(255, 107, 53, 0.3)',
          }}
        >
          <div className="text-center">
            <motion.div
              className="text-5xl mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5 }}
            >
              {stage === 0 && '🔥'}
              {stage === 1 && '🕯️'}
              {stage === 2 && '💡'}
              {stage === 3 && '⚡'}
            </motion.div>
            <h3
              className="font-bold mb-2"
              style={{
                fontSize: 'clamp(20px, 2.5vw, 28px)',
                color: '#ff8844',
              }}
            >
              {stageNames[Math.min(stage, 3)]}
            </h3>
            <p
              className="text-center"
              style={{
                fontSize: 'clamp(16px, 2vw, 20px)',
                color: '#ffffff',
                lineHeight: 1.7,
                fontWeight: 300,
              }}
            >
              Humanity evolved, creating new ways to light the darkness...
            </p>
          </div>
        </motion.div>
      </TextOverlay>
    </>
  );
}
