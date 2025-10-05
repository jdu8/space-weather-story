import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { motion } from 'framer-motion';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';

// ISS (International Space Station)
function ISS({ animationProgress }) {
  const spriteRef = useRef();
  const texture = useLoader(TextureLoader, '/sprites/014_space_station_iss.png');

  useFrame((state) => {
    if (!spriteRef.current) return;
    const time = state.clock.getElapsedTime();
    spriteRef.current.position.x = Math.sin(time * 0.5) * 1;
  });

  return (
    <sprite ref={spriteRef} position={[0, 1, -2]} scale={[4, 3, 1]}>
      <spriteMaterial map={texture} transparent opacity={animationProgress} />
    </sprite>
  );
}

// Astronaut sheltering
function AstronautSheltering({ animationProgress }) {
  const texture = useLoader(TextureLoader, '/sprites/022_astronaut_sheltering.png');

  return (
    <sprite position={[0, -1, 0]} scale={[2.5, 3, 1]}>
      <spriteMaterial map={texture} transparent opacity={animationProgress} />
    </sprite>
  );
}

// Radiation particles being deflected
function RadiationParticles({ animationProgress }) {
  const particlesRef = useRef();

  useFrame(() => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array;
    const time = Date.now() * 0.003;

    for (let i = 0; i < 80; i++) {
      const i3 = i * 3;
      const angle = (i / 80) * Math.PI * 2;
      const t = ((time + i * 0.05) % 1);

      // Particles come in from outside
      const radius = 5 - t * 3;

      positions[i3] = Math.cos(angle + time) * radius;
      positions[i3 + 1] = 1 + Math.sin(time * 2 + i) * 2;
      positions[i3 + 2] = -2 + Math.sin(angle + time) * radius * 0.3;

      // Deflect when close to station
      if (radius < 2) {
        positions[i3] *= 1.5;
        positions[i3 + 2] *= 1.5;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const particleCount = 80;
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
        color="#ff6b35"
        transparent
        opacity={animationProgress * 0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Protected module glow
function ProtectedModuleGlow({ animationProgress }) {
  const glowRef = useRef();

  useFrame((state) => {
    if (!glowRef.current) return;
    const time = state.clock.getElapsedTime();

    const pulse = 1 + Math.sin(time * 2) * 0.1;
    glowRef.current.scale.setScalar(pulse);
  });

  return (
    <mesh ref={glowRef} position={[0, -1, -0.5]}>
      <sphereGeometry args={[1.5, 16, 16]} />
      <meshBasicMaterial
        color="#00d9ff"
        transparent
        opacity={animationProgress * 0.15}
      />
    </mesh>
  );
}

// Page 21: Astronaut Safety
export default function Page21({ isInView }) {
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
        camera={{ position: [0, 0, 10], fov: 60 }}
      >
        <ISS animationProgress={animationProgress} />
        <AstronautSheltering animationProgress={animationProgress} />
        <RadiationParticles animationProgress={animationProgress} />
        <ProtectedModuleGlow animationProgress={animationProgress} />

        <pointLight position={[0, -1, 2]} intensity={2} color="#00d9ff" />
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
            background: 'rgba(26, 42, 58, 0.9)',
            backdropFilter: 'blur(16px)',
            border: '2px solid rgba(0, 217, 255, 0.4)',
            boxShadow: '0 0 30px rgba(0, 217, 255, 0.2)',
          }}
        >
          <h3
            className="text-center font-bold mb-4"
            style={{
              fontSize: 'clamp(24px, 3vw, 32px)',
              color: '#00d9ff',
              textShadow: '0 0 20px rgba(0, 217, 255, 0.4)',
            }}
          >
            Protecting Our Astronauts
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
            On the International Space Station, astronauts have protocols: when Fiery arrives,
            they shelter in{' '}
            <strong style={{ color: '#00d9ff' }}>heavily shielded modules</strong>, safe from
            the radiation. They don't panic—they prepare.
          </p>
        </motion.div>
      </TextOverlay>
    </>
  );
}
