import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function MagneticFieldLine({ index, total, scrollProgress = 0, mousePos = { x: 0, y: 0 } }) {
  const lineRef = useRef();

  // Create curved path for magnetic field line
  const curve = useMemo(() => {
    const angle = (index / total) * Math.PI * 2;
    const radius = 3;

    const points = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const arcHeight = Math.sin(t * Math.PI) * 2;

      const x = Math.cos(angle) * radius * (1 - t * 0.3);
      const y = arcHeight;
      const z = Math.sin(angle) * radius * (1 - t * 0.3);

      points.push(new THREE.Vector3(x, y, z));
    }

    return new THREE.CatmullRomCurve3(points);
  }, [index, total]);

  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 40, 0.02, 8, false);
  }, [curve]);

  useFrame((state) => {
    if (!lineRef.current) return;

    const time = state.clock.getElapsedTime();

    // Pulse opacity
    const baseOpacity = 0.4 + Math.sin(time * 2 + index * 0.5) * 0.3;
    lineRef.current.material.opacity = baseOpacity;

    // Twist animation - faster when scrolling
    const twistSpeed = 0.3 + scrollProgress * 0.5;
    lineRef.current.rotation.y = time * twistSpeed + index * 0.5;

    // Undulate
    lineRef.current.position.y = Math.sin(time + index) * 0.1;

    // Mouse parallax
    lineRef.current.position.x += mousePos.x * 0.1 * 0.05;
    lineRef.current.position.z += mousePos.y * 0.1 * 0.05;
  });

  return (
    <mesh ref={lineRef} geometry={tubeGeometry}>
      <meshBasicMaterial
        color="#00d9ff"
        transparent
        opacity={0.6}
        emissive="#00d9ff"
        emissiveIntensity={1.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function MagneticFieldLines({ count = 10, scrollProgress = 0, mousePos }) {
  return (
    <group>
      {Array.from({ length: count }, (_, i) => (
        <MagneticFieldLine
          key={i}
          index={i}
          total={count}
          scrollProgress={scrollProgress}
          mousePos={mousePos}
        />
      ))}
    </group>
  );
}
