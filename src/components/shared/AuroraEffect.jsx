import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function AuroraEffect({ position = [8, 0, -5], earthScale = 0.8 }) {
  const auroraRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (auroraRef.current) {
      // Rotate with Earth
      auroraRef.current.rotation.y = time * 0.15;
      // Wave motion
      auroraRef.current.rotation.x = 0.4 + Math.sin(time) * 0.1;
      // Opacity pulsing
      auroraRef.current.material.opacity = 0.3 + Math.sin(time * 2) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Northern aurora ring */}
      <mesh ref={auroraRef} rotation={[0.4, 0, 0]}>
        <torusGeometry args={[earthScale * 0.7, earthScale * 0.15, 16, 100]} />
        <meshBasicMaterial
          color="#00ff88"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Southern aurora ring */}
      <mesh rotation={[-0.4, 0, Math.PI]}>
        <torusGeometry args={[earthScale * 0.7, earthScale * 0.15, 16, 100]} />
        <meshBasicMaterial
          color="#00d9ff"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
