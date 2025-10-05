import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { motion } from 'framer-motion';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';

// Hardened satellite (protected)
function HardenedSatellite({ animationProgress }) {
  const spriteRef = useRef();
  const texture = useLoader(TextureLoader, '/sprites/010_satellite_hardened.png');

  useFrame((state) => {
    if (!spriteRef.current) return;
    const time = state.clock.getElapsedTime();
    spriteRef.current.position.y = Math.sin(time * 0.8) * 0.2;
  });

  return (
    <sprite ref={spriteRef} position={[0, 0, 0]} scale={[3, 3, 1]}>
      <spriteMaterial map={texture} transparent opacity={animationProgress} />
    </sprite>
  );
}

// Shield effect around satellite
function ShieldEffect({ animationProgress }) {
  const shieldRef = useRef();
  const texture = useLoader(TextureLoader, '/sprites/044_shield_effect.png');

  useFrame((state) => {
    if (!shieldRef.current) return;
    const time = state.clock.getElapsedTime();

    const pulse = 1 + Math.sin(time * 2) * 0.1;
    shieldRef.current.scale.setScalar(pulse * 4);
    shieldRef.current.material.opacity = animationProgress * (0.5 + Math.sin(time * 2) * 0.2);
  });

  return (
    <sprite ref={shieldRef} position={[0, 0, -0.5]} scale={[4, 4, 1]}>
      <spriteMaterial map={texture} transparent />
    </sprite>
  );
}

// Engineer working
function Engineer({ animationProgress }) {
  const texture = useLoader(TextureLoader, '/sprites/021_engineer_working.png');

  return (
    <sprite position={[-3.5, -1.5, 1]} scale={[2.5, 3, 1]}>
      <spriteMaterial map={texture} transparent opacity={animationProgress} />
    </sprite>
  );
}

// Technical diagrams floating around
function TechnicalDiagrams({ animationProgress }) {
  const diagramsRef = useRef();

  useFrame((state) => {
    if (!diagramsRef.current) return;
    const time = state.clock.getElapsedTime();

    diagramsRef.current.children.forEach((diagram, i) => {
      diagram.position.y = diagram.userData.baseY + Math.sin(time + i * 1.5) * 0.15;
      diagram.rotation.z = Math.sin(time * 0.5 + i) * 0.05;
    });
  });

  const positions = [
    [3, 1.5, 0],
    [4, -0.5, 0],
  ];

  return (
    <group ref={diagramsRef}>
      {positions.map((pos, i) => (
        <mesh
          key={i}
          position={pos}
          userData={{ baseY: pos[1] }}
        >
          <planeGeometry args={[1.5, 1.5]} />
          <meshBasicMaterial
            color="#00d9ff"
            transparent
            opacity={animationProgress * 0.3}
            wireframe
          />
        </mesh>
      ))}
    </group>
  );
}

// Page 19: Hardened Satellites
export default function Page19({ isInView }) {
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
        camera={{ position: [0, 0, 8], fov: 60 }}
      >
        <HardenedSatellite animationProgress={animationProgress} />
        <ShieldEffect animationProgress={animationProgress} />
        <Engineer animationProgress={animationProgress} />
        <TechnicalDiagrams animationProgress={animationProgress} />

        <pointLight position={[0, 0, 3]} intensity={2} color="#00d9ff" />
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
            Building Defenses
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
            Engineers design{' '}
            <strong style={{ color: '#00d9ff' }}>radiation-hardened satellites</strong> with
            shielding and redundant systems. They build satellites that can{' '}
            <em>withstand</em> Fiery's energy instead of tumbling helplessly.
          </p>
        </motion.div>
      </TextOverlay>
    </>
  );
}
