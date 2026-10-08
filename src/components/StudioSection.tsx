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
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        current.classList.add('is-visible');
        observer.disconnect();
      }
    }, { threshold: .14, rootMargin: '0px 0px -9%' });
    observer.observe(imageStage);
    return () => observer.disconnect();
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

        <div className="studio-foot mono"><span>One client at a time</span><span>By appointment</span></div>
      </div>
    </section>
  );
}
