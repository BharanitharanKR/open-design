---
name: motion-visual-lesson
description: "Visual Lesson — motion design template. A 20-second paper-cutout short rebuilt from the viral original: a girl sends 'what do you love?' on a paper plane, the Open Design buddy answers with ten illustrated cards that gather into a heart, and the town lights up."
od:
  mode: video
  scenario: video
  preview:
    type: html
    entry: example.html
---

# Visual Lesson

A 20-second paper-cutout short rebuilt from the viral original: a girl sends "what do you love?" on a paper plane, the Open Design buddy answers with ten illustrated cards that gather into a heart, and the town lights up. `example.html` is the finished reference — start from it.

## Source
A remake of a viral post by @kevin_t_ngo: https://x.com/kevin_t_ngo/status/2102437977435893771 (665K views · 6.2K likes · 3.0K bookmarks on X (as of 2026-10-13)). The composition is
rebuilt in code from the published piece; the soundtrack is original. The original is a 28-second square film; this is a 20-second cut framed in 16:9, and its character is the Open Design buddy built from the logo mark.

## Reference files
Copy `example.html`, `assets/gsap.min.js`, `assets/short-stack-OFL.txt`, `assets/short-stack-regular.ttf`, `assets/soundtrack.mp3` into the composition, preserving the `assets/` path.
Font licenses travel with their fonts. Use these frozen local bytes; no runtime
script or font CDN is needed.

## Art direction
- Cut paper throughout: every colour block has a torn white rim. Large grounds (sky, walls, card backgrounds) carry only faint short brush strokes and paper tooth, almost flat from afar; objects carry dry gouache strokes and crayon grain. Night blues `#262D70` / `#30398A`, wall `#4A3A8A`, yellow `#F4C443`, curtain `#EE8E96`, paper `#FFFCF3`, pen blue `#3B62B5`, red `#D8443A`.
- Printed paper on objects: newsprint on book pages, the boat, clouds and planes; handwriting on the bread, the wall and the heart scene; music staves and contour lines on the houses.
- The Open Design buddy: the dark rounded logo tile `#26251E` with a white ring, a face inside the ring and a cursor badge. In every card it is inside the picture: in the book, in the boat, hugging the bread, on the planet, wrapped by the octopus.
- The girl wears a knit green sweater with a pointed white collar.
- Font (SIL OFL, bundled): Short Stack for the hand lettering.
- The square story sits centred in 16:9; the sides continue the scene (the house wall with vines and a neighbour's window, the town, the night sky).

## Beat map (20s)
- 0–2.2s the town at night sends the buddy requests; the girl at her window gets an idea.
- 2.2–5.5s she writes "what do you love?", folds it into a paper plane and throws it.
- 5.5–8.0s the plane crosses the night sky; the buddy reads it: curious, thinking, a spark, delight.
- 8.0–12.0s the things it loves, one per beat: words, music, the sea, trees, dogs, bread, rain, math, the stars, an octopus.
- 12.0–14.0s everything it loves is collaged around a heart, with the buddy in the middle.
- 14.0–18.0s the buddy folds the note and sends it back; she opens it to a circled "you" and beams.
- 18.0–20s the whole town lights up; she waves to the buddy.

## Adapting the template
- Swap `CFG.question`, the cards (`LIST` for the labels, `S` for the illustrations) and the palette; keep the story beats on the 120 BPM grid.
- A new card follows the existing ones: a `back` sheet, the buddy drawn live, then a `front` sheet that tucks the buddy into the picture.

## How the reference is built
- One composition root with canvas layers. A single `render(t)` draws the
  whole frame from the master timeline time `t`; constants at the top hold copy,
  palette and timing so the film can be re-themed in one place.
- Every visible value is a pure function of `t` (eases, springs or keyframes
  evaluated from time). No state carries between frames.
- Textures (brush, grain, newsprint, handwriting, knit) and every cut-paper
  backdrop and card sheet are painted once into offscreen canvases at load;
  each frame only composites them and draws the few moving parts.

## Preview and video export
Keep the stage edge to edge in both gallery and MP4 capture. Playback controls
are an overlay that stays transparent until hovered or focused; never reserve
stage space for them or include them in the poster. Inside an Open Design
project the motion source player fits the stage and owns the controls, so the
preview shell yields its own fit and controls there.

The GSAP master timeline is the only clock. Render every visible layer from
its current time in the per-frame loop: export seeks suppress timeline
callbacks. Schedule the next animation frame before drawing so one failed
frame cannot stop the loop. Backward seeks must reproduce identical frames.
Await bundled fonts before playback and signal preview-ready at a legible hero
frame. Preserve `window.__timelines` and the composition's timing attributes.
Avoid large canvas gradients and per-pixel noise: they make every captured
frame expensive and slow the MP4 export.

## Sound
`assets/soundtrack.mp3` is an original 20-second score made for this template
and timed to its beats; no audio from the source video is used.
The music is part of the look being remade. These rules replace the general
sound guidance for this remake; apply the first one that matches the brief:

1. The user asks for no music: remove the `<audio>` element, do not copy the
   file, and freeze `motionDelivery.audio` as `silent`.
2. The user supplies an audio file and asks to use it: copy it into the film's
   `assets/` and point `<audio id="soundtrack">` at it.
3. Otherwise keep this score, including when the brief asks for different
   music, a genre or a mood. This flow cannot generate music: never generate,
   download or synthesize audio, and do not add voiceover.

Under rules 2 and 3, freeze `motionDelivery.audio` as `required`.

Keep `id="soundtrack"`, `data-start="0"` and a numeric `data-volume`. Set
`data-duration` to the shorter of the music and the film (the film's length
when the music's length is unknown); the export fades the music out there.
Never use `loop`: in a film longer than the music, the music plays once and the
rest is silent.

Do not add a music note to the final reply. Only when a music or voiceover
request could not be met, say so in one short sentence.

The `<audio>` element stays inside the composition root; the desktop exporter
mixes its local file into the MP4. Preview sound starts with the film; when the
browser blocks autoplay, the first click or key press turns it on, and Sound off
mutes it. Sound follows the master timeline, including pause and backward
seeks. Keep it silent during frame capture and in sandboxed gallery thumbnails.
