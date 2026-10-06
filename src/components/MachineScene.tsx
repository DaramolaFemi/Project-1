'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, RoundedBox } from '@react-three/drei';
import { Component, useEffect, useRef, type MutableRefObject, type ReactNode } from 'react';
import * as THREE from 'three';

export type InstrumentState = { progress: number; pointerX: number; pointerY: number; mobile: boolean; reduced: boolean; invalidate: (() => void) | null };
type SceneProps = { motion: MutableRefObject<InstrumentState>; registerInvalidate: (invalidate: (() => void) | null) => void };
const steel = { color: '#a9afb2', metalness: 1, roughness: 0.24 };
const enamel = { color: '#151617', metalness: 0.78, roughness: 0.3 };
const rubber = { color: '#101011', metalness: 0.12, roughness: 0.65 };
const brass = { color: '#8c7561', metalness: 0.9, roughness: 0.3 };
const clamp = THREE.MathUtils.clamp;
function Cyl({ at = [0, 0, 0], radius = .1, height = .2, material = steel, rotation = [0, 0, 0], bottom }: { at?: [number, number, number]; radius?: number; height?: number; material?: typeof steel; rotation?: [number, number, number]; bottom?: number }) {
  return <mesh position={at} rotation={rotation}><cylinderGeometry args={[radius, bottom ?? radius, height, 32]} /><meshStandardMaterial {...material} /></mesh>;
}
function Box({ at, size, material = enamel }: { at: [number, number, number]; size: [number, number, number]; material?: typeof steel }) {
  return <RoundedBox args={size} radius={.035} smoothness={2} position={at}><meshStandardMaterial {...material} /></RoundedBox>;
}
function Screw({ at }: { at: [number, number, number] }) {
  return <group position={at}><Cyl radius={.075} height={.055} rotation={[Math.PI / 2, 0, 0]} /><mesh position={[0, 0, .032]}><boxGeometry args={[.085, .014, .008]} /><meshStandardMaterial {...rubber} /></mesh></group>;
}
function Coil({ x, mobile }: { x: number; mobile: boolean }) {
  return <group position={[x, .48, 0]}>
    <Cyl radius={.24} height={.76} material={rubber} />
    {[-.41, .41].map(y => <Cyl key={y} at={[0, y, 0]} radius={.3} height={.07} material={steel} />)}
    {Array.from({ length: mobile ? 8 : 17 }, (_, i) => <mesh key={i} position={[0, -.34 + i * (mobile ? .095 : .043), 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.245, .014, 6, 32]} /><meshStandardMaterial {...enamel} /></mesh>)}
    <Cyl at={[0, .48, 0]} radius={.085} height={.1} material={brass} />
  </group>;
}
function Instrument({ motion, registerInvalidate }: SceneProps) {
  const body = useRef<THREE.Group>(null);
  const coils = useRef<THREE.Group>(null);
  const armature = useRef<THREE.Group>(null);
  const grip = useRef<THREE.Group>(null);
  const cartridge = useRef<THREE.Group>(null);
  const cam = useRef<THREE.Group>(null);
  const connector = useRef<THREE.Group>(null);
  const assembly = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const { invalidate, camera, gl } = useThree();
  const mobile = motion.current.mobile;
  useEffect(() => {
    registerInvalidate(invalidate);
    const lost = (event: Event) => event.preventDefault();
    const restored = () => invalidate();
    gl.domElement.addEventListener('webglcontextlost', lost);
    gl.domElement.addEventListener('webglcontextrestored', restored);
    invalidate();
    return () => {
      registerInvalidate(null);
      gl.domElement.removeEventListener('webglcontextlost', lost);
      gl.domElement.removeEventListener('webglcontextrestored', restored);
    };
  }, [invalidate, registerInvalidate, gl]);
  useFrame(() => {
    if (!assembly.current) return;
    const m = motion.current;
    const p = m.reduced ? 0 : m.progress;
    const e = THREE.MathUtils.smoothstep(p, .16, .7);
    const travel = THREE.MathUtils.smoothstep(p, .74, .99);
    const pointerWeight = (1 - clamp(p * 5, 0, 1)) * (m.mobile || m.reduced ? 0 : 1);
    pointer.current.x = THREE.MathUtils.lerp(pointer.current.x, m.pointerX * pointerWeight, .075);
    pointer.current.y = THREE.MathUtils.lerp(pointer.current.y, m.pointerY * pointerWeight, .075);
    assembly.current.rotation.set(.12 + pointer.current.y * .1, -.48 + p * 1.35 + pointer.current.x * .14, -.36 + e * .3);
    assembly.current.position.set(-.1, .12 + e * .12, 0);
    assembly.current.scale.setScalar(m.mobile ? THREE.MathUtils.lerp(1.5, 1.08, e) : 1);
    if (body.current) body.current.position.set(-e * .6, e * .25, -e * .8);
    if (coils.current) coils.current.position.set(e * .35, e * .75, e * .35);
    if (armature.current) armature.current.position.set(0, e * 1.2, e * .15);
    if (grip.current) grip.current.position.set(-e * .38, -e * .48, e * .2);
    if (cartridge.current) cartridge.current.position.set(-e * .5, -e * .96, e * .2);
    if (cam.current) cam.current.position.set(e * 1.0, e * .28, e * .72);
    if (connector.current) connector.current.position.set(e * 1.05, e * .65, -e * .2);
    camera.position.set(m.mobile ? 0 : travel * .32, m.mobile ? .05 : .1 + travel * .3, m.mobile ? 10.8 : 8.8 - travel * 8.25);
    camera.lookAt(m.mobile ? 0 : travel * .32, m.mobile ? .05 : .1 + travel * .3, -1);
    if (Math.abs(pointer.current.x - m.pointerX * pointerWeight) > .001 || Math.abs(pointer.current.y - m.pointerY * pointerWeight) > .001) invalidate();
  });
  return <group ref={assembly} scale={mobile ? 1.08 : 1}>
    <group ref={body}>
      <Box at={[-.67, .54, -.31]} size={[.18, 1.75, .32]} />
      <Box at={[.02, -.25, -.31]} size={[1.55, .2, .5]} />
      <Box at={[-.35, 1.32, -.31]} size={[.82, .17, .32]} />
      <Box at={[-.62, .06, .03]} size={[.25, .46, .62]} material={steel} />
      <Cyl at={[-.62, -.35, .03]} radius={.22} height={.45} />
      <Screw at={[-.67, 1.13, -.12]} /><Screw at={[-.66, -.2, .31]} />
      {!mobile && <><Screw at={[-.66, .58, -.12]} /><Screw at={[.43, -.24, -.04]} /></>}
    </group>
    <group ref={coils}><Coil x={-.22} mobile={mobile} /><Coil x={.43} mobile={mobile} /></group>
    <group ref={armature}>
      <Box at={[.02, 1.07, .03]} size={[1.26, .09, .28]} material={steel} />
      <Box at={[-.55, 1.16, -.14]} size={[.33, .07, .25]} material={steel} />
      <Cyl at={[-.65, .49, .08]} radius={.032} height={1.2} />
      <Cyl at={[.42, 1.31, .02]} radius={.055} height={.45} material={brass} rotation={[0, 0, -.25]} />
      <Cyl at={[.48, 1.5, .02]} radius={.11} height={.08} />
    </group>
    <group ref={grip}>
      <Cyl at={[-.62, -.95, .03]} radius={.235} height={.96} material={enamel} />
      <Cyl at={[-.62, -.55, .03]} radius={.255} height={.1} />
      <Cyl at={[-.62, -1.42, .03]} radius={.225} height={.12} />
      {Array.from({ length: mobile ? 8 : 14 }, (_, i) => <mesh key={i} position={[-.62, -1.34 + i * (mobile ? .1 : .056), .03]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.237, .014, 6, 32]} /><meshStandardMaterial {...steel} roughness={.36} /></mesh>)}
    </group>
    <group ref={cartridge}>
      <Cyl at={[-.62, -1.65, .03]} radius={.19} bottom={.085} height={.36} material={{ color: '#848785', metalness: .35, roughness: .3 }} />
      <Cyl at={[-.62, -1.89, .03]} radius={.08} bottom={.028} height={.18} />
      <Cyl at={[-.62, -2.06, .03]} radius={.012} height={.2} />
    </group>
    <group ref={cam}>
      <Cyl at={[.57, .61, .34]} radius={.22} height={.12} rotation={[Math.PI / 2, 0, 0]} />
      <Cyl at={[.57, .61, .415]} radius={.145} height={.04} material={enamel} rotation={[Math.PI / 2, 0, 0]} />
      <Screw at={[.57, .61, .45]} />
    </group>
    <group ref={connector}>
      <Cyl at={[.85, -.12, -.27]} radius={.13} height={.4} rotation={[0, 0, Math.PI / 2]} />
      <Cyl at={[1.08, -.12, -.27]} radius={.085} height={.18} material={rubber} rotation={[0, 0, Math.PI / 2]} />
      {!mobile && <Cyl at={[1.23, -.12, -.27]} radius={.035} height={.18} material={brass} rotation={[0, 0, Math.PI / 2]} />}
    </group>
  </group>;
}
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <div className="scene-fallback"><span>Black enamel. Cold steel.</span><p>Precision in every part.</p></div> : this.props.children; }
}
export default function MachineScene({ motion, registerInvalidate }: SceneProps) {
  return <SceneBoundary><Canvas frameloop="demand" dpr={[1, motion.current.mobile ? 1.25 : 1.5]} camera={{ position: [0, .1, 8.8], fov: 36, near: .05, far: 40 }} gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }} fallback={<div className="scene-fallback"><p>Precision in every part.</p><span>Black enamel. Cold steel.</span></div>}>
    <ambientLight intensity={.3} />
    <directionalLight position={[3, 4, 5]} intensity={3} color="#e9e2d7" />
    <directionalLight position={[-4, 1, -2]} intensity={4} color="#c5cbd2" />
    <Environment resolution={128}>
      <Lightformer form="rect" intensity={5} color="#ffffff" position={[-3, 2, 3]} scale={[2, 6, 1]} rotation={[0, .5, 0]} />
      <Lightformer form="rect" intensity={3} color="#b7c4cf" position={[3, 1, 1]} scale={[1, 5, 1]} rotation={[0, -.7, 0]} />
      <Lightformer form="rect" intensity={4} color="#e7ddd0" position={[0, 5, 0]} scale={[5, 1, 1]} rotation={[Math.PI / 2, 0, 0]} />
    </Environment>
    <Instrument motion={motion} registerInvalidate={registerInvalidate} />
  </Canvas></SceneBoundary>;
}
