import { motion } from 'framer-motion';
import { RotateCcw, ChevronRight } from 'lucide-react';

export default function PageNavigation({ currentPage, totalPages, onReplay, onNext }) {
  const isLastPage = currentPage === totalPages;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex gap-3"
      style={{
        pointerEvents: 'auto',
      }}
    >
      {/* Replay Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onReplay}
        className="glass-strong p-4 rounded-full cursor-pointer"
        style={{
          background: 'rgba(26, 42, 58, 0.9)',
          backdropFilter: 'blur(16px)',
          border: '2px solid rgba(0, 217, 255, 0.4)',
          boxShadow: '0 0 20px rgba(0, 217, 255, 0.2)',
        }}
        aria-label="Replay animation"
      >
        <RotateCcw size={24} color="#00d9ff" />
      </motion.button>

      {/* Next Button */}
      {!isLastPage && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="glass-strong px-6 py-4 rounded-full cursor-pointer flex items-center gap-2"
          style={{
            background: 'rgba(26, 42, 58, 0.9)',
            backdropFilter: 'blur(16px)',
            border: '2px solid rgba(0, 255, 136, 0.5)',
            boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)',
          }}
          aria-label="Next page"
        >
          <span
            className="font-semibold"
            style={{
              color: '#00ff88',
              fontSize: '16px',
            }}
          >
            Next
          </span>
          <ChevronRight size={24} color="#00ff88" />
        </motion.button>
      )}
    </div>
  );
}
