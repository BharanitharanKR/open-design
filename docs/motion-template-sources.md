# Motion templates: sources and maintenance

Five official HTML examples populate the Motion design Home entry and Community
category. Each one is a remake of a viral motion post, rebuilt in code so the
template preview shows that post's look. They use the existing plugin preview,
example binding, frozen reference package, Remix, and HyperFrames MP4 export
paths.

## Selection

Four templates come from the Motion design category of
[awesome-opus-5.5-video](https://github.com/zhuyansen/awesome-opus-5.5-video)
(1,483 cases, `updated_at` `2026-10-11T05:17:47.827Z`; view counts checked
`2026-10-05`): the most-viewed posts with a creator-published prompt that code
alone can reproduce, one per kind. The fifth is a Douyin post chosen by the
product owner. The library's top-10% view threshold is 255,312.

| Template | Original post | Views | Likes | Saves | Rank (all / Motion) |
| --- | --- | ---: | ---: | ---: | --- |
| Motion Designer Showreel | [@stephanlivera](https://x.com/stephanlivera/status/2103315922098470926) | 2,246,353 | 17,030 | 13,027 | 9 / 1 |
| High-Energy Motion Reel | [@crvdesign0](https://x.com/crvdesign0/status/2103817034618339682) | 1,093,842 | 2,826 | 6,164 | 24 / 6 |
| One-Shape UI Motion | [@twoclipping](https://x.com/twoclipping/status/2103273003555402193) | 1,034,374 | 12,100 | 20,060 | 28 / 7 |
| Pixel Art Wizard | [@majidmanzarpour](https://x.com/majidmanzarpour/status/2102476258948927543) | 453,228 | 2,557 | 2,673 | 81 / 14 |
| The Future Is Already Here | [Douyin](https://www.douyin.com/video/7690393045783346918) | — | 6,439 | 2,164 | — |

Douyin does not publish play counts; its figures were read on 2026-10-12.
Home and Community show The Future Is Already Here first, then the others in
table order.

## Template content

Each `example.html` is rebuilt frame by frame against its original: layout,
palette, type, motion and timing. On-screen copy is English. Brand names in the
originals are kept only where they are the work's own subject (the showreel
signs as the model that made it); the soundtrack of every template is original.
The wizard's original is silent; its remake adds an 8-bit score.

| Template | Length | Differences from the original |
| --- | --- | --- |
| Motion Designer Showreel | 15 s | Fonts are the closest open equivalents |
| High-Energy Motion Reel | 15 s | Arabic copy set in English |
| One-Shape UI Motion | 14 s | 1440×1440 square kept at scale on a 1920×1080 stage |
| Pixel Art Wizard | 11.28 s | Two IDLE → CHARGE → CAST → RECOVER cycles |
| The Future Is Already Here | 20 s | 20 s highlight cut of the 62 s original, in English |

The "Use" prompt is the creator's published prompt where one exists (showreel,
high-energy reel, UI motion, wizard; the UI motion and wizard prompts are
condensed to their visual brief). The Douyin prompt is not public, so its
prompt describes the cut.

## Fonts

All fonts are SIL Open Font License families from the
[Google Fonts repository](https://github.com/google/fonts), subset to the glyphs
the template draws and bundled with their license files: Archivo, Instrument
Serif, JetBrains Mono, IBM Plex Sans, Geist and Unbounded. Plugin previews allow
same-origin fonts and map relative `url()` references in inline styles to the
plugin asset route, so the gallery, covers and Remix render the bundled fonts.

## Gallery publication

`open-design.json` points to `example.html`; source and referenced assets ship
with the official plugin. The existing pre-merge preview workflow validates
rendering. After merge, `bake-plugin-previews.yml` uploads content-addressed
posters and clips to R2 and opens the rolling preview-manifest PR. Each
template signals preview-ready within the baker's 15-second budget. Verify the
release's five preview entries and remote resources before release acceptance.

## Local dependencies and export

GSAP 3.12.5 and Three.js 0.160.0 are vendored; no runtime script CDN is used.
Every SKILL names each asset so the frozen-package scanner carries it.
Three.js exceeds the 256 KiB side-file limit: the gallery and Remix use
`assets/three.min.js`, and the frozen reference carries an identical gzip copy
with decompression instructions in the SKILL. When changing the vendored file:

```sh
gzip -n -9 -c plugins/_official/examples/motion-future/assets/three.min.js > plugins/_official/examples/motion-future/assets/three.min.js.gz
```

`motion-future` keeps its scene sources outside the repository; `assets/app.js`
is the bundled, self-contained build and must be loaded by a static
`<script src>` so plugin previews can rewrite its URL.

The package regression checks that referenced scripts, fonts, licenses and the
soundtrack restore byte-for-byte. The browser regression seeks each film with
callbacks suppressed, forward and backward, and requires identical canvas
output at each timestamp, including hidden layers.

## Audio

Every template carries an original procedural soundtrack in
`assets/soundtrack.mp3`, timed to its beats. No audio from the original posts is
used and no audio-generation model was involved. HTML preview sound starts with
the film; when the browser blocks autoplay, the first click or key press turns
it on, and Sound off mutes it. Sound follows the master timeline. The desktop
export path mixes the timed local audio into the MP4 with FFmpeg.
