---
name: motion-energy-reel
description: "High-Energy Motion Reel — motion design template. A 15-second high-energy motion reel, rebuilt from the viral original: kinetic words on hard color cuts, a breathing grid of shapes, extruded 3D type, rhythm stripes, a frame counter and an end card."
od:
  mode: video
  scenario: video
  preview:
    type: html
    entry: example.html
---

# High-Energy Motion Reel

A 15-second high-energy motion reel, rebuilt from the viral original: kinetic words on hard color cuts, a breathing grid of shapes, extruded 3D type, rhythm stripes, a frame counter and an end card. `example.html` is the finished reference — start from it.

## Source
A remake of a viral post by @crvdesign0: https://x.com/crvdesign0/status/2103817034618339682 (1.09M views · 2.8K likes · 6.2K bookmarks on X (as of 2026-10-05)). The composition is
rebuilt in code from the published piece; the soundtrack is original.

## Reference files
Copy `example.html`, `assets/gsap.min.js`, `assets/ibm-plex-sans-OFL.txt`, `assets/ibm-plex-sans-bold.ttf`, `assets/ibm-plex-sans-regular.ttf`, `assets/jetbrains-mono-OFL.txt`, `assets/jetbrains-mono-medium.ttf`, `assets/soundtrack.mp3` into the composition, preserving the `assets/` path.
Font licenses travel with their fonts. Use these frozen local bytes; no runtime
script or font CDN is needed.

## Art direction
- Near-black `#0C0B0E`, orange `#FF5814`, cream `#F4EEE6`, blue `#2C4AFF`; a soft vignette on every frame.
- Fonts (SIL OFL, bundled): IBM Plex Sans Bold and Regular, JetBrains Mono for the HUD.
- The original's copy was Arabic; this reference sets the same layout in English.

## Beat map (15s)
- 0–2.0s a dot stretches into two rules around "Showreel" and "15 seconds of pure motion".
- 2.0–4.0s one word per half-second cut: Ideas / that move / with rhythm / unforgettable.
- 4.0–6.5s a grid of dots blooms, turns into coloured squares that breathe, and collapses.
- 6.5–8.5s "Depth" with an orange-to-blue extrusion over a perspective floor.
- 8.5–10.45s diagonal rhythm stripes of Motion · Rhythm · Story · Design with a spinning 04 badge.
- 10.45–12.9s a colour blob and a frame counter climbing to 900.
- 12.9–15s a ring wave, then "Claude", "Motion designer" and "Design, in motion.".

## Adapting the template
- Swap the words in `CFG`, the brand and palette; keep one idea per cut and the half-second rhythm.

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
the desktop exporter mixes that local file into the MP4. Preview sound
starts with the film; when the browser blocks autoplay, the first click or key
press turns it on. The Sound off control mutes it. Sound follows the master
timeline, including pause and backward seeks. Keep it silent during frame
capture and in sandboxed gallery thumbnails.
