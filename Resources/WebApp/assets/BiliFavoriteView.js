import { $ as useRouter, _ as useRoute, c as computed, M as ref, E as onMounted, H as onUnmounted, S as resolveDirective, I as openBlock, g as createElementBlock, l as createVNode, j as createStaticVNode, d as createBaseVNode, Y as toDisplayString, f as createCommentVNode, k as createTextVNode, e as createBlock, a6 as withCtx, Z as unref, w as normalizeClass, x as normalizeStyle, a7 as withDirectives, a9 as withModifiers, T as Transition, F as Fragment, O as renderList, a8 as withKeys, a3 as vModelText } from "./vendor.js";
import { S as ScrollSurface } from "./ScrollSurface.js";
import { _ as _export_sfc, aj as useSelectionStore, ac as usePlayerStore, ad as usePlaylistStore, a8 as useDownloadTaskStore, a7 as useCacheStore, ak as useSkinThemeConfig, ab as usePageLifecycle, ah as useSelection, ai as useSelectionModeMicroservice, M as onBiliDownload, a5 as subscribeThumbnailQueue, T as Toast, V as VirtualList, b as DeferredThumbnail, f as apiRequest } from "./index.js";
const _hoisted_1 = {
  key: 0,
  class: "loading-container"
};
const _hoisted_2 = { class: "loading-subtitle" };
const _hoisted_3 = {
  key: 1,
  class: "error-container"
};
const _hoisted_4 = { class: "error-content" };
const _hoisted_5 = {
  key: 0,
  class: "error-details"
};
const _hoisted_6 = {
  key: 2,
  class: "search-results"
};
const _hoisted_7 = { class: "results-header" };
const _hoisted_8 = { key: 0 };
const _hoisted_9 = { key: 1 };
const _hoisted_10 = { key: 2 };
const _hoisted_11 = ["onClick", "onTouchstartPassive"];
const _hoisted_12 = { class: "center-content" };
const _hoisted_13 = { class: "right-box" };
const _hoisted_14 = { class: "up-title-box" };
const _hoisted_15 = { class: "title-text-wrapper" };
const _hoisted_16 = { class: "down-singer-box" };
const _hoisted_17 = { class: "info-text-wrapper" };
const _hoisted_18 = { style: { "margin-left": "12px" } };
const _hoisted_19 = { style: { "margin-left": "12px" } };
const _hoisted_20 = {
  key: 0,
  class: "download-btn-wrapper"
};
const _hoisted_21 = ["onClick", "disabled", "title"];
const _hoisted_22 = {
  key: 0,
  class: "download-icon downloading"
};
const _hoisted_23 = {
  key: 1,
  class: "download-icon success"
};
const _hoisted_24 = {
  key: 2,
  class: "download-icon failed"
};
const _hoisted_25 = {
  key: 3,
  class: "download-icon"
};
const _hoisted_26 = {
  key: 3,
  class: "search-tips"
};
const _hoisted_27 = {
  key: 0,
  class: "fab-container"
};
const _hoisted_28 = {
  key: 0,
  class: "fab-menu"
};
const _hoisted_29 = {
  key: 0,
  class: "count-badge"
};
const _hoisted_30 = {
  key: 0,
  class: "playlist-input-overlay"
};
const _hoisted_31 = { class: "playlist-input-dialog" };
const _hoisted_32 = { class: "playlist-input-body" };
const _hoisted_33 = {
  key: 0,
  class: "playlist-list"
};
const _hoisted_34 = ["onClick"];
const _hoisted_35 = ["src", "alt"];
const _hoisted_36 = { class: "playlist-info" };
const _hoisted_37 = { class: "playlist-name" };
const _hoisted_38 = { class: "playlist-count" };
const _hoisted_39 = { class: "create-new-section" };
const _hoisted_40 = { class: "dialog-buttons" };
const _hoisted_41 = ["disabled"];
const _sfc_main = /* @__PURE__ */ Object.assign({
  name: "bili-favorite"
}, {
  __name: "BiliFavoriteView",
  setup(__props) {
    function logBiliFavorite(...args) {
    }
    useRouter();
    const route = useRoute();
    const selectionStore = useSelectionStore();
    usePlayerStore();
    const playlistStore = usePlaylistStore();
    const downloadTaskStore = useDownloadTaskStore();
    const cacheStore = useCacheStore();
    const { useSkinTarget } = useSkinThemeConfig();
    const biliVideoItemSkin = useSkinTarget("bili_video_item");
    const biliFavoriteItemHeight = computed(() => {
      const skinHeight = biliVideoItemSkin.value?.enabled ? Number(biliVideoItemSkin.value?.itemHeight || 92) : 92;
      return Math.max(92, Number.isFinite(skinHeight) ? skinHeight : 92);
    });
    function emitPlaylistContentUpdated(playlistId, reason = "batch-add") {
      const targetPlaylistId = `${playlistId || ""}`.trim();
      if (!targetPlaylistId || typeof window === "undefined") return;
      cacheStore.clearPlaylistState(targetPlaylistId);
      window.dispatchEvent(new CustomEvent("playlist-song-updated", {
        detail: {
          playlistId: targetPlaylistId,
          refreshPlaylist: true,
          reason
        }
      }));
    }
    const pageLifecycle = usePageLifecycle("bili-favorite");
    const videos = ref([]);
    const isLoading = ref(true);
    const error = ref(null);
    const showToast = ref(false);
    const toastMessage = ref("");
    const isMenuOpen = ref(false);
    const showPlaylistDialog = ref(false);
    const newPlaylistName = ref("");
    const existingPlaylists = ref([]);
    const selectedSongIds = ref([]);
    const thumbnailQueueStats = ref({ active: 0, pending: 0, cached: 0 });
    const isThumbnailBusy = computed(() => {
      return thumbnailQueueStats.value.active + thumbnailQueueStats.value.pending > 0;
    });
    const isUiSafetyMode = computed(() => {
      return videos.value.length >= 80 || thumbnailQueueStats.value.active >= 2 || thumbnailQueueStats.value.pending >= 6;
    });
    const biliVirtualBuffer = computed(() => isUiSafetyMode.value ? 4 : 6);
    const loadingTextIndex = ref(0);
    const loadingTexts = [
      "正在连接 Bilibili 服务器...",
      "正在分析收藏夹结构...",
      "正在提取视频元数据...",
      "内容较多，请耐心等待..."
    ];
    const dynamicLoadingText = computed(() => loadingTexts[loadingTextIndex.value]);
    let loadingInterval = null;
    let unsubscribeBiliDownload = null;
    let unsubscribeThumbnailQueue = null;
    let biliHydrationWorker = null;
    let biliHydrationJobId = 0;
    let parseRequestSeq = 0;
    const downloadStatus = ref(/* @__PURE__ */ new Map());
    const songListContainer = ref(null);
    const { handleTouchStart: originalTouchStart, handleTouchMove, handleTouchEnd: originalTouchEnd } = useSelection();
    const loadExistingPlaylists = async () => {
      try {
        const resp = await apiRequest("/api/playlists");
        if (!resp.ok) throw new Error("加载歌单失败");
        const data = await resp.json();
        const pinned = ["local_music", "bili_downloads", "all_music"];
        existingPlaylists.value = (data.playlists || []).filter((p) => !pinned.includes(p.id));
      } catch (e) {
        console.warn("加载歌单列表失败:", e);
        existingPlaylists.value = [];
      }
    };
    const selectionModeService = useSelectionModeMicroservice({
      selectionStore,
      playlistStore,
      isMenuOpen,
      closeModeImpl: async (autoExit = false) => selectionStore.exitMode(autoExit),
      getAllIds: () => videos.value.map((video) => video.url),
      openAddToPlaylist: async (selectedIds) => {
        selectedSongIds.value = [...selectedIds];
        await loadExistingPlaylists();
        showPlaylistDialog.value = true;
      },
      runBatchDownload: (selectedIds) => enqueueBatchDownload(selectedIds)
    });
    const closeMode = selectionModeService.closeMode;
    const selectAll = selectionModeService.selectAll;
    const handleAction = selectionModeService.handleAction;
    function stableHexHash(input) {
      const value = `${input || ""}`;
      let h1 = 2166136261;
      let h2 = 2166136261 ^ 2654435769;
      let h3 = 2166136261 ^ 2246822507;
      let h4 = 2166136261 ^ 3266489909;
      for (let i = 0; i < value.length; i += 1) {
        const ch = value.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 16777619) >>> 0;
        h2 = Math.imul(h2 ^ ch + i, 16777619) >>> 0;
        h3 = Math.imul(h3 ^ ch + i * 7, 16777619) >>> 0;
        h4 = Math.imul(h4 ^ ch + i * 13, 16777619) >>> 0;
      }
      return [h1, h2, h3, h4].map((n) => n.toString(16).padStart(8, "0")).join("");
    }
    function extractBvid(video) {
      if (!video || typeof video !== "object") return "";
      if (video.bvid) return video.bvid;
      const match = `${video.url || ""}`.match(/(BV[0-9A-Za-z]{10})/);
      return match ? match[1] : "";
    }
    function getFavoriteSongHash(video) {
      const bvid = extractBvid(video);
      if (bvid) return stableHexHash(`bvid:${bvid}`);
      return stableHexHash(`url:${video?.url || ""}`);
    }
    function normalizeMetaText(value) {
      if (value === null || value === void 0) return "";
      const text = `${value}`.trim();
      if (!text) return "";
      const lower = text.toLowerCase();
      if (lower === "null" || lower === "undefined") return "";
      return text;
    }
    function buildFavoriteDownloadMeta(video) {
      const producer = normalizeMetaText(
        video?.producer || video?.uploader || video?.author || video?.artist || ""
      );
      return {
        artist: "",
        producer,
        uploader: producer,
        author: producer
      };
    }
    function toTaskVideo(video) {
      const hashId = getFavoriteSongHash(video);
      const meta = buildFavoriteDownloadMeta(video);
      return {
        ...video,
        ...meta,
        id: hashId,
        hash_id: hashId
      };
    }
    function buildSongHintsByUrls(selectedUrls) {
      if (!Array.isArray(selectedUrls) || selectedUrls.length === 0) return [];
      const byUrl = /* @__PURE__ */ new Map();
      videos.value.forEach((video) => {
        if (video?.url && !byUrl.has(video.url)) byUrl.set(video.url, video);
      });
      return selectedUrls.map((url) => {
        const video = byUrl.get(url);
        if (!video) return null;
        const hashId = getFavoriteSongHash(video);
        const coverHint = processBiliCover(video.cover);
        const bvid = extractBvid(video);
        const meta = buildFavoriteDownloadMeta(video);
        return {
          hash_id: hashId,
          id: hashId,
          title: video.title || "",
          artist: meta.artist,
          author: meta.author,
          producer: meta.producer,
          uploader: meta.uploader,
          bvid,
          url: video.url || "",
          cover_bili_url: coverHint,
          pic: coverHint,
          cover: coverHint || `/api/cover/${hashId}`,
          source_type: "bilibili_favorite"
        };
      }).filter(Boolean);
    }
    const favoriteUrl = computed(() => route.query.url || (route.query.skinSandbox === "1" ? "dev://skin-sandbox-favorite" : ""));
    const processBiliCover = (url) => {
      if (!url) return "";
      return url.replace(/^http:/, "https:");
    };
    function buildCoverPlaceholder(video, index) {
      const seed = video?.bvid || video?.url || video?.title || `bili-${index}`;
      const hue = parseInt(stableHexHash(seed).slice(0, 8), 16) % 360;
      const accent = (hue + 42) % 360;
      return `linear-gradient(135deg, hsl(${hue} 74% 88%) 0%, hsl(${accent} 82% 78%) 100%)`;
    }
    function hydrateFavoriteVideosFallback(rawVideos) {
      const list = Array.isArray(rawVideos) ? rawVideos : [];
      return list.map((video, index) => ({
        ...video,
        coverUrl: processBiliCover(video?.cover || ""),
        coverPlaceholder: buildCoverPlaceholder(video, index)
      }));
    }
    function buildThumbnailHydrationItems(rawVideos) {
      const list = Array.isArray(rawVideos) ? rawVideos : [];
      return list.map((video) => ({
        cover: video?.cover || "",
        bvid: video?.bvid || "",
        url: video?.url || "",
        title: video?.title || ""
      }));
    }
    function mergeFavoriteThumbnailMeta(rawVideos, thumbnails) {
      const list = Array.isArray(rawVideos) ? rawVideos : [];
      if (!Array.isArray(thumbnails) || thumbnails.length !== list.length) {
        return hydrateFavoriteVideosFallback(rawVideos);
      }
      return list.map((video, index) => ({
        ...video,
        coverUrl: thumbnails[index]?.coverUrl || "",
        coverPlaceholder: thumbnails[index]?.coverPlaceholder || buildCoverPlaceholder(video, index)
      }));
    }
    function getBiliHydrationWorker() {
      if (typeof Worker === "undefined") return null;
      if (biliHydrationWorker) return biliHydrationWorker;
      try {
        biliHydrationWorker = new Worker(
          new URL(
            /* @vite-ignore */
            "" + new URL("biliFavoriteImageWorker-BeYe3chl.js", import.meta.url).href,
            import.meta.url
          ),
          { type: "module" }
        );
        return biliHydrationWorker;
      } catch (workerError) {
        console.warn("[BiliFavoriteView] 缩略图 Worker 初始化失败，回退主线程轻量处理:", workerError);
        biliHydrationWorker = null;
        return null;
      }
    }
    function hydrateFavoriteVideos(rawVideos) {
      const worker = getBiliHydrationWorker();
      if (!worker) return Promise.resolve(hydrateFavoriteVideosFallback(rawVideos));
      const jobId = ++biliHydrationJobId;
      return new Promise((resolve) => {
        let settled = false;
        let timeoutId = null;
        const cleanup = () => {
          worker.removeEventListener("message", handleMessage);
          worker.removeEventListener("error", handleError);
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
        };
        const finish = (videosToUse) => {
          if (settled) return;
          settled = true;
          cleanup();
          resolve(videosToUse);
        };
        const handleMessage = (event) => {
          const payload = event.data || {};
          if (payload.type !== "bili-favorite-videos-hydrated" || payload.jobId !== jobId) return;
          finish(mergeFavoriteThumbnailMeta(rawVideos, payload.thumbnails));
        };
        const handleError = () => {
          finish(hydrateFavoriteVideosFallback(rawVideos));
        };
        worker.addEventListener("message", handleMessage);
        worker.addEventListener("error", handleError);
        timeoutId = setTimeout(() => {
          finish(hydrateFavoriteVideosFallback(rawVideos));
        }, 1200);
        try {
          worker.postMessage({
            type: "hydrate-bili-favorite-videos",
            jobId,
            items: buildThumbnailHydrationItems(rawVideos)
          });
        } catch (postError) {
          console.warn("[BiliFavoriteView] 缩略图 Worker 投递失败，回退主线程轻量处理:", postError);
          finish(hydrateFavoriteVideosFallback(rawVideos));
        }
      });
    }
    const formatPlayCount = (count) => {
      if (!count) return "0";
      if (count >= 1e8) return `${(count / 1e8).toFixed(1)}亿`;
      if (count >= 1e4) return `${(count / 1e4).toFixed(1)}万`;
      return count.toString();
    };
    function mapTaskStatusToUiStatus(status) {
      switch (status) {
        case "queued":
        case "retry_wait":
        case "running":
        case "cancelling":
        case "paused":
          return "downloading";
        case "success":
          return "success";
        case "failed":
        case "cancelled":
        case "crashed":
          return "failed";
        default:
          return "idle";
      }
    }
    function getDownloadStatus(url) {
      const localStatus = downloadStatus.value.get(url)?.status;
      if (localStatus && localStatus !== "idle") return localStatus;
      return mapTaskStatusToUiStatus(downloadTaskStore.getTaskStatusByUrl(url));
    }
    function isDownloading(url) {
      return getDownloadStatus(url) === "downloading";
    }
    function getDownloadTitle(url) {
      const status = getDownloadStatus(url);
      switch (status) {
        case "downloading":
          return "下载中...";
        case "success":
          return "下载成功";
        case "failed":
          return "下载失败";
        case "skipped":
          return "已跳过（重复）";
        default:
          return "下载音频";
      }
    }
    function setDownloadStatus(url, status) {
      const existing = downloadStatus.value.get(url);
      if (existing?.timer) {
        clearTimeout(existing.timer);
      }
      if (status === "idle") {
        downloadStatus.value.delete(url);
      } else {
        const statusData = { status };
        if (status === "success" || status === "failed" || status === "skipped") {
          statusData.timer = setTimeout(() => {
            setDownloadStatus(url, "idle");
          }, 2e3);
        }
        downloadStatus.value.set(url, statusData);
      }
    }
    function enqueueSingleDownload(video) {
      if (!video?.url) return;
      if (isDownloading(video.url)) return;
      const result = downloadTaskStore.enqueueDownload(toTaskVideo(video), {
        source: "bili_favorite",
        type: "download_explicit",
        priority: "normal",
        visibleInPanel: true
      });
      if (!result.ok) {
        setDownloadStatus(video.url, "failed");
        toastMessage.value = "下载任务创建失败";
        showToast.value = true;
        return;
      }
      setDownloadStatus(video.url, "downloading");
      toastMessage.value = result.duplicate ? `任务已在队列中: ${video.title || ""}` : `已加入下载队列: ${video.title || ""}`;
      showToast.value = true;
    }
    function enqueueBatchDownload(selectedUrls) {
      if (!Array.isArray(selectedUrls) || selectedUrls.length === 0) return;
      const selectedVideos = videos.value.filter((video) => selectedUrls.includes(video.url));
      if (selectedVideos.length === 0) return;
      const taskVideos = selectedVideos.map((video) => toTaskVideo(video));
      const { taskIds = [] } = downloadTaskStore.enqueueBatch(taskVideos, {
        source: "bili_favorite",
        type: "download_explicit",
        priority: "normal",
        visibleInPanel: true
      });
      selectedVideos.forEach((video) => {
        const current = mapTaskStatusToUiStatus(downloadTaskStore.getTaskStatusByUrl(video.url));
        if (current === "downloading") {
          setDownloadStatus(video.url, "downloading");
        }
      });
      const duplicateCount = Math.max(0, selectedVideos.length - taskIds.length);
      if (taskIds.length === 0) {
        toastMessage.value = `任务已存在，跳过 ${duplicateCount} 项`;
      } else if (duplicateCount > 0) {
        toastMessage.value = `已入队 ${taskIds.length} 项，跳过 ${duplicateCount} 项`;
      } else {
        toastMessage.value = `已入队 ${taskIds.length} 项下载任务`;
      }
      showToast.value = true;
    }
    const parseFavorite = async () => {
      const requestId = ++parseRequestSeq;
      if (!favoriteUrl.value) {
        isLoading.value = false;
        error.value = { title: "参数错误", message: "缺少收藏夹链接" };
        return;
      }
      isLoading.value = true;
      error.value = null;
      videos.value = [];
      loadingTextIndex.value = 0;
      if (loadingInterval) clearInterval(loadingInterval);
      loadingInterval = setInterval(() => {
        loadingTextIndex.value = (loadingTextIndex.value + 1) % loadingTexts.length;
      }, 2e3);
      try {
        const response = await apiRequest("/api/bili-parse-favorite", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ url: favoriteUrl.value })
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "解析失败" }));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }
        const data = await response.json();
        if (requestId !== parseRequestSeq) return;
        if (data.success) {
          videos.value = await hydrateFavoriteVideos(data.videos || []);
        } else {
          error.value = {
            title: "解析失败",
            message: data.error || "未知错误",
            details: data.details
          };
        }
      } catch (err) {
        if (requestId !== parseRequestSeq) return;
        console.error("解析收藏夹失败:", err);
        error.value = {
          title: "网络错误",
          message: "无法连接到服务器",
          details: err.message
        };
      } finally {
        if (requestId !== parseRequestSeq) return;
        isLoading.value = false;
        if (loadingInterval) {
          clearInterval(loadingInterval);
          loadingInterval = null;
        }
      }
    };
    const handleVideoClick = (video) => {
      if (selectionStore.isModeActive) {
        selectionStore.toggleItem(video.url);
      } else {
        window.open(video.url, "_blank");
      }
    };
    let exitLongPressTimer = null;
    const handleTouchStart = (e, type, id) => {
      if (selectionStore.isModeActive) {
        exitLongPressTimer = setTimeout(() => {
          closeMode();
          if (window.navigator.vibrate) window.navigator.vibrate(20);
        }, 800);
      } else {
        originalTouchStart(e, type, id);
      }
    };
    const handleTouchEnd = () => {
      clearTimeout(exitLongPressTimer);
      originalTouchEnd();
    };
    const addToExistingPlaylist = async (playlistId) => {
      const selectedUrls = selectedSongIds.value.length ? [...selectedSongIds.value] : Array.from(selectionStore.selectedIds);
      const songHints = buildSongHintsByUrls(selectedUrls);
      const hashIds = songHints.map((item) => item.hash_id).filter(Boolean);
      if (!hashIds.length) return;
      try {
        const response = await apiRequest("/api/playlist/batch-add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: {
            playlistId,
            hashIds,
            songHints
          }
        });
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || errData.message || `HTTP ${response.status}`);
        }
        const playlist = existingPlaylists.value.find((pl) => pl.id === playlistId);
        showToast.value = true;
        toastMessage.value = `已添加到歌单「${playlist?.name || "歌单"}」(${hashIds.length} 首)`;
        emitPlaylistContentUpdated(playlistId, "bili-favorite-batch-add");
        closePlaylistDialog();
        closeMode(true);
      } catch (err) {
        showToast.value = true;
        toastMessage.value = "添加失败，请重试";
        console.error("添加歌单失败:", err);
      }
    };
    const createNewPlaylist = async () => {
      if (!newPlaylistName.value.trim()) return;
      const selectedUrls = selectedSongIds.value.length ? [...selectedSongIds.value] : Array.from(selectionStore.selectedIds);
      const selectedVideos = videos.value.filter((video) => selectedUrls.includes(video.url));
      const songHints = buildSongHintsByUrls(selectedUrls);
      const songIds = songHints.map((item) => item.hash_id).filter(Boolean);
      if (!songIds.length) return;
      try {
        const coverUrl = selectedVideos.length > 0 ? processBiliCover(selectedVideos[0]?.cover) : "";
        const response = await apiRequest("/api/playlist/custom/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: {
            playlistName: newPlaylistName.value.trim(),
            coverUrl,
            songIds,
            songHints
          }
        });
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || errData.message || `HTTP ${response.status}`);
        }
        const data = await response.json().catch(() => ({}));
        const createdName = newPlaylistName.value.trim();
        showToast.value = true;
        toastMessage.value = `已创建歌单「${createdName}」(${songIds.length} 首)`;
        if (data?.id) {
          existingPlaylists.value.unshift({
            id: data.id,
            name: createdName,
            cover: coverUrl || "/api/cover/random",
            count: songIds.length
          });
        }
        closePlaylistDialog();
        closeMode(true);
      } catch (err) {
        showToast.value = true;
        toastMessage.value = "创建歌单失败，请重试";
        console.error("创建歌单失败:", err);
      }
    };
    const closePlaylistDialog = () => {
      showPlaylistDialog.value = false;
      newPlaylistName.value = "";
      selectedSongIds.value = [];
    };
    function handleBiliDownloadEvent(event) {
      if (!event || !event.url) return;
      if (event.type === "start" || event.type === "progress") {
        if (getDownloadStatus(event.url) !== "downloading") {
          setDownloadStatus(event.url, "downloading");
        }
        return;
      }
      if (event.type === "success") {
        setDownloadStatus(event.url, "success");
        if (isMenuOpen.value === false) {
          toastMessage.value = `✅ 下载完成: ${event.data?.message || "下载成功"}`;
          showToast.value = true;
        }
        if (navigator.vibrate) navigator.vibrate(50);
        else if (window.Android?.vibrate) window.Android.vibrate(50);
        return;
      }
      if (event.type === "error") {
        setDownloadStatus(event.url, "failed");
        if (isMenuOpen.value === false) {
          toastMessage.value = `❌ 下载失败: ${event.message || "未知错误"}`;
          showToast.value = true;
        }
      }
    }
    let savedScrollPosition = 0;
    function restoreFavoriteScrollPosition(targetScrollTop) {
      if (targetScrollTop <= 0) return;
      let attempts = 0;
      const maxAttempts = 12;
      const applyRestore = () => {
        const scrollEl = songListContainer.value?.containerRef;
        if (!scrollEl) {
          if (attempts < maxAttempts) {
            attempts += 1;
            requestAnimationFrame(applyRestore);
          }
          return;
        }
        scrollEl.scrollTop = targetScrollTop;
        if (Math.abs((scrollEl.scrollTop || 0) - targetScrollTop) > 2 && attempts < maxAttempts) {
          attempts += 1;
          requestAnimationFrame(applyRestore);
        }
      };
      requestAnimationFrame(applyRestore);
    }
    pageLifecycle.onActivated(({ shouldRestore } = {}) => {
      const pageKey = pageLifecycle.pageKey;
      const cachedState = cacheStore.getPageState(pageKey);
      const cachedScrollPosition = Number(cachedState?.scrollPosition || 0);
      const targetScrollTop = Math.max(savedScrollPosition, cachedScrollPosition);
      logBiliFavorite(`[BiliFavoriteView] isCached: ${cacheStore.cachedViews.includes(pageKey)}`);
      if (targetScrollTop > 0) {
        restoreFavoriteScrollPosition(targetScrollTop);
      }
    });
    pageLifecycle.onDeactivated(() => {
      const pageKey = pageLifecycle.pageKey;
      logBiliFavorite(`[BiliFavoriteView] isCached before check: ${cacheStore.cachedViews.includes(pageKey)}`);
      logBiliFavorite(`[BiliFavoriteView] current scroll position: ${songListContainer.value?.containerRef?.scrollTop || 0}px`);
      if (cacheStore.cachedViews.includes(pageKey)) {
        if (songListContainer.value && songListContainer.value.containerRef) {
          const scrollEl = songListContainer.value.containerRef;
          savedScrollPosition = scrollEl.scrollTop;
          cacheStore.savePageState(pageKey, {
            scrollPosition: savedScrollPosition
          });
        }
      }
    });
    onMounted(() => {
      selectionStore.setCurrentPage("bili-favorite-view");
      downloadTaskStore.initDeferred(0);
      unsubscribeBiliDownload = onBiliDownload(handleBiliDownloadEvent);
      unsubscribeThumbnailQueue = subscribeThumbnailQueue((stats) => {
        thumbnailQueueStats.value = stats;
      });
      setTimeout(() => {
        parseFavorite();
      }, 500);
    });
    onUnmounted(() => {
      unsubscribeBiliDownload?.();
      unsubscribeBiliDownload = null;
      unsubscribeThumbnailQueue?.();
      unsubscribeThumbnailQueue = null;
      biliHydrationJobId += 1;
      if (biliHydrationWorker) {
        biliHydrationWorker.terminate();
        biliHydrationWorker = null;
      }
      selectionStore.exitMode();
    });
    return (_ctx, _cache) => {
      const _directive_marquee = resolveDirective("marquee");
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["bili-favorite-view", {
          "is-thumbnail-busy": isThumbnailBusy.value,
          "ui-safety-mode": isUiSafetyMode.value
        }])
      }, [
        createVNode(Toast, {
          visible: showToast.value,
          message: toastMessage.value,
          duration: 2e3,
          onHide: _cache[0] || (_cache[0] = ($event) => showToast.value = false)
        }, null, 8, ["visible", "message"]),
        isLoading.value ? (openBlock(), createElementBlock("div", _hoisted_1, [
          _cache[8] || (_cache[8] = createStaticVNode('<div class="bili-tv-loader" data-v-28d8f6a9><div class="tv-antennas" data-v-28d8f6a9><div class="antenna left" data-v-28d8f6a9></div><div class="antenna right" data-v-28d8f6a9></div></div><div class="tv-body" data-v-28d8f6a9><div class="tv-face" data-v-28d8f6a9><div class="eyes-row" data-v-28d8f6a9><div class="eye left" data-v-28d8f6a9></div><div class="eye right" data-v-28d8f6a9></div></div><div class="mouth" data-v-28d8f6a9></div></div></div><div class="tv-shadow" data-v-28d8f6a9></div></div><h3 class="loading-title" data-v-28d8f6a9>正在导入</h3><div class="loading-progress-bar" data-v-28d8f6a9><div class="progress-indeterminate" data-v-28d8f6a9></div></div>', 3)),
          createBaseVNode("p", _hoisted_2, toDisplayString(dynamicLoadingText.value), 1)
        ])) : error.value ? (openBlock(), createElementBlock("div", _hoisted_3, [
          _cache[10] || (_cache[10] = createBaseVNode("div", { class: "error-icon" }, "⚠️", -1)),
          createBaseVNode("div", _hoisted_4, [
            createBaseVNode("h3", null, toDisplayString(error.value.title), 1),
            createBaseVNode("p", null, toDisplayString(error.value.message), 1),
            error.value.details ? (openBlock(), createElementBlock("div", _hoisted_5, [
              createBaseVNode("details", null, [
                _cache[9] || (_cache[9] = createBaseVNode("summary", null, "详细信息", -1)),
                createBaseVNode("pre", null, toDisplayString(error.value.details), 1)
              ])
            ])) : createCommentVNode("", true),
            createBaseVNode("button", {
              class: "retry-btn",
              onClick: parseFavorite
            }, "重试")
          ])
        ])) : createCommentVNode("", true),
        !error.value ? (openBlock(), createElementBlock("div", _hoisted_6, [
          createBaseVNode("div", _hoisted_7, [
            isLoading.value ? (openBlock(), createElementBlock("span", _hoisted_8, "正在加载收藏夹内容...")) : videos.value.length > 0 ? (openBlock(), createElementBlock("span", _hoisted_9, [
              _cache[11] || (_cache[11] = createTextVNode("找到 ", -1)),
              createBaseVNode("strong", null, toDisplayString(videos.value.length), 1),
              _cache[12] || (_cache[12] = createTextVNode(" 个Bilibili视频", -1))
            ])) : !isLoading.value ? (openBlock(), createElementBlock("span", _hoisted_10, "收藏夹为空")) : createCommentVNode("", true)
          ]),
          videos.value.length > 0 || isLoading.value ? (openBlock(), createBlock(ScrollSurface, { key: 0 }, {
            default: withCtx(() => [
              createVNode(VirtualList, {
                items: videos.value,
                "retain-text": "",
                "stable-content": "",
                "item-height": biliFavoriteItemHeight.value,
                buffer: biliVirtualBuffer.value,
                "item-key": "url",
                ref_key: "songListContainer",
                ref: songListContainer,
                style: { "flex": "1", "min-height": "0" }
              }, {
                default: withCtx(({ item: video, index, active, canLoadMedia }) => [
                  createBaseVNode("div", {
                    class: normalizeClass(["song-box bili-video-box", {
                      "is-selected": unref(selectionStore).isModeActive && unref(selectionStore).selectedIds.has(video.url),
                      "mode-selection": unref(selectionStore).isModeActive
                    }]),
                    onClick: ($event) => handleVideoClick(video),
                    onTouchstartPassive: ($event) => handleTouchStart($event, "video", video.url),
                    onTouchmovePassive: _cache[1] || (_cache[1] = (...args) => unref(handleTouchMove) && unref(handleTouchMove)(...args)),
                    onTouchend: handleTouchEnd
                  }, [
                    createBaseVNode("div", {
                      class: "left-box-song",
                      style: normalizeStyle({ "--ty-cover-placeholder": video.coverPlaceholder || void 0 })
                    }, [
                      active ? (openBlock(), createBlock(DeferredThumbnail, {
                        key: 0,
                        enabled: canLoadMedia,
                        class: "bili-cover-thumbnail",
                        src: video.coverUrl || processBiliCover(video.cover),
                        alt: `${video.title || "视频"}封面`,
                        "root-margin": "260px"
                      }, null, 8, ["enabled", "src", "alt"])) : createCommentVNode("", true)
                    ], 4),
                    createBaseVNode("div", _hoisted_12, [
                      createBaseVNode("div", _hoisted_13, [
                        createBaseVNode("div", _hoisted_14, [
                          createBaseVNode("div", _hoisted_15, [
                            withDirectives((openBlock(), createElementBlock("p", null, [
                              createTextVNode(toDisplayString(video.title), 1)
                            ])), [
                              [_directive_marquee, canLoadMedia]
                            ])
                          ])
                        ]),
                        createBaseVNode("div", _hoisted_16, [
                          createBaseVNode("div", _hoisted_17, [
                            createBaseVNode("span", null, "作者：" + toDisplayString(video.author), 1),
                            createBaseVNode("span", _hoisted_18, "时长：" + toDisplayString(video.duration), 1),
                            createBaseVNode("span", _hoisted_19, "播放：" + toDisplayString(formatPlayCount(video.play)), 1)
                          ])
                        ])
                      ])
                    ]),
                    active && !unref(selectionStore).isModeActive ? (openBlock(), createElementBlock("div", _hoisted_20, [
                      createBaseVNode("button", {
                        class: "download-btn",
                        onClick: withModifiers(($event) => enqueueSingleDownload(video), ["stop"]),
                        disabled: isDownloading(video.url),
                        title: getDownloadTitle(video.url)
                      }, [
                        getDownloadStatus(video.url) === "downloading" ? (openBlock(), createElementBlock("span", _hoisted_22, "↓")) : getDownloadStatus(video.url) === "success" ? (openBlock(), createElementBlock("span", _hoisted_23, "✓")) : getDownloadStatus(video.url) === "failed" ? (openBlock(), createElementBlock("span", _hoisted_24, "×")) : (openBlock(), createElementBlock("span", _hoisted_25, "↓"))
                      ], 8, _hoisted_21)
                    ])) : createCommentVNode("", true)
                  ], 42, _hoisted_11)
                ]),
                _: 1
              }, 8, ["items", "item-height", "buffer"])
            ]),
            _: 1
          })) : createCommentVNode("", true)
        ])) : (openBlock(), createElementBlock("div", _hoisted_26, [..._cache[13] || (_cache[13] = [
          createBaseVNode("div", { class: "tips-icon" }, "📺", -1),
          createBaseVNode("p", null, "收藏夹为空", -1)
        ])])),
        createVNode(Transition, { name: "fade" }, {
          default: withCtx(() => [
            unref(selectionStore).isModeActive ? (openBlock(), createElementBlock("div", _hoisted_27, [
              createVNode(Transition, { name: "slide-up" }, {
                default: withCtx(() => [
                  isMenuOpen.value ? (openBlock(), createElementBlock("div", _hoisted_28, [
                    createBaseVNode("div", {
                      class: "menu-item",
                      onClick: _cache[2] || (_cache[2] = (...args) => unref(selectAll) && unref(selectAll)(...args))
                    }, "全选"),
                    createBaseVNode("div", {
                      class: "menu-item",
                      onClick: _cache[3] || (_cache[3] = ($event) => unref(handleAction)("batchDownload"))
                    }, "批量下载"),
                    createBaseVNode("div", {
                      class: "menu-item",
                      onClick: _cache[4] || (_cache[4] = ($event) => unref(handleAction)("addToPlaylist"))
                    }, "收藏到歌单"),
                    _cache[14] || (_cache[14] = createBaseVNode("div", { class: "menu-divider" }, null, -1)),
                    createBaseVNode("div", {
                      class: "menu-item cancel",
                      onClick: _cache[5] || (_cache[5] = (...args) => unref(closeMode) && unref(closeMode)(...args))
                    }, "退出选择")
                  ])) : createCommentVNode("", true)
                ]),
                _: 1
              }),
              createBaseVNode("button", {
                class: "fab-main-btn",
                onClick: _cache[6] || (_cache[6] = ($event) => isMenuOpen.value = !isMenuOpen.value)
              }, [
                unref(selectionStore).selectedIds.size > 0 ? (openBlock(), createElementBlock("span", _hoisted_29, toDisplayString(unref(selectionStore).selectedIds.size), 1)) : createCommentVNode("", true),
                _cache[15] || (_cache[15] = createBaseVNode("svg", {
                  viewBox: "0 0 24 24",
                  width: "24",
                  height: "24",
                  fill: "currentColor"
                }, [
                  createBaseVNode("path", { d: "M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" })
                ], -1))
              ])
            ])) : createCommentVNode("", true)
          ]),
          _: 1
        }),
        createVNode(Transition, { name: "fade" }, {
          default: withCtx(() => [
            showPlaylistDialog.value ? (openBlock(), createElementBlock("div", _hoisted_30, [
              createBaseVNode("div", _hoisted_31, [
                _cache[17] || (_cache[17] = createBaseVNode("h3", null, "收藏到歌单", -1)),
                createBaseVNode("div", _hoisted_32, [
                  existingPlaylists.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_33, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(existingPlaylists.value, (pl) => {
                      return openBlock(), createElementBlock("div", {
                        key: pl.id,
                        class: "playlist-item",
                        onClick: ($event) => addToExistingPlaylist(pl.id)
                      }, [
                        createBaseVNode("img", {
                          src: pl.cover,
                          alt: pl.name,
                          class: "playlist-cover"
                        }, null, 8, _hoisted_35),
                        createBaseVNode("div", _hoisted_36, [
                          createBaseVNode("p", _hoisted_37, toDisplayString(pl.name), 1),
                          createBaseVNode("p", _hoisted_38, toDisplayString(pl.count) + " 首", 1)
                        ])
                      ], 8, _hoisted_34);
                    }), 128))
                  ])) : createCommentVNode("", true),
                  createBaseVNode("div", _hoisted_39, [
                    _cache[16] || (_cache[16] = createBaseVNode("p", { class: "create-label" }, "或创建新歌单", -1)),
                    withDirectives(createBaseVNode("input", {
                      "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => newPlaylistName.value = $event),
                      type: "text",
                      placeholder: "请输入歌单名称",
                      maxlength: "30",
                      onKeyup: withKeys(createNewPlaylist, ["enter"])
                    }, null, 544), [
                      [vModelText, newPlaylistName.value]
                    ])
                  ])
                ]),
                createBaseVNode("div", _hoisted_40, [
                  createBaseVNode("button", {
                    class: "btn-cancel",
                    onClick: closePlaylistDialog
                  }, "取消"),
                  createBaseVNode("button", {
                    class: "btn-confirm",
                    onClick: createNewPlaylist,
                    disabled: !newPlaylistName.value.trim()
                  }, "创建", 8, _hoisted_41)
                ])
              ])
            ])) : createCommentVNode("", true)
          ]),
          _: 1
        })
      ], 2);
    };
  }
});
const BiliFavoriteView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-28d8f6a9"]]);
export {
  BiliFavoriteView as default
};
