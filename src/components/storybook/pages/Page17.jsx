import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { Sphere } from '@react-three/drei';
import { motion } from 'framer-motion';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';

// Sun being observed
function ObservedSun({ animationProgress }) {
  const sunRef = useRef();

  useFrame((state) => {
    if (!sunRef.current) return;
    sunRef.current.rotation.y += 0.005;
  });

  return (
    <Sphere ref={sunRef} args={[2.5, 64, 64]} position={[0, 0, -5]}>
      <meshStandardMaterial
        color="#ff6b35"
        emissive="#ffd700"
        emissiveIntensity={animationProgress * 0.8}
      />
    </Sphere>
  );
}

// Scientist observing
function ScientistObserving({ animationProgress }) {
  const texture = useLoader(TextureLoader, '/sprites/020_scientist_observing.png');

  return (
    <sprite position={[-3, -1, 2]} scale={[2.5, 3, 1]}>
      <spriteMaterial map={texture} transparent opacity={animationProgress} />
    </sprite>
  );
}

// Space telescopes (SOHO, SDO)
function SpaceTelescopes({ animationProgress }) {
  const texture = useLoader(TextureLoader, '/sprites/014_space_station_iss.png');

  return (
    <>
      <sprite position={[3, 1, 1]} scale={[1.5, 1.5, 1]}>
        <spriteMaterial map={texture} transparent opacity={animationProgress} />
      </sprite>
      <sprite position={[4, -0.5, 0]} scale={[1.2, 1.2, 1]}>
        <spriteMaterial map={texture} transparent opacity={animationProgress} />
      </sprite>
    </>
  );
}

// Observation lines from telescopes to Sun
function ObservationLines({ animationProgress }) {
  const linesRef = useRef();

  useFrame((state) => {
    if (!linesRef.current) return;
    const time = state.clock.getElapsedTime();

    linesRef.current.children.forEach((line, i) => {
      if (line.material && line.material.opacity !== undefined) {
        line.material.opacity = animationProgress * (0.3 + Math.sin(time * 2 + i) * 0.2);
      }
    });
  });

  const lines = [
    { from: [3, 1, 1], to: [0, 0, -5] },
    { from: [4, -0.5, 0], to: [0, 0, -5] },
  ];

  return (
    <group ref={linesRef}>
      {lines.map((line, i) => {
        const points = [
          new THREE.Vector3(...line.from),
          new THREE.Vector3(...line.to),
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        return (
          <line key={i} geometry={geometry}>
            <lineBasicMaterial color="#00d9ff" transparent opacity={0.5} />
          </line>
        );
      })}
    </group>
  );
}

// Page 17: Scientists Observe
export default function Page17({ isInView }) {
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
        <ObservedSun animationProgress={animationProgress} />
        <ScientistObserving animationProgress={animationProgress} />
        <SpaceTelescopes animationProgress={animationProgress} />
        <ObservationLines animationProgress={animationProgress} />

        <pointLight position={[0, 0, -3]} intensity={2} color="#ff8844" />
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
            The Scientists Step In
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
            But humanity didn't give up. Scientists launched{' '}
            <strong style={{ color: '#00d9ff' }}>space telescopes</strong> like SOHO and SDO to
            watch the Sun constantly, studying every flare, every eruption. They wanted to
            <em> understand</em> Fiery.
          </p>
        </motion.div>
      </TextOverlay>
    </>
  );
}
