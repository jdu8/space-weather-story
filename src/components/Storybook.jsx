import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

function StoryPage({ children, backgroundGradient, isInView }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 md:px-8 relative"
      style={{
        background: backgroundGradient,
        transition: 'background 1s ease',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl"
      >
        {children}
      </motion.div>
    </div>
  );
}

function CoronaCharacter({ emotion = 'happy' }) {
  const expressions = {
    happy: '😊',
    sad: '😔',
    hopeful: '🌟',
  };

  return (
    <motion.div
      className="text-9xl mb-8 inline-block"
      animate={{
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {expressions[emotion]}
    </motion.div>
  );
}

export default function Storybook() {
  const act1Ref = useRef(null);
  const act2Ref = useRef(null);
  const act3Ref = useRef(null);

  const act1InView = useInView(act1Ref, { amount: 0.5 });
  const act2InView = useInView(act2Ref, { amount: 0.5 });
  const act3InView = useInView(act3Ref, { amount: 0.5 });

  return (
    <section className="relative">
      {/* Act 1: Ancient Times */}
      <div ref={act1Ref}>
        <StoryPage
          backgroundGradient="linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #2a1f3a 100%)"
          isInView={act1InView}
        >
          <div className="text-center">
            <CoronaCharacter emotion="happy" />

            <motion.h2
              initial={{ opacity: 0 }}
              animate={act1InView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold mb-6 text-[var(--aurora-green)]"
            >
              Act I: The Ancient Dance
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={act1InView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg md:text-xl text-gray-300 leading-relaxed space-y-6"
            >
              <p className="glass p-6 rounded-2xl">
                <strong className="text-[var(--aurora-green)] text-2xl">"Hi! I'm Corona!"</strong>
                <br />
                <span className="block mt-4">
                  A massive burst of energy from the Sun's surface, carrying billions of tons of
                  plasma across 150 million kilometers of space.
                </span>
              </p>

              <p className="glass p-6 rounded-2xl">
                My journey takes three days through the darkness. Watch as I twist and spiral,
                dancing through the solar wind, guided by invisible magnetic fields...
              </p>

              <p className="glass p-6 rounded-2xl">
                When I finally reach Earth, something magical happens! I collide with the
                magnetosphere, painting the polar skies with brilliant curtains of green and blue
                light—the <strong className="text-[var(--aurora-blue)]">aurora borealis</strong>!
              </p>

              <p className="glass p-6 rounded-2xl">
                Ancient peoples looked up in wonder. Vikings saw me as bridges to the gods.
                Indigenous peoples told stories about my dance. I was{' '}
                <strong className="text-[var(--aurora-green)]">loved</strong>,{' '}
                <strong className="text-[var(--aurora-green)]">revered</strong>,{' '}
                <strong className="text-[var(--aurora-green)]">magical</strong>...
              </p>
            </motion.div>
          </div>
        </StoryPage>
      </div>

      {/* Act 2: Modern Era */}
      <div ref={act2Ref}>
        <StoryPage
          backgroundGradient="linear-gradient(135deg, #0a0e27 0%, #2a1520 50%, #3a0520 100%)"
          isInView={act2InView}
        >
          <div className="text-center">
            <CoronaCharacter emotion="sad" />

            <motion.h2
              initial={{ opacity: 0 }}
              animate={act2InView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold mb-6 text-[var(--warning-red)]"
            >
              Act II: The Age of Fear
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={act2InView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg md:text-xl text-gray-300 leading-relaxed space-y-6"
            >
              <p className="glass p-6 rounded-2xl">
                The same journey... but Earth has changed. Now they have{' '}
                <strong className="text-[var(--warning-red)]">technology</strong>.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                <div className="glass p-6 rounded-2xl border-l-4 border-[var(--warning-red)]">
                  <strong className="text-[var(--warning-red)]">⚠️ ISS Alert</strong>
                  <p className="text-sm mt-2">Astronauts take shelter from radiation spikes</p>
                </div>

                <div className="glass p-6 rounded-2xl border-l-4 border-[var(--warning-red)]">
                  <strong className="text-[var(--warning-red)]">✈️ Polar Flights</strong>
                  <p className="text-sm mt-2">Pilots reroute to avoid radiation exposure</p>
                </div>

                <div className="glass p-6 rounded-2xl border-l-4 border-[var(--warning-red)]">
                  <strong className="text-[var(--warning-red)]">📡 GPS Glitches</strong>
                  <p className="text-sm mt-2">Navigation systems lose accuracy</p>
                </div>

                <div className="glass p-6 rounded-2xl border-l-4 border-[var(--warning-red)]">
                  <strong className="text-[var(--warning-red)]">⚡ Power Grids</strong>
                  <p className="text-sm mt-2">Transformers overheat, blackouts threaten</p>
                </div>
              </div>

              <p className="glass p-6 rounded-2xl text-2xl italic">
                "They became{' '}
                <strong className="text-[var(--warning-red)]">scared</strong> of me..."
              </p>

              <p className="glass p-6 rounded-2xl text-sm text-gray-400">
                But I still create those beautiful auroras. I haven't changed—I'm the same Corona.
                I just want to dance...
              </p>
            </motion.div>
          </div>
        </StoryPage>
      </div>

      {/* Act 3: The Future */}
      <div ref={act3Ref}>
        <StoryPage
          backgroundGradient="linear-gradient(135deg, #0a0e27 0%, #1a3a2f 50%, #2a4a5f 100%)"
          isInView={act3InView}
        >
          <div className="text-center">
            <CoronaCharacter emotion="hopeful" />

            <motion.h2
              initial={{ opacity: 0 }}
              animate={act3InView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[var(--aurora-green)] to-[var(--cosmic-purple)] bg-clip-text text-transparent"
            >
              Act III: Harmony
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={act3InView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg md:text-xl text-gray-300 leading-relaxed space-y-6"
            >
              <p className="glass-strong p-6 rounded-2xl text-2xl">
                <strong className="text-[var(--aurora-green)] text-3xl">
                  "What if we could be friends?"
                </strong>
              </p>

              <p className="glass p-6 rounded-2xl">
                Imagine a future where my energy isn't feared, but{' '}
                <strong className="text-[var(--aurora-blue)]">harvested</strong>...
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                <motion.div
                  className="glass-strong p-6 rounded-2xl border-l-4 border-[var(--aurora-green)]"
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 255, 136, 0.3)' }}
                >
                  <strong className="text-[var(--aurora-green)]">🛰️ Space Collectors</strong>
                  <p className="text-sm mt-2">Satellites capture and convert CME particle energy</p>
                </motion.div>

                <motion.div
                  className="glass-strong p-6 rounded-2xl border-l-4 border-[var(--aurora-blue)]"
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 217, 255, 0.3)' }}
                >
                  <strong className="text-[var(--aurora-blue)]">🌌 Aurora Plants</strong>
                  <p className="text-sm mt-2">Polar facilities convert aurora energy to electricity</p>
                </motion.div>

                <motion.div
                  className="glass-strong p-6 rounded-2xl border-l-4 border-[var(--cosmic-purple)]"
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(180, 122, 255, 0.3)' }}
                >
                  <strong className="text-[var(--cosmic-purple)]">🛡️ Protected Networks</strong>
                  <p className="text-sm mt-2">Smart grids adapt and thrive during solar storms</p>
                </motion.div>

                <motion.div
                  className="glass-strong p-6 rounded-2xl border-l-4 border-[var(--solar-orange)]"
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255, 107, 53, 0.3)' }}
                >
                  <strong className="text-[var(--solar-orange)]">🏙️ Powered Cities</strong>
                  <p className="text-sm mt-2">Urban centers run on clean space weather energy</p>
                </motion.div>
              </div>

              <p className="glass-strong p-8 rounded-2xl text-2xl bg-gradient-to-r from-[var(--aurora-green)]/10 to-[var(--aurora-blue)]/10">
                In this future, Corona and Earth dance together in{' '}
                <strong className="text-[var(--aurora-green)]">harmony</strong>.
                <br />
                <span className="text-lg block mt-4">
                  Both beautiful <strong>AND</strong> useful. Both wild <strong>AND</strong>{' '}
                  understood.
                </span>
              </p>

              <motion.p
                className="text-3xl mt-8"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                🌍 ✨ ☀️
              </motion.p>
            </motion.div>
          </div>
        </StoryPage>
      </div>

      {/* Transition to Data Explorer */}
      <div className="min-h-[50vh] flex items-center justify-center bg-gradient-to-b from-[#2a4a5f] to-[var(--deep-space)]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center px-4"
        >
          <h3 className="text-3xl md:text-5xl font-bold mb-4 text-[var(--aurora-green)]">
            Ready to Explore?
          </h3>
          <p className="text-xl text-gray-300 mb-8">
            Dive into real space weather data and simulations
          </p>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[var(--aurora-blue)] text-4xl"
          >
            ↓
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
