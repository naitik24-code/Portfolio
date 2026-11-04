import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line, Stars } from '@react-three/drei';
import * as THREE from 'three';

type CoreProps = { progress: number; highlighted: string | null };
type UniverseProps = CoreProps & { simple: boolean; onSimple: (simple: boolean) => void };

const points: [number, number, number][] = [[-2.6, .8, -.3], [2.7, .6, -.4], [-2.3, -1.1, .1], [2.4, -1, .1], [0, 2, -.5], [0, -2, -.3]];
const labels = ['OPTIVEST', 'QUANTOPT', 'CROPCARE', 'STEELLENS', 'INVENTORY', 'SLM ARENA'];
const destinations = points.map(() => new THREE.Vector3());

function ProjectObject({ index, active }: { index: number; active: boolean }) {
  const pulse = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!pulse.current) return;
    const t = clock.elapsedTime;
    pulse.current.rotation.y = t * (index === 1 ? .22 : .12);
    pulse.current.position.y = Math.sin(t * 1.2 + index) * .045;
  });
  const glow = active ? 1 : .65;
  if (index === 0) return <group ref={pulse}><mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.62, .08, 8, 48, Math.PI * 1.55]} /><meshBasicMaterial color="#c6ff4d" transparent opacity={glow} /></mesh><mesh rotation={[Math.PI / 2, 0, .8]}><torusGeometry args={[.62, .08, 8, 48, Math.PI * 1.1]} /><meshBasicMaterial color="#9b7bff" transparent opacity={.7} /></mesh><mesh><sphereGeometry args={[.12, 12, 8]} /><meshBasicMaterial color="#f0f1ed" /></mesh></group>;
  if (index === 1) return <group ref={pulse}>{Array.from({ length: 24 }, (_, i) => { const a = i * 2.399; const r = .35 + (i % 6) * .1; return <mesh key={i} position={[Math.cos(a) * r, Math.sin(a * 1.7) * .42, Math.sin(a) * r]}><sphereGeometry args={[.025 + (i % 3) * .012, 6, 6]} /><meshBasicMaterial color={i % 5 === 0 ? '#c6ff4d' : '#9b7bff'} transparent opacity={.72} /></mesh>; })}<mesh rotation={[0, 0, -.4]}><torusGeometry args={[.48, .018, 5, 40, Math.PI * 1.3]} /><meshBasicMaterial color="#68e8ff" /></mesh></group>;
  if (index === 2) return <group ref={pulse}><mesh rotation={[0, 0, -.5]}><shapeGeometry args={[(() => { const s = new THREE.Shape(); s.moveTo(0, -.65); s.quadraticCurveTo(-.72, 0, 0, .72); s.quadraticCurveTo(.72, 0, 0, -.65); return s; })()]} /><meshBasicMaterial color="#c6ff4d" transparent opacity={.35} side={THREE.DoubleSide} /></mesh><mesh rotation={[0, 0, -.5]} position={[0, 0, .02]}><planeGeometry args={[.025, 1.25]} /><meshBasicMaterial color="#c6ff4d" /></mesh><mesh position={[0, .12, .03]}><planeGeometry args={[.95, .012]} /><meshBasicMaterial color="#c6ff4d" transparent opacity={.8} /></mesh></group>;
  if (index === 3) return <group ref={pulse}>{Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[(i - 3) * .18, -.22, 0]}><boxGeometry args={[.12, .35 + (i % 4) * .16, .12]} /><meshBasicMaterial color="#9b7bff" transparent opacity={.72} /></mesh>)}</group>;
  if (index === 4) return <group ref={pulse}>{Array.from({ length: 12 }, (_, i) => { const low = i === 2 || i === 8; return <mesh key={i} position={[(i % 4 - 1.5) * .18, Math.floor(i / 4) * .16 - .16, 0]}><boxGeometry args={[.12, low ? .11 : .22 + (i % 3) * .08, .12]} /><meshBasicMaterial color={low ? '#ff8a3d' : '#c6ff4d'} transparent opacity={low ? 1 : .62} /></mesh>; })}</group>;
  return <group ref={pulse}><mesh position={[-.27, 0, 0]}><sphereGeometry args={[.17, 16, 12]} /><meshBasicMaterial color="#9b7bff" wireframe /></mesh><mesh position={[.27, 0, 0]}><sphereGeometry args={[.17, 16, 12]} /><meshBasicMaterial color="#68e8ff" wireframe /></mesh><Line points={[[-.15, 0, 0], [.15, 0, 0]]} color="#68e8ff" transparent opacity={.75} lineWidth={1} /></group>;
}

