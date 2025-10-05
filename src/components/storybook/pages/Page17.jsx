import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
// import { Sphere } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import Canvas3D from '../Canvas3D';
import TextOverlay from '../TextOverlay';
import ThreeJSEarth from '../effects/ThreeJSEarth';

// Removed InfrastructureShield (3D wireframe sphere)

// Protected systems icons orbiting
function ProtectedSystems({ animationProgress }) {
  const systemsRef = useRef();

  useFrame((state) => {
    if (!systemsRef.current) return;
    systemsRef.current.rotation.y += 0.008;
  });

  const systems = [
    { color: '#00d9ff', icon: '🛰️' },   // Satellites
    { color: '#00ff88', icon: '⚡' },   // Power
    { color: '#ffaa00', icon: '📡' },   // Communications
    { color: '#b47aff', icon: '🔒' },   // Security
  ];

  return (
    <group ref={systemsRef} position={[0, 0, -3]}>
      {systems.map((system, i) => {
        const angle = (i / systems.length) * Math.PI * 2;
        const radius = 4;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(angle * 2) * 0.5;

        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial
              color={system.color}
              emissive={system.color}
              emissiveIntensity={animationProgress * 1}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Resilience network connections
function ResilienceNetwork({ animationProgress }) {
  const linesRef = useRef();

  useFrame((state) => {
    if (!linesRef.current) return;
    const time = state.clock.getElapsedTime();

    linesRef.current.children.forEach((line, i) => {
      if (line.material && line.material.opacity !== undefined) {
        line.material.opacity = animationProgress * (0.3 + Math.sin(time * 2 + i * 0.5) * 0.2);
      }
    });
  });

  const systems = 4;
  const lines = [];

  for (let i = 0; i < systems; i++) {
    for (let j = i + 1; j < systems; j++) {
      const angle1 = (i / systems) * Math.PI * 2;
      const angle2 = (j / systems) * Math.PI * 2;
      const radius = 4;

      const x1 = Math.cos(angle1) * radius;
      const z1 = Math.sin(angle1) * radius;
      const y1 = Math.sin(angle1 * 2) * 0.5;

      const x2 = Math.cos(angle2) * radius;
      const z2 = Math.sin(angle2) * radius;
      const y2 = Math.sin(angle2 * 2) * 0.5;

      const points = [
        new THREE.Vector3(x1, y1, z1 - 3),
        new THREE.Vector3(x2, y2, z2 - 3),
      ];

      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      lines.push(
        <line key={`${i}-${j}`} geometry={geometry}>
          <lineBasicMaterial color="#00ff88" transparent opacity={0.3} />
        </line>
      );
    }
  }

  return <group ref={linesRef}>{lines}</group>;
}

// Page 17: Building Resilience (Consolidated)
export default function Page17({ isInView }) {
  const [animationProgress, setAnimationProgress] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Understanding Space Weather",
      text: "Scientists launched space telescopes like SOHO and SDO to watch the Sun constantly, studying every flare, every eruption. They wanted to understand Fiery.",
      color: "#00d9ff"
    },
    {
      title: "Early Warning Systems",
      text: "A breakthrough! Scientists can now predict Fiery's arrival 1-3 days ahead. When they see an eruption on the Sun, they can warn the world: \"Fiery is coming. Get ready.\"",
      color: "#00ff88"
    },
    {
      title: "Hardening Our Technology",
      text: "Engineers design radiation-hardened satellites with shielding and redundant systems. They build power grids with surge protection and smart transformers that can withstand Fiery's energy.",
      color: "#00d9ff"
    },
    {
      title: "Protecting Our People",
      text: "On the International Space Station, astronauts have protocols: when Fiery arrives, they shelter in heavily shielded modules, safe from radiation. They don't panic—they prepare.",
      color: "#ffaa00"
    },
    {
      title: "Building Redundancy",
      text: "Communication networks get backup systems: undersea cables, ground-based networks, and redundant satellites. If one system fails during a solar storm, others keep the world connected.",
      color: "#b47aff"
    },
    {
      title: "A Resilient World",
      text: "Modern infrastructure is designed to survive solar storms. Systems work together, backing each other up. What once caused panic now becomes manageable. Humanity learned to live with space weather.",
      color: "#00ff88"
    }
  ];

  useEffect(() => {
    if (!isInView) {
      setAnimationProgress(0);
      setCurrentSlide(0);
      return;
    }

    const duration = 24000; // 4 seconds per slide × 6 slides
    const slideDuration = 4000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setAnimationProgress(progress);

      const slideIndex = Math.min(Math.floor(elapsed / slideDuration), slides.length - 1);
      setCurrentSlide(slideIndex);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [isInView]);

  const slideProgress = (animationProgress * slides.length) % 1;

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
            rotationSpeed={0.005}
            className="translate-center"
          />
          <Canvas3D
            showStars={true}
            showControls={false}
            camera={{ position: [0, 0, 12], fov: 60 }}
          >
            <ProtectedSystems animationProgress={Math.min(animationProgress * 2, 1)} />
            <ResilienceNetwork animationProgress={Math.min(animationProgress * 2, 1)} />

            <pointLight position={[0, 0, 5]} intensity={2} color="#00ff88" />
            <ambientLight intensity={0.4} />
          </Canvas3D>
        </>
      )}

      <TextOverlay position="bottom" isInView={isInView}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="glass-strong px-10 py-8 rounded-2xl max-w-4xl"
            style={{
              background: 'rgba(26, 42, 58, 0.9)',
              backdropFilter: 'blur(16px)',
              border: `2px solid ${slides[currentSlide].color}40`,
              boxShadow: `0 0 30px ${slides[currentSlide].color}33`,
            }}
          >
            <h3
              className="text-center font-bold mb-4"
              style={{
                fontSize: 'clamp(24px, 3vw, 32px)',
                color: slides[currentSlide].color,
                textShadow: `0 0 20px ${slides[currentSlide].color}66`,
              }}
            >
              {slides[currentSlide].title}
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
              {slides[currentSlide].text}
            </p>
          </motion.div>
        </AnimatePresence>
      </TextOverlay>
    </>
  );
}
