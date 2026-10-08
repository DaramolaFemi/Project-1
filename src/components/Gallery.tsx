'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
export const works = [
  { image: 'botanical', title: 'Cosmos & fern', artist: 'Amara Vale', style: 'Fine line / botanical', placement: 'Inner forearm', alt: 'Delicate healed cosmos flowers and fern linework on an olive-toned forearm', note: 'The stems follow the length of the arm. The open skin is part of the drawing.' },
  { image: 'moth', title: 'Night moth', artist: 'Eli Mercer', style: 'Blackwork / illustrative', placement: 'Upper arm', alt: 'Healed blackwork moth with intricate crescent markings on a freckled upper arm', note: 'Cut like a small woodblock print: dark wings, fine marks, and enough space for each detail to read.' },
  { image: 'peony', title: 'Peony study', artist: 'Santi Reyes', style: 'Colour / neo-traditional', placement: 'Upper arm', alt: 'Muted burgundy peony tattoo with olive leaves on brown skin', note: 'A deep red peony drawn around the shoulder. The colour is chosen to settle gently into the skin.' },
  { image: 'swallow', title: 'A swallow in flight', artist: 'Eli Mercer', style: 'Blackwork / illustrative', placement: 'Shoulder blade', alt: 'Small illustrative swallow tattoo across a freckled shoulder blade', note: 'A small study in movement. Each feather has room to hold its shape as the tattoo ages.' },
  { image: 'iris', title: 'Iris stem', artist: 'Amara Vale', style: 'Fine line / botanical', placement: 'Outer calf', alt: 'Fine black iris flower and long leaves tattooed on a dark-skinned calf', note: 'One long stem, placed to follow the natural line of the leg.' },
  { image: 'tiger', title: 'Tiger, in ochre', artist: 'Santi Reyes', style: 'Colour / neo-traditional', placement: 'Outer thigh', alt: 'Healed ochre and rust neo-traditional tiger tattoo on a tan thigh', note: 'A familiar subject with its own expression: warm ochre, a strong outline, and a softer gaze.' },
];
export default function Gallery() {
  const [selected, setSelected] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const originalOverflow = useRef('');

  useEffect(() => {
    const records = document.querySelectorAll<HTMLElement>('[data-work-record]');
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }),
      { threshold: .2, rootMargin: '0px 0px -8%' },
    );
    records.forEach(record => observer.observe(record));
    return () => observer.disconnect();
  }, []);
  const open = (index: number, trigger: HTMLButtonElement) => {
    setSelected(index); lastTrigger.current = trigger;
    originalOverflow.current = document.body.style.overflow;
    document.body.style.setProperty('overflow', 'hidden'); dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();
  const move = (direction: number) => setSelected(index => (index + direction + works.length) % works.length);
  const current = works[selected];
  return <>
    <div className="work-records">{works.map((work, index) => <article key={work.image} className={`work-record work-record-${index + 1}`} data-work-record>
      <div className="work-record-index" aria-hidden="true"><span>{String(index + 1).padStart(2, '0')}</span><i /></div>
      <button className="work-record-image" aria-label={`View ${work.title} by ${work.artist}`} onClick={e => open(index, e.currentTarget)}>
        <Image src={`/images/work-${work.image}.webp`} alt={work.alt} fill sizes="(max-width: 767px) 88vw, 58vw" />
        <span className="work-record-view"><span>Open tattoo note</span><b>+</b></span>
      </button>
      <div className="work-record-copy">
        <p className="mono">{work.style}</p>
        <h3>{work.title}</h3>
        <p>{work.note}</p>
        <dl>
          <div><dt>Drawn by</dt><dd>{work.artist}</dd></div>
          <div><dt>Placed at</dt><dd>{work.placement}</dd></div>
        </dl>
      </div>
    </article>)}</div>
    <dialog ref={dialog} className="lightbox" aria-labelledby="artwork-title" aria-describedby="artwork-detail" onClose={() => { document.body.style.setProperty('overflow', originalOverflow.current); lastTrigger.current?.focus(); }} onClick={event => { if (event.target === event.currentTarget) close(); }} onKeyDown={event => { if (event.key === 'ArrowRight') move(1); if (event.key === 'ArrowLeft') move(-1); }}>
      <div className="lightbox-layout"><button className="lightbox-close text-link" onClick={close} autoFocus>Close</button><div className="lightbox-photo"><Image src={`/images/work-${current.image}.webp`} alt={current.alt} fill sizes="(max-width: 767px) 90vw, 60vw" /></div><div className="lightbox-copy" aria-live="polite"><p className="mono">Selected work / {String(selected + 1).padStart(2, '0')}</p><h2 id="artwork-title">{current.title}</h2><p id="artwork-detail">{current.note}</p><dl><div><dt>Artist</dt><dd>{current.artist}</dd></div><div><dt>Discipline</dt><dd>{current.style}</dd></div><div><dt>Placement</dt><dd>{current.placement}</dd></div></dl><div className="lightbox-controls"><button onClick={() => move(-1)}>Previous</button><span>{selected + 1} / {works.length}</span><button onClick={() => move(1)}>Next</button></div></div></div>
    </dialog>
  </>;
}
