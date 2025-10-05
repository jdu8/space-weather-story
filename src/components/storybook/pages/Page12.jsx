import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Sphere } from '@react-three/drei';
import { motion } from 'framer-motion';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';
import * as THREE from 'three';

// Earth with satellites
function EarthWithSatellites({ animationProgress }) {
  const earthRef = useRef();
  const texture = useLoader(TextureLoader, '/sprites/026_earth_from_space.png');

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002;
    }
  });

  return (
    <Sphere ref={earthRef} args={[2, 64, 64]} position={[0, 0, -3]}>
      <meshStandardMaterial map={texture} />
    </Sphere>
  );
}

// Multiple satellites orbiting
function OrbitingSatellites({ animationProgress }) {
  const groupRef = useRef();
  const satelliteTexture = useLoader(TextureLoader, '/sprites/010_satellite_hardened.png');

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.01;
  });

  const satellites = [];
  const numSatellites = 12;

  for (let i = 0; i < numSatellites; i++) {
    const angle = (i / numSatellites) * Math.PI * 2;
    const radius = 3.5 + (i % 3) * 0.5;
    const x = Math.cos(angle) * radius;
    const z = -3 + Math.sin(angle) * radius;
    const y = (Math.sin(angle * 2) - 0.5) * 1.5;

    satellites.push(
      <sprite key={i} position={[x, y, z]} scale={[0.8, 0.8, 1]}>
        <spriteMaterial map={satelliteTexture} transparent opacity={animationProgress} />
      </sprite>
    );
  }

  return <group ref={groupRef}>{satellites}</group>;
}

// Technology icons floating around
function TechIcons({ animationProgress }) {
  const iconsRef = useRef();

  useFrame((state) => {
    if (!iconsRef.current) return;
    const time = state.clock.getElapsedTime();

    iconsRef.current.children.forEach((icon, i) => {
      icon.position.y = icon.userData.baseY + Math.sin(time + i) * 0.2;
    });
  });

  const iconPositions = [
    [-5, 2, 2],
    [5, 2, 2],
    [-5, -2, 2],
    [5, -2, 2],
  ];

  return (
    <group ref={iconsRef}>
      {iconPositions.map((pos, i) => (
        <mesh
          key={i}
          position={pos}
          userData={{ baseY: pos[1] }}
        >
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#00d9ff' : '#ff6b35'}
            emissive={i % 2 === 0 ? '#00d9ff' : '#ff6b35'}
            emissiveIntensity={animationProgress * 0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

// Page 12: The Technological Explosion
export default function Page12({ isInView }) {
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
        <EarthWithSatellites animationProgress={animationProgress} />
        <OrbitingSatellites animationProgress={animationProgress} />
        <TechIcons animationProgress={animationProgress} />

        <pointLight position={[5, 5, 5]} intensity={2} color="#00d9ff" />
        <pointLight position={[-5, -5, 5]} intensity={2} color="#ff6b35" />
        <ambientLight intensity={0.4} />
      </Canvas3D>
      )}

      <TextOverlay position="bottom" isInView={isInView}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: textProgress, y: textProgress > 0 ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="glass-strong px-10 py-8 rounded-2xl max-w-3xl"
          style={{
            background: 'rgba(42, 21, 32, 0.9)',
            backdropFilter: 'blur(16px)',
            border: '2px solid rgba(0, 217, 255, 0.4)',
            boxShadow: '0 0 30px rgba(0, 217, 255, 0.2)',
          }}
        >
          <h3
            className="text-center font-bold mb-4"
            style={{
              fontSize: 'clamp(24px, 3vw, 32px)',
              color: '#00d9ff',
              textShadow: '0 0 20px rgba(0, 217, 255, 0.4)',
            }}
          >
            The Technology Age
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
            Fast forward to today. Earth's orbit is crowded with{' '}
            <strong style={{ color: '#00d9ff' }}>satellites</strong>, GPS networks, power grids,
            and the internet. Billions depend on technology every single day...
          </p>
        </motion.div>
      </TextOverlay>
    </>
  );
}
