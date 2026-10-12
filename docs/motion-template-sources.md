# Motion templates: sources and maintenance

Five official HTML examples populate the Motion design Home entry and Community
category. They use the existing plugin preview, example binding, frozen
reference package, Remix, and HyperFrames MP4 export paths.

## Selection

**Scope.** The motion design spec defines motion design as dynamic design that
communicates through composition, type, graphics and timing, covering four
content types: brand and product films, kinetic typography, explainer
animation, and procedural art. Templates are video deliverables: an MP4 plus
editable HTML source.

**Source of reach.** The October 9, 2026 snapshot of
[awesome-opus-5.5-video](https://github.com/zhuyansen/awesome-opus-5.5-video/blob/main/cases.json)
(1,427 cases, `stats_checked_at` `2026-10-09T09:26:20.426Z`), ranked by
single-post views.

**Rule.**
1. A post qualifies when it shows a finished film (not a game, app demo or
   model comparison) whose content belongs to one of the four types, made in
   code that runs in a browser, with content identifiable from its title,
   prompt or video.
2. Each type takes its most-viewed qualifying post.
3. The fifth template takes the most-viewed remaining qualifying post across
   the four types.

| Template | Type | Anchor post | Recorded views |
| --- | --- | --- | ---: |
| Explainer | Explainer animation | [Interactive camera focus lens lab](https://x.com/RyanSael/status/2102591147927654847) | 3,492,763 |
| Showreel | Brand film | [15-second motion designer showreel](https://x.com/stephanlivera/status/2103315922098470926) | 2,246,353 |
| Product launch | Product film | [Motion design launch video](https://x.com/uxmiles/status/2104618175803609305) | 1,775,824 |
| 3D island | Procedural art | [Procedural ocean island](https://x.com/dangreenheck/status/2102878170089169235) | 888,215 |
| Kinetic typography | Kinetic typography | [Day-of-week kinetic motion graphic](https://x.com/nokonoko_1203/status/2105922366190784915) | 132,347 |

Home order follows the table. Anchors set the subject, genre and pacing; every
composition, copy line and soundtrack is original.

## Template content

All five `example.html` files are hand-written code authored by Claude Opus 5.5
and checked frame by frame.

| Template | Content |
| --- | --- |
| Explainer | How a camera focuses; rays follow the thin-lens equation `1/f = 1/u + 1/v` |
| Showreel | Fictional Studio Kinetik; five techniques cut to 128 BPM |
| Product launch | Fictional Driftnote meeting app; toggle turns fragments into a summary |
| 3D island | Procedural tropical island in a turquoise lagoon, built in Three.js; one continuous camera move |
| Kinetic typography | "What day is it?": a weekday reel, the answer, four beat cuts and a countdown, at 120 BPM |

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

## Fonts in previews

Plugin previews serve `example.html` under a restrictive CSP. The preview and
asset routes allow same-origin fonts (`font-src 'self' data:`), and relative
`url()` references inside inline `<style>` blocks are mapped to the plugin
asset route, so `@font-face` rules load the bundled Space Grotesk in the
gallery, covers and Remix alike.

## Audio

All five templates include locally authored procedural soundtracks in
`assets/soundtrack.mp3`, timed to their beats. No reference-post audio was
copied and no audio-generation model was used: they are synthesized from
oscillators and filtered noise. HTML preview sound is enabled by the Sound on
control and follows the master timeline. The desktop export path resolves timed
local audio files and mixes them into the MP4 with FFmpeg. Gallery clips keep
the existing muted preview behavior.
