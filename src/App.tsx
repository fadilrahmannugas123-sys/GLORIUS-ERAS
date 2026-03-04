import { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IntroSequence } from './components/IntroSequence';
import { MainMenu } from './components/MainMenu';
import { PlayerCard, PlayerPreview } from './components/PlayerCard';
import { AchievementGrid } from './components/AchievementGrid';
import { AdminPanel } from './components/AdminPanel';
import { useGameStore } from './store/useGameStore';
import { ChevronLeft } from 'lucide-react';

import { squadService } from './services/squadService';

export default function App() {
  const { scene, setScene, squad, achievements, collagePhotos, updateSquad, updateCollagePhotos, isSaving } = useGameStore();
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
 
  // Initial load from Firebase
  useEffect(() => {
    const unsubscribeSquad = squadService.subscribeToSquad((remoteSquad) => {
      // Only update if we are not currently saving to prevent race conditions
      if (!isSaving && remoteSquad && remoteSquad.length > 0) {
        updateSquad(remoteSquad);
      }
    });
 
    const unsubscribeSettings = squadService.subscribeToSettings((settings) => {
      if (!isSaving && settings.collagePhotos && settings.collagePhotos.length > 0) {
        updateCollagePhotos(settings.collagePhotos);
      }
    });

    return () => {
      unsubscribeSquad();
      unsubscribeSettings();
    };
  }, [updateSquad, updateCollagePhotos, isSaving]);

  const renderScene = () => {
    switch (scene) {
      case 'intro':
        return <IntroSequence key="intro" />;
      case 'menu':
        return <MainMenu key="menu" />;
      case 'squad':
        return (
          <motion.div 
            key="squad"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-start pt-24 pb-12 px-4"
          >
            <div className="w-full max-w-7xl">
              <h2 className="text-4xl md:text-6xl font-black italic text-white text-center mb-12 drop-shadow-lg">
                SQUAD <span className="text-yellow-500">ROSTER</span>
              </h2>
              <div className="flex gap-4 md:gap-8 overflow-x-auto pb-8 snap-x snap-mandatory custom-scrollbar">
                {squad.map((player) => (
                  <div key={player.id || player.name} className="snap-center shrink-0">
                    <PlayerCard player={player} onClick={() => setSelectedPlayer(player)} />
                  </div>
                ))}
              </div>
            </div>

            <AnimatePresence>
              {selectedPlayer && (
                <PlayerPreview 
                  player={selectedPlayer} 
                  onClose={() => setSelectedPlayer(null)} 
                />
              )}
            </AnimatePresence>
          </motion.div>
        );
      case 'achievements':
        return (
          <motion.div 
            key="achievements"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-start pt-24 pb-12 px-4"
          >
            <div className="max-w-6xl w-full">
              <h2 className="text-4xl md:text-6xl font-black italic text-white text-center mb-12 drop-shadow-lg">
                TROPHY <span className="text-yellow-500">ROOM</span>
              </h2>
              <AchievementGrid achievements={achievements} />
            </div>
          </motion.div>
        );
      case 'admin':
        return <AdminPanel key="admin" />;
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen select-none overflow-x-hidden bg-black">
      {/* Background Layer - Luxurious Museum Trophy Hall with Photo Collage */}
      <div className="fixed inset-0 z-0 overflow-hidden bg-[#0a0a0a]">
        {/* The Collage Grid */}
        <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 gap-8 p-12 opacity-40 scale-105">
          {collagePhotos.map((url, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
              animate={{ 
                opacity: 1, 
                x: index % 2 === 0 ? [0, 60, 0] : [0, -60, 0],
                y: index % 3 === 0 ? [0, -15, 0] : [0, 15, 0],
                rotate: index % 3 === 0 ? [0, 2, 0] : [0, -2, 0]
              }}
              transition={{ 
                opacity: { duration: 1.5, delay: index * 0.2 },
                x: { repeat: Infinity, duration: 25 + index * 5, ease: "easeInOut" },
                y: { repeat: Infinity, duration: 30 + index * 7, ease: "easeInOut" },
                rotate: { repeat: Infinity, duration: 35 + index * 10, ease: "easeInOut" }
              }}
              className="relative aspect-[3/4] group"
            >
              {/* Museum Frame */}
              <div className="absolute inset-0 bg-[#1a1a1a] border-[12px] border-[#2a2a2a] shadow-2xl rounded-sm overflow-hidden">
                <div className="absolute inset-0 border border-yellow-500/20" />
                <div 
                  className="w-full h-full bg-cover bg-center grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
                  style={{ backgroundImage: `url("${url}")` }}
                />
                {/* Spotlight on frame */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
              </div>
              
              {/* Frame Shadow on "Wall" */}
              <div className="absolute -inset-2 bg-black/40 blur-xl -z-10" />
            </motion.div>
          ))}
        </div>

        {/* Atmospheric Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.05),transparent_70%)]" />
        
        {/* Animated Dust Particles / Bokeh */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full blur-sm animate-pulse" />
          <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-yellow-200 rounded-full blur-[1px] animate-pulse delay-700" />
          <div className="absolute top-3/4 left-1/3 w-1.5 h-1.5 bg-white rounded-full blur-sm animate-pulse delay-1000" />
        </div>
      </div>

      {/* UI Layer - Scrollable */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        <AnimatePresence mode="wait">
          {renderScene()}
        </AnimatePresence>

        {/* Global Back Button (except intro and menu) */}
        <AnimatePresence>
          {scene !== 'intro' && scene !== 'menu' && scene !== 'admin' && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={() => {
                setScene('menu');
              }}
              className="fixed top-4 left-4 md:top-8 md:left-8 p-3 md:p-4 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-all flex items-center gap-2 font-bold z-50 text-xs md:text-base"
            >
              <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" /> BACK TO MENU
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Overlay Effects */}
      <div className="fixed inset-0 pointer-events-none z-20">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.7)]" />
      </div>
    </div>
  );
}
