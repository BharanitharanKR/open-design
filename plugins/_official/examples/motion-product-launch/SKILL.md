---
name: motion-product-launch
description: "Product Launch Film — motion design template. A 20-second launch film that shows a product’s core transformation and closes on the brand line."
od:
  mode: video
  scenario: video
  preview:
    type: html
    entry: example.html
---

# Product Launch Film

A product launch film built around one concrete transformation: messy input
becomes a clean result, then the brand resolves. Shown with the fictional app
Driftnote (meeting audio → one-page summary). `example.html` is the finished
reference — start from it.

## Reference files
- Copy `example.html` and `assets/gsap.min.js` into the new composition,
  preserving the relative `assets/` path. These files are carried in the frozen
  reference package; use these local bytes instead of a CDN or a new version.

## Art direction
- Deep navy stage `#0B1530`, warm paper text `#F4EFE6`, one coral accent
  `#FF6B57`. Editorial serif for display, clean sans for UI, mono for transcript
  fragments.
- Simple invented UI only: speech bubbles, transcript fragments, one summary
  card with three action items. No metrics, customers or pricing.

## Beat map (20s)
- 0–3s: chaos — scattered bubbles and fragments drift over a live waveform.
- 3–7s: a coral line sweeps; fragments sort into rows; the summary card
  appears as their destination.
- 7–13s: line by line, fragments condense into one sentence each on the card.
- 13–17s: the card completes and three action items tick in; reading hold.
- 17–18s: the card recedes; the coral rule becomes the wordmark underline.
- 18–20s: wordmark and brand line hold still.

## Motion
- The coral line is the recurring motif: sweep → divider → wordmark underline.
- Fragments travel on readable paths into their sentences; nothing teleports.

## Adapting the template
- Keep the chaos → order → result → brand structure and the coral-line motif.
- Replace product name, UI content, brand line and palette with the user's;
  never invent metrics, logos or testimonials.

## Video export
- The MP4 exporter seeks the timeline with callbacks suppressed. Visible content
  must not depend on `onUpdate`/`onComplete`; procedural layers redraw from the
  timeline time on every animation frame, as the per-frame loop in
  `example.html` does.
- Keep playback controls outside the composition. The example detects the
  existing OD frame-export bridge and fills its capture viewport with only the
  composition; preserve this export layout when adapting the preview shell.
