import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { motion } from 'framer-motion';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';
import * as THREE from 'three';

// Cultural scenes
function CulturalScene({ position, texture, scale = [2, 2.5, 1], animationProgress, delay = 0 }) {
  const spriteRef = useRef();
  const loadedTexture = useLoader(TextureLoader, texture);

  useFrame((state) => {
    if (!spriteRef.current) return;
    const time = state.clock.getElapsedTime();
    spriteRef.current.position.y = position[1] + Math.sin(time * 0.8 + delay) * 0.1;
  });

  const opacity = Math.max(0, (animationProgress - delay * 0.3) * 1.5);

  return (
    <sprite ref={spriteRef} position={position} scale={scale}>
      <spriteMaterial map={loadedTexture} transparent opacity={Math.min(opacity, 1)} />
    </sprite>
  );
}

// Aurora background with shifting colors
function DynamicAurora({ animationProgress }) {
  const shaderRef = useRef();

  useFrame((state) => {
    if (!shaderRef.current) return;
    const time = state.clock.getElapsedTime();
    shaderRef.current.uniforms.time.value = time;
  });

  const uniforms = {
    time: { value: 0 },
    opacity: { value: animationProgress * 0.5 },
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
      // Multi-layered waves
      float wave1 = sin(vUv.x * 8.0 + time * 1.5) * 0.5 + 0.5;
      float wave2 = sin(vUv.x * 5.0 - time * 2.0) * 0.5 + 0.5;
      float wave3 = sin(vUv.x * 12.0 + time * 0.8) * 0.5 + 0.5;

      // Multiple colors (green, purple, blue)
      vec3 color1 = vec3(0.0, 1.0, 0.53); // Green
      vec3 color2 = vec3(0.71, 0.48, 1.0); // Purple
      vec3 color3 = vec3(0.0, 0.85, 1.0); // Blue

      vec3 color = mix(color1, color2, wave1);
      color = mix(color, color3, wave2 * 0.5);

      float alpha = (1.0 - vUv.y * 0.8) * opacity * (wave3 * 0.4 + 0.6);

      gl_FragColor = vec4(color, alpha);
    }
  `;

  return (
    <mesh position={[0, 2, -10]} scale={[25, 10, 1]}>
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

// Decorative cultural patterns
function CulturalPatterns({ animationProgress }) {
  const inuitTexture = useLoader(TextureLoader, '/sprites/056_inuit_art_pattern.png');
  const nativeTexture = useLoader(TextureLoader, '/sprites/057_native_american_pattern.png');

  const opacity = Math.max(0, (animationProgress - 0.4) * 1.67) * 0.25;

  return (
    <>
      <sprite position={[-5, 3.5, 1]} scale={[2, 2, 1]}>
        <spriteMaterial map={inuitTexture} transparent opacity={opacity} />
      </sprite>
      <sprite position={[5, 3.5, 1]} scale={[2, 2, 1]}>
        <spriteMaterial map={nativeTexture} transparent opacity={opacity} />
      </sprite>
    </>
  );
}

// Page 8: Ancient Wonder - Indigenous Cultures
export default function Page8({ isInView }) {
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
        camera={{ position: [0, 0, 12], fov: 70 }}
      >
        <DynamicAurora animationProgress={animationProgress} />

        {/* Indigenous observers */}
        <CulturalScene
          position={[-4, -1.5, 3]}
          texture="/src/assets/sprites/017_inuit_family.png"
          scale={[2.5, 3, 1]}
          animationProgress={animationProgress}
          delay={0}
        />
        <CulturalScene
          position={[1, -1.5, 3]}
          texture="/src/assets/sprites/018_native_american_elder.png"
          scale={[2, 3, 1]}
          animationProgress={animationProgress}
          delay={0.3}
        />
        <CulturalScene
          position={[5, -1.5, 2]}
          texture="/src/assets/sprites/019_japanese_observer.png"
          scale={[1.8, 2.8, 1]}
          animationProgress={animationProgress}
          delay={0.6}
        />

        <CulturalPatterns animationProgress={animationProgress} />

        <ambientLight intensity={0.4} />
        <pointLight position={[0, 5, 5]} intensity={1.5} color="#00ff88" />
      </Canvas3D>
      )}

      <TextOverlay position="bottom" isInView={isInView}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: textProgress, y: textProgress > 0 ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="glass-strong px-10 py-8 rounded-2xl max-w-4xl"
          style={{
            background: 'rgba(10, 14, 39, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '2px solid rgba(0, 255, 136, 0.3)',
            boxShadow: '0 0 30px rgba(0, 255, 136, 0.2)',
          }}
        >
          <h3
            className="text-center font-bold mb-4"
            style={{
              fontSize: 'clamp(24px, 3vw, 32px)',
              color: '#00ff88',
              textShadow: '0 0 20px rgba(0, 255, 136, 0.4)',
            }}
          >
            Ancient Wonder: Indigenous Cultures
          </h3>
          <p
            className="text-center"
            style={{
              fontSize: 'clamp(16px, 2.2vw, 20px)',
              color: '#ffffff',
              lineHeight: 1.8,
              fontWeight: 300,
            }}
          >
            Around the world, indigenous peoples saw Fiery's light as sacred.
            The Inuit believed it was{' '}
            <strong style={{ color: '#00ff88' }}>spirits playing</strong>,
            Native Americans saw{' '}
            <strong style={{ color: '#b47aff' }}>dancing ancestors</strong>,
            and the Japanese considered it a{' '}
            <strong style={{ color: '#00d9ff' }}>divine omen</strong>. Fiery was{' '}
            <em style={{ color: '#ffd700' }}>loved, revered, magical</em>...
          </p>
        </motion.div>
      </TextOverlay>
    </>
  );
}
