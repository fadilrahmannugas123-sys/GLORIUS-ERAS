import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useGameStore, Player } from '../store/useGameStore';
import { LogIn, LayoutDashboard, Users, Trophy, X, Save, Cloud } from 'lucide-react';
import { squadService } from '../services/squadService';

export function AdminPanel() {
  const { setScene, squad, updatePlayer, updateSquad, achievements, updateAchievements, collagePhotos, updateCollagePhotos, isSaving, setSaving } = useGameStore();
  const [adminKey, setAdminKey] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSyncingAchievements, setIsSyncingAchievements] = useState(false);
  const [isSyncingSettings, setIsSyncingSettings] = useState(false);
  const [savingPlayerId, setSavingPlayerId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tempCollagePhotos, setTempCollagePhotos] = useState<string[]>(collagePhotos);

  // Real-time sync from Firebase
  useEffect(() => {
    if (isLoggedIn) {
      const unsubscribeSquad = squadService.subscribeToSquad((remoteSquad) => {
        if (!isSaving) {
          updateSquad(remoteSquad);
        }
      });
      const unsubscribeAchs = squadService.subscribeToAchievements((remoteAchs) => {
        if (!isSaving) {
          updateAchievements(remoteAchs);
        }
      });
      const unsubscribeSettings = squadService.subscribeToSettings((settings) => {
        if (!isSaving && settings.collagePhotos) {
          updateCollagePhotos(settings.collagePhotos);
          setTempCollagePhotos(settings.collagePhotos);
        }
      });
      return () => {
        unsubscribeSquad();
        unsubscribeAchs();
        unsubscribeSettings();
      };
    }
  }, [isLoggedIn, updateSquad, updateAchievements, updateCollagePhotos, isSaving]);

  // Update temp photos when collagePhotos changes from sync
  useEffect(() => {
    setTempCollagePhotos(collagePhotos);
  }, [collagePhotos]);

  const handleSaveToCloud = async () => {
    setIsSyncing(true);
    setSaving(true);
    try {
      await squadService.updateSquad(squad);
      alert('Squad successfully synced to Firebase!');
    } catch (error) {
      console.error('Firebase Sync Error:', error);
      alert('Failed to sync squad. Check console.');
    } finally {
      setIsSyncing(false);
      setSaving(false);
    }
  };

  const handleSaveAchievementsToCloud = async () => {
    setIsSyncingAchievements(true);
    setSaving(true);
    try {
      await squadService.updateAchievements(achievements);
      // Also save squad because achievement assignments are stored in player objects
      await squadService.updateSquad(squad);
      alert('Achievements and assignments successfully synced to Firebase!');
    } catch (error) {
      console.error('Firebase Achievements Sync Error:', error);
      alert('Failed to sync achievements. Check console.');
    } finally {
      setIsSyncingAchievements(false);
      setSaving(false);
    }
  };

  const handleSaveSettingsToCloud = async () => {
    setIsSyncingSettings(true);
    setSaving(true);
    try {
      await squadService.saveCollagePhotos(tempCollagePhotos);
      updateCollagePhotos(tempCollagePhotos);
      alert('Collage settings successfully synced to Firebase!');
    } catch (error) {
      console.error('Firebase Settings Sync Error:', error);
      alert('Failed to sync settings. Check console.');
    } finally {
      setIsSyncingSettings(false);
      setSaving(false);
    }
  };

  const handleSavePlayer = async (player: Player) => {
    setSavingPlayerId(player.id);
    setSaving(true);
    try {
      await squadService.savePlayer(player);
      // Optional: show a small toast or temporary success state
    } catch (error) {
      console.error('Player Save Error:', error);
      alert(`Failed to save ${player.name}.`);
    } finally {
      setSavingPlayerId(null);
      setSaving(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 overflow-y-auto custom-scrollbar">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-8 shadow-2xl my-auto"
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
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
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
      <header className="h-20 border-b border-white/10 flex items-center justify-between px-4 md:px-8 bg-zinc-900 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 text-white/60 hover:text-white"
          >
            <LayoutDashboard size={24} />
          </button>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-yellow-500 flex items-center justify-center text-black font-black italic text-sm md:text-base">GE</div>
          <h2 className="text-lg md:text-xl font-black italic text-white tracking-tighter">HOLOGRAPHIC <span className="text-yellow-500">CONSOLE</span></h2>
        </div>
        <button onClick={() => setScene('menu')} className="text-white/40 hover:text-white flex items-center gap-2 font-bold text-xs md:text-sm">
          <X size={20} /> <span className="hidden sm:inline">EXIT CONSOLE</span>
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-64 border-r border-white/10 bg-zinc-900 p-6 flex flex-col gap-2 transition-transform duration-300 lg:relative lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'squad', label: 'Squad Management', icon: Users },
            { id: 'achievements', label: 'Achievements', icon: Trophy },
            { id: 'settings', label: 'App Settings', icon: Save },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                activeTab === item.id ? 'bg-yellow-500 text-black' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </aside>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-black">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl font-black italic text-white mb-8 uppercase tracking-tighter">{(activeTab || '').replace('-', ' ')}</h3>
            
            {activeTab === 'dashboard' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  <div className="bg-zinc-900 border border-white/10 p-6 rounded-xl">
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Total Squad</p>
                    <p className="text-4xl font-black text-yellow-500 italic">{(squad?.length || 0).toString().padStart(2, '0')}</p>
                  </div>
                  <div className="bg-zinc-900 border border-white/10 p-6 rounded-xl">
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Total Achievements</p>
                    <p className="text-4xl font-black text-purple-500 italic">{(achievements?.length || 0).toString().padStart(2, '0')}</p>
                  </div>
                </div>

                <div className="bg-zinc-900 border border-white/10 rounded-xl p-8 mb-8">
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Save size={18} className="text-yellow-500" /> EXPORT DATA FOR GITHUB
                  </h4>
                  <p className="text-white/60 text-sm mb-6">
                    Use this to get the current data as JSON. You can then provide this to the AI to update the hardcoded "MOCK_DATA" in the source code, ensuring your latest changes are saved in the repository.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => {
                        const data = { squad, achievements };
                        console.log('--- CURRENT DATA JSON ---');
                        console.log(JSON.stringify(data, null, 2));
                        console.log('-------------------------');
                        alert('Data exported to browser console! Open DevTools (F12) to copy it.');
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-bold text-sm transition-all"
                    >
                      EXPORT TO CONSOLE
                    </button>
                    <button 
                      onClick={() => {
                        const data = { squad, achievements };
                        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `squad_data_${new Date().toISOString().split('T')[0]}.json`;
                        a.click();
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-bold text-sm transition-all"
                    >
                      DOWNLOAD JSON FILE
                    </button>
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
                    {isSyncing ? 'SYNCING...' : 'SAVE ALL TO FIREBASE'}
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {squad.map((player, index) => (
                    <div key={player.id || index} className="bg-zinc-900 border border-white/10 rounded-xl p-4 md:p-6 shadow-xl">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Left Section: Image & Basic Info */}
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                          <div className="flex flex-col items-center gap-2">
                            <div className="relative group/img w-24 h-24 sm:w-32 sm:h-32">
                              <img 
                                src={player.image} 
                                alt={player.name} 
                                className="w-full h-full rounded-xl object-cover border-2 border-white/10 group-hover/img:border-yellow-500 transition-colors" 
                                referrerPolicy="no-referrer" 
                              />
                            </div>
                            <div className="w-full">
                              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">RARITY:</span>
                              <select 
                                value={player.rarity || 'Rare'}
                                onChange={(e) => updatePlayer(index, { ...player, rarity: e.target.value as any })}
                                className="w-full bg-black border border-white/10 rounded px-2 py-1.5 text-[10px] font-bold text-yellow-500 outline-none focus:border-yellow-500 appearance-none cursor-pointer"
                              >
                                <option value="Rare">RARE</option>
                                <option value="Elite">ELITE</option>
                                <option value="Master">MASTER</option>
                                <option value="Legendary">LEGENDARY</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">NAME:</span>
                                <input 
                                  type="text"
                                  value={player.name || ''}
                                  onChange={(e) => updatePlayer(index, { ...player, name: e.target.value })}
                                  className="bg-black/50 border border-white/10 rounded px-3 py-2 text-sm font-bold text-white outline-none focus:border-yellow-500 w-full"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">POSITION:</span>
                                <input 
                                  type="text"
                                  value={player.position || ''}
                                  onChange={(e) => updatePlayer(index, { ...player, position: e.target.value })}
                                  className="bg-black/50 border border-white/10 rounded px-3 py-2 text-sm font-bold text-white outline-none focus:border-yellow-500 w-full"
                                />
                              </div>
                            </div>

                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">IMAGE URL:</span>
                              <input 
                                type="text"
                                value={player.image || ''}
                                onChange={(e) => updatePlayer(index, { ...player, image: e.target.value })}
                                className="bg-black/50 border border-white/10 rounded px-3 py-2 text-[10px] text-blue-400 outline-none focus:border-yellow-500 w-full font-mono"
                                placeholder="https://..."
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">EDUCATION:</span>
                              <input 
                                type="text"
                                value={player.education || ''}
                                onChange={(e) => updatePlayer(index, { ...player, education: e.target.value })}
                                className="bg-black/50 border border-white/10 rounded px-3 py-2 text-xs text-blue-400 font-bold outline-none focus:border-yellow-500 w-full"
                                placeholder="University - Major"
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">ROLE:</span>
                              <input 
                                type="text"
                                value={player.role || ''}
                                onChange={(e) => updatePlayer(index, { ...player, role: e.target.value })}
                                className="bg-black/50 border border-white/10 rounded px-3 py-2 text-xs text-yellow-500 font-bold outline-none focus:border-yellow-500 w-full"
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">BIOGRAPHY:</span>
                              <textarea 
                                value={player.bio || ''}
                                onChange={(e) => updatePlayer(index, { ...player, bio: e.target.value })}
                                className="bg-black/50 border border-white/10 rounded px-3 py-2 text-xs text-white/60 outline-none focus:border-yellow-500 w-full h-20 resize-none"
                                placeholder="Enter player biography..."
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">ACHIEVEMENTS:</span>
                              <div className="flex flex-wrap gap-2 p-2 bg-black/30 rounded border border-white/5">
                                {achievements.map(ach => (
                                  <button
                                    key={ach.id}
                                    onClick={() => {
                                      const hasAch = player.achievements?.includes(ach.id);
                                      const newAchs = hasAch 
                                        ? player.achievements.filter(id => id !== ach.id)
                                        : [...(player.achievements || []), ach.id];
                                      updatePlayer(index, { ...player, achievements: newAchs });
                                    }}
                                    className={`px-2 py-1 rounded text-[9px] font-bold transition-all ${
                                      player.achievements?.includes(ach.id)
                                        ? 'bg-yellow-500 text-black'
                                        : 'bg-white/5 text-white/40 hover:bg-white/10'
                                    }`}
                                  >
                                    {ach.title}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right Section: Stats & Actions */}
                        <div className="flex flex-col gap-6 lg:w-80">
                          <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                              <div className="text-left">
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">RATING</p>
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="number"
                                    min="88"
                                    max="94"
                                    value={player.rating || 0}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value);
                                      if (!isNaN(val)) {
                                        updatePlayer(index, { ...player, rating: val });
                                      }
                                    }}
                                    className="w-16 bg-black border border-white/20 rounded px-2 py-1 text-xl font-black text-yellow-500 italic text-center outline-none focus:border-yellow-500"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => handleSavePlayer(player)}
                                  disabled={savingPlayerId === player.id}
                                  className="p-2 bg-green-600/20 text-green-500 hover:bg-green-600 hover:text-white rounded-lg transition-all disabled:opacity-50"
                                  title="Save this player"
                                >
                                  {savingPlayerId === player.id ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <Save size={20} />}
                                </button>
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
                                  className="p-2 bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition-all"
                                  title="Delete Player"
                                >
                                  <X size={20} />
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            {Object.entries(player.stats).map(([stat, value]) => (
                              <div key={stat} className="bg-black/20 p-2 rounded-lg border border-white/5">
                                <label className="block text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1">{stat}</label>
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={value || 0}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value);
                                      if (!isNaN(val)) {
                                        const newStats = { ...player.stats, [stat]: Math.min(100, Math.max(0, val)) };
                                        updatePlayer(index, { ...player, stats: newStats });
                                      }
                                    }}
                                    className="w-full bg-black/50 border border-white/10 rounded text-xs font-mono text-white text-center py-1 outline-none focus:border-yellow-500"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
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
                      education: 'University - Major',
                      bio: 'New squad member biography...',
                      achievements: []
                    };
                    updateSquad([...squad, newPlayer]);
                  }}
                  className="w-full py-4 border-2 border-dashed border-white/10 rounded-xl text-white/40 hover:text-white hover:border-white/20 transition-all font-bold uppercase tracking-widest text-sm"
                >
                  + Add New Squad Member
                </button>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                  <p className="text-sm text-white/60 italic">Sync achievements and player assignments to cloud.</p>
                  <button 
                    onClick={handleSaveAchievementsToCloud}
                    disabled={isSyncingAchievements}
                    className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all"
                  >
                    {isSyncingAchievements ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <Cloud size={18} />}
                    {isSyncingAchievements ? 'SYNCING...' : 'SAVE ALL TO FIREBASE'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((ach, index) => (
                    <div key={ach.id} className="bg-zinc-900 border border-white/10 rounded-xl p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-4">
                          <div>
                            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">TITLE</label>
                            <input 
                              type="text"
                              value={ach.title || ''}
                              onChange={(e) => {
                                const newAchs = [...achievements];
                                newAchs[index] = { ...ach, title: e.target.value };
                                updateAchievements(newAchs);
                              }}
                              className="w-full bg-black border border-white/10 rounded px-3 py-2 text-sm font-bold text-white outline-none focus:border-yellow-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">DESCRIPTION</label>
                            <textarea 
                              value={ach.description || ''}
                              onChange={(e) => {
                                const newAchs = [...achievements];
                                newAchs[index] = { ...ach, description: e.target.value };
                                updateAchievements(newAchs);
                              }}
                              className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs text-white/60 outline-none focus:border-yellow-500 h-20 resize-none"
                            />
                          </div>
                        </div>
                        <button 
                          onClick={async () => {
                            if (confirm(`Are you sure you want to delete this achievement?`)) {
                              try {
                                await squadService.deleteAchievement(ach.id);
                                const newAchs = achievements.filter((_, i) => i !== index);
                                updateAchievements(newAchs);
                              } catch (error) {
                                console.error('Achievement Delete Error:', error);
                                alert('Failed to delete achievement from cloud.');
                              }
                            }
                          }}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">RARITY</label>
                          <select 
                            value={ach.rarity || 'Common'}
                            onChange={(e) => {
                              const newAchs = [...achievements];
                              newAchs[index] = { ...ach, rarity: e.target.value as any };
                              updateAchievements(newAchs);
                            }}
                            className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs font-bold text-yellow-500 outline-none focus:border-yellow-500"
                          >
                            <option value="Common">COMMON</option>
                            <option value="Rare">RARE</option>
                            <option value="Epic">EPIC</option>
                            <option value="Legendary">LEGENDARY</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2 pt-6">
                          <input 
                            type="checkbox"
                            checked={ach.isLocked || false}
                            onChange={(e) => {
                              const newAchs = [...achievements];
                              newAchs[index] = { ...ach, isLocked: e.target.checked };
                              updateAchievements(newAchs);
                            }}
                            className="w-4 h-4 accent-yellow-500"
                          />
                          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">LOCKED</label>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/5">
                        <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">EARNED BY:</label>
                        <div className="flex flex-wrap gap-2">
                          {squad.map((player, pIndex) => (
                            <button
                              key={player.id}
                              onClick={() => {
                                const hasAch = player.achievements?.includes(ach.id);
                                const newAchs = hasAch 
                                  ? player.achievements.filter(id => id !== ach.id)
                                  : [...(player.achievements || []), ach.id];
                                updatePlayer(pIndex, { ...player, achievements: newAchs });
                              }}
                              className={`px-2 py-1 rounded text-[9px] font-bold transition-all ${
                                player.achievements?.includes(ach.id)
                                  ? 'bg-yellow-500 text-black'
                                  : 'bg-white/5 text-white/40 hover:bg-white/10'
                              }`}
                            >
                              {player.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => {
                    const newAch = {
                      id: Date.now().toString(),
                      title: 'NEW ACHIEVEMENT',
                      description: 'Achievement description...',
                      rarity: 'Common' as const,
                      isLocked: false,
                      icon: ''
                    };
                    updateAchievements([...achievements, newAch]);
                  }}
                  className="w-full py-4 border-2 border-dashed border-white/10 rounded-xl text-white/40 hover:text-white hover:border-white/20 transition-all font-bold uppercase tracking-widest text-sm"
                >
                  + Create New Achievement
                </button>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-8">
                <div className="bg-zinc-900 border border-white/10 rounded-xl p-8">
                  <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                    <LayoutDashboard size={18} className="text-yellow-500" /> MUSEUM COLLAGE CUSTOMIZATION
                  </h4>
                  
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {tempCollagePhotos.map((url, index) => (
                        <div key={index} className="space-y-4 p-4 bg-black/40 rounded-xl border border-white/5">
                          <div className="flex justify-between items-center">
                            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest">Photo Frame #{index + 1}</label>
                            <span className="text-[10px] font-mono text-yellow-500/50">ID: FRAME_{index + 1}</span>
                          </div>
                          
                          <div className="flex flex-col gap-4">
                            <input 
                              type="text" 
                              value={url}
                              onChange={(e) => {
                                const newPhotos = [...tempCollagePhotos];
                                newPhotos[index] = e.target.value;
                                setTempCollagePhotos(newPhotos);
                              }}
                              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-blue-400 font-mono text-[10px] focus:border-yellow-500 outline-none transition-colors"
                              placeholder="Enter image URL..."
                            />
                            <div className="relative aspect-[3/4] w-full max-w-[150px] mx-auto rounded-lg overflow-hidden border-4 border-[#2a2a2a] bg-zinc-800 shadow-xl">
                              <img 
                                src={url} 
                                alt={`Frame ${index + 1} Preview`} 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=800&auto=format&fit=crop';
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-2">
                                <span className="text-[8px] text-white/60 font-bold uppercase tracking-widest">Preview</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-white/5">
                      <button 
                        onClick={handleSaveSettingsToCloud}
                        disabled={isSyncingSettings}
                        className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-black px-8 py-3 rounded-lg font-black flex items-center gap-2 transition-all shadow-lg shadow-yellow-500/10"
                      >
                        {isSyncingSettings ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" /> : <Cloud size={18} />}
                        {isSyncingSettings ? 'SAVING COLLAGE...' : 'APPLY & SAVE TO CLOUD'}
                      </button>
                      <p className="mt-4 text-white/40 text-[10px] leading-relaxed">
                        TIP: Each photo represents a frame in the museum background collage. 
                        Changes are saved to Firebase and reflected in real-time for all users.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900 border border-white/10 rounded-xl p-8">
                  <h4 className="text-white font-bold mb-4">System Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-[10px] font-mono">
                    <div className="text-white/40">Environment:</div>
                    <div className="text-green-500">Production / Holographic</div>
                    <div className="text-white/40">Firebase Status:</div>
                    <div className="text-green-500">Connected</div>
                    <div className="text-white/40">Last Sync:</div>
                    <div className="text-white/60">{new Date().toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab !== 'dashboard' && activeTab !== 'squad' && activeTab !== 'achievements' && (
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
