import { create } from 'zustand';

export interface Player {
  id: string;
  name: string;
  role: string;
  position: string;
  rating: number;
  rarity: 'Rare' | 'Elite' | 'Master' | 'Legendary';
  stats: {
    creativity: number;
    technical: number;
    leadership: number;
    strategy: number;
  };
  image: string;
  bio: string;
}

export interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
  image: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  isLocked: boolean;
  icon: string;
}

interface GameState {
  scene: 'intro' | 'menu' | 'squad' | 'timeline' | 'achievements' | 'admin';
  isLoaded: boolean;
  isMuted: boolean;
  introComplete: boolean;
  squad: Player[];
  milestones: Milestone[];
  achievements: Achievement[];
  setScene: (scene: GameState['scene']) => void;
  setLoaded: (loaded: boolean) => void;
  toggleMute: () => void;
  setIntroComplete: (complete: boolean) => void;
  updateSquad: (squad: Player[]) => void;
  updatePlayer: (index: number, player: Player) => void;
}

const MOCK_SQUAD: Player[] = [
  {
    id: 'p1',
    name: 'FADIL RAHMAN',
    role: 'Lead Architect',
    position: 'ST',
    rating: 94,
    rarity: 'Legendary',
    stats: { creativity: 95, technical: 92, leadership: 98, strategy: 94 },
    image: 'https://picsum.photos/seed/fadil/400/600',
    bio: 'Visionary leader with a passion for immersive digital experiences and high-performance architectures.'
  },
  {
    id: 'p2',
    name: 'SARAH JANE',
    role: 'UI/UX Designer',
    position: 'LW',
    rating: 91,
    rarity: 'Master',
    stats: { creativity: 98, technical: 88, leadership: 85, strategy: 90 },
    image: 'https://picsum.photos/seed/sarah/400/600',
    bio: 'Crafting beautiful, user-centric interfaces that bridge the gap between technology and human emotion.'
  },
  {
    id: 'p3',
    name: 'ALEX CHEN',
    role: 'Backend Engineer',
    position: 'CDM',
    rating: 89,
    rarity: 'Elite',
    stats: { creativity: 82, technical: 95, leadership: 88, strategy: 92 },
    image: 'https://picsum.photos/seed/alex/400/600',
    bio: 'Specializing in robust, scalable server-side solutions and real-time data synchronization.'
  },
  {
    id: 'p4',
    name: 'MARIA GARCIA',
    role: '3D Artist',
    position: 'RW',
    rating: 90,
    rarity: 'Elite',
    stats: { creativity: 96, technical: 90, leadership: 80, strategy: 85 },
    image: 'https://picsum.photos/seed/maria/400/600',
    bio: 'Bringing virtual worlds to life with stunning 3D models and cinematic environment designs.'
  }
];

const MOCK_MILESTONES: Milestone[] = [
  { id: '1', year: '2022', title: 'The Genesis', description: 'Founded the squad and launched our first major WebGL project.', image: 'https://picsum.photos/seed/m1/800/400' },
  { id: '2', year: '2023', title: 'Global Expansion', description: 'Partnered with international brands to deliver high-end digital solutions.', image: 'https://picsum.photos/seed/m2/800/400' },
  { id: '3', year: '2024', title: 'AI Integration', description: 'Pioneered the use of generative AI in interactive web applications.', image: 'https://picsum.photos/seed/m3/800/400' },
  { id: '4', year: '2025', title: 'The Future', description: 'Launching the next generation of immersive portfolio experiences.', image: 'https://picsum.photos/seed/m4/800/400' },
];

const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: '1', title: 'First Blood', description: 'Complete your first project.', rarity: 'Common', isLocked: false, icon: '' },
  { id: '2', title: 'Pixel Perfect', description: 'Achieve 100% design fidelity.', rarity: 'Rare', isLocked: false, icon: '' },
  { id: '3', title: 'Speed Demon', description: 'Optimize app to 60fps.', rarity: 'Epic', isLocked: false, icon: '' },
  { id: '4', title: 'Legendary Status', description: 'Reach 1M users.', rarity: 'Legendary', isLocked: true, icon: '' },
  { id: '5', title: 'Code Master', description: 'Write 100k lines of clean code.', rarity: 'Epic', isLocked: true, icon: '' },
];

export const useGameStore = create<GameState>((set) => ({
  scene: 'intro',
  isLoaded: false,
  isMuted: false,
  introComplete: false,
  squad: MOCK_SQUAD,
  milestones: MOCK_MILESTONES,
  achievements: MOCK_ACHIEVEMENTS,
  setScene: (scene) => set({ scene }),
  setLoaded: (loaded) => set({ isLoaded: loaded }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setIntroComplete: (complete) => set({ introComplete: complete }),
  updateSquad: (squad) => set({ squad }),
  updatePlayer: (index, player) => set((state) => {
    const newSquad = [...state.squad];
    newSquad[index] = player;
    return { squad: newSquad };
  }),
}));
