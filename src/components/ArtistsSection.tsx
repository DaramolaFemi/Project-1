'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const ARTISTS = [
  { id: 'amara', name: 'Amara Vale', specialty: 'Fine line / botanical', work: 'botanical', description: 'Amara leaves room for the skin to breathe. Her fine-line plants are drawn slowly, with as much care for the open space as the ink.', sample: 'Fine botanical linework on a forearm' },
  { id: 'eli', name: 'Eli Mercer', specialty: 'Blackwork / illustrative', work: 'moth', description: 'Eli comes from printmaking. He builds his images in dark shapes and fine cuts, so every small detail has somewhere to sit.', sample: 'A detailed blackwork moth on an upper arm' },
  { id: 'santi', name: 'Santi Reyes', specialty: 'Colour / neo-traditional', work: 'peony', description: 'Santi draws bold, familiar forms, then makes them his own with a quieter eye for colour and how it settles into skin.', sample: 'A burgundy neo-traditional peony on brown skin' },
];

export default function ArtistsSection() {
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeArtist, setActiveArtist] = useState(0);

  useEffect(() => {
    const cards = cardRefs.current.filter((card): card is HTMLElement => card !== null);
    if (!cards.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cards.forEach((card) => card.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const card = entry.target as HTMLElement;
        card.classList.add('is-visible');
        if (entry.intersectionRatio >= 0.42) setActiveArtist(Number(card.dataset.index));
      });
    }, { threshold: [0.2, 0.42, 0.7], rootMargin: '-10% 0px -18% 0px' });

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const active = ARTISTS[activeArtist];

  return (
    <section id="artists" className="artists">
      <div className="section-wrap artists-shell">
        <aside className="artists-rail">
          <div className="section-heading"><p className="section-label">The artists</p><span className="mono">Three artists. Three ways of seeing.</span></div>
          <p className="artists-overline mono">Resident artists / 01—03</p>
          <h2>Different hands.<br />Different marks.</h2>
          <p className="artists-rail-copy">Take a look around. See whose work speaks to you.</p>
          <div className="artists-active" aria-live="polite"><span className="mono">0{activeArtist + 1} / 03</span><p>{active.name}</p><span className="mono">{active.specialty}</span></div>
        </aside>

        <div className="artists-track">
          {ARTISTS.map((artist, index) => (
            <article key={artist.id} ref={(element) => { cardRefs.current[index] = element; }} data-index={index} className={`artist-card artist-card-${artist.id}`}>
              <div className="artist-image-stage">
                <span className="artist-number mono">0{index + 1}</span>
                <div className="artist-portrait-frame"><Image src={`/images/${artist.id}.webp`} alt={`${artist.name}, resident tattoo artist, photographed candidly in the studio`} fill sizes="(max-width: 767px) 90vw, 48vw" /></div>
                <a href="#work" className="artist-sample-frame" aria-label={`Explore ${artist.name}'s work`}><Image src={`/images/work-${artist.work}.webp`} alt={artist.sample} fill sizes="(max-width: 767px) 36vw, 18vw" /><span className="mono">See their work</span></a>
              </div>
              <div className="artist-copy"><p className="mono">{artist.specialty}</p><h3>{artist.name}</h3><p>{artist.description}</p><a href="#book" className="text-link">Ask for {artist.name.split(' ')[0]}</a></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
