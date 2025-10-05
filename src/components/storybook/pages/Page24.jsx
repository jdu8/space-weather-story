import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { motion } from 'framer-motion';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';
import * as THREE from 'three';

// Fiery dancing (happy again)
function FieryDancing({ animationProgress }) {
  const spriteRef = useRef();
  const texture = useLoader(TextureLoader, '/sprites/005_fiery_dancing.png');

  useFrame((state) => {
    if (!spriteRef.current) return;
    const time = state.clock.getElapsedTime();

    // Dancing motion
    spriteRef.current.position.y = Math.sin(time * 2) * 0.3;
    spriteRef.current.rotation.z = Math.sin(time * 1.5) * 0.1;
    spriteRef.current.position.x = Math.sin(time * 0.8) * 0.5;
  });

  return (
    <sprite ref={spriteRef} position={[0, 0, 2]} scale={[4, 4, 1]}>
      <spriteMaterial map={texture} transparent opacity={animationProgress} />
    </sprite>
  );
}

// Beautiful aurora (prepared version)
function PreparedAurora({ animationProgress }) {
  const shaderRef = useRef();

  useFrame((state) => {
    if (!shaderRef.current) return;
    const time = state.clock.getElapsedTime();
    shaderRef.current.uniforms.time.value = time;
  });

  const uniforms = {
    time: { value: 0 },
    opacity: { value: animationProgress * 0.6 },
  };

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float time;
    uniform float opacity;
    varying vec2 vUv;

    void main() {
      float wave1 = sin(vUv.x * 10.0 + time * 1.5) * 0.5 + 0.5;
      float wave2 = sin(vUv.x * 7.0 - time * 1.2) * 0.5 + 0.5;

      vec3 color1 = vec3(0.0, 1.0, 0.53); // Green
      vec3 color2 = vec3(0.71, 0.48, 1.0); // Purple

      vec3 color = mix(color1, color2, wave1 * wave2);

      float alpha = (1.0 - vUv.y * 0.7) * opacity * (wave2 * 0.3 + 0.7);

      gl_FragColor = vec4(color, alpha);
    }
  `;

  return (
    <mesh position={[0, 2, -8]} scale={[20, 10, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        ref={shaderRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// Protected infrastructure silhouettes
function ProtectedInfrastructure({ animationProgress }) {
  const positions = [
    [-4, -2, -2],
    [-1, -2, -2],
    [2, -2, -2],
    [5, -2, -2],
  ];

  return (
    <>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[1.5, 3 + Math.random(), 0.5]} />
          <meshStandardMaterial
            color="#1a2a3a"
            emissive="#00ff88"
            emissiveIntensity={animationProgress * 0.2}
          />
        </mesh>
      ))}
    </>
  );
}

// Safe aurora particles
function SafeAuroraParticles({ animationProgress }) {
  const particlesRef = useRef();

  useFrame(() => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array;
    const colors = particlesRef.current.geometry.attributes.color.array;
    const time = Date.now() * 0.001;

    for (let i = 0; i < 150; i++) {
      const i3 = i * 3;

      positions[i3 + 1] += Math.sin(time * 2 + i * 0.1) * 0.01;

      const colorShift = Math.sin(time + i * 0.1) * 0.5 + 0.5;
      colors[i3] = colorShift * 0.7;
      colors[i3 + 1] = 1;
      colors[i3 + 2] = (1 - colorShift) * 0.8;
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    particlesRef.current.geometry.attributes.color.needsUpdate = true;
  });

  const particleCount = 150;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 12;
    positions[i3 + 1] = Math.random() * 6 - 1;
    positions[i3 + 2] = -6 + (Math.random() - 0.5) * 3;

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
        size={0.12}
        vertexColors
        transparent
        opacity={animationProgress * 0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Page 24: Prepared Aurora - Beautiful lights return, humanity is ready
export default function Page24({ isInView }) {
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (!isInView) {
      setAnimationProgress(0);
      return;
    }

    const duration = 5000;
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
        camera={{ position: [0, 0, 10], fov: 70 }}
      >
        <PreparedAurora animationProgress={animationProgress} />
        <SafeAuroraParticles animationProgress={animationProgress} />
        <FieryDancing animationProgress={animationProgress} />
        <ProtectedInfrastructure animationProgress={animationProgress} />

        <pointLight position={[0, 3, 3]} intensity={1.5} color="#00ff88" />
        <ambientLight intensity={0.4} />
      </Canvas3D>
      )}

      <TextOverlay position="bottom" isInView={isInView}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: textProgress, y: textProgress > 0 ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="glass-strong px-10 py-8 rounded-2xl max-w-4xl"
          style={{
            background: 'rgba(26, 42, 58, 0.9)',
            backdropFilter: 'blur(16px)',
            border: '2px solid rgba(0, 255, 136, 0.5)',
            boxShadow: '0 0 40px rgba(0, 255, 136, 0.3)',
          }}
        >
          <h3
            className="text-center font-bold mb-4"
            style={{
              fontSize: 'clamp(26px, 3.5vw, 36px)',
              color: '#00ff88',
              textShadow: '0 0 30px rgba(0, 255, 136, 0.5)',
            }}
          >
            The Aurora Returns 🌌
          </h3>
          <p
            className="text-center mb-4"
            style={{
              fontSize: 'clamp(16px, 2.2vw, 20px)',
              color: '#ffffff',
              lineHeight: 1.8,
              fontWeight: 300,
            }}
          >
            And when Fiery arrives now, the auroras are just as beautiful as they've always been.
            People gather to watch the dancing lights—but this time,{' '}
            <strong style={{ color: '#00ff88' }}>humanity is ready</strong>.
          </p>
          <p
            className="text-center italic"
            style={{
              fontSize: 'clamp(16px, 2vw, 18px)',
              color: '#b47aff',
              lineHeight: 1.8,
            }}
          >
            No fear. No panic. Just wonder, preparation, and resilience.
          </p>
        </motion.div>
      </TextOverlay>
    </>
  );
}
