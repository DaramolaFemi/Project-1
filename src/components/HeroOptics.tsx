'use client';
/* eslint-disable react-hooks/immutability -- WebGL uniforms and render targets are updated per frame. */
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { smooth, mix } from './hero-motion';
import type { InstrumentState } from './MachineScene';

/** Nine-tap, depth-aware foreground defocus. The studio stays crisp behind the canvas. */
export default function HeroOptics({motion}:{motion:MutableRefObject<InstrumentState>}) {
  const {gl,size,camera} = useThree();
  const optics = useMemo(()=> {
    const target = new THREE.WebGLRenderTarget(1,1,{depthTexture:new THREE.DepthTexture(1,1), type:THREE.HalfFloatType});
    const material = new THREE.ShaderMaterial({
      uniforms:{ image:{value:target.texture}, depth:{value:target.depthTexture}, pixel:{value:new THREE.Vector2()}, near:{value:.05}, far:{value:60}, focus:{value:5}, aperture:{value:0} },
      vertexShader:'varying vec2 uvPass; void main(){ uvPass=uv; gl_Position=vec4(position.xy,0.,1.); }',
      fragmentShader:`
        #include <packing>
        varying vec2 uvPass;
        uniform sampler2D image, depth;
        uniform vec2 pixel;
        uniform float near, far, focus, aperture;
        void main(){
          float z=-perspectiveDepthToViewZ(texture2D(depth,uvPass).r,near,far);
          float coc=clamp(abs(z-focus)/max(z,0.1),0.,1.)*aperture;
          vec2 d=pixel*coc;
          vec4 c=texture2D(image,uvPass)*.28;
          c+=(texture2D(image,uvPass+vec2(d.x,0.))+texture2D(image,uvPass-vec2(d.x,0.))+texture2D(image,uvPass+vec2(0.,d.y))+texture2D(image,uvPass-vec2(0.,d.y)))*.12;
          c+=(texture2D(image,uvPass+d)+texture2D(image,uvPass-d)+texture2D(image,uvPass+vec2(d.x,-d.y))+texture2D(image,uvPass+vec2(-d.x,d.y)))*.06;
          gl_FragColor=c;
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
      depthTest:false,depthWrite:false,
    });
    return {target,material,quad:new FullScreenQuad(material)};
  },[]);
  useEffect(()=>{
    const dpr=gl.getPixelRatio();
    optics.target.setSize(size.width*dpr,size.height*dpr);
    optics.material.uniforms.pixel.value.set(1/(size.width*dpr),1/(size.height*dpr));
  },[gl,size,optics]);
  useEffect(()=>()=>{optics.target.dispose();optics.material.dispose();optics.quad.dispose();},[optics]);
  useFrame(({scene})=>{
    const p=motion.current.progress;
    if (motion.current.reduced || p<.29 || p>.92) {gl.render(scene,camera);return;}
    optics.material.uniforms.focus.value=mix(Math.max(1,camera.position.z),Math.max(1,camera.position.z+7),smooth(p,.52,.76));
    optics.material.uniforms.aperture.value=2.2*smooth(p,.29,.46)*(1-smooth(p,.84,.92));
    gl.setRenderTarget(optics.target);
    gl.render(scene,camera);
    gl.setRenderTarget(null);
    optics.quad.render(gl);
  },1);
  return null;
}
