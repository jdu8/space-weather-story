import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { motion } from 'framer-motion';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';
import * as THREE from 'three';

// Fiery arriving (happy version)
function FieryArriving({ animationProgress }) {
  const spriteRef = useRef();
  const texture = useLoader(TextureLoader, '/sprites/003_fiery_happy.png');

  useFrame((state) => {
    if (!spriteRef.current) return;
    const time = state.clock.getElapsedTime();
    spriteRef.current.position.y = Math.sin(time * 1.2) * 0.2;
  });

  const xPos = -8 + animationProgress * 8;
  const scale = 2 + animationProgress * 2;

  return (
    <sprite ref={spriteRef} position={[xPos, 1, 2]} scale={[scale, scale, 1]}>
      <spriteMaterial map={texture} transparent />
    </sprite>
  );
}

// Massive aurora effects (the most powerful ever)
function CarringtonAurora({ animationProgress }) {
  const shaderRef = useRef();

  useFrame((state) => {
    if (!shaderRef.current) return;
    const time = state.clock.getElapsedTime();
    shaderRef.current.uniforms.time.value = time;
  });

  const uniforms = {
    time: { value: 0 },
    opacity: { value: Math.min(animationProgress * 1.5, 1) },
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
      // Intense, chaotic waves
      float wave1 = sin(vUv.x * 12.0 + time * 3.0) * 0.5 + 0.5;
      float wave2 = sin(vUv.x * 8.0 - time * 2.5) * 0.5 + 0.5;
      float wave3 = sin(vUv.x * 15.0 + time * 4.0) * 0.5 + 0.5;

      // Vivid colors - green, purple, red (rare for aurora)
      vec3 color1 = vec3(0.0, 1.0, 0.4); // Bright green
      vec3 color2 = vec3(1.0, 0.0, 0.4); // Bright red (rare)
      vec3 color3 = vec3(0.8, 0.3, 1.0); // Bright purple

      vec3 color = mix(color1, color2, wave1);
      color = mix(color, color3, wave2 * wave3);

      float alpha = (1.0 - vUv.y * 0.6) * opacity * (wave3 * 0.3 + 0.7);

      gl_FragColor = vec4(color, alpha);
    }
  `;

  return (
    <mesh position={[0, 3, -8]} scale={[30, 12, 1]}>
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

// Year 1859 title sprite
function Year1859Title({ animationProgress }) {
  const texture = useLoader(TextureLoader, '/sprites/052_year_1859_title.png');

  const opacity = Math.max(0, (animationProgress - 0.2) * 2);

  return (
    <sprite position={[0, 3.5, 3]} scale={[6, 1.5, 1]}>
      <spriteMaterial map={texture} transparent opacity={Math.min(opacity, 1)} />
    </sprite>
  );
}

// Intense particle effects
function IntenseParticles({ animationProgress }) {
  const particlesRef = useRef();

  useFrame(() => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array;
    const colors = particlesRef.current.geometry.attributes.color.array;
    const time = Date.now() * 0.001;

    for (let i = 0; i < 300; i++) {
      const i3 = i * 3;

      positions[i3 + 1] += Math.sin(time * 3 + i * 0.1) * 0.02;

      const colorCycle = Math.sin(time * 4 + i * 0.05) * 0.5 + 0.5;
      colors[i3] = colorCycle; // R
      colors[i3 + 1] = 1 - colorCycle * 0.5; // G
      colors[i3 + 2] = (1 - colorCycle) * 0.8; // B
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    particlesRef.current.geometry.attributes.color.needsUpdate = true;
  });

  const particleCount = 300;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 15;
    positions[i3 + 1] = Math.random() * 8 - 2;
    positions[i3 + 2] = -6 + (Math.random() - 0.5) * 4;

    colors[i3] = 1;
    colors[i3 + 1] = 0.5;
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
        size={0.18}
        vertexColors
        transparent
        opacity={animationProgress}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Page 10: 1859 Carrington Event
export default function Page10({ isInView }) {
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
        camera={{ position: [0, 0, 10], fov: 70 }}
      >
        <CarringtonAurora animationProgress={animationProgress} />
        <IntenseParticles animationProgress={animationProgress} />
        <FieryArriving animationProgress={animationProgress} />
        <Year1859Title animationProgress={animationProgress} />

        <ambientLight intensity={0.3} />
      </Canvas3D>
      )}

      <TextOverlay position="bottom" isInView={isInView}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: textProgress, y: textProgress > 0 ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="glass-strong px-10 py-8 rounded-2xl max-w-4xl"
          style={{
            background: 'rgba(42, 21, 32, 0.9)',
            backdropFilter: 'blur(16px)',
            border: '2px solid rgba(255, 0, 100, 0.5)',
            boxShadow: '0 0 40px rgba(255, 0, 100, 0.3)',
          }}
        >
          <h3
            className="text-center font-bold mb-4"
            style={{
              fontSize: 'clamp(26px, 3.5vw, 36px)',
              color: '#ff0066',
              textShadow: '0 0 30px rgba(255, 0, 100, 0.6)',
            }}
          >
            The Carrington Event
          </h3>
          <p
            className="text-center"
            style={{
              fontSize: 'clamp(16px, 2.2vw, 22px)',
              color: '#ffffff',
              lineHeight: 1.8,
              fontWeight: 300,
            }}
          >
            September 1859: Fiery created the{' '}
            <strong style={{ color: '#ff0066' }}>most powerful auroras ever recorded</strong>
            ! So bright, people could read newspapers at midnight. Auroras appeared as far south
            as the Caribbean. It was magnificent... but humanity was about to change.
          </p>
        </motion.div>
      </TextOverlay>
    </>
  );
}
