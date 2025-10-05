import { motion } from 'framer-motion';

export default function AnimatedText({ isInView, isMobile = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.8,
        delay: 0.5,
        ease: 'easeIn',
      }}
      className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none"
      style={{
        maxWidth: '90%',
      }}
    >
      <div
        className="glass-strong px-6 md:px-10 py-4 md:py-5 rounded-xl"
        style={{
          background: 'rgba(10, 14, 39, 0.6)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        <p
          className="text-center font-light tracking-wide"
          style={{
            fontSize: isMobile ? '18px' : '24px',
            color: '#ffffff',
            textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
            lineHeight: 1.6,
          }}
        >
          Deep beneath the surface of the Sun, something stirs...
        </p>
      </div>
    </motion.div>
  );
}
