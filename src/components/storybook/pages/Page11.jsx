import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { motion } from 'framer-motion';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';
import * as THREE from 'three';

// Telegraph pole
function TelegraphPole({ position, animationProgress }) {
  const texture = useLoader(TextureLoader, '/sprites/007_telegraph_pole.png');

  return (
    <sprite position={position} scale={[2.5, 3.5, 1]}>
      <spriteMaterial map={texture} transparent opacity={animationProgress} />
    </sprite>
  );
}

// Sparking telegraph
function SparkingTelegraph({ animationProgress }) {
  const texture = useLoader(TextureLoader, '/sprites/008_telegraph_sparking.png');
  const sparkRef = useRef();

  useFrame((state) => {
    if (!sparkRef.current) return;
    const time = state.clock.getElapsedTime();

    // Flickering effect
    const flicker = Math.sin(time * 20) * 0.3 + 0.7;
    sparkRef.current.material.opacity = animationProgress * flicker;
  });

  return (
    <sprite ref={sparkRef} position={[0, -0.5, 1]} scale={[3, 3, 1]}>
      <spriteMaterial map={texture} transparent blending={THREE.AdditiveBlending} />
    </sprite>
  );
}

// Electric spark particles
function SparkParticles({ animationProgress }) {
  const particlesRef = useRef();

  useFrame(() => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array;
    const time = Date.now() * 0.003;

    for (let i = 0; i < 80; i++) {
      const i3 = i * 3;
      const angle = (i / 80) * Math.PI * 2;
      const radius = ((time + i * 0.1) % 1.5) * 2;

      positions[i3] = Math.cos(angle + time * 2) * radius;
      positions[i3 + 1] = -0.5 + Math.sin(time * 5 + i) * 0.8;
      positions[i3 + 2] = 1 + Math.sin(angle + time * 2) * radius * 0.5;
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const particleCount = 80;
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
        color="#00d9ff"
        transparent
        opacity={animationProgress * 0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Page 11: Telegraph Chaos
export default function Page11({ isInView }) {
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
  const sparkProgress = Math.max(0, (animationProgress - 0.4) * 1.67);

  return (
    <>
      {isInView && (
        <Canvas3D
        showStars={false}
        showControls={false}
        camera={{ position: [0, 0, 8], fov: 60 }}
        backgroundColor="#1a0a0a"
      >
        <TelegraphPole position={[-4, 0, -1]} animationProgress={animationProgress} />
        <TelegraphPole position={[0, 0, 0]} animationProgress={animationProgress} />
        <TelegraphPole position={[4, 0, -1]} animationProgress={animationProgress} />

        <SparkingTelegraph animationProgress={sparkProgress} />
        <SparkParticles animationProgress={sparkProgress} />

        <pointLight position={[0, -0.5, 2]} intensity={3} color="#00d9ff" />
        <ambientLight intensity={0.2} />
      </Canvas3D>
      )}

      <TextOverlay position="bottom" isInView={isInView}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: textProgress, y: textProgress > 0 ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="glass-strong px-10 py-6 rounded-2xl max-w-3xl"
          style={{
            background: 'rgba(42, 21, 32, 0.9)',
            backdropFilter: 'blur(16px)',
            border: '2px solid rgba(255, 107, 53, 0.4)',
            boxShadow: '0 0 30px rgba(255, 107, 53, 0.2)',
          }}
        >
          <p
            className="text-center"
            style={{
              fontSize: 'clamp(18px, 2.5vw, 24px)',
              color: '#ffffff',
              lineHeight: 1.8,
              fontWeight: 300,
            }}
          >
            Telegraph wires <strong style={{ color: '#00d9ff' }}>sparked and glowed</strong>!
            Operators received shocks, paper caught fire. For the first time,{' '}
            <strong style={{ color: '#ff6b35' }}>technology failed</strong> because of
            Fiery's visit. The world's first "tech casualty."
          </p>
        </motion.div>
      </TextOverlay>
    </>
  );
}
