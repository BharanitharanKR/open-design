---
name: motion-short-story
description: "Animated Short Story — motion design template. A wordless 15-second animated short: a little dot tries to reach a star, falls, and its friends stack into a tower to lift it up — classic squash-and-stretch character animation."
od:
  mode: video
  scenario: video
  preview:
    type: html
    entry: example.html
---

# Animated Short Story

A wordless 15-second animated short in a soft, Pixar-like register: a little
orange dot wants to touch a star. It jumps, falls, and its friends build the
way. `example.html` is the finished reference — start from it.

## Reference files
Copy `example.html`, `assets/gsap.min.js`, `assets/space-grotesk.ttf`,
`assets/space-grotesk-OFL.txt`, `assets/soundtrack.mp3` into the composition,
preserving the `assets/` path. Space Grotesk is bundled under the SIL Open Font
License; keep its license file with it. Use these frozen local bytes; no
runtime script or font CDN is needed.

## Art direction
- Dusk sky from indigo `#1D2142` through violet to warm orange, layered hills,
  twinkling background stars and one large star.
- Round characters with big eyes, cheeks and a soft rim light: hero orange
  `#FF8A3D`; friends teal, yellow, pink and blue.
- One closing title in Space Grotesk: "Higher, together." 

## Beat map (15s)
- 0–1.7s: the hero hops in and stops; looks up at the star and blinks.
- 2.4–4.8s: a small jump, then a big one that falls short — hard landing, "> <" eyes, dust.
- 4.8–7.4s: it droops; four friends hop in from both sides.
- 8.1–10.6s: the friends stack into a tower; the hero hops to the top.
- 10.7–12.5s: it stretches, touches the star, the sky lights up, every face turns happy.
- 12.6–15s: the title fades in and holds.

## Adapting the template
- Keep: one character with a clear want, a failure, help, and a payoff —
  told without words. Use anticipation, squash and stretch, and settling.
- Swap characters, goal and palette to the brief; keep the story under 15s.

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
