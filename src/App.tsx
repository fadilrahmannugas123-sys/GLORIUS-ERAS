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
  const { scene, setScene, squad, achievements, updateSquad } = useGameStore();
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);

  // Initial load from Firebase
  useEffect(() => {
    const unsubscribe = squadService.subscribeToSquad((remoteSquad) => {
      if (remoteSquad && remoteSquad.length > 0) {
        updateSquad(remoteSquad);
      }
    });
    return () => unsubscribe();
  }, [updateSquad]);

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
            className="fixed inset-0 flex flex-col items-center justify-center pt-20"
          >
            <div className="flex gap-6 md:gap-12 overflow-x-auto no-scrollbar px-12 pb-12 snap-x snap-center max-w-full">
              {squad.map((player) => (
                <div key={player.id || player.name} className="snap-center">
                  <PlayerCard player={player} onClick={() => setSelectedPlayer(player)} />
                </div>
              ))}
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
            className="fixed inset-0 flex flex-col items-center justify-center"
          >
            <div className="max-w-6xl w-full px-6">
              <h2 className="text-4xl font-black italic text-white text-center mb-8">TROPHY <span className="text-yellow-500">ROOM</span></h2>
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
    <div className="fixed inset-0 bg-black overflow-hidden select-none">
      {/* 3D Background Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows={{ type: THREE.PCFShadowMap }}>
          <Suspense fallback={null}>
            <Stadium />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Layer */}
      <div className="relative z-10 w-full h-full">
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
              className="fixed top-8 left-8 p-4 rounded-full bg-black/40 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center gap-2 font-bold"
            >
              <ChevronLeft /> BACK TO MENU
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Overlay Effects */}
      <div className="fixed inset-0 pointer-events-none z-20">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
      </div>
    </div>
  );
}
