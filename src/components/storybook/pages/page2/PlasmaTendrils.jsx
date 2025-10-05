import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';

function PlasmaTendril({ index, total, baseRadius, animationProgress, mousePos }) {
  const groupRef = useRef();
  const angle = (index / total) * Math.PI * 2;
  const length = 1.5;

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();
    const waveSpeed = 0.5 + index * 0.1;

    // Wave motion
    groupRef.current.rotation.z = Math.sin(time * waveSpeed + index) * 0.2;
  });

  const tendrilProgress = Math.max(0, Math.min((animationProgress - 0.3) * 2, 1));

  // Create tendril as a series of spheres
  const segments = 8;
  const spheres = [];

  for (let i = 0; i < segments; i++) {
    const t = i / segments;
    const distance = baseRadius + t * length;
    const size = 0.15 * (1 - t * 0.5);

    const x = Math.cos(angle) * distance;
    const y = Math.sin(t * Math.PI) * 0.3 - 0.2;
    const z = Math.sin(angle) * distance;

    spheres.push(
      <Sphere
        key={i}
        args={[size, 8, 8]}
        position={[x, y, z]}
      >
        <meshStandardMaterial
          color="#ff8844"
          emissive="#ffaa00"
          emissiveIntensity={0.6}
          transparent
          opacity={0.7 * (1 - t * 0.3)}
        />
      </Sphere>
    );
  }

  return (
    <group
      ref={groupRef}
      scale={[tendrilProgress, tendrilProgress, tendrilProgress]}
    >
      {spheres}
    </group>
  );
}

export default function PlasmaTendrils({ count = 8, baseRadius, animationProgress, mousePos }) {
  return (
    <group>
      {Array.from({ length: count }, (_, i) => (
        <PlasmaTendril
          key={i}
          index={i}
          total={count}
          baseRadius={baseRadius}
          animationProgress={animationProgress}
          mousePos={mousePos}
        />
      ))}
    </group>
  );
}
