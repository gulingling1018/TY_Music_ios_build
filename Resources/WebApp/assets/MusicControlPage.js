import { M as ref, c as computed, E as onMounted, H as onUnmounted, a5 as watch, S as resolveDirective, I as openBlock, g as createElementBlock, d as createBaseVNode, w as normalizeClass, x as normalizeStyle, f as createCommentVNode, a9 as withModifiers, l as createVNode, a7 as withDirectives, a4 as vShow, Z as unref, F as Fragment, O as renderList, Y as toDisplayString, a6 as withCtx, T as Transition, k as createTextVNode, v as nextTick } from "./vendor.js";
import { _ as _export_sfc, ac as usePlayerStore, ak as useSkinThemeConfig, z as getSongCoverSrc, ae as useReadyCover, i as buildSkinMediaElementStyle, P as PLAY_MODES, x as getPlayModeLabel, X as registerBackHandler, e as SvgIcon, r as formatTitle, q as formatArtistProducer, t as getBundledAssetUrl, m as createFrameScheduler, n as createLogger, F as isMusicControlVisible, k as closeMusicControl, u as getNextPlayMode } from "./index.js";
import { b as biliAuthService } from "./biliAuth.js";
function parseLrc(text) {
  if (!text) return [];
  const lyrics = [];
  for (const line of text.split("\n")) {
    const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/);
    if (!match) continue;
    const content = match[4].trim();
    if (!content) continue;
    const time = Number(match[1]) * 60 + Number(match[2]) + Number(match[3]) / (match[3].length === 2 ? 100 : 1e3);
    lyrics.push({ time, text: content });
  }
  return lyrics.sort((a, b) => a.time - b.time);
}
function findLyricIndex(lyrics, currentTime) {
  let low = 0;
  let high = lyrics.length - 1;
  let index = -1;
  while (low <= high) {
    const middle = low + high >>> 1;
    if (lyrics[middle].time <= currentTime) {
      index = middle;
      low = middle + 1;
    } else high = middle - 1;
  }
  return index;
}
const _hoisted_1 = { class: "player" };
const _hoisted_2 = ["src"];
const _hoisted_3 = {
  key: 0,
  class: "autoplay-blocker"
};
const _hoisted_4 = ["title"];
const _hoisted_5 = ["title"];
const _hoisted_6 = ["src"];
const _hoisted_7 = { class: "lower-section" };
const _hoisted_8 = {
  key: 0,
  class: "bili-auth-badge"
};
const _hoisted_9 = { class: "track-info" };
const _hoisted_10 = { class: "progress" };
const _hoisted_11 = { class: "progress-info" };
const _hoisted_12 = { class: "current-time" };
const _hoisted_13 = ["src"];
const _hoisted_14 = ["src"];
const _hoisted_15 = { class: "total-time" };
const _hoisted_16 = { class: "controls" };
const _hoisted_17 = ["title"];
const _hoisted_18 = { class: "control-center" };
const _hoisted_19 = ["title", "disabled"];
const _hoisted_20 = {
  key: 0,
  class: "mode-toast"
};
const DEFAULT_GRADIENT = "linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(80, 20, 120, 0.4) 40%, rgba(20, 60, 120, 0.3) 70%, rgba(0, 0, 0, 0.2) 100%)";
const DEFAULT_LYRICS_HIGHLIGHT = "#007aff";
const _sfc_main = /* @__PURE__ */ Object.assign({
  name: "MusicControlPage"
}, {
  __name: "MusicControlPage",
  setup(__props) {
    const logger = createLogger("[MusicControlPage]");
    const playerStore = usePlayerStore();
    const { useSkinTarget } = useSkinThemeConfig();
    const playlistDetailCoverSkin = useSkinTarget("playlist_detail_cover");
    const progressLightStreakSrc = getBundledAssetUrl("svg/progress-light-streak.svg");
    const progressThumbHeadSrc = getBundledAssetUrl("svg/progress-thumb-head.svg");
    const emptyCoverSrc = getBundledAssetUrl("svg/music_badge.svg");
    const progressBar = ref(null);
    const biliIframe = ref(null);
    const isDragging = ref(false);
    const localProgress = ref(0);
    const gradientColors = ref("linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(80, 20, 120, 0.4) 40%, rgba(20, 60, 120, 0.3) 70%, rgba(0, 0, 0, 0.2) 100%)");
    const lyricsHighlightColor = ref("#66ccff");
    const modeToastMessage = ref("");
    const showModeToast = ref(false);
    const isVideoActive = ref(false);
    const isFullScreen = ref(false);
    const controlsVisible = ref(true);
    const hideControlsTimer = ref(null);
    const autoplayBlocker = ref(false);
    const biliSessdata = ref(null);
    const lyricsContainer = ref(null);
    const parsedLyrics = ref([]);
    const currentLyricIndex = ref(-1);
    const biliAuthorized = ref(false);
    const showAuthBadge = ref(false);
    let authBadgeTimer = null;
    const lyricsWrapper = ref(null);
    const wrapperTransform = ref("translateY(0px)");
    const isUserScrolling = ref(false);
    const scrollTimer = ref(null);
    const manualOffsetY = ref(0);
    const notifyAndroidVideoPlaybackActive = (active) => {
      try {
        window.Android?.setVideoPlaybackActive?.(!!active);
      } catch (_) {
      }
    };
    let touchStartY = 0;
    function clampOffset(offset) {
      const totalHeight = parsedLyrics.value.length * 34;
      const containerHeight = lyricsContainer.value?.clientHeight || 141;
      const maxOffset = containerHeight / 2 - 34 / 2;
      const minOffset = containerHeight - totalHeight - containerHeight / 2 + 34 / 2;
      return Math.min(maxOffset, Math.max(minOffset, offset));
    }
    const currentTrack = computed(() => playerStore.currentTrack);
    const controlCoverSrc = computed(() => {
      const track = currentTrack.value;
      if (!track) return emptyCoverSrc;
      return getSongCoverSrc(track) || `/api/cover/random?seed=${track?.id || "control"}`;
    });
    const readyControlCoverSrc = useReadyCover(controlCoverSrc, emptyCoverSrc);
    const handleControlCoverError = () => {
      readyControlCoverSrc.value = emptyCoverSrc;
    };
    const isPlaying = computed(() => playerStore.isPlaying);
    const progress = computed(() => localProgress.value);
    const currentTime = computed(() => playerStore.currentTime);
    const duration = computed(() => playerStore.duration);
    const buffered = computed(() => playerStore.buffered || 0);
    const playerCoverFrameStyle = computed(() => ({
      borderRadius: playlistDetailCoverSkin.value?.enabled ? `${Math.round(Number(playlistDetailCoverSkin.value?.radius || 18))}px` : void 0,
      boxShadow: playlistDetailCoverSkin.value?.enabled && Number(playlistDetailCoverSkin.value?.shadow || 0) > 0 ? `0 20px ${Math.round(Number(playlistDetailCoverSkin.value.shadow || 0) * 1.2)}px rgba(0, 0, 0, 0.18)` : void 0
    }));
    const playerCoverImageStyle = computed(() => buildSkinMediaElementStyle(playlistDetailCoverSkin.value, {
      defaultFit: "contain",
      enabledOnly: true
    }));
    const PLAY_MODE_SVG_NAMES = {
      [PLAY_MODES.LOOP_LIST]: "loopList",
      [PLAY_MODES.LOOP_SINGLE]: "loopSingle",
      [PLAY_MODES.SHUFFLE]: "shuffle"
    };
    const currentPlayMode = computed(() => playerStore.playMode || PLAY_MODES.LOOP_LIST);
    const playModeSvgName = computed(
      () => PLAY_MODE_SVG_NAMES[currentPlayMode.value] || PLAY_MODE_SVG_NAMES[PLAY_MODES.LOOP_LIST]
    );
    const playModeLabel = computed(() => getPlayModeLabel(currentPlayMode.value));
    function handleWheel(e) {
      e.preventDefault();
      isUserScrolling.value = true;
      manualOffsetY.value -= e.deltaY * 0.5;
      manualOffsetY.value = clampOffset(manualOffsetY.value);
      manualLyricsFrame.schedule();
      resetScrollTimer();
    }
    function handleTouchStart(e) {
      isUserScrolling.value = true;
      touchStartY = e.touches[0].clientY;
      if (lyricsWrapper.value) {
        lyricsWrapper.value.style.transition = "none";
      }
    }
    function handleTouchMove(e) {
      e.preventDefault();
      const delta = e.touches[0].clientY - touchStartY;
      touchStartY = e.touches[0].clientY;
      manualOffsetY.value += delta;
      manualOffsetY.value = clampOffset(manualOffsetY.value);
      manualLyricsFrame.schedule();
    }
    function handleTouchEnd() {
      manualLyricsFrame.flush();
      resetScrollTimer();
      if (lyricsWrapper.value) {
        lyricsWrapper.value.style.transition = "";
      }
    }
    function updateManualTransform() {
      wrapperTransform.value = `translateY(${manualOffsetY.value}px)`;
    }
    const manualLyricsFrame = createFrameScheduler(updateManualTransform);
    function resetScrollTimer() {
      if (scrollTimer.value) clearTimeout(scrollTimer.value);
      scrollTimer.value = setTimeout(() => {
        isUserScrolling.value = false;
        updateWrapperPosition();
      }, 2e3);
    }
    const extractBvid = (url) => {
      if (!url) return "";
      const match = url.match(/\/video\/(BV[0-9a-zA-Z]+)/);
      return match ? match[1] : "";
    };
    const biliEmbedUrl = computed(() => {
      const bvid = currentTrack.value?.bvid || extractBvid(currentTrack.value?.url);
      if (!bvid) return "";
      const params = new URLSearchParams({
        bvid,
        page: "1",
        as_wide: "1",
        high_quality: "1",
        autoplay: "1",
        danmaku: "0"
      });
      if (biliAuthorized.value && biliSessdata.value) {
        params.set("qn", "112");
        params.set("quality", "112");
        params.set("fnval", "4048");
        params.set("fourk", "1");
      } else {
        params.set("qn", "80");
        params.set("quality", "80");
      }
      return `https://player.bilibili.com/player.html?${params.toString()}`;
    });
    const bgImageUrl = computed(() => {
      const coverUrl = readyControlCoverSrc.value;
      return `url('${coverUrl}')`;
    });
    function clampColorChannel(value) {
      return Math.max(0, Math.min(255, Math.round(Number(value) || 0)));
    }
    function normalizeColor(color) {
      return {
        r: clampColorChannel(color?.r),
        g: clampColorChannel(color?.g),
        b: clampColorChannel(color?.b)
      };
    }
    function colorToRgba(color, alpha = 0.6) {
      const normalized = normalizeColor(color);
      return `rgba(${normalized.r}, ${normalized.g}, ${normalized.b}, ${alpha})`;
    }
    function mixColor(color, target, targetRatio) {
      const source = normalizeColor(color);
      const normalizedTarget = normalizeColor(target);
      const ratio = Math.max(0, Math.min(1, Number(targetRatio) || 0));
      return normalizeColor({
        r: source.r * (1 - ratio) + normalizedTarget.r * ratio,
        g: source.g * (1 - ratio) + normalizedTarget.g * ratio,
        b: source.b * (1 - ratio) + normalizedTarget.b * ratio
      });
    }
    function darkenColor(color, ratio) {
      const source = normalizeColor(color);
      const factor = Math.max(0, Math.min(1, Number(ratio) || 0.45));
      return normalizeColor({
        r: source.r * factor,
        g: source.g * factor,
        b: source.b * factor
      });
    }
    function sampleImagePalette(imageUrl) {
      return new Promise((resolve, reject) => {
        if (!imageUrl || typeof window === "undefined" || typeof document === "undefined") {
          reject(new Error("Image palette sampling unavailable"));
          return;
        }
        const image = new window.Image();
        image.crossOrigin = "anonymous";
        image.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            const size = 32;
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext("2d", { willReadFrequently: true });
            if (!ctx) throw new Error("Canvas context unavailable");
            ctx.drawImage(image, 0, 0, size, size);
            const { data } = ctx.getImageData(0, 0, size, size);
            const buckets = /* @__PURE__ */ new Map();
            let total = 0;
            let totalR = 0;
            let totalG = 0;
            let totalB = 0;
            for (let index = 0; index < data.length; index += 16) {
              const alpha = data[index + 3];
              if (alpha < 32) continue;
              const r = data[index];
              const g = data[index + 1];
              const b = data[index + 2];
              total += 1;
              totalR += r;
              totalG += g;
              totalB += b;
              const bucketKey = `${r >> 5}-${g >> 5}-${b >> 5}`;
              const bucket = buckets.get(bucketKey) || { count: 0, r: 0, g: 0, b: 0 };
              bucket.count += 1;
              bucket.r += r;
              bucket.g += g;
              bucket.b += b;
              buckets.set(bucketKey, bucket);
            }
            if (!total) throw new Error("No visible pixels");
            const average = normalizeColor({
              r: totalR / total,
              g: totalG / total,
              b: totalB / total
            });
            let dominantBucket = null;
            for (const bucket of buckets.values()) {
              if (!dominantBucket || bucket.count > dominantBucket.count) {
                dominantBucket = bucket;
              }
            }
            const dominant = dominantBucket ? normalizeColor({
              r: dominantBucket.r / dominantBucket.count,
              g: dominantBucket.g / dominantBucket.count,
              b: dominantBucket.b / dominantBucket.count
            }) : average;
            const vibrant = mixColor(dominant, average, 0.25);
            const muted = mixColor(average, { r: 96, g: 110, b: 128 }, 0.35);
            resolve({
              vibrant,
              muted,
              darkVibrant: darkenColor(vibrant, 0.42),
              darkMuted: darkenColor(muted, 0.38)
            });
          } catch (error) {
            reject(error);
          }
        };
        image.onerror = () => reject(new Error("Image load failed"));
        image.src = imageUrl;
      });
    }
    let colorExtractionSeq = 0;
    const extractColorsAndGenerateGradient = async (imageUrl) => {
      const requestSeq = ++colorExtractionSeq;
      try {
        const palette = await sampleImagePalette(imageUrl);
        if (requestSeq !== colorExtractionSeq) return;
        gradientColors.value = `linear-gradient(135deg, 
      ${colorToRgba(palette.darkMuted)} 0%,
      ${colorToRgba(palette.vibrant)} 30%,
      ${colorToRgba(palette.muted)} 60%,
      ${colorToRgba(palette.darkVibrant)} 100%)`;
        const highlightRgb = normalizeColor(palette.vibrant || palette.muted);
        lyricsHighlightColor.value = `rgb(${highlightRgb.r}, ${highlightRgb.g}, ${highlightRgb.b})`;
        document.documentElement.style.setProperty("--lyrics-highlight-color", lyricsHighlightColor.value);
      } catch (e) {
        if (requestSeq !== colorExtractionSeq) return;
        gradientColors.value = DEFAULT_GRADIENT;
        lyricsHighlightColor.value = DEFAULT_LYRICS_HIGHLIGHT;
        document.documentElement.style.setProperty("--lyrics-highlight-color", DEFAULT_LYRICS_HIGHLIGHT);
      }
    };
    const loadBiliAuthStatus = async () => {
      try {
        const status = await biliAuthService.checkStatus();
        const verified = Boolean(status?.authorized && status?.credential_available !== false && status?.sessdata);
        biliAuthorized.value = verified;
        biliSessdata.value = verified ? status.sessdata : null;
        if (verified) {
          logger.log("✅ Bilibili 已授权，将使用更高画质");
          try {
            const sessResp = await biliAuthService.getSessdata();
            if (sessResp.authorized && sessResp.sessdata) {
              biliSessdata.value = sessResp.sessdata;
              logger.log("✅ 已获取 Bilibili SESSDATA");
            } else {
              console.warn("⚠️ Bilibili 已授权但未获取到 SESSDATA");
              biliSessdata.value = null;
            }
          } catch (e) {
            console.warn("获取 SESSDATA 失败:", e);
          }
        } else {
          logger.log("ℹ️ Bilibili 未授权，使用默认画质");
          biliSessdata.value = null;
        }
      } catch (error) {
        console.error("获取 Bilibili 授权状态失败:", error);
        biliAuthorized.value = false;
        biliSessdata.value = null;
      }
    };
    const showAuthBadgeTemporarily = () => {
      if (!biliAuthorized.value) return;
      showAuthBadge.value = true;
      if (authBadgeTimer) {
        clearTimeout(authBadgeTimer);
      }
      authBadgeTimer = setTimeout(() => {
        showAuthBadge.value = false;
      }, 2e3);
    };
    let unregisterBackHandler = null;
    onMounted(() => {
      loadBiliAuthStatus();
      unregisterBackHandler = registerBackHandler(() => {
        if (playerStore.showDrawer) {
          playerStore.showDrawer = false;
          return true;
        }
        if (isVideoActive.value) {
          handleBackFromVideo();
          return true;
        }
        if (isMusicControlVisible()) {
          closeMusicControl();
          return true;
        }
        return false;
      }, { priority: 100 });
    });
    onUnmounted(() => {
      ++colorExtractionSeq;
      ++lyricsRequestSeq;
      lyricsAbortController?.abort();
      manualLyricsFrame.cancel();
      clearTimeout(authBadgeTimer);
      stopHideControlsTimer();
      if (isVideoActive.value) {
        exitVideoMode();
      }
      if (scrollTimer.value) {
        clearTimeout(scrollTimer.value);
      }
      if (unregisterBackHandler) {
        unregisterBackHandler();
        logger.log("[MusicControlPage] 已注销返回键处理器");
      }
    });
    watch(readyControlCoverSrc, extractColorsAndGenerateGradient, { immediate: true });
    let lyricsRequestSeq = 0;
    let lyricsAbortController = null;
    watch(
      () => [currentTrack.value?.hash_id ?? currentTrack.value?.id, currentTrack.value?.lrc_user_path],
      () => loadLyrics(currentTrack.value),
      { immediate: true }
    );
    watch(isVideoActive, (newVal) => {
      if (newVal) {
        showAuthBadgeTemporarily();
      }
    });
    watch(() => playerStore.progress, (newVal) => {
      if (!isDragging.value) {
        localProgress.value = newVal;
      }
    }, { immediate: true });
    watch(() => playerStore.currentTime, (newTime) => {
      updateLyricIndex(newTime);
    }, { immediate: true });
    const handleButtonClick = (e, callback) => {
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
      callback();
    };
    const handleVideoModeControl = (action) => {
      if (isVideoActive.value) {
        if (action === "prev") {
          playerStore.silentPrev();
        } else if (action === "next") {
          playerStore.silentNext();
        } else if (action === "togglePlay") {
          return;
        }
      } else {
        if (action === "prev") {
          playerStore.prev({
            triggerSource: "manual_user",
            switchReason: "music_control_prev"
          });
        } else if (action === "next") {
          playerStore.next({
            triggerSource: "manual_user",
            switchReason: "music_control_next"
          });
        } else if (action === "togglePlay") {
          playerStore.togglePlay();
        }
      }
    };
    const formatTime = (seconds) => {
      if (!seconds || isNaN(seconds)) return "0:00";
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    };
    const handleSeek = (e) => {
      if (isVideoActive.value) return;
      if (isDragging.value && e.type === "click") return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = Math.max(0, Math.min(1, x / rect.width));
      playerStore.seek(percent, {
        triggerSource: "manual_user",
        source: "music_control_seek_click"
      });
    };
    const startDragging = () => {
      if (isVideoActive.value) return;
      isDragging.value = true;
      localProgress.value = playerStore.progress;
      const handleMove = (e) => {
        if (!isDragging.value) return;
        const rect = progressBar.value.getBoundingClientRect();
        let x;
        if (e.touches) {
          x = e.touches[0].clientX - rect.left;
        } else {
          x = e.clientX - rect.left;
        }
        const percent = Math.max(0, Math.min(1, x / rect.width));
        localProgress.value = percent * 100;
      };
      const handleEnd = () => {
        isDragging.value = false;
        playerStore.seek(localProgress.value / 100, {
          triggerSource: "manual_user",
          source: "music_control_seek_drag"
        });
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleEnd);
        document.removeEventListener("touchmove", handleMove);
        document.removeEventListener("touchend", handleEnd);
      };
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchmove", handleMove, { passive: false });
      document.addEventListener("touchend", handleEnd);
    };
    const togglePlaylist = () => {
      playerStore.showDrawer = !playerStore.showDrawer;
    };
    const toggleRepeat = async () => {
      const nextMode = getNextPlayMode(currentPlayMode.value);
      await playerStore.switchPlayMode(nextMode, {
        triggerSource: "manual_user",
        source: "music_control_mode_toggle"
      });
      modeToastMessage.value = getPlayModeLabel(nextMode);
      showModeToast.value = true;
      setTimeout(() => {
        showModeToast.value = false;
      }, 2e3);
    };
    const toggleVideoMode = () => {
      if (currentTrack.value?.url && (currentTrack.value?.bvid || extractBvid(currentTrack.value?.url))) {
        if (!biliAuthorized.value) {
          loadBiliAuthStatus();
        }
        playerStore.currentTime;
        isVideoActive.value = true;
        notifyAndroidVideoPlaybackActive(true);
        playerStore.setVideoMode(true);
        controlsVisible.value = true;
        autoplayBlocker.value = true;
        startHideControlsTimer();
        setTimeout(() => {
          autoplayBlocker.value = false;
          if (biliIframe.value) {
            try {
              const clickEvent = new MouseEvent("click", {
                view: window,
                bubbles: true,
                cancelable: true
              });
              biliIframe.value.dispatchEvent(clickEvent);
              logger.log("✅ 已触发 iframe 点击事件以激活自动播放");
            } catch (e) {
              logger.log("⚠️ 触发点击事件失败:", e.message);
            }
          }
        }, 600);
      }
    };
    const handleBackFromVideo = () => {
      if (isFullScreen.value) {
        toggleFullScreen();
        return;
      }
      exitVideoModeImpl();
    };
    const exitVideoMode = () => {
      exitVideoModeImpl();
    };
    const exitVideoModeImpl = () => {
      isVideoActive.value = false;
      playerStore.setVideoMode(false);
      notifyAndroidVideoPlaybackActive(false);
      isFullScreen.value = false;
      try {
        window.Android?.setVideoFullscreen?.(false);
      } catch (_) {
      }
      autoplayBlocker.value = false;
      stopHideControlsTimer();
    };
    const toggleFullScreen = async () => {
      if (!isFullScreen.value) {
        isFullScreen.value = true;
        if (window.Android) {
          try {
            window.Android.vibrate?.(30);
          } catch (_) {
          }
          try {
            window.Android.setVideoFullscreen?.(true);
          } catch (_) {
          }
        }
      } else {
        isFullScreen.value = false;
        try {
          window.Android?.setVideoFullscreen?.(false);
        } catch (_) {
        }
      }
    };
    const showControls = () => {
      if (!controlsVisible.value) {
        controlsVisible.value = true;
      }
      startHideControlsTimer();
    };
    const hideControls = () => {
      controlsVisible.value = false;
    };
    const startHideControlsTimer = () => {
      stopHideControlsTimer();
      hideControlsTimer.value = setTimeout(() => {
        hideControls();
      }, 3e3);
    };
    const stopHideControlsTimer = () => {
      if (hideControlsTimer.value) {
        clearTimeout(hideControlsTimer.value);
        hideControlsTimer.value = null;
      }
    };
    function updateLyricIndex(currentTime2) {
      if (parsedLyrics.value.length === 0) return;
      const index = findLyricIndex(parsedLyrics.value, currentTime2);
      if (index !== currentLyricIndex.value) {
        logger.log(`🎵 [MusicControlPage] Lyric index changed: ${currentLyricIndex.value} -> ${index}, time: ${currentTime2}s, lyric: "${parsedLyrics.value[index]?.text || "none"}"`);
        currentLyricIndex.value = index;
        nextTick(() => {
          updateWrapperPosition();
        });
      }
    }
    function updateWrapperPosition() {
      if (!lyricsContainer.value || currentLyricIndex.value < 0 || isUserScrolling.value) return;
      const containerHeight = lyricsContainer.value.clientHeight;
      const lineHeight = 34;
      const centerY = containerHeight / 2 - lineHeight / 2;
      const offsetY = centerY - currentLyricIndex.value * lineHeight;
      manualOffsetY.value = offsetY;
      wrapperTransform.value = `translateY(${offsetY}px)`;
    }
    async function loadLyrics(track) {
      const token = ++lyricsRequestSeq;
      lyricsAbortController?.abort();
      lyricsAbortController = null;
      manualLyricsFrame.cancel();
      clearTimeout(scrollTimer.value);
      parsedLyrics.value = [];
      currentLyricIndex.value = -1;
      isUserScrolling.value = false;
      manualOffsetY.value = 0;
      wrapperTransform.value = "translateY(0px)";
      const url = track?.lrc_user_path;
      if (!url) return;
      await nextTick();
      if (token !== lyricsRequestSeq) return;
      try {
        let text = "";
        if (window.Android?.readLyricsFile) {
          text = window.Android.readLyricsFile(url);
        } else {
          const controller = new AbortController();
          lyricsAbortController = controller;
          const response = await fetch(url, { signal: controller.signal });
          if (!response.ok) return;
          text = await response.text();
        }
        if (token !== lyricsRequestSeq) return;
        parsedLyrics.value = parseLrc(text);
        updateLyricIndex(playerStore.currentTime);
      } catch (error) {
        if (token === lyricsRequestSeq && error.name !== "AbortError") logger.warn("Lyrics load failed:", error);
      }
    }
    return (_ctx, _cache) => {
      const _directive_marquee = resolveDirective("marquee");
      return openBlock(), createElementBlock("div", {
        class: "player-container",
        style: normalizeStyle({ "--bg-image": bgImageUrl.value, "--gradient-overlay": gradientColors.value })
      }, [
        createBaseVNode("div", _hoisted_1, [
          createBaseVNode("div", {
            class: normalizeClass(["upper-section", { "video-active": isVideoActive.value }])
          }, [
            createBaseVNode("div", {
              class: normalizeClass(["album", { "video-active": isVideoActive.value }]),
              style: normalizeStyle(playerCoverFrameStyle.value),
              onClick: _cache[2] || (_cache[2] = ($event) => !isVideoActive.value && toggleVideoMode())
            }, [
              isVideoActive.value ? (openBlock(), createElementBlock("div", {
                key: 0,
                class: normalizeClass(["video-container", { "is-fullscreen": isFullScreen.value }]),
                onMousemove: showControls,
                onClick: showControls,
                onTouchstart: showControls,
                onMouseenter: showControls,
                onMouseleave: startHideControlsTimer
              }, [
                createBaseVNode("iframe", {
                  ref_key: "biliIframe",
                  ref: biliIframe,
                  src: biliEmbedUrl.value,
                  allow: "autoplay; encrypted-media; fullscreen",
                  frameborder: "0",
                  class: "bili-iframe"
                }, null, 8, _hoisted_2),
                autoplayBlocker.value ? (openBlock(), createElementBlock("div", _hoisted_3, [..._cache[8] || (_cache[8] = [
                  createBaseVNode("div", { class: "loading-spinner" }, null, -1),
                  createBaseVNode("div", { class: "loading-text" }, "正在加载视频...", -1)
                ])])) : createCommentVNode("", true),
                isVideoActive.value ? (openBlock(), createElementBlock("div", {
                  key: 1,
                  class: normalizeClass(["video-overlay", { "is-blocking": !controlsVisible.value }]),
                  onMousemove: showControls,
                  onClick: showControls,
                  onTouchstart: showControls
                }, null, 34)) : createCommentVNode("", true),
                createBaseVNode("div", {
                  class: "video-controls",
                  style: normalizeStyle({ opacity: controlsVisible.value ? 1 : 0 })
                }, [
                  createBaseVNode("button", {
                    onClick: _cache[0] || (_cache[0] = withModifiers(($event) => handleVideoModeControl("prev"), ["stop"])),
                    class: "ctrl-btn",
                    title: "上一首"
                  }, [
                    createVNode(SvgIcon, {
                      class: "btn-icon btn-icon--video",
                      name: "prev",
                      size: "14"
                    })
                  ]),
                  createBaseVNode("button", {
                    onClick: _cache[1] || (_cache[1] = withModifiers(($event) => handleVideoModeControl("next"), ["stop"])),
                    class: "ctrl-btn",
                    title: "下一首"
                  }, [
                    createVNode(SvgIcon, {
                      class: "btn-icon btn-icon--video",
                      name: "next",
                      size: "14"
                    })
                  ]),
                  createBaseVNode("button", {
                    onClick: withModifiers(toggleFullScreen, ["stop"]),
                    class: "ctrl-btn",
                    title: isFullScreen.value ? "退出全屏" : "全屏"
                  }, [
                    createVNode(SvgIcon, {
                      class: "btn-icon btn-icon--video",
                      name: isFullScreen.value ? "shrink" : "enlarge",
                      size: "14"
                    }, null, 8, ["name"])
                  ], 8, _hoisted_4),
                  createBaseVNode("button", {
                    onClick: withModifiers(handleBackFromVideo, ["stop"]),
                    class: "ctrl-btn",
                    title: isFullScreen.value ? "退出全屏" : "返回"
                  }, [
                    createVNode(SvgIcon, {
                      class: "btn-icon btn-icon--video",
                      name: "back",
                      size: "14"
                    })
                  ], 8, _hoisted_5)
                ], 4)
              ], 34)) : createCommentVNode("", true),
              withDirectives(createBaseVNode("img", {
                src: unref(readyControlCoverSrc),
                alt: "Album Art",
                referrerpolicy: "no-referrer",
                onError: handleControlCoverError,
                class: normalizeClass(["album-img", { "video-playing": isVideoActive.value }]),
                style: normalizeStyle(playerCoverImageStyle.value)
              }, null, 46, _hoisted_6), [
                [vShow, !isVideoActive.value]
              ])
            ], 6)
          ], 2),
          createBaseVNode("div", {
            class: "lyrics-section",
            ref_key: "lyricsContainer",
            ref: lyricsContainer,
            onWheel: handleWheel,
            onTouchstart: handleTouchStart,
            onTouchmove: handleTouchMove,
            onTouchend: handleTouchEnd,
            onTouchcancel: handleTouchEnd
          }, [
            parsedLyrics.value.length > 0 ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: "lyrics-wrapper",
              style: normalizeStyle({ transform: wrapperTransform.value }),
              ref_key: "lyricsWrapper",
              ref: lyricsWrapper
            }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(parsedLyrics.value, (line, index) => {
                return openBlock(), createElementBlock("div", {
                  key: index,
                  class: normalizeClass(["lyrics-line", { active: index === currentLyricIndex.value }])
                }, toDisplayString(line.text), 3);
              }), 128))
            ], 4)) : createCommentVNode("", true)
          ], 544),
          createBaseVNode("div", _hoisted_7, [
            createVNode(Transition, { name: "slide-down" }, {
              default: withCtx(() => [
                showAuthBadge.value ? (openBlock(), createElementBlock("div", _hoisted_8, [..._cache[9] || (_cache[9] = [
                  createBaseVNode("span", { class: "badge-icon" }, "✓", -1),
                  createBaseVNode("span", null, "已授权 - 高画质模式", -1)
                ])])) : createCommentVNode("", true)
              ]),
              _: 1
            }),
            createBaseVNode("div", _hoisted_9, [
              withDirectives((openBlock(), createElementBlock("div", {
                class: normalizeClass(["title", { "video-static": isVideoActive.value }]),
                key: "title-" + (currentTrack.value?.id || currentTrack.value?.hashId || "empty") + "-" + (isVideoActive.value ? "video" : "audio")
              }, [
                createTextVNode(toDisplayString(currentTrack.value ? unref(formatTitle)(currentTrack.value) : "未在播放"), 1)
              ], 2)), [
                [_directive_marquee, !isVideoActive.value ? {} : false]
              ]),
              withDirectives((openBlock(), createElementBlock("div", {
                class: normalizeClass(["artist", { "video-static": isVideoActive.value }]),
                key: "artist-" + (currentTrack.value?.id || currentTrack.value?.hashId || "empty") + "-" + (isVideoActive.value ? "video" : "audio")
              }, [
                createTextVNode(toDisplayString(currentTrack.value ? unref(formatArtistProducer)(currentTrack.value) : "等待选择歌曲"), 1)
              ], 2)), [
                [_directive_marquee, !isVideoActive.value ? {} : false]
              ])
            ]),
            createBaseVNode("div", _hoisted_10, [
              createBaseVNode("div", _hoisted_11, [
                createBaseVNode("span", _hoisted_12, toDisplayString(formatTime(currentTime.value)), 1),
                createBaseVNode("div", {
                  class: normalizeClass(["bar", { "disabled": isVideoActive.value, "is-dragging": isDragging.value }]),
                  onClick: handleSeek,
                  onMousedown: startDragging,
                  onTouchstart: startDragging,
                  ref_key: "progressBar",
                  ref: progressBar
                }, [
                  createBaseVNode("div", {
                    class: "bar-buffered",
                    style: normalizeStyle({ width: buffered.value + "%" })
                  }, null, 4),
                  createBaseVNode("div", {
                    class: "bar-fill",
                    style: normalizeStyle({ width: progress.value + "%" })
                  }, [..._cache[10] || (_cache[10] = [
                    createBaseVNode("div", { class: "progress-flow" }, null, -1)
                  ])], 4),
                  createBaseVNode("div", {
                    class: "progress-streak",
                    style: normalizeStyle({ left: progress.value + "%" })
                  }, [
                    createBaseVNode("img", {
                      src: unref(progressLightStreakSrc),
                      alt: "",
                      "aria-hidden": "true"
                    }, null, 8, _hoisted_13)
                  ], 4),
                  createBaseVNode("div", {
                    class: "progress-thumb",
                    style: normalizeStyle({ left: progress.value + "%" })
                  }, [
                    createBaseVNode("img", {
                      src: unref(progressThumbHeadSrc),
                      alt: "progress thumb"
                    }, null, 8, _hoisted_14)
                  ], 4)
                ], 34),
                createBaseVNode("span", _hoisted_15, toDisplayString(formatTime(duration.value)), 1)
              ])
            ]),
            createBaseVNode("div", _hoisted_16, [
              createBaseVNode("button", {
                class: "tool-btn mode-btn",
                onClick: _cache[3] || (_cache[3] = ($event) => handleButtonClick($event, toggleRepeat)),
                title: playModeLabel.value
              }, [
                createVNode(SvgIcon, {
                  class: "btn-icon btn-icon--tool",
                  name: playModeSvgName.value,
                  size: "18"
                }, null, 8, ["name"])
              ], 8, _hoisted_17),
              createBaseVNode("div", _hoisted_18, [
                createBaseVNode("button", {
                  class: "btn",
                  onClick: _cache[4] || (_cache[4] = ($event) => handleButtonClick($event, () => handleVideoModeControl("prev"))),
                  title: "上一首"
                }, [
                  createVNode(SvgIcon, {
                    class: "btn-icon btn-icon--transport",
                    name: "prev",
                    size: "20"
                  })
                ]),
                createBaseVNode("button", {
                  class: "btn play",
                  onClick: _cache[5] || (_cache[5] = ($event) => handleButtonClick($event, () => handleVideoModeControl("togglePlay"))),
                  title: isPlaying.value ? "暂停" : "播放",
                  disabled: isVideoActive.value
                }, [
                  createVNode(SvgIcon, {
                    class: "btn-icon btn-icon--play",
                    name: isPlaying.value ? "pause" : "play",
                    size: "26"
                  }, null, 8, ["name"])
                ], 8, _hoisted_19),
                createBaseVNode("button", {
                  class: "btn",
                  onClick: _cache[6] || (_cache[6] = ($event) => handleButtonClick($event, () => handleVideoModeControl("next"))),
                  title: "下一首"
                }, [
                  createVNode(SvgIcon, {
                    class: "btn-icon btn-icon--transport",
                    name: "next",
                    size: "20"
                  })
                ])
              ]),
              createBaseVNode("button", {
                class: "tool-btn",
                onClick: _cache[7] || (_cache[7] = ($event) => handleButtonClick($event, togglePlaylist)),
                title: "播放列表"
              }, [
                createVNode(SvgIcon, {
                  class: "btn-icon btn-icon--tool",
                  name: "playlist",
                  size: "18"
                })
              ])
            ]),
            createVNode(Transition, { name: "fade-toast" }, {
              default: withCtx(() => [
                showModeToast.value ? (openBlock(), createElementBlock("div", _hoisted_20, toDisplayString(modeToastMessage.value), 1)) : createCommentVNode("", true)
              ]),
              _: 1
            })
          ])
        ])
      ], 4);
    };
  }
});
const MusicControlPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ebd554e8"]]);
export {
  MusicControlPage as default
};
