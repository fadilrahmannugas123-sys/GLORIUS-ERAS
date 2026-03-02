import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
  image: string;
}

export function EraTimeline({ milestones }: { milestones: Milestone[] }) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-12">
      <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2" />
      
      <div className="flex gap-24 overflow-x-auto no-scrollbar snap-x snap-center py-20 px-[25vw]">
        {milestones.map((milestone, index) => (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            className="relative flex-shrink-0 w-80 snap-center"
          >
            {/* Connector */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.8)] z-10" />
            
            <div className={`flex flex-col ${index % 2 === 0 ? 'mb-40' : 'mt-40'}`}>
              <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={milestone.image} 
                  alt={milestone.title}
                  className="w-full h-40 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="p-6">
                  <span className="text-yellow-500 font-black italic text-2xl">{milestone.year}</span>
                  <h3 className="text-white font-bold text-lg mt-1">{milestone.title}</h3>
                  <p className="text-white/60 text-sm mt-2 leading-relaxed">{milestone.description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex gap-4">
        <button className="p-4 rounded-full bg-black/40 border border-white/10 text-white hover:bg-white/10 transition-all">
          <ChevronLeft />
        </button>
        <button className="p-4 rounded-full bg-black/40 border border-white/10 text-white hover:bg-white/10 transition-all">
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
