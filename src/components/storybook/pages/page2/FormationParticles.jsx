import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function FormationParticles({ count = 600, animationProgress = 0 }) {
  const particlesRef = useRef();

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const startPositions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Random start position (scattered)
      const angle = Math.random() * Math.PI * 2;
      const distance = 5 + Math.random() * 3;
      const height = (Math.random() - 0.5) * 4;

      startPositions[i3] = Math.cos(angle) * distance;
      startPositions[i3 + 1] = height;
      startPositions[i3 + 2] = Math.sin(angle) * distance;

      // Current position (will be interpolated)
      positions[i3] = startPositions[i3];
      positions[i3 + 1] = startPositions[i3 + 1];
      positions[i3 + 2] = startPositions[i3 + 2];

      // Yellow-orange color
      const colorMix = Math.random();
      colors[i3] = 1.0; // R
      colors[i3 + 1] = 0.67 + colorMix * 0.33; // G
      colors[i3 + 2] = 0.0; // B

      // Random size
      sizes[i] = Math.random() * 0.03 + 0.02;
    }

    return { positions, colors, sizes, startPositions };
  }, [count]);

  useFrame(() => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array;
    const startPositions = particles.startPositions;

    // Converge particles based on animation progress
    const convergence = Math.min(animationProgress * 2, 1);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      if (convergence < 1) {
        // Move from start position toward center
        const targetX = 0;
        const targetY = 0;
        const targetZ = 0;

        positions[i3] = startPositions[i3] + (targetX - startPositions[i3]) * convergence;
        positions[i3 + 1] = startPositions[i3 + 1] + (targetY - startPositions[i3 + 1]) * convergence;
        positions[i3 + 2] = startPositions[i3 + 2] + (targetZ - startPositions[i3 + 2]) * convergence;
      } else {
        // After formation, orbit around Corona
        const time = Date.now() * 0.0005;
        const angle = (i / count) * Math.PI * 2 + time;
        const orbitRadius = 2 + Math.sin(i * 0.1) * 0.5;

        positions[i3] = Math.cos(angle) * orbitRadius;
        positions[i3 + 1] = Math.sin(time + i * 0.1) * 0.5;
        positions[i3 + 2] = Math.sin(angle) * orbitRadius;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
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
