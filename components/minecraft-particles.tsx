"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  type: "rune" | "xp" | "diamond" | "sparkle";
  symbol?: string;
  color: string;
  rotation: number;
  rotationSpeed: number;
  life: number;
  maxLife: number;
}

// Minecraft Enchanting Table Galactic Alphabet Glyphs
const RUNES = ["ᔑ", "ʖ", "ᓵ", "↸", "ᒷ", "⎓", "⊣", "⍑", "╎", "⋮", "ꖌ", "ꖎ", "ᒲ", "リ", "𝙹", "¡", "ᑑ", "∷", "ᓭ", "ℸ", "⚍", "⍊", "∴", "·", "||", "⨅", "◊", "✦", "❖"];

export function MinecraftParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const particles: Particle[] = [];
    const MAX_PARTICLES = 28;

    const createParticle = (initialY?: number): Particle => {
      const randType = Math.random();
      let type: Particle["type"] = "rune";
      let color = "#a855f7";

      if (randType < 0.45) {
        type = "rune";
        color = Math.random() > 0.4 ? "rgba(168, 85, 247, 0.6)" : "rgba(6, 182, 212, 0.6)";
      } else if (randType < 0.75) {
        type = "xp";
        color = "rgba(52, 211, 153, 0.65)";
      } else if (randType < 0.9) {
        type = "diamond";
        color = "rgba(0, 240, 255, 0.6)";
      } else {
        type = "sparkle";
        color = "rgba(251, 191, 36, 0.6)";
      }

      return {
        x: Math.random() * width,
        y: initialY !== undefined ? initialY : height + 20 + Math.random() * 40,
        size: type === "rune" ? 12 + Math.random() * 5 : type === "xp" ? 5 + Math.random() * 3 : 3 + Math.random() * 3,
        speedY: -(0.3 + Math.random() * 0.5),
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: 0.12 + Math.random() * 0.4,
        type,
        symbol: RUNES[Math.floor(Math.random() * RUNES.length)],
        color,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        life: 0,
        maxLife: 350 + Math.random() * 350,
      };
    };

    // Initialize particles across screen
    for (let i = 0; i < MAX_PARTICLES; i++) {
      particles.push(createParticle(Math.random() * height));
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.life * 0.02) * 0.2;
        p.rotation += p.rotationSpeed;
        p.life++;

        let currentOpacity = p.opacity;
        if (p.life < 40) {
          currentOpacity = (p.life / 40) * p.opacity;
        } else if (p.life > p.maxLife - 50) {
          currentOpacity = ((p.maxLife - p.life) / 50) * p.opacity;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, Math.min(1, currentOpacity));

        if (p.type === "rune" && p.symbol) {
          ctx.font = `bold ${p.size}px monospace`;
          ctx.fillStyle = p.color;
          ctx.fillText(p.symbol, -p.size / 2, p.size / 2);
        } else if (p.type === "xp") {
          const gradient = ctx.createRadialGradient(0, 0, 1, 0, 0, p.size);
          gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
          gradient.addColorStop(0.4, "rgba(74, 222, 128, 0.7)");
          gradient.addColorStop(1, "rgba(5, 150, 105, 0)");

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === "diamond") {
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        if (p.y < -30 || p.life >= p.maxLife || p.x < -20 || p.x > width + 20) {
          particles[i] = createParticle();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-40 transition-opacity duration-1000"
      aria-hidden="true"
    />
  );
}
