---
name: motion-explainer
description: "How-It-Works Explainer — motion design template. A 20-second explainer that follows one recurring object to show how noise-cancelling headphones work."
od:
  mode: video
  scenario: video
  preview:
    type: html
    entry: example.html
---

# How-It-Works Explainer

A technical explainer that follows one recurring object — a waveform — through
cause and effect: how noise-cancelling headphones work. `example.html` is the
finished reference — start from it.

## Art direction
- Clean technical diagram on dark graphite `#14171a`; cyan `#22d3ee` for the
  active signal, white `#f5f7f8` lines, dim `#8a9aa3` for secondary labels.
- Thin stroked line art (ear cup, microphone, chip, scope) drawn on with
  stroke-dash reveals. Monospace numbered labels: 01 Noise, 02 Microphone,
  03 Anti-noise, 04 Silence.

## Beat map (20s)
- 0–3.5s: the noise wave travels toward the ear; ear outline draws in.
- 3.5–8s: microphone appears and samples the wave; a scope shows the signal.
- 8–13s: the chip generates the inverted wave (same shape, flipped).
- 13–17.5s: the two waves meet and flatten into a single silent line.
- 17.5–20s: supporting parts dim; closing line "Silence is engineered." holds.

## Motion
- The wave is the protagonist in every beat; each new part is introduced by a
  short reveal next to the wave, then labelled. Labels stay readable while
  relationships change. No decorative motion.

## Adapting the template
- Keep the "one object carries the explanation" structure, the numbered
  labels and the dim-then-resolve ending.
- Replace the subject, parts, labels and closing line with the user's topic;
  keep the causal order explicit (show the object before transforming it).

## Video export
- The MP4 exporter seeks the timeline with callbacks suppressed. Visible content
  must not depend on `onUpdate`/`onComplete`; procedural layers redraw from the
  timeline time on every animation frame, as the per-frame loop in
  `example.html` does.
