import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../store/useGameStore';
import { Trophy, Users, Settings } from 'lucide-react';

export function MainMenu() {
  const { setScene } = useGameStore();

  const menuItems = [
    { id: 'squad', label: 'MY SQUAD', icon: Users, color: 'from-gold-500 to-yellow-600' },
    { id: 'achievements', label: 'ACHIEVEMENTS', icon: Trophy, color: 'from-purple-500 to-purple-700' },
    { id: 'admin', label: 'ADMIN PANEL', icon: Settings, color: 'from-gray-700 to-gray-900' },
  ];

  const handleNav = (scene: any) => {
    setScene(scene);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 md:mb-16"
      >
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white italic relative">
          <span className="relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">GLORIOUS</span>
          <br />
          <span className="text-yellow-500 drop-shadow-[0_0_30px_rgba(255,215,0,0.8)] animate-pulse">ERAS</span>
          
          {/* Background Glows */}
          <div className="absolute inset-0 -z-10 blur-[60px] opacity-30 bg-yellow-500 rounded-full scale-150" />
          <div className="absolute inset-0 -z-10 blur-[100px] opacity-20 bg-white rounded-full scale-110" />
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 px-4 max-w-5xl w-full">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNav(item.id)}
            className="relative group overflow-hidden rounded-xl border border-white/10 bg-black/60 backdrop-blur-xl p-6 md:p-8 text-left"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
            <item.icon className="w-6 h-6 md:w-8 md:h-8 text-yellow-500 mb-4" />
            <h3 className="text-lg md:text-xl font-bold text-white italic">{item.label}</h3>
            <div className="mt-2 h-1 w-0 group-hover:w-full bg-yellow-500 transition-all duration-300" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
