# Motion templates: sources and maintenance

Five official HTML examples populate the Motion design Home entry and Community
category: a camera-focus explainer, a motion designer showreel, a product
launch, a procedural 3D island and a wordless animated short. They use the
existing plugin preview, example binding, frozen reference package, Remix, and
HyperFrames MP4 export paths.

## Selection evidence

Topics follow the most-viewed single posts in the October 9, 2026 snapshot of
[awesome-opus-5.5-video](https://github.com/zhuyansen/awesome-opus-5.5-video/blob/main/cases.json)
(1,427 cases, `stats_checked_at` `2026-10-09T09:26:20.426Z`). Games and
model-vs-model comparisons were excluded because they are not reusable video
templates; posts that relied on non-code tools (image/video generators, After
Effects, Blender) were excluded because OD renders from HTML. Each template is
anchored to the most-viewed eligible post of its genre:

| Template | Anchor post | Recorded views |
| --- | --- | ---: |
| Explainer | [Interactive camera focus lens lab](https://x.com/RyanSael/status/2102591147927654847) | 3,492,763 |
| Showreel | [15-second motion designer showreel](https://x.com/stephanlivera/status/2103315922098470926) | 2,246,353 |
| Product launch | [Motion design launch video](https://x.com/uxmiles/status/2104618175803609305) | 1,775,824 |
| 3D island | [Procedural ocean island](https://x.com/dangreenheck/status/2102878170089169235) | 888,215 |
| Animated short | [Dot prompt becomes Pixar-style animation](https://x.com/cherry_mx_reds/status/2105825930799432073) | 828,141 |

The earlier data story was replaced: the most-viewed eligible data
visualization had 421,430 views. Home order follows the table. Anchors inform
genre and pacing only; every composition, copy line and soundtrack is original.

## Template content

All five `example.html` files were authored directly by Claude Opus 5.5 as
hand-written code and checked frame by frame. They are not exported from an OD
generation run.

| Template | Content |
| --- | --- |
| Explainer | How a camera focuses; rays follow the thin-lens equation `1/f = 1/u + 1/v` |
| Showreel | Fictional Studio Kinetik; five techniques cut to 128 BPM |
| Product launch | Fictional Driftnote meeting app; toggle turns fragments into a summary |
| 3D island | Procedural low-poly island in Three.js; one continuous camera move |
| Animated short | Wordless story of a dot reaching a star with its friends |

The explainer computes blur on the sensor as `2A·|v − d| / v`, so focusing and
aperture changes show the physically correct result. Each film draws every
frame in a single `render(t)` from the GSAP master timeline time.

## Gallery publication

`open-design.json` points to `example.html`; source and referenced assets ship
with the official plugin. The existing pre-merge preview workflow validates
rendering. After merge, `bake-plugin-previews.yml` uploads content-addressed
posters and clips to R2 and opens the rolling preview-manifest PR. The release
bake writes the authoritative manifest for its release branch. Verify that
release's five preview entries and remote resources before release acceptance.

Local preview overrides and verification output stay outside tracked source.
The release pipeline owns publication; template authors maintain HTML and assets.

## Local dependencies and export

The bundled script versions are GSAP 3.12.5 and Three.js 0.160.0, originally
retrieved from their version-pinned jsDelivr package URLs. No runtime script CDN
is required. Each SKILL explicitly names the dependencies that the existing
frozen-package scanner should carry.

Space Grotesk is bundled locally with its SIL Open Font License from the
[official Google Fonts directory](https://github.com/google/fonts/tree/main/ofl/spacegrotesk).
Keep the font and license in each portable package. A downloaded font/library
is a dependency; it should not be described as AI-generated visual footage.

Three.js exceeds the existing 256 KiB side-file limit. The gallery and Remix
use the original `assets/three.min.js`; the frozen reference carries an identical
gzip copy, with decompression instructions in its SKILL. When changing the
vendored Three.js file, regenerate its compressed copy deterministically:

```sh
gzip -n -9 -c plugins/_official/examples/motion-3d-scene/assets/three.min.js > plugins/_official/examples/motion-3d-scene/assets/three.min.js.gz
```

The package regression checks that all referenced local scripts, fonts and the
soundtrack restore byte-for-byte. The browser regression seeks each film with
callbacks suppressed, forward and backward, and requires identical canvas
output at each timestamp. Keep all drawing in the per-frame renderer: nested
tween callbacks alone do not execute during MP4 export.

## Audio

All five templates include locally authored procedural soundtracks in
`assets/soundtrack.mp3`, timed to their beats. No reference-post audio was
copied and no audio-generation model was used: they are synthesized from
oscillators and filtered noise. HTML preview sound is enabled by the Sound on
control and follows the master timeline. The desktop export path resolves timed
local audio files and mixes them into the MP4 with FFmpeg. Gallery clips keep
the existing muted preview behavior.
