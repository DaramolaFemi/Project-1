'use client';
import { useState, useEffect, useRef } from 'react';
const links = ['Studio', 'Artists', 'Work', 'Visit'];
export default function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); toggle.current?.focus(); } };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [open]);
  return <><a className="skip-link" href="#studio">Skip introduction</a><header className="site-header">
    <a href="#top" className="wordmark" aria-label="Nocturne Tattoo House home">NOCTURNE<span>TATTOO HOUSE</span></a>
    <button ref={toggle} className={open ? 'menu-toggle is-open' : 'menu-toggle'} aria-expanded={open} aria-controls="main-navigation" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>
      <span className="menu-mark" aria-hidden="true"><i /><i /></span>
    </button>
    <nav id="main-navigation" aria-label="Main navigation" className={open ? 'navigation is-open' : 'navigation'}>
      <a className="mobile-nav-brand" href="#top" onClick={() => setOpen(false)}>NOCTURNE<span>TATTOO HOUSE</span></a>
      {links.map(label => <a key={label} href={`#${label.toLowerCase()}`} onClick={() => setOpen(false)}>{label}</a>)}
      <a className="nav-book" href="#book" onClick={() => setOpen(false)}>Book <span className="nav-dot" /></a>
    </nav>
  </header></>;
}
