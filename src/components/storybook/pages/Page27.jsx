import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { motion } from 'framer-motion';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';

// CME formation diagram
function CMEFormationDiagram({ animationProgress }) {
  const texture = useLoader(TextureLoader, '/sprites/049_cme_formation_diagram.png');

  return (
    <sprite position={[-4, 1, -2]} scale={[4, 3, 1]}>
      <spriteMaterial map={texture} transparent opacity={animationProgress * 0.8} />
    </sprite>
  );
}

// Magnetic energy capture diagram
function MagneticCaptureDiagram({ animationProgress }) {
  const diagramRef = useRef();

  useFrame((state) => {
    if (!diagramRef.current) return;
    const time = state.clock.getElapsedTime();
    diagramRef.current.rotation.z = Math.sin(time * 0.5) * 0.05;
  });

  return (
    <group ref={diagramRef} position={[4, 0, -1]}>
      {/* Magnetic field visualization */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 1.5;

        const points = [];
        for (let j = 0; j <= 20; j++) {
          const t = j / 20;
          const r = radius * (1 + t * 0.5);
          const x = Math.cos(angle + t * Math.PI) * r;
          const y = Math.sin(angle + t * Math.PI) * r;
          points.push(new THREE.Vector3(x, y, 0));
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        return (
          <line key={i} geometry={geometry}>
            <lineBasicMaterial
              color="#00d9ff"
              transparent
              opacity={animationProgress * 0.5}
            />
          </line>
        );
      })}
    </group>
  );
}

// Energy conversion visualization
function EnergyConversion({ animationProgress }) {
  const particlesRef = useRef();

  useFrame(() => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array;
    const colors = particlesRef.current.geometry.attributes.color.array;
    const time = Date.now() * 0.003;

    for (let i = 0; i < 60; i++) {
      const i3 = i * 3;
      const t = ((time + i * 0.05) % 1);

      // Particles flow from left (plasma) to right (energy)
      positions[i3] = -4 + t * 8;
      positions[i3 + 1] = Math.sin(time * 2 + i) * 0.5;
      positions[i3 + 2] = -1;

      // Color transition: orange (plasma) -> green (energy)
      const colorTransition = t;
      colors[i3] = 1 - colorTransition * 0.5; // R
      colors[i3 + 1] = 0.5 + colorTransition * 0.5; // G
      colors[i3 + 2] = colorTransition * 0.3; // B
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    particlesRef.current.geometry.attributes.color.needsUpdate = true;
  });

  const particleCount = 60;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = -4;
    positions[i3 + 1] = 0;
    positions[i3 + 2] = -1;

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
        opacity={animationProgress}
        sizeAttenuation
      />
    </points>
  );
}

// Energy beam visualization
function EnergyBeam({ animationProgress }) {
  const texture = useLoader(TextureLoader, '/sprites/043_energy_beam.png');
  const beamRef = useRef();

  useFrame((state) => {
    if (!beamRef.current) return;
    const time = state.clock.getElapsedTime();
    beamRef.current.material.opacity = animationProgress * (0.6 + Math.sin(time * 3) * 0.2);
  });

  return (
    <sprite ref={beamRef} position={[0, -1.5, 0]} scale={[8, 2, 1]}>
      <spriteMaterial map={texture} transparent blending={THREE.AdditiveBlending} />
    </sprite>
  );
}

// Page 27: Magnetic Energy Capture - How it could work
export default function Page27({ isInView }) {
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
        <CMEFormationDiagram animationProgress={animationProgress} />
        <MagneticCaptureDiagram animationProgress={animationProgress} />
        <EnergyConversion animationProgress={animationProgress} />
        <EnergyBeam animationProgress={animationProgress} />

        <pointLight position={[0, 0, 3]} intensity={2} color="#00ff88" />
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
            border: '2px solid rgba(0, 217, 255, 0.5)',
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
            How It Works ⚡
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
            Magnetic fields could{' '}
            <strong style={{ color: '#00d9ff' }}>funnel charged particles</strong> into collection
            chambers. As the plasma flows through, its kinetic energy gets converted to
            electricity—just like a hydroelectric dam, but in space, powered by the Sun's storms!
          </p>
        </motion.div>
      </TextOverlay>
    </>
  );
}
