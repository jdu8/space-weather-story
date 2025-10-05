import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { motion } from 'framer-motion';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';
import * as THREE from 'three';

// Fiery flying through space
function FieryFlying({ animationProgress }) {
  const spriteRef = useRef();
  const texture = useLoader(TextureLoader, '/src/assets/sprites/fiery_flying.png');

  useFrame((state) => {
    if (!spriteRef.current) return;
    const time = state.clock.getElapsedTime();

    // Gentle up-down bobbing
    spriteRef.current.position.y = Math.sin(time * 1.5) * 0.2;

    // Slight tilt for flight effect
    spriteRef.current.rotation.z = Math.sin(time * 0.8) * 0.03;
  });

  // Move from left to right across the screen
  const xPosition = -8 + animationProgress * 16;

  return (
    <sprite ref={spriteRef} position={[xPosition, 0, 0]} scale={[4, 4, 1]}>
      <spriteMaterial map={texture} transparent={true} />
    </sprite>
  );
}

// Space debris/particles streaming past (motion parallax effect)
function StreamingParticles({ animationProgress }) {
  const particlesRef = useRef();
  const initialPositions = useRef(null);

  // Initialize particle positions once
  if (!initialPositions.current) {
    const count = 200;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = Math.random() * 30 - 15; // x: -15 to 15
      positions[i3 + 1] = Math.random() * 20 - 10; // y: -10 to 10
      positions[i3 + 2] = Math.random() * 10 - 15; // z: -15 to -5
    }

    initialPositions.current = positions;
  }

  useFrame(() => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array;
    const time = Date.now() * 0.001;

    for (let i = 0; i < 200; i++) {
      const i3 = i * 3;
      const layer = (i % 3) + 1; // 3 layers for parallax
      const speed = layer * 8; // Faster layers = closer particles

      // Move particles left (opposite to Fiery's movement)
      positions[i3] = initialPositions.current[i3] - (time * speed) % 30;

      // Reset to right side when they go off screen left
      if (positions[i3] < -15) {
        positions[i3] += 30;
      }

      positions[i3 + 1] = initialPositions.current[i3 + 1] + Math.sin(time + i * 0.1) * 0.2;
      positions[i3 + 2] = initialPositions.current[i3 + 2];
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const particleCount = 200;
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
        size={0.08}
        color="#ffffff"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

// Plasma trail behind Fiery
function PlasmaTrail({ animationProgress }) {
  const particlesRef = useRef();

  useFrame(() => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array;
    const time = Date.now() * 0.001;

    // Trail follows Fiery's position
    const fieryX = -8 + animationProgress * 16;

    for (let i = 0; i < 80; i++) {
      const i3 = i * 3;
      const offset = i / 80;

      // Trail behind Fiery
      positions[i3] = fieryX - offset * 5;
      positions[i3 + 1] = Math.sin(time * 2 + i * 0.3) * 0.5;
      positions[i3 + 2] = Math.cos(time * 2 + i * 0.3) * 0.3;
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
        size={0.2}
        color="#ff8844"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Page 3: Journey Through Space
export default function Page3({ isInView }) {
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (!isInView) {
      setAnimationProgress(0);
      return;
    }

    const duration = 5000; // 5 seconds for journey
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

  const textProgress = Math.max(0, Math.min(animationProgress * 2.5, 1));

  return (
    <>
      <Canvas3D
        showStars={true}
        showControls={false}
        camera={{ position: [0, 0, 8], fov: 70 }}
      >
        {/* Streaming particles for motion effect */}
        <StreamingParticles animationProgress={animationProgress} />

        {/* Plasma trail behind Fiery */}
        <PlasmaTrail animationProgress={animationProgress} />

        {/* Fiery flying across screen */}
        <FieryFlying animationProgress={animationProgress} />

        {/* Lighting */}
        <pointLight position={[0, 0, 5]} intensity={1.5} color="#ff8844" />
        <ambientLight intensity={0.4} />
      </Canvas3D>

      <TextOverlay position="bottom" isInView={isInView}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: textProgress, y: textProgress > 0 ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="glass-strong px-10 py-6 rounded-2xl max-w-2xl"
          style={{
            background: 'rgba(10, 14, 39, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '2px solid rgba(0, 217, 255, 0.3)',
            boxShadow: '0 0 30px rgba(0, 217, 255, 0.2)',
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
            Fiery races through the vast emptiness of space at over{' '}
            <strong style={{ color: '#00d9ff', fontWeight: 600 }}>
              1 million miles per hour
            </strong>
            , heading toward a small blue planet...
          </p>
        </motion.div>
      </TextOverlay>
    </>
  );
}
