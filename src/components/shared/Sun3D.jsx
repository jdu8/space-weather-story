import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function Sun3D({ position = [0, 0, 0], scale = 2 }) {
  const sunRef = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Slow rotation
    if (sunRef.current) {
      sunRef.current.rotation.y = time * 0.1;
      sunRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    }

    // Pulsing glow
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.05);
    }
  });

  return (
    <group position={position}>
      {/* Outer glow */}
      <Sphere ref={glowRef} args={[scale * 1.3, 64, 64]}>
        <meshBasicMaterial
          color="#ff6b35"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Main sun body with distortion for solar activity */}
      <Sphere ref={sunRef} args={[scale, 64, 64]}>
        <MeshDistortMaterial
          color="#ff6b35"
          emissive="#ff6b35"
          emissiveIntensity={1.5}
          distort={0.4}
          speed={2}
          roughness={0.4}
        />
      </Sphere>

      {/* Core bright center */}
      <Sphere args={[scale * 0.8, 32, 32]}>
        <meshBasicMaterial
          color="#ffcc00"
          transparent
          opacity={0.6}
        />
      </Sphere>

      {/* Point light to illuminate the scene */}
      <pointLight
        position={[0, 0, 0]}
        intensity={2}
        distance={20}
        color="#ff6b35"
      />

      {/* Additional ambient glow */}
      <pointLight
        position={[0, 0, 0]}
        intensity={1}
        distance={30}
        color="#ffaa00"
      />
    </group>
  );
}
