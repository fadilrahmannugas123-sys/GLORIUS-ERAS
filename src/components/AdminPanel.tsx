import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useGameStore, Player } from '../store/useGameStore';
import { LogIn, LayoutDashboard, Users, Trophy, Calendar, Settings, X, Save, Cloud } from 'lucide-react';
import { squadService } from '../services/squadService';

export function AdminPanel() {
  const { setScene, squad, updatePlayer, updateSquad } = useGameStore();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSyncing, setIsSyncing] = useState(false);

  // Real-time sync from Firebase
  useEffect(() => {
    if (isLoggedIn) {
      const unsubscribe = squadService.subscribeToSquad((remoteSquad) => {
        updateSquad(remoteSquad);
      });
      return () => unsubscribe();
    }
  }, [isLoggedIn, updateSquad]);

  const handleSaveToCloud = async () => {
    setIsSyncing(true);
    try {
      await squadService.updateSquad(squad);
      alert('Squad successfully synced to Firebase Console!');
    } catch (error) {
      console.error('Firebase Sync Error:', error);
      alert('Failed to sync. Check console for details.');
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-8 shadow-2xl"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black italic text-white">ADMIN <span className="text-yellow-500">ACCESS</span></h2>
            <button onClick={() => setScene('menu')} className="text-white/40 hover:text-white"><X /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Access Key</label>
              <input 
                type="password" 
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-yellow-500 outline-none transition-colors"
                placeholder="Enter admin key..."
              />
            </div>
            <button 
              onClick={() => setIsLoggedIn(true)}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-black py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <LogIn size={20} /> INITIALIZE CONSOLE
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      {/* Header */}
      <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-zinc-900">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-yellow-500 flex items-center justify-center text-black font-black italic">GE</div>
          <h2 className="text-xl font-black italic text-white tracking-tighter">HOLOGRAPHIC <span className="text-yellow-500">CONSOLE v1.0</span></h2>
        </div>
        <button onClick={() => setScene('menu')} className="text-white/40 hover:text-white flex items-center gap-2 font-bold text-sm">
          <X size={20} /> EXIT CONSOLE
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/10 bg-zinc-900/50 p-6 flex flex-col gap-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'squad', label: 'Squad Management', icon: Users },
            { id: 'timeline', label: 'Project Timeline', icon: Calendar },
            { id: 'achievements', label: 'Achievements', icon: Trophy },
            { id: 'settings', label: 'Stadium Settings', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                activeTab === item.id ? 'bg-yellow-500 text-black' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-black">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl font-black italic text-white mb-8 uppercase tracking-tighter">{activeTab.replace('-', ' ')}</h3>
            
            {activeTab === 'dashboard' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <div className="bg-zinc-900 border border-white/10 p-6 rounded-xl">
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Total Squad</p>
                    <p className="text-4xl font-black text-yellow-500 italic">{useGameStore.getState().squad.length.toString().padStart(2, '0')}</p>
                  </div>
                  <div className="bg-zinc-900 border border-white/10 p-6 rounded-xl">
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Active Projects</p>
                    <p className="text-4xl font-black text-blue-500 italic">{useGameStore.getState().milestones.length.toString().padStart(2, '0')}</p>
                  </div>
                  <div className="bg-zinc-900 border border-white/10 p-6 rounded-xl">
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Unlocked Trophies</p>
                    <p className="text-4xl font-black text-purple-500 italic">{useGameStore.getState().achievements.filter(a => !a.isLocked).length.toString().padStart(2, '0')}</p>
                  </div>
                </div>

                <div className="bg-zinc-900 border border-white/10 rounded-xl p-8">
                  <p className="text-white/40 font-mono text-sm">
                    [SYSTEM]: Waiting for Firebase connection...<br />
                    [SYSTEM]: Authenticating admin session...<br />
                    [SYSTEM]: Ready for data injection.
                  </p>
                </div>
              </>
            )}

            {activeTab === 'squad' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                  <p className="text-sm text-white/60 italic">Changes are saved locally. Push to cloud to update Firebase.</p>
                  <button 
                    onClick={handleSaveToCloud}
                    disabled={isSyncing}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all"
                  >
                    {isSyncing ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <Cloud size={18} />}
                    {isSyncing ? 'SYNCING...' : 'PUSH TO FIREBASE'}
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {squad.map((player, index) => (
                    <div key={index} className="bg-zinc-900 border border-white/10 rounded-xl p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="relative group/img">
                            <img src={player.image} alt={player.name} className="w-20 h-20 rounded-lg object-cover border border-white/10" referrerPolicy="no-referrer" />
                          </div>
                          <div className="space-y-3 flex-1">
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">NAME:</span>
                              <input 
                                type="text"
                                value={player.name}
                                onChange={(e) => updatePlayer(index, { ...player, name: e.target.value })}
                                className="bg-black/50 border border-white/10 rounded px-3 py-1.5 text-lg font-bold text-white outline-none focus:border-yellow-500 w-full"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">IMAGE URL:</span>
                              <input 
                                type="text"
                                value={player.image}
                                onChange={(e) => updatePlayer(index, { ...player, image: e.target.value })}
                                className="bg-black/50 border border-white/10 rounded px-3 py-1.5 text-xs text-blue-400 outline-none focus:border-yellow-500 w-full font-mono"
                                placeholder="https://..."
                              />
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">ROLE:</span>
                                <input 
                                  type="text"
                                  value={player.role}
                                  onChange={(e) => updatePlayer(index, { ...player, role: e.target.value })}
                                  className="bg-black/50 border border-white/10 rounded px-2 py-1 text-xs text-yellow-500 font-bold outline-none focus:border-yellow-500 w-48"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">POS:</span>
                                <input 
                                  type="text"
                                  value={player.position}
                                  onChange={(e) => updatePlayer(index, { ...player, position: e.target.value })}
                                  className="bg-black/50 border border-white/10 rounded px-2 py-1 text-xs text-white font-bold outline-none focus:border-yellow-500 w-16 text-center"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 bg-black/40 p-4 rounded-lg border border-white/5">
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">OVERALL RATING</p>
                            <div className="flex items-center gap-2">
                              <input 
                                type="number"
                                min="88"
                                max="94"
                                value={player.rating}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  if (!isNaN(val)) {
                                    updatePlayer(index, { ...player, rating: val });
                                  }
                                }}
                                className="w-16 bg-black border border-white/20 rounded px-2 py-1 text-xl font-black text-yellow-500 italic text-center outline-none focus:border-yellow-500"
                              />
                              <span className="text-xs text-white/20 font-bold">88-94</span>
                            </div>
                          </div>
                          <div className="border-l border-white/10 pl-4 ml-2">
                            <button 
                              onClick={async () => {
                                if (confirm(`Are you sure you want to remove ${player.name}?`)) {
                                  try {
                                    await squadService.deletePlayer(player.id);
                                    const newSquad = squad.filter((_, i) => i !== index);
                                    updateSquad(newSquad);
                                  } catch (error) {
                                    console.error('Delete Error:', error);
                                    alert('Failed to delete from cloud. Try again.');
                                  }
                                }
                              }}
                              className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Delete Player"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {Object.entries(player.stats).map(([stat, value]) => (
                          <div key={stat}>
                            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">{stat}</label>
                            <div className="flex items-center gap-3">
                              <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={value}
                                onChange={(e) => {
                                  const newStats = { ...player.stats, [stat]: parseInt(e.target.value) };
                                  updatePlayer(index, { ...player, stats: newStats });
                                }}
                                className="flex-1 accent-yellow-500"
                              />
                              <input 
                                type="number"
                                min="0"
                                max="100"
                                value={value}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  if (!isNaN(val)) {
                                    const newStats = { ...player.stats, [stat]: Math.min(100, Math.max(0, val)) };
                                    updatePlayer(index, { ...player, stats: newStats });
                                  }
                                }}
                                className="w-12 bg-black border border-white/10 rounded text-xs font-mono text-white text-center py-1"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => {
                    const newPlayer: Player = {
                      id: `p${Date.now()}`,
                      name: 'NEW PLAYER',
                      role: 'New Role',
                      position: 'SUB',
                      rating: 88,
                      rarity: 'Rare',
                      stats: { creativity: 50, technical: 50, leadership: 50, strategy: 50 },
                      image: 'https://picsum.photos/seed/new/400/600',
                      bio: 'New squad member biography...'
                    };
                    updateSquad([...squad, newPlayer]);
                  }}
                  className="w-full py-4 border-2 border-dashed border-white/10 rounded-xl text-white/40 hover:text-white hover:border-white/20 transition-all font-bold uppercase tracking-widest text-sm"
                >
                  + Add New Squad Member
                </button>
              </div>
            )}

            {activeTab !== 'dashboard' && activeTab !== 'squad' && (
              <div className="bg-zinc-900 border border-white/10 rounded-xl p-12 text-center">
                <p className="text-white/40 italic">Module "{activeTab}" is currently under maintenance.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
