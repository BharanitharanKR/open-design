---
name: motion-product-launch
description: "Product Launch Video — motion design template. A 20-second launch film for a fictional meeting-notes app: kinetic type, scattered note fragments, a toggle that turns them into a summary card, action items checking off, three beat-cut verbs and a logo lockup."
od:
  mode: video
  scenario: video
  preview:
    type: html
    entry: example.html
---

# Product Launch Video

A 20-second product launch film for "Driftnote", a fictional app that turns
messy meetings into decisions and action items. Kinetic type and one UI atom —
a toggle — carry the story. `example.html` is the finished reference — start
from it.

## Reference files
Copy `example.html`, `assets/gsap.min.js`, `assets/space-grotesk.ttf`,
`assets/space-grotesk-OFL.txt`, `assets/soundtrack.mp3` into the composition,
preserving the `assets/` path. Space Grotesk is bundled under the SIL Open Font
License; keep its license file with it. Use these frozen local bytes; no
runtime script or font CDN is needed.

## Art direction
- Warm paper `#EFEAE0`, ink `#121212`, one accent `#FF4F1F`, white cards.
- Oversized Space Grotesk for the hook and verbs; product UI in rounded cards,
  pills and checkboxes; mono labels for metadata. Mark the product as fictional.

## Beat map (20s)
- 0–3s HOOK: "Every meeting / ends with / a mess." — the last word jitters apart.
- 3–6.5s PROBLEM: nine note fragments drift around "Notes everywhere. Decisions nowhere."
- 6.5–7.6s TURN: the Driftnote toggle switches on with a shockwave.
- 7.6–11s ORDER: fragments fly into one summary card with three decisions.
- 11–14.6s FOLLOW-THROUGH: three action items check off; "Sent to owners automatically".
- 14.6–17.6s VALUE: Listens. / Sorts. / Follows up. cut on the beat with icons.
- 17.6–20s LOCKUP: toggle + wordmark, tagline, "Out today".

## Adapting the template
- Keep the problem → switch → result arc and one recurring UI atom.
- Swap the product, copy, UI and palette to the user's brief; keep claims
  modest and label fictional products and sample data.

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
