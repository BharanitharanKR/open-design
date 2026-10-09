---
name: motion-data-story
description: "Animated Data Story — motion design template. A 20-second data story that turns world population milestones into a timeline of shrinking intervals."
od:
  mode: video
  scenario: video
  preview:
    type: html
    entry: example.html
---

# Animated Data Story

An animated data story where the shrinking gaps between milestones are the
story: how long it took humanity to add each billion people (UN milestones
1804 → 2022). `example.html` is the finished reference — start from it.

## Art direction
- Editorial print look: paper `#FAFAF7`, ink `#111111`, a single red highlight
  `#D7261E`. Serif headline, small sans/mono labels, thin black rules.
- Data is exact: 1, 2 … 8 billion in 1804, 1927, 1960, 1974, 1987, 1999, 2011,
  2022; gaps 123, 33, 14, 13, 12, 12, 11 years.

## Beat map (20s)
- 0–2.5s: a single dot and the title; the dot travels to the axis origin.
- 2.5–4.5s: the timeline axis draws, then its year ticks.
- 4.5–14s: each gap is bracketed and labelled in turn; the latest gap is red.
- 14.2–17.2s: comparison bars restate the gaps from longest to shortest.
- 17.5–20s: closing line "From 123 years to 11." holds.

## Motion
- Reveal the axis before any values; labels stay put while brackets grow.
  Values never animate through wrong numbers.

## Adapting the template
- Keep axis-first, one-gap-at-a-time pacing and the single red highlight.
- Replace the dataset, title and closing line with the user's data; use only
  values the user supplies or that are verifiable, and keep units visible.

## Video export
- The MP4 exporter seeks the timeline with callbacks suppressed. Visible content
  must not depend on `onUpdate`/`onComplete`; procedural layers redraw from the
  timeline time on every animation frame, as the per-frame loop in
  `example.html` does.
