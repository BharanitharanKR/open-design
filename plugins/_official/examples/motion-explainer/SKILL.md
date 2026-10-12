---
name: motion-explainer
description: "How-It-Works Explainer — motion design template. A 20-second explainer of how a camera focuses: a focus-pull opener, an optical bench with real thin-lens ray tracing, refocusing, aperture and depth of field, and a three-rule recap."
od:
  mode: video
  scenario: video
  preview:
    type: html
    entry: example.html
---

# How-It-Works Explainer

A 20-second "how it works" explainer: why only one thing in a photo is sharp.
The optics are physically correct — rays follow the thin-lens equation
`1/f = 1/u + 1/v`, so blur on the sensor is computed, not faked.
`example.html` is the finished reference — start from it.

## Reference files
Copy `example.html`, `assets/gsap.min.js`, `assets/space-grotesk.ttf`,
`assets/space-grotesk-OFL.txt`, `assets/soundtrack.mp3` into the composition,
preserving the `assets/` path. Space Grotesk is bundled under the SIL Open Font
License; keep its license file with it. Use these frozen local bytes; no
runtime script or font CDN is needed.

## Art direction
- Blueprint navy `#0E1622` with a faint engineering grid; light rays in amber
  `#FFB547`, glass and the second subject in cyan `#59D8E6`, blur warnings in
  coral `#FF6B5A`.
- Large two-line captions bottom-left (white line + amber line), chapter label
  top-left, thin progress line at the bottom.

## Beat map (20s)
- 0–3.6s THE QUESTION: a stylized photo pulls focus flower → person → mountains.
- 3.6–8.4s LIGHT: lens and sensor appear; rays from one point converge to one point on the sensor (SHARP inset).
- 8.4–12.8s FOCUS: the subject moves closer, rays now meet behind the sensor (BLUR disc), then the lens slides to refocus.
- 12.8–17.2s APERTURE: a background point appears; blades close f/1.8 → f/5.6 and its blur disc shrinks — depth of field.
- 17.2–20s RECAP: three numbered rules and the closing line.
- A "What the sensor sees" inset shows the computed result of every change.

## Adapting the template
- Keep: one question, one diagram that evolves, captions that say exactly what
  just moved, a recap. Compute the visuals from the real model where possible.
- Swap the subject (any mechanism, process or idea) and the palette to the brief.

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
copied from any source video. Keep the `<audio>` element inside the composition root, with numeric
`data-start`, `data-duration` and `data-volume`; the desktop exporter mixes that
local file into the MP4. Preview sound is enabled by the Sound on control and
follows the master timeline, including pause and backward seeks. Keep it silent
during frame capture. When the film length or beats change, provide a
correspondingly timed local soundtrack or remove the `<audio>` element.
