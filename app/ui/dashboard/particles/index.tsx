'use client';

import { useEffect, useRef } from 'react';

const Particles = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const NUM_PARTICLES = 200;
    const style = document.createElement('style');
    document.head.appendChild(style);

    for (let i = 1; i <= NUM_PARTICLES; i++) {
      const startX = (Math.random() * 100).toFixed(4);
      const midX = (Math.random() * 100).toFixed(4);
      const endX = (Math.random() * 100).toFixed(4);
      const midY = (Math.random() * 80 + 10).toFixed(3);
      const scale = (Math.random() * 0.9 + 0.1).toFixed(4);
      const opacity = (Math.random() * 0.8).toFixed(4);
      const duration = (Math.random() * 20 + 10).toFixed(2);
      const delay = (-Math.random() * 30).toFixed(2);
      const fallName = `fall-${i}`;
      const size = (Math.random() * 3).toFixed(2);

      style.sheet!.insertRule(`
        @keyframes ${fallName} {
          ${midY}% {
            transform: translate(${midX}vw, ${midY}vh) scale(${scale});
          }
          to {
            transform: translate(${endX}vw, 100vh) scale(${scale});
          }
        }
      `, style.sheet!.cssRules.length);

      const particle = document.createElement('div');
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.position = 'absolute';
      particle.style.top = '0';
      particle.style.background = 'white';
      particle.style.borderRadius = '50%';
      particle.style.pointerEvents = 'none';
      particle.style.opacity = opacity;
      particle.style.transform = `translate(${startX}vw, -10px) scale(${scale})`;
      particle.style.animation = `${fallName} ${duration}s ${delay}s linear infinite`;

      containerRef.current?.appendChild(particle);
    }

    return () => {
      containerRef.current?.replaceChildren();
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    />
  );
}

export default Particles;