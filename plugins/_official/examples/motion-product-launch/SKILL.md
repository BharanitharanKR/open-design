---
name: motion-product-launch
description: "A 20-second product launch film: a bold benefit hook, the meeting problem, a clear summary, next actions, and a brand close."
od:
  mode: video
  scenario: video
  preview:
    type: html
    entry: example.html
---

# Product Launch Film

A launch film for fictional meeting app Driftnote. The product benefit is visible
from the first shot: “Meetings in. Decisions out.” Start from `example.html`.

## Art direction
- Charcoal-teal #10191b, warm white #f2f4e9, electric lime #d8ff79.
- Large Space Grotesk type, one directional-arrow motif, a faint structural grid.
- Keep the protagonist large: an oversized message, a legible summary, then
  full-width action cards. The gallery must communicate at 320×180.

## Beat map (20s)
- 0–3.2s: product benefit in large type; the arrow begins the visual thread.
- 3.2–6.2s: three readable meeting fragments show the problem.
- 6.2–13.2s: the summary fills the right half; three concrete decisions resolve.
- 13.2–17s: next actions appear as large, distinct rows.
- 17–20s: brand, benefit and arrow hold together.

## Adaptation
Replace the fictional name, meeting content and palette with the user's brief.
Preserve benefit → problem → transformation → next actions → brand. Never invent
customer evidence, business metrics or testimonials. Each segment must visibly
advance the story; do not leave a small card floating in an empty frame.

## Reference files
Copy `example.html`, `assets/gsap.min.js`, `assets/space-grotesk.ttf` and
`assets/space-grotesk-OFL.txt` into the composition, preserving the assets path.
The font is bundled under the SIL Open Font License; keep its license with it.
These files must travel with the frozen reference. No runtime font CDN is needed.

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
