import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Sphere } from '@react-three/drei';
import { motion } from 'framer-motion';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';
import ThreeJSEarth from '../effects/ThreeJSEarth';
import * as THREE from 'three';

// Magnetosphere visualization
function Magnetosphere({ animationProgress }) {
  const fieldRef = useRef();

  useFrame((state) => {
    if (!fieldRef.current) return;
    const time = state.clock.getElapsedTime();
    fieldRef.current.rotation.y = time * 0.1;
  });

  const opacity = Math.min(animationProgress * 2, 0.3);

  return (
    <group ref={fieldRef} position={[3, 0, -2]}>
      {/* Outer magnetosphere shell */}
      <Sphere args={[3.5, 32, 32]}>
        <meshBasicMaterial
          color="#00d9ff"
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
          wireframe
        />
      </Sphere>
    </group>
  );
}

// Fiery approaching Earth
function FieryApproaching({ animationProgress }) {
  const spriteRef = useRef();
  const texture = useLoader(TextureLoader, '/sprites/002_fiery_flying.png');

  useFrame((state) => {
    if (!spriteRef.current) return;
    const time = state.clock.getElapsedTime();
    spriteRef.current.position.y = Math.sin(time * 1.2) * 0.15;
  });

  // Move from left toward Earth
  const xPosition = -10 + animationProgress * 10;

  // Smaller size - reduce from 2-4 to 1.2-2
  const baseScale = 1.2 + animationProgress * 0.8;

  // Start dissolving after 70% (impact moment)
  const dissolvePhase = Math.max(0, (animationProgress - 0.7) * 3.33);
  const opacity = 1 - dissolvePhase;

  // Shrink and fade when dissolving
  const scale = baseScale * (1 - dissolvePhase * 0.5);

  if (opacity <= 0) return null;

  return (
    <sprite ref={spriteRef} position={[xPosition, 0, 2]} scale={[scale, scale, 1]}>
      <spriteMaterial map={texture} transparent={true} opacity={opacity} />
    </sprite>
  );
}

// Impact particles
function ImpactParticles({ animationProgress }) {
  const particlesRef = useRef();

  // Particles appear at 70% progress (impact moment)
  const impactPhase = Math.max(0, (animationProgress - 0.7) * 3.33);

  useFrame(() => {
    if (!particlesRef.current || impactPhase === 0) return;

    const positions = particlesRef.current.geometry.attributes.position.array;
    const time = Date.now() * 0.001;

    for (let i = 0; i < 100; i++) {
      const i3 = i * 3;
      const angle = (i / 100) * Math.PI * 2;
      const spread = impactPhase * 2;

      positions[i3] = 3 + Math.cos(angle + time) * spread;
      positions[i3 + 1] = Math.sin(angle + time) * spread;
      positions[i3 + 2] = -2 + Math.sin(time + i) * 0.5;
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
        opacity={impactPhase * 0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Page 4: First Contact - Fiery collides with Earth's magnetosphere
export default function Page4({ isInView }) {
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
          <ThreeJSEarth
            width={480}
            height={480}
            position="absolute"
            right="25%"
            top="50%"
            opacity={animationProgress}
            rotationSpeed={0.005}
            className="translate-y-center"
          />
          <Canvas3D
            showStars={true}
            showControls={false}
            camera={{ position: [0, 0, 8], fov: 60 }}
          >
            <Magnetosphere animationProgress={animationProgress} />
            <FieryApproaching animationProgress={animationProgress} />
            <ImpactParticles animationProgress={animationProgress} />

            <pointLight position={[0, 0, 5]} intensity={2} color="#00d9ff" />
            <ambientLight intensity={0.4} />
          </Canvas3D>
        </>
      )}

      <TextOverlay position="bottom" isInView={isInView}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: textProgress, y: textProgress > 0 ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="glass-strong px-10 py-6 rounded-2xl max-w-3xl"
          style={{
            background: 'rgba(10, 14, 39, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '2px solid rgba(0, 255, 136, 0.3)',
            boxShadow: '0 0 30px rgba(0, 255, 136, 0.2)',
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
            As Fiery reaches Earth, she collides with an invisible shield—the{' '}
            <strong style={{ color: '#00ff88', fontWeight: 600 }}>
              magnetosphere
            </strong>
            ! A spectacular burst of colorful energy explodes across the sky!
          </p>
        </motion.div>
      </TextOverlay>
    </>
  );
}
