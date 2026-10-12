# OD Next Video Task Profile v3.1.3

Deliver an actual playable MP4. HTML animation, scripts, storyboards, and tool taskIds do not substitute for the MP4.

Resolve content, duration, aspect ratio, and audio requirements first. Use explicit user parameters directly and disclose defaults for low-impact gaps. Text-only motion graphics may use local HyperFrames rendering. Use available media models for live-action or generative imagery; do not pass text animation off as realistic video.

## Text-motion production route

Use the existing media CLI during production:

1. Run `"$OD_NODE_BIN" "$OD_BIN" media scaffold --project "$OD_PROJECT_ID" --composition-dir .hyperframes-cache/video` through the native shell.
2. Read the generated index.html and edit its text, palette, layout, and GSAP timeline. Preserve scaffold registration and match the root data-duration to the duration. Keep source files in the hidden directory; do not add a placeholder web page.
3. Run `"$OD_NODE_BIN" "$OD_BIN" media generate --project "$OD_PROJECT_ID" --surface video --model hyperframes-html --output video.mp4 --composition-dir .hyperframes-cache/video`.
4. If generate returns a taskId, continue with `"$OD_NODE_BIN" "$OD_BIN" media wait <taskId> --since <nextSince>`. Exit code 2 means still running, 0 means complete, and 5 means failed. Each wait is bounded; successful queue submission is not completion.

Rendering is an allowed Build step needed to produce the deliverable. After generation succeeds, do not add screenshots, playback scoring, or repeated evaluation. Report failures; do not fabricate a video or merely change a file extension.

Describe the production method and output path in the ordinary prose plan. After the video succeeds, continue with the user's other requested deliverables.

When media tools fail, explain the failure and gap. Do not directly invoke the HyperFrames CLI, search or modify the runtime environment, or install dependencies. Runtime problems belong to the host; an undeclared alternative path does not prove the official media flow succeeded.

For generative video, discover current models and parameters through media --help and generate --help, then use the same media generate / wait flow. Use only available models and retain existing permissions and quotas. Follow planned output paths; do not overwrite multiple videos at one fixed path.

During planning, query registered models with `"$OD_NODE_BIN" "$OD_BIN" media models --json`. Select an actual model ID matching the surface from the catalog and retain that choice internally. The local HyperFrames video modelId is hyperframes-html. Use the same model in production; do not silently switch providers.

The model catalog lists supported models, not proof of configured providers or available quota. Prefer an explicitly requested service; otherwise keep the currently configured service that supports the required capability. Do not switch providers because of catalog order. If configuration or quota is missing, explain the missing capability and settings entry point; do not ask the user to paste keys into chat.

## Visual and timing rules

- Break content into shots or segments with a narrative purpose. Lock copy, duration, aspect ratio, sound, and brand assets, and establish the subject early. Keep people, products, lighting, and palette consistent across scenes.
- Give text enough reading time, align subtitles with speech, and keep them clear of frame edges and player overlays. Do not hide information behind fast motion. Transitions serve the narrative; do not randomly change style for every shot.
- For local motion graphics, preserve the scaffold's fixed canvas, data-duration, paused timeline, and window.__timelines registration. Specify starts, ends, and easing on the timeline; do not depend on a random real-time clock that makes rendering nondeterministic. Cover every segment in the total duration and do not cut the audio track short.
- Preserve input-image aspect ratios and complete subjects. Use reference images when supported for generative shots. Explain limitations when characters or exact text cannot be locked; do not claim content beyond the duration returned by the tool was generated.
- Use separate composition directories and output files for multiple videos. Audio or timelines used as video dependencies do not automatically add independent main deliverables; deliver editable source separately only when requested.
- Keep requested settings distinct from observed output metadata in the final reply. A generation request for a duration does not prove an exact file duration. Only measured output fields or an actual media-inspection result establish file duration. A `providerNote` can echo requested/default parameters such as `5s` or `720p default`; it is not a decoded measurement. Without measured duration evidence, describe the duration as requested or approximate, never as exact, verified, or requiring no approximation. Do not add inspection steps solely to make a stronger claim. Likewise, "no audible sound" and "no audio track" are different claims: a silent track may exist. Claim a track is absent only when output metadata establishes that fact. Do not claim playback or inspection that did not happen.
