
import * as THREE from 'three';

export function generateOrbPositions(count: number, radius: number = 20): THREE.Vector3[] {
  const positions: THREE.Vector3[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5)); 

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2; 
    const r = Math.sqrt(1 - y * y); 
    const theta = phi * i; 
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    positions.push(new THREE.Vector3(x * radius, y * radius, z * radius));
  }
  return positions;
}

export function sampleText(text: string, count: number, fontSize: number = 60): THREE.Vector3[] {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return [];

  const width = 1024;
  const height = 512;
  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = 'white';
  ctx.font = `bold ${fontSize}px Orbitron`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  ctx.fillText(text.toUpperCase(), width / 2, height / 2);

  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;
  const positions: THREE.Vector3[] = [];

  for (let y = 0; y < height; y += 4) {
    for (let x = 0; x < width; x += 4) {
      const alpha = pixels[(y * width + x) * 4 + 3];
      if (alpha > 128) {
        const px = (x - width / 2) / 10;
        const py = (height / 2 - y) / 10;
        positions.push(new THREE.Vector3(px, py, 0));
      }
    }
  }

  if (positions.length === 0) return Array(count).fill(0).map(() => new THREE.Vector3());

  const result: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const p = positions[Math.floor(Math.random() * positions.length)];
    result.push(p.clone().add(new THREE.Vector3(
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.1
    )));
  }

  return result;
}
