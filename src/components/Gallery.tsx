'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const works = [
  { image: 'botanical', title: 'Cosmos & fern', artist: 'Amara Vale', style: 'Fine line / botanical', placement: 'Inner forearm', alt: 'Delicate healed cosmos flowers and fern linework on an olive-toned forearm', note: 'The stems follow the length of the arm. The open skin is part of the drawing.' },
  { image: 'moth', title: 'Night moth', artist: 'Eli Mercer', style: 'Blackwork / illustrative', placement: 'Upper arm', alt: 'Healed blackwork moth with intricate crescent markings on a freckled upper arm', note: 'Cut like a small woodblock print: dark wings, fine marks, and enough space for each detail to read.' },
  { image: 'peony', title: 'Peony study', artist: 'Santi Reyes', style: 'Colour / neo-traditional', placement: 'Upper arm', alt: 'Muted burgundy peony tattoo with olive leaves on brown skin', note: 'A deep red peony drawn around the shoulder. The colour is chosen to settle gently into the skin.' },
  { image: 'swallow', title: 'A swallow in flight', artist: 'Eli Mercer', style: 'Blackwork / illustrative', placement: 'Shoulder blade', alt: 'Small illustrative swallow tattoo across a freckled shoulder blade', note: 'A small study in movement. Each feather has room to hold its shape as the tattoo ages.' },
  { image: 'iris', title: 'Iris stem', artist: 'Amara Vale', style: 'Fine line / botanical', placement: 'Outer calf', alt: 'Fine black iris flower and long leaves tattooed on a dark-skinned calf', note: 'One long stem, placed to follow the natural line of the leg.' },
  { image: 'tiger', title: 'Tiger, in ochre', artist: 'Santi Reyes', style: 'Colour / neo-traditional', placement: 'Outer thigh', alt: 'Healed ochre and rust neo-traditional tiger tattoo on a tan thigh', note: 'A familiar subject with its own expression: warm ochre, a strong outline, and a softer gaze.' },
];

export default function Gallery() {
  const gallery = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const originalOverflow = useRef('');
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!gallery.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const scope = gsap.context(() => {
        const tiles = gsap.utils.toArray<HTMLElement>('.work-tile');
        tiles.forEach((tile) => {
          const picture = tile.querySelector('.work-tile-image');
          const caption = tile.querySelector('.work-tile-caption');
          if (!picture || !caption) return;

          const reveal = gsap.timeline({
            scrollTrigger: {
              trigger: tile,
              start: 'top 92%',
              once: true,
            },
          });
          reveal.fromTo(picture,
            { clipPath: 'inset(0 0 24% 0)' },
            { clipPath: 'inset(0 0 0% 0)', duration: .95, ease: 'power3.out' }, 0)
            .fromTo(picture.querySelector('.work-tile-media'),
              { scale: 1.09 },
              { scale: 1, duration: 1.3, ease: 'power3.out' }, 0)
            .fromTo(caption,
              { y: 18, opacity: 0 },
              { y: 0, opacity: 1, duration: .65, ease: 'power2.out' }, .22);
        });
      }, gallery);
      return () => scope.revert();
    });

    return () => media.revert();
  }, []);

  const open = (index: number, trigger: HTMLButtonElement) => {
    setSelected(index);
    lastTrigger.current = trigger;
    originalOverflow.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.showModal();
  };

  const close = () => dialog.current?.close();
  const move = (direction: number) => setSelected(index => (index + direction + works.length) % works.length);
  const current = works[selected];

  return (
    <>
      <div ref={gallery} className="work-wall" aria-label="Six selected tattoos">
        {works.map((work, index) => (
          <article key={work.image} className={`work-tile work-tile-${index + 1}`}>
            <div className="work-tile-overline mono">
              <span>{String(index + 1).padStart(2, '0')} / 06</span>
              <span>{work.style}</span>
            </div>
            <button type="button" className="work-tile-image" onClick={event => open(index, event.currentTarget)} aria-label={`View ${work.title} by ${work.artist}, including artist and placement details`}>
              <span className="work-tile-media"><Image src={`/images/work-${work.image}.webp`} alt={work.alt} fill sizes={index === 0 ? '(max-width: 767px) 92vw, (min-width: 1800px) 750px, 48vw' : index < 3 ? '(max-width: 767px) 92vw, (min-width: 1800px) 375px, 24vw' : '(max-width: 767px) 92vw, (min-width: 1800px) 510px, 32vw'} /></span>
              <span className="work-tile-action mono" aria-hidden="true"><span>View the work</span><span>+</span></span>
            </button>
            <div className="work-tile-caption">
              <h3>{work.title}</h3>
              <div className="work-tile-byline">
                <span>{work.artist}</span>
                <span className="mono">{work.placement}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <dialog ref={dialog} className="lightbox" aria-labelledby="artwork-title" aria-describedby="artwork-detail"
        onClose={() => { document.body.style.overflow = originalOverflow.current; lastTrigger.current?.focus(); }}
        onClick={event => { if (event.target === event.currentTarget) close(); }}
        onKeyDown={event => { if (event.key === 'ArrowRight') move(1); if (event.key === 'ArrowLeft') move(-1); }}>
        <div className="lightbox-layout">
          <button className="lightbox-close text-link" onClick={close} autoFocus>Close</button>
          <div className="lightbox-photo">
            <Image src={`/images/work-${current.image}.webp`} alt={current.alt} fill sizes="(max-width: 767px) 90vw, 60vw" />
          </div>
          <div className="lightbox-copy" aria-live="polite">
            <p className="mono">Selected work / {String(selected + 1).padStart(2, '0')}</p>
            <h2 id="artwork-title">{current.title}</h2>
            <p id="artwork-detail">{current.note}</p>
            <dl>
              <div><dt>Artist</dt><dd>{current.artist}</dd></div>
              <div><dt>Discipline</dt><dd>{current.style}</dd></div>
              <div><dt>Placement</dt><dd>{current.placement}</dd></div>
            </dl>
            <div className="lightbox-controls">
              <button onClick={() => move(-1)}>Previous</button>
              <span>{selected + 1} / {works.length}</span>
              <button onClick={() => move(1)}>Next</button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
