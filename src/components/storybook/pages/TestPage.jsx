import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import Canvas3D from '../Canvas3D';

function TestCube() {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#00ff88" />
    </mesh>
  );
}

export default function TestPage({ isInView }) {
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Canvas3D showStars={true} showControls={false}>
        <TestCube />
        <pointLight position={[10, 10, 10]} intensity={1} />
      </Canvas3D>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'white',
        fontSize: '24px',
        zIndex: 10,
        textAlign: 'center'
      }}>
        <p>Test Page</p>
        <p style={{ fontSize: '16px', marginTop: '10px' }}>
          You should see a rotating green cube and stars
        </p>
      </div>
    </div>
  );
}
