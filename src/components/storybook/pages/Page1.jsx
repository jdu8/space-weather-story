import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';
import PageTransition from '../PageTransition';
import * as THREE from 'three';

// Simple Sun component
function Sun() {
  const sunRef = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (sunRef.current) {
      sunRef.current.rotation.y = time * 0.05;
      sunRef.current.rotation.x = Math.sin(time * 0.3) * 0.05;
    }

    if (glowRef.current) {
      const glowScale = 1 + Math.sin(time * 2) * 0.05;
      glowRef.current.scale.setScalar(glowScale);
    }
  });

  return (
    <group>
      {/* Outer glow */}
      <Sphere ref={glowRef} args={[3.5, 32, 32]}>
        <meshBasicMaterial
          color="#ff8844"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Main sun body */}
      <Sphere ref={sunRef} args={[3, 64, 64]}>
        <meshStandardMaterial
          color="#ff6b35"
          emissive="#ffd700"
          emissiveIntensity={0.9}
          roughness={0.7}
        />
      </Sphere>

      {/* Inner bright core */}
      <Sphere args={[2.2, 32, 32]}>
        <meshBasicMaterial
          color="#fff5cc"
          transparent
          opacity={0.4}
        />
      </Sphere>
    </group>
  );
}

// Magnetic field line using simple curve of spheres
function MagneticFieldLine({ index, total }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    // Twisting animation
    groupRef.current.rotation.y = time * 0.3 + index * 0.5;

    // Pulsing
    groupRef.current.children.forEach((child, i) => {
      if (child.material && child.material.opacity !== undefined) {
        child.material.opacity = 0.4 + Math.sin(time * 2 + i * 0.3) * 0.3;
      }
    });
  });

  const angle = (index / total) * Math.PI * 2;
  const segments = 12;
  const spheres = [];

  for (let i = 0; i < segments; i++) {
    const t = i / segments;
    const arcHeight = Math.sin(t * Math.PI) * 2;
    const radius = 3 * (1 - t * 0.2);

    const x = Math.cos(angle) * radius;
    const y = arcHeight;
    const z = Math.sin(angle) * radius;

    spheres.push(
      <Sphere
        key={i}
        args={[0.08, 8, 8]}
        position={[x, y, z]}
      >
        <meshBasicMaterial
          color="#00d9ff"
          transparent
          opacity={0.6}
        />
      </Sphere>
    );
  }

  return <group ref={groupRef}>{spheres}</group>;
}

// Drifting particles along field lines
function DriftingParticles() {
  const particlesRef = useRef();

  useFrame(() => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array;
    const time = Date.now() * 0.0003;

    for (let i = 0; i < 100; i++) {
      const i3 = i * 3;
      const angle = (i / 100) * Math.PI * 2 + time;
      const t = ((time + i * 0.1) % 2) / 2;
      const arcHeight = Math.sin(t * Math.PI) * 2;
      const radius = 3 * (1 - t * 0.2);

      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = arcHeight;
      positions[i3 + 2] = Math.sin(angle) * radius;
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
        size={0.1}
        color="#ffaa00"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// Camera zoom animation
function CameraController({ isInView }) {
  const cameraRef = useRef();

  useEffect(() => {
    if (!isInView) return;

    const startZ = 10;
    const endZ = 5;
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease out

      const camera = cameraRef.current || window.camera;
      if (camera) {
        camera.position.z = startZ + (endZ - startZ) * eased;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [isInView]);

  return null;
}

// Page 1: Birth on the Sun
export default function Page1({ isInView }) {
  return (
    <>
      {/* Only render Canvas when page is in view */}
      {isInView && (
        <Canvas3D
          showStars={true}
          showControls={false}
          camera={{ position: [0, 0, 10], fov: 60 }}
        >
          <CameraController isInView={isInView} />

          {/* Sun */}
          <Sun />

          {/* Magnetic Field Lines (8 lines) */}
          {[...Array(8)].map((_, i) => (
            <MagneticFieldLine key={i} index={i} total={8} />
          ))}

          {/* Drifting Particles */}
          <DriftingParticles />

          {/* Enhanced lighting */}
          <pointLight position={[0, 0, 0]} intensity={2.5} color="#ff8844" />
        </Canvas3D>
      )}

      {/* Text Overlay */}
      <TextOverlay position="bottom" isInView={isInView}>
        <PageTransition isInView={isInView} type="fade" delay={0.5}>
          <div
            className="glass-strong px-8 py-6 rounded-2xl"
            style={{
              background: 'rgba(10, 14, 39, 0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <p
              className="text-center text-xl md:text-2xl font-light"
              style={{
                color: '#ffffff',
                textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
              }}
            >
              Deep beneath the surface of the Sun, something stirs...
            </p>
          </div>
        </PageTransition>
      </TextOverlay>
    </>
  );
}
