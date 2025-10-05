import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';

export default function Smile({ radius, animationProgress }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      // Gentle glow pulsing on all children
      groupRef.current.children.forEach((child) => {
        if (child.material && child.material.emissiveIntensity !== undefined) {
          child.material.emissiveIntensity = 0.8 + Math.sin(time * 2) * 0.2;
        }
      });
    }
  });

  const smileProgress = Math.max(0, Math.min((animationProgress - 0.65) * 4, 1));

  // Create smile as a series of small spheres forming an arc
  const smilePoints = [];
  const segments = 10;

  for (let i = 0; i < segments; i++) {
    const t = i / (segments - 1);
    const x = (t - 0.5) * 0.8; // -0.4 to 0.4
    const y = -0.15 - Math.pow(Math.abs(x), 2) * 0.5; // Parabola for smile curve
    const z = radius * 0.95;

    smilePoints.push(
      <Sphere
        key={i}
        args={[0.04, 8, 8]}
        position={[x, y, z]}
      >
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffaa00"
          emissiveIntensity={0.8}
        />
      </Sphere>
    );
  }

  return (
    <group
      ref={groupRef}
      scale={[smileProgress, 1, 1]}
    >
      {smilePoints}
    </group>
  );
}
