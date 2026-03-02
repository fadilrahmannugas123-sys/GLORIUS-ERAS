import { motion } from 'motion/react';
import { Trophy, Lock } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  isLocked: boolean;
  icon: string;
}

export function AchievementGrid({ achievements }: { achievements: Achievement[] }) {
  const rarityStyles = {
    Common: 'border-gray-500 text-gray-400',
    Rare: 'border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]',
    Epic: 'border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]',
    Legendary: 'border-yellow-500 text-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.6)]',
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-8">
      {achievements.map((achievement) => (
        <motion.div
          key={achievement.id}
          whileHover={!achievement.isLocked ? { scale: 1.05, y: -5 } : {}}
          className={`relative aspect-square rounded-xl border-2 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center transition-all duration-300 ${
            achievement.isLocked ? 'grayscale opacity-50 border-white/10' : rarityStyles[achievement.rarity]
          }`}
        >
          {achievement.isLocked ? (
            <Lock className="w-12 h-12 mb-2" />
          ) : (
            <div className="relative">
              <Trophy className="w-12 h-12 mb-2" />
              <div className="absolute inset-0 animate-ping opacity-20">
                <Trophy className="w-12 h-12" />
              </div>
            </div>
          )}
          <h4 className="text-xs font-bold uppercase tracking-tighter">{achievement.title}</h4>
          {!achievement.isLocked && (
            <div className="absolute top-2 right-2">
              <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
