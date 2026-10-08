/** All choreography is a pure function of scroll position: no accumulated motion. */
export type Point3 = readonly [number, number, number];
export const smooth = (p: number, from: number, to: number) => {
  const t = Math.max(0, Math.min(1, (p - from) / (to - from)));
  return t * t * (3 - 2 * t);
};
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export function curve(t: number, a: Point3, b: Point3, c: Point3, d: Point3): [number, number, number] {
  const s = 1 - t;
  return [0, 1, 2].map(i => s*s*s*a[i] + 3*s*s*t*b[i] + 3*s*t*t*c[i] + t*t*t*d[i]) as [number, number, number];
}
export const parts = {
  body: { home: [-.25,.48,-.18], start:.28, end:.69, c1:[-.3,.1,-.6], c2:[-3.2,1.3,1.6], to:[-2.3,.25,-1.0], turn:[-.2,.8,-.35] },
  coilA: { home:[-.22,.48,0], start:.30, end:.66, c1:[-.35,.1,0], c2:[.3,1.2,-1.6], to:[-1.05,1.5,-2.4], turn:[-.4,.2,-.55] },
  coilB: { home:[.43,.48,0], start:.32, end:.68, c1:[.3,.2,.5], c2:[2.0,1,2.8], to:[1.55,1.3,.6], turn:[.3,-.8,.65] },
  grip: { home:[-.62,-.98,.03], start:.28, end:.59, c1:[.5,-.3,1.7], c2:[2.2,.4,5], to:[1.75,-.15,2.5], turn:[.55,-.3,-.9] },
  cartridge: { home:[-.62,-1.78,.03], start:.27, end:.50, c1:[-.2,-.4,.8], c2:[-1.8,-.7,3.3], to:[-1.4,-.6,1.2], turn:[.4,.3,-.45] },
  armature: { home:[-.05,1.1,.02], start:.29, end:.65, c1:[.1,.4,0], c2:[.4,1.6,-.8], to:[.1,1.65,-1.1], turn:[.45,.35,.1] },
  cam: { home:[.57,.61,.4], start:.30, end:.54, c1:[1,.3,1.4], c2:[.8,1.4,4.4], to:[-.7,1.1,3.8], turn:[1.2,.7,-.6] },
  connector: { home:[.93,-.12,-.27], start:.31, end:.59, c1:[.4,0,.6], c2:[2.3,-.4,-.6], to:[2.8,-.7,-2], turn:[-.7,.35,.5] },
} satisfies Record<string, {home:Point3;start:number;end:number;c1:Point3;c2:Point3;to:Point3;turn:Point3}>;
export type PartName = keyof typeof parts;
export function partPose(name: PartName, p: number, mobile: boolean) {
  const part = parts[name];
  const t = smooth(p, part.start, part.end);
  const position = curve(t,[0,0,0],part.c1,part.c2,part.to);
  // Mobile keeps the physical opening but avoids the closest lateral lens passes.
  const depth = mobile ? .65 : 1;
  position[0] *= mobile ? .72 : 1;
  position[2] *= depth;
  if (name === 'cartridge') position[1] -= smooth(p,.12,.21)*.38;
  if (name === 'grip') position[1] -= smooth(p,.19,.28)*.22;
  if (name === 'armature') position[1] += smooth(p,.22,.28)*.09;
  if (name === 'cam') position[2] += smooth(p,.21,.28)*.12;
  return { position: position.map((value,i)=>value+part.home[i]) as [number,number,number], rotation: part.turn.map(value=>value*t) as [number,number,number] };
}
export function cameraPose(p: number, mobile: boolean) {
  const unlock = smooth(p,.12,.28);
  const rupture = smooth(p,.28,.55);
  const passage = smooth(p,.55,.77);
  const z = mobile ? 11.8 - unlock*3.1 - rupture*1.3 - passage*8.2 : 10.8 - unlock*3.3 - rupture*1.2 - passage*8;
  const orbit = Math.sin(smooth(p,.28,.94)*Math.PI);
  return { x: mobile ? orbit*.13 : orbit*.42, y: mobile ? 0 : .15+orbit*.2, z, fov: mobile ? 40+passage*4 : 40-unlock*3+passage*7, roll: mobile ? 0 : Math.sin(p*Math.PI)*.025 };
}
