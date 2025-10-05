import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { motion } from 'framer-motion';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';

// Space energy collector satellite
function EnergyCollector({ animationProgress }) {
  const spriteRef = useRef();
  const texture = useLoader(TextureLoader, '/sprites/015_energy_collector.png');

  useFrame((state) => {
    if (!spriteRef.current) return;
    const time = state.clock.getElapsedTime();
    spriteRef.current.position.y = Math.sin(time * 0.8) * 0.2;
  });

  return (
    <sprite ref={spriteRef} position={[0, 0, 0]} scale={[4, 4, 1]}>
      <spriteMaterial map={texture} transparent opacity={animationProgress} />
    </sprite>
  );
}

// Energy collector diagram
function CollectorDiagram({ animationProgress }) {
  const texture = useLoader(TextureLoader, '/sprites/050_energy_collector_diagram.png');

  return (
    <sprite position={[0, 0, -3]} scale={[8, 6, 1]}>
      <spriteMaterial map={texture} transparent opacity={animationProgress * 0.7} />
    </sprite>
  );
}

// Incoming plasma particles being collected
function CollectedPlasmaParticles({ animationProgress }) {
  const particlesRef = useRef();

  useFrame(() => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array;
    const time = Date.now() * 0.002;

    for (let i = 0; i < 100; i++) {
      const i3 = i * 3;
      const angle = (i / 100) * Math.PI * 2;
      const t = ((time + i * 0.05) % 1);

      // Particles spiral into collector
      const radius = (1 - t) * 6;
      const spiralY = t * 2 - 1;

      positions[i3] = Math.cos(angle + time * 2) * radius;
      positions[i3 + 1] = spiralY;
      positions[i3 + 2] = Math.sin(angle + time * 2) * radius * 0.5;
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
        color="#ff8844"
        transparent
        opacity={animationProgress * 0.8}
        sizeAttenuation
      />
    </points>
  );
}

// Energy collection field visualization
function CollectionField({ animationProgress }) {
  const fieldRef = useRef();

  useFrame((state) => {
    if (!fieldRef.current) return;
    const time = state.clock.getElapsedTime();

    fieldRef.current.rotation.y = time * 0.5;
    const pulse = 1 + Math.sin(time * 2) * 0.1;
    fieldRef.current.scale.setScalar(pulse);
  });

  return (
    <group ref={fieldRef}>
      {[...Array(3)].map((_, i) => (
        <mesh key={i} position={[0, 0, 0]} rotation={[0, (i / 3) * Math.PI * 2, 0]}>
          <torusGeometry args={[2 + i * 0.5, 0.05, 16, 32]} />
          <meshBasicMaterial
            color="#00ff88"
            transparent
            opacity={animationProgress * 0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

// Page 26: Space Collectors Concept
export default function Page26({ isInView }) {
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
        <CollectorDiagram animationProgress={animationProgress} />
        <EnergyCollector animationProgress={animationProgress} />
        <CollectedPlasmaParticles animationProgress={animationProgress} />
        <CollectionField animationProgress={animationProgress} />

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
            background: 'rgba(26, 58, 79, 0.9)',
            backdropFilter: 'blur(16px)',
            border: '2px solid rgba(0, 255, 136, 0.5)',
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
            Orbital Energy Harvesters 🛰️
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
            They imagine{' '}
            <strong style={{ color: '#00ff88' }}>massive orbital collectors</strong>—satellites
            with electromagnetic fields that can capture CME particles and convert their kinetic
            energy into electricity. Like cosmic wind farms in space!
          </p>
        </motion.div>
      </TextOverlay>
    </>
  );
}
