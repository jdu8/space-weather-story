import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { motion } from 'framer-motion';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';
import * as THREE from 'three';

// Aurora curtains (green and purple)
function AuroraCurtain({ color, offset, animationProgress }) {
  const curtainRef = useRef();

  useFrame((state) => {
    if (!curtainRef.current) return;
    const time = state.clock.getElapsedTime();

    // Wavy animation
    const positions = curtainRef.current.geometry.attributes.position.array;
    const originalPositions = curtainRef.current.userData.originalPositions;

    if (!originalPositions) return;

    for (let i = 0; i < positions.length; i += 3) {
      const x = originalPositions[i];
      const y = originalPositions[i + 1];

      positions[i] = x + Math.sin(time * 2 + y * 0.5 + offset) * 0.3;
      positions[i + 1] = y;
      positions[i + 2] = originalPositions[i + 2] + Math.cos(time * 1.5 + x * 0.5 + offset) * 0.2;
    }

    curtainRef.current.geometry.attributes.position.needsUpdate = true;
  });

  // Create curtain geometry
  const segments = 30;
  const width = 8;
  const height = 6;
  const vertices = [];
  const indices = [];

  for (let i = 0; i <= segments; i++) {
    for (let j = 0; j <= segments; j++) {
      const x = (i / segments - 0.5) * width;
      const y = (j / segments - 0.5) * height + 2;
      const z = -5 + offset;

      vertices.push(x, y, z);
    }
  }

  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < segments; j++) {
      const a = i * (segments + 1) + j;
      const b = a + segments + 1;

      indices.push(a, b, a + 1);
      indices.push(b, b + 1, a + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  const positionAttribute = new THREE.Float32BufferAttribute(vertices, 3);
  geometry.setAttribute('position', positionAttribute);
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  const curtainColor = color === 'green' ? '#00ff88' : '#b47aff';

  return (
    <mesh
      ref={curtainRef}
      geometry={geometry}
      userData={{ originalPositions: vertices.slice() }}
    >
      <meshBasicMaterial
        color={curtainColor}
        transparent
        opacity={animationProgress * 0.4}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// Shimmering particles
function AuroraParticles({ animationProgress }) {
  const particlesRef = useRef();

  useFrame(() => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array;
    const colors = particlesRef.current.geometry.attributes.color.array;
    const time = Date.now() * 0.001;

    for (let i = 0; i < 200; i++) {
      const i3 = i * 3;

      positions[i3 + 1] += Math.sin(time + i) * 0.01;

      // Color shift between green and purple
      const colorShift = Math.sin(time * 2 + i * 0.1) * 0.5 + 0.5;
      colors[i3] = colorShift * 0.7; // R
      colors[i3 + 1] = 1; // G
      colors[i3 + 2] = (1 - colorShift) * 0.8; // B
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    particlesRef.current.geometry.attributes.color.needsUpdate = true;
  });

  const particleCount = 200;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 10;
    positions[i3 + 1] = Math.random() * 6 - 1;
    positions[i3 + 2] = -5 + (Math.random() - 0.5) * 3;

    colors[i3] = 0.5;
    colors[i3 + 1] = 1;
    colors[i3 + 2] = 0.5;
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={animationProgress * 0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Page 6: Aurora Borealis Born
export default function Page6({ isInView }) {
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (!isInView) {
      setAnimationProgress(0);
      return;
    }

    const duration = 4000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setAnimationProgress(progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [isInView]);

  const textProgress = Math.max(0, Math.min(animationProgress * 2, 1));

  return (
    <>
      {isInView && (
        <Canvas3D
        showStars={true}
        showControls={false}
        camera={{ position: [0, 0, 8], fov: 70 }}
      >
        {/* Multiple aurora curtains */}
        <AuroraCurtain color="green" offset={0} animationProgress={animationProgress} />
        <AuroraCurtain color="purple" offset={1} animationProgress={animationProgress} />
        <AuroraCurtain color="green" offset={-1} animationProgress={animationProgress} />

        {/* Shimmering particles */}
        <AuroraParticles animationProgress={animationProgress} />

        <ambientLight intensity={0.3} />
      </Canvas3D>
      )}

      <TextOverlay position="bottom" isInView={isInView}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: textProgress, y: textProgress > 0 ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="glass-strong px-10 py-6 rounded-2xl max-w-3xl"
          style={{
            background: 'rgba(10, 14, 39, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '2px solid rgba(0, 255, 136, 0.4)',
            boxShadow: '0 0 40px rgba(0, 255, 136, 0.3)',
          }}
        >
          <p
            className="text-center"
            style={{
              fontSize: 'clamp(18px, 2.5vw, 24px)',
              color: '#ffffff',
              lineHeight: 1.8,
              fontWeight: 300,
            }}
          >
            And there it is—the{' '}
            <strong style={{ color: '#00ff88', fontWeight: 600 }}>
              Aurora Borealis
            </strong>
            ! Brilliant curtains of green and purple light dance across the night sky,
            painting the heavens with Fiery's magnificent energy!
          </p>
        </motion.div>
      </TextOverlay>
    </>
  );
}
