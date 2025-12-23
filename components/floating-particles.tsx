"use client";

import { useState, useEffect } from "react";

interface Particle {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
}

export default function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Generate particles only on client to avoid hydration mismatch
    const generated = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
    }));
    setParticles(generated);
    setMounted(true);
  }, []);

  // Don't render particles until mounted on client
  if (!mounted) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Ambient orbs render immediately */}
        <div
          className="absolute w-96 h-96 rounded-full bg-accent/5 blur-3xl animate-pulse-slow"
          style={{ left: "10%", top: "20%" }}
        />
        <div
          className="absolute w-64 h-64 rounded-full bg-accent/5 blur-3xl animate-pulse-slow"
          style={{ right: "15%", bottom: "30%", animationDelay: "2s" }}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Floating particles using CSS animations */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-accent/20 animate-float"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}

      {/* Larger ambient orbs */}
      <div
        className="absolute w-96 h-96 rounded-full bg-accent/5 blur-3xl animate-pulse-slow"
        style={{ left: "10%", top: "20%" }}
      />
      <div
        className="absolute w-64 h-64 rounded-full bg-accent/5 blur-3xl animate-pulse-slow"
        style={{ right: "15%", bottom: "30%", animationDelay: "2s" }}
      />
    </div>
  );
}
