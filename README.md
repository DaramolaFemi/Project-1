# Nocturne Tattoo House

An editorial tattoo-house website built with Next.js, TypeScript, React Three Fiber, Three.js, and GSAP ScrollTrigger.

## Run

```sh
npm install
npm run dev
```

Open http://localhost:3000. For production: `npm run build && npm start`.

```sh
npm run lint
npm run typecheck
npm run build
```

Node 20.9 or newer is required (developed with Node 24).

## Source map

- `src/app/page.tsx`: server-rendered editorial sections and artist content.
- `src/app/globals.css`: art direction and responsive layouts.
- `src/app/layout.tsx`: self-hosted typography and metadata.
- `src/components/Hero.tsx`: 300svh native-scroll sticky sequence, reversible GSAP timeline, media-query cleanup.
- `src/components/MachineScene.tsx`: original geometric tattoo machine, environment light panels, demand rendering, capped DPR, mobile simplification, fixed mobile camera, reduced-motion still state.
- `src/components/Header.tsx`: responsive navigation and Escape handling.
- `src/components/Gallery.tsx`: six-image editorial gallery and native modal dialog, focus restoration, Escape and previous/next keyboard controls.
- `src/components/BookingForm.tsx`: appointment-request interface with a copyable consultation note.
- `public/images/`: compressed WebP photography and art-direction assets.
- `docs/art-direction.md`: visual decisions.
- `scripts/verify-browser.mjs`: local regression checks using the `agent-browser` CLI. Set `NOCTURNE_BROWSER_CLI` if it is not on your PATH; run with the dev server on port 3000.

## Launch checklist

Confirm studio contact details and connect the preferred booking workflow before launch.

Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin for social metadata.

The 3D scene requires WebGL; a text composition remains if WebGL initialization fails. Reduced-motion users get a composed still machine and normal-length introduction. Mobile uses fewer coil rings and screws, a stable camera, and scaled separation instead of camera travel.

Run `npm run typecheck` and `npm run build` before release.
