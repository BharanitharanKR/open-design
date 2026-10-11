---
name: motion-3d-scene
description: "Procedural 3D Island — motion design template. A 15-second Three.js scene: a procedural low-poly island at golden hour with animated waves and shoreline foam, swaying palms, a hut, dock, sailboat and birds, filmed in one continuous aerial camera move."
od:
  mode: video
  scenario: video
  preview:
    type: html
    entry: example.html
---

# Procedural 3D Island

A 15-second stylized 3D piece rendered live with Three.js: a small procedural
island at golden hour, filmed in one continuous camera move. No 3D models —
terrain, water, palms, hut, dock, boat, clouds and birds are all generated in
code. `example.html` is the finished reference — start from it.

## Reference files
Copy `example.html`, `assets/three.min.js.gz`, `assets/gsap.min.js`,
`assets/space-grotesk.ttf`, `assets/space-grotesk-OFL.txt`,
`assets/soundtrack.mp3` into the composition, preserving the `assets/` path.
Space Grotesk is bundled under the SIL Open Font License; keep its license file
with it. Use these frozen local bytes; no runtime script or font CDN is needed.

The gallery loads `assets/three.min.js`. The frozen reference package carries
the same Three.js bytes compressed as `assets/three.min.js.gz` to fit the
per-file budget. Before rendering, decompress it into the composition:
`gzip -dc "<reference-root>/assets/three.min.js.gz" > "<composition-root>/assets/three.min.js"`.
Both placeholders are the actual reference and composition directories in this
task. Keep the HTML script URL pointing to the decompressed `.js` file.

## Art direction
- Low-poly, flat-shaded world: sand `#F1D49B`, grass `#6CBF5B`, ocean from
  deep `#1A7590` to shallow `#52DCC8` with breathing white foam on the shore.
- Golden-hour sky shader (indigo zenith → orange horizon) with a sun glow;
  warm key light, cool fill, fog that melts the sea into the horizon.
- Overlay titles in Space Grotesk: "A little escape." opens, "Stay a little
  longer." closes, with a small mono kicker.

## Beat map (15s)
- 0–4s: high aerial over the island, opening title bottom-left.
- 4–12s: the camera descends and arcs around the island toward the sun.
- 12–15s: a calm wide settle; closing title holds for the last seconds.
- Ambient life throughout: waves, foam, palm sway, the boat circling and
  bobbing, clouds drifting, a small flock of birds crossing.

## Adapting the template
- Keep one continuous camera move, the toon/low-poly look and a calm title hold.
- Swap the subject (island, tiny city, product on a plinth…), palette and
  titles to the brief. Generate geometry in code; keep everything a function of `t`.

## How the reference is built
- One `<canvas>` stage (WebGL via Three.js) plus a 2D overlay canvas for titles. A single `render(t)` function draws the
  whole frame from the master timeline time `t`; `CFG` at the top holds copy,
  palette and timing so the film can be re-themed in one place.
- Small helpers do the timing: `seg(t, a, b)` turns a time window into 0–1
  progress, GSAP eases (`gsap.parseEase`) shape it, `lerp` maps it to values.
  Prefer this over many independent tweens: every frame stays a pure function
  of `t`.

## Preview and video export
Keep the stage edge to edge in both gallery and MP4 capture. Playback controls
are an overlay that stays transparent until hovered or focused; never reserve
stage space for them or include them in the poster.

The GSAP master timeline is the only clock. Render every visible layer from
its current time in the per-frame loop: export seeks suppress timeline
callbacks. Do not carry state between frames, use wall-clock time, or rely on
child-tween callbacks for visible output. Backward seeks must reproduce
identical frames. Await bundled fonts before playback and signal preview-ready
at a legible hero frame. Preserve `window.__timelines` and the composition's
timing attributes.

## Sound
Carry `assets/soundtrack.mp3` with the reference files. It is an original
procedural soundtrack authored for this example, timed to its beats, not audio
copied from any source video. Preserve the root `<audio>` element with numeric
`data-start`, `data-duration` and `data-volume`; the desktop exporter mixes that
local file into the MP4. Preview sound is enabled by the Sound on control and
follows the master timeline, including pause and backward seeks. Keep it silent
during frame capture. When the film length or beats change, provide a
correspondingly timed local soundtrack or remove the `<audio>` element.
