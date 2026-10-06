'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { InstrumentState } from './MachineScene';
const MachineScene = dynamic(() => import('./MachineScene'), { ssr: false, loading: () => <div className="instrument-loading" aria-hidden="true">Assembling the instrument</div> });

export default function Hero() {
  const section = useRef<HTMLElement>(null);
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
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true },
      });
      timeline.to(motion.current, { progress: 1, duration: 1, onUpdate: () => {
        motion.current.invalidate?.();
        if (section.current) section.current.dataset.progress = motion.current.progress.toFixed(3);
      } }, 0)
        .to('.hero-copy', { opacity: 0, duration: .13 }, .1)
        .to('.hero-actions, .hero-bottom', { autoAlpha: 0, duration: .13 }, .1)
        .fromTo('.technical-labels', { opacity: 0 }, { opacity: 1, duration: .12 }, .25)
        .to('.technical-labels', { opacity: 0, duration: .1 }, .68)
        .fromTo('.studio-reveal', { opacity: 0, clipPath: 'inset(26% 32% 26% 32%)' }, { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: .22 }, .78)
        .to('.machine-stage', { opacity: 0, duration: mobile ? .2 : .1 }, mobile ? .78 : .89)
        .fromTo('.reveal-caption', { opacity: 0 }, { opacity: 1, duration: .07 }, .93);
      let active = true;
      const refresh = () => { if (active) ScrollTrigger.refresh(); };
      document.fonts.ready.then(refresh);
      return () => { active = false; timeline.scrollTrigger?.kill(); timeline.kill(); };
    }, section);
    return () => media.revert();
  }, []);
  return <section ref={section} className="hero-sequence" aria-label="An instrument made for permanence" id="top" data-progress="0">
    <div className="hero-pin" onPointerMove={event => {
      motion.current.pointerX = event.clientX / window.innerWidth * 2 - 1;
      motion.current.pointerY = event.clientY / window.innerHeight * 2 - 1;
      motion.current.invalidate?.();
    }} onPointerLeave={() => { motion.current.pointerX = 0; motion.current.pointerY = 0; motion.current.invalidate?.(); }}>
      <div className="hero-edition mono" aria-hidden="true">Independent tattoo atelier <span>Est. MMXVI</span></div>
      <div className="hero-copy">
        <p className="hero-kicker"><span /> A personal mark. A permanent story.</p>
        <h1>Made<br />{' '}to stay<span className="period">.</span></h1>
        <p className="hero-description">Custom tattooing from first thought<br className="desktop-break" /> to final line.</p>
        <div className="hero-actions"><a className="button button-bone" href="#book">Book a consultation</a><a className="text-link" href="#work">View the work</a></div>
      </div>
      <div className="machine-stage" role="img" aria-label="An original black and chrome tattoo machine. Scroll to separate its frame, coils, grip and needle cartridge."><MachineScene key={sceneKey} motion={motion} registerInvalidate={registerInvalidate} /></div>
      <div className="technical-labels" aria-hidden="true"><span className="label-coil">coil <i /></span><span className="label-grip">grip <i /></span><span className="label-cartridge">cartridge <i /></span><span className="label-line">line weight <small>Intention, measured in millimetres.</small></span></div>
      <div className="hero-bottom mono"><a href="#studio">Scroll to open <span className="scroll-line" /></a><p>Considered in every detail.<br />Carried for a lifetime.</p><span>Custom work only</span></div>
      <div className="studio-reveal" aria-hidden="true"><Image src="/images/studio.webp" alt="" fill sizes="100vw" preload /><span className="reveal-caption">Step inside.</span></div>
    </div>
  </section>;
}
