import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGameStore } from '../store/useGameStore';
import { sounds } from '../lib/sounds';

export function IntroSequence() {
  const { setIntroComplete, setScene } = useGameStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIntroComplete(true);
        setScene('menu');
      }
    });

    // Start ambience
    sounds.ambience.play();

    tl.to(containerRef.current, { opacity: 1, duration: 2 })
      .fromTo(logoRef.current, 
        { scale: 0.8, opacity: 0, filter: 'blur(20px)' },
        { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 2, ease: 'power4.out' }
      )
      .to(logoRef.current, { 
        textShadow: '0 0 30px rgba(255, 215, 0, 0.8)', 
        duration: 1, 
        repeat: 1, 
        yoyo: true 
      })
      .to(containerRef.current, { opacity: 0, duration: 1.5, delay: 1 });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center opacity-0"
    >
      <div ref={logoRef} className="text-center">
        <h1 className="text-7xl font-black italic text-white tracking-tighter">
          GLORIOUS <span className="text-yellow-500">ERAS</span>
        </h1>
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-yellow-500 to-transparent mt-4" />
      </div>
    </div>
  );
}
