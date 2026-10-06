# Nocturne Tattoo House

A standalone Next.js portfolio site for a fictional contemporary tattoo atelier. Built with the App Router, TypeScript, intentional CSS, React Three Fiber, Drei, Three.js, and GSAP ScrollTrigger. No downloaded 3D model, video, smooth-scroll library, or external image dependency.

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
- `src/components/BookingForm.tsx`: browser-only enquiry preparation and clipboard copy. No network submission or persistent personal-data storage.
- `public/images/`: eleven inspected, individually generated and compressed WebP photographs (about 1.4 MB total).
- `docs/image-prompts.json`: image-generation prompts and provenance. Created with the built-in image-generation tool. Local source paths are provenance only; the website uses the committed WebP files.
- `docs/art-direction.md`: visual decisions.
- `docs/qa/`: responsive screenshots and verification evidence.
- `scripts/verify-browser.mjs`: local regression checks using the `agent-browser` CLI. Set `NOCTURNE_BROWSER_CLI` if it is not on your PATH; run with the dev server on port 3000.

## Before launching a real studio

Replace the deliberately unassigned address, reserved `.example` contact, and illustrative opening hours with verified details. Connect a real booking service if submissions are required, then update the clear UI-only form messaging. The site does not claim to have sent an enquiry.

Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin for social metadata. Search indexing is disabled while this is a fictional portfolio concept; change `robots` in `layout.tsx` when appropriate. Artist identities and photography are fictional/generated and disclosed in the footer.

The 3D scene requires WebGL; a text composition remains if WebGL initialization fails. Reduced-motion users get a composed still machine and normal-length introduction. Mobile uses fewer coil rings and screws, a stable camera, and scaled separation instead of camera travel.

## Verification

See `docs/verification.md` for the completed checks and their practical limits. The automated interaction and motion scripts are `scripts/verify-interactions.mjs` and `scripts/verify-motion.mjs`.
