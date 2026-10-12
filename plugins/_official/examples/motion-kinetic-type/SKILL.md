---
name: motion-kinetic-type
description: "What Day Is It? — motion design template. 15 seconds of kinetic typography: a stacked question, a slot-machine reel of weekdays, the answer on a yellow flood, four beat-cut words and an odometer countdown to the weekend."
od:
  mode: video
  scenario: video
  preview:
    type: html
    entry: example.html
---

# What Day Is It?

A 15-second kinetic typography film at 120 BPM. Type is the only visual: it
asks a question, scans the week, answers, and signs off. `example.html` is the
finished reference — start from it.

## Reference files
Copy `example.html`, `assets/gsap.min.js`, `assets/space-grotesk.ttf`,
`assets/space-grotesk-OFL.txt`, `assets/soundtrack.mp3` into the composition,
preserving the `assets/` path. Space Grotesk is bundled under the SIL Open Font
License; keep its license file with it. Use these frozen local bytes; no
runtime script or font CDN is needed.

## Art direction
- Swiss poster palette: paper `#EFEAE0`, ink `#121212`, blue `#2B4BFF`,
  yellow `#FFD23A`, red `#FF4B2B`. Flat fills only.
- Space Grotesk 700 for display type; monospace for the frame chrome.
- Frame chrome: corner marks, the question and week stamp on top, scene
  counter, an 80-tick progress rule and a running timecode at the bottom.

## Beat map (15s)
- 0–2.4s QUESTION: WHAT / DAY / IS IT? rise out of masks on the beat; the "?" wobbles blue.
- 2.5–5.0s SCAN: weekdays spin past a slot window with motion blur and settle on the answer; a list on the right tracks the reel.
- 5.0–7.6s ANSWER: a yellow flood; the answer grows, letters bounce in turn, "IT'S" and seven weekday dots land.
- 7.6–9.6s CUTS: ALMOST / THE / WEEK— / END. — one word per beat, full frame, a new colour each cut.
- 9.6–11.3s COUNTDOWN: an odometer runs 08:00:00 down to zero and flashes red.
- 11.3–15s SIGN-OFF: the answer is drawn in outline, filled, and closed with a blue full stop.

## Adapting the template
- Keep: type as the only image, one beat grid, and a clear question → answer → payoff.
- `CFG` holds the copy: change `days`, `answer`, `question`, `cuts`, `countFrom`,
  `countLabel` and `signoff` to retell it for another message or language.
- Fit long words by measuring them (`width()`) and scaling to the frame, as the cuts do.

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
