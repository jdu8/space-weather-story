import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

export default function Earth3D({ position = [8, 0, -5], scale = 0.8 }) {
  const earthRef = useRef();
  const atmosphereRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Rotate Earth
    if (earthRef.current) {
      earthRef.current.rotation.y = time * 0.15;
      earthRef.current.rotation.x = 0.4; // Tilt
    }

    // Subtle atmosphere glow pulse
    if (atmosphereRef.current) {
      atmosphereRef.current.scale.setScalar(1 + Math.sin(time * 1.5) * 0.02);
    }
  });

  return (
    <group position={position}>
      {/* Atmosphere glow */}
      <Sphere ref={atmosphereRef} args={[scale * 1.2, 32, 32]}>
        <meshBasicMaterial
          color="#00d9ff"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Earth body */}
      <Sphere ref={earthRef} args={[scale, 32, 32]}>
        <meshStandardMaterial
          color="#1e88e5"
          emissive="#0d47a1"
          emissiveIntensity={0.3}
          roughness={0.8}
          metalness={0.2}
        />
      </Sphere>

      {/* Continents overlay (darker patches) */}
      <Sphere args={[scale * 1.01, 32, 32]}>
        <meshStandardMaterial
          color="#2e7d32"
          transparent
          opacity={0.6}
          roughness={0.9}
        />
      </Sphere>

      {/* Aurora effect at poles */}
      <Sphere args={[scale * 1.15, 32, 32]} rotation={[0.4, 0, 0]}>
        <meshBasicMaterial
          color="#00ff88"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </Sphere>
    </group>
  );
}
