---
title: "Open Design 0.26.0 — Motion, Sharing, and a Smoother Flow"
description: "Create motion work, share files through public links, and keep the everyday design flow moving with more reliable chat, previews, uploads, plugins, models, and funding feedback."
---

### 🌟 Codename: *Make It Move*

🎬 **Motion becomes a first-class part of the workspace.** From a video brief to editable source and a finished MP4, Open Design now helps you make movement without leaving the place where the rest of the work lives. Sharing is easier too—and the small interruptions that break a creative flow have fewer places to hide.

## 🔥 Highlights

- 🎞️ **Motion Design—make the idea move.** Motion Design now appears on Home and in Community, with curated helpers and examples. Start from an editable source, create motion for a video brief, and export an MP4 when the work needs to travel. (#8619)
- 🔗 **Public links that keep the conversation with the work.** Publish files as public links, pause or resume a share when needed, and keep synced comments alongside the file instead of splitting feedback across tools. (#8408) Thanks @alchemistklk.
- 🧩 **Plugins stay attached to the work you send.** Applying a plugin in an existing project now preserves its selected snapshot and respects the capabilities you already granted. (#7597) Thanks @lorenzozanee.
- 🧠 **Bring the model you actually use.** During BYOK onboarding, enter a custom model instead of being limited to the suggested list—useful for local Ollama, self-hosted endpoints, and newer models. (#6076) Thanks @dpeterson01.
- 🌀 **A stuck chat can find its way back.** When a chat log stops following its layout, Open Design recovers scrolling and keeps wheel and keyboard navigation available. (#8251) Thanks @lefarcen.
- 🖼️ **Finished work shows up where you expect it.** After a run creates an image or file, Open Design refreshes its snapshot and opens the result by the existing rules—without taking over a preview you selected yourself. (#8744)

> 📥 **Download:** [Open Design 0.26.0](https://github.com/nexu-io/open-design/releases/tag/open-design-v0.26.0).

## ✨ Added

### 🎨 Studio, editing and canvas

- Motion Design adds curated skills, bundled examples, editable sources, and MP4 production for video-oriented work. (#8619)

### 🔑 Models and plugins

- BYOK onboarding accepts custom model names alongside the built-in suggestions. (#6076) Thanks @dpeterson01.
- Existing projects retain the plugin snapshot and granted capabilities chosen for an apply. (#7597) Thanks @lorenzozanee.

## 🐛 Fixed

### 🤝 Sharing and collaboration

- Existing cloud file identities and aliases are recovered before publishing, so resumed or updated shares keep their original links when local mappings are missing. (#8859, #8867) Thanks @alchemistklk.
- Uploading duplicate filenames in one batch keeps names and contents in submission order. (#8742)

### 🧠 Agents, runs and Home

- Home keeps a draft blocked when funding confirmation is insufficient or unknown; billing changes refresh the hint without sending that draft for you. (#8688, #8775, #8786)
- The default AMR model is resolved from the caller's available catalog, avoiding an avoidable first-run failure. (#8519) Thanks @Siri-Ray.
- Cached offline content now respects revocation and expiry across restarts. (#8676)

### 🖥️ Desktop and workspace

- Workspace users can complete the desktop update safety check without an unscoped active-run request blocking restart. (#8462) Thanks @Siri-Ray.
- A saved empty local file selection survives restore instead of being replaced by a default artifact. (#8745) Thanks @open-design-crew.

## 🙏 Thanks to everyone who shipped 0.26.0

@alchemistklk · @hihicheems · @Siri-Ray · @dpeterson01 · @lefarcen · @lorenzozane
