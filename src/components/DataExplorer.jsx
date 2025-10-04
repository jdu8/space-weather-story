import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Globe,
  Zap,
  Clock,
  Users,
  Gamepad2,
} from 'lucide-react';

function ModuleCard({ icon: Icon, title, description, children, gradient }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="glass-strong p-6 md:p-8 cursor-pointer hover:scale-[1.02] transition-all"
      onClick={() => setIsExpanded(!isExpanded)}
      whileHover={{ boxShadow: '0 0 30px rgba(0, 255, 136, 0.2)' }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div
          className="p-3 rounded-xl"
          style={{
            background: gradient,
          }}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white">{title}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-6 pt-6 border-t border-white/10"
        >
          {children}
        </motion.div>
      )}

      {!isExpanded && (
        <p className="text-sm text-gray-500 mt-4">Click to explore →</p>
      )}
    </motion.div>
  );
}

function LiveDashboard() {
  const kpIndex = 4; // Mock data
  const solarActivity = 'Moderate';

  return (
    <div className="space-y-4">
      <div className="glass p-4 rounded-xl">
        <h4 className="text-lg font-bold text-[var(--aurora-green)] mb-2">
          Current Space Weather Status
        </h4>
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Solar Activity:</span>
          <span className="text-[var(--solar-orange)] font-bold">{solarActivity}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-gray-300">Kp Index:</span>
          <span className="text-[var(--aurora-blue)] font-bold">{kpIndex}</span>
        </div>
      </div>

      <div className="glass p-4 rounded-xl bg-gradient-to-r from-[var(--aurora-green)]/10 to-[var(--aurora-blue)]/10">
        <h4 className="text-lg font-bold text-[var(--aurora-green)] mb-2">
          Aurora Forecast
        </h4>
        <p className="text-gray-300 text-sm">
          High probability of aurora visibility at high latitudes tonight!
        </p>
        <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--aurora-green)] to-[var(--aurora-blue)]"
            style={{ width: '75%' }}
          />
        </div>
      </div>
    </div>
  );
}

function Earth3DModule() {
  return (
    <div className="glass p-6 rounded-xl text-center">
      <div className="text-6xl mb-4">🌍</div>
      <p className="text-gray-300 text-sm mb-4">
        Interactive 3D Earth globe coming soon! Drag to rotate, click regions to explore aurora
        zones and space weather impacts.
      </p>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="glass p-3 rounded-lg">
          <div className="text-[var(--aurora-green)] font-bold">North Pole</div>
          <div className="text-gray-400">Active Aurora</div>
        </div>
        <div className="glass p-3 rounded-lg">
          <div className="text-[var(--aurora-blue)] font-bold">South Pole</div>
          <div className="text-gray-400">Active Aurora</div>
        </div>
      </div>
    </div>
  );
}

function CMESimulator() {
  const [speed, setSpeed] = useState(500);
  const [size, setSize] = useState(50);

  const calculateArrival = () => {
    const hours = Math.round((150000000 / speed) / 3600);
    return hours;
  };

  return (
    <div className="space-y-4">
      <div className="glass p-4 rounded-xl">
        <h4 className="text-lg font-bold text-[var(--solar-orange)] mb-4">
          Launch Your Own CME!
        </h4>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">
              Speed: {speed} km/s
            </label>
            <input
              type="range"
              min="300"
              max="3000"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">
              Size: {size}%
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="glass-strong p-4 rounded-xl bg-gradient-to-r from-[var(--solar-orange)]/10 to-[var(--aurora-green)]/10">
        <h5 className="font-bold text-[var(--aurora-green)] mb-2">Predictions:</h5>
        <p className="text-sm text-gray-300">
          Arrival time: <strong>{calculateArrival()} hours</strong>
        </p>
        <p className="text-sm text-gray-300">
          Impact level: <strong>{size > 70 ? 'Severe' : size > 40 ? 'Moderate' : 'Minor'}</strong>
        </p>
        <p className="text-sm text-gray-300">
          Aurora intensity: <strong>{speed > 1000 ? 'Brilliant!' : 'Moderate'}</strong>
        </p>
      </div>
    </div>
  );
}

