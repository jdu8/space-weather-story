import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Reusable Aurora component with smooth, glowing wave effects
 * @param {Object} props
 * @param {number} props.animationProgress - Progress of fade-in animation (0-1)
 * @param {Array<string>} props.colors - Array of hex colors for aurora layers (default: ['#00ff88', '#b47aff', '#00ffff'])
 * @param {number} props.intensity - Overall brightness (default: 1)
 * @param {number} props.speed - Animation speed multiplier (default: 1)
 * @param {number} props.waveHeight - Height of the waves (default: 3)
 * @param {number} props.layers - Number of aurora layers (default: 3)
 */
export default function Aurora({
  animationProgress = 1,
  colors = ['#00ff88', '#b47aff', '#00ffff'],
  intensity = 1,
  speed = 1,
  waveHeight = 3,
  layers = 3
}) {
  return (
    <group>
      {Array.from({ length: layers }).map((_, i) => (
        <AuroraLayer
          key={i}
          color={colors[i % colors.length]}
          offset={i * 0.8}
          animationProgress={animationProgress}
          intensity={intensity}
          speed={speed}
          waveHeight={waveHeight}
          layerIndex={i}
          totalLayers={layers}
        />
      ))}
      <AuroraGlow animationProgress={animationProgress} intensity={intensity} />
    </group>
  );
}

function AuroraLayer({
  color,
  offset,
  animationProgress,
  intensity,
  speed,
  waveHeight,
  layerIndex,
  totalLayers
}) {
  const meshRef = useRef();

  // Create smooth wave geometry
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(20, waveHeight, 100, 50);
    const positions = geo.attributes.position.array;

    // Store original positions for animation
    geo.userData.originalPositions = new Float32Array(positions);

    return geo;
  }, [waveHeight]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime() * speed;
    const positions = meshRef.current.geometry.attributes.position.array;
    const original = meshRef.current.geometry.userData.originalPositions;

    // Create flowing wave patterns
    for (let i = 0; i < positions.length; i += 3) {
      const x = original[i];
      const y = original[i + 1];

      // Multiple sine waves for organic movement
      const wave1 = Math.sin(x * 0.3 + time + offset) * 0.5;
      const wave2 = Math.sin(x * 0.15 - time * 0.7 + offset * 2) * 0.3;
      const wave3 = Math.cos(x * 0.4 + time * 0.5 + offset) * 0.2;

      // Vertical undulation
      const verticalWave = Math.sin(y * 0.5 + time * 0.3) * 0.15;

      // Combine waves for natural aurora movement
      positions[i + 2] = wave1 + wave2 + wave3 + verticalWave;
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;

    // Subtle rotation and position shift
    meshRef.current.rotation.x = Math.sin(time * 0.2 + offset) * 0.1 - 0.2;
  });

  // Calculate opacity based on layer position
  const baseOpacity = 0.4 - (layerIndex * 0.05);
  const opacity = animationProgress * baseOpacity * intensity;

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={[0, 1, -8 - offset]}
    >
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function AuroraGlow({ animationProgress, intensity }) {
  const particlesRef = useRef();

  const { positions, colors, sizes } = useMemo(() => {
    const count = 300;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Distribute particles in aurora region
      pos[i3] = (Math.random() - 0.5) * 22;
      pos[i3 + 1] = Math.random() * 4 - 1;
      pos[i3 + 2] = -8 + (Math.random() - 0.5) * 4;

      // Start with greenish-blue color
      col[i3] = Math.random() * 0.3;
      col[i3 + 1] = 0.8 + Math.random() * 0.2;
      col[i3 + 2] = 0.6 + Math.random() * 0.4;

      // Varying particle sizes
      siz[i] = Math.random() * 0.3 + 0.1;
    }

    return { positions: pos, colors: col, sizes: siz };
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;

    const time = state.clock.getElapsedTime();
    const pos = particlesRef.current.geometry.attributes.position.array;
    const col = particlesRef.current.geometry.attributes.color.array;

    for (let i = 0; i < pos.length / 3; i++) {
      const i3 = i * 3;

      // Gentle floating motion
      const floatSpeed = 0.3 + (i % 10) * 0.05;
      pos[i3 + 1] = positions[i3 + 1] + Math.sin(time * floatSpeed + i) * 0.3;

      // Horizontal drift
      pos[i3] = positions[i3] + Math.cos(time * 0.2 + i * 0.1) * 0.5;

      // Color shimmer between green, blue, and purple
      const shimmer = Math.sin(time * 2 + i * 0.3) * 0.5 + 0.5;
      col[i3] = shimmer * 0.5;
      col[i3 + 1] = 0.8 + Math.sin(time + i) * 0.2;
      col[i3 + 2] = 0.5 + (1 - shimmer) * 0.5;
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    particlesRef.current.geometry.attributes.color.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
        vertexColors
        transparent
        opacity={animationProgress * 0.7 * intensity}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
