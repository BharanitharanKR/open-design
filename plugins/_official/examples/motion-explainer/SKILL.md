---
name: motion-explainer
description: "A 20-second noise-cancellation explainer with a large opening question, close-up wave diagrams, phase inversion, interference, and a quiet close."
od:
  mode: video
  scenario: video
  preview:
    type: html
    entry: example.html
---

# How-It-Works Explainer

“How do you hear nothing?” explains the idealized wave principle behind active
noise cancellation. Start from `example.html`.

## Art direction
- Deep blue #0c1724, warm white #f2f5ed and cyan #65e8dc.
- Large headlines, a custom vector headphone illustration, and wide wave plots.
- Each step gets its own composition. Do not shrink an entire system diagram
  into a distant overview for the whole film.

## Beat map (20s)
- 0–3s: question and large headphone illustration, both visible immediately.
- 3–7s: a microphone samples the noise; the waveform becomes the protagonist.
- 7–11s: reveal the equal-and-opposite anti-noise wave.
- 11–16s: the waves converge and their idealized sum flattens.
- 16–20s: “Silence is engineered.” resolves with the headphone motif.

## Accuracy and adaptation
The zero-sum example illustrates ideal phase cancellation. Real headphones
reduce noise rather than erase all sound; retain this distinction. Replace
the mechanism with the user's subject, but keep question → three clear causal
steps → answer. Procedural paths must remain a pure function of timestamp.

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
