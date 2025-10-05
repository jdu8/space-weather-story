import { useEffect, useState } from 'react';
import Canvas3D from '../Canvas3D';
import ShaderAurora from '../effects/ShaderAurora';

// Page 7: Combined aurora with full-width people image
export default function Page7({ isInView }) {
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (!isInView) {
      setAnimationProgress(0);
      return;
    }

    const duration = 4000;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setAnimationProgress(progress);
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  }, [isInView]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      {isInView && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Canvas3D
            showStars={true}
            showControls={false}
            camera={{ position: [0, 0, 8], fov: 70 }}
          >
            {/* Copy of Page 6 aurora setup */}
            <ShaderAurora
              animationProgress={animationProgress}
              intensity={1.0}
              position={[0, 3.5, -5]}
              scale={[50, 15, 1]}
            />
            <ambientLight intensity={0.3} />
          </Canvas3D>
        </div>
      )}

      {/* People image overlay: full-width, maintain aspect, placed over aurora */}
      {isInView && (
        <img
          src="/sprites/059_people.png"
          alt="People watching the aurora"
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
            pointerEvents: 'none',
            zIndex: 1,
            display: 'block'
          }}
        />
      )}
    </div>
  );
}
