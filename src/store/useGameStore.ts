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
  education: string;
  achievements: string[]; // Array of achievement IDs
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
  scene: 'intro' | 'menu' | 'squad' | 'achievements' | 'admin';
  isLoaded: boolean;
  introComplete: boolean;
  squad: Player[];
  achievements: Achievement[];
  collagePhotos: string[];
  isSaving: boolean;
  setScene: (scene: GameState['scene']) => void;
  setLoaded: (loaded: boolean) => void;
  setIntroComplete: (complete: boolean) => void;
  setSaving: (isSaving: boolean) => void;
  updateSquad: (squad: Player[]) => void;
  updatePlayer: (index: number, player: Player) => void;
  updateAchievements: (achievements: Achievement[]) => void;
  updateCollagePhotos: (photos: string[]) => void;
}

const MOCK_SQUAD: Player[] = [
  {
    id: 'p1',
    name: 'ISA MUHAMMAD',
    role: 'Industrial Systems Expert',
    position: 'CM',
    rating: 92,
    rarity: 'Legendary',
    stats: { creativity: 88, technical: 94, leadership: 96, strategy: 98 },
    image: 'https://picsum.photos/seed/isa/400/600',
    education: 'Institut Teknologi Bandung (ITB) - Teknik Industri',
    bio: 'Sebagai mahasiswa Teknik Industri di ITB, Isa Muhammad mengkhususkan diri dalam perancangan, perbaikan, dan instalasi sistem terintegrasi. Fokus utamanya adalah pada optimasi rantai pasok global dan implementasi Lean Manufacturing untuk efisiensi maksimal. Dengan pemahaman mendalam tentang manajemen kualitas total, Isa mampu mensimulasikan sistem industri yang kompleks untuk menghasilkan keputusan strategis yang presisi dan berdampak luas pada produktivitas operasional.',
    achievements: ['a1', 'a2', 'a3']
  },
  {
    id: 'p2',
    name: 'FADIL RAHMAN',
    role: 'Geophysical Strategist',
    position: 'ST',
    rating: 94,
    rarity: 'Legendary',
    stats: { creativity: 95, technical: 92, leadership: 98, strategy: 94 },
    image: 'https://picsum.photos/seed/fadil/400/600',
    education: 'Institut Teknologi Bandung (ITB) - Teknik Geofisika',
    bio: 'Fadil Rahman adalah pakar dalam eksplorasi sumber daya bumi melalui pendekatan fisika dan komputasi di ITB. Keahliannya mencakup pemrosesan data seismik refleksi tingkat lanjut dan pemodelan inversi untuk memetakan struktur bawah permukaan bumi. Ia berdedikasi dalam mengoptimalkan eksplorasi hidrokarbon dan energi panas bumi, menggabungkan analisis data geofisika yang ketat dengan visi strategis untuk mengamankan kedaulatan energi masa depan.',
    achievements: ['a4', 'a5', 'a6']
  },
  {
    id: 'p3',
    name: 'MASAGUS',
    role: 'Environmental Architect',
    position: 'CB',
    rating: 90,
    rarity: 'Master',
    stats: { creativity: 85, technical: 92, leadership: 88, strategy: 95 },
    image: 'https://picsum.photos/seed/masagus/400/600',
    education: 'Universitas Indonesia (UI) - Teknik Lingkungan',
    bio: 'Berbasis di Universitas Indonesia, Masagus memfokuskan studinya pada perlindungan lingkungan dan kesehatan masyarakat melalui inovasi teknik. Ia ahli dalam perancangan infrastruktur hijau dan sistem pengolahan air limbah yang berkelanjutan. Risetnya tentang teknologi membran dan ekonomi sirkular bertujuan untuk menciptakan solusi nyata bagi tantangan perubahan iklim, memastikan bahwa setiap kemajuan industri berjalan selaras dengan kelestarian ekosistem global.',
    achievements: ['a7', 'a8', 'a9']
  },
  {
    id: 'p4',
    name: 'FARID',
    role: 'Electrical Innovator',
    position: 'RW',
    rating: 91,
    rarity: 'Master',
    stats: { creativity: 96, technical: 90, leadership: 82, strategy: 88 },
    image: 'https://picsum.photos/seed/farid/400/600',
    education: 'University of Malaya (UM) - Teknik Elektro',
    bio: 'Farid adalah inovator sistem tenaga listrik dari University of Malaya yang berfokus pada masa depan energi cerdas. Keahliannya dalam perancangan Smart Grid dan sistem kontrol berbasis AI memungkinkannya untuk mengintegrasikan energi terbarukan secara efisien ke dalam jaringan listrik nasional. Dengan visi untuk mendukung revolusi industri 4.0, Farid terus mengembangkan solusi kelistrikan yang andal, terjangkau, dan ramah lingkungan bagi masyarakat luas.',
    achievements: ['a10', 'a11', 'a12']
  }
];

