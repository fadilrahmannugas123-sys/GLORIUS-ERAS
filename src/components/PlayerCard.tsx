import { motion, AnimatePresence } from 'motion/react';
import { Radar } from 'react-chartjs-2';
import { useState } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { X, Trophy, ChevronRight, User, BarChart3 } from 'lucide-react';
import { Player, useGameStore } from '../store/useGameStore';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export function PlayerPreview({ player, onClose }: { player: Player; onClose: () => void }) {
  const { achievements: allAchievements } = useGameStore();
  const [viewMode, setViewMode] = useState<'brief' | 'full'>('brief');
  const playerAchievements = allAchievements.filter(ach => player.achievements?.includes(ach.id));

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
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl overflow-y-auto custom-scrollbar flex flex-col items-center justify-start p-4 md:p-8"
    >
      <AnimatePresence mode="wait">
        {viewMode === 'brief' ? (
          <motion.div
            key="brief"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.1, opacity: 0, y: -50 }}
            className="relative w-full max-w-lg bg-zinc-900 border border-white/20 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col my-auto"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-20 p-2 rounded-full bg-black/40 text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="h-64 relative">
              <img 
                src={player.image} 
                alt={player.name}
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-8">
                <div className="text-5xl font-black text-yellow-500 italic leading-none mb-1">{player.rating}</div>
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">{player.name}</h2>
              </div>
            </div>

            <div className="p-8 pt-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-[10px] font-bold text-yellow-500 uppercase tracking-widest">
                  {player.role}
                </span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-white/60 uppercase tracking-widest">
                  {player.position}
                </span>
              </div>
              
              <p className="text-white/70 text-sm italic leading-relaxed mb-8 line-clamp-3">
                "{player.bio}"
              </p>

              <button 
                onClick={() => setViewMode('full')}
                className="w-full py-4 bg-yellow-500 text-black font-black italic uppercase tracking-widest rounded-xl hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 group"
              >
                ACCESS FULL DOSSIER <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-5xl bg-zinc-900 border border-white/10 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-fit md:h-auto my-auto"
          >
            <div className="absolute top-6 right-6 z-30 flex gap-3">
              <button 
                onClick={() => setViewMode('brief')}
                className="p-2 rounded-full bg-black/40 text-white hover:bg-white/10 transition-colors flex items-center gap-2 px-4"
              >
                <User size={16} /> <span className="text-[10px] font-bold uppercase tracking-widest">Brief</span>
              </button>
              <button 
                onClick={onClose}
                className="p-2 rounded-full bg-black/40 text-white hover:bg-white/10 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Left: Image & Identity */}
            <div className="w-full md:w-2/5 relative h-64 sm:h-80 md:h-auto shrink-0">
              <img 
                src={player.image} 
                alt={player.name}
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent" />
              <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12">
                <div className="text-6xl md:text-8xl font-black text-yellow-500 italic leading-none mb-2 md:mb-4 drop-shadow-2xl">{player.rating}</div>
                <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">{player.name}</h2>
                <div className="flex items-center gap-3">
                  <div className="h-[2px] w-8 md:w-12 bg-yellow-500" />
                  <p className="text-sm md:text-xl font-bold text-yellow-500/80 tracking-[0.2em] uppercase">{player.role}</p>
                </div>
              </div>
            </div>

            {/* Right: Detailed Portfolio */}
            <div className="w-full md:w-3/5 p-6 md:p-16 flex flex-col md:overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <BarChart3 size={16} className="text-yellow-500" />
                    <h4 className="text-xs font-bold text-white/40 uppercase tracking-[0.3em]">ANALYTICS</h4>
                  </div>
                  <div className="w-full aspect-square max-w-[280px] mx-auto">
                    <Radar data={chartData} options={chartOptions} />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Trophy size={16} className="text-yellow-500" />
                    <h4 className="text-xs font-bold text-white/40 uppercase tracking-[0.3em]">MILESTONES</h4>
                  </div>
                  <div className="space-y-3">
                    {playerAchievements.length > 0 ? (
                      playerAchievements.map(ach => (
                        <div key={ach.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-4 group hover:bg-white/10 transition-colors">
                          <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-500">
                            <Trophy size={16} />
                          </div>
                          <div>
                            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-1">{ach.title}</h5>
                            <p className="text-[10px] text-white/40 leading-relaxed">{ach.description}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 border border-dashed border-white/10 rounded-2xl text-center">
                        <p className="text-white/20 text-xs italic">No milestones recorded in system.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-auto space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 size={16} className="text-yellow-500" />
                    <h4 className="text-xs font-bold text-white/40 uppercase tracking-[0.3em]">ACADEMIC BACKGROUND</h4>
                  </div>
                  <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl">
                    <p className="text-yellow-500 font-bold text-sm tracking-wide uppercase">{player.education}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <User size={16} className="text-yellow-500" />
                    <h4 className="text-xs font-bold text-white/40 uppercase tracking-[0.3em]">PERSONA DOSSIER</h4>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-yellow-500 to-transparent opacity-50" />
                    <p className="text-white/80 italic leading-relaxed text-base md:text-lg font-medium">
                      "{player.bio}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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

  const currentRarityColor = rarityColors[player.rarity as keyof typeof rarityColors] || rarityColors.Rare;

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -10 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative w-64 h-80 md:w-72 md:h-96 cursor-pointer group"
    >
      <div className={`w-full h-full rounded-2xl p-1 bg-gradient-to-br ${currentRarityColor} shadow-2xl overflow-hidden`}>
        <div className="w-full h-full bg-black/80 rounded-xl relative overflow-hidden flex flex-col">
          {/* Stats Preview on Hover */}
          <div className="absolute inset-0 z-30 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
            <h4 className="text-xs font-bold text-yellow-500 uppercase tracking-[0.2em] mb-4">STATS PREVIEW</h4>
            <div className="grid grid-cols-2 gap-4 w-full">
              {Object.entries(player.stats).map(([key, val]) => (
                <div key={key} className="flex flex-col">
                  <span className="text-[8px] text-white/40 uppercase font-bold">{key}</span>
                  <span className="text-lg font-black text-white italic">{val}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-white/10 w-full">
              <p className="text-[10px] text-white/60 italic font-medium">Click for full dossier</p>
            </div>
          </div>

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
