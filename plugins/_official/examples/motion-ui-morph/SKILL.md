---
name: motion-ui-morph
description: "One-Shape UI Motion — motion design template. A 14-second code-only UI motion piece, rebuilt from the viral original: one shape morphs from a button into a loader, player, slider, toggle, tabs, chart, command palette and toast, driven by a cursor at 120 BPM."
od:
  mode: video
  scenario: video
  preview:
    type: html
    entry: example.html
---

# One-Shape UI Motion

A 14-second code-only UI motion piece, rebuilt from the viral original: one shape morphs from a button into a loader, player, slider, toggle, tabs, chart, command palette and toast, driven by a cursor at 120 BPM. `example.html` is the finished reference — start from it.

## Source
A remake of a viral post by @twoclipping: https://x.com/twoclipping/status/2103273003555402193 (1.03M views · 12K likes · 20K bookmarks on X (as of 2026-10-05)). The composition is
rebuilt in code from the published piece; the soundtrack is original.

## Reference files
Copy `example.html`, `assets/geist-OFL.txt`, `assets/geist-medium.ttf`, `assets/geist-regular.ttf`, `assets/geist-semibold.ttf`, `assets/gsap.min.js`, `assets/soundtrack.mp3` into the composition, preserving the `assets/` path.
Font licenses travel with their fonts. Use these frozen local bytes; no runtime
script or font CDN is needed.

## Art direction
- Warm light-gray canvas `#EDEDE8`, black `#0A0A0A` and white components, toggle track `#D0D1CA`; one soft drop shadow.
- Font (SIL OFL, bundled): Geist Regular, Medium and SemiBold.
- The original is a 1440×1440 square; this reference keeps its scale on a 1920×1080 stage.

## Beat map (14s)
- 120 BPM, 7 bars: Generate button → loader → check → dynamic island → music player (play/pause morph, scrub) → volume slider that stretches past max → toggle → liquid tab indicator → chart that draws itself with a hover tooltip and a Week switch → ⌘K palette (type "frame", enter) → toast → Generate button.
- The last frame matches the first, so it loops.

## Adapting the template
- Replace the UI states in `SHAPE` and their contents; keep one shape that never cuts, springs summed per change, and a cursor that causes every change.

## How the reference is built
- One composition root with canvas layers. A single `render(t)` draws the
  whole frame from the master timeline time `t`; constants at the top hold copy,
  palette and timing so the film can be re-themed in one place.
- Every visible value is a pure function of `t` (eases, springs or keyframes
  evaluated from time). No state carries between frames.

## Preview and video export
Keep the stage edge to edge in both gallery and MP4 capture. Playback controls
are an overlay that stays transparent until hovered or focused; never reserve
stage space for them or include them in the poster. Inside an Open Design
project the motion source player fits the stage and owns the controls, so the
preview shell yields its own fit and controls there.

The GSAP master timeline is the only clock. Render every visible layer from
its current time in the per-frame loop: export seeks suppress timeline
callbacks. Schedule the next animation frame before drawing so one failed
frame cannot stop the loop. Backward seeks must reproduce identical frames.
Await bundled fonts before playback and signal preview-ready at a legible hero
frame. Preserve `window.__timelines` and the composition's timing attributes.
Avoid large canvas gradients and per-pixel noise: they make every captured
frame expensive and slow the MP4 export.

## Sound
Carry `assets/soundtrack.mp3` with the reference files. It is an original
procedural soundtrack authored for this example and timed to its beats; no
audio from the source video is used. Keep the `<audio>` element inside the
composition root, with numeric `data-start`, `data-duration` and `data-volume`;
the desktop exporter mixes that local file into the MP4. Preview sound is
enabled by the Sound on control and follows the master timeline, including
pause and backward seeks. Keep it silent during frame capture.
