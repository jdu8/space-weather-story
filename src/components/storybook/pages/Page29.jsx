import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { motion } from 'framer-motion';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';

// Fiery partnering with humans
function FieryPartnering({ animationProgress }) {
  const spriteRef = useRef();
  const texture = useLoader(TextureLoader, '/sprites/006_fiery_partnering.png');

  useFrame((state) => {
    if (!spriteRef.current) return;
    const time = state.clock.getElapsedTime();

    // Gentle floating
    spriteRef.current.position.y = Math.sin(time * 1.2) * 0.2;
    spriteRef.current.position.x = Math.sin(time * 0.5) * 0.3;
  });

  return (
    <sprite ref={spriteRef} position={[-2, 0.5, 2]} scale={[4, 4, 1]}>
      <spriteMaterial map={texture} transparent opacity={animationProgress} />
    </sprite>
  );
}

// Human scientist/child representing humanity
function HumanityRepresentative({ animationProgress }) {
  const childTexture = useLoader(TextureLoader, '/sprites/023_child_dreaming.png');

  return (
    <sprite position={[2, -0.5, 2]} scale={[3, 3.5, 1]}>
      <spriteMaterial map={childTexture} transparent opacity={animationProgress} />
    </sprite>
  );
}

// Partnership energy visualization
function PartnershipEnergy({ animationProgress }) {
  const particlesRef = useRef();

  useFrame(() => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array;
    const colors = particlesRef.current.geometry.attributes.color.array;
    const time = Date.now() * 0.002;

    for (let i = 0; i < 80; i++) {
      const i3 = i * 3;
      const angle = (i / 80) * Math.PI * 2;
      const t = ((time + i * 0.05) % 1);
      const radius = 1 + Math.sin(t * Math.PI) * 2;

      positions[i3] = Math.cos(angle + time) * radius;
      positions[i3 + 1] = Math.sin(time * 2 + i) * 0.8;
      positions[i3 + 2] = Math.sin(angle + time) * radius * 0.5 + 1;

      // Gradient colors between Fiery and human
      const colorMix = Math.sin(time + i * 0.1) * 0.5 + 0.5;
      colors[i3] = 1 - colorMix * 0.5; // R
      colors[i3 + 1] = 0.5 + colorMix * 0.5; // G
      colors[i3 + 2] = colorMix * 0.5; // B
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    particlesRef.current.geometry.attributes.color.needsUpdate = true;
  });

  const particleCount = 80;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = 0;
    positions[i3 + 1] = 0;
    positions[i3 + 2] = 0;

    colors[i3] = 1;
    colors[i3 + 1] = 0.5;
    colors[i3 + 2] = 0;
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

// Connecting line between Fiery and humanity
function ConnectionLine({ animationProgress }) {
  const lineRef = useRef();

  useFrame((state) => {
    if (!lineRef.current) return;
    const time = state.clock.getElapsedTime();
    lineRef.current.material.opacity = animationProgress * (0.5 + Math.sin(time * 2) * 0.2);
  });

  const points = [
    new THREE.Vector3(-2, 0.5, 2),
    new THREE.Vector3(0, 1, 2),
    new THREE.Vector3(2, -0.5, 2),
  ];

  const curve = new THREE.CatmullRomCurve3(points);
  const curvePoints = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color="#00ff88" transparent opacity={0.5} linewidth={3} />
    </line>
  );
}

// Heart particles symbolizing harmony
function HarmonyHearts({ animationProgress }) {
  const heartsRef = useRef();

  useFrame((state) => {
    if (!heartsRef.current) return;
    const time = state.clock.getElapsedTime();

    heartsRef.current.children.forEach((heart, i) => {
      heart.position.y = heart.userData.baseY + Math.sin(time + i * 0.8) * 0.3;
      const pulse = 1 + Math.sin(time * 2 + i) * 0.1;
      heart.scale.setScalar(pulse * 0.3);
    });
  });

  const positions = [
    [-1, 2, 1],
    [0, 2.5, 1],
    [1, 2, 1],
  ];

  return (
    <group ref={heartsRef}>
      {positions.map((pos, i) => (
        <mesh
          key={i}
          position={pos}
          userData={{ baseY: pos[1] }}
        >
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color="#ff6b9d"
            emissive="#ff6b9d"
            emissiveIntensity={animationProgress * 1}
          />
        </mesh>
      ))}
    </group>
  );
}

// Page 29: Partnership - Fiery and humanity working together
export default function Page29({ isInView }) {
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
        camera={{ position: [0, 0, 10], fov: 60 }}
      >
        <FieryPartnering animationProgress={animationProgress} />
        <HumanityRepresentative animationProgress={animationProgress} />
        <PartnershipEnergy animationProgress={animationProgress} />
        <ConnectionLine animationProgress={animationProgress} />
        <HarmonyHearts animationProgress={animationProgress} />

        <pointLight position={[-2, 0.5, 4]} intensity={2} color="#ff8844" />
        <pointLight position={[2, -0.5, 4]} intensity={2} color="#00d9ff" />
        <ambientLight intensity={0.5} />
      </Canvas3D>
      )}

      <TextOverlay position="bottom" isInView={isInView}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: textProgress, y: textProgress > 0 ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="glass-strong px-10 py-8 rounded-2xl max-w-4xl"
          style={{
            background: 'rgba(26, 58, 79, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '2px solid rgba(255, 107, 157, 0.6)',
            boxShadow: '0 0 40px rgba(255, 107, 157, 0.3)',
          }}
        >
          <h3
            className="text-center font-bold mb-4"
            style={{
              fontSize: 'clamp(26px, 3.5vw, 36px)',
              color: '#ff6b9d',
              textShadow: '0 0 30px rgba(255, 107, 157, 0.5)',
            }}
          >
            A Perfect Partnership 💫
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
            Fiery and humanity—<strong style={{ color: '#ff8844' }}>working together</strong>.
            No longer feared, no longer destructive. Fiery provides clean, limitless energy for
            billions. Humanity thrives. The dance continues, but now it's a{' '}
            <strong style={{ color: '#00ff88' }}>dance of harmony</strong>.
          </p>
          <p
            className="text-center italic"
            style={{
              fontSize: 'clamp(14px, 1.8vw, 18px)',
              color: '#b47aff',
            }}
          >
            Both beautiful AND useful. Both wild AND understood.
          </p>
        </motion.div>
      </TextOverlay>
    </>
  );
}
