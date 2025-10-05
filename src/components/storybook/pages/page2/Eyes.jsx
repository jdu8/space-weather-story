import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';

export default function Eyes({ radius, animationProgress, mousePos = { x: 0, y: 0 } }) {
  const leftEyeRef = useRef();
  const rightEyeRef = useRef();
  const [isBlinking, setIsBlinking] = useState(false);

  // Random blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  useFrame(() => {
    // Eyes follow mouse cursor
    if (leftEyeRef.current && rightEyeRef.current) {
      const followStrength = 0.15;
      const targetX = mousePos.x * followStrength;
      const targetY = mousePos.y * followStrength;

      // Left eye
      leftEyeRef.current.position.x = -0.3 + targetX * 0.1;
      leftEyeRef.current.position.y = 0.2 + targetY * 0.1;

      // Right eye
      rightEyeRef.current.position.x = 0.3 + targetX * 0.1;
      rightEyeRef.current.position.y = 0.2 + targetY * 0.1;

      // Blink effect
      const blinkScale = isBlinking ? 0.1 : 1.0;
      leftEyeRef.current.scale.y = blinkScale;
      rightEyeRef.current.scale.y = blinkScale;
    }
  });

  // Eyes open animation
  const eyeScale = Math.min((animationProgress - 0.5) * 3, 1);

  return (
    <group>
      {/* Left eye */}
      <Sphere
        ref={leftEyeRef}
        args={[0.15, 16, 16]}
        position={[-0.3, 0.2, radius * 0.95]}
        scale={[1, eyeScale, 1]}
      >
        <meshBasicMaterial color="#ffffff" />
      </Sphere>

      {/* Left eye glow */}
      <Sphere
        args={[0.18, 16, 16]}
        position={[-0.3, 0.2, radius * 0.94]}
        scale={[1, eyeScale, 1]}
      >
        <meshBasicMaterial
          color="#ffee99"
          transparent
          opacity={0.4}
        />
      </Sphere>

      {/* Right eye */}
      <Sphere
        ref={rightEyeRef}
        args={[0.15, 16, 16]}
        position={[0.3, 0.2, radius * 0.95]}
        scale={[1, eyeScale, 1]}
      >
        <meshBasicMaterial color="#ffffff" />
      </Sphere>

      {/* Right eye glow */}
      <Sphere
        args={[0.18, 16, 16]}
        position={[0.3, 0.2, radius * 0.94]}
        scale={[1, eyeScale, 1]}
      >
        <meshBasicMaterial
          color="#ffee99"
          transparent
          opacity={0.4}
        />
      </Sphere>
    </group>
  );
}
