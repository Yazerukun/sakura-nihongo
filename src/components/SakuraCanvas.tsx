import React, { useEffect, useRef } from 'react';

interface SakuraCanvasProps {
  active: boolean;
}

export const SakuraCanvas: React.FC<SakuraCanvasProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const petalCount = Math.min(30, Math.floor(width / 35));
    const petals: Petal[] = [];

    class Petal {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height - height;
        this.size = Math.random() * 8 + 8; // 8-16px
        this.speedX = Math.random() * 1.5 - 0.5;
        this.speedY = Math.random() * 1.2 + 0.8;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 1.8;
        this.opacity = Math.random() * 0.4 + 0.35;
        // Soft pink hues
        const shades = [
          'rgba(255, 182, 193, ',
          'rgba(255, 192, 203, ',
          'rgba(251, 113, 133, ',
          'rgba(244, 114, 182, '
        ];
        this.color = shades[Math.floor(Math.random() * shades.length)];
      }

      update() {
        this.y += this.speedY;
        this.x += Math.sin(this.y * 0.01) + this.speedX;
        this.rotation += this.rotationSpeed;

        if (this.y > height + 20) {
          this.y = -20;
          this.x = Math.random() * width;
        }
        if (this.x > width + 20) {
          this.x = -20;
        } else if (this.x < -20) {
          this.x = width + 20;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.translate(this.x, this.y);
        c.rotate((this.rotation * Math.PI) / 180);
        c.fillStyle = `${this.color}${this.opacity})`;
        c.beginPath();
        // Petal shape curve
        c.moveTo(0, 0);
        c.bezierCurveTo(this.size / 2, -this.size / 2, this.size, 0, this.size / 2, this.size);
        c.bezierCurveTo(0, this.size, -this.size / 2, 0, 0, 0);
        c.fill();
        c.restore();
      }
    }

    for (let i = 0; i < petalCount; i++) {
      petals.push(new Petal());
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      petals.forEach((p) => {
        p.update();
        p.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 opacity-70 dark:opacity-40 transition-opacity duration-500"
    />
  );
};
