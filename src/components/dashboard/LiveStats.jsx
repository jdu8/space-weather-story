import { motion } from 'framer-motion';

export default function LiveStats({ cmeCount, flareCount, stormCount }) {
  const stats = [
    {
      label: 'CME Events',
      value: cmeCount,
      icon: '🌊',
      color: '#00ff88',
    },
    {
      label: 'Solar Flares',
      value: flareCount,
      icon: '🔥',
      color: '#ff6b35',
    },
    {
      label: 'Geo Storms',
      value: stormCount,
      icon: '⚡',
      color: '#b47aff',
    },
  ];

  return (
    <div className="live-stats-container">
      <h2 className="stats-title">30-Day Summary</h2>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="stat-box"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={{ borderColor: stat.color }}
          >
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-value" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
