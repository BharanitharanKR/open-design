---
name: motion-3d-scene
description: "Procedural 3D Island — motion design template. A 15-second browser-rendered 3D scene: a procedural island at golden hour with shader waves and a sweeping camera move."
od:
  mode: video
  scenario: video
  preview:
    type: html
    entry: example.html
---

# Procedural 3D Island

A stylized 3D motion piece rendered live in the browser with Three.js: a small
procedural island at golden hour, one continuous camera move, a calm title
close. `example.html` is the finished reference — start from it.

## Reference files
- Copy `example.html` and `assets/gsap.min.js` into the new composition,
  preserving the relative `assets/` path. These files are carried in the frozen
  reference package; use these local bytes instead of a CDN or a new version.
- The gallery uses `assets/three.min.js`. The frozen reference package carries
  the same Three.js bytes compressed as `assets/three.min.js.gz` to fit the
  existing per-file budget. Before rendering, create the composition's assets
  directory and decompress this file into `assets/three.min.js`:
  `gzip -dc "<reference-root>/assets/three.min.js.gz" > "<composition-root>/assets/three.min.js"`.
  Both placeholders are the actual reference and composition directories in
  this task. Keep the HTML script URL pointing to the decompressed `.js` file.

## Art direction
- Toon-shaded low-poly world: faceted island (sand, grass mound, rocks), palm
  trees with drooping fronds, soft puffy clouds. 3-step toon light ramp, warm
  key light with a cool-violet fill. No photoreal textures.
- Sunset palette: violet sky top `#3b2a7a` → rose `#d5568a` → orange `#ff9a5c`
  → pale horizon `#ffd08a`; sea from deep teal `#0b4a63` to shallow mint
  `#5fd0b4` with cream foam `#fff3dc`.
- Rounded humanist sans for the title, cream on the scene.

## Motion
- One shot, no cuts. Camera: high aerial → glides down → arcs around the island
  → settles on a calm wide shot (0–11s arc, 11–15s settle).
- Ambient life inside the world: shader ocean swells and foam rings lap the
  shore, palms sway, clouds drift, small glowing "code" voxels rise from the
  island as the recurring motif.
- Title fades in at ~12s and holds still for the last 2 seconds.

## Build notes
- Three.js (`assets/three.min.js`) + GSAP master timeline. Everything is a pure
  function of the timeline clock (shader time uniform, sway, drift, camera);
  seeded randomness only, so any timestamp replays exactly.

## Adapting the template
- Keep the single continuous camera move, the toon look and the calm title hold.
- Swap the subject (island, city block, product on a plinth…), palette and
  title to the user's brief; do not reuse "Made of code." unless asked.

## Video export
- The MP4 exporter seeks the timeline with callbacks suppressed. Visible content
  must not depend on `onUpdate`/`onComplete`; procedural layers redraw from the
  timeline time on every animation frame, as the per-frame loop in
  `example.html` does.
- Keep playback controls outside the composition. The example detects the
  existing OD frame-export bridge and fills its capture viewport with only the
  composition; preserve this export layout when adapting the preview shell.