function Timeline() {
  const events = [
    { year: 1859, name: 'Carrington Event', severity: 'Extreme' },
    { year: 1989, name: 'Quebec Blackout', severity: 'Severe' },
    { year: 2003, name: 'Halloween Storm', severity: 'Severe' },
    { year: 2024, name: 'Gannon Storm', severity: 'Moderate' },
  ];

  return (
    <div className="space-y-3">
      {events.map((event, index) => (
        <motion.div
          key={index}
          className="glass p-4 rounded-xl hover:glass-strong transition-all cursor-pointer"
          whileHover={{ scale: 1.02, x: 10 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[var(--aurora-green)] font-bold">{event.year}</div>
              <div className="text-white">{event.name}</div>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                event.severity === 'Extreme'
                  ? 'bg-[var(--warning-red)]/20 text-[var(--warning-red)]'
                  : event.severity === 'Severe'
                  ? 'bg-[var(--solar-orange)]/20 text-[var(--solar-orange)]'
                  : 'bg-[var(--aurora-blue)]/20 text-[var(--aurora-blue)]'
              }`}
            >
              {event.severity}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function CharacterProfiles() {
  const characters = [
    {
      name: 'Solar Flare',
      emoji: '⚡',
      personality: 'The Speedster',
      fact: 'Arrives in just 8 minutes!',
      color: 'var(--solar-orange)',
    },
    {
      name: 'CME',
      emoji: '🌊',
      personality: 'The Powerhouse',
      fact: 'Carries billions of tons of plasma',
      color: 'var(--aurora-blue)',
    },
    {
      name: 'Aurora',
      emoji: '🌌',
      personality: 'The Artist',
      fact: 'Paints the sky with light',
      color: 'var(--aurora-green)',
    },
    {
      name: 'Geomagnetic Storm',
      emoji: '⚡',
      personality: 'The Transformer',
      fact: 'Can power or disrupt technology',
      color: 'var(--cosmic-purple)',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {characters.map((char, index) => (
        <motion.div
          key={index}
          className="glass p-4 rounded-xl text-center hover:glass-strong transition-all cursor-pointer"
          whileHover={{
            scale: 1.05,
            boxShadow: `0 0 30px ${char.color}40`,
          }}
        >
          <div className="text-5xl mb-2">{char.emoji}</div>
          <h5 className="font-bold text-lg" style={{ color: char.color }}>
            {char.name}
          </h5>
          <p className="text-sm text-gray-400 italic">{char.personality}</p>
          <p className="text-xs text-gray-500 mt-2">{char.fact}</p>
        </motion.div>
      ))}
    </div>
  );
}

function ProtectionGame() {
  const [score, setScore] = useState(0);
  const components = ['Shield', 'Collector', 'Warning System', 'Backup Grid'];

  return (
    <div className="space-y-4">
      <div className="glass p-4 rounded-xl text-center">
        <h4 className="text-lg font-bold text-[var(--cosmic-purple)] mb-2">
          Build Your Protection System
        </h4>
        <div className="text-3xl font-bold text-[var(--aurora-green)] mb-4">
          Score: {score}%
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {components.map((comp, index) => (
          <motion.button
            key={index}
            className="glass p-4 rounded-xl hover:glass-strong transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setScore(Math.min(100, score + 25))}
          >
            <div className="text-sm font-bold text-white">{comp}</div>
            <div className="text-xs text-gray-400 mt-1">Click to add</div>
          </motion.button>
        ))}
      </div>

      {score === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-strong p-4 rounded-xl bg-gradient-to-r from-[var(--aurora-green)]/20 to-[var(--aurora-blue)]/20 text-center"
        >
          <p className="text-[var(--aurora-green)] font-bold">🎉 Perfect Protection!</p>
        </motion.div>
      )}
    </div>
  );
}

export default function DataExplorer() {
  const modules = [
    {
      icon: Activity,
      title: 'Live Space Weather',
      description: 'Real-time solar activity and aurora forecasts',
      gradient: 'linear-gradient(135deg, var(--aurora-green), var(--aurora-blue))',
      content: <LiveDashboard />,
    },
    {
      icon: Globe,
      title: 'Interactive Earth',
      description: 'Explore aurora zones and space weather impacts',
      gradient: 'linear-gradient(135deg, var(--aurora-blue), var(--cosmic-purple))',
      content: <Earth3DModule />,
    },
    {
      icon: Zap,
      title: 'CME Simulator',
      description: 'Launch your own solar storm and predict impacts',
      gradient: 'linear-gradient(135deg, var(--solar-orange), var(--warning-red))',
      content: <CMESimulator />,
    },
    {
      icon: Clock,
      title: 'Historical Timeline',
      description: 'Major space weather events through history',
      gradient: 'linear-gradient(135deg, var(--cosmic-purple), var(--deep-space))',
      content: <Timeline />,
    },
    {
      icon: Users,
      title: 'Character Profiles',
      description: 'Meet the space weather phenomena',
      gradient: 'linear-gradient(135deg, var(--aurora-green), var(--solar-orange))',
      content: <CharacterProfiles />,
    },
    {
      icon: Gamepad2,
      title: 'Protection Builder',
      description: 'Design future technology to harness solar storms',
      gradient: 'linear-gradient(135deg, var(--cosmic-purple), var(--aurora-green))',
      content: <ProtectionGame />,
    },
  ];

  return (
    <section className="min-h-screen py-20 px-4 md:px-8 bg-gradient-to-b from-[var(--deep-space)] to-[#0f1433]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[var(--aurora-green)] via-[var(--aurora-blue)] to-[var(--cosmic-purple)] bg-clip-text text-transparent">
            Data Explorer
          </h2>
          <p className="text-xl text-gray-400">
            Dive into real space weather data, simulations, and interactive tools
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {modules.map((module, index) => (
            <ModuleCard
              key={index}
              icon={module.icon}
              title={module.title}
              description={module.description}
              gradient={module.gradient}
            >
              {module.content}
            </ModuleCard>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center glass-strong p-8 rounded-2xl"
        >
          <h3 className="text-2xl font-bold mb-4 text-[var(--aurora-green)]">
            Keep Exploring Space Weather!
          </h3>
          <p className="text-gray-400 mb-4">
            This interactive storybook was created for the NASA Space Apps Challenge
          </p>
          <p className="text-sm text-gray-500">
            Built with React, Three.js, Framer Motion, and love for science ✨
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
