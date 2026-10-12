---
name: motion-pixel-wizard
description: "Pixel Art Wizard — motion design template. An 11-second pixel art loop, rebuilt from the viral original: a wizard on a moonlit stone wall charges his staff, casts a burst of magic and settles back, at a crisp 128×96 resolution."
od:
  mode: video
  scenario: video
  preview:
    type: html
    entry: example.html
---

# Pixel Art Wizard

An 11-second pixel art loop, rebuilt from the viral original: a wizard on a moonlit stone wall charges his staff, casts a burst of magic and settles back, at a crisp 128×96 resolution. `example.html` is the finished reference — start from it.

## Source
A remake of a viral post by @majidmanzarpour: https://x.com/majidmanzarpour/status/2102476258948927543 (453K views · 2.6K likes · 2.7K bookmarks on X (as of 2026-10-05)). The composition is
rebuilt in code from the published piece; the soundtrack is original.

## Reference files
Copy `example.html`, `assets/gsap.min.js`, `assets/soundtrack.mp3` into the composition, preserving the `assets/` path.
Font licenses travel with their fonts. Use these frozen local bytes; no runtime
script or font CDN is needed.

## Art direction
- A 128×96 logical canvas blitted at an integer scale with smoothing off; every pixel comes from a fixed palette of about 24 colours.
- Night sky in dithered bands, twinkling stars, a cratered moon and a stone wall; a wizard with a bent hat, long beard, two-tone robe and a gem staff.

## Beat map (11.28s)
- Two 5.64s cycles: IDLE (two-frame bob) → CHARGE (staff raised, sparks spiral into the gem, floor glow) → CAST (white-hot burst, sparks thrown forward, 1px screen shake) → RECOVER.
- The pose steps at about 10 fps for a hand-made sprite feel.

## Adapting the template
- Swap the character map in `BODY`, the palette and the spell colours; keep integer-snapped pixels and the four-state loop.

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
audio from the source video is used. The soundtrack is part of the look the
user is remaking: keep it by default, and follow the brief when it asks for no
music or different music. The music lands on this film's beats, so keep the
film close to this length; when the brief changes the length, keep
`data-duration` within the film, and the export fades the track out where it
stops. Keep the `<audio>` element inside the
composition root, with numeric `data-start`, `data-duration` and `data-volume`;
the desktop exporter mixes that local file into the MP4. Preview sound
starts with the film; when the browser blocks autoplay, the first click or key
press turns it on. The Sound off control mutes it. Sound follows the master
timeline, including pause and backward seeks. Keep it silent during frame
capture and in sandboxed gallery thumbnails.
