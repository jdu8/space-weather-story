import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { motion } from 'framer-motion';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';
import ThreeJSEarth from '../effects/ThreeJSEarth';
import * as THREE from 'three';

// Multiple satellites orbiting
function OrbitingSatellites({ animationProgress }) {
  const groupRef = useRef();
  const satelliteTexture = useLoader(TextureLoader, '/sprites/060_satalite.png');

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    groupRef.current.children.forEach((sprite, i) => {
      const angle = (i / 12) * Math.PI * 2 + time * 0.3;
      const radius = 3.5 + (i % 3) * 0.5;
      const x = Math.cos(angle) * radius;
      const z = -3 + Math.sin(angle) * radius;
      const y = (Math.sin(angle * 2) - 0.5) * 1.5;
      sprite.position.set(x, y, z);
      sprite.rotation.y = -angle; // slight facing direction
    });
  });

  const satellites = [];
  const numSatellites = 12;

  for (let i = 0; i < numSatellites; i++) {
    satellites.push(
      <sprite key={i} scale={[0.8, 0.8, 1]}>
        <spriteMaterial map={satelliteTexture} transparent opacity={animationProgress} depthTest depthWrite={false} />
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

  return null; // removed colored blobs
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
        <>
          <Canvas3D
            showStars={true}
            showControls={false}
            camera={{ position: [0, 0, 10], fov: 60 }}
          >
            <OrbitingSatellites animationProgress={animationProgress} />
            <ambientLight intensity={0.6} />
          </Canvas3D>
          <ThreeJSEarth
            width={480}
            height={480}
            position="absolute"
            left="50%"
            top="50%"
            opacity={1}
            rotationSpeed={0.006}
            className="translate-center"
          />
        </>
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
