'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

export default function VisitSection() {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const current = section.current;
    if (!current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        current.classList.add('is-visible');
        observer.disconnect();
      }
    }, { threshold: .18, rootMargin: '0px 0px -8%' });
    observer.observe(current);
    return () => observer.disconnect();
  }, []);

  return <section ref={section} id="visit" className="visit">
    <div className="section-wrap visit-wrap">
      <div className="section-heading"><p className="section-label">Come by</p><span className="mono">The room, before the appointment.</span></div>
      <div className="visit-intro"><h2>Come in before<br />you decide<span className="period">.</span></h2><p>You do not need a finished design for the first conversation. Bring the reference, the memory, the question—or nothing at all.</p></div>
      <div className="visit-stage">
        <figure className="visit-image">
          <Image src="/images/visit.webp" alt="An open botanical sketchbook on a worn oak consultation table beside a tall studio window" fill sizes="(max-width: 767px) 92vw, 68vw" />
          <figcaption className="visit-image-note mono">The consultation table / a place to begin</figcaption>
        </figure>
        <aside className="visit-note">
          <p className="mono">Before the ink</p>
          <p>We leave enough room for a real conversation—placement, scale, aftercare, and whether the idea is ready yet.</p>
        </aside>
      </div>
      <div className="visit-details">
        <div><span className="mono">Visit</span><p>By appointment only<br />Lagos, Nigeria</p></div>
        <div><span className="mono">Hours</span><p>Tuesday—Saturday<br />11:00—19:00</p></div>
        <div><span className="mono">Write</span><a href="mailto:booking@nocturne.example">booking@nocturne.example</a></div>
        <a className="visit-book" href="#book"><span>Start the conversation</span><b className="mono">IV</b></a>
      </div>
    </div>
  </section>;
}
