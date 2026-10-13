'use client';

import { useEffect, useRef, useState } from 'react';
import './header.css';

const destinations = [
  { id: 'studio', label: 'Studio' },
  { id: 'artists', label: 'Artists' },
  { id: 'work', label: 'Work' },
  { id: 'visit', label: 'Visit' },
] as const;

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const toggle = useRef<HTMLButtonElement>(null);
  const brand = useRef<HTMLAnchorElement>(null);
  const navigation = useRef<HTMLElement>(null);

  useEffect(() => {
    let pending = false;
    const update = () => {
      pending = false;
      setScrolled(window.scrollY > 32);
      const position = window.innerHeight * .43;
      const current = [...destinations.map(item => item.id), 'book']
        .find(id => {
          const bounds = document.getElementById(id)?.getBoundingClientRect();
          return bounds ? bounds.top <= position && bounds.bottom > position : false;
        });
      setActive(current ?? '');
    };
    const schedule = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(update);
    };
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
      schedule();
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const firstLink = navigation.current?.querySelector<HTMLAnchorElement>('.nav-link');
    firstLink?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = [
        brand.current,
        ...Array.from(navigation.current?.querySelectorAll<HTMLAnchorElement>('a[href]') ?? []),
        toggle.current,
      ].filter((element): element is HTMLAnchorElement | HTMLButtonElement => Boolean(element));
      if (!focusable.length) return;

      const current = focusable.indexOf(document.activeElement as HTMLAnchorElement);
      if (event.shiftKey && current <= 0) {
        event.preventDefault();
        focusable[focusable.length - 1].focus();
      } else if (!event.shiftKey && current === focusable.length - 1) {
        event.preventDefault();
        focusable[0].focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <a className="skip-link" href="#studio">Skip introduction</a>
      <header className={`site-header${scrolled ? ' is-scrolled' : ''}${open ? ' is-menu-open' : ''}`}>
        <div className="header-frame">
          <a ref={brand} className="wordmark" href="#top" aria-label="Nocturne Tattoo House, return to top" onClick={closeMenu}>
            NOCTURNE<span>TATTOO HOUSE</span>
          </a>

          <nav ref={navigation} id="main-navigation" aria-label="Main navigation" className={open ? 'navigation is-open' : 'navigation'}>
            <div className="nav-mobile-intro mono" aria-hidden="true">
              <span>THE HOUSE DIRECTORY</span>
              <span>EST. IN INK</span>
            </div>
            <div className="nav-links">
              {destinations.map(({ id, label }) => (
                <a key={id} className="nav-link" href={`#${id}`} aria-current={active === id ? 'location' : undefined} onClick={closeMenu}>
                  <span className="nav-name">{label}</span>
                </a>
              ))}
            </div>
            <a className="nav-book nav-book-mobile" href="#book" aria-label="Start a tattoo enquiry" onClick={closeMenu}>
              <span>Enquire</span><span className="nav-book-mark" aria-hidden="true" />
            </a>
            <div className="nav-mobile-foot mono" aria-hidden="true">
              <span>PERSONAL WORK, MADE WITH YOU.</span><span>BY APPOINTMENT</span>
            </div>
          </nav>

          <a className="nav-book nav-book-desktop" href="#book" aria-label="Start a tattoo enquiry" aria-current={active === 'book' ? 'location' : undefined}>
            <span>Enquire</span><span className="nav-book-mark" aria-hidden="true" />
          </a>
          <button
            ref={toggle}
            type="button"
            className={open ? 'menu-toggle is-open' : 'menu-toggle'}
            aria-expanded={open}
            aria-controls="main-navigation"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setOpen(value => !value)}
          >
            <span className="menu-toggle-copy mono" aria-hidden="true">{open ? 'CLOSE' : 'MENU'}</span>
            <span className="menu-mark" aria-hidden="true"><i /><i /></span>
          </button>
        </div>
      </header>
    </>
  );
}
