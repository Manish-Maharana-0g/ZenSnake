import React, { useRef, useEffect } from 'react';

const BackgroundSnake: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const numSegments = 12; // Keeping the same short length
    const segments: { x: number; y: number }[] = [];
    
    // Initial position
    for (let i = 0; i < numSegments; i++) {
      segments.push({ x: width * 0.2, y: height * 0.2 });
    }

    let time = 0;
    const speed = 2.2;
    const segmentSize = 42; // Increased from 32 to make it "a bit bigger" (thicker)
    const slitherFreq = 0.03;
    const slitherAmp = 1.2;
    const minDistanceRatio = 0.38; 

    // Helper to draw a rounded rect with wrap-around support
    const drawWrappedRect = (x: number, y: number, w: number, h: number, r: number) => {
      const draws = [
        { dx: 0, dy: 0 },
        { dx: width, dy: 0 },
        { dx: -width, dy: 0 },
        { dx: 0, dy: height },
        { dx: 0, dy: -height },
        { dx: width, dy: height },
        { dx: -width, dy: -height },
        { dx: width, dy: -height },
        { dx: -width, dy: height }
      ];

      for (const d of draws) {
        const tx = x + d.dx;
        const ty = y + d.dy;
        if (tx + w > 0 && tx < width && ty + h > 0 && ty < height) {
          ctx.beginPath();
          ctx.roundRect(tx, ty, w, h, r);
          ctx.fill();
        }
      }
    };

    const animate = () => {
      time += 1;
      
      const head = { ...segments[0] };
      head.x += speed;
      head.y += speed * 0.35 + Math.sin(time * slitherFreq) * slitherAmp;

      if (head.x > width) head.x -= width;
      else if (head.x < 0) head.x += width;
      if (head.y > height) head.y -= height;
      else if (head.y < 0) head.y += height;

      segments[0] = head;

      for (let i = 1; i < numSegments; i++) {
        let dx = segments[i - 1].x - segments[i].x;
        let dy = segments[i - 1].y - segments[i].y;

        if (dx > width / 2) dx -= width;
        else if (dx < -width / 2) dx += width;
        
        if (dy > height / 2) dy -= height;
        else if (dy < -height / 2) dy += height;

        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = segmentSize * minDistanceRatio;
        
        if (distance > minDistance) {
          const angle = Math.atan2(dy, dx);
          segments[i].x = segments[i - 1].x - Math.cos(angle) * minDistance;
          segments[i].y = segments[i - 1].y - Math.sin(angle) * minDistance;
          
          if (segments[i].x > width) segments[i].x -= width;
          else if (segments[i].x < 0) segments[i].x += width;
          if (segments[i].y > height) segments[i].y -= height;
          else if (segments[i].y < 0) segments[i].y += height;
        }
      }

      ctx.clearRect(0, 0, width, height);
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--m3-accent').trim() || '#D0BCFF';

      // Draw Body Segments
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = accent;
      for (let i = numSegments - 1; i > 0; i--) {
        const seg = segments[i];
        drawWrappedRect(seg.x - segmentSize / 2, seg.y - segmentSize / 2, segmentSize, segmentSize, 10);
      }

      // Draw Head
      const headSeg = segments[0];
      const prevSeg = segments[1];
      
      let adx = headSeg.x - prevSeg.x;
      let ady = headSeg.y - prevSeg.y;
      if (adx > width / 2) adx -= width;
      else if (adx < -width / 2) adx += width;
      if (ady > height / 2) ady -= height;
      else if (ady < -height / 2) ady += height;
      
      const angle = Math.atan2(ady, adx);

      const headDraws = [
        { dx: 0, dy: 0 },
        { dx: width, dy: 0 },
        { dx: -width, dy: 0 },
        { dx: 0, dy: height },
        { dx: 0, dy: -height }
      ];

      ctx.globalAlpha = 0.2;
      ctx.fillStyle = accent;
      
      for (const d of headDraws) {
        const tx = headSeg.x + d.dx;
        const ty = headSeg.y + d.dy;

        if (tx + segmentSize > 0 && tx - segmentSize < width && ty + segmentSize > 0 && ty - segmentSize < height) {
          ctx.save();
          ctx.translate(tx, ty);
          ctx.rotate(angle);
          
          ctx.beginPath();
          ctx.roundRect(-segmentSize/2, -segmentSize/2, segmentSize, segmentSize, 12);
          ctx.fill();

          // Eyes
          ctx.globalAlpha = 0.3;
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(segmentSize/4, -segmentSize/4, 5, 0, Math.PI * 2);
          ctx.arc(segmentSize/4, segmentSize/4, 5, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.arc(segmentSize/4 + 1.8, -segmentSize/4, 2.5, 0, Math.PI * 2);
          ctx.arc(segmentSize/4 + 1.8, segmentSize/4, 2.5, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.restore();
          ctx.globalAlpha = 0.2;
        }
      }

      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    const animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ filter: 'blur(5px)', opacity: 0.5 }}
    />
  );
};

export default BackgroundSnake;