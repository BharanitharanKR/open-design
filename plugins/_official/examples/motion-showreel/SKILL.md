---
name: motion-showreel
description: "Motion Designer Showreel — motion design template. A 15-second showreel that packs kinetic type, a shape morph, UI motion and a data flourish into one visual identity."
od:
  mode: video
  scenario: video
  preview:
    type: html
    entry: example.html
---

# Motion Designer Showreel

A 15-second motion designer showreel: several distinct techniques inside one
visual identity, linked by a recurring accent dot. Signed by the fictional
"Studio Kinetik". `example.html` is the finished reference — start from it.

## Reference files
Copy `example.html`, `assets/gsap.min.js`, `assets/space-grotesk.ttf` and
`assets/space-grotesk-OFL.txt` into the composition, preserving the assets path.
The font is bundled under the SIL Open Font License; keep its license with it.
Use these frozen local bytes; no runtime script or font CDN is needed.

## Art direction
- Off-white `#F4F4F1`, ink-black `#0E0E10`, a single vivid accent `#FF3D00`.
- Bundled Space Grotesk (700 weight, very large) for kinetic type; uppercase
  mono for HUD labels (scene number, timecode). Generous margins, editorial grid.

## Beat map (15s)
- 0–3s: kinetic type ("MOTION HAS WEIGHT"); the accent dot drops in as the full stop.
- 3.2–6s: “MAKE IT MOVE.” anchors the left; the dot becomes an oversized square → ring on the right.
- 6–10s: the ring becomes a button inside a sample music-player card; toggle, volume slider, press.
- 10–12.5s: illustrative listening index — bars rise, a line draws, a number counts up.
- 12.4–15s: signature card "Studio Kinetik." holds still.

## Motion
- The accent dot carries every transition (full stop → shape → button → data
  point → signature full stop). Decisive snaps with controlled settles, no
  generic bounce, no dead time longer than half a second.

## Adapting the template
- Keep the five-beat structure and the single object that links every cut.
- Swap copy, palette, techniques and the signature to the user's studio or
  brand; label any chart values as sample data.


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


The player is a fictional UI example, not a claim that this film has an audio
track. Keep illustrative chart labels visible; never imply business results.

## Sound
Carry `assets/soundtrack.mp3` with the reference files. This is an original
procedural soundtrack authored for this example, not audio copied from a source
video. Preserve the root `<audio>` element with numeric `data-start`,
`data-duration`, and `data-volume`; the desktop exporter mixes that local file
into the MP4. Preview sound is enabled by the Sound on control and follows the
master timeline, including pause and backward seeks. Keep it silent during
frame capture. When changing the film length, provide a correspondingly timed
local soundtrack.
