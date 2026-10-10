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
- Copy `example.html` and `assets/gsap.min.js` into the new composition,
  preserving the relative `assets/` path. These files are carried in the frozen
  reference package; use these local bytes instead of a CDN or a new version.

## Art direction
- Off-white `#F4F4F1`, ink-black `#0E0E10`, a single vivid accent `#FF3D00`.
- Heavy display grotesque (900 weight, very large) for kinetic type; uppercase
  mono for HUD labels (scene number, timecode). Generous margins, editorial grid.

## Beat map (15s)
- 0–3s: kinetic type ("MOTION HAS WEIGHT"); the accent dot drops in as the full stop.
- 3.2–6s: the dot morphs into a shape (square → ring) with guides.
- 6–10s: the ring becomes a button inside an interface card; toggle, slider, press.
- 10–12.5s: data flourish — bars rise, a line draws, a number counts up.
- 12.4–15s: signature card "Studio Kinetik." holds still.

## Motion
- The accent dot carries every transition (full stop → shape → button → data
  point → signature full stop). Decisive snaps with controlled settles, no
  generic bounce, no dead time longer than half a second.

## Adapting the template
- Keep the five-beat structure and the single object that links every cut.
- Swap copy, palette, techniques and the signature to the user's studio or
  brand; label any chart values as sample data.

## Video export
- The MP4 exporter seeks the timeline with callbacks suppressed. Visible content
  must not depend on `onUpdate`/`onComplete`; procedural layers redraw from the
  timeline time on every animation frame, as the per-frame loop in
  `example.html` does.
- Keep playback controls outside the composition. The example detects the
  existing OD frame-export bridge and fills its capture viewport with only the
  composition; preserve this export layout when adapting the preview shell.
