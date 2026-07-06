# `_archive/` — unused components

Components that are **no longer rendered anywhere** but are kept in case they are needed again in the future. Do **not** import from here in active code.

Rules:
- A component lands here only when it has **no active importer** anywhere in the library, web app, or mobile app (references inside commented-out code don't count).
- Keep the component self-contained. Its styles, if any, may have been removed from the SCSS build — restyle when revived.
- To revive one: move it back to its proper `components/…` location, re-add its SCSS partial + `@import`, and wire up the call site.

## Contents

- `TideGoodMoments.tsx` — rendered the "good tide moments" text for a spot's tide info. Both call sites (`SurfSpotInfoTide`, `TideTableDays`) were commented out and the feature disabled; its `ms-tide-good-moments__*` namespace was never styled. Archived 2026-07-06.
