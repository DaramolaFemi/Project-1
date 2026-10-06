# Verification

Completed in Chromium at 1440 × 1000, 768 × 1024, and 390 × 844.

- `npm run lint`: passed.
- `npm run typecheck`: passed; the final production build also completed TypeScript checking.
- `npm run build`: passed; route `/` prerendered successfully with no build warnings.
- All seven sections visually inspected at each target width. Visible images loaded successfully, with no horizontal overflow in any checked section.
- Original 3D machine and exploded composition inspected on desktop and mobile. Mobile uses a stable camera and simplified geometry.
- Native scroll sequence tested forward and backward at 0, 600, 1100, 1800, and 2000 pixels on desktop. Matching positions returned matching timeline values, including the exact assembled initial state.
- Rapid alternating scroll jumps returned correctly to the initial composition, without browser errors.
- Refresh at the middle of the sequence restored the appropriate pose and labels.
- Responsive resize across desktop, tablet, and mobile rebuilt the appropriate scene and timeline.
- Reduced motion removed the 300svh sequence and retained a still, rendered instrument with visible content.
- Mobile menu: opens, closes after navigation, Escape returns focus to its toggle.
- Gallery: keyboard activation, next/previous keys, focus containment, Escape, and return to the initiating image verified.
- Enquiry: native validation, preparation, artist selection, and honest unsent confirmation verified. Clipboard success or explicit manual-copy fallback verified.
- axe-core 4.12.1 initial-page audit: 44 passes, zero violations, zero incomplete checks.
- No JavaScript browser errors in the completed motion test.

Evidence is in `docs/qa/`: viewport screenshots, interaction results, motion results, and accessibility JSON. Scripts use an installed `agent-browser` CLI and a local server on port 3000. The browser session reset during some long verification runs; affected captures were discarded and the checks rerun in a dedicated pinned tab.

This is browser emulation on the development machine, not a performance certification on physical mobile hardware. No production domain, booking service, or real studio contact data was configured. No unrelated repository was changed.
