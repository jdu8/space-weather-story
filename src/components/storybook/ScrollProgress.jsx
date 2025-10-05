import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ScrollProgress({ totalPages = 30, currentPage = 1 }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress((currentPage / totalPages) * 100);
  }, [currentPage, totalPages]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      {/* Progress bar */}
      <motion.div
        className="h-1 bg-gradient-to-r from-[var(--aurora-green)] via-[var(--aurora-blue)] to-[var(--cosmic-purple)]"
        initial={{ width: '0%' }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />

      {/* Page counter */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6">
        <div className="glass px-4 py-2 rounded-full">
          <span className="text-sm font-bold text-[var(--aurora-green)]">
            {currentPage}
          </span>
          <span className="text-sm text-gray-400 mx-1">/</span>
          <span className="text-sm text-gray-400">{totalPages}</span>
        </div>
      </div>

      {/* Chapter indicator (optional) */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6">
        <div className="glass px-4 py-2 rounded-full">
          <span className="text-xs uppercase tracking-wider text-gray-400">
            {currentPage <= 11
              ? 'Act I: Ancient Dance'
              : currentPage <= 21
              ? 'Act II: Modern Fear'
              : 'Act III: Future Harmony'}
          </span>
        </div>
      </div>
    </div>
  );
}
