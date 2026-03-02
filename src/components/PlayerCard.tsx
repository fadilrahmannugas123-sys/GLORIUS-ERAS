import { motion } from 'motion/react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { X } from 'lucide-react';
import { Player } from '../store/useGameStore';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export function PlayerPreview({ player, onClose }: { player: Player; onClose: () => void }) {
  const chartData = {
    labels: ['Creativity', 'Technical', 'Leadership', 'Strategy'],
    datasets: [
      {
        label: 'Stats',
        data: [player.stats.creativity, player.stats.technical, player.stats.leadership, player.stats.strategy],
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        borderColor: '#ffd700',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: { color: 'rgba(255, 255, 255, 0.7)', font: { size: 12, weight: 'bold' } as any },
        ticks: { display: false },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: { legend: { display: false } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-4xl bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-2 rounded-full bg-black/40 text-white hover:bg-white/10 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Left: Image & Basic Info */}
        <div className="w-full md:w-1/2 relative h-64 md:h-auto">
          <img 
            src={player.image} 
            alt={player.name}
            className="w-full h-full object-cover object-top"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8">
            <div className="text-6xl font-black text-yellow-500 italic leading-none mb-2">{player.rating}</div>
            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">{player.name}</h2>
            <p className="text-lg font-bold text-yellow-500/80 tracking-widest uppercase">{player.role}</p>
          </div>
        </div>

        {/* Right: Stats & Bio */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h4 className="text-xs font-bold text-white/40 uppercase tracking-[0.3em] mb-6">PERFORMANCE ATTRIBUTES</h4>
            <div className="w-full aspect-square max-w-[300px] mx-auto">
              <Radar data={chartData} options={chartOptions} />
            </div>
          </div>
          
          <div>
            <h4 className="text-xs font-bold text-white/40 uppercase tracking-[0.3em] mb-4">BIOGRAPHY</h4>
            <p className="text-white/70 italic leading-relaxed text-lg">
              "{player.bio}"
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function PlayerCard({ player, onClick }: { player: Player; onClick?: () => void }) {
  const rarityColors = {
    Rare: 'from-blue-400 to-blue-600',
    Elite: 'from-purple-500 to-purple-700',
    Master: 'from-red-500 to-red-700',
    Legendary: 'from-yellow-400 via-yellow-600 to-yellow-800',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -10 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative w-72 h-96 cursor-pointer group"
    >
      <div className={`w-full h-full rounded-2xl p-1 bg-gradient-to-br ${rarityColors[player.rarity]} shadow-2xl overflow-hidden`}>
        <div className="w-full h-full bg-black/80 rounded-xl relative overflow-hidden flex flex-col">
          {/* Rating & Position */}
          <div className="absolute top-4 left-4 z-10">
            <div className="text-4xl font-black text-yellow-500 italic leading-none">{player.rating}</div>
            <div className="text-xs font-bold text-white/60 tracking-widest">{player.position}</div>
          </div>

          {/* Player Image */}
          <div className="flex-1 relative mt-8">
            <img 
              src={player.image} 
              alt={player.name}
              className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>

          {/* Player Info */}
          <div className="p-4 relative z-10">
            <h3 className="text-2xl font-black text-white italic truncate">{player.name}</h3>
            <p className="text-xs font-bold text-yellow-500 tracking-widest uppercase">{player.role}</p>
          </div>

          {/* Shine Sweep */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <div className="absolute top-0 -left-full w-1/2 h-full bg-white/10 skew-x-[-20deg] animate-[shine_3s_infinite]" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
