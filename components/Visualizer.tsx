
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { sampleText, generateOrbPositions } from '../services/textSampler';
import { AppSettings, GestureData } from '../types';

interface VisualizerProps {
  text: string;
  settings: AppSettings;
  gestureData: GestureData;
  isCinematic: boolean;
  onCinematicComplete: () => void;
}

const Visualizer: React.FC<VisualizerProps> = ({ text, settings, gestureData, isCinematic, onCinematicComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  
  const targetsRef = useRef<THREE.Vector3[]>([]);
  const velocitiesRef = useRef<THREE.Vector3[]>([]);
  const baseOrbPositionsRef = useRef<THREE.Vector3[]>([]);
  const currentModeRef = useRef<'Orb' | 'Text'>('Orb');
  const clockRef = useRef(new THREE.Clock());
  
  const settingsRef = useRef(settings);
  const gestureDataRef = useRef(gestureData);

  useEffect(() => { settingsRef.current = settings; }, [settings]);
  useEffect(() => { gestureDataRef.current = gestureData; }, [gestureData]);

  useEffect(() => {
    if (!containerRef.current) return;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);
    camera.position.z = 80;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const count = settings.particleCount;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const orbPos = generateOrbPositions(count, 22);
    baseOrbPositionsRef.current = orbPos;
    targetsRef.current = orbPos.map(v => v.clone());
    const vels: THREE.Vector3[] = Array.from({ length: count }, () => new THREE.Vector3());

    for (let i = 0; i < count; i++) {
      const p = orbPos[i];
      positions[i * 3] = p.x + (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = p.y + (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = p.z + (Math.random() - 0.5) * 60;
      colors[i * 3] = 0.0; colors[i * 3 + 1] = 0.8; colors[i * 3 + 2] = 1.0;
      sizes[i] = Math.random() * 3 + 1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({ size: 0.7, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, opacity: 0.9 });
    const points = new THREE.Points(geometry, material);
    scene.add(points);
    particlesRef.current = points;
    velocitiesRef.current = vels;

    const animate = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !particlesRef.current) return;
      
      const time = clockRef.current.getElapsedTime();
      const s = settingsRef.current;
      const g = gestureDataRef.current;
      const posAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const colorAttr = particlesRef.current.geometry.attributes.color as THREE.BufferAttribute;
      const positionsArr = posAttr.array as Float32Array;
      const colorsArr = colorAttr.array as Float32Array;

      let targetZ = 80;
      if (g.gesture === 'Pinch') targetZ = 20 + g.pinchDistance * 180;
      cameraRef.current.position.z += (targetZ - cameraRef.current.position.z) * 0.05;
      cameraRef.current.position.x += ((g.center.x - 0.5) * 80 - cameraRef.current.position.x) * 0.05;
      cameraRef.current.position.y += ((0.5 - g.center.y) * 80 - cameraRef.current.position.y) * 0.05;
      cameraRef.current.lookAt(0, 0, 0);

      let damping = 0.85, steering = 0.08 * s.sensitivity, jitter = 0.0, rotSpd = time * 0.15;
      
      if (s.mode === 'Energy') { damping = 0.92; steering = 0.14; jitter = 0.6; }
      else if (s.mode === 'Matrix') { damping = 0.75; steering = 0.22; rotSpd = Math.floor(time * 8) / 16; }
      else if (s.mode === 'Stellar') { damping = 0.94; steering = 0.03; rotSpd *= 0.25; }

      const breath = Math.sin(time * 1.2) * 1.5;
      const isRepelling = g.gesture === 'OpenPalm';
      const isAttracting = g.gesture === 'Fist';

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const cur = new THREE.Vector3(positionsArr[i3], positionsArr[i3 + 1], positionsArr[i3 + 2]);
        const vel = velocitiesRef.current[i];
        let target = targetsRef.current[i].clone();

        if (currentModeRef.current === 'Orb') {
          const rY = new THREE.Matrix4().makeRotationY(rotSpd + (i * 0.00015));
          const rX = new THREE.Matrix4().makeRotationX(rotSpd * 0.5);
          target.applyMatrix4(rY).applyMatrix4(rX).multiplyScalar(1 + (breath / 35));
          if (s.mode !== 'Matrix') {
            target.x += Math.sin(time * 0.6 + i * 0.012) * 0.8;
            target.y += Math.cos(time * 0.8 + i * 0.018) * 0.8;
          }
        }

        if (isRepelling) target.add(cur.clone().normalize().multiplyScalar(30));
        else if (isAttracting) target.multiplyScalar(0.4);

        if (jitter > 0) target.add(new THREE.Vector3((Math.random()-0.5)*jitter, (Math.random()-0.5)*jitter, (Math.random()-0.5)*jitter));

        vel.add(target.sub(cur).multiplyScalar(steering)).multiplyScalar(damping);
        cur.add(vel);

        positionsArr[i3] = cur.x; positionsArr[i3+1] = cur.y; positionsArr[i3+2] = cur.z;

        const spd = vel.length();
        if (s.mode === 'Matrix') { colorsArr[i3]=0; colorsArr[i3+1]=Math.min(1, 0.4 + spd*0.9); colorsArr[i3+2]=spd*0.1; }
        else if (s.mode === 'Energy') { colorsArr[i3]=Math.min(1, 0.8 + spd); colorsArr[i3+1]=0.2 + spd*0.5; colorsArr[i3+2]=0; }
        else { colorsArr[i3]=spd*0.12; colorsArr[i3+1]=0.6+spd*0.3; colorsArr[i3+2]=0.8+spd*0.3; }
      }

      posAttr.needsUpdate = true;
      colorAttr.needsUpdate = true;
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
    return () => {
      renderer.dispose();
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, []);

  useEffect(() => {
    if (text && text.trim().length > 0 && text !== 'INITIALIZE SEQUENCE...') {
      currentModeRef.current = 'Text';
      targetsRef.current = sampleText(text, settings.particleCount);
    } else {
      currentModeRef.current = 'Orb';
      targetsRef.current = baseOrbPositionsRef.current.map(v => v.clone());
    }
  }, [text, settings.particleCount, settings.mode]);

  useEffect(() => {
    if (isCinematic) {
      const timer = setTimeout(() => onCinematicComplete(), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCinematic, onCinematicComplete]);

  return <div ref={containerRef} className="fixed inset-0 z-0 bg-black" />;
};

export default Visualizer;
