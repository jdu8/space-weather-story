import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Sphere } from '@react-three/drei';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Glow effect without visible Sun (only during eruption phase)
function EruptionGlow({ animationProgress }) {
  const glowRef = useRef();

  // Only show glow during first 40% of animation (eruption phase)
  const glowPhase = Math.max(0, 1 - animationProgress * 2.5);

  useFrame((state) => {
    if (!glowRef.current || glowPhase === 0) return;
    const time = state.clock.getElapsedTime();
    const pulse = 1 + Math.sin(time * 2) * 0.2;
    glowRef.current.scale.setScalar(pulse * 3);
  });

  if (glowPhase === 0) return null;

  return (
    <group position={[0, 0, -8]}>
      <Sphere ref={glowRef} args={[2, 32, 32]}>
        <meshBasicMaterial
          color="#ff8844"
          transparent
          opacity={glowPhase * 0.4}
          side={THREE.BackSide}
        />
      </Sphere>
      <pointLight position={[0, 0, 0]} intensity={glowPhase * 4} color="#ff8844" distance={20} />
    </group>
  );
}

// Energy burst particles during eruption phase
function EruptionBurst({ animationProgress }) {
  const particlesRef = useRef();

  // Only show during first half of animation (eruption phase)
  const eruptionPhase = Math.min(animationProgress * 2, 1);

  useFrame(() => {
    if (!particlesRef.current || eruptionPhase === 0) return;

    const positions = particlesRef.current.geometry.attributes.position.array;
    const time = Date.now() * 0.001;

    for (let i = 0; i < 150; i++) {
      const i3 = i * 3;
      const angle = (i / 150) * Math.PI * 2;
      const spread = eruptionPhase * 3 * (1 + Math.sin(time + i) * 0.2);

      positions[i3] = Math.cos(angle + time * 0.5) * spread;
      positions[i3 + 1] = Math.sin(i + time * 2) * spread * 0.5;
      positions[i3 + 2] = -5 + Math.sin(angle + time * 0.5) * spread;
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const particleCount = 150;
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
        color="#ffaa00"
        transparent
        opacity={eruptionPhase * 0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Fiery sprite emerging
function FierySprite({ animationProgress }) {
  const spriteRef = useRef();
  const texture = useLoader(TextureLoader, '/src/assets/sprites/fiery_saying_hi.png');

  // Sprite appears starting at 30% progress
  const spritePhase = Math.max(0, (animationProgress - 0.3) * 1.43);

  useFrame((state) => {
    if (!spriteRef.current || spritePhase === 0) return;
    const time = state.clock.getElapsedTime();

    // Gentle bobbing
    spriteRef.current.position.y = Math.sin(time * 0.8) * 0.15;

    // Slight rotation wiggle
    spriteRef.current.rotation.z = Math.sin(time * 1.2) * 0.02;
  });

  // Scale up and come toward camera
  const scale = spritePhase;

  return (
    <sprite
      ref={spriteRef}
      position={[0, 0, 0]}
      scale={[scale * 5, scale * 5, 1]}
    >
      <spriteMaterial
        map={texture}
        transparent={true}
        opacity={spritePhase}
      />
    </sprite>
  );
}

// Page 2: The Birth and Introduction
export default function Page2({ isInView }) {
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (!isInView) {
      setAnimationProgress(0);
      return;
    }

    const duration = 4000; // 4 seconds for full animation
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

  // Text phases:
  // Phase 1 (0-50%): "Magnetic fields twist... ERUPTION!"
  // Phase 2 (50-100%): "Hi! I'm Fiery!"
  const eruptionTextProgress = Math.max(0, Math.min(animationProgress * 2.5, 1));
  const fieryTextProgress = Math.max(0, (animationProgress - 0.6) * 2.5);

  return (
    <>
      <Canvas3D
        showStars={true}
        showControls={false}
        camera={{ position: [0, 0, 6], fov: 60 }}
      >
        {/* Eruption glow effect (fades out) */}
        <EruptionGlow animationProgress={animationProgress} />

        {/* Energy burst particles (first half) */}
        <EruptionBurst animationProgress={animationProgress} />

        {/* Fiery sprite emerging */}
        <FierySprite animationProgress={animationProgress} />

        {/* Warm lighting */}
        <pointLight position={[0, 0, 3]} intensity={2} color="#ff8844" />
        <ambientLight intensity={0.4} />
      </Canvas3D>

      <TextOverlay position="bottom" isInView={isInView}>
        {/* Eruption text (fades out when Fiery appears) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: animationProgress < 0.5 ? eruptionTextProgress : Math.max(0, 1 - fieryTextProgress),
            y: animationProgress < 0.5 ? (eruptionTextProgress > 0 ? 0 : 20) : -20,
          }}
          transition={{ duration: 0.6 }}
          className="glass-strong px-8 py-6 rounded-2xl"
          style={{
            background: 'rgba(10, 14, 39, 0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 107, 53, 0.3)',
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: animationProgress > 0.5 ? 'none' : 'auto',
          }}
        >
          <p
            className="text-center text-xl md:text-2xl font-light"
            style={{
              color: '#ffffff',
              textShadow: '0 0 20px rgba(255, 170, 0, 0.4)',
            }}
          >
            Magnetic fields twist... energy builds... and then—
            <strong className="block mt-2 text-[var(--solar-orange)]">
              ERUPTION!
            </strong>
          </p>
        </motion.div>

        {/* Fiery introduction text (appears after sprite) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: fieryTextProgress,
            y: fieryTextProgress > 0 ? 0 : 20,
          }}
          transition={{ duration: 0.6 }}
          className="glass-strong px-10 py-8 rounded-2xl max-w-3xl"
          style={{
            background: 'rgba(10, 14, 39, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '2px solid rgba(255, 107, 53, 0.4)',
            boxShadow: '0 0 40px rgba(255, 107, 53, 0.2)',
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: animationProgress < 0.6 ? 'none' : 'auto',
          }}
        >
          <h2
            className="text-center font-bold mb-4"
            style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              color: '#fff',
              textShadow: '0 0 30px rgba(255, 170, 0, 0.6)',
              fontFamily: "'Fredoka', 'Comic Sans MS', cursive",
              letterSpacing: '0.02em',
            }}
          >
            Meet Fiery! 🔥
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: fieryTextProgress > 0.5 ? 1 : 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center"
            style={{
              fontSize: 'clamp(16px, 2.2vw, 22px)',
              color: '#ffffff',
              lineHeight: 1.7,
              fontWeight: 300,
            }}
          >
            A Coronal Mass Ejection—billions of tons of super-hot plasma<br />
            bursting from the Sun's surface into space!
          </motion.p>
        </motion.div>
      </TextOverlay>
    </>
  );
}
