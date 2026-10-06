'use client';
/* eslint-disable react-hooks/immutability -- Three.js scene objects are animated imperatively in useFrame. */

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, RoundedBox } from '@react-three/drei';
import HeroOptics from './HeroOptics';
import { cameraPose, partPose, smooth, mix, curve, parts, type PartName, type Point3 } from './hero-motion';
import { Component, useEffect, useRef, type MutableRefObject, type ReactNode } from 'react';
import * as THREE from 'three';

export type InstrumentState = { progress: number; pointerX: number; pointerY: number; mobile: boolean; reduced: boolean; invalidate: (() => void) | null };
type SceneProps = { motion: MutableRefObject<InstrumentState>; registerInvalidate: (invalidate: (() => void) | null) => void };
const steel = { color: '#b4b9bb', metalness: 1, roughness: 0.17 };
const enamel = { color: '#171819', metalness: 0.82, roughness: 0.24 };
const rubber = { color: '#101011', metalness: 0.12, roughness: 0.65 };
const brass = { color: '#8c7561', metalness: 0.9, roughness: 0.3 };
function Cyl({ at = [0, 0, 0], radius = .1, height = .2, material = steel, rotation = [0, 0, 0], bottom }: { at?: [number, number, number]; radius?: number; height?: number; material?: typeof steel; rotation?: [number, number, number]; bottom?: number }) {
  return <mesh castShadow position={at} rotation={rotation}><cylinderGeometry args={[radius, bottom ?? radius, height, 32]} /><meshStandardMaterial {...material} /></mesh>;
}
function Box({ at, size, material = enamel }: { at: [number, number, number]; size: [number, number, number]; material?: typeof steel }) {
  return <RoundedBox castShadow args={size} radius={.035} smoothness={2} position={at}><meshStandardMaterial {...material} /></RoundedBox>;
}
function Screw({ at }: { at: [number, number, number] }) {
  return <group position={at}><Cyl radius={.075} height={.055} rotation={[Math.PI / 2, 0, 0]} /><mesh castShadow position={[0, 0, .032]}><boxGeometry args={[.085, .014, .008]} /><meshStandardMaterial {...rubber} /></mesh><Cyl at={[0,0,-.075]} radius={.025} height={.13} rotation={[Math.PI/2,0,0]} /></group>;
}
function Coil({ x, mobile }: { x: number; mobile: boolean }) {
  return <group position={[x, .48, 0]}>
    <Cyl radius={.24} height={.76} material={rubber} />
    {[-.41, .41].map(y => <Cyl key={y} at={[0, y, 0]} radius={.3} height={.07} material={steel} />)}
    {Array.from({ length: mobile ? 8 : 17 }, (_, i) => <mesh key={i} position={[0, -.34 + i * (mobile ? .095 : .043), 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.245, .014, 6, 32]} /><meshStandardMaterial {...enamel} /></mesh>)}
    <Cyl at={[0, .48, 0]} radius={.085} height={.1} material={brass} />
  </group>;
}
const screwHomes: Point3[]=[[-.67,1.13,-.12],[-.66,-.2,.31],[-.66,.58,-.12],[.43,-.24,-.04]];
function Part({partRef,home,children}:{partRef:React.Ref<THREE.Group>;home:Point3;children:ReactNode}) {
  return <group ref={partRef} position={home}><group position={[-home[0],-home[1],-home[2]]}>{children}</group></group>;
}
function Instrument({ motion, registerInvalidate }: SceneProps) {
  const body = useRef<THREE.Group>(null);
  const coilA = useRef<THREE.Group>(null);
  const coilB = useRef<THREE.Group>(null);
  const armature = useRef<THREE.Group>(null);
  const grip = useRef<THREE.Group>(null);
  const cartridge = useRef<THREE.Group>(null);
  const cam = useRef<THREE.Group>(null);
  const connector = useRef<THREE.Group>(null);
  const screws = useRef<(THREE.Group|null)[]>([]);
  const assembly = useRef<THREE.Group>(null);
  const shadow = useRef<THREE.Mesh<THREE.PlaneGeometry,THREE.ShadowMaterial>>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const { invalidate, camera, gl, size } = useThree();
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
    const m=motion.current;
    const p=m.reduced?0:m.progress;
    const c=cameraPose(p,mobile);
    const unlock=smooth(p,.12,.28);
    const bodyOpen=smooth(p,.28,.55);
    const pointerWeight=(1-smooth(p,0,.12))*(mobile||m.reduced?0:1);
    pointer.current.x=THREE.MathUtils.lerp(pointer.current.x,m.pointerX*pointerWeight,.075);
    pointer.current.y=THREE.MathUtils.lerp(pointer.current.y,m.pointerY*pointerWeight,.075);
    const perspective=camera as THREE.PerspectiveCamera;
    const aspect=size.width/size.height;
    const viewportWorld=2*10.8*Math.tan(THREE.MathUtils.degToRad(40/2))*aspect;
    // The resting object meets the right edge, then settles in front of the viewer.
    const restX=mobile?0:viewportWorld*mix(aspect<1?.18:.335,aspect<1?.12:.225,smooth(p,0,.12))*(1-smooth(p,.18,.55));
    assembly.current.position.set(restX,mobile?mix(-2,0,smooth(p,.12,.34)):.18,0);
    assembly.current.rotation.set(.10+pointer.current.y*.07, -.48+unlock*.32+bodyOpen*.12+pointer.current.x*.1, -.36+unlock*.17);
    assembly.current.scale.setScalar(mobile?mix(1.5,1.13,smooth(p,.28,.58)):1.15);
    const refs:Record<PartName,THREE.Group|null>={body:body.current,coilA:coilA.current,coilB:coilB.current,armature:armature.current,grip:grip.current,cartridge:cartridge.current,cam:cam.current,connector:connector.current};
    (Object.keys(refs) as PartName[]).forEach(name=>{
      const group=refs[name]; if(!group)return;
      const pose=partPose(name,p,mobile);
      group.position.set(...pose.position);
      group.rotation.set(...pose.rotation);
    });
    screws.current.forEach((s,i)=>{
      if(!s)return;
      const u=smooth(p,.15+i*.014,.25+i*.014);
      const t=smooth(p,.275+i*.012,.46+i*.012);
      const h=screwHomes[i];
      const side=i%2?1:-1;
      const path=curve(t,[0,0,0],[side*.12,.05,.32],[side*(i===1?.7:1.25),i%2?-.6:.75,mobile?1:3.6],[side*(i===1?1.4:2.2),i%2?-1.0:1.1,mobile?.7:2.2]);
      s.position.set(h[0]+path[0],h[1]+path[1],h[2]+u*.23+path[2]);
      s.rotation.set(t*.9*side,t*1.7,u*Math.PI*1.65+t*1.2*side);
    });
    if(shadow.current){shadow.current.position.x=restX;shadow.current.material.opacity=.28*(1-smooth(p,.10,.38));}
    perspective.position.set(c.x,c.y,c.z);
    perspective.fov=c.fov;
    perspective.up.set(Math.sin(c.roll),Math.cos(c.roll),0);
    perspective.lookAt(mobile?0:c.x*.22,0,c.z-10);
    perspective.updateProjectionMatrix();
    if(Math.abs(pointer.current.x-m.pointerX*pointerWeight)>.001||Math.abs(pointer.current.y-m.pointerY*pointerWeight)>.001)invalidate();
  });
  return <>
    {!mobile&&<mesh ref={shadow} receiveShadow position={[0,-2.4,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[18,16]} /><shadowMaterial transparent opacity={.28} /></mesh>}
    <group ref={assembly}>
    <Part partRef={body} home={parts.body.home}>
      <Box at={[-.67, .54, -.31]} size={[.18, 1.75, .32]} />
      <Box at={[.02, -.25, -.31]} size={[1.55, .2, .5]} />
      <Box at={[-.35, 1.32, -.31]} size={[.82, .17, .32]} />
      <Box at={[-.62, .06, .03]} size={[.25, .46, .62]} material={steel} />
      <Cyl at={[-.62, -.35, .03]} radius={.22} height={.45} />
      <Cyl at={[-.67, 1.13, -.12]} radius={.045} height={.06} material={rubber} rotation={[Math.PI/2,0,0]} />
      <Cyl at={[-.66, -.2, .31]} radius={.045} height={.06} material={rubber} rotation={[Math.PI/2,0,0]} />
    </Part>
    <Part partRef={coilA} home={parts.coilA.home}><Coil x={-.22} mobile={mobile} /></Part><Part partRef={coilB} home={parts.coilB.home}><Coil x={.43} mobile={mobile} /></Part>
    <Part partRef={armature} home={parts.armature.home}>
      <Box at={[.02, 1.07, .03]} size={[1.26, .09, .28]} material={steel} />
      <Box at={[-.55, 1.16, -.14]} size={[.33, .07, .25]} material={steel} />
      <Cyl at={[-.65, .49, .08]} radius={.032} height={1.2} />
      <Cyl at={[.42, 1.31, .02]} radius={.055} height={.45} material={brass} rotation={[0, 0, -.25]} />
      <Cyl at={[.48, 1.5, .02]} radius={.11} height={.08} />
    </Part>
    <Part partRef={grip} home={parts.grip.home}>
      <Cyl at={[-.62, -.95, .03]} radius={.235} height={.96} material={enamel} />
      <Cyl at={[-.62, -.55, .03]} radius={.255} height={.1} />
      <Cyl at={[-.62, -1.42, .03]} radius={.225} height={.12} />
      {Array.from({ length: mobile ? 8 : 14 }, (_, i) => <mesh key={i} position={[-.62, -1.34 + i * (mobile ? .1 : .056), .03]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.237, .014, 6, 32]} /><meshStandardMaterial {...steel} roughness={.36} /></mesh>)}
    </Part>
    <Part partRef={cartridge} home={parts.cartridge.home}>
      <Cyl at={[-.62, -1.65, .03]} radius={.19} bottom={.085} height={.36} material={{ color: '#848785', metalness: .35, roughness: .3 }} />
      <Cyl at={[-.62, -1.89, .03]} radius={.08} bottom={.028} height={.18} />
      <Cyl at={[-.62, -2.06, .03]} radius={.012} height={.2} />
    </Part>
    <Part partRef={cam} home={parts.cam.home}>
      <Cyl at={[.57, .61, .34]} radius={.22} height={.12} rotation={[Math.PI / 2, 0, 0]} />
      <Cyl at={[.57, .61, .415]} radius={.145} height={.04} material={enamel} rotation={[Math.PI / 2, 0, 0]} />
      <Screw at={[.57, .61, .45]} />
    </Part>
    <Part partRef={connector} home={parts.connector.home}>
      <Cyl at={[.85, -.12, -.27]} radius={.13} height={.4} rotation={[0, 0, Math.PI / 2]} />
      <Cyl at={[1.08, -.12, -.27]} radius={.085} height={.18} material={rubber} rotation={[0, 0, Math.PI / 2]} />
      {!mobile && <Cyl at={[1.23, -.12, -.27]} radius={.035} height={.18} material={brass} rotation={[0, 0, Math.PI / 2]} />}
    </Part>
    {screwHomes.slice(0,mobile?2:4).map((home,i)=><group ref={node=>{screws.current[i]=node}} key={i} position={home}><Screw at={[0,0,0]} /></group>)}
    </group>
  </>;
}
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <div className="scene-fallback"><span>Black enamel. Cold steel.</span><p>Precision in every part.</p></div> : this.props.children; }
}
export default function MachineScene({ motion, registerInvalidate }: SceneProps) {
  return <SceneBoundary><Canvas frameloop="demand" dpr={[1, motion.current.mobile ? 1.25 : 1.5]} shadows={!motion.current.mobile} camera={{ position: [0, .1, 10.8], fov: 40, near: .05, far: 60 }} gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }} fallback={<div className="scene-fallback"><p>Precision in every part.</p><span>Black enamel. Cold steel.</span></div>}>
    <ambientLight intensity={.26} />
    <directionalLight castShadow={!motion.current.mobile} shadow-mapSize={[512,512]} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} position={[3, 5, 6]} intensity={3.5} color="#e9e2d7" />
    <directionalLight position={[-4, 1, -2]} intensity={4} color="#c5cbd2" />
    <Environment resolution={128}>
      <Lightformer form="rect" intensity={5} color="#ffffff" position={[-3, 2, 3]} scale={[2, 6, 1]} rotation={[0, .5, 0]} />
      <Lightformer form="rect" intensity={3} color="#b7c4cf" position={[3, 1, 1]} scale={[1, 5, 1]} rotation={[0, -.7, 0]} />
      <Lightformer form="rect" intensity={4} color="#e7ddd0" position={[0, 5, 0]} scale={[5, 1, 1]} rotation={[Math.PI / 2, 0, 0]} />
    </Environment>
    <Instrument motion={motion} registerInvalidate={registerInvalidate} />
    {!motion.current.mobile&&<HeroOptics motion={motion} />}
  </Canvas></SceneBoundary>;
}
