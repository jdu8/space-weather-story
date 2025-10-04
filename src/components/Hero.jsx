import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Sun3D from './shared/Sun3D';
import Earth3D from './shared/Earth3D';
import CMEParticles from './shared/CMEParticles';
import AuroraEffect from './shared/AuroraEffect';

export default function Hero() {
  const stats = [
    { value: '150M km', label: 'Distance Traveled', color: 'aurora-blue' },
    { value: 'Billions', label: 'Tons of Plasma', color: 'solar-orange' },
    { value: '3 Days', label: 'Journey to Earth', color: 'aurora-green' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 12], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
        >
          {/* Starfield background */}
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={0.5}
          />

          {/* Ambient lighting */}
          <ambientLight intensity={0.2} />

          {/* Main 3D elements */}
          <Sun3D position={[-2, 0, 0]} scale={2} />
          <Earth3D position={[8, 0, -5]} scale={0.8} />
          <CMEParticles count={1500} position={[-2, 0, 0]} />
          <AuroraEffect position={[8, 0, -5]} earthScale={0.8} />

          {/* Interactive controls (subtle) */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={true}
            rotateSpeed={0.3}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 md:px-8">
        <motion.div
          className="text-center max-w-5xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-[var(--aurora-green)] via-[var(--aurora-blue)] to-[var(--cosmic-purple)] bg-clip-text text-transparent"
            style={{
              textShadow: '0 0 40px rgba(0, 255, 136, 0.3)',
            }}
          >
            The Journey of a Solar Storm
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-12 font-light"
          >
            An Interactive Space Weather Adventure
          </motion.p>

          {/* Stats Cards */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  transition: { duration: 0.3 },
                }}
                className="glass p-6 md:p-8 hover:glass-strong transition-all duration-300 cursor-pointer group"
                style={{
                  boxShadow:
                    stat.color === 'aurora-blue'
                      ? '0 0 20px rgba(0, 217, 255, 0.2)'
                      : stat.color === 'solar-orange'
                      ? '0 0 20px rgba(255, 107, 53, 0.2)'
                      : '0 0 20px rgba(0, 255, 136, 0.2)',
                }}
              >
                <div
                  className="text-4xl md:text-5xl font-bold mb-2 transition-all duration-300"
                  style={{
                    color:
                      stat.color === 'aurora-blue'
                        ? 'var(--aurora-blue)'
                        : stat.color === 'solar-orange'
                        ? 'var(--solar-orange)'
                        : 'var(--aurora-green)',
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              delay: 1.5,
              duration: 0.8,
            },
          }}
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight,
              behavior: 'smooth',
            });
          }}
        >
          <div className="flex flex-col items-center gap-2 group">
            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <ChevronDown
                className="w-8 h-8 text-[var(--aurora-green)] group-hover:text-[var(--aurora-blue)] transition-colors"
                strokeWidth={2}
              />
            </motion.div>
            <span className="text-sm text-gray-400 uppercase tracking-wider">
              Scroll to Begin
            </span>
          </div>
        </motion.div>
      </div>

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--deep-space)] pointer-events-none" />
    </section>
  );
}
