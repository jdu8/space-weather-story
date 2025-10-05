import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { motion } from 'framer-motion';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';
import * as THREE from 'three';

// Viking silhouettes watching aurora
function VikingScene({ animationProgress }) {
  const texture = useLoader(TextureLoader, '/sprites/016_viking_silhouette.png');

  return (
    <>
      {/* Three viking silhouettes */}
      <sprite position={[-3, -2, 2]} scale={[2, 2.5, 1]}>
        <spriteMaterial map={texture} transparent opacity={animationProgress} />
      </sprite>
      <sprite position={[0, -2, 2]} scale={[2.2, 2.7, 1]}>
        <spriteMaterial map={texture} transparent opacity={animationProgress} />
      </sprite>
      <sprite position={[3, -2, 2]} scale={[1.8, 2.3, 1]}>
        <spriteMaterial map={texture} transparent opacity={animationProgress} />
      </sprite>
    </>
  );
}

// Animated aurora in background
function BackgroundAurora({ animationProgress }) {
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
      float wave = sin(vUv.x * 10.0 + time * 2.0) * 0.5 + 0.5;
      float wave2 = sin(vUv.x * 7.0 - time * 1.5) * 0.5 + 0.5;

      vec3 color1 = vec3(0.0, 1.0, 0.53); // Green
      vec3 color2 = vec3(0.71, 0.48, 1.0); // Purple

      vec3 color = mix(color1, color2, wave * wave2);

      float alpha = (1.0 - vUv.y) * opacity * (wave * 0.3 + 0.5);

      gl_FragColor = vec4(color, alpha);
    }
  `;

  return (
    <mesh position={[0, 2, -8]} scale={[20, 8, 1]}>
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

// Nordic runes overlay
function NordicRunes({ animationProgress }) {
  const texture = useLoader(TextureLoader, '/sprites/055_viking_runes.png');

  const opacity = Math.max(0, (animationProgress - 0.3) * 1.43);

  return (
    <sprite position={[-4, 3, 0]} scale={[2.5, 1, 1]}>
      <spriteMaterial map={texture} transparent opacity={opacity * 0.3} />
    </sprite>
  );
}

// Page 7: Ancient Wonder - Vikings
export default function Page7({ isInView }) {
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
        <BackgroundAurora animationProgress={animationProgress} />
        <VikingScene animationProgress={animationProgress} />
        <NordicRunes animationProgress={animationProgress} />

        <ambientLight intensity={0.4} />
        <pointLight position={[0, 5, 5]} intensity={1} color="#00ff88" />
      </Canvas3D>
      )}

      <TextOverlay position="bottom" isInView={isInView}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: textProgress, y: textProgress > 0 ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="glass-strong px-10 py-8 rounded-2xl max-w-3xl"
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
            Ancient Wonder: The Vikings
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
            The Norse people gazed in awe at the dancing lights. They believed
            they were watching the{' '}
            <strong style={{ color: '#00ff88', fontWeight: 600 }}>
              Valkyries
            </strong>{' '}
            riding across the heavens—warriors of the gods guiding fallen heroes
            to Valhalla.
          </p>
        </motion.div>
      </TextOverlay>
    </>
  );
}
