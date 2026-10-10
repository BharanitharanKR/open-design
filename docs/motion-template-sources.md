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

## October 10 visual revision

The revision rewrites the product, noise-cancellation, and data-story HTML;
it refines the existing island and Showreel. It was edited directly in source,
not produced by a second OD generation run. No reference video's footage,
screenshots, music, or project source was imported into these templates.

Discovery used [OpenChamber's collection](https://data.openchamber.dev/opus-5-5-videos/).
The following are original-post observations on October 10, 2026, in Beijing
time. Views are platform counters, not unique viewers or OD template results.

| Reference | Observed views / likes / bookmarks | Relevance and boundary |
| --- | --- | --- |
| [Stephan Livera](https://x.com/stephanlivera/status/2103315922098470926), 13:50 | 2,265,583 / 17,122 / 13,078 | Kinetic type and a short Motion showreel; not a shot-for-shot recreation |
| [zero](https://x.com/twoclipping/status/2103273003555402193), 13:57 | 1,153,766 / 12,626 / 20,955 | UI shape continuity; full playback was not verified |
| [Deedy](https://x.com/deedydas/status/2102787937482252537), about 15:30 | 348,496 / 3,267 / 4,694 | Large type, clear argument, product presentation; a different product |
| [Meng To](https://x.com/MengTo/status/2102760783344189761), about 15:33 | 482,346 / 6,572 / 3,805 | Atmospheric procedural scenery and readable landmarks; a Japanese river scene, not an island |
| [Skylar Kitchen](https://x.com/Skylartkitchen/status/2103522230957420843), about 15:39 | 198,629 / 1,865 / 2,253 | A garden-irrigation tutorial; a later genre cross-check, not the source of the noise-cancellation topic |

The new data story compares one million seconds (11.574 days) with one billion
seconds (31.688 years, using 365.25 days/year). Its rounded labels and thousand
dots come from arithmetic. It has no verified viral source. The ANC animation
is an idealized equal-amplitude, opposite-phase illustration, not a claim that
real headphones cancel every sound perfectly.

These references support design choices and observed reach of the original
posts. They do not prove that our five templates are viral, the most popular,
or likely to achieve the same reach. No OD exposure, click, Remix, retention,
or sharing metrics have been collected for this revision.

At about 15:58 Beijing time, the zero original was rechecked: 1,153,989 views,
12,625 likes and 20,955 bookmarks. Playback succeeded on this visit; the opening
button, a volume slider at about 5.24 seconds, and a completion notification at
about 12.22 seconds were observed. This adds actual-frame evidence to the earlier
failed playback attempts; it is still not a continuous full-film review.

The final island refinement corrects custom-shader output conversion, softens
the sky/water relationship, moves oversized clouds into the distance, and widens
the camera orbit to keep the dock and sailboat in frame. Custom ShaderMaterial
output needs its own color-space conversion, as described in the
[Three.js color-management manual](https://threejs.org/manual/pages/color-management.html).
The refined 15-second MP4 was rendered through the existing production Electron
path and reviewed at half-second intervals. This is visual/export evidence,
not a user-preference or popularity result.

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
