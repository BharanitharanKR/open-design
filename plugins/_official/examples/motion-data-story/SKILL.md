---
name: motion-data-story
description: "A 20-second story that makes the difference between a million and a billion tangible through seconds, days, years and a thousand-dot comparison."
od:
  mode: video
  scenario: video
  preview:
    type: html
    entry: example.html
---

# Animated Data Story

“A million vs a billion” turns an abstract numerical difference into felt time.
Start from `example.html`. This example uses arithmetic, not an invented dataset.

## Art direction
- Warm paper #f2f0e8, near-black #171918 and vermilion #f24c32.
- Oversized figures and bold changes between paper, dark and red scenes.
- Use the entire frame. Keep critical labels readable at gallery-card size.

## Beat map (20s)
- 0–4.5s: 1M versus 1B, with the question visible immediately.
- 4.5–7.5s: 1,000,000 seconds = about 11.6 days, beside a moving clock.
- 7.5–10.5s: 1,000,000,000 seconds = about 31.7 years, on a dark field.
- 10.5–16s: a 40×25 grid fills to 1,000 dots. Each dot is one million seconds.
- 16–20s: the rounded contrast, about 12 days versus 32 years, fills two cards.

## Data and adaptation
Use 86,400 seconds per day and 365.25 days per year; keep the approximation mark
and basis visible. If changing the story, verify the input data, distinguish
exact values from rounded display figures, and make the chart encode the stated
quantity correctly. Do not replace missing data with plausible-looking figures.

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
