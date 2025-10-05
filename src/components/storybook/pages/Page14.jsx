import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { motion } from 'framer-motion';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';
import * as THREE from 'three';

// Tumbling satellite
function TumblingSatellite({ animationProgress }) {
  const spriteRef = useRef();
  const texture = useLoader(TextureLoader, '/sprites/009_satellite_tumbling.png');

  useFrame((state) => {
    if (!spriteRef.current) return;
    const time = state.clock.getElapsedTime();

    // Tumbling rotation
    spriteRef.current.rotation.z = time * 2;

    // Falling/drifting
    spriteRef.current.position.x = Math.sin(time * 0.8) * 2;
    spriteRef.current.position.y = 1 - (animationProgress * 3);
  });

  return (
    <sprite ref={spriteRef} position={[-2, 1, 0]} scale={[2, 2, 1]}>
      <spriteMaterial map={texture} transparent opacity={animationProgress} />
    </sprite>
  );
}

// Exploding transformer
function ExplodingTransformer({ animationProgress }) {
  const texture = useLoader(TextureLoader, '/sprites/012_transformer_exploding.png');
  const explosionProgress = Math.max(0, (animationProgress - 0.3) * 1.43);

  return (
    <sprite position={[2, -1, 0]} scale={[3, 3, 1]}>
      <spriteMaterial
        map={texture}
        transparent
        opacity={explosionProgress}
        blending={THREE.AdditiveBlending}
      />
    </sprite>
  );
}

// GPS error icon
function GPSError({ animationProgress }) {
  const texture = useLoader(TextureLoader, '/sprites/013_gps_icon_error.png');
  const spriteRef = useRef();

  useFrame((state) => {
    if (!spriteRef.current) return;
    const time = state.clock.getElapsedTime();
    spriteRef.current.scale.setScalar(1.5 + Math.sin(time * 3) * 0.2);
  });

  const errorProgress = Math.max(0, (animationProgress - 0.5) * 2);

  return (
    <sprite ref={spriteRef} position={[0, 1.5, 1]} scale={[1.5, 1.5, 1]}>
      <spriteMaterial map={texture} transparent opacity={errorProgress} />
    </sprite>
  );
}

// Glitch particles
function GlitchParticles({ animationProgress }) {
  const particlesRef = useRef();

  useFrame(() => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array;
    const time = Date.now() * 0.005;

    for (let i = 0; i < 100; i++) {
      const i3 = i * 3;

      // Chaotic glitch movement
      positions[i3] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] = (Math.random() - 0.5) * 8;
      positions[i3 + 2] = (Math.random() - 0.5) * 4;
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#ff0033"
        transparent
        opacity={animationProgress * 0.7}
        sizeAttenuation
      />
    </points>
  );
}

// Page 14: Technology Fails
export default function Page14({ isInView }) {
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
        backgroundColor="#1a0a0a"
      >
        <TumblingSatellite animationProgress={animationProgress} />
        <ExplodingTransformer animationProgress={animationProgress} />
        <GPSError animationProgress={animationProgress} />
        <GlitchParticles animationProgress={animationProgress} />

        <pointLight position={[2, -1, 2]} intensity={3} color="#ff6b35" />
        <ambientLight intensity={0.2} />
      </Canvas3D>
      )}

      <TextOverlay position="bottom" isInView={isInView}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: textProgress, y: textProgress > 0 ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="glass-strong px-10 py-8 rounded-2xl max-w-4xl"
          style={{
            background: 'rgba(58, 5, 32, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '2px solid rgba(255, 0, 51, 0.5)',
            boxShadow: '0 0 40px rgba(255, 0, 51, 0.3)',
          }}
        >
          <h3
            className="text-center font-bold mb-4"
            style={{
              fontSize: 'clamp(26px, 3.5vw, 36px)',
              color: '#ff0033',
              textShadow: '0 0 30px rgba(255, 0, 51, 0.6)',
            }}
          >
            Systems Failing
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
            <strong style={{ color: '#ff0033' }}>Satellites tumble</strong> out of control.{' '}
            <strong style={{ color: '#ff6b35' }}>Transformers explode</strong>.{' '}
            <strong style={{ color: '#ffaa00' }}>GPS signals vanish</strong>. Power grids teeter
            on the edge of collapse. The world that depends on technology is suddenly vulnerable.
          </p>
        </motion.div>
      </TextOverlay>
    </>
  );
}
