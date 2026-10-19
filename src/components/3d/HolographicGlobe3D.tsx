'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface HolographicGlobeProps {
  className?: string;
  interactive?: boolean;
}

export default function HolographicGlobe3D({ className = '', interactive = true }: HolographicGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    const container = containerRef.current;
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for all rotating elements
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Inner Core Sphere
    const coreGeometry = new THREE.SphereGeometry(68, 36, 36);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x050c18,
      wireframe: false,
      transparent: true,
      opacity: 0.85,
    });
    const coreSphere = new THREE.Mesh(coreGeometry, coreMaterial);
    globeGroup.add(coreSphere);

    // 2. Wireframe Holographic Outer Sphere
    const wireframeGeometry = new THREE.SphereGeometry(70, 28, 28);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const wireframeGlobe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    globeGroup.add(wireframeGlobe);

    // 3. Floating 3D Star & Data Particle Field
    const particleCount = 750;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cyanColor = new THREE.Color(0x00f2fe);
    const violetColor = new THREE.Color(0xa855f7);
    const whiteColor = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      const r = 85 + Math.random() * 65;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = r * Math.cos(phi);

      const chosenColor = Math.random() > 0.4 ? cyanColor : Math.random() > 0.5 ? violetColor : whiteColor;
      particleColors[i * 3] = chosenColor.r;
      particleColors[i * 3 + 1] = chosenColor.g;
      particleColors[i * 3 + 2] = chosenColor.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    globeGroup.add(particles);

    // 4. Orbital Ring
    const ringGeometry = new THREE.RingGeometry(82, 83.5, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const orbitalRing = new THREE.Mesh(ringGeometry, ringMaterial);
    orbitalRing.rotation.x = Math.PI / 2.3;
    globeGroup.add(orbitalRing);

    // Second inclined ring
    const ring2Geometry = new THREE.RingGeometry(90, 91.2, 64);
    const ring2Material = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3,
    });
    const orbitalRing2 = new THREE.Mesh(ring2Geometry, ring2Material);
    orbitalRing2.rotation.x = -Math.PI / 3;
    orbitalRing2.rotation.y = Math.PI / 6;
    globeGroup.add(orbitalRing2);

    // 5. Verification Nodes (Lat/Long positions on the globe)
    const nodeCoords = [
      { lat: 46.2, lon: 6.1, name: 'Geneva (WHO)' },
      { lat: 38.9, lon: -77.0, name: 'Washington (NASA/FDA)' },
      { lat: 51.5, lon: -0.1, name: 'London (Reuters)' },
      { lat: 35.6, lon: 139.6, name: 'Tokyo' },
      { lat: -33.8, lon: 151.2, name: 'Sydney' },
      { lat: 28.6, lon: 77.2, name: 'New Delhi' },
    ];

    const nodesGroup = new THREE.Group();
    const nodePositions: THREE.Vector3[] = [];

    nodeCoords.forEach((coord, i) => {
      const phi = (90 - coord.lat) * (Math.PI / 180);
      const theta = (coord.lon + 180) * (Math.PI / 180);
      const radius = 70.5;

      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);

      const v = new THREE.Vector3(x, y, z);
      nodePositions.push(v);

      const nodeGeom = new THREE.SphereGeometry(1.6, 12, 12);
      const nodeMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x00f2fe : 0x10b981,
      });
      const nodeMesh = new THREE.Mesh(nodeGeom, nodeMat);
      nodeMesh.position.copy(v);
      nodesGroup.add(nodeMesh);

      // Node ring pulse
      const haloGeom = new THREE.RingGeometry(2.5, 3.2, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x00f2fe : 0x10b981,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const haloMesh = new THREE.Mesh(haloGeom, haloMat);
      haloMesh.position.copy(v);
      haloMesh.lookAt(0, 0, 0);
      nodesGroup.add(haloMesh);
    });

    globeGroup.add(nodesGroup);

    // 6. Arcs connecting nodes
    for (let i = 0; i < nodePositions.length - 1; i++) {
      const start = nodePositions[i];
      const end = nodePositions[i + 1];

      // Midpoint elevated above sphere
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      const distance = start.distanceTo(end);
      mid.setLength(70.5 + distance * 0.25);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(24);
      const arcGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const arcMaterial = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.45,
      });
      const arc = new THREE.Line(arcGeometry, arcMaterial);
      globeGroup.add(arc);
    }

    // Interactive mouse rotation
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);

      if (isDragging) {
        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;
        globeGroup.rotation.y += deltaX * 0.005;
        globeGroup.rotation.x += deltaY * 0.005;
        previousMousePosition = { x: event.clientX, y: event.clientY };
      } else {
        targetRotationY = mouseX * 0.4;
        targetRotationX = -mouseY * 0.3;
      }
    };

    const handleMouseDown = (event: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    if (interactive) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
    }

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Ambient globe spin
      globeGroup.rotation.y += 0.0025;

      // Mouse influence easing
      if (!isDragging) {
        globeGroup.rotation.y += (targetRotationY - globeGroup.rotation.y * 0.1) * 0.02;
        globeGroup.rotation.x += (targetRotationX - globeGroup.rotation.x * 0.1) * 0.02;
      }

      // Orbital rings opposite tilt spin
      orbitalRing.rotation.z = elapsedTime * 0.08;
      orbitalRing2.rotation.z = -elapsedTime * 0.05;

      // Subtle particle breathing
      particles.rotation.y = -elapsedTime * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
      }
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [interactive]);

  if (!webGlSupported) {
    // Beautiful CSS animated fallback for non-WebGL devices
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <div className="relative w-72 h-72 rounded-full border border-neon-cyan/40 bg-gradient-to-tr from-cyber-900 to-cyber-800 shadow-neon-cyan flex items-center justify-center">
          <div className="absolute inset-4 rounded-full border border-dashed border-neon-violet/50 animate-spin" style={{ animationDuration: '20s' }}></div>
          <div className="absolute inset-10 rounded-full border border-neon-blue/40 animate-pulse"></div>
          <div className="absolute w-full h-[1px] bg-neon-cyan/60 top-1/2 left-0 -translate-y-1/2"></div>
          <div className="absolute h-full w-[1px] bg-neon-cyan/60 top-0 left-1/2 -translate-x-1/2"></div>
          <div className="w-8 h-8 rounded-full bg-neon-cyan/30 border border-neon-cyan animate-ping"></div>
          <span className="relative z-10 text-xs font-mono tracking-widest text-neon-cyan uppercase">Global Node HUD</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[380px] cursor-grab active:cursor-grabbing select-none ${className}`}
      title="Click and drag to rotate the verification globe"
    />
  );
}
