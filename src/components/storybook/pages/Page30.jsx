import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { motion } from 'framer-motion';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';
import * as THREE from 'three';

// Child dreaming (representing YOU - the reader)
function YouTheDreamer({ animationProgress }) {
  const spriteRef = useRef();
  const texture = useLoader(TextureLoader, '/sprites/023_child_dreaming.png');

  useFrame((state) => {
    if (!spriteRef.current) return;
    const time = state.clock.getElapsedTime();
    spriteRef.current.position.y = Math.sin(time * 1) * 0.15;
  });

  return (
    <sprite ref={spriteRef} position={[0, -0.5, 2]} scale={[4, 5, 1]}>
      <spriteMaterial map={texture} transparent opacity={animationProgress} />
    </sprite>
  );
}

// Inspiring aurora background
function InspiringAurora({ animationProgress }) {
  const shaderRef = useRef();

  useFrame((state) => {
    if (!shaderRef.current) return;
    const time = state.clock.getElapsedTime();
    shaderRef.current.uniforms.time.value = time;
  });

  const uniforms = {
    time: { value: 0 },
    opacity: { value: animationProgress * 0.7 },
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
      // Epic, flowing aurora
      float wave1 = sin(vUv.x * 8.0 + time * 1.5) * 0.5 + 0.5;
      float wave2 = sin(vUv.x * 5.0 - time * 1.2) * 0.5 + 0.5;
      float wave3 = sin(vUv.x * 12.0 + time * 2.0) * 0.5 + 0.5;

      // Multiple vibrant colors
      vec3 color1 = vec3(0.0, 1.0, 0.53); // Green
      vec3 color2 = vec3(0.0, 0.85, 1.0); // Blue
      vec3 color3 = vec3(0.71, 0.48, 1.0); // Purple
      vec3 color4 = vec3(1.0, 0.42, 0.62); // Pink

      vec3 color = mix(color1, color2, wave1);
      color = mix(color, color3, wave2);
      color = mix(color, color4, wave3 * 0.3);

      float alpha = (1.0 - vUv.y * 0.5) * opacity * (wave2 * 0.3 + 0.7);

      gl_FragColor = vec4(color, alpha);
    }
  `;

  return (
    <mesh position={[0, 2, -10]} scale={[30, 12, 1]}>
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

// Floating stars/particles of possibility
function PossibilityStars({ animationProgress }) {
  const particlesRef = useRef();

  useFrame(() => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array;
    const colors = particlesRef.current.geometry.attributes.color.array;
    const time = Date.now() * 0.001;

    for (let i = 0; i < 150; i++) {
      const i3 = i * 3;

      positions[i3 + 1] += Math.sin(time + i * 0.1) * 0.008;

      // Rainbow colors cycling
      const hue = (time * 0.1 + i * 0.02) % 1;
      const r = Math.abs(Math.sin(hue * Math.PI * 2));
      const g = Math.abs(Math.sin((hue + 0.33) * Math.PI * 2));
      const b = Math.abs(Math.sin((hue + 0.66) * Math.PI * 2));

      colors[i3] = r;
      colors[i3 + 1] = g;
      colors[i3 + 2] = b;
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    particlesRef.current.geometry.attributes.color.needsUpdate = true;
  });

  const particleCount = 150;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 15;
    positions[i3 + 1] = Math.random() * 10 - 2;
    positions[i3 + 2] = (Math.random() - 0.5) * 8 - 5;

    colors[i3] = 1;
    colors[i3 + 1] = 1;
    colors[i3 + 2] = 1;
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
        size={0.2}
        vertexColors
        transparent
        opacity={animationProgress * 0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Glowing symbols of science/education
function ScienceSymbols({ animationProgress }) {
  const symbolsRef = useRef();

  useFrame((state) => {
    if (!symbolsRef.current) return;
    const time = state.clock.getElapsedTime();

    symbolsRef.current.children.forEach((symbol, i) => {
      symbol.position.y = symbol.userData.baseY + Math.sin(time + i * 1.2) * 0.3;
      symbol.rotation.z = Math.sin(time * 0.5 + i) * 0.1;
    });
  });

  const positions = [
    [-4, 2, 0],
    [4, 2, 0],
    [-3, 3.5, 0],
    [3, 3.5, 0],
  ];

  return (
    <group ref={symbolsRef}>
      {positions.map((pos, i) => (
        <mesh
          key={i}
          position={pos}
          userData={{ baseY: pos[1] }}
        >
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#00ff88' : '#00d9ff'}
            emissive={i % 2 === 0 ? '#00ff88' : '#00d9ff'}
            emissiveIntensity={animationProgress * 1.2}
          />
        </mesh>
      ))}
    </group>
  );
}

// Page 30: Inspirational Ending - YOU could make this real!
export default function Page30({ isInView }) {
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (!isInView) {
      setAnimationProgress(0);
      return;
    }

    const duration = 6000;
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

  const textProgress = Math.max(0, Math.min(animationProgress * 1.5, 1));
  const callToActionProgress = Math.max(0, (animationProgress - 0.5) * 2);

  return (
    <>
      {isInView && (
        <Canvas3D
        showStars={true}
        showControls={false}
        camera={{ position: [0, 0, 10], fov: 70 }}
      >
        <InspiringAurora animationProgress={animationProgress} />
        <PossibilityStars animationProgress={animationProgress} />
        <YouTheDreamer animationProgress={animationProgress} />
        <ScienceSymbols animationProgress={animationProgress} />

        <pointLight position={[0, 3, 3]} intensity={2} color="#00ff88" />
        <pointLight position={[0, -2, 3]} intensity={2} color="#b47aff" />
        <ambientLight intensity={0.6} />
      </Canvas3D>
      )}

      <TextOverlay position="bottom" isInView={isInView}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: textProgress, y: textProgress > 0 ? 0 : 20 }}
          transition={{ duration: 0.8 }}
          className="glass-strong px-10 py-10 rounded-2xl max-w-5xl"
          style={{
            background: 'rgba(26, 58, 95, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '3px solid rgba(0, 255, 136, 0.6)',
            boxShadow: '0 0 60px rgba(0, 255, 136, 0.4)',
          }}
        >
          <motion.h3
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: textProgress,
              scale: textProgress > 0 ? 1 : 0.9,
            }}
            className="text-center font-bold mb-6"
            style={{
              fontSize: 'clamp(28px, 4vw, 42px)',
              background: 'linear-gradient(135deg, #00ff88, #00d9ff, #b47aff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 40px rgba(0, 255, 136, 0.5)',
            }}
          >
            The Future Needs YOU! 🌟
          </motion.h3>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: textProgress }}
            transition={{ delay: 0.3 }}
            className="text-center mb-6"
            style={{
              fontSize: 'clamp(17px, 2.3vw, 22px)',
              color: '#ffffff',
              lineHeight: 1.9,
              fontWeight: 300,
            }}
          >
            This isn't just a story—it's a{' '}
            <strong style={{ color: '#00ff88' }}>glimpse of what's possible</strong>. The
            scientists, engineers, and dreamers who will make this future real?{' '}
            <strong style={{ color: '#00d9ff' }}>They might be reading this right now</strong>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: callToActionProgress,
              y: callToActionProgress > 0 ? 0 : 10,
            }}
            transition={{ delay: 0.6 }}
            className="text-center p-6 rounded-xl mb-4"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 217, 255, 0.1))',
              border: '2px solid rgba(0, 255, 136, 0.3)',
            }}
          >
            <p
              className="font-bold mb-3"
              style={{
                fontSize: 'clamp(20px, 2.8vw, 28px)',
                color: '#00ff88',
              }}
            >
              Maybe it's YOU. 🚀
            </p>
            <p
              style={{
                fontSize: 'clamp(16px, 2vw, 19px)',
                color: '#ffffff',
                lineHeight: 1.8,
              }}
            >
              Study science. Learn engineering. Dream big. Ask questions. The cosmos is waiting
              for your ideas. Fiery is waiting to become humanity's partner.
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: callToActionProgress }}
            transition={{ delay: 0.9 }}
            className="text-center italic text-lg"
            style={{
              fontSize: 'clamp(18px, 2.2vw, 24px)',
              background: 'linear-gradient(90deg, #ff6b9d, #b47aff, #00d9ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 600,
            }}
          >
            Will you help turn this dream into reality?
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: callToActionProgress,
              scale: callToActionProgress > 0 ? 1 : 0,
            }}
            transition={{ delay: 1.2, type: 'spring' }}
            className="text-center mt-6 text-6xl"
          >
            ✨🌌🔬🚀✨
          </motion.div>
        </motion.div>
      </TextOverlay>
    </>
  );
}
