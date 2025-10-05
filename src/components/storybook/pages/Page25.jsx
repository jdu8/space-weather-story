import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { motion } from 'framer-motion';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';

// Scientists dreaming/brainstorming
function ScientistsDreaming({ animationProgress }) {
  const texture = useLoader(TextureLoader, '/sprites/020_scientist_observing.png');
  const childTexture = useLoader(TextureLoader, '/sprites/023_child_dreaming.png');

  return (
    <>
      <sprite position={[-3, -1, 1]} scale={[2.5, 3, 1]}>
        <spriteMaterial map={texture} transparent opacity={animationProgress} />
      </sprite>
      <sprite position={[3, -1, 1]} scale={[2, 2.5, 1]}>
        <spriteMaterial map={childTexture} transparent opacity={animationProgress} />
      </sprite>
    </>
  );
}

// Thought bubble/idea visualization
function IdeaBubbles({ animationProgress }) {
  const bubblesRef = useRef();

  useFrame((state) => {
    if (!bubblesRef.current) return;
    const time = state.clock.getElapsedTime();

    bubblesRef.current.children.forEach((bubble, i) => {
      bubble.position.y = bubble.userData.baseY + Math.sin(time + i) * 0.2;
      const pulse = 1 + Math.sin(time * 2 + i * 0.5) * 0.1;
      bubble.scale.setScalar(pulse * bubble.userData.baseScale);
    });
  });

  const bubbles = [
    { pos: [-3, 1.5, 0], scale: 0.5 },
    { pos: [-2.5, 2, 0], scale: 0.4 },
    { pos: [3, 1.5, 0], scale: 0.6 },
    { pos: [2.5, 2.2, 0], scale: 0.45 },
    { pos: [0, 2.5, 0], scale: 0.8 },
  ];

  return (
    <group ref={bubblesRef}>
      {bubbles.map((bubble, i) => (
        <mesh
          key={i}
          position={bubble.pos}
          userData={{ baseY: bubble.pos[1], baseScale: bubble.scale }}
        >
          <sphereGeometry args={[bubble.scale, 16, 16]} />
          <meshStandardMaterial
            color="#ffaa00"
            emissive="#ffaa00"
            emissiveIntensity={animationProgress * 0.8}
            transparent
            opacity={animationProgress * 0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

// Energy concept visualization
function EnergyConceptGlow({ animationProgress }) {
  const glowRef = useRef();

  useFrame((state) => {
    if (!glowRef.current) return;
    const time = state.clock.getElapsedTime();

    const pulse = 1 + Math.sin(time * 1.5) * 0.2;
    glowRef.current.scale.setScalar(pulse * 3);
  });

  return (
    <mesh ref={glowRef} position={[0, 1, -2]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        color="#00ff88"
        transparent
        opacity={animationProgress * 0.2}
      />
    </mesh>
  );
}

// Question mark particles (curiosity)
function QuestionParticles({ animationProgress }) {
  const particlesRef = useRef();

  useFrame(() => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array;
    const time = Date.now() * 0.001;

    for (let i = 0; i < 30; i++) {
      const i3 = i * 3;
      const angle = (i / 30) * Math.PI * 2;
      const t = ((time * 0.5 + i * 0.1) % 1);
      const radius = t * 4;

      positions[i3] = Math.cos(angle + time) * radius;
      positions[i3 + 1] = 1 + t * 3;
      positions[i3 + 2] = -2 + Math.sin(angle + time) * radius * 0.5;
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const particleCount = 30;
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
        size={0.15}
        color="#ffaa00"
        transparent
        opacity={animationProgress * 0.7}
        sizeAttenuation
      />
    </points>
  );
}

// Page 25: Scientists Dream
export default function Page25({ isInView }) {
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
        <ScientistsDreaming animationProgress={animationProgress} />
        <IdeaBubbles animationProgress={animationProgress} />
        <EnergyConceptGlow animationProgress={animationProgress} />
        <QuestionParticles animationProgress={animationProgress} />

        <pointLight position={[0, 2, 3]} intensity={2} color="#ffaa00" />
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
            background: 'rgba(26, 58, 79, 0.9)',
            backdropFilter: 'blur(16px)',
            border: '2px solid rgba(255, 170, 0, 0.5)',
            boxShadow: '0 0 30px rgba(255, 170, 0, 0.2)',
          }}
        >
          <h3
            className="text-center font-bold mb-4"
            style={{
              fontSize: 'clamp(24px, 3vw, 32px)',
              color: '#ffaa00',
              textShadow: '0 0 20px rgba(255, 170, 0, 0.4)',
            }}
          >
            What If...? 💡
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
            But some scientists started asking a new question: "What if we could do more than just{' '}
            <em>survive</em> Fiery's visits? What if we could{' '}
            <strong style={{ color: '#ffaa00' }}>capture this energy</strong>? Billions of tons
            of plasma, traveling at incredible speeds—what if we could turn it into power?"
          </p>
        </motion.div>
      </TextOverlay>
    </>
  );
}
