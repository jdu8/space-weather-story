import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

export default function Canvas3D({
  children,
  camera = { position: [0, 0, 10], fov: 60 },
  showStars = true,
  showControls = false,
  ambient = 0.2,
  className = '',
}) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={camera}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Stars background */}
        {showStars && (
          <Stars
            radius={100}
            depth={50}
            count={3000}
            factor={4}
            saturation={0}
            fade
            speed={0.5}
          />
        )}

        {/* Lighting */}
        <ambientLight intensity={ambient} />

        {/* Scene content */}
        {children}

        {/* Optional controls */}
        {showControls && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={true}
            rotateSpeed={0.3}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
          />
        )}
      </Canvas>
    </div>
  );
}
