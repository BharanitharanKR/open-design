# Motion templates: sources and maintenance

Five official HTML examples populate the Motion design Home entry and Community
category: a procedural island, noise-cancellation explainer, product launch,
showreel, and data story. They use the existing plugin preview, example binding,
frozen reference package, Remix, and HyperFrames MP4 export paths.

## Selection evidence

Topic selection used the October 8, 2026 snapshot of
[awesome-opus-5.5-video](https://github.com/zhuyansen/awesome-opus-5.5-video/blob/main/cases.json):
1,402 cases, captured at `2026-10-08T09:18:38.003Z`, SHA-256
`0e443a045a62b6494ffb2f90b8d5b550b978064031d9543a256343d328bec027`.
The original selection record and snapshot are archived in the
[implementation evidence document](https://powerformer.feishu.cn/docx/NvfoduBi4oj5pgxqnoYccdonn0g).

The original keyword grouping, recalculated from that snapshot, yielded:

| Direction | Matching cases | Summed recorded views |
| --- | ---: | ---: |
| Explainer | 117 | 12,427,430 |
| Product launch / promo | 95 | 9,950,709 |
| Showreel | 44 | 9,701,547 |
| Data / chart | 78 | 7,498,070 |

Groups can overlap. Counts describe the collected posts at the snapshot time.
The selection also included [Dan Greenheck's procedural island](https://x.com/dangreenheck/status/2102878170089169235),
with 888,215 recorded views, and [Stephan Livera's showreel](https://x.com/stephanlivera/status/2103315922098470926),
with 2,246,353. These informed the template directions. OD-specific prompts and
compositions implement those directions; the Home order is curated.

## Template content

Initial HTML was generated in OD and subsequently refined in source. The source
project mapping is retained from the original generator's `sources.json`.

| Template | Original OD project | Current content |
| --- | --- | --- |
| 3D island | `5873852b-3e24-4734-a909-903ad038a8e3` | Procedural island, shader water, continuous camera orbit |
| Explainer | `baab39ba-f4ee-4261-a302-a98cd2c58dac` | Idealized equal-amplitude, opposite-phase noise cancellation |
| Product launch | `d38769ce-f3d6-4451-9977-72887e551fce` | Fictional Driftnote meeting app |
| Showreel | `aebf983b-6223-46eb-bf63-4f7d03087695` | Fictional Studio Kinetik; illustrative chart figures |
| Data story | `515296bd-a73b-475d-b343-ee1451b2b695` | One million seconds versus one billion seconds |

The data story uses 86,400 seconds/day and 365.25 days/year: 11.574 days versus
31.688 years, rounded in the film to 11.6 days and 31.7 years. One thousand dots
each represent one million seconds. The explainer labels phase cancellation as
idealized; real headphones reduce noise with practical limits.

Visual refinements use large typography, a distinct palette per film, readable
story beats, locally bundled fonts, and deterministic per-frame animation.
The island applies tone mapping and output color-space conversion in its custom
shaders and keeps the dock and sailboat in frame. Generated posters and gallery
clips are derived from each committed `example.html`.

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

The package regression checks that all referenced local scripts can be restored
byte-for-byte. The browser regression checks callback-suppressed export seeking,
including backward scrubbing of the Showreel's slider, graph, and signature.
Keep procedural drawing in the shared per-frame renderer: nested tween callbacks
alone do not execute during MP4 export.
