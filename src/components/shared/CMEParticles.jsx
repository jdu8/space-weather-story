import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function CMEParticles({ count = 1000, position = [0, 0, 0] }) {
  const particlesRef = useRef();

  // Generate random particle positions in a cone shape (CME launch)
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Start near the sun
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 2 + 1.5;
      const height = Math.random() * 0.5;

      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = height;
      positions[i3 + 2] = Math.sin(angle) * radius;

      // Velocity outward
      const speed = Math.random() * 0.02 + 0.01;
      velocities[i3] = Math.cos(angle) * speed;
      velocities[i3 + 1] = Math.random() * 0.01 - 0.005;
      velocities[i3 + 2] = Math.sin(angle) * speed;

      // Aurora colors (green to blue gradient)
      const colorMix = Math.random();
      colors[i3] = colorMix * 0.0 + (1 - colorMix) * 1.0; // R
      colors[i3 + 1] = colorMix * 1.0 + (1 - colorMix) * 0.85; // G
      colors[i3 + 2] = colorMix * 0.53 + (1 - colorMix) * 1.0; // B

      // Random sizes
      sizes[i] = Math.random() * 0.08 + 0.02;
    }

    return { positions, velocities, colors, sizes };
  }, [count]);

  useFrame(() => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array;
    const velocities = particles.velocities;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Update position
      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];

      // Reset if too far from origin
      const distance = Math.sqrt(
        positions[i3] ** 2 +
        positions[i3 + 1] ** 2 +
        positions[i3 + 2] ** 2
      );

      if (distance > 15) {
        // Reset to origin with slight randomness
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 2 + 1.5;

        positions[i3] = Math.cos(angle) * radius;
        positions[i3 + 1] = Math.random() * 0.5;
        positions[i3 + 2] = Math.sin(angle) * radius;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef} position={position}>
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
        size={0.08}
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
