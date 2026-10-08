 'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

export default function StudioSection() {
  const section = useRef<HTMLElement>(null);
  const images = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = section.current;
    const imageStage = images.current;
    if (!current || !imageStage) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;

    const updateDetailMotion = () => {
      frame = 0;
      if (reducedMotion.matches) return;
      const bounds = imageStage.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      const compact = window.matchMedia('(max-width: 767px)').matches;
      const progress = compact
        ? Math.min(1, Math.max(0, -bounds.top / Math.max(1, bounds.height - viewHeight * .72)))
        : Math.min(1, Math.max(0, (viewHeight * .88 - bounds.top) / (bounds.height * .7 + viewHeight * .18)));
      const detailProgress = compact ? progress : Math.min(1, progress * 1.45);
      imageStage.style.setProperty('--detail-progress', String(detailProgress));
      imageStage.style.setProperty('--detail-opacity', String(compact ? .12 + detailProgress * .88 : detailProgress));
      imageStage.style.setProperty('--detail-x', `${compact ? 148 - detailProgress * 210 : (1 - detailProgress) * 72}px`);
      imageStage.style.setProperty('--detail-y', `${compact ? 164 - detailProgress * 194 : (1 - detailProgress) * 72}px`);
      imageStage.style.setProperty('--detail-rotation', `${compact ? 11 - detailProgress * 13 : (1 - detailProgress) * 6}deg`);
      imageStage.style.setProperty('--detail-scale', String(compact ? .46 + detailProgress * .72 : .72 + detailProgress * .28));
    };
    const requestDetailMotion = () => {
      if (!frame) frame = requestAnimationFrame(updateDetailMotion);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        current.classList.add('is-visible');
        observer.disconnect();
      }
    }, { threshold: .14, rootMargin: '0px 0px -9%' });
    current.classList.add('studio-motion-ready');
    observer.observe(imageStage);
    updateDetailMotion();
    window.addEventListener('scroll', requestDetailMotion, { passive: true });
    window.addEventListener('resize', requestDetailMotion);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestDetailMotion);
      window.removeEventListener('resize', requestDetailMotion);
      current.classList.remove('studio-motion-ready');
    };
  }, []);

  return (
    <section ref={section} id="studio" className="studio">
      <div className="section-wrap studio-wrap">
        <div className="section-heading">
          <p className="section-label">The house</p>
          <span className="mono">A good place to start.</span>
        </div>

        <div className="studio-statement">
          <h2>The needle<br />can wait<span className="period">.</span></h2>
          <div>
            <p className="lead">First, we want to hear what brought you here.</p>
            <p>Some people arrive with a drawing. Some bring an old photograph and a sentence they have been carrying for years. Both are a start.</p>
            <p>We talk through the idea, the placement, and what you want the piece to hold. No rush to book. No pressure to have it all figured out.</p>
          </div>
        </div>

        <div ref={images} className="studio-images">
          <div className="studio-image-canvas">
            <figure className="studio-photo studio-photo-primary">
              <Image src="/images/studio-cinematic.webp" alt="A sunlit tattoo chair in a working atelier, with sketches, ink, plants and an artist preparing the room" fill sizes="(max-width: 767px) 92vw, 66vw" />
              <div className="studio-film-strip" aria-hidden="true">
                <span><Image src="/images/studio.webp" alt="" fill sizes="110px" /></span>
                <span><Image src="/images/hero-workbench.webp" alt="" fill sizes="110px" /></span>
              </div>
              <figcaption className="photo-note">A look around the studio.</figcaption>
            </figure>
            <figure className="studio-photo studio-photo-detail">
              <Image src="/images/studio.webp" alt="Tattoo chairs and afternoon light inside the studio" fill sizes="(max-width: 767px) 42vw, 27vw" />
              <figcaption className="studio-image-index mono">01 / the room</figcaption>
            </figure>
          </div>
        </div>

        <div className="studio-foot mono"><span>One client at a time</span><span>By appointment</span></div>
      </div>
    </section>
  );
}
