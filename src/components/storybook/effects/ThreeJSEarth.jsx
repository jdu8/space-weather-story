import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import './ThreeJSEarth.css';

/**
 * Three.js Earth component with realistic texture
 * Based on CodePen example with proper Earth texture
 * @param {Object} props
 * @param {number} props.width - Canvas width in pixels (default: 400)
 * @param {number} props.height - Canvas height in pixels (default: 400)
 * @param {string} props.position - CSS position style (default: 'absolute')
 * @param {string} props.top - CSS top position
 * @param {string} props.left - CSS left position
 * @param {string} props.right - CSS right position
 * @param {string} props.bottom - CSS bottom position
 * @param {number} props.opacity - Opacity 0-1 (default: 1)
 * @param {number} props.rotationSpeed - Rotation speed (default: 0.005)
 * @param {string} props.className - Additional CSS classes
 */
export default function ThreeJSEarth({
  width = 400,
  height = 400,
  position = 'absolute',
  top,
  left,
  right,
  bottom,
  opacity = 1,
  rotationSpeed = 0.005,
  className = ''
}) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const meshRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    containerRef.current.appendChild(canvas);

    // Initialize Three.js
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    rendererRef.current = renderer;

    const camera = new THREE.PerspectiveCamera(70, width / height, 1, 100);
    camera.position.z = 25;
    cameraRef.current = camera;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create Earth sphere
    const geometry = new THREE.SphereGeometry(10, 64, 64);
    const material = new THREE.MeshPhongMaterial();

    // Load Earth texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('');
    material.map = textureLoader.load(
      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1206469/earthmap1k.jpg',
      () => {
        // Texture loaded successfully
        renderer.render(scene, camera);
      }
    );

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = 0.5; // Tilt the Earth
    scene.add(mesh);
    meshRef.current = mesh;

    // Add ambient light
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    // Add directional light for better shading
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Animation loop
    function animate() {
      if (!meshRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) {
        return;
      }

      meshRef.current.rotation.y += rotationSpeed;
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      animationIdRef.current = requestAnimationFrame(animate);
    }

    animate();

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (meshRef.current) {
        meshRef.current.geometry.dispose();
        meshRef.current.material.dispose();
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (containerRef.current && canvas.parentNode) {
        containerRef.current.removeChild(canvas);
      }
    };
  }, [width, height, rotationSpeed]);

  // Update opacity
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.opacity = opacity;
    }
  }, [opacity]);

  const containerStyle = {
    position,
    top,
    left,
    right,
    bottom,
    width: `${width}px`,
    height: `${height}px`,
    pointerEvents: 'none',
    zIndex: 1,
  };

  return (
    <div
      ref={containerRef}
      className={`threejs-earth-container ${className}`}
      style={containerStyle}
    />
  );
}
