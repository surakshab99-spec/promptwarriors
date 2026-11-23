import React, { useEffect, useRef, useState } from 'react';
import Spline from '@splinetool/react-spline';
import * as THREE from 'three';

interface SplineBlobProps {
  splineUrl?: string;
  className?: string;
  isMini?: boolean;
}

export const SplineBlob: React.FC<SplineBlobProps> = ({ splineUrl, className = '', isMini = false }) => {
  const [loadError, setLoadError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fallback Three.js interactive metallic liquid blob
  useEffect(() => {
    if (splineUrl && !loadError) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = isMini ? 3.5 : 5.5;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lighting (Three-point studio lighting with electric-blue & silver reflections)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xe0f2fe, 3.5); // electric blue reflection
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x94a3b8, 2.0); // metallic silver fill
    dirLight2.position.set(-5, -5, -2);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x38bdf8, 4, 10);
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);

    // Organic blob geometry with high vertex count for smooth deformation
    const geometry = new THREE.SphereGeometry(isMini ? 1.2 : 2.2, 64, 64);
    const positionAttribute = geometry.attributes.position;
    const initialPositions = positionAttribute.array.slice();

    const material = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      metalness: 0.85,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
      transmission: 0.1,
      ior: 1.5,
    });

    const blobMesh = new THREE.Mesh(geometry, material);
    scene.add(blobMesh);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      targetX = x;
      targetY = y;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse damping
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      blobMesh.rotation.y = elapsedTime * 0.2 + mouseX * 0.6;
      blobMesh.rotation.x = elapsedTime * 0.15 + mouseY * 0.6;

      // Deform geometry vertices organically based on sine waves and mouse interaction
      const positions = positionAttribute.array;
      for (let i = 0; i < positionAttribute.count; i++) {
        const ix = i * 3;
        const iy = i * 3 + 1;
        const iz = i * 3 + 2;

        const ox = initialPositions[ix];
        const oy = initialPositions[iy];
        const oz = initialPositions[iz];

        // Calculate vector length from origin
        const length = Math.sqrt(ox * ox + oy * oy + oz * oz);
        const nx = ox / length;
        const ny = oy / length;
        const nz = oz / length;

        // Organic wave deformation + cursor magnetic response
        const wave = Math.sin(elapsedTime * 2.5 + ny * 4.0 + mouseX * 3.0) * 0.15
                   + Math.cos(elapsedTime * 1.8 + nx * 4.0 - mouseY * 3.0) * 0.12;

        positions[ix] = ox + nx * wave;
        positions[iy] = oy + ny * wave;
        positions[iz] = oz + nz * wave;
      }
      positionAttribute.needsUpdate = true;
      geometry.computeVertexNormals();

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, [splineUrl, loadError, isMini]);

  return (
    <div ref={containerRef} className={`relative w-full h-full overflow-hidden ${className}`}>
      {splineUrl && !loadError ? (
        <Spline 
          scene={splineUrl} 
          onError={() => setLoadError(true)}
          className="w-full h-full"
        />
      ) : (
        <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />
      )}
      
      {/* Subtle ambient electric-blue glow overlay */}
      <div className="absolute inset-0 pointer-events-none bg-radial from-cyan-500/5 via-transparent to-transparent opacity-60" />
    </div>
  );
};
