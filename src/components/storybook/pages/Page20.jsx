import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { motion } from 'framer-motion';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';

// Power transformer (protected)
function ProtectedTransformer({ animationProgress }) {
  const texture = useLoader(TextureLoader, '/sprites/011_power_transformer.png');

  return (
    <sprite position={[0, -0.5, 0]} scale={[3, 3, 1]}>
      <spriteMaterial map={texture} transparent opacity={animationProgress} />
    </sprite>
  );
}

// Power plant
function PowerPlant({ animationProgress }) {
  const texture = useLoader(TextureLoader, '/sprites/033_power_plant.png');

  return (
    <sprite position={[0, -2, -2]} scale={[10, 4, 1]}>
      <spriteMaterial map={texture} transparent opacity={animationProgress} />
    </sprite>
  );
}

// Energy flow visualization
function EnergyFlow({ animationProgress }) {
  const particlesRef = useRef();

  useFrame(() => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array;
    const time = Date.now() * 0.002;

    for (let i = 0; i < 50; i++) {
      const i3 = i * 3;
      const t = ((time + i * 0.1) % 1);

      // Flow from center outward
      const angle = (i / 50) * Math.PI * 2;
      const radius = t * 4;

      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = -0.5 + Math.sin(time * 2 + i) * 0.3;
      positions[i3 + 2] = Math.sin(angle) * radius * 0.5;
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const particleCount = 50;
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
        opacity={animationProgress * 0.8}
        sizeAttenuation
      />
    </points>
  );
}

// Protection grid overlay
function ProtectionGrid({ animationProgress }) {
  const gridRef = useRef();

  useFrame((state) => {
    if (!gridRef.current) return;
    const time = state.clock.getElapsedTime();

    gridRef.current.material.opacity = animationProgress * (0.2 + Math.sin(time * 2) * 0.1);
  });

  return (
    <mesh ref={gridRef} position={[0, 0, -1]}>
      <boxGeometry args={[8, 6, 0.1]} />
      <meshBasicMaterial
        color="#00ff88"
        transparent
        opacity={0.2}
        wireframe
      />
    </mesh>
  );
}

// Page 20: Protected Power Grids
export default function Page20({ isInView }) {
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
        <PowerPlant animationProgress={animationProgress} />
        <ProtectedTransformer animationProgress={animationProgress} />
        <EnergyFlow animationProgress={animationProgress} />
        <ProtectionGrid animationProgress={animationProgress} />

        <pointLight position={[0, 0, 3]} intensity={2} color="#00ff88" />
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
            Protecting the Grid
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
            Power grids get upgraded with{' '}
            <strong style={{ color: '#00ff88' }}>surge protection</strong> and smart transformers.
            Grid operators learn to prepare: when a warning comes, they can adjust loads and
            prevent catastrophic failures.
          </p>
        </motion.div>
      </TextOverlay>
    </>
  );
}
