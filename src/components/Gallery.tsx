'use client';
import Image from 'next/image';
import { useRef, useState } from 'react';
export const works = [
  { image: 'botanical', title: 'Wild, quietly.', artist: 'Amara Vale', style: 'Fine line / botanical', placement: 'Inner forearm', alt: 'Delicate healed cosmos flowers and fern linework on an olive-toned forearm', note: 'A light composition that follows the length of the arm. Open space is part of the drawing.' },
  { image: 'moth', title: 'After dark.', artist: 'Eli Mercer', style: 'Blackwork / illustrative', placement: 'Upper arm', alt: 'Healed blackwork moth with intricate crescent markings on a freckled upper arm', note: 'Woodcut-inspired wings, held in balance. Dense black gives the finer detail room to breathe.' },
  { image: 'peony', title: 'In full bloom.', artist: 'Santi Reyes', style: 'Colour / neo-traditional', placement: 'Upper arm', alt: 'Muted burgundy peony tattoo with olive leaves on brown skin', note: 'A deep red peony built around the curve of the shoulder. Colour chosen to settle softly into skin.' },
  { image: 'swallow', title: 'Somewhere, home.', artist: 'Eli Mercer', style: 'Blackwork / illustrative', placement: 'Shoulder blade', alt: 'Small illustrative swallow tattoo across a freckled shoulder blade', note: 'A small study of movement. Each feather is drawn with enough room for the piece to age.' },
  { image: 'iris', title: 'A softer kind of strong.', artist: 'Amara Vale', style: 'Fine line / botanical', placement: 'Outer calf', alt: 'Fine black iris flower and long leaves tattooed on a dark-skinned calf', note: 'One stem, an unhurried line. A botanical piece composed for the natural shape of the leg.' },
  { image: 'tiger', title: 'Quiet instinct.', artist: 'Santi Reyes', style: 'Colour / neo-traditional', placement: 'Outer thigh', alt: 'Healed ochre and rust neo-traditional tiger tattoo on a tan thigh', note: 'Warm ochre and strong outlines. A familiar motif drawn with its own expression.' },
];
export default function Gallery() {
  const [selected, setSelected] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const originalOverflow = useRef('');
  const open = (index: number, trigger: HTMLButtonElement) => {
    setSelected(index); lastTrigger.current = trigger;
    originalOverflow.current = document.body.style.overflow;
    document.body.style.setProperty('overflow', 'hidden'); dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();
  const move = (direction: number) => setSelected(index => (index + direction + works.length) % works.length);
  const current = works[selected];
  return <>
    <div className="work-grid">{works.map((work, index) => <figure key={work.image} className={`work work-${index + 1}`}>
      <button className="work-image" aria-label={`View ${work.title} by ${work.artist}`} onClick={e => open(index, e.currentTarget)}><Image src={`/images/work-${work.image}.webp`} alt={work.alt} fill sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 42vw" /><span className="view-work">View piece <span>+</span></span></button>
      <figcaption><span>{work.title}</span><span>{work.artist}</span></figcaption>
    </figure>)}</div>
    <dialog ref={dialog} className="lightbox" aria-labelledby="artwork-title" aria-describedby="artwork-detail" onClose={() => { document.body.style.setProperty('overflow', originalOverflow.current); lastTrigger.current?.focus(); }} onClick={event => { if (event.target === event.currentTarget) close(); }} onKeyDown={event => { if (event.key === 'ArrowRight') move(1); if (event.key === 'ArrowLeft') move(-1); }}>
      <div className="lightbox-layout"><button className="lightbox-close text-link" onClick={close} autoFocus>Close</button><div className="lightbox-photo"><Image src={`/images/work-${current.image}.webp`} alt={current.alt} fill sizes="(max-width: 767px) 90vw, 60vw" /></div><div className="lightbox-copy" aria-live="polite"><p className="mono">Selected work / {String(selected + 1).padStart(2, '0')}</p><h2 id="artwork-title">{current.title}</h2><p id="artwork-detail">{current.note}</p><dl><div><dt>Artist</dt><dd>{current.artist}</dd></div><div><dt>Discipline</dt><dd>{current.style}</dd></div><div><dt>Placement</dt><dd>{current.placement}</dd></div></dl><div className="lightbox-controls"><button onClick={() => move(-1)}>Previous</button><span>{selected + 1} / {works.length}</span><button onClick={() => move(1)}>Next</button></div></div></div>
    </dialog>
  </>;
}
