'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function StudioSection() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!section.current || !stage.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({
      desktop: '(min-width: 768px)',
      mobile: '(max-width: 767px)',
      reduce: '(prefers-reduced-motion: reduce)',
    }, context => {
      const { desktop, reduce } = context.conditions!;
      if (reduce) return;

      const scope = gsap.context(() => {
        gsap.fromTo('.studio-statement h2 .studio-line-inner',
          { yPercent: 105 },
          { yPercent: 0, stagger: .14, duration: 1.05, ease: 'power3.out',
            scrollTrigger: { trigger: '.studio-statement', start: 'top 85%', once: true } });
        gsap.fromTo('.studio-statement-copy > *',
          { y: 34, opacity: 0 },
          { y: 0, opacity: 1, stagger: .13, duration: .85, ease: 'power2.out',
            scrollTrigger: { trigger: '.studio-statement', start: 'top 77%', once: true } });

        if (desktop) {
          const timeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: '.studio-cinema-track',
              start: 'top top',
              end: 'bottom bottom',
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
          timeline.fromTo('.studio-cinema-primary',
            { clipPath: 'inset(7% 12% 7% 12% round 2px)', scale: .94 },
            { clipPath: 'inset(0% 0% 0% 0% round 0px)', scale: 1, duration: .30 }, 0)
            .fromTo('.studio-cinema-primary img',
              { scale: 1.18, yPercent: -3 },
              { scale: 1.04, yPercent: 3, duration: 1 }, 0)
            .fromTo('.studio-cinema-detail',
              { xPercent: 48, yPercent: 38, rotation: 7, scale: .74, opacity: 0 },
              { xPercent: 0, yPercent: 0, rotation: -2, scale: 1, opacity: 1, duration: .46 }, .22)
            .to('.studio-cinema-detail',
              { xPercent: -9, yPercent: -9, rotation: 0, scale: 1.08, duration: .30 }, .68)
            .fromTo('.studio-cinema-caption',
              { y: 25, opacity: 0 },
              { y: 0, opacity: 1, duration: .24 }, .30)
            .to('.studio-cinema-vignette', { opacity: .68, duration: .38 }, .62)
            .fromTo('.studio-cinema-outro',
              { y: 34, opacity: 0 },
              { y: 0, opacity: 1, duration: .30 }, .65);
        } else {
          gsap.fromTo('.studio-cinema-primary',
            { clipPath: 'inset(0 0 18% 0)', y: 36 },
            { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 1.15, ease: 'power3.out',
              scrollTrigger: { trigger: '.studio-cinema-track', start: 'top 80%', once: true } });
          gsap.fromTo('.studio-cinema-detail',
            { x: 48, y: 44, rotation: 5, opacity: 0 },
            { x: 0, y: 0, rotation: -2, opacity: 1, duration: 1.05, ease: 'power3.out',
              scrollTrigger: { trigger: '.studio-cinema-track', start: 'top 60%', once: true } });
        }
      }, section);
      return () => scope.revert();
    });
    return () => media.revert();
  }, []);

  return (
    <section ref={section} id="studio" className="studio studio-editorial">
      <div className="section-wrap studio-wrap">
        <div className="section-heading">
          <p className="section-label">The house</p>
          <span className="mono">01 / A good place to start.</span>
        </div>
        <div className="studio-statement">
          <h2>
            <span className="studio-line"><span className="studio-line-inner">The needle</span></span>
            <span className="studio-line"><span className="studio-line-inner">can wait<span className="period">.</span></span></span>
          </h2>
          <div className="studio-statement-copy">
            <p className="lead">First, we want to hear what brought you here.</p>
            <p>Some people arrive with a drawing. Some bring an old photograph and a sentence they have been carrying for years. Both are a start.</p>
            <p>We talk through the idea, the placement, and what you want the piece to hold. No rush to book. No pressure to have it all figured out.</p>
          </div>
        </div>
      </div>

      <div ref={stage} className="studio-cinema-track">
        <div className="studio-cinema-sticky">
          <div className="studio-cinema-primary">
            <Image src="/images/studio-cinematic.webp" alt="Tattoo chair and supplies in a warmly lit studio atelier" fill sizes="(max-width: 767px) 100vw, 100vw" />
            <div className="studio-cinema-vignette" aria-hidden="true" />
            <div className="studio-cinema-top mono" aria-hidden="true"><span>NOCTURNE / THE HOUSE</span><span>01 — 03</span></div>
            <p className="studio-cinema-caption mono">A look around the studio.</p>
            <div className="studio-cinema-outro">
              <span className="mono">AN INVITATION, NOT A DEADLINE</span>
              <p>One client.<br /><em>All the time it takes.</em></p>
            </div>
          </div>
          <figure className="studio-cinema-detail">
            <Image src="/images/studio.webp" alt="Warm afternoon light falling over the tattoo studio's work area" fill sizes="(max-width: 767px) 48vw, 29vw" />
            <figcaption className="mono">02 / A quieter corner</figcaption>
          </figure>
        </div>
      </div>

      <div className="section-wrap studio-closing mono">
        <span>One client at a time</span>
        <span>By appointment</span>
      </div>
    </section>
  );
}
