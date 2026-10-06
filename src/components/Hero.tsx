'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cameraPose, smooth } from './hero-motion';
import type { InstrumentState } from './MachineScene';
import './hero.css';

const MachineScene = dynamic(() => import('./MachineScene'), { ssr: false, loading: () => <div className="instrument-loading" aria-hidden="true">Assembling the instrument</div> });

export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const aperture = useRef<HTMLDivElement>(null);
  const motion = useRef<InstrumentState>({ progress: 0, pointerX: 0, pointerY: 0, mobile: false, reduced: false, invalidate: null });
  const registerInvalidate = useCallback((invalidate: (() => void) | null) => { motion.current.invalidate = invalidate; }, []);
  const [sceneKey, setSceneKey] = useState('initial');
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({ mobile: '(max-width: 767px)', desktop: '(min-width: 768px)', reduced: '(prefers-reduced-motion: reduce)' }, context => {
      const { mobile, reduced } = context.conditions!;
      motion.current.mobile = !!mobile;
      motion.current.reduced = !!reduced;
      motion.current.progress = 0;
      setSceneKey(`${mobile}-${reduced}`);
      if (reduced) return;
      const updateFrame = () => {
        const p = motion.current.progress;
        const element = aperture.current;
        const pin = section.current?.querySelector('.hero-pin');
        if (element && pin) {
          const view = pin.getBoundingClientRect();
          const camera = cameraPose(p, !!mobile);
          const distance = Math.max(1.1, camera.z + 7);
          const visibleWorldHeight = 2 * distance * Math.tan(camera.fov * Math.PI / 360);
          const scale = (mobile ? 4.1 : 3.05) / visibleWorldHeight;
          const lateralShift = -camera.x / visibleWorldHeight * view.height;
          element.style.transform = `translate3d(calc(-50% + ${lateralShift}px),-50%,0) scale(${scale})`;
          element.style.opacity = String(smooth(p, .58, .66));
        }
        motion.current.invalidate?.();
        if (section.current) section.current.dataset.progress = p.toFixed(3);
      };
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true, onRefresh: updateFrame },
      });
      timeline.to(motion.current, { progress: 1, duration: 1, onUpdate: updateFrame }, 0)
        .to('.hero-copy', { opacity: 0, duration: .15 }, .13)
        .to('.hero-actions, .hero-bottom', { autoAlpha: 0, duration: .13 }, .13)
        .to('.hero-edition', { opacity: 0, duration: .12 }, .31)
        .fromTo('.unlock-note', { opacity: 0 }, { opacity: 1, duration: .06 }, .19)
        .to('.unlock-note', { opacity: 0, duration: .09 }, .28)
        .fromTo('.reveal-caption', { opacity: 0 }, { opacity: 1, duration: .07 }, .93);
      let active = true;
      const refresh = () => { if (active) ScrollTrigger.refresh(); };
      document.fonts.ready.then(refresh);
      updateFrame();
      return () => { active = false; timeline.scrollTrigger?.kill(); timeline.kill(); };
    }, section);
    return () => media.revert();
  }, []);
  return <section ref={section} className="hero-sequence cinematic-hero" aria-label="An instrument made for permanence" id="top" data-progress="0">
    <div className="hero-pin" onPointerMove={event => {
      motion.current.pointerX = event.clientX / window.innerWidth * 2 - 1;
      motion.current.pointerY = event.clientY / window.innerHeight * 2 - 1;
      motion.current.invalidate?.();
    }} onPointerLeave={() => { motion.current.pointerX = 0; motion.current.pointerY = 0; motion.current.invalidate?.(); }}>
      <div className="studio-reveal" aria-hidden="true"><div ref={aperture} className="studio-aperture"><Image src="/images/studio.webp" alt="" fill sizes="100vw" preload /></div></div>
      <span className="reveal-caption" aria-hidden="true">Step inside.</span>
      <div className="hero-edition mono" aria-hidden="true">A tattoo house for personal work <span>Appointments by conversation</span></div>
      <div className="hero-copy">
        <p className="hero-kicker"><span /> Bring us the thought you keep returning to.</p>
        <h1>Give it<br />a place<span className="period">.</span></h1>
        <p className="hero-description">Personal tattoos, made with you.<br className="desktop-break" /> From first thought to final line.</p>
        <div className="hero-actions"><a className="button button-bone" href="#book">Tell us the idea</a><a className="text-link" href="#work">See the work</a></div>
      </div>
      <div className="machine-stage" role="img" aria-label="An original tattoo machine unlocks, its parts open around the camera, and the studio comes into view."><MachineScene key={sceneKey} motion={motion} registerInvalidate={registerInvalidate} /></div>
      <span className="unlock-note mono" aria-hidden="true">01 / cartridge</span>
      <div className="hero-bottom mono"><a href="#studio">Come inside <span className="scroll-line" /></a><p>Made for the person.<br />Not the trend.</p><span>By appointment</span></div>
    </div>
  </section>;
}
