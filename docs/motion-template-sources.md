# Motion template sources and maintenance

These five examples extend the existing official HTML template mechanism:
`SKILL.md`, `example.html`, `open-design.json`, curated Home chips, and Community
cards. They use the existing preview baker, example binding, frozen reference
package, Remix, and HyperFrames MP4 exporter.

## Content provenance

The original October 8–9, 2026 work used the Opus 5.5 video community to choose
topics, including the collection at
[zhuyansen/awesome-opus-5.5-video](https://github.com/zhuyansen/awesome-opus-5.5-video)
and discovery through
[yihui-dev/awesome-opus5-5-videos](https://github.com/yihui-dev/awesome-opus5-5-videos)
and [Skillry's collection](https://skillry.dev/ai-videos/opus-5-5).
View-count ranking was an informal topic-selection aid, not evidence that these
are recreations of the five most popular individual videos.

Prompts were written for OD. HTML previews were generated in OD, then packaged
with local script dependencies, poster-ready markers, and export-safe drawing.
The source-project mapping comes from the original generator's `sources.json`;
all five original `index.html` files were still present during the handoff audit.

| Template | Original OD project |
| --- | --- |
| Procedural 3D island | `5873852b-3e24-4734-a909-903ad038a8e3` |
| Explainer | `baab39ba-f4ee-4261-a302-a98cd2c58dac` |
| Product launch | `d38769ce-f3d6-4451-9977-72887e551fce` |
| Showreel | `aebf983b-6223-46eb-bf63-4f7d03087695` |
| Data story | `515296bd-a73b-475d-b343-ee1451b2b695` |

Driftnote and Studio Kinetik are fictional examples. Chart figures are sample
content, not a verified business dataset. Preserve that distinction when
adapting a template.

## Local dependencies and export

The bundled script versions are GSAP 3.12.5 and Three.js 0.160.0, originally
retrieved from their version-pinned jsDelivr package URLs. No runtime script CDN
is required. Each SKILL explicitly names the dependencies that the existing
frozen-package scanner should carry.

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