const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', title: 'Optimization King', description: 'Berhasil mereduksi biaya operasional sebesar 40% melalui desain ulang proses bisnis.', rarity: 'Legendary', isLocked: false, icon: 'Zap' },
  { id: 'a2', title: 'Supply Chain Architect', description: 'Merancang sistem logistik terintegrasi untuk distribusi energi di wilayah terpencil.', rarity: 'Epic', isLocked: false, icon: 'Globe' },
  { id: 'a3', title: 'Lean Six Sigma Master', description: 'Sertifikasi tingkat lanjut dalam metodologi perbaikan proses berkelanjutan.', rarity: 'Rare', isLocked: false, icon: 'Award' },
  { id: 'a4', title: 'Seismic Master', description: 'Sukses memetakan struktur bawah permukaan yang kompleks pada kedalaman lebih dari 5km.', rarity: 'Legendary', isLocked: false, icon: 'Waves' },
  { id: 'a5', title: 'Geothermal Pioneer', description: 'Mengembangkan algoritma baru untuk deteksi dini reservoir panas bumi.', rarity: 'Epic', isLocked: false, icon: 'Flame' },
  { id: 'a6', title: 'Data Inversion Expert', description: 'Memenangkan kompetisi internasional dalam pemodelan data gravitasi dan magnetik.', rarity: 'Rare', isLocked: false, icon: 'Database' },
  { id: 'a7', title: 'Eco Warrior', description: 'Mengimplementasikan sistem zero-waste pada kompleks industri manufaktur skala besar.', rarity: 'Legendary', isLocked: false, icon: 'Leaf' },
  { id: 'a8', title: 'Water Purifier', description: 'Mendesain sistem filtrasi air portabel yang digunakan di daerah pasca bencana.', rarity: 'Epic', isLocked: false, icon: 'Droplets' },
  { id: 'a9', title: 'Sustainability Leader', description: 'Menjadi konsultan muda dalam penyusunan laporan keberlanjutan (ESG) perusahaan multinasional.', rarity: 'Rare', isLocked: false, icon: 'ShieldCheck' },
  { id: 'a10', title: 'Circuit Wizard', description: 'Merancang sistem distribusi daya dengan efisiensi tinggi yang mengurangi kehilangan energi hingga 15%.', rarity: 'Legendary', isLocked: false, icon: 'Cpu' },
  { id: 'a11', title: 'Smart Grid Innovator', description: 'Mengembangkan sistem manajemen energi berbasis IoT untuk gedung perkantoran modern.', rarity: 'Epic', isLocked: false, icon: 'Lightbulb' },
  { id: 'a12', title: 'Robotics Finalist', description: 'Memimpin tim dalam kompetisi robotika internasional dengan fokus pada sistem navigasi otonom.', rarity: 'Rare', isLocked: false, icon: 'Bot' },
];

export const useGameStore = create<GameState>((set) => ({
  scene: 'intro',
  isLoaded: false,
  introComplete: false,
  squad: MOCK_SQUAD,
  achievements: MOCK_ACHIEVEMENTS,
  collagePhotos: [
    'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1580136579312-94651dfd596d?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1576448046340-040998abc396?q=80&w=800&auto=format&fit=crop',
  ],
  isSaving: false,
  setScene: (scene) => set({ scene }),
  setLoaded: (loaded) => set({ isLoaded: loaded }),
  setIntroComplete: (complete) => set({ introComplete: complete }),
  setSaving: (isSaving) => set({ isSaving }),
  updateSquad: (squad) => set({ squad }),
  updatePlayer: (index, player) => set((state) => {
    const newSquad = [...state.squad];
    newSquad[index] = player;
    return { squad: newSquad };
  }),
  updateAchievements: (achievements) => set({ achievements }),
  updateCollagePhotos: (photos) => set({ collagePhotos: photos }),
}));
