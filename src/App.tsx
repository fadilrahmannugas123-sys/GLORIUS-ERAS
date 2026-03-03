import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Stadium } from './components/Stadium';
import { IntroSequence } from './components/IntroSequence';
import { MainMenu } from './components/MainMenu';
import { PlayerCard, PlayerPreview } from './components/PlayerCard';
import { AchievementGrid } from './components/AchievementGrid';
import { AdminPanel } from './components/AdminPanel';
import { useGameStore } from './store/useGameStore';
import { ChevronLeft } from 'lucide-react';

import { squadService } from './services/squadService';

export default function App() {
  const { scene, setScene, squad, achievements, updateSquad, isSaving } = useGameStore();
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);

  // Initial load from Firebase
  useEffect(() => {
    const unsubscribe = squadService.subscribeToSquad((remoteSquad) => {
      // Only update if we are not currently saving to prevent race conditions
      if (!isSaving && remoteSquad && remoteSquad.length > 0) {
        updateSquad(remoteSquad);
      }
    });
    return () => unsubscribe();
  }, [updateSquad, isSaving]);

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
    <div className="relative min-h-screen bg-black select-none">
      {/* 3D Background Layer - Stays fixed */}
      <div className="fixed inset-0 z-0">
        <Canvas shadows={{ type: THREE.PCFShadowMap }}>
          <Suspense fallback={null}>
            <Stadium />
          </Suspense>
        </Canvas>
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
