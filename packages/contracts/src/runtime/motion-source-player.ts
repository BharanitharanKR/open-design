import { findRealTagOffset, HTML_TAG_PATTERNS, prependAfterDoctype } from './html-injection-points';

export const MOTION_PLAYER_MARKER = 'data-od-motion-source-player';

// One clock contract for editable video playback and frame rendering. Check the
// authored timeline BEFORE HyperFrames can pad it or reset its playback speed.
export const MOTION_TIMELINE_CHECK_SCRIPT = `
window.__odValidateMotionTimeline = function (root, tl) {
  var mode = document.querySelector('meta[name="od-motion-output"]');
  if (!mode || mode.content !== 'video') return null;
  var seconds = Number(root && root.getAttribute('data-duration'));
  if (!Number.isFinite(seconds) || seconds <= 0) return 'Motion video requires a positive data-duration.';
  if (!tl || typeof tl.duration !== 'function' || typeof tl.timeScale !== 'function') return 'Motion video requires a registered GSAP timeline.';
  if (!Number.isFinite(tl.timeScale()) || Math.abs(tl.timeScale() - 1) > 0.000001) return 'Motion video timeScale must be 1. Do not use duration(seconds) to stretch the timeline; author tracks in real seconds.';
  if (!Number.isFinite(tl.duration()) || Math.abs(tl.duration() - seconds) > 0.001) return 'Motion video timeline duration must equal data-duration. Add a clock tween at time 0 for the full duration; do not change playback speed.';
  if ((typeof tl.repeat === 'function' && tl.repeat() !== 0) || (typeof tl.delay === 'function' && tl.delay() !== 0)) return 'Motion video master timeline must have no repeat or delay.';
  return null;
};`;


