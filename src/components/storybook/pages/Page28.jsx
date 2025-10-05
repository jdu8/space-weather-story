import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { Sphere } from '@react-three/drei';
import { motion } from 'framer-motion';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';

// Future city powered by space energy
function FutureCity({ animationProgress }) {
  const texture = useLoader(TextureLoader, '/sprites/035_future_city.png');

  return (
    <sprite position={[0, -2, -3]} scale={[12, 4, 1]}>
      <spriteMaterial map={texture} transparent opacity={animationProgress} />
    </sprite>
  );
}

// Year 2075 title
function Year2075Title({ animationProgress }) {
  const texture = useLoader(TextureLoader, '/sprites/054_year_2075_title.png');

  return (
    <sprite position={[0, 3, 2]} scale={[6, 1.5, 1]}>
      <spriteMaterial map={texture} transparent opacity={animationProgress} />
    </sprite>
  );
}

// Orbital energy stations
function OrbitalStations({ animationProgress }) {
  const groupRef = useRef();
  const collectorTexture = useLoader(TextureLoader, '/sprites/015_energy_collector.png');

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.003;
  });

  const stations = [];
  const numStations = 8;

  for (let i = 0; i < numStations; i++) {
    const angle = (i / numStations) * Math.PI * 2;
    const radius = 5;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = 1 + Math.sin(angle * 2) * 0.5;

    stations.push(
      <sprite key={i} position={[x, y, z]} scale={[1.5, 1.5, 1]}>
        <spriteMaterial map={collectorTexture} transparent opacity={animationProgress} />
      </sprite>
    );
  }

  return <group ref={groupRef}>{stations}</group>;
}

// Energy beams from stations to Earth
function EnergyBeamsToEarth({ animationProgress }) {
  const beamsRef = useRef();

  useFrame((state) => {
    if (!beamsRef.current) return;
    const time = state.clock.getElapsedTime();

    beamsRef.current.children.forEach((beam, i) => {
      if (beam.material && beam.material.opacity !== undefined) {
        beam.material.opacity = animationProgress * (0.4 + Math.sin(time * 3 + i * 0.5) * 0.2);
      }
    });
  });

  const beams = [];
  const numBeams = 8;

  for (let i = 0; i < numBeams; i++) {
    const angle = (i / numBeams) * Math.PI * 2;
    const radius = 5;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = 1 + Math.sin(angle * 2) * 0.5;

    const points = [
      new THREE.Vector3(x, y, z),
      new THREE.Vector3(0, -2, -3),
    ];

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    beams.push(
      <line key={i} geometry={geometry}>
        <lineBasicMaterial color="#00ff88" transparent opacity={0.4} />
      </line>
    );
  }

  return <group ref={beamsRef}>{beams}</group>;
}

// Clean energy particles flowing
function CleanEnergyFlow({ animationProgress }) {
  const particlesRef = useRef();

  useFrame(() => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array;
    const time = Date.now() * 0.002;

    for (let i = 0; i < 100; i++) {
      const i3 = i * 3;
      const stationIndex = i % 8;
      const angle = (stationIndex / 8) * Math.PI * 2;
      const radius = 5;
      const t = ((time + i * 0.05) % 1);

      const startX = Math.cos(angle) * radius;
      const startY = 1 + Math.sin(angle * 2) * 0.5;
      const startZ = Math.sin(angle) * radius;

      positions[i3] = startX + (0 - startX) * t;
      positions[i3 + 1] = startY + (-2 - startY) * t;
      positions[i3 + 2] = startZ + (-3 - startZ) * t;
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
        size={0.12}
        color="#00ff88"
        transparent
        opacity={animationProgress * 0.9}
        sizeAttenuation
      />
    </points>
  );
}

// Page 28: Future Vision - Year 2075
export default function Page28({ isInView }) {
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (!isInView) {
      setAnimationProgress(0);
      return;
    }

    const duration = 5000;
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
        <Year2075Title animationProgress={animationProgress} />
        <FutureCity animationProgress={animationProgress} />
        <OrbitalStations animationProgress={animationProgress} />
        <EnergyBeamsToEarth animationProgress={animationProgress} />
        <CleanEnergyFlow animationProgress={animationProgress} />

        <pointLight position={[0, 0, 5]} intensity={2} color="#00ff88" />
        <ambientLight intensity={0.5} />
      </Canvas3D>
      )}

      <TextOverlay position="bottom" isInView={isInView}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: textProgress, y: textProgress > 0 ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="glass-strong px-10 py-8 rounded-2xl max-w-4xl"
          style={{
            background: 'rgba(26, 58, 79, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '2px solid rgba(0, 255, 136, 0.6)',
            boxShadow: '0 0 40px rgba(0, 255, 136, 0.3)',
          }}
        >
          <h3
            className="text-center font-bold mb-4"
            style={{
              fontSize: 'clamp(26px, 3.5vw, 36px)',
              color: '#00ff88',
              textShadow: '0 0 30px rgba(0, 255, 136, 0.5)',
            }}
          >
            The Year 2075 🌍
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
            Imagine it: a network of{' '}
            <strong style={{ color: '#00ff88' }}>orbital energy stations</strong> surrounds Earth.
            When a CME arrives, they collect its energy and beam it down to the surface. Cities
            run on clean, renewable power from space. Billions of people benefit from what was
            once feared.
          </p>
        </motion.div>
      </TextOverlay>
    </>
  );
}
