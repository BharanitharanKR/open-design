---
name: motion-showreel
description: "Motion Designer Showreel — motion design template. A 15-second motion designer showreel on a dark HUD stage: an orange starburst, kinetic type cut on the beat, a morphing shape system, a 3D point cloud and a signature card."
od:
  mode: video
  scenario: video
  preview:
    type: html
    entry: example.html
---

# Motion Designer Showreel

A 15-second showreel in the spirit of the viral "show what an incredible motion
designer you are" prompt: five techniques, one identity, cut to 128 BPM. Signed
by the fictional "Studio Kinetik". `example.html` is the finished reference —
start from it.

## Reference files
Copy `example.html`, `assets/gsap.min.js`, `assets/space-grotesk.ttf`,
`assets/space-grotesk-OFL.txt`, `assets/soundtrack.mp3` into the composition,
preserving the `assets/` path. Space Grotesk is bundled under the SIL Open Font
License; keep its license file with it. Use these frozen local bytes; no
runtime script or font CDN is needed.

## Art direction
- Near-black `#0B0B0C`, warm off-white `#F2EFE8`, one vivid accent `#FF4A1C`.
- Camera-style HUD: corner brackets, studio name, chapter label, running
  timecode, BPM readout with four beat squares, a thin progress line.
- Bundled Space Grotesk 700 for display type; monospace for HUD labels.

## Beat map (15s)
- 0–3s IDENTITY: a dot lands, bursts into a 16-ray starburst, an orbit draws on.
- 3–6s TYPE: TIMING / WEIGHT / RHYTHM slam in on the beat; the last word shatters.
- 6–9s SYSTEM: a 13×7 grid morphs circle → square → plus in a radiating wave.
- 9–12s DIMENSION: 720 points form a rotating sphere, then the same points become a torus.
- 12–15s SIGNATURE: everything collapses into the dot, which becomes the full stop of "KINETIK."
- An accent wipe stitches each cut; the HUD keeps time throughout.

## Adapting the template
- Keep five distinct techniques, one palette and one recurring element (the dot).
- Swap studio name, words and techniques to the user's brief; cut on the beat.

## How the reference is built
- One `<canvas>` stage. A single `render(t)` function draws the
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
