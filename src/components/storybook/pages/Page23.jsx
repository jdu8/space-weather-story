import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { Sphere } from '@react-three/drei';
import { motion } from 'framer-motion';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';

// Earth with protected infrastructure
function ProtectedEarth({ animationProgress }) {
  const earthRef = useRef();
  const texture = useLoader(TextureLoader, '/sprites/026_earth_from_space.png');

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002;
    }
  });

  return (
    <Sphere ref={earthRef} args={[2.5, 64, 64]} position={[0, 0, -3]}>
      <meshStandardMaterial map={texture} />
    </Sphere>
  );
}

// Shield grid around Earth
function InfrastructureShield({ animationProgress }) {
  const shieldRef = useRef();

  useFrame((state) => {
    if (!shieldRef.current) return;
    const time = state.clock.getElapsedTime();

    shieldRef.current.rotation.y = time * 0.1;
    const pulse = 1 + Math.sin(time * 2) * 0.05;
    shieldRef.current.scale.setScalar(pulse);
  });

  return (
    <group ref={shieldRef} position={[0, 0, -3]}>
      <Sphere args={[3.2, 32, 32]}>
        <meshBasicMaterial
          color="#00ff88"
          transparent
          opacity={animationProgress * 0.15}
          wireframe
        />
      </Sphere>
    </group>
  );
}

// Protected systems icons orbiting
function ProtectedSystems({ animationProgress }) {
  const systemsRef = useRef();

  useFrame((state) => {
    if (!systemsRef.current) return;
    systemsRef.current.rotation.y += 0.008;
  });

  const systems = [
    { color: '#00d9ff', icon: '🛰️' },   // Satellites
    { color: '#00ff88', icon: '⚡' },   // Power
    { color: '#ffaa00', icon: '📡' },   // Communications
    { color: '#b47aff', icon: '🔒' },   // Security
  ];

  return (
    <group ref={systemsRef} position={[0, 0, -3]}>
      {systems.map((system, i) => {
        const angle = (i / systems.length) * Math.PI * 2;
        const radius = 4;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(angle * 2) * 0.5;

        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial
              color={system.color}
              emissive={system.color}
              emissiveIntensity={animationProgress * 1}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Resilience network connections
function ResilienceNetwork({ animationProgress }) {
  const linesRef = useRef();

  useFrame((state) => {
    if (!linesRef.current) return;
    const time = state.clock.getElapsedTime();

    linesRef.current.children.forEach((line, i) => {
      if (line.material && line.material.opacity !== undefined) {
        line.material.opacity = animationProgress * (0.3 + Math.sin(time * 2 + i * 0.5) * 0.2);
      }
    });
  });

  const systems = 4;
  const lines = [];

  for (let i = 0; i < systems; i++) {
    for (let j = i + 1; j < systems; j++) {
      const angle1 = (i / systems) * Math.PI * 2;
      const angle2 = (j / systems) * Math.PI * 2;
      const radius = 4;

      const x1 = Math.cos(angle1) * radius;
      const z1 = Math.sin(angle1) * radius;
      const y1 = Math.sin(angle1 * 2) * 0.5;

      const x2 = Math.cos(angle2) * radius;
      const z2 = Math.sin(angle2) * radius;
      const y2 = Math.sin(angle2 * 2) * 0.5;

      const points = [
        new THREE.Vector3(x1, y1, z1 - 3),
        new THREE.Vector3(x2, y2, z2 - 3),
      ];

      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      lines.push(
        <line key={`${i}-${j}`} geometry={geometry}>
          <lineBasicMaterial color="#00ff88" transparent opacity={0.3} />
        </line>
      );
    }
  }

  return <group ref={linesRef}>{lines}</group>;
}

// Page 23: Infrastructure Resilience
export default function Page23({ isInView }) {
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
        camera={{ position: [0, 0, 12], fov: 60 }}
      >
        <ProtectedEarth animationProgress={animationProgress} />
        <InfrastructureShield animationProgress={animationProgress} />
        <ProtectedSystems animationProgress={animationProgress} />
        <ResilienceNetwork animationProgress={animationProgress} />

        <pointLight position={[0, 0, 5]} intensity={2} color="#00ff88" />
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
            A Resilient World
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
            Modern infrastructure is designed to{' '}
            <strong style={{ color: '#00ff88' }}>survive solar storms</strong>. Systems work
            together, backing each other up. What once caused panic now becomes manageable.
            Humanity learned to live <em>with</em> space weather.
          </p>
        </motion.div>
      </TextOverlay>
    </>
  );
}
