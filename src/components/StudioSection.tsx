'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function StudioSection() {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!section.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({
      desktop: '(min-width: 768px)',
      mobile: '(max-width: 767px)',
      reduced: '(prefers-reduced-motion: reduce)',
    }, (context) => {
      if (context.conditions?.reduced) return;
      const animation = gsap.context(() => {
        gsap.fromTo('.studio-line-inner', { yPercent: 102 }, {
          yPercent: 0, duration: 1.1, stagger: .16, ease: 'power3.out',
          scrollTrigger: { trigger: '.studio-intro', start: 'top 84%', once: true },
        });
        gsap.fromTo('.studio-intro-copy > p', { y: 20, opacity: 0 }, {
          y: 0, opacity: 1, duration: .8, stagger: .14, ease: 'power2.out',
          scrollTrigger: { trigger: '.studio-intro', start: 'top 75%', once: true },
        });
        gsap.fromTo('.studio-film-image', { scale: 1.14, yPercent: -3 }, {
          scale: 1.03, yPercent: 3, ease: 'none',
          scrollTrigger: { trigger: '.studio-film', start: 'top bottom', end: 'bottom top', scrub: 1 },
        });
        gsap.fromTo('.studio-film-detail', {
          yPercent: 14, rotation: 3, scale: .92,
        }, {
          yPercent: -8, rotation: 0, scale: 1, ease: 'none',
          scrollTrigger: { trigger: '.studio-film', start: 'top 90%', end: 'bottom 15%', scrub: .85 },
        });
        gsap.fromTo('.studio-film-words', { y: 48, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.studio-film', start: 'top 61%', once: true },
        });
      }, section);
      return () => animation.revert();
    });
    return () => media.revert();
  }, []);

  return (
    <section ref={section} id="studio" className="studio studio-renewed" aria-labelledby="studio-title">
      <div className="studio-intro section-wrap">
        <div className="section-heading">
          <p className="section-label">The house</p>
          <span className="mono">A good place to start.</span>
        </div>
        <div className="studio-intro-grid">
          <h2 id="studio-title">
            <span className="studio-line"><span className="studio-line-inner">The needle</span></span>
            <span className="studio-line"><span className="studio-line-inner">can wait<span className="period">.</span></span></span>
          </h2>
          <div className="studio-intro-copy">
            <p className="studio-lead">First, we want to hear what brought you here.</p>
            <p>Some people arrive with a drawing. Some bring an old photograph and a sentence they have been carrying for years. Both are a start.</p>
            <p>We talk through the idea, the placement, and what you want the piece to hold. No rush to book. No pressure to have it all figured out.</p>
          </div>
        </div>
      </div>

      <div className="studio-film" aria-label="A look inside the studio">
        <div className="studio-film-image">
          <Image
            src="/images/studio-cinematic.webp"
            alt="Tattoo chair, framed drawings and equipment in the warm afternoon light of the studio"
            fill
            sizes="100vw"
          />
        </div>
        <div className="studio-film-shade" aria-hidden="true" />
        <div className="studio-film-meta mono" aria-hidden="true">
          <span>NOCTURNE / THE HOUSE</span><span>01 — THE ROOM</span>
        </div>
        <div className="studio-film-words">
          <span className="mono">MADE WITH TIME, NOT HASTE</span>
          <p>One client.<br /><em>All the time it takes.</em></p>
        </div>
        <figure className="studio-film-detail">
          <Image
            src="/images/studio.webp"
            alt="Window light over a quieter corner of the tattoo studio"
            fill
            sizes="(max-width: 767px) 44vw, 27vw"
          />
          <figcaption className="mono">02 / A quieter corner</figcaption>
        </figure>
        <span className="studio-film-index mono">A look around the studio.</span>
      </div>

      <div className="studio-bridge">
        <div className="section-wrap studio-bridge-inner mono">
          <span>One client at a time</span>
          <span>By appointment</span>
        </div>
      </div>
    </section>
  );
}
