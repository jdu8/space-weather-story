import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function EnergyParticles({ count = 250 }) {
  const particlesRef = useRef();

  // Detect device for performance optimization
  const isMobile = useMemo(() => {
    return window.innerWidth < 768;
  }, []);

  const adjustedCount = isMobile ? Math.min(count, 150) : count;

  const particles = useMemo(() => {
    const positions = new Float32Array(adjustedCount * 3);
    const colors = new Float32Array(adjustedCount * 3);
    const sizes = new Float32Array(adjustedCount);
    const velocities = new Float32Array(adjustedCount * 3);

    for (let i = 0; i < adjustedCount; i++) {
      const i3 = i * 3;

      // Random position around the sun
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.5 + Math.random() * 1.5;
      const height = (Math.random() - 0.5) * 3;

      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = height;
      positions[i3 + 2] = Math.sin(angle) * radius;

      // Yellow-orange color
      const colorMix = Math.random();
      colors[i3] = 1.0; // R
      colors[i3 + 1] = 0.67 + colorMix * 0.33; // G
      colors[i3 + 2] = 0.0; // B

      // Random size
      sizes[i] = Math.random() * 0.03 + 0.02;

      // Slow velocity
      velocities[i3] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;
    }

    return { positions, colors, sizes, velocities };
  }, [adjustedCount]);

  useFrame(() => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array;
    const velocities = particles.velocities;

    for (let i = 0; i < adjustedCount; i++) {
      const i3 = i * 3;

      // Update position
      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];

      // Keep particles near sun
      const distance = Math.sqrt(
        positions[i3] ** 2 +
        positions[i3 + 1] ** 2 +
        positions[i3 + 2] ** 2
      );

      if (distance > 5 || distance < 2) {
        // Reset to random position
        const angle = Math.random() * Math.PI * 2;
        const radius = 2.5 + Math.random() * 1.5;
        const height = (Math.random() - 0.5) * 3;

        positions[i3] = Math.cos(angle) * radius;
        positions[i3 + 1] = height;
        positions[i3 + 2] = Math.sin(angle) * radius;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={adjustedCount}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={adjustedCount}
          array={particles.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={adjustedCount}
          array={particles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
