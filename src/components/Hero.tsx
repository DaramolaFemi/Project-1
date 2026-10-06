'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { smooth } from './hero-motion';
import type { InstrumentState } from './MachineScene';
import './hero.css';

const MachineScene = dynamic(() => import('./MachineScene'), { ssr: false, loading: () => <div className="instrument-loading" aria-hidden="true">Assembling the instrument</div> });

export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const studioReveal = useRef<HTMLDivElement>(null);
  const workbenchReveal = useRef<HTMLDivElement>(null);
  const machineStage = useRef<HTMLDivElement>(null);
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
        const pin = section.current?.querySelector('.hero-pin');
        if (pin) {
          // The room arrives as a physical camera move, not a graphic wipe.
          const roomIn = smooth(p, .57, .77);
          const roomOut = 1 - smooth(p, .82, .91);
          if (studioReveal.current) {
            studioReveal.current.style.opacity = String(roomIn * roomOut);
            studioReveal.current.style.transform = `translate3d(${(1 - roomIn) * -12}%, 0, 0) scale(${1.08 - roomIn * .08})`;
          }
          if (workbenchReveal.current) {
            workbenchReveal.current.style.opacity = String(smooth(p, .84, .95));
          }
          if (machineStage.current) {
            machineStage.current.style.opacity = String(1 - smooth(p, .65, .81));
          }
        }
        motion.current.invalidate?.();
        if (section.current) section.current.dataset.progress = p.toFixed(3);
      };
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true, onRefresh: updateFrame },
      });
      timeline.to(motion.current, { progress: 1, duration: 1, onUpdate: updateFrame }, 0)
        .to('.hero-actions, .hero-bottom', { autoAlpha: 0, duration: .12 }, .13)
        .to('.hero-kicker, .hero-description', { opacity: 0, duration: .10 }, .17)
        .to('.hero-word-give', { xPercent: -26, yPercent: -16, rotation: -4, opacity: .08, duration: .18 }, .36)
        .to('.hero-word-it', { xPercent: 28, yPercent: -22, rotation: 4, opacity: .08, duration: .18 }, .36)
        .to('.hero-word-a', { xPercent: -22, yPercent: 28, rotation: 3, opacity: .08, duration: .18 }, .36)
        .to('.hero-word-place', { xPercent: 25, yPercent: 22, rotation: -3, opacity: .08, duration: .18 }, .36)
        .to('.hero-copy', { opacity: 0, duration: .07 }, .56)
        .to('.hero-edition', { opacity: 0, duration: .12 }, .31)
        .fromTo('.unlock-note', { opacity: 0 }, { opacity: 1, duration: .06 }, .19)
        .to('.unlock-note', { opacity: 0, duration: .09 }, .28)
        .fromTo('.studio-title', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .09 }, .68)
        .to('.studio-title', { opacity: 0, duration: .06 }, .82)
        .fromTo('.bench-title', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .08 }, .90);
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
      <div className="hero-atmosphere" aria-hidden="true" />
      <div className="machine-orbits" aria-hidden="true"><i /><i /><i /></div>
      <div ref={studioReveal} className="studio-reveal" aria-hidden="true"><Image src="/images/studio.webp" alt="" fill sizes="100vw" preload /><div className="studio-title"><span className="mono">NOCTURNE / IN THE ROOM</span><strong>There is<br />time here.</strong><p>One chair. One idea.<br />The care it asks for.</p></div></div>
      <div ref={workbenchReveal} className="workbench-reveal" aria-hidden="true"><Image src="/images/hero-workbench.webp" alt="" fill sizes="100vw" /><div className="bench-title"><span className="mono">01 / THE WORK BEGINS BEFORE THE NEEDLE</span><strong>Not rush.<br /><em>Attention.</em></strong></div></div>
      <div className="hero-edition mono" aria-hidden="true">A tattoo house for personal work <span>Appointments by conversation</span></div>
      <div className="hero-copy">
        <p className="hero-kicker"><span /> Bring us the thought you keep returning to.</p>
        <h1 className="hero-title"><span className="hero-word hero-word-give">Give</span>{' '}<span className="hero-word hero-word-it">it</span><br /><span className="hero-word hero-word-a">a</span>{' '}<span className="hero-word hero-word-place">place<span className="period">.</span></span></h1>
        <p className="hero-description">Personal tattoos, made with you.<br className="desktop-break" /> From first thought to final line.</p>
        <div className="hero-actions"><a className="button button-bone" href="#book">Tell us the idea</a><a className="text-link" href="#work">See the work</a></div>
      </div>
      <div ref={machineStage} className="machine-stage" role="img" aria-label="An original tattoo machine unlocks, its parts open around the camera, and the studio comes into view."><MachineScene key={sceneKey} motion={motion} registerInvalidate={registerInvalidate} /></div>
      <span className="unlock-note mono" aria-hidden="true">01 / cartridge</span>
      <div className="hero-bottom mono"><a href="#studio">Come inside <span className="scroll-line" /></a><p>Made for the person.<br />Not the trend.</p><span>By appointment</span></div>
    </div>
  </section>;
}
