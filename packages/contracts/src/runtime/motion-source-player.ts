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
const PLAYER = `<script data-od-motion-source-player="2">
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
    var host = document.createElement('div');
    host.setAttribute('data-od-motion-controls', '');
    host.style.cssText = 'position:fixed;inset:auto 0 0;z-index:2147483647;height:52px;display:block';
    var shadow = host.attachShadow({mode:'open'});
    shadow.innerHTML = '<style>:host{color-scheme:dark}*{box-sizing:border-box}.bar{height:52px;display:flex;align-items:center;gap:10px;padding:8px 12px;background:#17191d;color:#fff;font:13px system-ui}button{border:1px solid #626772;border-radius:6px;background:#252932;color:white;padding:6px 10px;cursor:pointer}button:focus-visible,input:focus-visible{outline:2px solid #8bb8ff}input{min-width:40px;flex:1;accent-color:#2f6feb}output{white-space:nowrap}</style><div class="bar"><button id="play" disabled>播放</button><button id="replay" disabled>重播</button><button id="sound" hidden aria-pressed="false">静音</button><input aria-label="播放进度" type="range" min="0" max="1" step="0.01" value="0" disabled><output role="status">正在加载动效…</output></div>';
    document.body.appendChild(host);
    var play = shadow.getElementById('play'), replay = shadow.getElementById('replay');
    var slider = shadow.querySelector('input'), status = shadow.querySelector('output');
    var sound = shadow.getElementById('sound');
    var tracks = Array.prototype.map.call(root.querySelectorAll('audio[src]'), function (audio) {
      audio.pause(); audio.autoplay = false;
      return { audio: audio, start: Number(audio.dataset.start || 0), duration: Number(audio.dataset.duration), volume: Number(audio.dataset.volume || 1), pending: false };
    });
    var muted = false, audioError = '';
    sound.hidden = tracks.length === 0;
    sound.onclick = function () { muted = !muted; sound.textContent = muted ? '开启声音' : '静音'; sound.setAttribute('aria-pressed', String(muted)); tracks.forEach(function (track) { track.audio.muted = muted; }); };
    function syncAudio(time, playing, force) {
      tracks.forEach(function (track) {
        var audio = track.audio, local = time - track.start;
        var active = local >= 0 && local < track.duration;
        audio.volume = Math.max(0, Math.min(1, track.volume)); audio.muted = muted;
        if (!active || !playing) audio.pause();
        var target = Math.max(0, Math.min(track.duration, local));
        if (audio.readyState > 0 && (force || Math.abs(audio.currentTime - target) > .2)) audio.currentTime = target;
        if (active && playing && audio.paused && !track.pending) {
          track.pending = true;
          var promise = audio.play();
          if (promise) promise.catch(function (error) { if (error && error.name === 'AbortError') return; audioError = '音频无法播放，请检查素材或点击播放重试'; }).finally(function () { track.pending = false; });
          else track.pending = false;
        }
      });
    }
    var fitStyle = document.createElement('style');
    fitStyle.textContent = 'html,body{width:100% !important;height:100% !important;margin:0 !important;overflow:hidden !important}';
    document.head.appendChild(fitStyle);
    // Fit via a wrapper so authored transforms on the stage remain untouched.
    var stage = document.createElement('div');
    root.parentNode.insertBefore(stage, root); stage.appendChild(root);
    function fit() {
      var scale = Math.min(innerWidth / width, Math.max(1, innerHeight - 52) / height);
      stage.style.cssText = 'position:fixed;width:' + width + 'px;height:' + height + 'px;left:' + ((innerWidth-width*scale)/2) + 'px;top:' + ((innerHeight-52-height*scale)/2) + 'px;transform-origin:0 0;transform:scale(' + scale + ')';
    }
    fit(); window.addEventListener('resize', fit);
    var started = Date.now();
    function connect() {
      var tl = window.__timelines && window.__timelines[root.dataset.compositionId];
      if (!tl || typeof tl.seek !== 'function' || typeof tl.play !== 'function' || !(tl.duration() > 0)) {
        if (Date.now()-started < 15000) { setTimeout(connect, 100); return; }
        status.textContent = '动效未就绪，请检查时间轴或依赖文件'; return;
      }
      var timingError = window.__odValidateMotionTimeline(root, tl);
      if (timingError) { tl.pause(); status.textContent = timingError; return; }
      var duration = tl.duration();
      play.disabled = replay.disabled = slider.disabled = false;
      slider.max = String(duration);
      // Render a useful still without overriding authored onUpdate callbacks.
      tl.pause(); tl.seek(Math.min(0.5, duration / 10), false);
      play.onclick = function () { audioError = ''; if (tl.paused() || tl.time() >= duration) { if (tl.time() >= duration) tl.seek(0, false); tl.play(); } else tl.pause(); syncAudio(tl.time(), !tl.paused(), true); };
      replay.onclick = function () { audioError = ''; tl.pause(); tl.seek(0, false); tl.play(); syncAudio(0, true, true); };
      slider.oninput = function () { tl.pause(); tl.seek(Number(slider.value), false); syncAudio(tl.time(), false, true); };
      function update() {
        if (!host.isConnected) return;
        var time = tl.time(); slider.value = String(time); syncAudio(time, !tl.paused() && time < duration, false);
        play.textContent = tl.paused() || time >= duration ? '播放' : '暂停';
        status.textContent = audioError || (time.toFixed(1) + ' / ' + duration.toFixed(1) + ' s');
        setTimeout(update, tl.paused() || time >= duration ? 200 : 33);
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
    if (!script || /data-od-motion-source-player="2"/.test(script[0])) return html;
    return html.slice(0, existing) + PLAYER + html.slice(existing + script[0].length);
  }
  const end = findRealTagOffset(html, HTML_TAG_PATTERNS.bodyClose);
  return end < 0 ? html + PLAYER : html.slice(0, end) + PLAYER + html.slice(end);
}

export function markMotionFrameRender(html: string): string {
  return prependAfterDoctype(html, '<script>window.__odMotionRender=true;</script>');
}
