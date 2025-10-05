import { motion } from 'framer-motion';

export default function CoronaText({ isInView, animationProgress, isMobile = false }) {
  // Text appears after Corona is mostly formed
  const textProgress = Math.max(0, (animationProgress - 0.75) * 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: textProgress,
        y: textProgress > 0 ? 0 : 20,
      }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none"
      style={{
        maxWidth: '90%',
      }}
    >
      <div
        className="glass-strong px-8 md:px-12 py-6 md:py-8 rounded-2xl"
        style={{
          background: 'rgba(10, 14, 39, 0.7)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '2px solid rgba(255, 170, 0, 0.3)',
          boxShadow: '0 8px 32px rgba(255, 170, 0, 0.2)',
        }}
      >
        {/* Main greeting */}
        <h2
          className="text-center font-bold mb-3"
          style={{
            fontSize: isMobile ? '28px' : '48px',
            fontFamily: "'Quicksand', 'Fredoka', sans-serif",
            color: '#ffffff',
            textShadow: '0 0 20px rgba(255, 170, 0, 0.8)',
            lineHeight: 1.3,
          }}
        >
          Hi! I'm Corona! 😊
        </h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: textProgress > 0.5 ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center font-light"
          style={{
            fontSize: isMobile ? '16px' : '18px',
            color: '#00d9ff',
            marginTop: '10px',
            lineHeight: 1.5,
          }}
        >
          I'm a Coronal Mass Ejection—billions of tons of plasma from the Sun!
        </motion.p>
      </div>
    </motion.div>
  );
}
