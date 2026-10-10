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
procedural island at golden hour, a close opening camera, a continuous orbit, and a travel-poster title
close. `example.html` is the finished reference — start from it.

## Reference files
Copy `example.html`, `assets/gsap.min.js`, `assets/space-grotesk.ttf` and
`assets/space-grotesk-OFL.txt` into the composition, preserving the assets path.
The font is bundled under the SIL Open Font License; keep its license with it.
Use these frozen local bytes; no runtime script or font CDN is needed.

- The gallery uses `assets/three.min.js`. The frozen reference package carries
  the same Three.js bytes compressed as `assets/three.min.js.gz` to fit the
  existing per-file budget. Before rendering, create the composition's assets
  directory and decompress this file into `assets/three.min.js`:
  `gzip -dc "<reference-root>/assets/three.min.js.gz" > "<composition-root>/assets/three.min.js"`.
  Both placeholders are the actual reference and composition directories in
  this task. Keep the HTML script URL pointing to the decompressed `.js` file.

## Art direction
- Toon-shaded low-poly world: faceted island (sand, grass mound, rocks), palm
  trees with drooping fronds, small distant clouds. 3-step toon light ramp, warm
  key light with a cool mint fill. No photoreal textures.
- Sunset palette: violet sky top `#3b2a7a` → rose `#d5568a` → orange `#ff9a5c`
  → pale horizon `#ffd08a`; sea from deep teal `#0b4a63` to shallow mint
  `#5fd0b4` with cream foam `#fff3dc`.
- Bundled Space Grotesk in oversized cream travel-poster type. The opening
  reads “A little escape.”; the close reads “Stay a little longer.”

## Motion
- One shot, no cuts. Camera: close aerial → glides down → arcs around the island
  → settles on a calm wide shot (0–11s arc, 11–15s settle).
- Ambient life inside the world: shader ocean swells and foam rings lap the
  shore, palms sway, clouds drift, small glowing "code" voxels rise from the
  island as the recurring motif.
- Opening title is visible immediately, then clears the island. Closing title
  fades in at ~12s and holds for the last 2 seconds. Keep ocean highlights soft,
  the depth falloff continuous. A visible cabin, timber dock, sailboat and beach
  chairs make this feel like a destination; the boat bobs from timeline time.

## Build notes
- Three.js (`assets/three.min.js`) + GSAP master timeline. Everything is a pure
  function of the timeline clock (shader time uniform, sway, drift, camera);
  seeded randomness only, so any timestamp replays exactly.
- Custom shaders apply Three.js tone mapping and output color-space conversion.
  Match their colors to the built-in mesh materials; do not output linear color
  directly as display color. Frame the entire island, dock and sailboat with
  visible water around them throughout the orbit.

## Adapting the template
- Keep the single continuous camera move, the toon look and the calm title hold.
- Swap the subject (island, city block, product on a plinth…), palette and
  title to the user's brief; do not reuse "Made of code." unless asked.


## Preview and video export
Keep the stage edge to edge in both gallery and MP4 capture. Playback controls
are an overlay that stays transparent until directly hovered or focused; never
reserve stage space for them or include them in the poster.

The GSAP master timeline is the only clock. Render every procedural layer from
its current time in the per-frame loop: export seeks suppress timeline callbacks.
Do not carry state between frames, use wall-clock time, or rely on child-tween
callbacks for visible output. Backward seeks must reproduce identical frames.
Await bundled fonts before playback and signal preview-ready at a legible hero
frame. Preserve `window.__timelines` and the composition's timing attributes.
