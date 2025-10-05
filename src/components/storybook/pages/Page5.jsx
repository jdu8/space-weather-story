import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';
import ThreeJSEarth from '../effects/ThreeJSEarth';

// Magnetic field lines guiding particles to poles
function MagneticFieldLines({ animationProgress }) {
  const linesRef = useRef();

  useFrame((state) => {
    if (!linesRef.current) return;
    const time = state.clock.getElapsedTime();

    linesRef.current.children.forEach((line, i) => {
      if (line.material && line.material.opacity !== undefined) {
        line.material.opacity = 0.3 + Math.sin(time * 2 + i * 0.5) * 0.2;
      }
    });
  });

  const lines = [];
  const numLines = 12;

  for (let i = 0; i < numLines; i++) {
    const angle = (i / numLines) * Math.PI * 2;
    const points = [];

    // Create curved lines from equator to poles
    for (let j = 0; j <= 20; j++) {
      const t = j / 20;
      const lat = t * Math.PI / 2; // 0 to 90 degrees
      const radius = 2.5 + Math.sin(lat) * 1.5;

      const x = Math.cos(angle) * Math.cos(lat) * radius;
      const y = Math.sin(lat) * 3;
      const z = -3 + Math.sin(angle) * Math.cos(lat) * radius;

      points.push(new THREE.Vector3(x, y, z));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    lines.push(
      <line key={`north-${i}`} geometry={geometry}>
        <lineBasicMaterial
          color="#00d9ff"
          transparent
          opacity={animationProgress * 0.4}
        />
      </line>
    );

    // Southern hemisphere
    const southPoints = points.map(p => new THREE.Vector3(p.x, -p.y, p.z));
    const southGeometry = new THREE.BufferGeometry().setFromPoints(southPoints);

    lines.push(
      <line key={`south-${i}`} geometry={southGeometry}>
        <lineBasicMaterial
          color="#00d9ff"
          transparent
          opacity={animationProgress * 0.4}
        />
      </line>
    );
  }

  return <group ref={linesRef}>{lines}</group>;
}

// Particles flowing along field lines to poles
function FlowingParticles({ animationProgress }) {
  const particlesRef = useRef();

  useFrame(() => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array;
    const time = Date.now() * 0.001;

    for (let i = 0; i < 150; i++) {
      const i3 = i * 3;
      const angle = (i / 150) * Math.PI * 2;
      const flowProgress = ((time * 0.5 + i * 0.05) % 1);
      const lat = flowProgress * Math.PI / 2;
      const radius = 2.5 + Math.sin(lat) * 1.5;

      positions[i3] = Math.cos(angle) * Math.cos(lat) * radius;
      positions[i3 + 1] = (i % 2 === 0 ? 1 : -1) * Math.sin(lat) * 3;
      positions[i3 + 2] = -3 + Math.sin(angle) * Math.cos(lat) * radius;
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const particleCount = 150;
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
        size={0.12}
        color="#ff8844"
        transparent
        opacity={animationProgress * 0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Page 5: Guided to the Poles
export default function Page5({ isInView }) {
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
        <>
          <ThreeJSEarth
            width={480}
            height={480}
            position="absolute"
            left="50%"
            top="50%"
            opacity={1}
            rotationSpeed={0.004}
            className="translate-center"
          />
          <Canvas3D
            showStars={true}
            showControls={false}
            camera={{ position: [0, 0, 10], fov: 60 }}
          >
            <MagneticFieldLines animationProgress={animationProgress} />
            <FlowingParticles animationProgress={animationProgress} />

            <pointLight position={[0, 5, 5]} intensity={2} color="#00d9ff" />
            <pointLight position={[0, -5, 5]} intensity={2} color="#00d9ff" />
            <ambientLight intensity={0.3} />
          </Canvas3D>
        </>
      )}

      <TextOverlay position="bottom" isInView={isInView}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: textProgress, y: textProgress > 0 ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="glass-strong px-10 py-6 rounded-2xl max-w-3xl"
          style={{
            background: 'rgba(10, 14, 39, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '2px solid rgba(0, 217, 255, 0.3)',
            boxShadow: '0 0 30px rgba(0, 217, 255, 0.2)',
          }}
        >
          <p
            className="text-center"
            style={{
              fontSize: 'clamp(18px, 2.5vw, 24px)',
              color: '#ffffff',
              lineHeight: 1.8,
              fontWeight: 300,
            }}
          >
            Earth's magnetic field lines act like invisible highways, gently guiding
            Fiery's particles toward the{' '}
            <strong style={{ color: '#00d9ff', fontWeight: 600 }}>
              North and South Poles
            </strong>
            ...
          </p>
        </motion.div>
      </TextOverlay>
    </>
  );
}
