import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

export default function SunSurface({ radius = 3, scrollProgress = 0 }) {
  const sunRef = useRef();
  const glowRef = useRef();
  const materialRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (sunRef.current) {
      // Slow rotation
      sunRef.current.rotation.y = time * 0.05;
      sunRef.current.rotation.x = Math.sin(time * 0.3) * 0.05;

      // Bulge effect based on scroll progress
      const bulgeScale = 1 + scrollProgress * 0.15;
      sunRef.current.scale.setScalar(bulgeScale);
    }

    if (glowRef.current) {
      // Pulsing glow
      const glowScale = 1 + Math.sin(time * 2) * 0.05;
      glowRef.current.scale.setScalar(glowScale);
    }

    if (materialRef.current) {
      // Pulsing emission
      const pulseIntensity = 0.8 + Math.sin(time * 1.5) * 0.2;
      materialRef.current.emissiveIntensity = pulseIntensity;
    }
  });

  return (
    <group>
      {/* Outer glow */}
      <Sphere ref={glowRef} args={[radius * 1.3, 32, 32]}>
        <meshBasicMaterial
          color="#ff8844"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Main sun body */}
      <Sphere ref={sunRef} args={[radius, 64, 64]}>
        <meshStandardMaterial
          ref={materialRef}
          color="#ff6b35"
          emissive="#ffd700"
          emissiveIntensity={0.8}
          roughness={0.7}
          metalness={0.3}
        />
      </Sphere>

      {/* Inner bright core */}
      <Sphere args={[radius * 0.7, 32, 32]}>
        <meshBasicMaterial
          color="#fff5cc"
          transparent
          opacity={0.4}
        />
      </Sphere>
    </group>
  );
}
