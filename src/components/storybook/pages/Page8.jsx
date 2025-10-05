import { motion } from 'framer-motion';
import TextOverlay from '../TextOverlay';

export default function Page8({ isInView }) {
  return (
    <>
      {/* Full-bleed video from public/videos/change.mp4 */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <video
          src="/videos/change.mp4"
          autoPlay
          muted
          playsInline
          loop
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Overlay text */}
      <TextOverlay position="bottom" isInView={isInView}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="glass-strong px-10 py-8 rounded-2xl max-w-3xl"
          style={{
            background: 'rgba(10, 14, 39, 0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <p
            className="text-center font-light"
            style={{
              fontSize: 'clamp(18px, 2.6vw, 28px)',
              color: '#ffffff',
              lineHeight: 1.9,
              textShadow: '0 0 20px rgba(0, 217, 255, 0.35)'
            }}
          >
            From <span style={{ color: '#ffaa00' }}>campfires</span> to <span style={{ color: '#00d9ff' }}>electricity</span>,
            humanity learned to shape light—and with it, our world.
          </p>
        </motion.div>
      </TextOverlay>
    </>
  );
}
