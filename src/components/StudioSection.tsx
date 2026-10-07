'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

export default function StudioSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      section.classList.add('is-in-view');
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      section.classList.add('is-in-view');
      observer.disconnect();
    }, { threshold: 0.16 });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="studio" className="studio">
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

        <figure className="studio-photo">
          <Image src="/images/studio-cinematic.webp" alt="A sunlit tattoo chair in a working atelier, with sketches, ink, plants and an artist preparing the room" fill sizes="(max-width: 767px) 100vw, 92vw" />
          <figcaption className="photo-note">A look around the studio.</figcaption>
        </figure>

        <div className="studio-foot mono"><span>One client at a time</span><span>By appointment</span></div>
      </div>
    </section>
  );
}
