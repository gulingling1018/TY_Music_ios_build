import { _ as useRoute, c as computed, J as reactive, M as ref, a5 as watch, v as nextTick, A as onBeforeUnmount, R as resolveComponent, S as resolveDirective, I as openBlock, g as createElementBlock, l as createVNode, d as createBaseVNode, a7 as withDirectives, a3 as vModelText, a8 as withKeys, w as normalizeClass, a0 as vModelCheckbox, a6 as withCtx, Y as toDisplayString, f as createCommentVNode, T as Transition, F as Fragment, k as createTextVNode, x as normalizeStyle, Z as unref, a9 as withModifiers, O as renderList } from "./vendor.js";
import { S as ScrollSurface } from "./ScrollSurface.js";
import { Y as registerCache, C as CACHE_LIFECYCLE, a as CACHE_MEDIUM, f as apiRequest, N as onSearchResult, _ as _export_sfc, ac as usePlayerStore, ad as usePlaylistStore, aj as useSelectionStore, a8 as useDownloadTaskStore, ak as useSkinThemeConfig, a7 as useCacheStore, ah as useSelection, ab as usePageLifecycle, M as onBiliDownload, ai as useSelectionModeMicroservice, X as registerBackHandler, V as VirtualList, q as formatArtistProducer, a3 as showGlobalToast, z as getSongCoverSrc, s as getBiliVideoUrl, E as getTrustedBiliApiCoverUrl, l as compareOrderKeysDesc } from "./index.js";
import { u as useSwipeInsertManager, e as ensureAndroidFeaturePermission } from "./androidPermission.js";
const MAX_ENTRIES = 10;
const TTL_MS = 2 * 60 * 1e3;
const pages = /* @__PURE__ */ new Map();
function normalizeKeyword(value) {
  return `${value || ""}`.trim();
}
function createSearchPageKey({ keyword, seed, page, limit }) {
  return [
    normalizeKeyword(keyword),
    `${seed || ""}`.trim(),
    Math.max(1, Number(page) || 1),
    Math.max(1, Number(limit) || 30)
  ].join("");
}
function pruneExpired(now = Date.now()) {
  for (const [key, entry] of pages) {
    if (now - entry.createdAt > TTL_MS) pages.delete(key);
  }
}
function getSearchPage(params) {
  const key = createSearchPageKey(params);
  const entry = pages.get(key);
  if (!entry) return null;
  if (Date.now() - entry.createdAt > TTL_MS) {
    pages.delete(key);
    return null;
  }
  pages.delete(key);
  pages.set(key, entry);
  return entry.payload;
}
function putSearchPage(params, payload) {
  if (!payload || !Array.isArray(payload.songs)) return;
  const key = createSearchPageKey(params);
  const previousScrollPosition = pages.get(key)?.scrollPosition || 0;
  pages.delete(key);
  pages.set(key, {
    createdAt: Date.now(),
    payload,
    scrollPosition: previousScrollPosition
  });
  pruneExpired();
  while (pages.size > MAX_ENTRIES) {
    pages.delete(pages.keys().next().value);
  }
}
function getSearchPageScrollPosition(params) {
  return Math.max(0, Number(pages.get(createSearchPageKey(params))?.scrollPosition) || 0);
}
function setSearchPageScrollPosition(params, scrollPosition) {
  const key = createSearchPageKey(params);
  const entry = pages.get(key);
  if (!entry) return;
  entry.scrollPosition = Math.max(0, Number(scrollPosition) || 0);
}
function clearSearchPages() {
  pages.clear();
}
function getSearchPageCacheSize() {
  pruneExpired();
  return pages.size;
}
registerCache({
  id: "search-page-prefetch",
  owner: "localSearchClient",
  medium: CACHE_MEDIUM.MEMORY,
  lifecycle: CACHE_LIFECYCLE.SESSION,
  clearable: true,
  priority: 25,
  description: "本地搜索当前页与相邻页 LRU 缓存",
  getSize: getSearchPageCacheSize,
  clear: clearSearchPages
});
const EVENT_TIMEOUT_MS = 5e4;
const pendingRequests = /* @__PURE__ */ new Map();
function normalizeParams(params) {
  return {
    keyword: `${params.keyword || ""}`.trim(),
    seed: `${params.seed || ""}`.trim(),
    page: Math.max(1, Math.floor(Number(params.page) || 1)),
    limit: Math.max(1, Math.floor(Number(params.limit) || 30))
  };
}
function eventKey(event) {
  return createSearchPageKey({
    keyword: event?.keyword,
    seed: event?.seed || event?.sessionId,
    page: event?.page,
    limit: event?.pageSize
  });
}
function finishPending(entry, callback) {
  if (!entry || entry.settled) return;
  entry.settled = true;
  clearTimeout(entry.timer);
  pendingRequests.delete(entry.key);
  callback();
}
onSearchResult((event) => {
  const key = eventKey(event);
  const entry = pendingRequests.get(key);
  if (!entry) return;
  if (event?.success && Array.isArray(event.songs)) {
    putSearchPage(entry.params, event);
    finishPending(entry, () => entry.resolve(event));
  } else {
    finishPending(entry, () => entry.reject(new Error(event?.error || "搜索失败，请重试")));
  }
});
function cancelOtherPrefetches(exceptKey) {
  for (const entry of [...pendingRequests.values()]) {
    if (!entry.prefetch || entry.key === exceptKey) continue;
    finishPending(entry, () => entry.reject(new Error("搜索预取已被前台请求取代")));
  }
}
function getCachedLocalSearchPage(params) {
  return getSearchPage(normalizeParams(params));
}
function getCachedLocalSearchScroll(params) {
  return getSearchPageScrollPosition(normalizeParams(params));
}
function saveCachedLocalSearchScroll(params, scrollPosition) {
  setSearchPageScrollPosition(normalizeParams(params), scrollPosition);
}
function searchLocalPage(input, options = {}) {
  const params = normalizeParams(input);
  const key = createSearchPageKey(params);
  const cached = getSearchPage(params);
  if (cached) return Promise.resolve(cached);
  const existing = pendingRequests.get(key);
  if (existing) return existing.promise;
  if (!options.prefetch) cancelOtherPrefetches(key);
  let resolvePromise;
  let rejectPromise;
  const promise = new Promise((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });
  const entry = {
    key,
    params,
    promise,
    resolve: resolvePromise,
    reject: rejectPromise,
    prefetch: options.prefetch === true,
    settled: false,
    timer: 0
  };
  entry.timer = setTimeout(() => {
    finishPending(entry, () => entry.reject(new Error("本地搜索结果等待超时")));
  }, EVENT_TIMEOUT_MS);
  pendingRequests.set(key, entry);
  const searchParams = new URLSearchParams({
    q: params.keyword,
    page: String(params.page),
    limit: String(params.limit),
    seed: params.seed
  });
  void apiRequest(`/api/search?${searchParams.toString()}`).then(async (response) => {
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.message || `音乐搜索请求失败 (${response.status})`);
    }
    const data = await response.json();
    if (!data.success && data.error) throw new Error(data.error);
    if (data.asyncSearchPending) {
      if (typeof options.onPending === "function") options.onPending(data);
      return;
    }
    if (!Array.isArray(data.songs)) data.songs = [];
    putSearchPage(params, data);
    finishPending(entry, () => entry.resolve(data));
  }).catch((error) => {
    finishPending(entry, () => entry.reject(error));
  });
  return promise;
}
async function prefetchLocalSearchPage(params) {
  try {
    await searchLocalPage(params, { prefetch: true });
    return true;
  } catch (_) {
    return false;
  }
}
const _hoisted_1 = { class: "search-view" };
const _hoisted_2 = { class: "search-container" };
const _hoisted_3 = { class: "search-input-wrapper" };
const _hoisted_4 = ["disabled"];
const _hoisted_5 = {
  key: 0,
  class: "loading-indicator"
};
const _hoisted_6 = {
  key: 0,
  class: "loading-sub"
};
const _hoisted_7 = {
  key: 0,
  class: "error-container"
};
const _hoisted_8 = { class: "error-content" };
const _hoisted_9 = {
  key: 0,
  class: "error-details"
};
const _hoisted_10 = {
  key: 1,
  class: "search-results"
};
const _hoisted_11 = {
  key: 0,
  class: "results-panel"
};
const _hoisted_12 = { class: "results-header" };
const _hoisted_13 = { class: "results-header-summary" };
const _hoisted_14 = {
  key: 0,
  class: "results-page-nav"
};
const _hoisted_15 = ["disabled"];
const _hoisted_16 = { class: "page-indicator" };
const _hoisted_17 = ["disabled"];
const _hoisted_18 = ["onClick", "onTouchstartPassive"];
const _hoisted_19 = { class: "left-box-song" };
const _hoisted_20 = ["src", "alt", "onLoad", "onError"];
const _hoisted_21 = { class: "right-box" };
const _hoisted_22 = { class: "up-title-box" };
const _hoisted_23 = { class: "down-singer-box" };
const _hoisted_24 = {
  key: 0,
  class: "search-pagination"
};
const _hoisted_25 = ["disabled"];
const _hoisted_26 = { class: "page-indicator" };
const _hoisted_27 = ["disabled"];
const _hoisted_28 = { key: 1 };
const _hoisted_29 = { class: "empty-results" };
const _hoisted_30 = {
  key: 0,
  class: "results-panel"
};
const _hoisted_31 = { class: "results-header" };
const _hoisted_32 = { class: "results-header-summary" };
const _hoisted_33 = { class: "song-box bili-video-box" };
const _hoisted_34 = { class: "song-content bili-video-content" };
const _hoisted_35 = { class: "left-box-song bili-video-cover" };
const _hoisted_36 = ["href"];
const _hoisted_37 = ["src", "alt", "onError"];
const _hoisted_38 = { class: "right-box" };
const _hoisted_39 = { class: "up-title-box" };
const _hoisted_40 = ["href"];
const _hoisted_41 = { class: "down-singer-box" };
const _hoisted_42 = { class: "bili-video-meta" };
const _hoisted_43 = { class: "download-btn-wrapper" };
const _hoisted_44 = ["onClick", "disabled", "title"];
const _hoisted_45 = {
  key: 0,
  class: "download-icon downloading"
};
const _hoisted_46 = {
  key: 1,
  class: "download-icon success"
};
const _hoisted_47 = {
  key: 2,
  class: "download-icon failed"
};
const _hoisted_48 = {
  key: 3,
  class: "download-icon"
};
const _hoisted_49 = { key: 1 };
const _hoisted_50 = { class: "empty-results" };
const _hoisted_51 = {
  key: 2,
  class: "search-tips"
};
const _hoisted_52 = {
  key: 0,
  class: "fab-container"
};
const _hoisted_53 = {
  key: 0,
  class: "fab-menu"
};
const _hoisted_54 = {
  key: 0,
  class: "count-badge"
};
const _hoisted_55 = {
  key: 0,
  class: "playlist-input-overlay"
};
const _hoisted_56 = { class: "playlist-input-dialog" };
const _hoisted_57 = { class: "playlist-input-body" };
const _hoisted_58 = {
  key: 0,
  class: "playlist-list"
};
const _hoisted_59 = ["onClick"];
const _hoisted_60 = ["src", "alt"];
const _hoisted_61 = { class: "playlist-info" };
const _hoisted_62 = { class: "playlist-name" };
const _hoisted_63 = { class: "playlist-count" };
const _hoisted_64 = { class: "create-new-section" };
const _hoisted_65 = { class: "dialog-buttons" };
const _hoisted_66 = ["disabled"];
const INSERT_THRESHOLD = 120;
const HORIZONTAL_INTENT_RATIO = 1.2;
const SEARCH_PAGE_SIZE = 30;
const preloadAbove = 30;
const preloadBelow = 30;
const renderSegmentSize = 40;
const coverPreloadAhead = 20;
const coverPreloadBehind = 2;
const coverRetryDelayMs = 700;
const _sfc_main = /* @__PURE__ */ Object.assign({
  name: "SearchView"
}, {
  __name: "SearchView",
  setup(__props) {
    const playerStore = usePlayerStore();
    const playlistStore = usePlaylistStore();
    const selectionStore = useSelectionStore();
    const downloadTaskStore = useDownloadTaskStore();
    const route = useRoute();
    const isSkinSandboxSearch = computed(() => route.query.skinSandbox === "1");
    const { useSkinTarget } = useSkinThemeConfig();
    const searchSongItemSkin = useSkinTarget("search_song_item");
    const searchPageSkin = useSkinTarget("page_search");
    const { insertNext: handleSwipeInsertNext, resetBatch: resetSwipeBatch } = useSwipeInsertManager("search");
    selectionStore.setCurrentPage("search-view");
    const cacheStore = useCacheStore();
    const { handleTouchStart: originalTouchStart, handleTouchMove, handleTouchEnd: originalTouchEnd } = useSelection();
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
    const businessMachine = reactive({
      state: { current: "idle" },
      transition(event, payload) {
        console.log(`[BSM Search] ${this.state.current} --${event}-->`, payload);
        switch (event) {
          case "SEARCH":
            this.state.current = "searching";
            break;
          case "SUCCESS":
            this.state.current = "success";
            break;
          case "ERROR":
            this.state.current = "error";
            break;
          default:
            console.warn("[BSM Search] Unknown event:", event);
        }
      }
    });
    const pageLifecycle = usePageLifecycle("search");
    let swipeStartX = 0;
    let swipeStartY = 0;
    let swipeCurrentSong = null;
    let isSwipeGesture = false;
    const swipeOffset = ref(0);
    const swipeVisualSongKey = ref("");
    let swipeFrameId = 0;
    let pendingSwipeOffset = 0;
    function isSwipeVisualSong(song) {
      return swipeVisualSongKey.value !== "" && swipeVisualSongKey.value === getSongKey(song);
    }
    function getSwipeStyle(song) {
      if (!isSwipeVisualSong(song) || swipeOffset.value === 0) return {};
      return {
        transform: `translateX(${swipeOffset.value}px)`,
        transition: isSwipeGesture ? "none" : "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      };
    }
    function getInsertBackgroundStyle(song) {
      if (!isSwipeVisualSong(song) || swipeOffset.value >= 0) return {};
      const absOffset = Math.abs(swipeOffset.value);
      const progress = Math.min(absOffset / INSERT_THRESHOLD, 1);
      return {
        clipPath: `inset(0 0 0 ${((1 - progress) * 100).toFixed(2)}%)`,
        "--swipe-opacity": `${(progress * 0.88).toFixed(4)}`
      };
    }
    function isInsertIconVisible(song) {
      if (!isSwipeVisualSong(song)) return false;
      return swipeOffset.value < -30;
    }
    function shouldShakeInsertIcon(song) {
      if (!isSwipeVisualSong(song)) return false;
      return swipeOffset.value <= -INSERT_THRESHOLD;
    }
    function clearSwipeVisual() {
      if (swipeFrameId) {
        window.cancelAnimationFrame(swipeFrameId);
        swipeFrameId = 0;
      }
      swipeCurrentSong = null;
      swipeVisualSongKey.value = "";
      swipeOffset.value = 0;
      isSwipeGesture = false;
    }
    function setSwipeOffsetSmooth(nextOffset) {
      pendingSwipeOffset = nextOffset;
      if (swipeFrameId) return;
      swipeFrameId = window.requestAnimationFrame(() => {
        swipeFrameId = 0;
        swipeOffset.value = pendingSwipeOffset;
      });
    }
    function cancelSwipeFrame() {
      if (!swipeFrameId) return;
      window.cancelAnimationFrame(swipeFrameId);
      swipeFrameId = 0;
    }
    let coldStartSearchHydrated = false;
    pageLifecycle.onMounted(() => {
      selectionStore.setCurrentPage("search-view");
      ensureSearchBackHandler();
      downloadTaskStore.initDeferred(0);
      unsubscribeBiliDownload = onBiliDownload(handleBiliDownloadEvent);
      isSearchViewActive.value = true;
    });
    pageLifecycle.onActivated(({ shouldRestore } = {}) => {
      selectionStore.setCurrentPage("search-view");
      ensureSearchBackHandler();
      isSearchViewActive.value = true;
      if (shouldRestore) {
        restoreSearchViewStateFromCache();
      } else if (!coldStartSearchHydrated && cacheStore.hydrateSearchFromPersisted()) {
        restoreSearchViewStateFromCache();
      } else {
        destroySearchViewState({ clearCache: false });
      }
      coldStartSearchHydrated = true;
      resetSwipeBatch();
    });
    pageLifecycle.onDeactivated(() => {
      console.log(`========== [SearchView] DEACTIVATED ==========`);
      console.log(`[SearchView] pageKey: ${pageLifecycle.pageKey}`);
      console.log(`[SearchView] isCached before check: ${cacheStore.cachedViews.includes(pageLifecycle.pageKey)}`);
      console.log(`[SearchView] searchQuery before save: "${searchQuery.value}"`);
      console.log(`[SearchView] hasSearched before save: ${hasSearched.value}`);
      console.log(`[SearchView] searchResults count before save: ${searchResults.value.length}`);
      const pageKey = pageLifecycle.pageKey;
      if (cacheStore.cachedViews.includes(pageKey)) {
        console.log(`[SearchView] Saving state to cache...`);
        saveSearchViewStateToCache();
        console.log(`[SearchView] State saved successfully`);
      } else {
        console.log(`[SearchView] Page removed from cache, clearing internal state...`);
        destroySearchViewState({ clearCache: false });
      }
      isSearchViewActive.value = false;
      playerStore.releaseMiniPlayer("search-keyword-stage");
      removeSearchBackHandler();
      console.log(`[SearchView] Deactivation complete`);
    });
    const searchQuery = ref("");
    const searchResults = ref([]);
    const hasSearched = ref(false);
    const lastSearchQuery = ref("");
    const searchError = ref(null);
    const isLoading = ref(false);
    const showToast = ref(false);
    const toastMessage = ref("");
    const songListContainer = ref(null);
    const isMenuOpen = ref(false);
    const showPlaylistDialog = ref(false);
    const newPlaylistName = ref("");
    const existingPlaylists = ref([]);
    const selectedSongIds = ref([]);
    const selectionModeService = useSelectionModeMicroservice({
      selectionStore,
      playlistStore,
      isMenuOpen,
      getAllIds: () => searchResults.value.map((video) => getSongKey(video)),
      openAddToPlaylist: async (selectedIds) => {
        selectedSongIds.value = [...selectedIds];
        await loadExistingPlaylists();
        showPlaylistDialog.value = true;
      },
      getTracksBySelectedIds: (selectedIds) => {
        const songById = /* @__PURE__ */ new Map();
        searchResults.value.forEach((song) => {
          const key = getSongKey(song);
          if (key && !songById.has(key)) {
            songById.set(key, song);
          }
        });
        return selectedIds.map((id) => songById.get(id)).filter(Boolean);
      },
      getCurrentHashId: () => playerStore.currentHashId,
      playNextSource: "search_batch_play_next",
      runBatchDownload: (selectedIds) => enqueueBatchDownload(selectedIds)
    });
    const closeMode = selectionModeService.closeMode;
    const selectAll = selectionModeService.selectAll;
    const handleAction = selectionModeService.handleAction;
    let unregisterSearchBackHandler = null;
    function handleSearchBack() {
      if (showPlaylistDialog.value) {
        closePlaylistDialog();
        return true;
      }
      if (isMenuOpen.value) {
        isMenuOpen.value = false;
        return true;
      }
      if (selectionStore.currentPage === "search-view" && selectionStore.isModeActive) {
        void closeMode();
        return true;
      }
      return false;
    }
    function ensureSearchBackHandler() {
      if (typeof unregisterSearchBackHandler === "function") return;
      unregisterSearchBackHandler = registerBackHandler(handleSearchBack);
    }
    function removeSearchBackHandler() {
      if (typeof unregisterSearchBackHandler !== "function") return;
      unregisterSearchBackHandler();
      unregisterSearchBackHandler = null;
    }
    const biliMode = ref(false);
    const downloadStatus = ref(/* @__PURE__ */ new Map());
    let exitLongPressTimer = null;
    let unsubscribeBiliDownload = null;
    const isSearchViewActive = ref(false);
    const isAwaitingAsyncSearch = ref(false);
    const searchLoadingHint = ref("");
    const searchPage = ref(1);
    const searchHasMore = ref(false);
    const searchResultTotal = ref(0);
    const searchRunSeed = ref("");
    function normalizeSearchKeyword(value) {
      return typeof value === "string" ? value.trim() : "";
    }
    function createSearchRunSeed() {
      return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
    }
    function normalizePageNumber(value) {
      const n = Number(value);
      return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
    }
    function applySearchPageMeta(payload = {}, songs = [], fallbackPage = 1) {
      const pageSize = normalizePageNumber(payload.pageSize || payload.limit || SEARCH_PAGE_SIZE);
      searchPage.value = normalizePageNumber(payload.page || fallbackPage);
      searchResultTotal.value = Number.isFinite(Number(payload.resultCount)) ? Math.max(0, Number(payload.resultCount)) : Array.isArray(songs) ? songs.length : 0;
      searchHasMore.value = typeof payload.hasMore === "boolean" ? payload.hasMore : Array.isArray(songs) && songs.length >= Math.min(pageSize, SEARCH_PAGE_SIZE);
    }
    function resetSearchPagingState() {
      searchPage.value = 1;
      searchHasMore.value = false;
      searchResultTotal.value = 0;
    }
    const showSearchPagination = computed(() => {
      return !biliMode.value && hasSearched.value && !isLoading.value && !searchError.value && (searchResults.value.length > 0 || searchPage.value > 1);
    });
    const ordinarySearchResultTotal = computed(() => {
      const total = Number(searchResultTotal.value);
      return Number.isFinite(total) && total > 0 ? Math.max(0, Math.floor(total)) : searchResults.value.length;
    });
    const isPagedLocalSearchResult = computed(() => {
      return showSearchPagination.value && ordinarySearchResultTotal.value > searchResults.value.length;
    });
    computed(() => {
      const parts = [`第 ${searchPage.value} 页`, `每页 ${SEARCH_PAGE_SIZE} 首`];
      if (isPagedLocalSearchResult.value) {
        parts.push(`共 ${ordinarySearchResultTotal.value} 首`);
      }
      return parts.join(" · ");
    });
    const searchTotalPages = computed(() => {
      const total = ordinarySearchResultTotal.value;
      if (total <= 0) return 1;
      return Math.ceil(total / SEARCH_PAGE_SIZE);
    });
    function sortSearchResultsIfNeeded(songs, { preserveBackendOrder = false } = {}) {
      if (!Array.isArray(songs) || songs.length < 2) return Array.isArray(songs) ? songs : [];
      if (preserveBackendOrder) return songs;
      const hasOrderKey = songs.some((song) => song?.sort_order != null || song?.order != null);
      if (!hasOrderKey) return songs;
      return [...songs].sort((a, b) => {
        const ak = a?.sort_order ?? a?.order;
        const bk = b?.sort_order ?? b?.order;
        if (ak != null || bk != null) return compareOrderKeysDesc(ak, bk, 3);
        return 0;
      });
    }
    function ensureSearchFeaturePermission() {
      if (isSkinSandboxSearch.value) return true;
      const granted = ensureAndroidFeaturePermission("search_music");
      if (!granted) {
        toastMessage.value = "请先授权存储权限后，再执行搜索。";
        showToast.value = true;
      }
      return granted;
    }
    const shouldHideMiniPlayerOnSearch = computed(() => {
      if (!isSearchViewActive.value) return false;
      const keyword = normalizeSearchKeyword(searchQuery.value);
      if (!keyword) return false;
      if (isLoading.value) return true;
      const lastKeyword = normalizeSearchKeyword(lastSearchQuery.value);
      return !hasSearched.value || lastKeyword !== keyword;
    });
    const searchSongListStyle = computed(() => ({
      flex: "1",
      minHeight: "0",
      paddingBottom: "0px"
    }));
    const searchResultItemHeight = computed(() => {
      const skinHeight = searchSongItemSkin.value?.enabled ? Number(searchSongItemSkin.value?.itemHeight || 83) : 83;
      const baseHeight = Number.isFinite(skinHeight) ? skinHeight : 83;
      const skinGap = Number(searchPageSkin.value?.listGap || 8);
      const listGap = Number.isFinite(skinGap) ? skinGap : 8;
      return (biliMode.value ? Math.max(92, baseHeight) : baseHeight) + listGap;
    });
    watch(shouldHideMiniPlayerOnSearch, (hidden) => {
      if (hidden) {
        playerStore.holdMiniPlayer("search-keyword-stage");
      } else {
        playerStore.releaseMiniPlayer("search-keyword-stage");
      }
    }, { immediate: true });
    const loadedCovers = ref(/* @__PURE__ */ new Set());
    const loadedAudio = /* @__PURE__ */ new Map();
    const virtualListRange = ref({
      visibleStart: 0,
      visibleEnd: 0,
      overscanStart: 0,
      overscanEnd: 0
    });
    const coverRetryCounter = /* @__PURE__ */ new Map();
    const COVER_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(
      "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 180'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='0%'><stop offset='0%' stop-color='%23f0f2f5'/><stop offset='50%' stop-color='%23e4e6eb'/><stop offset='100%' stop-color='%23f0f2f5'/></linearGradient></defs><rect width='320' height='180' fill='url(%23g)'/></svg>"
    )}`;
    function getSongKey(song) {
      if (!song || typeof song !== "object") return "";
      return song.hash_id || song.id || song.url || "";
    }
    function getVirtualSearchItemKey(item, index) {
      return getSongKey(item) || `search-row-${index}`;
    }
    const currentTrackKey = computed(() => {
      return playerStore.currentHashId || getSongKey(playerStore.currentTrack) || "";
    });
    computed(() => {
      const total = searchResults.value.length;
      if (total === 0) {
        return {
          start: 0,
          end: 0,
          items: []
        };
      }
      const overscanStart = Math.max(0, Math.min(virtualListRange.value.overscanStart || 0, total));
      const overscanEnd = Math.max(
        overscanStart + 1,
        Math.min(virtualListRange.value.overscanEnd || renderSegmentSize, total)
      );
      const segmentStart = Math.floor(overscanStart / renderSegmentSize) * renderSegmentSize;
      const segmentEnd = Math.max(
        segmentStart + renderSegmentSize,
        Math.ceil(overscanEnd / renderSegmentSize) * renderSegmentSize
      );
      const start = Math.max(0, segmentStart - preloadAbove);
      const end = Math.min(total, segmentEnd + preloadBelow);
      return {
        start,
        end,
        items: searchResults.value.slice(start, end)
      };
    });
    function getCoverHint(song) {
      return getTrustedBiliApiCoverUrl(song);
    }
    function appendCoverRetryQuery(src, retryCount) {
      if (!src || retryCount <= 0) return src;
      const joinChar = src.includes("?") ? "&" : "?";
      return `${src}${joinChar}retry=${retryCount}&ts=${Date.now()}`;
    }
    function getRandomCoverSrc(song) {
      const seed = getSongKey(song) || Math.random().toString(36).slice(2);
      return `/api/cover/random?seed=${encodeURIComponent(seed)}`;
    }
    function shouldLoadSearchCover(index) {
      const total = searchResults.value.length;
      if (!Number.isInteger(index) || index < 0 || index >= total) return false;
      const visibleStart = Math.max(0, virtualListRange.value.visibleStart || 0);
      const visibleEnd = Math.max(
        visibleStart + 1,
        Math.min(total, virtualListRange.value.visibleEnd || renderSegmentSize)
      );
      const preloadStart = Math.max(0, visibleStart - coverPreloadBehind);
      const preloadEnd = Math.min(total, visibleEnd + coverPreloadAhead);
      return index >= preloadStart && index < preloadEnd;
    }
    function getSearchCoverRequestSrc(song, retryCount = 0) {
      if (!song || typeof song !== "object") return COVER_PLACEHOLDER;
      const userCoverPath = song.cover_user_path;
      if (userCoverPath) {
        return appendCoverRetryQuery(userCoverPath.replace(/^http:/i, "https:"), retryCount);
      }
      const hashId = getSongKey(song);
      if (!hashId) {
        const directCover = getCoverHint(song);
        return appendCoverRetryQuery(directCover || COVER_PLACEHOLDER, retryCount);
      }
      const params = ["scope=search"];
      const biliVideoUrl = getBiliVideoUrl(song);
      if (biliVideoUrl) {
        params.push(`url=${encodeURIComponent(biliVideoUrl)}`);
      }
      return appendCoverRetryQuery(`/api/cover/${hashId}?${params.join("&")}`, retryCount);
    }
    function getBiliSearchCoverSrc(video, index) {
      const hashId = video.hashId || video.id || "";
      if (!hashId) {
        return video.cover || COVER_PLACEHOLDER;
      }
      const params = ["scope=search"];
      const biliVideoUrl = video.url || "";
      if (biliVideoUrl) {
        params.push(`url=${encodeURIComponent(biliVideoUrl)}`);
      }
      if (video.cover || video.pic) {
        const coverUrl = video.cover || video.pic;
        params.push(`bpic=${encodeURIComponent(coverUrl)}`);
      }
      return appendCoverRetryQuery(`/api/cover/${hashId}?${params.join("&")}`, 0);
    }
    function handleCoverError(event, video, index) {
      console.warn("[SearchView] 封面加载失败:", video.hashId || video.id, event.target.src);
      if (index < 3) {
        setTimeout(() => {
          event.target.src = getBiliSearchCoverSrc(video);
        }, 1e3);
      }
    }
    function getSearchCoverSrc(song, index) {
      return getSearchCoverRequestSrc(song);
    }
    function preloadInitialCovers(songs) {
      const count = Math.min(5, songs.length);
      for (let i = 0; i < count; i++) {
        const song = songs[i];
        const key = getSongKey(song);
        if (key && !loadedCovers.value.has(key)) {
          loadCover(key).catch(() => {
          });
        }
      }
    }
    function handleOfficialCoverError(song, index, event) {
      const key = getSongKey(song);
      if (key) loadedCovers.value.add(key);
      const target = event?.target;
      if (!target) return;
      const retryCount = key ? coverRetryCounter.get(key) || 0 : 0;
      if (key && retryCount < 1) {
        const nextRetry = retryCount + 1;
        coverRetryCounter.set(key, nextRetry);
        target.src = getSearchCoverRequestSrc(song, nextRetry);
        return;
      }
      if (key && retryCount < 2) {
        const nextRetry = retryCount + 1;
        coverRetryCounter.set(key, nextRetry);
        window.setTimeout(() => {
          if (!isSearchViewActive.value || !target.isConnected) return;
          if (!shouldLoadSearchCover(index)) {
            target.src = COVER_PLACEHOLDER;
            return;
          }
          target.src = getSearchCoverRequestSrc(song, nextRetry);
        }, coverRetryDelayMs);
        return;
      }
      target.onerror = null;
      target.src = getRandomCoverSrc(song);
    }
    function resetSearchVirtualWindow() {
      const initialEnd = Math.min(searchResults.value.length, renderSegmentSize);
      virtualListRange.value = {
        visibleStart: 0,
        visibleEnd: initialEnd,
        overscanStart: 0,
        overscanEnd: initialEnd
      };
    }
    function handleSearchRangeChange(range) {
      const nextRange = {
        visibleStart: range?.visibleStart || 0,
        visibleEnd: range?.visibleEnd || 0,
        overscanStart: range?.overscanStart || 0,
        overscanEnd: range?.overscanEnd || 0
      };
      const currentRange = virtualListRange.value;
      const hasChanged = currentRange.visibleStart !== nextRange.visibleStart || currentRange.visibleEnd !== nextRange.visibleEnd || currentRange.overscanStart !== nextRange.overscanStart || currentRange.overscanEnd !== nextRange.overscanEnd;
      if (!hasChanged) return;
      virtualListRange.value = nextRange;
    }
    watch(
      () => searchResults.value,
      () => {
        resetSearchVirtualWindow();
        nextTick(() => {
          songListContainer.value?.syncScrollState?.();
        });
      },
      { deep: false }
    );
    watch(
      () => biliMode.value,
      () => {
        resetSearchPagingState();
        resetSearchVirtualWindow();
        nextTick(() => {
          songListContainer.value?.syncScrollState?.();
        });
      }
    );
    function resetSearchViewTransientState() {
      isAwaitingAsyncSearch.value = false;
      searchLoadingHint.value = "";
      isLoading.value = false;
      showToast.value = false;
    }
    function getSearchScrollPosition() {
      songListContainer.value?.syncScrollState?.();
      const container = songListContainer.value?.containerRef;
      if (!container) return 0;
      return container.scrollTop || 0;
    }
    function setSearchScrollPosition(scrollPosition = 0) {
      const container = songListContainer.value?.containerRef;
      if (!container) return;
      container.scrollTop = Math.max(0, Number(scrollPosition) || 0);
      songListContainer.value?.syncScrollState?.();
    }
    function saveSearchViewStateToCache() {
      cacheStore.saveSearchState(
        searchQuery.value,
        Array.isArray(searchResults.value) ? searchResults.value : [],
        getSearchScrollPosition(),
        isLoading.value,
        {
          hasSearched: hasSearched.value,
          lastSearchQuery: lastSearchQuery.value,
          biliMode: biliMode.value,
          searchPage: searchPage.value,
          searchHasMore: searchHasMore.value,
          searchResultTotal: searchResultTotal.value,
          searchRunSeed: searchRunSeed.value
        }
      );
    }
    function restoreSearchViewStateFromCache() {
      const cached = cacheStore.getSearchState();
      if (!cached || typeof cached !== "object") return false;
      const hasCachedPayload = Boolean(
        cached.query && cached.query.trim() || Array.isArray(cached.results) && cached.results.length > 0 || cached.hasSearched || cached.lastSearchQuery && cached.lastSearchQuery.trim()
      );
      if (!hasCachedPayload) return false;
      searchQuery.value = cached.query || "";
      searchResults.value = Array.isArray(cached.results) ? cached.results : [];
      hasSearched.value = Boolean(cached.hasSearched);
      lastSearchQuery.value = cached.lastSearchQuery || cached.query || "";
      biliMode.value = Boolean(cached.biliMode);
      searchPage.value = normalizePageNumber(cached.searchPage || 1);
      searchHasMore.value = Boolean(cached.searchHasMore);
      searchResultTotal.value = Number(cached.searchResultTotal) || 0;
      searchRunSeed.value = cached.searchRunSeed || "";
      searchError.value = null;
      isLoading.value = false;
      loadedCovers.value = /* @__PURE__ */ new Set();
      coverRetryCounter.clear();
      loadedAudio.clear();
      resetSearchVirtualWindow();
      nextTick(() => {
        songListContainer.value?.syncScrollState?.();
        setSearchScrollPosition(cached.scrollPosition || 0);
      });
      return true;
    }
    function destroySearchViewState(options = {}) {
      const { clearCache = true } = options;
      resetSearchViewTransientState();
      searchQuery.value = "";
      searchResults.value = [];
      hasSearched.value = false;
      lastSearchQuery.value = "";
      searchError.value = null;
      resetSearchPagingState();
      searchRunSeed.value = "";
      loadedCovers.value = /* @__PURE__ */ new Set();
      coverRetryCounter.clear();
      loadedAudio.clear();
      resetSearchVirtualWindow();
      if (clearCache) {
        cacheStore.clearSearchState();
      }
    }
    function teardownSearchViewEventBindings() {
      unsubscribeBiliDownload?.();
      unsubscribeBiliDownload = null;
    }
    function handleBiliDownloadEvent(event) {
      if (!isSearchViewActive.value || !event || !event.url) return;
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
          toastMessage.value = `❌ 下载失败: ${event.message}`;
          showToast.value = true;
        }
      }
    }
    function applyLocalSearchPage(payload, targetPage, cacheParams) {
      const songs = sortSearchResultsIfNeeded(payload?.songs || [], {
        preserveBackendOrder: payload?.fromLocal === true
      });
      searchResults.value = songs;
      applySearchPageMeta(payload, songs, targetPage);
      loadedCovers.value.clear();
      coverRetryCounter.clear();
      loadedAudio.clear();
      hasSearched.value = true;
      searchError.value = null;
      nextTick(() => {
        preloadInitialCovers(songs);
        setSearchScrollPosition(getCachedLocalSearchScroll(cacheParams));
      });
      businessMachine.transition("SUCCESS");
    }
    let searchPrefetchGeneration = 0;
    let searchPrefetchTimer = 0;
    function scheduleAdjacentSearchPrefetch(keyword, page, seed, hasMore) {
      const generation = ++searchPrefetchGeneration;
      if (searchPrefetchTimer) window.clearTimeout(searchPrefetchTimer);
      searchPrefetchTimer = window.setTimeout(async () => {
        searchPrefetchTimer = 0;
        const targets = [];
        if (hasMore) targets.push(page + 1);
        if (page > 1) targets.push(page - 1);
        for (const targetPage of targets) {
          if (generation !== searchPrefetchGeneration || !isSearchViewActive.value) return;
          await prefetchLocalSearchPage({
            keyword,
            page: targetPage,
            limit: SEARCH_PAGE_SIZE,
            seed
          });
        }
      }, 80);
    }
    const performSearch = async (options = {}) => {
      const keyword = normalizeSearchKeyword(searchQuery.value);
      if (!keyword) {
        searchResults.value = [];
        hasSearched.value = false;
        searchError.value = null;
        isLoading.value = false;
        resetSearchPagingState();
        return;
      }
      if (!ensureSearchFeaturePermission()) {
        return;
      }
      isAwaitingAsyncSearch.value = false;
      searchLoadingHint.value = "";
      searchPrefetchGeneration += 1;
      try {
        const targetPage = normalizePageNumber(options.page || 1);
        const canReuseSeed = options.keepSeed === true && searchRunSeed.value && normalizeSearchKeyword(lastSearchQuery.value) === keyword;
        if (!canReuseSeed) {
          searchRunSeed.value = createSearchRunSeed();
        }
        const localSearchParams = {
          keyword,
          page: targetPage,
          limit: SEARCH_PAGE_SIZE,
          seed: searchRunSeed.value
        };
        if (!biliMode.value) {
          const cachedPage = getCachedLocalSearchPage(localSearchParams);
          if (cachedPage) {
            lastSearchQuery.value = keyword;
            searchPage.value = targetPage;
            applyLocalSearchPage(cachedPage, targetPage, localSearchParams);
            isLoading.value = false;
            scheduleAdjacentSearchPrefetch(
              keyword,
              targetPage,
              searchRunSeed.value,
              Boolean(cachedPage.hasMore)
            );
            return;
          }
        }
        isLoading.value = true;
        businessMachine.transition("SEARCH");
        searchError.value = null;
        lastSearchQuery.value = keyword;
        searchPage.value = targetPage;
        if (biliMode.value) {
          const response = await apiRequest(`/api/bili-search?q=${encodeURIComponent(keyword)}`);
          if (response.ok) {
            const data = await response.json();
            if (!data.success && data.error) {
              throw createError("BILI_BUSINESS_ERROR", data.error, data);
            }
            const videos = (data.videos || []).map((v) => ({ ...v, play: formatPlayCount(v.play) }));
            searchResults.value = videos;
            resetSearchPagingState();
            loadedCovers.value.clear();
            coverRetryCounter.clear();
            loadedAudio.clear();
            hasSearched.value = true;
            businessMachine.transition("SUCCESS");
          } else if (response.status === 401) {
            const data = await response.json().catch(() => ({}));
            throw createError("BILI_AUTH_ERROR", "需要登录Bilibili账号才能搜索视频", data);
          } else if (response.status === 403) {
            const data = await response.json().catch(() => ({}));
            throw createError("BILI_BLOCKED_ERROR", "Bilibili检测到异常请求，暂时拒绝访问", data);
          } else if (response.status >= 500) {
            throw createError("API_ERROR", `后端服务器错误 (${response.status})`, { status: response.status, mode: "bilibili" });
          } else {
            const data = await response.json().catch(() => ({}));
            throw createError("BILI_API_ERROR", data.message || `Bilibili搜索请求失败 (${response.status})`, data);
          }
        } else {
          isAwaitingAsyncSearch.value = true;
          const data = await searchLocalPage(localSearchParams, {
            onPending(pending) {
              searchLoadingHint.value = pending.message || "";
              if (pending.searchDbImportInProgress) {
                toastMessage.value = pending.message || "正在初始化搜索库，完成后会自动返回结果";
                showToast.value = true;
              }
            }
          });
          applyLocalSearchPage(data, targetPage, localSearchParams);
          scheduleAdjacentSearchPrefetch(
            keyword,
            targetPage,
            searchRunSeed.value,
            Boolean(data.hasMore)
          );
        }
      } catch (error) {
        console.error("搜索错误:", error);
        searchResults.value = [];
        hasSearched.value = true;
        businessMachine.transition("ERROR", { message: error?.message || "搜索失败" });
        if (error.type) {
          searchError.value = error;
        } else if (`${error?.message || ""}`.includes("Failed to fetch") || `${error?.message || ""}`.includes("NetworkError")) {
          searchError.value = createError(
            "NETWORK_ERROR",
            "网络连接失败，请检查网络设置",
            error
          );
        } else {
          searchError.value = createError(
            "UNKNOWN_ERROR",
            "搜索失败：" + error.message,
            error
          );
        }
      } finally {
        isAwaitingAsyncSearch.value = false;
        searchLoadingHint.value = "";
        isLoading.value = false;
      }
    };
    function createError(type, message, details = null) {
      const errorTypes = {
        NETWORK_ERROR: {
          title: "网络连接失败",
          icon: "🌐",
          suggestion: "请检查您的网络连接后重试"
        },
        API_ERROR: {
          title: "服务器错误",
          icon: "🔌",
          suggestion: "后端服务器可能暂时不可用，请稍后重试"
        },
        // Bilibili 专项错误
        BILI_AUTH_ERROR: {
          title: "Bilibili 账号未授权",
          icon: "🔐",
          suggestion: "需要登录Bilibili账号才能搜索视频。请前往【账号】页面进行授权登录。"
        },
        BILI_BLOCKED_ERROR: {
          title: "Bilibili 请求被拒绝",
          icon: "🚫",
          suggestion: "Bilibili检测到频繁请求或异常访问，暂时拒绝了本次搜索。这是B站的反爬虫保护机制，请等待几分钟后重试，或尝试更换关键词搜索。"
        },
        BILI_API_ERROR: {
          title: "Bilibili 搜索失败",
          icon: "📺",
          suggestion: "Bilibili搜索接口返回错误，可能是B站服务问题。建议稍后重试或更换关键词。"
        },
        BILI_BUSINESS_ERROR: {
          title: "Bilibili 业务错误",
          icon: "⚙️",
          suggestion: "Bilibili搜索功能执行出错，请检查授权状态或联系管理员"
        },
        BILI_NO_RESULTS: {
          title: "未找到相关视频",
          icon: "🔍",
          suggestion: "Bilibili官方搜索接口未返回符合条件的视频结果。建议：1) 尝试更换关键词；2) 检查拼写是否正确；3) 使用更通用的搜索词。"
        },
        // 音乐搜索专项错误
        MUSIC_API_ERROR: {
          title: "音乐搜索失败",
          icon: "🎵",
          suggestion: "音乐库搜索接口返回错误，请稍后重试"
        },
        MUSIC_BUSINESS_ERROR: {
          title: "音乐搜索错误",
          icon: "⚙️",
          suggestion: "音乐搜索功能执行出错，请联系管理员"
        },
        UNKNOWN_ERROR: {
          title: "未知错误",
          icon: "❌",
          suggestion: "发生未知错误，请重试"
        }
      };
      const config = errorTypes[type] || errorTypes.UNKNOWN_ERROR;
      return {
        type,
        title: config.title,
        message: message || config.suggestion,
        icon: config.icon,
        details: details ? JSON.stringify(details, null, 2) : null
      };
    }
    const retrySearch = () => {
      searchError.value = null;
      if (lastSearchQuery.value) {
        searchQuery.value = lastSearchQuery.value;
        performSearch();
      }
    };
    function goToSearchPage(page) {
      const targetPage = normalizePageNumber(page);
      if (targetPage === searchPage.value || targetPage < 1) return;
      if (targetPage > searchPage.value && !searchHasMore.value) return;
      saveCachedLocalSearchScroll({
        keyword: normalizeSearchKeyword(lastSearchQuery.value),
        page: searchPage.value,
        limit: SEARCH_PAGE_SIZE,
        seed: searchRunSeed.value
      }, getSearchScrollPosition());
      performSearch({ page: targetPage, keepSeed: true });
    }
    function formatPlayCount(num) {
      if (num >= 1e8) return (num / 1e8).toFixed(1) + "亿";
      if (num >= 1e4) return (num / 1e4).toFixed(1) + "万";
      return num;
    }
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
      const taskStatus = downloadTaskStore.getTaskStatusByUrl(url);
      return mapTaskStatusToUiStatus(taskStatus);
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
          return "下载完成";
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
        if (status === "downloading") {
          statusData.timer = setTimeout(() => {
            console.log("下载超时，自动恢复:", url);
            setDownloadStatus(url, "idle");
          }, 5e3);
        } else if (status === "success" || status === "failed" || status === "skipped") {
          statusData.timer = setTimeout(() => {
            setDownloadStatus(url, "idle");
          }, 2e3);
        }
        downloadStatus.value.set(url, statusData);
      }
    }
    function normalizeMetaText(value) {
      if (value === null || value === void 0) return "";
      const text = `${value}`.trim();
      if (!text) return "";
      const lower = text.toLowerCase();
      if (lower === "null" || lower === "undefined") return "";
      return text;
    }
    function buildSearchDownloadMeta(video) {
      const producer = normalizeMetaText(
        video?.producer || video?.uploader || video?.author || ""
      );
      const sourceArtist = normalizeMetaText(video?.artist || "");
      const isBiliSearch = Boolean(biliMode.value);
      const normalizedArtist = isBiliSearch ? "" : sourceArtist && sourceArtist === producer ? "" : sourceArtist;
      return {
        artist: normalizedArtist,
        producer,
        uploader: producer,
        author: producer
      };
    }
    function toSearchTaskVideo(video) {
      return {
        ...video,
        ...buildSearchDownloadMeta(video)
      };
    }
    function enqueueSingleDownload(video) {
      if (!video?.url) return;
      if (isDownloading(video.url)) return;
      const result = downloadTaskStore.enqueueDownload(toSearchTaskVideo(video), {
        source: "search",
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
      if (navigator.vibrate) {
        navigator.vibrate(35);
      } else if (window.Android?.vibrate) {
        window.Android.vibrate(35);
      }
    }
    function enqueueBatchDownload(selectedIds) {
      if (!Array.isArray(selectedIds) || selectedIds.length === 0) return;
      const videoById = /* @__PURE__ */ new Map();
      searchResults.value.forEach((video) => {
        const key = getSongKey(video);
        if (key && !videoById.has(key)) {
          videoById.set(key, video);
        }
      });
      const selectedVideos = selectedIds.map((id) => videoById.get(id)).filter(Boolean);
      if (selectedVideos.length === 0) return;
      const taskVideos = selectedVideos.map((video) => toSearchTaskVideo(video));
      const { taskIds = [] } = downloadTaskStore.enqueueBatch(taskVideos, {
        source: "search",
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
    const loadAudio = (songId) => {
      return new Promise((resolve) => {
        if (loadedAudio.has(songId)) {
          resolve();
          return;
        }
        const song = searchResults.value.find((s) => getSongKey(s) === songId);
        if (!song) {
          resolve();
          return;
        }
        if (window.Android) {
          resolve();
          return;
        }
        fetch(song.src).then(() => {
          loadedAudio.set(songId, true);
          resolve();
        }).catch(() => {
          loadedAudio.set(songId, true);
          resolve();
        });
      });
    };
    const loadCover = (songId) => {
      return new Promise((resolve) => {
        if (loadedCovers.value.has(songId)) {
          resolve();
          return;
        }
        const song = searchResults.value.find((s) => getSongKey(s) === songId);
        if (!song) {
          resolve();
          return;
        }
        const coverUrl = getSearchCoverRequestSrc(song);
        if (!coverUrl) {
          loadedCovers.value.add(songId);
          resolve();
          return;
        }
        if (window.Android) {
          const img = new Image();
          img.onload = () => {
            loadedCovers.value.add(songId);
            resolve();
          };
          img.onerror = () => {
            loadedCovers.value.add(songId);
            resolve();
          };
          img.src = coverUrl;
        } else {
          fetch(coverUrl).then(() => {
            loadedCovers.value.add(songId);
            resolve();
          }).catch(() => {
            loadedCovers.value.add(songId);
            resolve();
          });
        }
      });
    };
    const handleTouchStart = (e, type, id) => {
      const touch = e.touches?.[0];
      if (touch) {
        swipeStartX = touch.clientX;
        swipeStartY = touch.clientY;
        swipeCurrentSong = searchResults.value.find((song) => getSongKey(song) === id);
        swipeVisualSongKey.value = swipeCurrentSong ? getSongKey(swipeCurrentSong) : "";
        swipeOffset.value = 0;
        isSwipeGesture = false;
      }
      if (selectionStore.isModeActive) {
        exitLongPressTimer = setTimeout(() => {
          closeMode();
          if (window.navigator.vibrate) window.navigator.vibrate(20);
        }, 800);
      }
      originalTouchStart(e, type, id);
    };
    const handleTouchMoveWrapped = (e) => {
      if (!selectionStore.isModeActive && swipeCurrentSong) {
        const touch = e.touches?.[0];
        if (touch) {
          const deltaX = touch.clientX - swipeStartX;
          const deltaY = Math.abs(touch.clientY - swipeStartY);
          const hasSwipeIntent = deltaX < -16 && Math.abs(deltaX) > deltaY * HORIZONTAL_INTENT_RATIO;
          if (hasSwipeIntent) {
            if (!isSwipeGesture) {
              isSwipeGesture = true;
              originalTouchEnd(e);
            }
            e.preventDefault();
            setSwipeOffsetSmooth(Math.max(Math.min(deltaX, 0), -160));
            return;
          }
        }
      }
      handleTouchMove(e);
    };
    const handleTouchEnd = (e) => {
      clearTimeout(exitLongPressTimer);
      if (!selectionStore.isModeActive && swipeCurrentSong && isSwipeGesture) {
        const touch = e.changedTouches?.[0];
        if (touch) {
          const deltaX = touch.clientX - swipeStartX;
          const deltaY = Math.abs(touch.clientY - swipeStartY);
          if (deltaX < -80 && Math.abs(deltaX) > deltaY * 1.5) {
            console.log("[SearchView] 检测到左滑手势，插入下一首:", swipeCurrentSong.title);
            handleSwipeInsertNext(swipeCurrentSong);
            isSwipeGesture = false;
            cancelSwipeFrame();
            swipeOffset.value = -160;
            window.setTimeout(() => {
              clearSwipeVisual();
            }, 300);
            if (window.navigator.vibrate) {
              window.navigator.vibrate(30);
            }
          } else {
            isSwipeGesture = false;
            cancelSwipeFrame();
            swipeOffset.value = 0;
            window.setTimeout(() => {
              clearSwipeVisual();
            }, 300);
          }
        } else {
          clearSwipeVisual();
        }
      } else {
        clearSwipeVisual();
      }
      originalTouchEnd(e);
    };
    async function loadExistingPlaylists() {
      try {
        const response = await apiRequest("/api/playlists");
        if (response.ok) {
          const data = await response.json();
          existingPlaylists.value = (data.playlists || []).filter((p) => p.isCustom === true);
          console.log("✅ 加载歌单列表成功:", existingPlaylists.value.length, "个");
        } else {
          const errData = await response.json().catch(() => ({}));
          console.error("加载歌单列表失败", response.status, errData);
          existingPlaylists.value = [];
        }
      } catch (error) {
        console.error("加载歌单列表错误:", error);
        existingPlaylists.value = [];
      }
    }
    function normalizeNetworkCoverHint(raw) {
      if (typeof raw !== "string") return "";
      const value = raw.trim();
      if (!value || value === "null") return "";
      if (/^https?:\/\//i.test(value)) return value.replace(/^http:/i, "https:");
      if (value.startsWith("//")) return `https:${value}`;
      return "";
    }
    function pickAnyNetworkCover(song) {
      if (!song || typeof song !== "object") return "";
      const candidates = [
        song?.cover_bili_url,
        song?.pic,
        song?.cover
      ];
      for (const raw of candidates) {
        const normalized = normalizeNetworkCoverHint(raw);
        if (normalized) return normalized;
      }
      return "";
    }
    function buildSongHintsByIds(songIds) {
      if (!Array.isArray(songIds) || songIds.length === 0) return [];
      const songById = /* @__PURE__ */ new Map();
      searchResults.value.forEach((song) => {
        const key = getSongKey(song);
        if (key && !songById.has(key)) {
          songById.set(key, song);
        }
      });
      return songIds.map((songId) => {
        const hashId = `${songId || ""}`.trim();
        if (!hashId) return null;
        const song = songById.get(hashId);
        if (!song) {
          return {
            hash_id: hashId,
            id: hashId,
            source_type: "official_search"
          };
        }
        const biliUrl = getBiliVideoUrl(song) || song?.url || "";
        const trustedCover = getTrustedBiliApiCoverUrl(song) || "";
        const fallbackNetworkCover = pickAnyNetworkCover(song);
        const networkCover = trustedCover || fallbackNetworkCover;
        const apiCover = getSongCoverSrc(song, { search: true }) || "";
        const meta = buildSearchDownloadMeta(song);
        return {
          hash_id: hashId,
          id: hashId,
          title: song?.title || "",
          artist: meta.artist,
          author: meta.author,
          producer: meta.producer,
          uploader: meta.uploader,
          bvid: song?.bvid || "",
          url: biliUrl,
          cover_bili_url: networkCover,
          pic: networkCover,
          cover: networkCover || apiCover,
          source_type: "official_search"
        };
      }).filter(Boolean);
    }
    async function addToExistingPlaylist(playlistId) {
      if (selectedSongIds.value.length === 0) {
        showGlobalToast("请先选择歌曲", { type: "warning" });
        return;
      }
      try {
        const payload = {
          playlistId,
          hashIds: selectedSongIds.value,
          songHints: buildSongHintsByIds(selectedSongIds.value)
        };
        console.log("📤 发送添加到歌单请求:", payload);
        const response = await apiRequest("/api/playlist/batch-add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload
        });
        if (response.ok) {
          const playlist = existingPlaylists.value.find((p) => p.id === playlistId);
          showGlobalToast(`✅ 已添加 ${selectedSongIds.value.length} 首歌曲到歌单《${playlist?.name || "歌单"}》`);
          emitPlaylistContentUpdated(playlistId, "search-batch-add");
          closePlaylistDialog();
          await closeMode(true);
        } else {
          const errData = await response.json().catch(() => ({}));
          showGlobalToast("❌ 添加到歌单失败：" + (errData.error || errData.message || `HTTP ${response.status}`), { type: "error" });
        }
      } catch (error) {
        console.error("添加到歌单错误:", error);
        showGlobalToast("❌ 添加到歌单出错: " + error.message, { type: "error" });
      }
    }
    async function createNewPlaylist() {
      const playlistName = newPlaylistName.value.trim();
      if (!playlistName) {
        showGlobalToast("请输入歌单名称", { type: "warning" });
        return;
      }
      if (selectedSongIds.value.length === 0) {
        showGlobalToast("请先选择歌曲", { type: "warning" });
        return;
      }
      try {
        const firstSongIndex = searchResults.value.findIndex((song) => selectedSongIds.value.includes(getSongKey(song)));
        const firstSong = searchResults.value[firstSongIndex];
        const coverUrl = getSongCoverSrc(firstSong);
        const payload = {
          playlistName,
          coverUrl,
          songIds: selectedSongIds.value,
          songHints: buildSongHintsByIds(selectedSongIds.value)
        };
        console.log("📤 发送创建歌单请求:", payload);
        const response = await apiRequest("/api/playlist/custom/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload
        });
        if (response.ok) {
          showGlobalToast(`✅ 已创建歌单《${playlistName}》并添加 ${selectedSongIds.value.length} 首歌曲`);
          closePlaylistDialog();
          await closeMode(true);
        } else {
          const errData = await response.json().catch(() => ({}));
          showGlobalToast("❌ 创建歌单失败：" + (errData.error || errData.message || `HTTP ${response.status}`), { type: "error" });
        }
      } catch (error) {
        console.error("创建歌单错误:", error);
        showGlobalToast("❌ 创建歌单出错: " + error.message, { type: "error" });
      }
    }
    function closePlaylistDialog() {
      newPlaylistName.value = "";
      showPlaylistDialog.value = false;
      selectedSongIds.value = [];
    }
    function playSongFromSearch(song, index) {
      playerStore.playWithContext(searchResults.value, index, {
        transient: false,
        source: "search",
        triggerSource: "manual_user",
        chunked: true,
        hugeListThreshold: 260
      });
      const songId = getSongKey(song);
      Promise.all([
        loadAudio(songId),
        loadCover(songId)
      ]).then(() => {
        const before = 2;
        const after = 5;
        const preloadStart = Math.max(0, index - before);
        const preloadEnd = Math.min(searchResults.value.length - 1, index + after);
        for (let i = preloadStart; i <= preloadEnd; i++) {
          if (i !== index) {
            const neighborSong = searchResults.value[i];
            const neighborId = getSongKey(neighborSong);
            loadAudio(neighborId);
            loadCover(neighborId);
          }
        }
      });
    }
    const handleSongClick = async (song, index) => {
      const songId = getSongKey(song);
      if (selectionStore.isModeActive) {
        selectionStore.toggleItem(songId);
        return;
      }
      console.log(`🎵 用户点击: ${song.title} (索引: ${index})`);
      playSongFromSearch(song, index);
    };
    onBeforeUnmount(() => {
      removeSearchBackHandler();
      const shouldPreserveForTempRoute = cacheStore.routeNavigation?.direction === "temp" && cacheStore.routeNavigation?.restoreKey === pageLifecycle.pageKey;
      const shouldClearCache = !shouldPreserveForTempRoute;
      if (shouldPreserveForTempRoute) {
        saveSearchViewStateToCache();
      }
      isSearchViewActive.value = false;
      playerStore.releaseMiniPlayer("search-keyword-stage");
      destroySearchViewState({ clearCache: shouldClearCache });
      teardownSearchViewEventBindings();
    });
    return (_ctx, _cache) => {
      const _component_Toast = resolveComponent("Toast");
      const _directive_marquee = resolveDirective("marquee");
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createVNode(_component_Toast, {
          visible: showToast.value,
          message: toastMessage.value,
          duration: 2e3,
          onHide: _cache[0] || (_cache[0] = ($event) => showToast.value = false)
        }, null, 8, ["visible", "message"]),
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("div", _hoisted_3, [
            withDirectives(createBaseVNode("input", {
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => searchQuery.value = $event),
              type: "text",
              class: "search-input",
              placeholder: "搜索歌曲、艺术家...",
              onKeyup: withKeys(performSearch, ["enter"])
            }, null, 544), [
              [vModelText, searchQuery.value]
            ]),
            createBaseVNode("button", {
              class: "search-btn",
              onClick: performSearch,
              disabled: !searchQuery.value.trim()
            }, " 搜索 ", 8, _hoisted_4),
            createBaseVNode("label", {
              class: normalizeClass(["bili-mode-switch", { active: biliMode.value }])
            }, [
              withDirectives(createBaseVNode("input", {
                type: "checkbox",
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => biliMode.value = $event)
              }, null, 512), [
                [vModelCheckbox, biliMode.value]
              ]),
              _cache[14] || (_cache[14] = createBaseVNode("span", null, "Bilibili专项", -1))
            ], 2)
          ])
        ]),
        createVNode(Transition, { name: "search-loading-fade" }, {
          default: withCtx(() => [
            isLoading.value ? (openBlock(), createElementBlock("div", _hoisted_5, [
              _cache[15] || (_cache[15] = createBaseVNode("span", { class: "spinner" }, null, -1)),
              createBaseVNode("p", null, toDisplayString(isAwaitingAsyncSearch.value ? searchLoadingHint.value || "正在检索本地数据库..." : "搜索中..."), 1),
              isAwaitingAsyncSearch.value ? (openBlock(), createElementBlock("p", _hoisted_6, "首次安装会在后台初始化搜索库并建立索引，完成后自动返回结果")) : createCommentVNode("", true)
            ])) : createCommentVNode("", true)
          ]),
          _: 1
        }),
        searchError.value && !isLoading.value ? (openBlock(), createElementBlock("div", _hoisted_7, [
          _cache[17] || (_cache[17] = createBaseVNode("div", { class: "error-icon" }, "⚠️", -1)),
          createBaseVNode("div", _hoisted_8, [
            createBaseVNode("h3", null, toDisplayString(searchError.value.title), 1),
            createBaseVNode("p", null, toDisplayString(searchError.value.message), 1),
            searchError.value.details ? (openBlock(), createElementBlock("div", _hoisted_9, [
              createBaseVNode("details", null, [
                _cache[16] || (_cache[16] = createBaseVNode("summary", null, "详细信息", -1)),
                createBaseVNode("pre", null, toDisplayString(searchError.value.details), 1)
              ])
            ])) : createCommentVNode("", true),
            createBaseVNode("button", {
              class: "retry-btn",
              onClick: retrySearch
            }, "重试")
          ])
        ])) : createCommentVNode("", true),
        hasSearched.value && !isLoading.value && !searchError.value ? (openBlock(), createElementBlock("div", _hoisted_10, [
          !biliMode.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
            searchResults.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_11, [
              createBaseVNode("div", _hoisted_12, [
                createBaseVNode("div", _hoisted_13, [
                  isPagedLocalSearchResult.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                    _cache[18] || (_cache[18] = createTextVNode(" 共 ", -1)),
                    createBaseVNode("strong", null, toDisplayString(ordinarySearchResultTotal.value), 1),
                    _cache[19] || (_cache[19] = createTextVNode(" 首，本页 ", -1)),
                    createBaseVNode("strong", null, toDisplayString(searchResults.value.length), 1),
                    _cache[20] || (_cache[20] = createTextVNode(" 首 ", -1))
                  ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                    _cache[21] || (_cache[21] = createTextVNode(" 找到 ", -1)),
                    createBaseVNode("strong", null, toDisplayString(searchResults.value.length), 1),
                    _cache[22] || (_cache[22] = createTextVNode(" 首歌曲 ", -1))
                  ], 64))
                ]),
                showSearchPagination.value ? (openBlock(), createElementBlock("div", _hoisted_14, [
                  createBaseVNode("button", {
                    class: "page-btn page-btn--compact",
                    onClick: _cache[3] || (_cache[3] = ($event) => goToSearchPage(searchPage.value - 1)),
                    disabled: searchPage.value <= 1 || isLoading.value
                  }, "◀", 8, _hoisted_15),
                  createBaseVNode("span", _hoisted_16, toDisplayString(searchPage.value) + " / " + toDisplayString(searchTotalPages.value), 1),
                  createBaseVNode("button", {
                    class: "page-btn page-btn--compact",
                    onClick: _cache[4] || (_cache[4] = ($event) => goToSearchPage(searchPage.value + 1)),
                    disabled: !searchHasMore.value || isLoading.value
                  }, "▶", 8, _hoisted_17)
                ])) : createCommentVNode("", true)
              ]),
              createVNode(ScrollSurface, null, {
                default: withCtx(() => [
                  createVNode(VirtualList, {
                    items: searchResults.value,
                    "retain-text": "",
                    "stable-content": "",
                    "total-items": searchResults.value.length,
                    "base-index": 0,
                    "item-height": searchResultItemHeight.value,
                    buffer: 8,
                    "show-scroll-skeleton": false,
                    "item-key": getVirtualSearchItemKey,
                    ref_key: "songListContainer",
                    ref: songListContainer,
                    class: "search-song-list",
                    style: normalizeStyle(searchSongListStyle.value),
                    onRangeChange: handleSearchRangeChange
                  }, {
                    default: withCtx(({ item: song, index, active, canLoadMedia }) => [
                      createBaseVNode("div", {
                        class: normalizeClass(["song-box", {
                          "is-playing": currentTrackKey.value === getSongKey(song) && !unref(selectionStore).isModeActive,
                          "is-selected": unref(selectionStore).isModeActive && unref(selectionStore).selectedIds.has(getSongKey(song)),
                          "mode-selection": unref(selectionStore).isModeActive,
                          "is-swipe-active": isSwipeVisualSong(song)
                        }]),
                        onClick: ($event) => handleSongClick(song, index),
                        onTouchstartPassive: ($event) => handleTouchStart($event, "song", getSongKey(song)),
                        onTouchmove: handleTouchMoveWrapped,
                        onTouchend: handleTouchEnd,
                        onTouchcancel: handleTouchEnd
                      }, [
                        isSwipeVisualSong(song) ? (openBlock(), createElementBlock("div", {
                          key: 0,
                          class: "insert-background",
                          style: normalizeStyle(getInsertBackgroundStyle(song))
                        }, [
                          createBaseVNode("div", {
                            class: normalizeClass(["insert-icon", { visible: isInsertIconVisible(song), shake: shouldShakeInsertIcon(song) }])
                          }, [..._cache[23] || (_cache[23] = [
                            createBaseVNode("svg", {
                              viewBox: "0 0 24 24",
                              width: "20",
                              height: "20",
                              fill: "none",
                              stroke: "currentColor",
                              "stroke-width": "1.5",
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round"
                            }, [
                              createBaseVNode("polygon", { points: "5 3 19 12 5 21 5 3" })
                            ], -1),
                            createBaseVNode("span", { class: "insert-text" }, "下一首", -1)
                          ])], 2)
                        ], 4)) : createCommentVNode("", true),
                        createBaseVNode("div", {
                          class: "song-content",
                          style: normalizeStyle(getSwipeStyle(song))
                        }, [
                          createBaseVNode("div", _hoisted_19, [
                            active ? (openBlock(), createElementBlock("img", {
                              key: 0,
                              src: getSearchCoverSrc(song, index),
                              alt: song.title,
                              decoding: "async",
                              referrerpolicy: "no-referrer",
                              onLoad: () => loadedCovers.value.add(getSongKey(song)),
                              onError: (e) => handleOfficialCoverError(song, index, e)
                            }, null, 40, _hoisted_20)) : createCommentVNode("", true)
                          ]),
                          createBaseVNode("div", _hoisted_21, [
                            createBaseVNode("div", _hoisted_22, [
                              withDirectives((openBlock(), createElementBlock("p", null, [
                                createTextVNode(toDisplayString(song.title), 1)
                              ])), [
                                [_directive_marquee, canLoadMedia]
                              ])
                            ]),
                            createBaseVNode("div", _hoisted_23, [
                              withDirectives((openBlock(), createElementBlock("p", null, [
                                createTextVNode(toDisplayString(unref(formatArtistProducer)(song)), 1)
                              ])), [
                                [_directive_marquee, canLoadMedia]
                              ])
                            ])
                          ])
                        ], 4)
                      ], 42, _hoisted_18)
                    ]),
                    placeholder: withCtx(() => [..._cache[24] || (_cache[24] = [
                      createBaseVNode("div", {
                        class: "song-box search-song-skeleton-item",
                        "aria-hidden": "true"
                      }, [
                        createBaseVNode("div", { class: "song-content" }, [
                          createBaseVNode("div", { class: "left-box-song search-song-skeleton-cover" }),
                          createBaseVNode("div", { class: "right-box" }, [
                            createBaseVNode("div", { class: "search-song-skeleton-line search-song-skeleton-line-title" }),
                            createBaseVNode("div", { class: "search-song-skeleton-line search-song-skeleton-line-subtitle" })
                          ])
                        ])
                      ], -1)
                    ])]),
                    _: 1
                  }, 8, ["items", "total-items", "item-height", "style"])
                ]),
                _: 1
              }),
              showSearchPagination.value ? (openBlock(), createElementBlock("div", _hoisted_24, [
                createBaseVNode("button", {
                  class: "page-btn",
                  onClick: _cache[5] || (_cache[5] = ($event) => goToSearchPage(searchPage.value - 1)),
                  disabled: searchPage.value <= 1 || isLoading.value
                }, " 上一页 ", 8, _hoisted_25),
                createBaseVNode("span", _hoisted_26, "第 " + toDisplayString(searchPage.value) + " 页", 1),
                createBaseVNode("button", {
                  class: "page-btn",
                  onClick: _cache[6] || (_cache[6] = ($event) => goToSearchPage(searchPage.value + 1)),
                  disabled: !searchHasMore.value || isLoading.value
                }, " 下一页 ", 8, _hoisted_27)
              ])) : createCommentVNode("", true)
            ])) : (openBlock(), createElementBlock("div", _hoisted_28, [
              createBaseVNode("div", _hoisted_29, [
                _cache[25] || (_cache[25] = createBaseVNode("div", { class: "empty-icon" }, "🔍", -1)),
                createBaseVNode("p", null, '未找到关键词 "' + toDisplayString(lastSearchQuery.value) + '" 相关的歌曲', 1),
                _cache[26] || (_cache[26] = createBaseVNode("p", { class: "empty-hint" }, "试试其他关键词吧", -1))
              ])
            ]))
          ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
            searchResults.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_30, [
              createBaseVNode("div", _hoisted_31, [
                createBaseVNode("div", _hoisted_32, [
                  _cache[27] || (_cache[27] = createTextVNode(" 找到 ", -1)),
                  createBaseVNode("strong", null, toDisplayString(searchResults.value.length), 1),
                  _cache[28] || (_cache[28] = createTextVNode(" 个Bilibili视频 ", -1))
                ])
              ]),
              createVNode(ScrollSurface, null, {
                default: withCtx(() => [
                  createVNode(VirtualList, {
                    items: searchResults.value,
                    "retain-text": "",
                    "stable-content": "",
                    "total-items": searchResults.value.length,
                    "base-index": 0,
                    "item-height": searchResultItemHeight.value,
                    buffer: 8,
                    "show-scroll-skeleton": false,
                    "item-key": getVirtualSearchItemKey,
                    ref_key: "songListContainer",
                    ref: songListContainer,
                    class: "search-song-list",
                    style: normalizeStyle(searchSongListStyle.value),
                    onRangeChange: handleSearchRangeChange
                  }, {
                    default: withCtx(({ item: video, index, active, canLoadMedia }) => [
                      createBaseVNode("div", _hoisted_33, [
                        createBaseVNode("div", _hoisted_34, [
                          createBaseVNode("div", _hoisted_35, [
                            createBaseVNode("a", {
                              class: "bili-video-cover-link",
                              href: video.url,
                              target: "_blank",
                              rel: "noopener"
                            }, [
                              active ? (openBlock(), createElementBlock("img", {
                                key: 0,
                                src: getBiliSearchCoverSrc(video, index),
                                alt: video.title,
                                loading: "lazy",
                                decoding: "async",
                                referrerpolicy: "no-referrer",
                                onError: ($event) => handleCoverError($event, video, index)
                              }, null, 40, _hoisted_37)) : createCommentVNode("", true)
                            ], 8, _hoisted_36)
                          ]),
                          createBaseVNode("div", _hoisted_38, [
                            createBaseVNode("div", _hoisted_39, [
                              createBaseVNode("a", {
                                class: "bili-video-title-link",
                                href: video.url,
                                target: "_blank",
                                rel: "noopener"
                              }, [
                                withDirectives((openBlock(), createElementBlock("p", null, [
                                  createTextVNode(toDisplayString(video.title), 1)
                                ])), [
                                  [_directive_marquee, canLoadMedia]
                                ])
                              ], 8, _hoisted_40)
                            ]),
                            createBaseVNode("div", _hoisted_41, [
                              createBaseVNode("div", _hoisted_42, [
                                createBaseVNode("span", null, "作者：" + toDisplayString(video.author), 1),
                                createBaseVNode("span", null, "时长：" + toDisplayString(video.duration), 1),
                                createBaseVNode("span", null, "播放：" + toDisplayString(video.play), 1)
                              ])
                            ])
                          ]),
                          createBaseVNode("div", _hoisted_43, [
                            createBaseVNode("button", {
                              class: "download-btn",
                              onClick: withModifiers(($event) => enqueueSingleDownload(video), ["stop"]),
                              disabled: isDownloading(video.url),
                              title: getDownloadTitle(video.url)
                            }, [
                              getDownloadStatus(video.url) === "downloading" ? (openBlock(), createElementBlock("span", _hoisted_45, "↓")) : getDownloadStatus(video.url) === "success" ? (openBlock(), createElementBlock("span", _hoisted_46, "✓")) : getDownloadStatus(video.url) === "failed" ? (openBlock(), createElementBlock("span", _hoisted_47, "×")) : (openBlock(), createElementBlock("span", _hoisted_48, "↓"))
                            ], 8, _hoisted_44)
                          ])
                        ])
                      ])
                    ]),
                    placeholder: withCtx(() => [..._cache[29] || (_cache[29] = [
                      createBaseVNode("div", {
                        class: "song-box bili-video-box search-song-skeleton-item",
                        "aria-hidden": "true"
                      }, [
                        createBaseVNode("div", { class: "song-content" }, [
                          createBaseVNode("div", { class: "left-box-song search-song-skeleton-cover" }),
                          createBaseVNode("div", { class: "right-box" }, [
                            createBaseVNode("div", { class: "search-song-skeleton-line search-song-skeleton-line-title" }),
                            createBaseVNode("div", { class: "search-song-skeleton-line search-song-skeleton-line-subtitle" })
                          ])
                        ])
                      ], -1)
                    ])]),
                    _: 1
                  }, 8, ["items", "total-items", "item-height", "style"])
                ]),
                _: 1
              })
            ])) : (openBlock(), createElementBlock("div", _hoisted_49, [
              createBaseVNode("div", _hoisted_50, [
                _cache[30] || (_cache[30] = createBaseVNode("div", { class: "empty-icon" }, "📺", -1)),
                createBaseVNode("p", null, '未找到关键词 "' + toDisplayString(lastSearchQuery.value) + '" 相关的Bilibili视频', 1),
                _cache[31] || (_cache[31] = createBaseVNode("p", { class: "empty-hint" }, "筛选条件：Bilibili官方搜索接口", -1)),
                _cache[32] || (_cache[32] = createBaseVNode("p", { class: "empty-hint" }, "建议：尝试更换关键词、检查拼写或使用更通用的搜索词", -1))
              ])
            ]))
          ], 64))
        ])) : !isLoading.value && !searchError.value ? (openBlock(), createElementBlock("div", _hoisted_51, [..._cache[33] || (_cache[33] = [
          createBaseVNode("div", { class: "tips-icon" }, "🔍", -1),
          createBaseVNode("p", null, "输入歌曲名称或艺术家名字进行搜索", -1)
        ])])) : createCommentVNode("", true),
        createVNode(Transition, { name: "fade" }, {
          default: withCtx(() => [
            unref(selectionStore).isModeActive ? (openBlock(), createElementBlock("div", _hoisted_52, [
              createVNode(Transition, { name: "slide-up" }, {
                default: withCtx(() => [
                  isMenuOpen.value ? (openBlock(), createElementBlock("div", _hoisted_53, [
                    createBaseVNode("div", {
                      class: "menu-item",
                      onClick: _cache[7] || (_cache[7] = (...args) => unref(selectAll) && unref(selectAll)(...args))
                    }, "全选"),
                    createBaseVNode("div", {
                      class: "menu-item",
                      onClick: _cache[8] || (_cache[8] = ($event) => unref(handleAction)("batchDownload"))
                    }, "批量下载"),
                    createBaseVNode("div", {
                      class: "menu-item",
                      onClick: _cache[9] || (_cache[9] = ($event) => unref(handleAction)("playNext"))
                    }, "优先播放"),
                    createBaseVNode("div", {
                      class: "menu-item",
                      onClick: _cache[10] || (_cache[10] = ($event) => unref(handleAction)("addToPlaylist"))
                    }, "收藏到歌单"),
                    _cache[34] || (_cache[34] = createBaseVNode("div", { class: "menu-divider" }, null, -1)),
                    createBaseVNode("div", {
                      class: "menu-item cancel",
                      onClick: _cache[11] || (_cache[11] = (...args) => unref(closeMode) && unref(closeMode)(...args))
                    }, "退出选择")
                  ])) : createCommentVNode("", true)
                ]),
                _: 1
              }),
              createBaseVNode("button", {
                class: "fab-main-btn",
                onClick: _cache[12] || (_cache[12] = ($event) => isMenuOpen.value = !isMenuOpen.value)
              }, [
                unref(selectionStore).selectedIds.size > 0 ? (openBlock(), createElementBlock("span", _hoisted_54, toDisplayString(unref(selectionStore).selectedIds.size), 1)) : createCommentVNode("", true),
                _cache[35] || (_cache[35] = createBaseVNode("svg", {
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
            showPlaylistDialog.value ? (openBlock(), createElementBlock("div", _hoisted_55, [
              createBaseVNode("div", _hoisted_56, [
                _cache[37] || (_cache[37] = createBaseVNode("h3", null, "收藏到歌单", -1)),
                createBaseVNode("div", _hoisted_57, [
                  existingPlaylists.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_58, [
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
                        }, null, 8, _hoisted_60),
                        createBaseVNode("div", _hoisted_61, [
                          createBaseVNode("p", _hoisted_62, toDisplayString(pl.name), 1),
                          createBaseVNode("p", _hoisted_63, toDisplayString(pl.count) + " 首", 1)
                        ])
                      ], 8, _hoisted_59);
                    }), 128))
                  ])) : createCommentVNode("", true),
                  createBaseVNode("div", _hoisted_64, [
                    _cache[36] || (_cache[36] = createBaseVNode("p", { class: "create-label" }, "或创建新歌单", -1)),
                    withDirectives(createBaseVNode("input", {
                      "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => newPlaylistName.value = $event),
                      type: "text",
                      placeholder: "请输入歌单名称",
                      maxlength: "30",
                      onKeyup: withKeys(createNewPlaylist, ["enter"])
                    }, null, 544), [
                      [vModelText, newPlaylistName.value]
                    ])
                  ])
                ]),
                createBaseVNode("div", _hoisted_65, [
                  createBaseVNode("button", {
                    class: "btn-cancel",
                    onClick: closePlaylistDialog
                  }, "取消"),
                  createBaseVNode("button", {
                    class: "btn-confirm",
                    onClick: createNewPlaylist,
                    disabled: !newPlaylistName.value.trim()
                  }, "创建", 8, _hoisted_66)
                ])
              ])
            ])) : createCommentVNode("", true)
          ]),
          _: 1
        })
      ]);
    };
  }
});
const SearchView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-35aed256"]]);
export {
  SearchView as default
};
