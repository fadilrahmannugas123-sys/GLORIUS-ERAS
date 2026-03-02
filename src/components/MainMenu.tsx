import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../store/useGameStore';
import { playSound } from '../lib/sounds';
import { Trophy, Users, Calendar, Settings, Volume2, VolumeX } from 'lucide-react';

export function MainMenu() {
  const { setScene, isMuted, toggleMute } = useGameStore();

  const menuItems = [
    { id: 'squad', label: 'MY SQUAD', icon: Users, color: 'from-gold-500 to-yellow-600' },
    { id: 'admin', label: 'ADMIN PANEL', icon: Settings, color: 'from-gray-700 to-gray-900' },
  ];

  const handleNav = (scene: any) => {
    playSound('click');
    setScene(scene);
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-6xl font-black tracking-tighter text-white italic">
          GLORIOUS <span className="text-yellow-500">ERAS</span>
        </h1>
        <p className="text-yellow-500/60 font-mono tracking-[0.5em] text-xs mt-2">SQUAD PORTFOLIO</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pointer-events-auto px-6 max-w-7xl w-full">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNav(item.id)}
            className="relative group overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-md p-8 text-left"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
            <item.icon className="w-8 h-8 text-yellow-500 mb-4" />
            <h3 className="text-xl font-bold text-white italic">{item.label}</h3>
            <div className="mt-2 h-1 w-0 group-hover:w-full bg-yellow-500 transition-all duration-300" />
          </motion.button>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={toggleMute}
        className="fixed bottom-8 right-8 p-4 rounded-full bg-black/40 border border-white/10 text-white pointer-events-auto hover:bg-white/10 transition-colors"
      >
        {isMuted ? <VolumeX /> : <Volume2 />}
      </motion.button>
    </div>
  );
}