// Shared by URL previews, srcdoc previews and the persisted editable source.
// The renderer installs its flag before author scripts; it never sees chrome,
// layout scaling, poster seeking, or wall-clock playback from this runtime.
const PLAYER = `<script data-od-motion-source-player="4">
${MOTION_TIMELINE_CHECK_SCRIPT}
(function () {
  function boot() {
    if (window.__odMotionRender || window.__odMotionSourcePlayer) return;
    var root = document.querySelector('[data-composition-id][data-duration][data-width][data-height]');
    var mode = document.querySelector('meta[name="od-motion-output"]');
    if (!root || (mode && mode.content === 'interactive')) return;
    window.__odMotionSourcePlayer = true;
    var width = Number(root.dataset.width), height = Number(root.dataset.height);
    if (!(width > 0 && height > 0)) return;
    var hint = document.createElement('output');
    hint.setAttribute('data-od-motion-status', ''); hint.setAttribute('role', 'status');
    hint.style.cssText = 'position:fixed;bottom:12px;right:12px;z-index:2147483647;padding:6px 10px;border-radius:6px;background:#17191d;color:white;font:13px system-ui;display:none';
    document.body.appendChild(hint);
    function notice(text) { hint.textContent = text; hint.style.display = text ? 'block' : 'none'; }
    var tracks = Array.prototype.map.call(document.querySelectorAll('audio[src]'), function (audio) {
      audio.pause(); audio.autoplay = false;
      return { audio: audio, start: Number(audio.dataset.start || 0), duration: Number(audio.dataset.duration), volume: Number(audio.dataset.volume || 1), pending: false, blocked: false };
    });
    var muted = false;
    function syncAudio(time, playing, force) {
      tracks.forEach(function (track) {
        var audio = track.audio, local = time - track.start;
        var active = local >= 0 && local < track.duration;
        audio.volume = Math.max(0, Math.min(1, track.volume)); audio.muted = muted;
        if (!active || !playing) audio.pause();
        var target = Math.max(0, Math.min(track.duration, local));
        if (audio.readyState > 0 && (force || Math.abs(audio.currentTime - target) > .2)) audio.currentTime = target;
        if (active && playing && audio.paused && !track.pending && !track.blocked) {
          track.pending = true;
          var promise = audio.play();
          if (promise) promise.catch(function (error) {
            if (error && error.name === 'AbortError') return;
            track.blocked = true;
            notice(error && error.name === 'NotAllowedError' ? '点击画面开启声音' : '音频无法播放，请检查素材');
          }).finally(function () { track.pending = false; });
          else track.pending = false;
        }
      });
    }
    var fitStyle = document.createElement('style');
    fitStyle.textContent = 'html,body{width:100% !important;height:100% !important;margin:0 !important;overflow:hidden !important}';
    document.head.appendChild(fitStyle);
    var stage = document.createElement('div');
    root.parentNode.insertBefore(stage, root); stage.appendChild(root);
    function fit() {
      var scale = Math.min(innerWidth / width, Math.max(1, innerHeight) / height);
      stage.style.cssText = 'position:fixed;width:' + width + 'px;height:' + height + 'px;left:' + ((innerWidth-width*scale)/2) + 'px;top:' + ((innerHeight-height*scale)/2) + 'px;transform-origin:0 0;transform:scale(' + scale + ')';
    }
    fit(); window.addEventListener('resize', fit);
    var started = Date.now();
    function connect() {
      var tl = window.__timelines && window.__timelines[root.dataset.compositionId];
      if (!tl || typeof tl.seek !== 'function' || typeof tl.play !== 'function' || !(tl.duration() > 0)) {
        if (Date.now()-started < 15000) { setTimeout(connect, 100); return; }
        notice('动效未就绪，请检查时间轴或依赖文件'); return;
      }
      var timingError = window.__odValidateMotionTimeline(root, tl);
      if (timingError) { tl.pause(); notice(timingError); return; }
      var duration = tl.duration(), playing = true;
      function play() { playing = true; if (tl.time() >= duration) tl.seek(0, false); tl.play(); syncAudio(tl.time(), true, true); }
      function pause() { playing = false; tl.pause(); syncAudio(tl.time(), false, true); }
      function seek(time) { pause(); tl.seek(Math.max(0, Math.min(duration, Number(time))), false); syncAudio(tl.time(), false, true); }
      function replay() { seek(0); play(); }
      window.__odMotionPlayer = {
        play: play, pause: pause, seek: seek, replay: replay,
        setMuted: function (value) { muted = !!value; syncAudio(tl.time(), playing, false); },
        state: function () { return { playing: playing, time: tl.time(), duration: duration, muted: muted,
          audio: tracks.map(function (track) { return { paused: track.audio.paused, time: track.audio.currentTime, muted: track.audio.muted, volume: track.audio.volume, blocked: track.blocked }; }) }; }
      };
      root.addEventListener('click', function () {
        var blocked = tracks.some(function (track) { return track.blocked; });
        if (blocked) { tracks.forEach(function (track) { track.blocked = false; }); notice(''); if (playing) syncAudio(tl.time(), true, true); else play(); }
        else if (playing) pause(); else play();
      });
      tl.seek(0, false); play();
      function update() {
        if (!stage.isConnected) { pause(); return; }
        if (playing && tl.time() >= duration) { tl.seek(0, false); tl.play(); syncAudio(0, true, true); }
        syncAudio(tl.time(), playing && !tl.paused(), false);
        setTimeout(update, playing ? 33 : 200);
      }
      update();
    }
    connect();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true}); else boot();
})();
</script>`;

export function injectMotionSourcePlayer(html: string): string {
  // Runtime checks the actual DOM too; these prefilters avoid adding code to
  // ordinary prototypes/decks and do not mistake JS samples for HTML tags.
  if (findRealTagOffset(html, /<[^/!][^>]*\bdata-composition-id\s*=/i) < 0) return html;
  const existing = findRealTagOffset(html, /<script\b[^>]*\bdata-od-motion-source-player\b/i);
  if (existing >= 0) {
    const script = /^<script\b[^>]*>[\s\S]*?<\/script\s*>/i.exec(html.slice(existing));
    if (!script || /data-od-motion-source-player="4"/.test(script[0])) return html;
    return html.slice(0, existing) + PLAYER + html.slice(existing + script[0].length);
  }
  const end = findRealTagOffset(html, HTML_TAG_PATTERNS.bodyClose);
  return end < 0 ? html + PLAYER : html.slice(0, end) + PLAYER + html.slice(end);
}

export function markMotionFrameRender(html: string): string {
  return prependAfterDoctype(html, '<script>window.__odMotionRender=true;</script>');
}
