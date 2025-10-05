import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import Eyes from './Eyes';
import Smile from './Smile';
import PlasmaTendrils from './PlasmaTendrils';

export default function CoronaCharacter({
  radius = 1.5,
  isInView = false,
  animationProgress = 0,
  mousePos = { x: 0, y: 0 }
}) {
  const groupRef = useRef();
  const bodyRef = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    if (!isInView) return;

    const time = state.clock.getElapsedTime();

    // Gentle bobbing animation
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 0.8) * 0.1;

      // Subtle rotation
      groupRef.current.rotation.y += 0.002;
    }

    // Body pulsing
    if (bodyRef.current) {
      const scale = 1 + Math.sin(time * 1.2) * 0.03;
      bodyRef.current.scale.setScalar(scale);
    }

    // Glow pulsing
    if (glowRef.current) {
      const glowScale = 1 + Math.sin(time * 2) * 0.08;
      glowRef.current.scale.setScalar(glowScale);
      glowRef.current.material.opacity = 0.3 + Math.sin(time * 2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer aura/glow */}
      <Sphere ref={glowRef} args={[radius * 1.4, 32, 32]}>
        <meshBasicMaterial
          color="#ff8844"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Main plasma body */}
      <Sphere ref={bodyRef} args={[radius, 64, 64]}>
        <meshStandardMaterial
          color="#ff6b35"
          emissive="#ffaa00"
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
          roughness={0.6}
          metalness={0.2}
        />
      </Sphere>

      {/* Inner bright core */}
      <Sphere args={[radius * 0.6, 32, 32]}>
        <meshBasicMaterial
          color="#fff5cc"
          transparent
          opacity={0.5}
        />
      </Sphere>

      {/* Face features - only show after formation */}
      {animationProgress > 0.5 && (
        <>
          <Eyes
            radius={radius}
            animationProgress={animationProgress}
            mousePos={mousePos}
          />
          <Smile
            radius={radius}
            animationProgress={animationProgress}
          />
        </>
      )}

      {/* Plasma tendrils */}
      <PlasmaTendrils
        count={8}
        baseRadius={radius}
        animationProgress={animationProgress}
        mousePos={mousePos}
      />
    </group>
  );
}
