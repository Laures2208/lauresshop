import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

const NUM_PARTICLES = 40;

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export const BackgroundParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: NUM_PARTICLES }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden mix-blend-screen opacity-50">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-red-500 shadow-[0_0_10px_2px_rgba(220,38,38,0.6)]"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.x}vw`,
            top: `${p.y}vh`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};