function Core({ progress, highlighted }: CoreProps) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const rings = useRef<Array<THREE.Mesh | null>>([]);
  const nodes = useRef<Array<THREE.Group | null>>([]);
  useFrame((state, dt) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y += dt * .045;
    if (core.current) core.current.scale.setScalar(1 + Math.sin(t * .7) * .018);
    rings.current.forEach((ring, i) => { if (ring) ring.rotation.z += dt * (i % 2 ? -.04 : .06); });
    const spread = THREE.MathUtils.smoothstep(progress, .14, .45);
    nodes.current.forEach((node, i) => {
      if (!node) return;
      const [x,y,z] = points[i];
      destinations[i].set(x * spread, y * spread, z * spread);
      node.position.lerp(destinations[i], 1 - Math.exp(-dt * 2));
      const selected = highlighted && labels[i].toLowerCase().replace(' ', '') === highlighted.replace('-', '').replace('retailinventory','inventory');
      node.scale.setScalar((.045 + spread * .045) * (selected ? 1.9 : 1));
    });
  });
  const ringGeo = useMemo(() => new THREE.TorusGeometry(1.34, .004, 6, 160), []);
  return <group ref={group}>
    <ambientLight intensity={.65} /><pointLight color="#c6ff4d" intensity={4} distance={7} /><pointLight color="#9b7bff" intensity={5} distance={6} position={[-2,1,0]} />
    <Float speed={.55} floatIntensity={.08} rotationIntensity={.08}>
      <mesh ref={core}>
        <icosahedronGeometry args={[.8, 5]} />
        <meshStandardMaterial color="#101211" metalness={.72} roughness={.24} emissive="#301e54" emissiveIntensity={.6} wireframe={false} />
      </mesh>
      <mesh scale={1.015}><icosahedronGeometry args={[.8, 2]} /><meshBasicMaterial color="#c6ff4d" wireframe transparent opacity={.08} /></mesh>
      <mesh scale={1.07}><sphereGeometry args={[.8, 32, 24]} /><meshBasicMaterial color="#9b7bff" side={THREE.BackSide} transparent opacity={.09} /></mesh>
    </Float>
    {[0,1,2].map((i) => <mesh key={i} ref={el => rings.current[i] = el} geometry={ringGeo} rotation={[.7 + i * .65, .3 + i * .55, i * 1.4] as [number, number, number]} scale={1 + i * .23}>
      <meshBasicMaterial color={i === 1 ? '#9b7bff' : '#c6ff4d'} transparent opacity={.35 - i * .07} />
    </mesh>)}
    {points.map((p, i) => <group key={i} ref={el => nodes.current[i] = el} position={[0,0,0]}>
      <ProjectObject index={i} active={Boolean(highlighted && labels[i].toLowerCase().replaceAll(' ', '').replace('retailinventory', 'inventory') === highlighted.replaceAll('-', ''))} />
      <mesh><sphereGeometry args={[.08,12,10]} /><meshBasicMaterial color="#f0f1ed" /></mesh>
      <pointLight color={i === 1 ? '#9b7bff' : i === 4 ? '#ff8a3d' : '#c6ff4d'} intensity={highlighted ? .9 : .35} distance={.8} />
    </group>)}
    {progress > .55 && points.map((p, i) => <Line key={`link-${i}`} points={[[0,0,0], p]} color="#9b7bff" transparent opacity={THREE.MathUtils.smoothstep(progress,.55,.72) * .26} lineWidth={1} />)}
  </group>;
}

function Scene({ progress, highlighted, onSimple }: CoreProps & { onSimple: (simple: boolean) => void }) {
  const mobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  function CameraPath() {
    const target = useRef<THREE.Vector3>(new THREE.Vector3());
    useFrame(({ camera }) => {
      const p = THREE.MathUtils.clamp(progress, 0, 1);
      target.current.set(Math.sin(p * Math.PI * 1.5) * .75, p < .2 ? 0 : (p - .2) * .35, 8 - Math.sin(p * Math.PI) * .75);
      camera.position.lerp(target.current, .035);
      camera.lookAt(Math.sin(p * Math.PI) * .18, 0, 0);
    });
    return null;
  }
  return <Canvas dpr={mobile ? 1 : [1, 1.25]} camera={{ position: [0,0,mobile ? 9.5 : 8], fov: mobile ? 48 : 42 }} gl={{ antialias: !mobile, alpha: true, powerPreference: 'low-power' }} frameloop="always" aria-hidden="true" onCreated={({ gl }) => {
    const handleContextLoss = (event: Event) => { event.preventDefault(); onSimple(true); };
    gl.domElement.addEventListener('webglcontextlost', handleContextLoss, { once: true });
  }}>
    <CameraPath />
    <Stars radius={18} depth={12} count={mobile ? 36 : 160} factor={1.1} saturation={0} fade speed={mobile ? 0 : .08} />
    <Core progress={progress} highlighted={highlighted} />
  </Canvas>;
}

export default function Universe({ simple, progress, highlighted, onSimple }: UniverseProps) {
  const [available, setAvailable] = useState(false);
  const [reason, setReason] = useState('');
  useEffect(() => {
    let supported = true, why = '';
    if (simple) { supported = false; why = 'Simple view is on.'; }
    try { const c = document.createElement('canvas'); if (!c.getContext('webgl2') && !c.getContext('webgl')) { supported = false; why = 'WebGL is unavailable in this browser.'; } } catch { supported = false; why = 'WebGL is unavailable in this browser.'; }
    setAvailable(supported); setReason(why);
  }, [simple]);
  return <>{available && <div className="universe-canvas" aria-hidden="true"><Scene progress={progress} highlighted={highlighted} onSimple={onSimple} /></div>}{!available && !simple && reason && <div className="scene-fallback" role="status">{reason} <button onClick={() => onSimple(true)}>CONTINUE IN SIMPLE VIEW</button></div>}</>;
}
