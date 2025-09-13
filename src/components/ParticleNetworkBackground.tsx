import React, { useRef, useEffect } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const PARTICLE_COUNT = 60;
const PARTICLE_SIZE = 2;
const LINE_DISTANCE = 100;
const COLOR_LIGHT = "rgba(120, 200, 180, 0.7)"; // Calm teal/green for light
const COLOR_DARK = "rgba(80, 140, 200, 0.5)"; // Calm blue for dark

export const ParticleNetworkBackground: React.FC<{ darkMode?: boolean }> = ({ darkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

  const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }));

    function draw() {
      ctx.clearRect(0, 0, width, height);
      // Draw lines
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        for (let j = i + 1; j < PARTICLE_COUNT; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINE_DISTANCE) {
            ctx.strokeStyle = darkMode ? COLOR_DARK : COLOR_LIGHT;
            ctx.globalAlpha = 1 - dist / LINE_DISTANCE;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      // Draw particles
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        ctx.beginPath();
        ctx.arc(particles[i].x, particles[i].y, PARTICLE_SIZE, 0, 2 * Math.PI);
        ctx.fillStyle = darkMode ? COLOR_DARK : COLOR_LIGHT;
        ctx.shadowColor = darkMode ? COLOR_DARK : COLOR_LIGHT;
        ctx.shadowBlur = 4;
        ctx.fill();
      }
    }

    function update() {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles[i].x += particles[i].vx;
        particles[i].y += particles[i].vy;
        if (particles[i].x < 0 || particles[i].x > width) particles[i].vx *= -1;
        if (particles[i].y < 0 || particles[i].y > height) particles[i].vy *= -1;
      }
    }

    function animate() {
      update();
      draw();
      animationRef.current = requestAnimationFrame(animate);
    }
    animate();

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [darkMode]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        background: darkMode
          ? "linear-gradient(120deg, #0a1837 0%, #1a2747 100%)"
          : "linear-gradient(120deg, #eaf6ff 0%, #b3ffe0 100%)",
        transition: "background 0.5s"
      }}
    />
  );
};
