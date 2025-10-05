import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';

// Undersea cable network
function UnderseaCables({ animationProgress }) {
  const cablesRef = useRef();

  useFrame((state) => {
    if (!cablesRef.current) return;
    const time = state.clock.getElapsedTime();

    cablesRef.current.children.forEach((cable, i) => {
      if (cable.material && cable.material.opacity !== undefined) {
        cable.material.opacity = animationProgress * (0.5 + Math.sin(time * 2 + i) * 0.2);
      }
    });
  });

  const cables = [];
  const numCables = 8;

  for (let i = 0; i < numCables; i++) {
    const points = [];
    const startX = -6 + i * 1.5;
    const startY = -2;

    for (let j = 0; j <= 20; j++) {
      const t = j / 20;
      const x = startX + t * 12;
      const y = startY + Math.sin(t * Math.PI * 2 + i) * 0.3;
      const z = -3;

      points.push(new THREE.Vector3(x, y, z));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    cables.push(
      <line key={i} geometry={geometry}>
        <lineBasicMaterial color="#00d9ff" transparent opacity={0.6} linewidth={2} />
      </line>
    );
  }

  return <group ref={cablesRef}>{cables}</group>;
}

// Data flow particles along cables
function DataFlowParticles({ animationProgress }) {
  const particlesRef = useRef();

  useFrame(() => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array;
    const time = Date.now() * 0.002;

    for (let i = 0; i < 100; i++) {
      const i3 = i * 3;
      const cableIndex = i % 8;
      const t = ((time + i * 0.05) % 1);

      const startX = -6 + cableIndex * 1.5;
      const x = startX + t * 12;
      const y = -2 + Math.sin(t * Math.PI * 2 + cableIndex) * 0.3;
      const z = -3;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#00ff88"
        transparent
        opacity={animationProgress * 0.9}
        sizeAttenuation
      />
    </points>
  );
}

// Satellite communication backup (in orbit)
function BackupSatellites({ animationProgress }) {
  const groupRef = useRef();

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.005;
  });

  const satellites = [];
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const radius = 4;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = 2;

    satellites.push(
      <mesh key={i} position={[x, y, z]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial
          color="#00d9ff"
          emissive="#00d9ff"
          emissiveIntensity={animationProgress * 0.8}
        />
      </mesh>
    );
  }

  return <group ref={groupRef}>{satellites}</group>;
}

// Page 22: Communication Backups
export default function Page22({ isInView }) {
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
        <UnderseaCables animationProgress={animationProgress} />
        <DataFlowParticles animationProgress={animationProgress} />
        <BackupSatellites animationProgress={animationProgress} />

        <pointLight position={[0, 0, 3]} intensity={2} color="#00d9ff" />
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
            Building Redundancy
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
            Communication networks get{' '}
            <strong style={{ color: '#00d9ff' }}>backup systems</strong>: undersea cables,
            ground-based networks, and redundant satellites. If one system fails during a solar
            storm, others keep the world connected.
          </p>
        </motion.div>
      </TextOverlay>
    </>
  );
}
