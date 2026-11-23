const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./PlaylistDetailView.js","./vendor.js","./androidPermission.js","./ScrollSurface.js","./ScrollSurface.css","./PlaylistDetailView.css","./SearchView.js","./SearchView.css","./AccountView.js","./biliAuth.js","./AccountView.css","./ListenStatsView.js","./ListenStatsView.css","./BiliFavoriteView.js","./BiliFavoriteView.css","./UserProfileView.js","./UserProfileView.css","./SkinStudioView.js","./SkinStudioView.css","./MusicControlPage.js","./MusicControlPage.css"])))=>i.map(i=>d[i]);
import { p as defineStore, M as ref, L as readonly, c as computed, a5 as watch, I as openBlock, g as createElementBlock, u as mergeProps, $ as useRouter, _ as useRoute, d as createBaseVNode, l as createVNode, G as onScopeDispose, x as normalizeStyle, a9 as withModifiers, w as normalizeClass, Z as unref, Y as toDisplayString, E as onMounted, H as onUnmounted, y as onActivated, D as onDeactivated, f as createCommentVNode, v as nextTick, S as resolveDirective, j as createStaticVNode, e as createBlock, a7 as withDirectives, k as createTextVNode, W as shallowRef, A as onBeforeUnmount, P as renderSlot, V as shallowReactive, F as Fragment, O as renderList, a6 as withCtx, q as draggable, T as Transition, a8 as withKeys, a3 as vModelText, r as getCurrentInstance, C as Cropper, J as reactive, z as onBeforeMount, a4 as vShow, i as createRouter, m as createWebHashHistory, R as resolveComponent, K as KeepAlive, U as resolveDynamicComponent, n as defineAsyncComponent, b as createApp, h as createPinia } from "./vendor.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const scriptRel = "modulepreload";
const assetsURL = function(dep, importerUrl) {
  return new URL(dep, importerUrl).href;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (deps && deps.length > 0) {
    let allSettled = function(promises$2) {
      return Promise.all(promises$2.map((p) => Promise.resolve(p).then((value$1) => ({
        status: "fulfilled",
        value: value$1
      }), (reason) => ({
        status: "rejected",
        reason
      }))));
    };
    const links = document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
    const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
    promise = allSettled(deps.map((dep) => {
      dep = assetsURL(dep, importerUrl);
      if (dep in seen) return;
      seen[dep] = true;
      const isCss = dep.endsWith(".css");
      const cssSelector = isCss ? '[rel="stylesheet"]' : "";
      if (!!importerUrl) for (let i$1 = links.length - 1; i$1 >= 0; i$1--) {
        const link$1 = links[i$1];
        if (link$1.href === dep && (!isCss || link$1.rel === "stylesheet")) return;
      }
      else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) return;
      const link = document.createElement("link");
      link.rel = isCss ? "stylesheet" : scriptRel;
      if (!isCss) link.as = "script";
      link.crossOrigin = "";
      link.href = dep;
      if (cspNonce) link.setAttribute("nonce", cspNonce);
      document.head.appendChild(link);
      if (isCss) return new Promise((res, rej) => {
        link.addEventListener("load", res);
        link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
      });
    }));
  }
  function handlePreloadError(err$2) {
    const e$1 = new Event("vite:preloadError", { cancelable: true });
    e$1.payload = err$2;
    window.dispatchEvent(e$1);
    if (!e$1.defaultPrevented) throw err$2;
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};
const SONG_TITLES = [
  "Midnight Transit",
  "Blue Signal",
  "Warm Static",
  "Glass Harbor",
  "Neon Garden",
  "Paper Moon",
  "Silver Creek",
  "Soft Engine",
  "After Rain",
  "Velvet Route",
  "Low Orbit",
  "Coffee Lights"
];
const ARTISTS = [
  "TY Studio",
  "North Loop",
  "Cloud Pilot",
  "Local Band",
  "Echo Field",
  "Sandbox FM"
];
function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}
function createResponse(data, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => cloneJson(data),
    text: async () => JSON.stringify(data)
  };
}
function parseUrl(rawUrl) {
  try {
    return new URL(rawUrl, window.location?.href || "http://localhost/");
  } catch {
    return null;
  }
}
function createSong(index, playlistId = "local_music") {
  const title = SONG_TITLES[index % SONG_TITLES.length];
  const artist = ARTISTS[index % ARTISTS.length];
  const id = `sandbox-${playlistId}-${String(index + 1).padStart(2, "0")}`;
  return {
    id,
    hash_id: id,
    hashId: id,
    title,
    name: title,
    artist,
    singer: artist,
    producer: artist,
    album: playlistId === "bili_downloads" ? "Bili Cache" : "Local Library",
    duration: 174 + index % 9 * 17,
    cover: `/api/cover/random?seed=${encodeURIComponent(id)}`,
    pic: `/api/cover/random?seed=${encodeURIComponent(`${id}-pic`)}`,
    src: `/api/audio/${encodeURIComponent(id)}`,
    url: `/api/audio/${encodeURIComponent(id)}`,
    order: String(9e5 - index),
    sort_order: String(9e5 - index),
    source_type: "skin_sandbox"
  };
}
const localSongs = Array.from({ length: 36 }, (_, index) => createSong(index, "local_music"));
const biliSongs = Array.from({ length: 18 }, (_, index) => ({
  ...createSong(index, "bili_downloads"),
  title: `Bili Clip ${index + 1}`,
  name: `Bili Clip ${index + 1}`,
  source_type: "bilibili",
  url: `https://www.bilibili.com/video/BV1sandbox${index}`,
  bili_pic: `/api/cover/random?seed=bili-${index}`
}));
const customSongs = Array.from({ length: 24 }, (_, index) => createSong(index, "custom_focus"));
const playlists = [
  {
    id: "local_music",
    name: "Local Music",
    count: localSongs.length,
    isCustom: false,
    cover: "/api/cover/random?seed=playlist-local"
  },
  {
    id: "bili_downloads",
    name: "Bilibili Downloads",
    count: biliSongs.length,
    isCustom: false,
    cover: "/api/cover/random?seed=playlist-bili"
  },
  {
    id: "custom_focus",
    name: "Focus Mix",
    count: customSongs.length,
    isCustom: true,
    cover: "/api/cover/random?seed=playlist-focus"
  },
  {
    id: "custom_evening",
    name: "Evening Queue",
    count: 16,
    isCustom: true,
    cover: "/api/cover/random?seed=playlist-evening"
  },
  {
    id: "custom_drive",
    name: "Drive Home",
    count: 12,
    isCustom: true,
    cover: "/api/cover/random?seed=playlist-drive"
  }
];
const playlistSongMap = {
  local_music: localSongs,
  bili_downloads: biliSongs,
  custom_focus: customSongs,
  custom_evening: Array.from({ length: 16 }, (_, index) => createSong(index, "custom_evening")),
  custom_drive: Array.from({ length: 12 }, (_, index) => createSong(index, "custom_drive"))
};
function findPlaylist(id) {
  return playlists.find((playlist) => playlist.id === id) || playlists[0];
}
function getPlaylistSongs(id) {
  return playlistSongMap[id] || playlistSongMap.local_music;
}
function filterSongs(keyword) {
  const query = `${keyword || ""}`.trim().toLowerCase();
  const merged = [...localSongs, ...customSongs, ...biliSongs];
  if (!query) return merged.slice(0, 30);
  const filtered = merged.filter((song) => {
    return `${song.title} ${song.artist} ${song.album}`.toLowerCase().includes(query);
  });
  return (filtered.length ? filtered : merged).slice(0, 30);
}
function createBiliVideo(index, keyword = "skin") {
  return {
    id: `sandbox-bili-video-${index + 1}`,
    bvid: `BV1SKIN${String(index + 1).padStart(4, "0")}`,
    title: `${keyword || "Skin"} demo video ${index + 1}`,
    author: ARTISTS[index % ARTISTS.length],
    up_name: ARTISTS[index % ARTISTS.length],
    duration: `${3 + index % 6}:${String(10 + index).padStart(2, "0")}`,
    play: 12e3 + index * 1337,
    url: `https://www.bilibili.com/video/BV1SKIN${index}`,
    cover: `/api/cover/random?seed=bili-video-${index}`,
    pic: `/api/cover/random?seed=bili-video-${index}`,
    bili_pic: `/api/cover/random?seed=bili-video-${index}`
  };
}
function createListenStats(period = "all") {
  return {
    period,
    period_label: period === "week" ? "This Week" : period === "month" ? "This Month" : "All Time",
    summary: {
      total_listen_sec: 128560,
      playlist_count: playlists.length,
      song_count: localSongs.length + customSongs.length
    },
    playlist_rankings: playlists.map((playlist, index) => ({
      id: playlist.id,
      name: playlist.name,
      cover: playlist.cover,
      total_listen_sec: 36e3 - index * 4200,
      song_count: playlist.count,
      play_count: 42 - index * 4
    })),
    song_rankings: localSongs.slice(0, 12).map((song, index) => ({
      ...song,
      total_listen_sec: 7200 - index * 320,
      play_count: 38 - index
    }))
  };
}
function noOp(data = {}) {
  return createResponse({ success: true, ok: true, data });
}
function isSkinSandboxRuntime() {
  if (typeof window === "undefined") return false;
  const hash = `${window.location?.hash || ""}`;
  const search = `${window.location?.search || ""}`;
  return window.parent !== window && (/(?:\?|&)skinSandbox=1(?:&|$)/.test(hash) || /(?:\?|&)skinSandbox=1(?:&|$)/.test(search));
}
function createSandboxApiResponse(rawUrl, options = {}) {
  if (!isSkinSandboxRuntime()) return null;
  const parsedUrl = parseUrl(rawUrl);
  if (!parsedUrl || !parsedUrl.pathname.startsWith("/api/")) return null;
  const method = `${options.method || "GET"}`.toUpperCase();
  const path = parsedUrl.pathname;
  const query = parsedUrl.searchParams;
  if (method === "GET" && path === "/api/health") {
    return createResponse({ ok: true, mode: "skin-sandbox" });
  }
  if (method === "GET" && path === "/api/playlists") {
    return createResponse({ success: true, playlists });
  }
  const playlistGetMatch = path.match(/^\/api\/playlist\/([^/]+)\/get$/);
  if (method === "GET" && playlistGetMatch) {
    const playlistId = decodeURIComponent(playlistGetMatch[1]);
    return createResponse({ success: true, songs: getPlaylistSongs(playlistId) });
  }
  const playlistMatch = path.match(/^\/api\/playlist\/([^/]+)$/);
  if (method === "GET" && playlistMatch) {
    const playlistId = decodeURIComponent(playlistMatch[1]);
    const playlist = findPlaylist(playlistId);
    return createResponse({
      success: true,
      ...playlist,
      playlist,
      songs: getPlaylistSongs(playlistId),
      reorder_count: 0
    });
  }
  if (method === "GET" && path === "/api/search") {
    return createResponse({
      success: true,
      songs: filterSongs(query.get("q") || "")
    });
  }
  if (method === "GET" && path === "/api/bili-search") {
    const keyword = query.get("q") || "skin";
    return createResponse({
      success: true,
      videos: Array.from({ length: 18 }, (_, index) => createBiliVideo(index, keyword))
    });
  }
  if (method === "POST" && path === "/api/bili-parse-favorite") {
    return createResponse({
      success: true,
      videos: Array.from({ length: 16 }, (_, index) => createBiliVideo(index, "favorite"))
    });
  }
  if (method === "GET" && path === "/api/account/listen-stats") {
    return createResponse(createListenStats(query.get("period") || "all"));
  }
  if (method === "GET" && path === "/api/scan-progress") {
    return createResponse({
      phase: "done",
      total: localSongs.length,
      processed: localSongs.length,
      count: localSongs.length,
      newCount: 0,
      message: "Sandbox data is ready."
    });
  }
  if (method === "POST") {
    return noOp();
  }
  return null;
}
function canUseAncestorAndroidBridge() {
  return isSkinSandboxRuntime();
}
function getAndroidBridgeBinding() {
  if (typeof window === "undefined") return null;
  const candidates = [window];
  if (canUseAncestorAndroidBridge()) {
    try {
      if (window.parent && window.parent !== window) {
        candidates.push(window.parent);
      }
    } catch (_) {
    }
    try {
      if (window.top && window.top !== window && !candidates.includes(window.top)) {
        candidates.push(window.top);
      }
    } catch (_) {
    }
  }
  for (const ownerWindow of candidates) {
    try {
      const bridge = ownerWindow?.Android;
      if (bridge && typeof bridge.callApiAsync === "function") {
        return { ownerWindow, bridge };
      }
    } catch (_) {
    }
  }
  return null;
}
function ensureApiCallbackBridge(ownerWindow) {
  if (!ownerWindow || typeof ownerWindow !== "object") return;
  if (!ownerWindow.__apiCallbacks || typeof ownerWindow.__apiCallbacks !== "object") {
    ownerWindow.__apiCallbacks = {};
  }
  if (typeof ownerWindow.__apiCallbackSeq !== "number") {
    ownerWindow.__apiCallbackSeq = 0;
  }
  if (typeof ownerWindow.__apiCallback !== "function") {
    ownerWindow.__apiCallback = function(id, responseStr) {
      const cb = ownerWindow.__apiCallbacks[id];
      if (cb) {
        delete ownerWindow.__apiCallbacks[id];
        try {
          cb(responseStr);
        } catch (_) {
        }
      }
    };
  }
}
typeof window !== "undefined" && Boolean(getAndroidBridgeBinding());
function createTraceId() {
  const rand = Math.random().toString(36).slice(2, 8);
  return `trace_${Date.now().toString(36)}_${rand}`;
}
function androidCallApiAsync(method, url, bodyContent, headersStr, binding) {
  const ownerWindow = binding?.ownerWindow;
  const bridge = binding?.bridge;
  if (!ownerWindow || !bridge) {
    return Promise.reject(new Error(`Android bridge unavailable: ${method} ${url}`));
  }
  ensureApiCallbackBridge(ownerWindow);
  return new Promise((resolve, reject) => {
    const id = String(++ownerWindow.__apiCallbackSeq);
    ownerWindow.__apiCallbacks[id] = (responseStr) => {
      try {
        resolve(responseStr);
      } catch (e) {
        reject(e);
      }
    };
    const timer = setTimeout(() => {
      if (ownerWindow.__apiCallbacks[id]) {
        delete ownerWindow.__apiCallbacks[id];
        reject(new Error(`Android API timeout: ${method} ${url}`));
      }
    }, 3e4);
    const origCb = ownerWindow.__apiCallbacks[id];
    ownerWindow.__apiCallbacks[id] = (responseStr) => {
      clearTimeout(timer);
      origCb(responseStr);
    };
    try {
      bridge.callApiAsync(method, url, bodyContent || "", headersStr || "", id);
    } catch (e) {
      clearTimeout(timer);
      delete ownerWindow.__apiCallbacks[id];
      reject(e);
    }
  });
}
function createAndroidResponseBody(response) {
  const data = response?.data;
  const error = response?.error;
  if (data && typeof data === "object" && !Array.isArray(data)) {
    return error && data.error === void 0 ? { ...data, error } : data;
  }
  if (error) {
    return { data: data ?? null, error };
  }
  return data;
}
async function apiRequest(url, options = {}) {
  const method = options.method || "GET";
  const requestStartedAt = Date.now();
  const isFormData = options.body instanceof FormData;
  let bodyContent = options.body;
  if (bodyContent && typeof bodyContent !== "string" && !isFormData) {
    bodyContent = JSON.stringify(bodyContent);
  }
  const fetchOptions = { ...options };
  if (isFormData) {
    fetchOptions.body = options.body;
  } else if (bodyContent) {
    fetchOptions.body = bodyContent;
  }
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("userToken") : null;
  const inputHeaders = options.headers || {};
  const traceId = inputHeaders["X-Trace-Id"] || inputHeaders["x-trace-id"] || createTraceId();
  const baseHeaders = isFormData ? {} : { "Content-Type": "application/json" };
  fetchOptions.headers = {
    ...baseHeaders,
    ...inputHeaders,
    "X-Trace-Id": traceId,
    ...token ? { "Authorization": `Bearer ${token}` } : {}
  };
  if (!isFormData && isSkinSandboxRuntime()) {
    const sandboxResponse = createSandboxApiResponse(url, {
      method
    });
    if (sandboxResponse) {
      const elapsedMs = Date.now() - requestStartedAt;
      console.debug(`[api][${traceId}] sandbox ${method} ${url} -> ${sandboxResponse.status} (${elapsedMs}ms)`);
      return sandboxResponse;
    }
  }
  const androidBridgeBinding = getAndroidBridgeBinding();
  if (androidBridgeBinding) {
    if (isFormData) {
      const response = await fetch(url, fetchOptions);
      const elapsedMs = Date.now() - requestStartedAt;
      console.debug(`[api][${traceId}] ${method} ${url} -> ${response.status} (${elapsedMs}ms)`);
      return response;
    }
    try {
      const responseStr = await androidCallApiAsync(
        method,
        url,
        bodyContent || "",
        JSON.stringify(fetchOptions.headers || {}),
        androidBridgeBinding
      );
      const response = JSON.parse(responseStr);
      const status = Number(response?.status) || 0;
      const body = createAndroidResponseBody(response);
      const elapsedMs = Date.now() - requestStartedAt;
      console.debug(`[api][${traceId}] ${method} ${url} -> ${status} (${elapsedMs}ms)`);
      return {
        ok: status >= 200 && status < 300,
        status,
        json: async () => body,
        text: async () => typeof body === "string" ? body : JSON.stringify(body),
        bridgeEnvelope: response
      };
    } catch (e) {
      const elapsedMs = Date.now() - requestStartedAt;
      console.error(`[api][${traceId}] Android Bridge Error ${method} ${url} (${elapsedMs}ms)`, e);
      throw e;
    }
  } else {
    const response = await fetch(url, fetchOptions);
    const elapsedMs = Date.now() - requestStartedAt;
    console.debug(`[api][${traceId}] ${method} ${url} -> ${response.status} (${elapsedMs}ms)`);
    return response;
  }
}
const GLOBAL_KEYS = /* @__PURE__ */ new Set([
  "userToken",
  "userInfo",
  "ty_sync_client_id",
  "auth_status"
]);
class LocalStorageManager {
  constructor() {
    this._currentUserId = "guest";
  }
  // ── 用户切换 ──────────────────────────────────
  /**
   * 获取当前用户 ID
   */
  get currentUserId() {
    return this._currentUserId;
  }
  /**
   * 切换到指定用户的命名空间
   * @param {string|number} userId
   */
  switchToUser(userId) {
    if (!userId) {
      this._currentUserId = "guest";
    } else {
      this._currentUserId = String(userId);
    }
    console.log(`[Storage] 命名空间切换到: ty_${this._currentUserId}_*`);
  }
  /**
   * 切换到 guest（未登录）命名空间
   */
  switchToGuest() {
    this._currentUserId = "guest";
    console.log("[Storage] 命名空间切换到: ty_guest_*");
  }
  // ── 基础读写 ──────────────────────────────────
  /**
   * 将原始 key 转换为带用户前缀的 key
   * 全局 key 不加前缀
   */
  _key(rawKey) {
    if (GLOBAL_KEYS.has(rawKey)) return rawKey;
    return `ty_${this._currentUserId}_${rawKey}`;
  }
  get(key) {
    try {
      return localStorage.getItem(this._key(key));
    } catch {
      return null;
    }
  }
  getJSON(key, fallback = null) {
    try {
      const raw = this.get(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }
  set(key, value) {
    try {
      localStorage.setItem(this._key(key), value);
    } catch {
    }
  }
  setJSON(key, value) {
    this.set(key, JSON.stringify(value));
  }
  remove(key) {
    try {
      localStorage.removeItem(this._key(key));
    } catch {
    }
  }
  // ── 活跃时间追踪（用于 30 天过期清理）──────────
  /**
   * 记录当前用户的最后活跃时间
   */
  touchActiveTime() {
    if (this._currentUserId === "guest") return;
    try {
      localStorage.setItem(
        `ty_${this._currentUserId}_lastActive`,
        String(Date.now())
      );
    } catch {
    }
  }
  // ── 过期数据清理 ──────────────────────────────
  /**
   * 清理超过 30 天未使用的用户数据
   * 应在应用启动时、以及每次登录成功时调用
   */
  cleanupExpiredUsers() {
    try {
      const allKeys = Object.keys(localStorage);
      const userIds = /* @__PURE__ */ new Set();
      for (const k of allKeys) {
        const match = k.match(/^ty_([^_]+)_/);
        if (match) userIds.add(match[1]);
      }
      const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1e3;
      for (const uid2 of userIds) {
        if (uid2 === "guest") continue;
        const lastActive = localStorage.getItem(`ty_${uid2}_lastActive`);
        if (lastActive && Date.now() - Number(lastActive) > THIRTY_DAYS) {
          console.log(`[Storage] 清理过期用户数据: userId=${uid2}`);
          const toRemove = allKeys.filter((k) => k.startsWith(`ty_${uid2}_`));
          toRemove.forEach((k) => localStorage.removeItem(k));
        }
      }
    } catch (e) {
      console.warn("[Storage] 清理过期数据失败:", e);
    }
  }
}
const storage = new LocalStorageManager();
const SESSION_KEY = "playback_event_session_v1";
const SEQ_KEY = "playback_event_seq_v1";
const BUFFER_KEY = "playback_event_buffer_v1";
const DEVICE_KEY = "playback_event_device_id_v1";
const HEARTBEAT_INTERVAL_MS = 3e3;
const FLUSH_INTERVAL_MS = 5e3;
const MAX_BATCH_SIZE = 20;
const MAX_BUFFER_SIZE = 600;
function nowIso() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function createRandomId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}
function toFiniteNumber(value, fallback = null) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}
function trimString(value, fallback = null) {
  if (value === void 0 || value === null) return fallback;
  const text = String(value).trim();
  return text.length > 0 ? text : fallback;
}
function safeParse(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
class PlaybackEventTracker {
  constructor() {
    this._started = false;
    this._sessionId = null;
    this._deviceId = null;
    this._seqNo = 0;
    this._buffer = [];
    this._snapshotProvider = null;
    this._flushTimer = null;
    this._heartbeatTimer = null;
    this._isFlushing = false;
    this._suspended = false;
    this._boundVisibilityHandler = null;
    this._boundBeforeUnload = null;
  }
  _loadOrCreateDeviceId() {
    if (typeof localStorage === "undefined") {
      return createRandomId("device");
    }
    const existing = localStorage.getItem(DEVICE_KEY);
    if (existing) return existing;
    if (typeof window !== "undefined" && window.Android?.getDeviceId) {
      try {
        const nativeId = trimString(window.Android.getDeviceId(), null);
        if (nativeId) {
          localStorage.setItem(DEVICE_KEY, nativeId);
          return nativeId;
        }
      } catch (_) {
      }
    }
    const fallback = localStorage.getItem("ty_sync_client_id");
    const nextId = fallback || createRandomId("device");
    localStorage.setItem(DEVICE_KEY, nextId);
    return nextId;
  }
  _loadOrCreateSessionId() {
    const existing = storage.get(SESSION_KEY);
    if (existing) return existing;
    const nextId = createRandomId("session");
    storage.set(SESSION_KEY, nextId);
    return nextId;
  }
  _loadBuffer() {
    const parsed = safeParse(storage.get(BUFFER_KEY), []);
    this._buffer = Array.isArray(parsed) ? parsed : [];
  }
  _persistBuffer() {
    storage.set(BUFFER_KEY, JSON.stringify(this._buffer));
  }
  _persistSeqNo() {
    storage.set(SEQ_KEY, String(this._seqNo));
  }
  _hasToken() {
    try {
      return Boolean(localStorage.getItem("userToken"));
    } catch {
      return false;
    }
  }
  _startFlushTimer() {
    if (this._flushTimer) return;
    this._flushTimer = setInterval(() => {
      this.flush().catch(() => {
      });
    }, FLUSH_INTERVAL_MS);
  }
  _startHeartbeatTimer() {
    if (this._heartbeatTimer) return;
    this._heartbeatTimer = setInterval(() => {
      this.trackHeartbeat();
    }, HEARTBEAT_INTERVAL_MS);
  }
  _stopTimers() {
    if (this._flushTimer) {
      clearInterval(this._flushTimer);
      this._flushTimer = null;
    }
    if (this._heartbeatTimer) {
      clearInterval(this._heartbeatTimer);
      this._heartbeatTimer = null;
    }
  }
  _bindLifecycleHooks() {
    if (typeof window === "undefined") return;
    if (this._boundVisibilityHandler) return;
    window.__tyPlaybackFlushNow = () => this.flush({ force: true });
    this._boundVisibilityHandler = () => {
      if (document.visibilityState === "hidden") {
        this.flush({ force: true }).catch(() => {
        });
      }
    };
    this._boundBeforeUnload = () => {
      this.flush({ force: true }).catch(() => {
      });
    };
    document.addEventListener("visibilitychange", this._boundVisibilityHandler);
    window.addEventListener("beforeunload", this._boundBeforeUnload);
  }
  start(snapshotProvider = null) {
    if (snapshotProvider && typeof snapshotProvider === "function") {
      this._snapshotProvider = snapshotProvider;
    }
    if (this._started) return;
    this._started = true;
    this._sessionId = this._loadOrCreateSessionId();
    this._deviceId = this._loadOrCreateDeviceId();
    this._seqNo = Number.parseInt(storage.get(SEQ_KEY) || "0", 10);
    if (!Number.isFinite(this._seqNo)) this._seqNo = 0;
    this._loadBuffer();
    if (!this._suspended) {
      this._startFlushTimer();
      this._startHeartbeatTimer();
    }
    this._bindLifecycleHooks();
  }
  stop() {
    this._started = false;
    this._stopTimers();
  }
  suspend() {
    this._suspended = true;
    this._stopTimers();
  }
  resume() {
    if (!this._suspended) return;
    this._suspended = false;
    if (this._started) {
      this._startFlushTimer();
      this._startHeartbeatTimer();
    }
  }
  setSnapshotProvider(snapshotProvider) {
    if (typeof snapshotProvider === "function") {
      this._snapshotProvider = snapshotProvider;
    }
  }
  _buildEvent(eventType, payload = {}, extra = {}) {
    if (!this._started) this.start();
    this._seqNo += 1;
    this._persistSeqNo();
    const eventId = trimString(extra.event_id, null) || createRandomId("evt");
    const triggerSource = trimString(extra.trigger_source ?? payload?.trigger_source, null);
    return {
      event_id: eventId,
      session_id: this._sessionId,
      device_id: this._deviceId,
      seq_no: this._seqNo,
      event_type: eventType,
      trigger_source: triggerSource,
      client_ts: nowIso(),
      payload: payload && typeof payload === "object" ? payload : {}
    };
  }
  track(eventType, payload = {}, options = {}) {
    if (!trimString(eventType, null)) return null;
    if (this._suspended) return null;
    const event = this._buildEvent(eventType, payload, options.extra || {});
    this._buffer.push(event);
    if (this._buffer.length > MAX_BUFFER_SIZE) {
      const overflow = this._buffer.length - MAX_BUFFER_SIZE;
      this._buffer.splice(0, overflow);
    }
    this._persistBuffer();
    if (options.immediate || this._buffer.length >= MAX_BATCH_SIZE) {
      this.flush().catch(() => {
      });
    }
    return event;
  }
  trackImmediate(eventType, payload = {}, options = {}) {
    return this.track(eventType, payload, { ...options, immediate: true });
  }
  trackHeartbeat(extraPayload = {}) {
    if (this._suspended) return;
    if (typeof this._snapshotProvider !== "function") return;
    const snapshot = this._snapshotProvider();
    if (!snapshot || typeof snapshot !== "object") return;
    if (!trimString(snapshot.track_id, null)) return;
    if (snapshot.is_video_active || snapshot.is_playing === false) return;
    const payload = {
      ...snapshot,
      ...extraPayload,
      position_sec: toFiniteNumber(snapshot.position_sec, 0),
      duration_sec: toFiniteNumber(snapshot.duration_sec, null),
      playback_rate: toFiniteNumber(snapshot.playback_rate, null),
      volume: toFiniteNumber(snapshot.volume, null),
      queue_length: toFiniteNumber(snapshot.queue_length, null)
    };
    this.track("play_heartbeat", payload);
  }
  /** 检测是否运行在 Android WebView 环境中 */
  _isAndroidNative() {
    return typeof window !== "undefined" && typeof window.Android === "object" && typeof window.Android.recordPlaybackEvents === "function";
  }
  async flush({ force = false } = {}) {
    if (this._isFlushing) return;
    if (!this._buffer.length) return;
    if (this._isAndroidNative()) {
      this._flushToNative(force);
      return;
    }
    if (!this._hasToken()) return;
    await this._flushToBackend(force);
  }
  /** 通过 JS Bridge 将事件写入 Android 本地 SQLite */
  _flushToNative(force) {
    this._isFlushing = true;
    try {
      do {
        const batch = this._buffer.slice(0, MAX_BATCH_SIZE);
        if (!batch.length) break;
        const payload = JSON.stringify(batch);
        window.Android.recordPlaybackEvents(payload);
        this._buffer.splice(0, batch.length);
        this._persistBuffer();
      } while (force && this._buffer.length > 0);
    } catch (e) {
      console.warn("[PlaybackEvents] Native flush failed, keeping buffer:", e);
    } finally {
      this._isFlushing = false;
    }
  }
  /** 通过 HTTP 将事件上报到后端 */
  async _flushToBackend(force) {
    this._isFlushing = true;
    try {
      do {
        const batch = this._buffer.slice(0, MAX_BATCH_SIZE);
        if (!batch.length) break;
        const response = await apiRequest("/api/play/events/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: {
            session_id: this._sessionId,
            device_id: this._deviceId,
            events: batch
          }
        });
        if (!response.ok) {
          break;
        }
        this._buffer.splice(0, batch.length);
        this._persistBuffer();
      } while (force && this._buffer.length > 0);
    } catch (_) {
    } finally {
      this._isFlushing = false;
    }
  }
}
const playbackEventTracker = new PlaybackEventTracker();
function readInitialDebugFlag() {
  if (typeof window === "undefined") return false;
  if (window.__TY_DEBUG__ === true) return true;
  try {
    return window.localStorage?.getItem("ty_debug") === "1";
  } catch (_) {
    return false;
  }
}
let debugEnabled = readInitialDebugFlag();
function isDebugEnabled() {
  if (typeof window !== "undefined" && window.__TY_DEBUG__ === true) return true;
  return debugEnabled;
}
function createLogger(tag) {
  const prefix = tag || "";
  return {
    log: (...args) => {
      if (isDebugEnabled()) console.log(prefix, ...args);
    },
    info: (...args) => {
      if (isDebugEnabled()) console.info(prefix, ...args);
    },
    debug: (...args) => {
      if (isDebugEnabled()) console.debug(prefix, ...args);
    },
    warn: (...args) => console.warn(prefix, ...args),
    error: (...args) => console.error(prefix, ...args)
  };
}
const logger$6 = createLogger("[QueuePersistence]");
function currentUserId() {
  return `${storage.currentUserId || "guest"}`.trim() || "guest";
}
function hasAndroidQueue(method) {
  return typeof window !== "undefined" && window.Android && typeof window.Android[method] === "function";
}
function getHash(track) {
  return track && typeof track === "object" ? track.hash_id ?? track.id ?? null : null;
}
function rawSave(mode, payloadObj) {
  let json = "";
  try {
    json = JSON.stringify(payloadObj);
  } catch (_) {
    return false;
  }
  if (hasAndroidQueue("savePlaylistQueue")) {
    try {
      const ok = window.Android.savePlaylistQueue(currentUserId(), mode, json);
      if (ok !== false) return true;
      logger$6.warn(`Android savePlaylistQueue returned false mode=${mode} size=${json.length}`);
    } catch (e) {
      logger$6.warn(`Android savePlaylistQueue threw mode=${mode}`, e);
    }
  }
  try {
    storage.setJSON(`playlist_cache_${mode}`, payloadObj);
    return true;
  } catch (e) {
    logger$6.warn(`localStorage save failed mode=${mode}`, e);
    return false;
  }
}
function rawRead(mode) {
  if (hasAndroidQueue("getPlaylistQueue")) {
    try {
      const json = window.Android.getPlaylistQueue(currentUserId(), mode);
      if (json) {
        const parsed = JSON.parse(json);
        if (parsed && typeof parsed === "object") return parsed;
      }
    } catch (e) {
      logger$6.warn(`Android getPlaylistQueue failed mode=${mode}`, e);
    }
  }
  try {
    return storage.getJSON(`playlist_cache_${mode}`);
  } catch (_) {
    return null;
  }
}
function persistQueueForMode(mode, songs, canonicalLoopList = null) {
  const safeSongs = Array.isArray(songs) ? songs : [];
  if (mode === "loop_single") return true;
  if (mode === "shuffle") {
    const canonical = Array.isArray(canonicalLoopList) && canonicalLoopList.length > 0 ? canonicalLoopList : null;
    if (canonical && canonical.length === safeSongs.length) {
      const indexByHash = /* @__PURE__ */ new Map();
      canonical.forEach((t, i) => {
        const h = getHash(t);
        if (h != null && !indexByHash.has(h)) indexByHash.set(h, i);
      });
      const order = [];
      let ok = true;
      for (const s of safeSongs) {
        const h = getHash(s);
        const idx = h != null ? indexByHash.get(h) : void 0;
        if (idx === void 0) {
          ok = false;
          break;
        }
        order.push(idx);
      }
      if (ok && order.length === safeSongs.length) {
        return rawSave("shuffle", { order, timestamp: Date.now(), mode: "shuffle" });
      }
    }
    return rawSave("shuffle", { songs: safeSongs, timestamp: Date.now(), mode: "shuffle" });
  }
  return rawSave(mode, { songs: safeSongs, timestamp: Date.now(), mode });
}
function readQueueForMode(mode) {
  if (mode === "loop_single") {
    return readLoopList();
  }
  if (mode === "shuffle") {
    const payload2 = rawRead("shuffle");
    if (Array.isArray(payload2?.songs) && payload2.songs.length > 0) return payload2.songs;
    if (Array.isArray(payload2?.order) && payload2.order.length > 0) {
      const base = readLoopList();
      if (base.length > 0) {
        const rebuilt = payload2.order.filter((i) => Number.isInteger(i) && i >= 0 && i < base.length).map((i) => base[i]);
        if (rebuilt.length > 0) return rebuilt;
      }
    }
    return [];
  }
  const payload = rawRead(mode);
  return Array.isArray(payload?.songs) ? payload.songs : [];
}
function readLoopList() {
  const ll = rawRead("loop_list");
  return Array.isArray(ll?.songs) ? ll.songs : [];
}
const usePlaylistStore = defineStore("playlist", {
  state: () => ({
    queue: [],
    // 当前播放列表（对应当前 mode）
    loopListQueue: [],
    // loop_list 主队列（永远保存原始顺序，供 shuffle/loop_single 推导）
    mode: "loop_list",
    // 当前播放模式
    historyQueue: []
    // 历史播放列表
  }),
  actions: {
    /**
     * 仅设置内存队列，不触发持久化——用于冷启动恢复，
     * 避免把「从缓存读取」误判为「用户操作」写回数据库。
     */
    _setQueueInternal(list) {
      this.queue = Array.isArray(list) ? list.map((t) => t && typeof t === "object" ? { ...t } : t) : [];
    },
    /**
     * 仅将指定 modeKey 的队列持久化到 localStorage，
     * 不触发防抖 + 不发起任何 API 同步。
     * 用于 playWithContext 时预先写入所有 mode 的缓存。
     */
    _persistModeCache(modeKey, songs) {
      persistQueueForMode(modeKey, songs, this.loopListQueue);
    },
    // 插入歌曲到指定位置，默认追加到末尾
    insertTrack(track, position = this.queue.length) {
      const cloned = track && typeof track === "object" ? { ...track } : track;
      this.queue.splice(position, 0, cloned);
      this._persistQueue();
    },
    // 删除指定 hash_id 的歌曲
    removeTrack(hash_id) {
      this.queue = this.queue.filter((t) => (t.hash_id ?? t.id) !== hash_id);
      this._persistQueue();
    },
    // 自定义排序
    sortQueue(compareFn) {
      this.queue.sort(compareFn);
      this._persistQueue();
    },
    // 根据 hash_id 获取下一首/上一首
    getNext(currentHashId) {
      if (!this.queue.length) return null;
      if (this.mode === "loop_single") {
        const currentTrack = this.queue.find((t) => (t.hash_id ?? t.id) === currentHashId);
        return currentTrack || null;
      }
      if (!currentHashId) return this.queue[0] || null;
      const i = this.queue.findIndex((t) => (t.hash_id ?? t.id) === currentHashId);
      if (i < 0) return null;
      return this.queue[(i + 1) % this.queue.length];
    },
    getPrev(currentHashId) {
      if (!this.queue.length) return null;
      if (this.mode === "loop_single") {
        const currentTrack = this.queue.find((t) => (t.hash_id ?? t.id) === currentHashId);
        return currentTrack || null;
      }
      if (!currentHashId) return this.queue[0] || null;
      const i = this.queue.findIndex((t) => (t.hash_id ?? t.id) === currentHashId);
      if (i < 0) return null;
      return this.queue[(i - 1 + this.queue.length) % this.queue.length];
    },
    getIndex(hash_id) {
      return this.queue.findIndex((t) => (t.hash_id ?? t.id) === hash_id);
    },
    _emitQueueAnalytics(analytics) {
      if (!analytics || typeof analytics !== "object") return;
      const eventType = analytics.eventType;
      if (!eventType) return;
      const payload = {
        queue_length: Array.isArray(this.queue) ? this.queue.length : 0,
        mode: this.mode,
        ...analytics.payload || {}
      };
      const triggerSource = analytics.triggerSource ?? payload.trigger_source ?? "manual_user";
      payload.trigger_source = triggerSource;
      playbackEventTracker.trackImmediate(eventType, payload);
    },
    // ── 本地持久化（已移除云端同步）────────────
    _persistQueue() {
      persistQueueForMode(this.mode, this.queue, this.loopListQueue);
    },
    /**
     * 初始化或替换播放列表（仅本地持久化）
     */
    setQueue(list, options = {}) {
      const { persist = true, analytics = null } = options;
      this.queue = Array.isArray(list) ? list.map((t) => t && typeof t === "object" ? { ...t } : t) : [];
      if (this.mode === "loop_list" || this.mode === "loop_single") {
        this.loopListQueue = [...this.queue];
      }
      if (persist) {
        this._persistQueue();
      }
      this._emitQueueAnalytics(analytics);
    },
    setQueueInPlace(list, options = {}) {
      const { persist = true, analytics = null } = options;
      const nextQueue = Array.isArray(list) ? list : [];
      this.queue.splice(0, this.queue.length, ...nextQueue);
      if (this.mode === "loop_list" || this.mode === "loop_single") {
        this.loopListQueue = [...this.queue];
      }
      if (persist) {
        this._persistQueue();
      }
      this._emitQueueAnalytics(analytics);
    },
    /**
     * 选择模式下的“优先播放”：
     * - 第一次：插入到正在播放歌曲下方（等效下一首）
     * - 同一任务内后续：插到上一次插入歌曲的后面
     * - 按传入 tracks 的顺序插入（即用户选择顺序）
     */
    enqueuePriorityNext(tracks, { taskId, currentHashId, triggerSource = "manual_user", source = "unknown" } = {}) {
      if (!Array.isArray(tracks) || tracks.length === 0) return;
      if (taskId && this._priorityTaskId !== taskId) {
        this._priorityTaskId = taskId;
        this._priorityLastInsertedId = null;
      }
      const getId = (t) => t && typeof t === "object" ? t.hash_id ?? t.id : null;
      let anchorIndex = -1;
      if (this._priorityLastInsertedId) {
        const idx = this.getIndex(this._priorityLastInsertedId);
        if (idx >= 0) anchorIndex = idx;
      }
      if (anchorIndex < 0 && currentHashId) {
        const idx = this.getIndex(currentHashId);
        if (idx >= 0) anchorIndex = idx;
      }
      const currentId = currentHashId ?? null;
      const insertedTrackIds = [];
      const toInsert = tracks.map((t) => t && typeof t === "object" ? { ...t } : t).filter((t) => getId(t));
      for (const track of toInsert) {
        const id = getId(track);
        if (!id) continue;
        if (currentId && id === currentId) continue;
        const existingIndex = this.getIndex(id);
        if (existingIndex >= 0) {
          this.queue.splice(existingIndex, 1);
          if (existingIndex <= anchorIndex) anchorIndex -= 1;
        }
        const insertAt = Math.min(this.queue.length, Math.max(0, anchorIndex + 1));
        track._tempHighlight = true;
        this.queue.splice(insertAt, 0, track);
        anchorIndex = insertAt;
        this._priorityLastInsertedId = id;
        insertedTrackIds.push(id);
      }
      this._persistQueue();
      setTimeout(() => {
        insertedTrackIds.forEach((id) => {
          const track = this.queue.find((t) => (t.hash_id ?? t.id) === id);
          if (track && track._tempHighlight) {
            delete track._tempHighlight;
          }
        });
      }, 700);
      if (insertedTrackIds.length > 0) {
        playbackEventTracker.trackImmediate("queue_priority_next", {
          trigger_source: triggerSource,
          source,
          task_id: taskId || null,
          current_track_id: currentId,
          inserted_track_ids: insertedTrackIds,
          queue_length: this.queue.length,
          mode: this.mode
        });
        if (currentId && typeof window !== "undefined" && window.Android?.notifySongStarted) {
          try {
            const playerStore = usePlayerStore();
            if (playerStore.currentHashId === currentId) {
              const nextTrack = this.getNext(currentId);
              const nextHashId = nextTrack?.hash_id ?? nextTrack?.id ?? "";
              window.Android.notifySongStarted(currentId, nextHashId, playerStore.playMode || "");
              console.log(`[PlaylistStore] 队列变化，更新预缓存目标: next=${nextHashId}`);
            }
          } catch (e) {
            console.warn("[PlaylistStore] 更新预缓存通知失败:", e);
          }
        }
      }
    },
    resetPriorityTask() {
      this._priorityTaskId = null;
      this._priorityLastInsertedId = null;
    },
    // 添加歌曲到历史播放列表
    addToHistory(track) {
      if (!track) return;
      const cloned = track && typeof track === "object" ? { ...track } : track;
      this.historyQueue.unshift(cloned);
      if (this.historyQueue.length > 50) {
        this.historyQueue = this.historyQueue.slice(0, 50);
      }
    }
  }
});
const subscribers$1 = /* @__PURE__ */ new Set();
let installed$1 = false;
let previousTaskChangedHandler = null;
function onBiliDownload(callback) {
  subscribers$1.add(callback);
  return () => {
    subscribers$1.delete(callback);
  };
}
function emitBiliDownloadEvent(event) {
  if (!event) return;
  subscribers$1.forEach((callback) => {
    try {
      callback(event);
    } catch (error) {
      console.warn("[biliDownloadBus] listener error:", error);
    }
  });
}
function initBiliDownloadBus() {
  if (typeof window === "undefined" || installed$1) {
    return disposeBiliDownloadBus;
  }
  previousTaskChangedHandler = window.onDownloadTaskChanged?.__biliDownloadBus ? null : window.onDownloadTaskChanged;
  const taskChangedHandler = (event) => {
    const data = parseNativeEvent(event, "onDownloadTaskChanged");
    if (!data) return;
    emitBiliDownloadEvent(normalizeDownloadEvent({
      ...data,
      nativeEventName: "onDownloadTaskChanged"
    }));
    if (typeof previousTaskChangedHandler === "function" && previousTaskChangedHandler !== taskChangedHandler) {
      try {
        previousTaskChangedHandler(event);
      } catch (error) {
        console.warn("[biliDownloadBus] previous onDownloadTaskChanged failed:", error);
      }
    }
  };
  taskChangedHandler.__biliDownloadBus = true;
  window.onDownloadTaskChanged = taskChangedHandler;
  installed$1 = true;
  return disposeBiliDownloadBus;
}
function disposeBiliDownloadBus() {
  if (typeof window === "undefined" || !installed$1) return;
  if (window.onDownloadTaskChanged?.__biliDownloadBus) {
    window.onDownloadTaskChanged = previousTaskChangedHandler;
  }
  previousTaskChangedHandler = null;
  installed$1 = false;
}
function parseNativeEvent(event, handlerName) {
  if (typeof event !== "string") return event;
  try {
    return JSON.parse(event);
  } catch (error) {
    console.warn(`[biliDownloadBus] invalid native event from ${handlerName}:`, error, event);
    return null;
  }
}
function normalizeDownloadEvent(data) {
  const status = `${data?.status || ""}`.toLowerCase();
  const type = `${data?.type || ""}` || mapDownloadStatusToEventType(status);
  return {
    ...data,
    status,
    type,
    isUnifiedDownloadTaskEvent: data?.nativeEventName === "onDownloadTaskChanged"
  };
}
function mapDownloadStatusToEventType(status) {
  switch (`${status || ""}`.toLowerCase()) {
    case "queued":
    case "running":
    case "cancelling":
      return "start";
    case "progress":
      return "progress";
    case "success":
      return "success";
    case "failed":
    case "cancelled":
      return "error";
    default:
      return "";
  }
}
initBiliDownloadBus();
function formatTitle(song) {
  if (song?.local_identity_version === 2 && song?.local_file_name) return song.local_file_name;
  return song?.user_title || song?.title || "未知标题";
}
function localDirectory(song) {
  if (song?.local_identity_version !== 2) return "";
  const path = song.audio_local_path || song.local_path || song.path || "";
  return path.slice(0, path.lastIndexOf("/"));
}
function pickDisplayValue(...values) {
  for (const value of values) {
    if (value === null || value === void 0) continue;
    const text = `${value}`.trim();
    if (!text || text.toLowerCase() === "null" || text.toLowerCase() === "undefined") continue;
    return text;
  }
  return "";
}
function resolveArtistRaw(song) {
  return pickDisplayValue(
    song?.user_artist,
    song?.artist,
    song?.singer
  );
}
function resolveProducerRaw(song) {
  return pickDisplayValue(
    song?.user_uploader,
    song?.uploader,
    song?.producer,
    song?.author
  );
}
function resolveProducer(song) {
  return resolveProducerRaw(song) || "未知P主";
}
function formatPlaylistName(playlist) {
  if (!playlist?.user_name && playlist?.id === "bili_downloads") return "下载";
  return playlist?.user_name || playlist?.name || "未命名歌单";
}
function formatArtistProducer(song) {
  const directory = localDirectory(song);
  if (directory) return directory;
  const artist = resolveArtistRaw(song);
  const producer = resolveProducerRaw(song);
  if (producer && artist) {
    return producer === artist ? producer : `${producer} ${artist}`.trim();
  }
  if (producer) return producer;
  if (artist) return artist;
  return resolveProducer(song);
}
function processCoverUrl(data) {
  let url = "";
  if (typeof data === "string") {
    url = data;
  } else if (data && typeof data === "object") {
    url = data.cover_user_path || data.cover || "";
  }
  if (!url) return "";
  return url.replace(/^http:/i, "https:");
}
const BILI_HASH_DERIVED_COVER_RE = /^https?:\/\/i\d+\.hdslb\.com\/bfs\/music\/[0-9a-f]{2}\/[0-9a-f]{32}\/cover\.(jpg|jpeg|png)$/i;
function getBiliVideoUrl(song) {
  if (!song || typeof song !== "object") return "";
  const raw = typeof song.url === "string" ? song.url.trim() : "";
  return /bilibili\.com\/video/i.test(raw) ? raw : "";
}
function isTrustedBiliApiCoverUrl(raw) {
  const normalized = normalizeCoverUrl(raw);
  if (!/^https?:\/\//i.test(normalized)) return false;
  return !BILI_HASH_DERIVED_COVER_RE.test(normalized);
}
function getTrustedBiliApiCoverUrl(song) {
  if (!song || typeof song !== "object") return "";
  return [
    song.cover_bili_url,
    song.pic,
    song.cover
  ].map((v) => normalizeCoverUrl(v)).find((v) => isTrustedBiliApiCoverUrl(v)) || "";
}
function normalizeCoverUrl(raw) {
  if (typeof raw !== "string") return "";
  const value = raw.trim();
  if (!value || value === "null" || value.toLowerCase() === "no cover") return "";
  if (/^https?:\/\//i.test(value)) {
    return value.replace(/^http:/i, "https:");
  }
  if (value.startsWith("//")) {
    return `https:${value}`;
  }
  if (value.startsWith("/api/")) {
    return value;
  }
  return "";
}
function getSongCoverSrc(song, options = {}) {
  if (!song) return "";
  if (typeof song === "string") return normalizeCoverUrl(song);
  const userCoverPath = song.cover_user_path;
  if (userCoverPath) return userCoverPath.replace(/^http:/i, "https:");
  const hashId = song.hash_id || song.id;
  if (hashId) {
    const { search = false } = options;
    const qs = [];
    if (search) qs.push("scope=search");
    const hintedCover = getTrustedBiliApiCoverUrl(song) || [
      song.cover_bili_url,
      song.pic,
      song.cover
    ].map((v) => normalizeCoverUrl(v)).find((v) => /^https?:\/\//i.test(v));
    if (hintedCover) {
      qs.push(`bpic=${encodeURIComponent(hintedCover)}`);
    }
    const biliVideoUrl = getBiliVideoUrl(song);
    if (biliVideoUrl) {
      qs.push(`url=${encodeURIComponent(biliVideoUrl)}`);
    }
    return `/api/cover/${hashId}${qs.length ? `?${qs.join("&")}` : ""}`;
  }
  return getTrustedBiliApiCoverUrl(song) || "";
}
const SETTINGS_KEY = "download_task_settings_v1";
const MAX_TASK_LOGS = 120;
const DEFAULT_MAX_ATTEMPTS = 4;
const PANEL_VISIBLE_STATUSES = ["queued", "running", "paused", "success", "failed", "cancelled", "crashed"];
const ACTIVE_TASK_STATUSES = ["queued", "running", "paused"];
const NATIVE_DOWNLOAD_LOG_TAG = "TY_download_task";
const BILI_DOWNLOAD_TITLE_PREFIX_RE = /^(?:\s*bili-download\s*[:：]\s*)+/i;
const TASK_TYPE_DOWNLOAD_EXPLICIT = "download_explicit";
const TASK_TYPE_DOWNLOAD_CACHE = "download_cache";
const TASK_TYPE_DOWNLOAD_REPAIR = "download_repair";
const TASK_TYPE_DOWNLOAD_BACKFILL = "download_backfill";
const TASK_TYPE_DOWNLOAD_RECONCILE = "download_reconcile";
const TASK_TYPE_BROWSER_EXPORT = "browser_export_download";
const TASK_TYPE_COVER_DOWNLOAD = "cover_download";
const DEFAULT_DOWNLOAD_POLICY = {
  startupScanMode: "always",
  searchCacheMode: "current_track",
  autoRepairMode: "wifi_only",
  maxBackgroundDispatch: 1,
  maxManualDispatch: 2,
  maxGlobalDispatch: 3,
  panelShowBackgroundTasks: false,
  panelManualOnly: false
};
function uid(prefix = "task") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
function buildTaskId(taskType = TASK_TYPE_DOWNLOAD_EXPLICIT, timestamp = Date.now(), suffix = "") {
  const normalizedType = `${taskType || TASK_TYPE_DOWNLOAD_EXPLICIT}`.trim().replace(/[^a-zA-Z0-9_-]/g, "_") || TASK_TYPE_DOWNLOAD_EXPLICIT;
  const ts = Number.isFinite(timestamp) ? Math.trunc(timestamp) : Date.now();
  return suffix ? `${normalizedType}_${ts}_${suffix}` : `${normalizedType}_${ts}`;
}
function normalizeParallelism(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 2;
  return Math.min(4, Math.max(1, Math.trunc(n)));
}
function now() {
  return Date.now();
}
function sanitizeDownloadTitle(value) {
  const original = `${value || ""}`.trim();
  if (!original) return "";
  const cleaned = original.replace(BILI_DOWNLOAD_TITLE_PREFIX_RE, "").trim();
  return cleaned || original;
}
function normalizeTaskType(value, fallback = TASK_TYPE_DOWNLOAD_EXPLICIT) {
  const raw = `${value || ""}`.trim().toLowerCase();
  if (!raw) return fallback;
  return raw;
}
function getTaskPanelGroup(task) {
  const status = normalizeMainTaskStatus(task?.status, task?.businessStatus);
  if (["queued", "running", "paused"].includes(status)) return "active";
  if (status === "success") return "completed";
  if (["failed", "cancelled", "crashed"].includes(status)) return "exception";
  return "hidden";
}
function normalizeMainTaskStatus(status, businessStatus = "") {
  const business = `${businessStatus || ""}`.trim().toLowerCase();
  if (business === "retry_wait") return "queued";
  if (business === "cancelling") return "running";
  if (business === "failed_retryable" || business === "failed_final") return "failed";
  const raw = `${status || ""}`.trim().toLowerCase();
  switch (raw) {
    case "queued":
    case "retry_wait":
      return "queued";
    case "running":
    case "cancelling":
      return "running";
    case "paused":
    case "paused_queue":
      return "paused";
    case "success":
      return "success";
    case "failed":
    case "failed_retryable":
    case "failed_final":
      return "failed";
    case "cancelled":
      return "cancelled";
    case "crashed":
      return "crashed";
    default:
      return raw || "queued";
  }
}
function normalizeBusinessTaskStatus(value, mainStatus = "queued", payload = {}) {
  const raw = `${value || ""}`.trim().toLowerCase();
  switch (raw) {
    case "queued":
      return "queued";
    case "retry_wait":
      return "retry_wait";
    case "running":
      return "running";
    case "cancelling":
      return "cancelling";
    case "paused":
    case "paused_queue":
      return "paused";
    case "success":
      return "success";
    case "failed_retryable":
      return "failed_retryable";
    case "failed":
    case "failed_final":
      return "failed_final";
    case "cancelled":
      return "cancelled";
    case "crashed":
      return "crashed";
  }
  if (mainStatus === "failed") {
    const attempt = Number(payload?.attempt);
    const maxAttempts = Number(payload?.maxAttempts);
    const retryable = payload?.retryable === true && Number.isFinite(attempt) && Number.isFinite(maxAttempts) && attempt < maxAttempts;
    return retryable ? "failed_retryable" : "failed_final";
  }
  return mainStatus;
}
function getTaskTypeLabel(taskType) {
  switch (normalizeTaskType(taskType, "")) {
    case TASK_TYPE_DOWNLOAD_EXPLICIT:
      return "手动下载";
    case TASK_TYPE_DOWNLOAD_CACHE:
      return "缓存任务";
    case TASK_TYPE_DOWNLOAD_REPAIR:
      return "资源修复";
    case TASK_TYPE_DOWNLOAD_BACKFILL:
      return "启动补全";
    case TASK_TYPE_DOWNLOAD_RECONCILE:
      return "索引补账";
    case TASK_TYPE_BROWSER_EXPORT:
      return "浏览器导出";
    default:
      return "下载任务";
  }
}
function isPrimaryPanelTask(task) {
  const type = normalizeTaskType(task?.type, "");
  return type !== TASK_TYPE_COVER_DOWNLOAD;
}
function isBackgroundTaskType(taskOrType) {
  const type = normalizeTaskType(typeof taskOrType === "string" ? taskOrType : taskOrType?.type, "");
  return type === TASK_TYPE_DOWNLOAD_REPAIR || type === TASK_TYPE_DOWNLOAD_BACKFILL || type === TASK_TYPE_DOWNLOAD_RECONCILE || type === TASK_TYPE_DOWNLOAD_CACHE;
}
function normalizeRuntimeProgress(value) {
  const progress = Number(value);
  if (!Number.isFinite(progress)) return null;
  return Math.min(100, Math.max(0, Math.trunc(progress)));
}
function normalizeRuntimeSpeed(value) {
  const speedKbps = Number(value);
  if (!Number.isFinite(speedKbps) || speedKbps < 0) return null;
  return speedKbps;
}
function normalizeTaskBehavior(source = {}, taskType = "") {
  const payload = objectOrEmpty(source);
  const rawBehavior = objectOrEmpty(payload.taskBehavior || payload.behavior || payload);
  const rawCapabilities = objectOrEmpty(payload.capabilities || rawBehavior.capabilities);
  const normalizedType = normalizeTaskType(taskType || payload.taskType || "", TASK_TYPE_DOWNLOAD_EXPLICIT);
  const systemTask = isBackgroundTaskType(normalizedType);
  const visibility = `${rawBehavior.visibility || payload.visibility || (systemTask ? "system" : "manual")}`.trim() || "manual";
  const controlLevel = `${rawBehavior.controlLevel || payload.controlLevel || (systemTask ? "cancel_only" : "full")}`.trim() || "full";
  const canPauseRunning = rawCapabilities.pause === true || rawBehavior.runningPausable === true;
  return {
    visibleInPanel: normalizedType !== TASK_TYPE_COVER_DOWNLOAD,
    visibility,
    controlLevel,
    capabilities: {
      cancel: rawCapabilities.cancel !== false,
      pauseQueue: rawCapabilities.pauseQueue !== false,
      resumeQueue: rawCapabilities.resumeQueue === true,
      cancelRunning: rawCapabilities.cancelRunning === true,
      pause: canPauseRunning,
      resume: canPauseRunning,
      pauseRunning: rawCapabilities.pauseRunning === true && canPauseRunning,
      resumeRunning: rawCapabilities.resumeRunning === true && canPauseRunning,
      retry: rawCapabilities.retry !== false && normalizedType !== TASK_TYPE_COVER_DOWNLOAD,
      delete: rawCapabilities.delete !== false,
      prioritize: rawCapabilities.prioritize === true
    }
  };
}
function applyNativeRuntimeSnapshot(task, payload = {}) {
  if (!task || typeof task !== "object") return false;
  let changed = false;
  const progress = normalizeRuntimeProgress(payload.progress);
  const speedKbps = normalizeRuntimeSpeed(payload.speedKbps);
  if (progress !== null && task.progress !== progress) {
    task.progress = progress;
    changed = true;
  }
  if (speedKbps !== null && task.speedKbps !== speedKbps) {
    task.speedKbps = speedKbps;
    changed = true;
  }
  const stage = `${payload.stage || ""}`.trim();
  if (stage) {
    const current = objectOrEmpty(task.runtime);
    if (current.stage !== stage) {
      task.runtime = { ...current, stage };
      changed = true;
    }
  }
  for (const field of ["startedAt", "lastProgressAt", "deadlineAt"]) {
    const value = Number(payload[field]);
    if (Number.isFinite(value) && task[field] !== value) {
      task[field] = value;
      const current = objectOrEmpty(task.runtime);
      task.runtime = { ...current, [field]: value };
      changed = true;
    }
  }
  const watchdog = objectOrEmpty(payload.watchdog);
  if (Object.keys(watchdog).length > 0) {
    task.watchdog = { ...watchdog };
    const current = objectOrEmpty(task.runtime);
    task.runtime = { ...current, watchdog: task.watchdog };
    changed = true;
  }
  if (Number.isFinite(payload.attempt) && task.attempt !== payload.attempt) {
    task.attempt = payload.attempt;
    changed = true;
  }
  if (Number.isFinite(payload.maxAttempts) && task.maxAttempts !== payload.maxAttempts) {
    task.maxAttempts = payload.maxAttempts;
    changed = true;
  }
  if (Number.isFinite(payload.nextRunAt) && task.nextRunAt !== payload.nextRunAt) {
    task.nextRunAt = payload.nextRunAt;
    changed = true;
  }
  if (Number.isFinite(payload.backoffMs) && task.backoffMs !== payload.backoffMs) {
    task.backoffMs = payload.backoffMs;
    changed = true;
  }
  if (typeof payload.lastErrorType === "string" && task.lastErrorType !== payload.lastErrorType) {
    task.lastErrorType = payload.lastErrorType;
    changed = true;
  }
  return changed;
}
function normalizeDownloadPolicy(value = {}) {
  const source = value && typeof value === "object" ? value : {};
  const startupScanMode = ["off", "manual", "always"].includes(`${source.startupScanMode || ""}`.toLowerCase()) ? `${source.startupScanMode}`.toLowerCase() : DEFAULT_DOWNLOAD_POLICY.startupScanMode;
  const searchCacheMode = `${source.searchCacheMode || ""}`.toLowerCase() === "off" ? "off" : DEFAULT_DOWNLOAD_POLICY.searchCacheMode;
  const autoRepairMode = ["off", "wifi_only", "always"].includes(`${source.autoRepairMode || ""}`.toLowerCase()) ? `${source.autoRepairMode}`.toLowerCase() : DEFAULT_DOWNLOAD_POLICY.autoRepairMode;
  const maxBackgroundDispatch = Number.isFinite(source.maxBackgroundDispatch) ? Math.min(4, Math.max(1, Math.trunc(source.maxBackgroundDispatch))) : DEFAULT_DOWNLOAD_POLICY.maxBackgroundDispatch;
  const maxManualDispatch = Number.isFinite(source.maxManualDispatch) ? Math.min(4, Math.max(1, Math.trunc(source.maxManualDispatch))) : DEFAULT_DOWNLOAD_POLICY.maxManualDispatch;
  const maxGlobalDispatch = Number.isFinite(source.maxGlobalDispatch) ? Math.min(6, Math.max(1, Math.trunc(source.maxGlobalDispatch))) : DEFAULT_DOWNLOAD_POLICY.maxGlobalDispatch;
  return {
    ...DEFAULT_DOWNLOAD_POLICY,
    startupScanMode,
    searchCacheMode,
    autoRepairMode,
    maxBackgroundDispatch,
    maxManualDispatch,
    maxGlobalDispatch,
    panelShowBackgroundTasks: source.panelShowBackgroundTasks === true,
    panelManualOnly: source.panelManualOnly === true
  };
}
function normalizeNativeErrorInfo(payload = {}, fallbackMessage = "") {
  const structured = objectOrEmpty(payload?.downloadError);
  const technicalMessage = structured.technicalMessage || `${fallbackMessage || payload?.message || ""}`.trim();
  const userMessage = structured.userMessage || technicalMessage;
  if (!technicalMessage && !userMessage && !structured.errorType) return null;
  return {
    errorType: structured.errorType || "",
    retryable: structured.retryable !== false,
    userMessage: userMessage || "",
    technicalMessage: technicalMessage || "",
    stage: structured.stage || ""
  };
}
function getNativeControlAction(message) {
  const text = `${message || ""}`.toLowerCase();
  if (!text) return "";
  if (text.includes("download-pause-requested") || text.includes("下载已暂停")) {
    return "pause";
  }
  if (text.includes("download-cancel-requested") || text.includes("下载已取消")) {
    return "cancel";
  }
  return "";
}
function cloneVideoForTask(video) {
  if (!video || typeof video !== "object") return {};
  const hashId = video.hashId || video.hash_id || video.id || video.song_hash_id || "";
  const artist = video.artist || "";
  const producer = video.producer || video.uploader || video.author || "";
  const uploader = video.uploader || video.producer || video.author || "";
  const author = video.author || producer || artist || "";
  return {
    url: video.url || "",
    title: sanitizeDownloadTitle(video.title || ""),
    bvid: video.bvid || "",
    cover: getTrustedBiliApiCoverUrl(video) || video.cover || "",
    artist,
    producer,
    uploader,
    author,
    hashId,
    dedupeKey: video.dedupeKey || ""
  };
}
function normalizeBiliDownloadUrl(url) {
  return `${url || ""}`.trim().replace(/\\/g, "/").replace(/^http:\/\//i, "https://").split("?")[0].split("#")[0].replace(/\/+$/, "").toLowerCase();
}
function extractBvidFromUrl(url) {
  return `${url || ""}`.match(/BV[0-9A-Za-z]{10}/)?.[0] || "";
}
function resolveVideoId(video = {}, fallback = "") {
  const bvid = `${video?.bvid || ""}`.trim() || extractBvidFromUrl(video?.url || "");
  if (bvid) return bvid.toUpperCase();
  return `${fallback || ""}`.trim();
}
function resolveResourceTier(taskType) {
  switch (normalizeTaskType(taskType, "")) {
    case TASK_TYPE_DOWNLOAD_CACHE:
      return "TEMP_CACHE";
    case TASK_TYPE_DOWNLOAD_REPAIR:
      return "PLAYLIST_BACKUP";
    case TASK_TYPE_DOWNLOAD_BACKFILL:
    case TASK_TYPE_DOWNLOAD_RECONCILE:
    case TASK_TYPE_DOWNLOAD_EXPLICIT:
      return "PERSISTENT_BILI";
    default:
      return "PERSISTENT_BILI";
  }
}
function getTaskIdentity(video) {
  if (!video || typeof video !== "object") return "";
  const explicitKey = `${video.dedupeKey || ""}`.trim();
  if (explicitKey) return explicitKey;
  const hashId = `${video.hashId || video.hash_id || video.id || ""}`.trim();
  if (hashId) return `song:${hashId}`;
  const bvid = `${video.bvid || extractBvidFromUrl(video.url)}`.trim();
  if (bvid) return `bvid:${bvid.toUpperCase()}`;
  const url = `${video.url || ""}`.trim();
  if (url) return `url:${normalizeBiliDownloadUrl(url)}`;
  return "";
}
function getStoredTaskIdentity(task) {
  if (!task || typeof task !== "object") return "";
  return task.dedupeKey || getTaskIdentity(task.video || {});
}
function objectOrEmpty(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
function getNativeTaskPayload(nativeTask) {
  const payload = objectOrEmpty(nativeTask?.payload);
  const result = objectOrEmpty(nativeTask?.result);
  return {
    ...payload,
    ...result,
    resourceDbCommit: result.resourceDbCommit || payload.resourceDbCommit || null
  };
}
function applyNativeArtifacts(task, payload = {}) {
  if (!task || typeof task !== "object") return false;
  let changed = false;
  const commit = objectOrEmpty(payload.resourceDbCommit);
  const filePath = payload.filePath || commit.audioPath || "";
  const coverPath = payload.coverPath || commit.coverPath || "";
  if (payload.resourceDbCommit && task.resourceDbCommit !== payload.resourceDbCommit) {
    task.resourceDbCommit = payload.resourceDbCommit;
    changed = true;
  }
  if (filePath && task.filePath !== filePath) {
    task.filePath = filePath;
    changed = true;
  }
  if (coverPath && task.coverPath !== coverPath) {
    task.coverPath = coverPath;
    changed = true;
  }
  return changed;
}
function normalizeIncomingNativeEvent(payload = {}) {
  const status = `${payload.status || ""}`.toLowerCase();
  const type = `${payload.type || ""}`.toLowerCase();
  if (type) return { ...payload, type, status };
  switch (status) {
    case "queued":
    case "running":
    case "cancelling":
      return { ...payload, type: "start", status };
    case "progress":
      return { ...payload, type: "progress", status };
    case "success":
      return { ...payload, type: "success", status };
    case "failed":
    case "cancelled":
      return { ...payload, type: "error", status };
    default:
      return { ...payload, type, status };
  }
}
const useDownloadTaskStore = defineStore("downloadTask", {
  state: () => ({
    tasks: [],
    parallelism: 2,
    pausedAll: false,
    policy: normalizeDownloadPolicy(),
    nativeStats: null,
    initialized: false,
    recoveryScheduled: false,
    _recoveryTimer: null,
    _cleanupTimer: null,
    _nativeSyncTimer: null,
    _busUnsubscribe: null,
    _lastPersistAt: 0
  }),
  getters: {
    visibleTasks: (state) => state.tasks.filter((task) => task.visibleInPanel !== false).filter((task) => PANEL_VISIBLE_STATUSES.includes(normalizeMainTaskStatus(task.status, task.businessStatus))).sort((a, b) => {
      if (a.batchId && b.batchId && a.batchId === b.batchId) {
        return (a.batchIndex || 0) - (b.batchIndex || 0);
      }
      return (a.queueOrderHint || a.createdAt || 0) - (b.queueOrderHint || b.createdAt || 0);
    })
  },
  actions: {
    initDeferred(delayMs = 2200) {
      if (this.initialized || this.recoveryScheduled) return;
      this.recoveryScheduled = true;
      this._recoveryTimer = window.setTimeout(() => {
        this._recoveryTimer = null;
        this._initNow();
      }, Math.max(0, delayMs));
    },
    ensureInitializedNow() {
      if (this.initialized) {
        this._restoreFromNativeTaskLogs();
        return;
      }
      if (this._recoveryTimer) {
        clearTimeout(this._recoveryTimer);
        this._recoveryTimer = null;
      }
      this.recoveryScheduled = false;
      this._initNow();
    },
    _initNow() {
      if (this.initialized) return;
      this._loadPersistedState();
      this._busUnsubscribe = onBiliDownload(this._handleNativeDownloadEvent);
      this.initialized = true;
      this._postNativeLog("store-init", { persistedCount: this.tasks.length });
      this.syncDownloadPolicyFromNative();
      this.syncDownloadStatsFromNative();
      this._restoreFromNativeTaskLogs();
      this._reconcileFromRecentNativeTaskLogs();
      this._cleanupTimer = window.setInterval(() => {
        this._pruneOldTasks();
      }, 5 * 60 * 1e3);
    },
    dispose() {
      if (this._recoveryTimer) {
        clearTimeout(this._recoveryTimer);
        this._recoveryTimer = null;
      }
      if (this._cleanupTimer) {
        clearInterval(this._cleanupTimer);
        this._cleanupTimer = null;
      }
      if (this._nativeSyncTimer) {
        clearTimeout(this._nativeSyncTimer);
        this._nativeSyncTimer = null;
      }
      if (this._busUnsubscribe) {
        this._busUnsubscribe();
        this._busUnsubscribe = null;
      }
      this.nativeStats = null;
      this.initialized = false;
      this.recoveryScheduled = false;
    },
    _scheduleNativeSync(delayMs = 220) {
      if (this._nativeSyncTimer) return;
      this._nativeSyncTimer = window.setTimeout(() => {
        this._nativeSyncTimer = null;
        this._restoreFromNativeTaskLogs();
        this.syncDownloadStatsFromNative();
      }, Math.max(0, delayMs));
    },
    _loadPersistedState() {
      const savedSettings = storage.getJSON(SETTINGS_KEY, {});
      this.tasks = [];
      this.parallelism = normalizeParallelism(savedSettings.parallelism);
      this.policy = normalizeDownloadPolicy(savedSettings.policy || {});
    },
    _persistState(force = false) {
      const ts = now();
      if (!force && ts - this._lastPersistAt < 120) return;
      this._lastPersistAt = ts;
      storage.setJSON(SETTINGS_KEY, {
        parallelism: this.parallelism,
        policy: this.policy
      });
    },
    _appendTaskLog(task, action, message, extra = null) {
      if (!task || typeof task !== "object") return;
      if (!Array.isArray(task.logs)) task.logs = [];
      task.logs.push({
        at: now(),
        action,
        message,
        extra
      });
      if (task.logs.length > MAX_TASK_LOGS) {
        task.logs = task.logs.slice(task.logs.length - MAX_TASK_LOGS);
      }
    },
    async _postNativeLog(step, extra = {}) {
      try {
        await apiRequest("/api/log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: {
            tag: NATIVE_DOWNLOAD_LOG_TAG,
            step,
            propsId: "download_task_store",
            extra,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          }
        });
      } catch (_) {
      }
    },
    async syncDownloadPolicyFromNative() {
      try {
        const response = await apiRequest("/api/download-policy");
        if (!response?.ok) return this.policy;
        const data = await response.json().catch(() => ({}));
        const nextPolicy = normalizeDownloadPolicy(data?.data?.policy || data?.policy || {});
        this.policy = nextPolicy;
        this._persistState(true);
        return nextPolicy;
      } catch (_) {
        return this.policy;
      }
    },
    async syncDownloadStatsFromNative() {
      try {
        const response = await apiRequest("/api/download-stats");
        if (!response?.ok) return this.nativeStats;
        const data = await response.json().catch(() => ({}));
        const stats = objectOrEmpty(data?.data || data?.stats || data || {});
        this.nativeStats = Object.keys(stats).length > 0 ? stats : this.nativeStats;
        return this.nativeStats;
      } catch (_) {
        return this.nativeStats;
      }
    },
    async _refreshNativeDownloadTasks(delayMs = 0) {
      if (delayMs > 0) {
        await new Promise((resolve) => window.setTimeout(resolve, delayMs));
      }
      await this._restoreFromNativeTaskLogs();
      await this._reconcileFromRecentNativeTaskLogs(320);
      await this.syncDownloadStatsFromNative();
    },
    _unwrapNativeControlResponse(data = {}) {
      return objectOrEmpty(data?.data || data);
    },
    async _batchNativeTaskControl(action, scope = {}) {
      try {
        const response = await apiRequest("/api/download-tasks/batch-control", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: { action, scope }
        });
        const data = await response.json().catch(() => ({}));
        const payload = this._unwrapNativeControlResponse(data);
        if (objectOrEmpty(payload.stats) && Object.keys(payload.stats).length > 0) {
          this.nativeStats = payload.stats;
        }
        if (!response.ok || payload.success === false) {
          throw new Error(data.error || payload.error || payload.reason || `native-batch-control-failed(${response.status})`);
        }
        const affected = Array.isArray(payload.affected) ? payload.affected : [];
        if (payload.effectiveAction === "delete" && affected.length > 0) {
          const affectedSet = new Set(affected);
          this.tasks = this.tasks.filter((task) => !affectedSet.has(task.id));
          this._persistState(true);
        }
        await this._refreshNativeDownloadTasks(120);
        return { ok: true, accepted: payload.accepted, data: payload };
      } catch (error) {
        this._postNativeLog("native-batch-control-request-failed", {
          action,
          error: error?.message || ""
        });
        this._scheduleNativeSync(260);
        return { ok: false, error };
      }
    },
    async updateDownloadPolicy(patch = {}) {
      const nextPolicy = normalizeDownloadPolicy({
        ...this.policy,
        ...patch
      });
      this.policy = nextPolicy;
      this._persistState(true);
      try {
        const response = await apiRequest("/api/download-policy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: nextPolicy
        });
        if (response?.ok) {
          const data = await response.json().catch(() => ({}));
          this.policy = normalizeDownloadPolicy(data?.data?.policy || data?.policy || nextPolicy);
          this._persistState(true);
        }
      } catch (_) {
      }
      return this.policy;
    },
    canStartSearchCache() {
      return this.policy.searchCacheMode !== "off";
    },
    canStartStartupScan() {
      return this.policy.startupScanMode !== "off" && this.policy.startupScanMode !== "manual";
    },
    canShowBackgroundTasks() {
      return this.policy.panelShowBackgroundTasks === true;
    },
    _buildNativeDownloadRequest(task) {
      if (!task || !task.video?.url) return null;
      const body = {
        url: task.video.url,
        title: task.video.title,
        artist: task.video.artist,
        producer: task.video.producer,
        uploader: task.video.uploader,
        author: task.video.author,
        bvid: task.video.bvid,
        cover: task.video.cover,
        source: task.taskSource || task.source || "",
        taskType: normalizeTaskType(task.type, TASK_TYPE_DOWNLOAD_EXPLICIT),
        cacheMode: normalizeTaskType(task.type, "") === TASK_TYPE_DOWNLOAD_CACHE,
        clientTaskId: task.id,
        dedupeKey: getStoredTaskIdentity(task),
        queueOrderHint: Number.isFinite(task.queueOrderHint) ? task.queueOrderHint : task.createdAt || now(),
        maxAttempts: Number.isFinite(task.maxAttempts) ? task.maxAttempts : DEFAULT_MAX_ATTEMPTS
      };
      if (task.video.hashId) body.forcedSongId = task.video.hashId;
      if (task.playlistItemId) body.playlistItemId = task.playlistItemId;
      return body;
    },
    async _createNativeDownloadTask(task) {
      const body = this._buildNativeDownloadRequest(task);
      if (!body) return { ok: false, reason: "invalid-task" };
      try {
        const response = await apiRequest("/api/download-tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body
        });
        const data = await response.json().catch(() => ({}));
        const payload = this._unwrapNativeControlResponse(data);
        if (!response.ok || !payload.success && payload.status !== "queued") {
          throw new Error(data.error || payload.error || `任务启动失败(${response.status})`);
        }
        const nativeTaskId = `${payload.taskId || payload.existingTaskId || ""}`.trim();
        const duplicate = payload.duplicate === true || nativeTaskId && nativeTaskId !== task.id;
        if (duplicate && nativeTaskId && nativeTaskId !== task.id) {
          this.tasks = this.tasks.filter((item) => item.id !== task.id);
          this._persistState(true);
        } else {
          task.updatedAt = now();
          this._appendTaskLog(task, "native_create", duplicate ? "native-task-duplicate" : "native-task-created", {
            nativeTaskId: nativeTaskId || task.id,
            status: payload.status || ""
          });
          this._persistState(true);
        }
        await this._refreshNativeDownloadTasks(180);
        return { ok: true, duplicate, taskId: nativeTaskId || task.id, data: payload };
      } catch (error) {
        const currentTask = this._findTask(task.id);
        if (currentTask) {
          currentTask.status = "failed";
          currentTask.businessStatus = "failed_final";
          currentTask.speedKbps = 0;
          currentTask.errorMessage = error?.message || "任务启动失败";
          currentTask.updatedAt = now();
          currentTask.endedAt = now();
          currentTask.nextRunAt = 0;
          this._appendTaskLog(currentTask, "native_create_failed", "native-task-create-failed", {
            error: error?.message || ""
          });
          this._persistState(true);
        }
        this._postNativeLog("native-task-create-failed", {
          taskId: task.id,
          error: error?.message || ""
        });
        this._scheduleNativeSync(260);
        return { ok: false, error };
      }
    },
    async clearCompletedTasks() {
      await this._batchNativeTaskControl("delete", {
        status: ["success"]
      });
    },
    async clearCancelledTasks() {
      await this._batchNativeTaskControl("delete", {
        status: ["cancelled"]
      });
    },
    async _fetchNativeDownloadTaskLogs({ activeOnly = false, limit = 200 } = {}) {
      const safeLimit = Number.isFinite(limit) ? Math.min(600, Math.max(1, Math.trunc(limit))) : 200;
      const queryPrefix = activeOnly ? "active=1&" : "";
      try {
        const response = await apiRequest(`/api/download-tasks?${queryPrefix}limit=${safeLimit}`);
        if (response?.ok) {
          const data = await response.json().catch(() => ({}));
          const nativeTasks = Array.isArray(data?.data?.tasks) ? data.data.tasks : Array.isArray(data?.tasks) ? data.tasks : [];
          const stats = objectOrEmpty(data?.data?.stats || data?.stats || {});
          if (Object.keys(stats).length > 0) this.nativeStats = stats;
          if (nativeTasks.length > 0 || Array.isArray(data?.data?.tasks) || Array.isArray(data?.tasks)) {
            return nativeTasks;
          }
        }
      } catch (_) {
      }
      return [];
    },
    _mapNativeStatusToLocal(nativeTask) {
      const status = `${nativeTask?.status || nativeTask || ""}`.toLowerCase();
      const businessStatus = `${nativeTask?.businessStatus || ""}`.toLowerCase();
      const payload = getNativeTaskPayload(nativeTask);
      const nativeError = `${nativeTask?.error || ""}`;
      const controlAction = `${payload?.controlAction || getNativeControlAction(nativeError)}`.toLowerCase();
      if (businessStatus) {
        return normalizeMainTaskStatus(status, businessStatus);
      }
      if (controlAction === "pause") return "paused";
      if (controlAction === "cancel" && status === "failed") return "cancelled";
      return normalizeMainTaskStatus(status);
    },
    _mapNativeBusinessStatus(nativeTask, mappedStatus = "") {
      const payload = getNativeTaskPayload(nativeTask);
      const mainStatus = normalizeMainTaskStatus(mappedStatus || nativeTask?.status || "", nativeTask?.businessStatus || "");
      const explicitBusinessStatus = `${nativeTask?.businessStatus || ""}`.toLowerCase();
      if (explicitBusinessStatus) {
        return normalizeBusinessTaskStatus(explicitBusinessStatus, mainStatus, payload);
      }
      const nativeError = `${nativeTask?.error || ""}`;
      const controlAction = `${payload?.controlAction || getNativeControlAction(nativeError)}`.toLowerCase();
      if (controlAction === "pause") return "paused";
      if (controlAction === "cancel" && mainStatus === "failed") return "cancelled";
      return normalizeBusinessTaskStatus(payload?.status || nativeTask?.status || "", mainStatus, payload);
    },
    async _restoreFromNativeTaskLogs() {
      try {
        const nativeTasks = await this._fetchNativeDownloadTaskLogs({ activeOnly: true, limit: 200 });
        if (nativeTasks.length === 0) return;
        let changed = false;
        nativeTasks.forEach((nativeTask) => {
          const taskId = `${nativeTask?.taskId || ""}`.trim();
          if (!taskId) return;
          const payload = getNativeTaskPayload(nativeTask);
          const taskType = normalizeTaskType(nativeTask?.taskType || payload?.taskType || "");
          if (taskType === TASK_TYPE_COVER_DOWNLOAD) return;
          const taskBehavior = normalizeTaskBehavior(payload, taskType);
          const mappedStatus = this._mapNativeStatusToLocal(nativeTask);
          const mappedBusinessStatus = this._mapNativeBusinessStatus(nativeTask, mappedStatus);
          const createdAt = Number.isFinite(nativeTask?.createdAt) ? nativeTask.createdAt : now();
          const queueOrderHint = Number.isFinite(payload?.queueOrderHint) ? payload.queueOrderHint : createdAt;
          const identity = getTaskIdentity({
            dedupeKey: payload?.dedupeKey || "",
            hashId: payload?.hashId || "",
            bvid: payload?.bvid || "",
            url: payload?.url || ""
          });
          let existing = this._findTask(taskId);
          if (!existing && identity) {
            existing = this.tasks.find((item) => {
              if (!ACTIVE_TASK_STATUSES.includes(normalizeMainTaskStatus(item.status, item.businessStatus))) return false;
              return getStoredTaskIdentity(item) === identity;
            }) || null;
            if (existing) {
              this._appendTaskLog(existing, "native_bind", "reuse-active-task-by-identity", {
                nativeTaskId: taskId,
                identity
              });
              changed = true;
            }
          }
          if (existing) {
            if (!existing.dedupeKey && identity) {
              existing.dedupeKey = identity;
              changed = true;
            }
            const nextTaskSource = `${payload?.taskSource || existing.taskSource || existing.source || ""}`.trim();
            const nextResourceTier = `${payload?.resourceTier || existing.resourceTier || resolveResourceTier(existing.type)}`.trim();
            const nextVideoId = `${payload?.videoId || existing.videoId || resolveVideoId(existing.video || {}, payload?.bvid || "")}`.trim();
            const nextPlaylistItemId = `${payload?.playlistItemId || existing.playlistItemId || ""}`.trim();
            if (existing.taskSource !== nextTaskSource) {
              existing.taskSource = nextTaskSource;
              changed = true;
            }
            if (existing.resourceTier !== nextResourceTier) {
              existing.resourceTier = nextResourceTier;
              changed = true;
            }
            if (existing.videoId !== nextVideoId) {
              existing.videoId = nextVideoId;
              changed = true;
            }
            if (existing.playlistItemId !== nextPlaylistItemId) {
              existing.playlistItemId = nextPlaylistItemId;
              changed = true;
            }
            if (JSON.stringify(existing.taskBehavior || null) !== JSON.stringify(taskBehavior)) {
              existing.taskBehavior = taskBehavior;
              existing.visibleInPanel = taskBehavior.visibleInPanel !== false;
              changed = true;
            }
            if (applyNativeRuntimeSnapshot(existing, payload)) changed = true;
            const nativeErrorInfo = normalizeNativeErrorInfo(payload, nativeTask?.error || "");
            if (nativeErrorInfo && JSON.stringify(existing.errorInfo || null) !== JSON.stringify(nativeErrorInfo)) {
              existing.errorInfo = nativeErrorInfo;
              if (nativeErrorInfo.userMessage) existing.errorMessage = nativeErrorInfo.userMessage;
              changed = true;
            }
            const mergedTitle = sanitizeDownloadTitle(existing.video?.title || payload?.title || nativeTask?.title || "");
            if (mergedTitle && mergedTitle !== (existing.video?.title || "")) {
              existing.video = {
                ...existing.video || {},
                title: mergedTitle
              };
              changed = true;
            }
            if (existing.businessStatus !== mappedBusinessStatus) {
              existing.businessStatus = mappedBusinessStatus;
              changed = true;
            }
            const localTerminal = ["success", "cancelled", "failed", "crashed"].includes(normalizeMainTaskStatus(existing.status, existing.businessStatus));
            const nativeRecoverable = ["queued", "running", "paused"].includes(mappedStatus);
            if ((!localTerminal || !nativeRecoverable) && existing.status !== mappedStatus) {
              existing.status = mappedStatus;
              existing.updatedAt = now();
              this._appendTaskLog(existing, "native_sync", "merged-active-task-from-sqlite", {
                nativeStatus: nativeTask?.status || ""
              });
              changed = true;
            }
            return;
          }
          const restoredTask = {
            id: taskId,
            type: taskType || TASK_TYPE_DOWNLOAD_EXPLICIT,
            source: payload?.source || "native_recovery",
            video: cloneVideoForTask({
              url: payload?.url || "",
              title: payload?.title || nativeTask?.title || "",
              bvid: payload?.bvid || "",
              artist: payload?.artist || "",
              producer: payload?.producer || "",
              uploader: payload?.uploader || "",
              author: payload?.author || "",
              hashId: payload?.hashId || "",
              dedupeKey: payload?.dedupeKey || ""
            }),
            dedupeKey: payload?.dedupeKey || identity,
            status: mappedStatus,
            businessStatus: mappedBusinessStatus,
            progress: mappedStatus === "success" ? 100 : normalizeRuntimeProgress(payload?.progress) || 0,
            speedKbps: normalizeRuntimeSpeed(payload?.speedKbps) || 0,
            errorMessage: "",
            attempt: Number.isFinite(payload?.attempt) ? payload.attempt : 0,
            maxAttempts: Number.isFinite(payload?.maxAttempts) ? payload.maxAttempts : DEFAULT_MAX_ATTEMPTS,
            createdAt,
            updatedAt: Number.isFinite(nativeTask?.updatedAt) ? nativeTask.updatedAt : createdAt,
            startedAt: Number.isFinite(payload?.startedAt) ? payload.startedAt : 0,
            lastProgressAt: Number.isFinite(payload?.lastProgressAt) ? payload.lastProgressAt : 0,
            deadlineAt: Number.isFinite(payload?.deadlineAt) ? payload.deadlineAt : 0,
            endedAt: 0,
            batchId: "",
            batchIndex: 0,
            queueOrderHint,
            nextRunAt: Number.isFinite(payload?.nextRunAt) ? payload.nextRunAt : 0,
            priority: "normal",
            visibleInPanel: taskBehavior.visibleInPanel !== false,
            filePath: payload?.filePath || payload?.resourceDbCommit?.audioPath || "",
            coverPath: payload?.coverPath || payload?.resourceDbCommit?.coverPath || "",
            resourceDbCommit: payload?.resourceDbCommit || null,
            errorInfo: normalizeNativeErrorInfo(payload, nativeTask?.error || ""),
            watchdog: objectOrEmpty(payload?.watchdog),
            runtime: {
              ...payload?.stage ? { stage: `${payload.stage}` } : {},
              ...Number.isFinite(payload?.lastProgressAt) ? { lastProgressAt: payload.lastProgressAt } : {},
              ...Number.isFinite(payload?.deadlineAt) ? { deadlineAt: payload.deadlineAt } : {},
              ...Object.keys(objectOrEmpty(payload?.watchdog)).length > 0 ? { watchdog: objectOrEmpty(payload.watchdog) } : {}
            },
            taskBehavior,
            taskSource: payload?.taskSource || payload?.source || "native_recovery",
            resourceTier: payload?.resourceTier || resolveResourceTier(taskType),
            videoId: payload?.videoId || resolveVideoId({
              bvid: payload?.bvid || "",
              url: payload?.url || ""
            }),
            playlistItemId: payload?.playlistItemId || "",
            logs: [{
              at: now(),
              action: "restored_native",
              message: "restored-from-download-task-api",
              extra: { nativeStatus: nativeTask?.status || "" }
            }]
          };
          this.tasks.push(restoredTask);
          changed = true;
        });
        if (changed) {
          this._persistState(true);
          this._postNativeLog("restore-active-from-sqlite", { nativeCount: nativeTasks.length, localCount: this.tasks.length });
        }
      } catch (_) {
      }
    },
    async _reconcileFromRecentNativeTaskLogs(limit = 260) {
      try {
        const safeLimit = Number.isFinite(limit) ? Math.min(600, Math.max(50, Math.trunc(limit))) : 260;
        const nativeTasks = await this._fetchNativeDownloadTaskLogs({ activeOnly: false, limit: safeLimit });
        if (nativeTasks.length === 0) return;
        const byTaskId = /* @__PURE__ */ new Map();
        nativeTasks.forEach((nativeTask) => {
          const taskId = `${nativeTask?.taskId || ""}`.trim();
          if (!taskId) return;
          const payload = getNativeTaskPayload(nativeTask);
          const taskType = normalizeTaskType(nativeTask?.taskType || payload?.taskType || "");
          if (taskType === TASK_TYPE_COVER_DOWNLOAD) return;
          byTaskId.set(taskId, nativeTask);
        });
        let changed = false;
        const tasksById = new Map(this.tasks.map((task) => [task.id, task]));
        byTaskId.forEach((nativeTask, taskId) => {
          const nativeStatus = `${nativeTask?.status || ""}`.toLowerCase();
          const payload = getNativeTaskPayload(nativeTask);
          let task = tasksById.get(taskId);
          if (!task) {
            const identity = getTaskIdentity({
              dedupeKey: payload?.dedupeKey || "",
              hashId: payload?.hashId || "",
              bvid: payload?.bvid || "",
              url: payload?.url || ""
            });
            if (identity) {
              task = this.tasks.find((item) => {
                if (item.status === "cancelled") return false;
                return getStoredTaskIdentity(item) === identity;
              }) || null;
            }
          }
          if (task?.status === "cancelled" && nativeStatus !== "success") return;
          if (task) {
            const mappedStatus2 = this._mapNativeStatusToLocal(nativeTask);
            const mappedBusinessStatus2 = this._mapNativeBusinessStatus(nativeTask, mappedStatus2);
            const nativeIdentity = getTaskIdentity({
              dedupeKey: payload?.dedupeKey || "",
              hashId: payload?.hashId || "",
              bvid: payload?.bvid || "",
              url: payload?.url || ""
            });
            if (!task.dedupeKey && nativeIdentity) {
              task.dedupeKey = nativeIdentity;
              changed = true;
            }
            const nextTaskSource = `${payload?.taskSource || task.taskSource || task.source || ""}`.trim();
            const nextResourceTier = `${payload?.resourceTier || task.resourceTier || resolveResourceTier(task.type)}`.trim();
            const nextVideoId = `${payload?.videoId || task.videoId || resolveVideoId(task.video || {}, payload?.bvid || "")}`.trim();
            const nextPlaylistItemId = `${payload?.playlistItemId || task.playlistItemId || ""}`.trim();
            const nextTaskBehavior = normalizeTaskBehavior(payload, nativeTask?.taskType || payload?.taskType || task.type);
            if (task.taskSource !== nextTaskSource) {
              task.taskSource = nextTaskSource;
              changed = true;
            }
            if (task.resourceTier !== nextResourceTier) {
              task.resourceTier = nextResourceTier;
              changed = true;
            }
            if (task.videoId !== nextVideoId) {
              task.videoId = nextVideoId;
              changed = true;
            }
            if (task.playlistItemId !== nextPlaylistItemId) {
              task.playlistItemId = nextPlaylistItemId;
              changed = true;
            }
            if (JSON.stringify(task.taskBehavior || null) !== JSON.stringify(nextTaskBehavior)) {
              task.taskBehavior = nextTaskBehavior;
              task.visibleInPanel = nextTaskBehavior.visibleInPanel !== false;
              changed = true;
            }
            if (applyNativeRuntimeSnapshot(task, payload)) changed = true;
            if (task.businessStatus !== mappedBusinessStatus2) {
              task.businessStatus = mappedBusinessStatus2;
              changed = true;
            }
            if (nativeStatus !== "success" && nativeStatus !== "failed" && task.status !== mappedStatus2) {
              task.status = mappedStatus2;
              changed = true;
            }
            if (nativeStatus === "success") {
              if (applyNativeArtifacts(task, payload)) changed = true;
              if (task.status !== "success" || task.progress < 100) {
                task.status = "success";
                task.businessStatus = "success";
                task.progress = 100;
                task.speedKbps = 0;
                task.errorMessage = "";
                task.errorInfo = null;
                task.updatedAt = now();
                task.endedAt = Number.isFinite(nativeTask?.finishedAt) ? nativeTask.finishedAt : now();
                task.nextRunAt = 0;
                this._appendTaskLog(task, "native_reconcile", "reconciled-terminal-success", {
                  nativeStatus: nativeTask?.status || ""
                });
                changed = true;
              }
              return;
            }
            if (nativeStatus === "failed") {
              const mappedTerminalStatus = this._mapNativeStatusToLocal(nativeTask);
              const mappedTerminalBusinessStatus = this._mapNativeBusinessStatus(nativeTask, mappedTerminalStatus);
              const nativeErrorInfo = normalizeNativeErrorInfo(payload, nativeTask?.error || "");
              if (JSON.stringify(task.errorInfo || null) !== JSON.stringify(nativeErrorInfo || null)) {
                task.errorInfo = nativeErrorInfo;
                changed = true;
              }
              if (mappedTerminalBusinessStatus === "failed_final" && nativeErrorInfo?.userMessage && task.errorMessage !== nativeErrorInfo.userMessage) {
                task.errorMessage = nativeErrorInfo.userMessage;
                changed = true;
              }
              if (!["failed", "success", "cancelled", "paused"].includes(task.status)) {
                task.status = mappedTerminalStatus;
                task.businessStatus = mappedTerminalBusinessStatus;
                task.progress = mappedTerminalStatus === "success" ? 100 : Math.min(99, Math.max(0, Math.trunc(task.progress || 0)));
                task.speedKbps = 0;
                task.errorMessage = mappedTerminalStatus === "failed" ? `${nativeErrorInfo?.userMessage || nativeTask?.error || task.errorMessage || "native-task-failed"}` : "";
                task.errorInfo = nativeErrorInfo;
                task.updatedAt = now();
                task.endedAt = Number.isFinite(nativeTask?.finishedAt) ? nativeTask.finishedAt : now();
                task.nextRunAt = 0;
                this._appendTaskLog(task, "native_reconcile", "reconciled-terminal-failed", {
                  nativeStatus: nativeTask?.status || "",
                  mappedStatus: mappedTerminalStatus,
                  error: nativeTask?.error || ""
                });
                changed = true;
              }
              return;
            }
            if (nativeStatus === "crashed" && task.status === "running") {
              task.status = "crashed";
              task.businessStatus = "crashed";
              task.progress = 0;
              task.speedKbps = 0;
              task.updatedAt = now();
              task.endedAt = 0;
              this._appendTaskLog(task, "native_reconcile", "reconciled-crashed-to-retry", {
                nativeStatus: nativeTask?.status || ""
              });
              changed = true;
            }
            return;
          }
          if (nativeStatus !== "success" && nativeStatus !== "failed") return;
          const createdAt = Number.isFinite(nativeTask?.createdAt) ? nativeTask.createdAt : now();
          const queueOrderHint = Number.isFinite(payload?.queueOrderHint) ? payload.queueOrderHint : createdAt;
          const mappedStatus = this._mapNativeStatusToLocal(nativeTask);
          const mappedBusinessStatus = this._mapNativeBusinessStatus(nativeTask, mappedStatus);
          const recoveredTaskType = normalizeTaskType(nativeTask?.taskType || payload?.taskType || "", TASK_TYPE_DOWNLOAD_EXPLICIT);
          const recoveredTaskBehavior = normalizeTaskBehavior(payload, recoveredTaskType);
          const recoveredTask = {
            id: taskId,
            type: recoveredTaskType,
            source: payload?.source || "native_reconcile",
            video: cloneVideoForTask({
              url: payload?.url || "",
              title: payload?.title || nativeTask?.title || "",
              bvid: payload?.bvid || "",
              artist: payload?.artist || "",
              producer: payload?.producer || "",
              uploader: payload?.uploader || "",
              author: payload?.author || "",
              hashId: payload?.hashId || "",
              dedupeKey: payload?.dedupeKey || ""
            }),
            dedupeKey: payload?.dedupeKey || getTaskIdentity({
              hashId: payload?.hashId || "",
              bvid: payload?.bvid || "",
              url: payload?.url || ""
            }),
            status: mappedStatus,
            businessStatus: mappedBusinessStatus,
            progress: mappedStatus === "success" ? 100 : normalizeRuntimeProgress(payload?.progress) || 0,
            speedKbps: normalizeRuntimeSpeed(payload?.speedKbps) || 0,
            errorMessage: mappedStatus === "failed" ? `${normalizeNativeErrorInfo(payload, nativeTask?.error || "")?.userMessage || nativeTask?.error || "native-task-failed"}` : "",
            attempt: Number.isFinite(payload?.attempt) ? payload.attempt : 0,
            maxAttempts: Number.isFinite(payload?.maxAttempts) ? payload.maxAttempts : DEFAULT_MAX_ATTEMPTS,
            createdAt,
            updatedAt: Number.isFinite(nativeTask?.updatedAt) ? nativeTask.updatedAt : createdAt,
            startedAt: Number.isFinite(payload?.startedAt) ? payload.startedAt : 0,
            lastProgressAt: Number.isFinite(payload?.lastProgressAt) ? payload.lastProgressAt : 0,
            deadlineAt: Number.isFinite(payload?.deadlineAt) ? payload.deadlineAt : 0,
            endedAt: Number.isFinite(nativeTask?.finishedAt) ? nativeTask.finishedAt : createdAt,
            batchId: `${payload?.batchId || ""}`,
            batchIndex: Number.isFinite(payload?.batchIndex) ? payload.batchIndex : 0,
            queueOrderHint,
            nextRunAt: Number.isFinite(payload?.nextRunAt) ? payload.nextRunAt : 0,
            priority: payload?.priority === "high" ? "high" : "normal",
            visibleInPanel: recoveredTaskBehavior.visibleInPanel !== false,
            filePath: payload?.filePath || payload?.resourceDbCommit?.audioPath || "",
            coverPath: payload?.coverPath || payload?.resourceDbCommit?.coverPath || "",
            resourceDbCommit: payload?.resourceDbCommit || null,
            errorInfo: normalizeNativeErrorInfo(payload, nativeTask?.error || ""),
            watchdog: objectOrEmpty(payload?.watchdog),
            runtime: {
              ...payload?.stage ? { stage: `${payload.stage}` } : {},
              ...Number.isFinite(payload?.lastProgressAt) ? { lastProgressAt: payload.lastProgressAt } : {},
              ...Number.isFinite(payload?.deadlineAt) ? { deadlineAt: payload.deadlineAt } : {},
              ...Object.keys(objectOrEmpty(payload?.watchdog)).length > 0 ? { watchdog: objectOrEmpty(payload.watchdog) } : {}
            },
            taskBehavior: recoveredTaskBehavior,
            taskSource: payload?.taskSource || payload?.source || "native_reconcile",
            resourceTier: payload?.resourceTier || resolveResourceTier(nativeTask?.taskType || payload?.taskType || ""),
            videoId: payload?.videoId || resolveVideoId({
              bvid: payload?.bvid || "",
              url: payload?.url || ""
            }),
            playlistItemId: payload?.playlistItemId || "",
            logs: [{
              at: now(),
              action: "native_reconcile",
              message: "recovered-terminal-task-from-sqlite",
              extra: {
                nativeStatus: nativeTask?.status || "",
                error: nativeTask?.error || ""
              }
            }]
          };
          this.tasks.push(recoveredTask);
          tasksById.set(recoveredTask.id, recoveredTask);
          changed = true;
        });
        if (changed) {
          this._persistState(true);
          this._postNativeLog("reconcile-terminal-from-sqlite", {
            nativeCount: nativeTasks.length
          });
        }
      } catch (_) {
      }
    },
    _findTask(taskId) {
      return this.tasks.find((task) => task.id === taskId) || null;
    },
    getTaskStatusByUrl(url, hashId = "") {
      const identity = getTaskIdentity({ url, hashId });
      if (!identity && !url) return "idle";
      const task = this.tasks.find((item) => {
        if (["cancelled"].includes(item.status)) return false;
        if (identity) {
          const taskIdentity = getStoredTaskIdentity(item);
          if (taskIdentity === identity) return true;
        }
        return item.video?.url === url;
      });
      return task?.status || "idle";
    },
    enqueueDownload(video, options = {}) {
      if (!this.initialized) this._initNow();
      const payload = cloneVideoForTask(video);
      if (!payload.url) {
        return { ok: false, reason: "invalid-url" };
      }
      const createdAt = now();
      const taskType = normalizeTaskType(options.type, TASK_TYPE_DOWNLOAD_EXPLICIT);
      const batchIndex = Number.isFinite(options.batchIndex) ? options.batchIndex : 0;
      const queueOrderHint = Number.isFinite(options.queueOrderHint) ? options.queueOrderHint : createdAt * 1e3 + Math.max(0, batchIndex);
      const identity = getTaskIdentity(payload);
      const existing = this.tasks.find(
        (task2) => (identity ? getStoredTaskIdentity(task2) === identity : task2.video?.url === payload.url) && ACTIVE_TASK_STATUSES.includes(normalizeMainTaskStatus(task2.status, task2.businessStatus))
      );
      if (existing) {
        return { ok: true, duplicate: true, taskId: existing.id };
      }
      let taskId = buildTaskId(taskType, createdAt, batchIndex > 0 ? `${batchIndex}` : "");
      let collisionRound = 0;
      while (this.tasks.some((t) => t.id === taskId)) {
        collisionRound += 1;
        taskId = buildTaskId(taskType, createdAt, `${batchIndex}_${collisionRound}`);
      }
      const task = {
        id: taskId,
        type: taskType,
        source: options.source || "unknown",
        video: payload,
        dedupeKey: identity,
        status: "queued",
        businessStatus: "queued",
        progress: 0,
        speedKbps: 0,
        errorMessage: "",
        errorInfo: null,
        attempt: 0,
        maxAttempts: Number.isFinite(options.maxAttempts) ? options.maxAttempts : DEFAULT_MAX_ATTEMPTS,
        createdAt,
        updatedAt: createdAt,
        startedAt: 0,
        lastProgressAt: 0,
        deadlineAt: 0,
        endedAt: 0,
        batchId: options.batchId || "",
        batchIndex,
        queueOrderHint,
        nextRunAt: 0,
        priority: options.priority === "high" ? "high" : "normal",
        visibleInPanel: options.visibleInPanel !== false,
        watchdog: {},
        runtime: {},
        taskBehavior: normalizeTaskBehavior(options.taskBehavior || { visibility: isBackgroundTaskType(taskType) ? "system" : "manual" }, taskType),
        taskSource: `${options.taskSource || options.source || ""}`.trim(),
        resourceTier: `${options.resourceTier || resolveResourceTier(taskType)}`.trim(),
        videoId: resolveVideoId(payload),
        playlistItemId: `${options.playlistItemId || ""}`.trim(),
        logs: []
      };
      this._appendTaskLog(task, "created", "task-created-before-api-submit", {
        source: task.source,
        priority: task.priority,
        batchId: task.batchId
      });
      this.tasks.push(task);
      this._persistState(true);
      void this._createNativeDownloadTask(task);
      return { ok: true, duplicate: false, taskId: task.id };
    },
    enqueueBatch(videos, options = {}) {
      if (!Array.isArray(videos) || videos.length === 0) {
        return { batchId: "", taskIds: [] };
      }
      const batchId = uid("batch");
      const created = [];
      videos.forEach((video, index) => {
        const result = this.enqueueDownload(video, {
          ...options,
          batchId,
          batchIndex: index,
          // 批任务拆分成原子子任务，每首歌独立重试/死信
          maxAttempts: Number.isFinite(options.maxAttempts) ? options.maxAttempts : DEFAULT_MAX_ATTEMPTS
        });
        if (result.ok && !result.duplicate && result.taskId) {
          created.push(result.taskId);
        }
      });
      return { batchId, taskIds: created };
    },
    setParallelism(value) {
      this.parallelism = normalizeParallelism(value);
      if (this.policy.maxManualDispatch !== this.parallelism) {
        this.policy = normalizeDownloadPolicy({
          ...this.policy,
          maxManualDispatch: this.parallelism
        });
      }
      this._persistState(true);
      void this.updateDownloadPolicy({ maxManualDispatch: this.parallelism });
    },
    async pauseAll() {
      if (this.pausedAll) return;
      this.pausedAll = true;
      this._persistState(true);
      const result = await this._batchNativeTaskControl("pause_queue", {
        status: ["queued", "retry_wait"]
      });
      if (result?.ok === false) {
        this.pausedAll = false;
        this._persistState(true);
      }
    },
    async resumeAll() {
      if (!this.pausedAll) return;
      this.pausedAll = false;
      this._persistState(true);
      await this._batchNativeTaskControl("resume_queue", {
        status: ["paused"]
      });
    },
    async pauseTask(taskId) {
      const task = this._findTask(taskId);
      if (!task) return;
      await this._requestNativeTaskControl(task, "pause_queue");
      await this._refreshNativeDownloadTasks(120);
    },
    async resumeTask(taskId) {
      const task = this._findTask(taskId);
      if (!task) return;
      await this._requestNativeTaskControl(task, "resume_queue");
      await this._refreshNativeDownloadTasks(120);
    },
    async retryTask(taskId) {
      const task = this._findTask(taskId);
      if (!task) return;
      await this._requestNativeTaskControl(task, "retry");
      await this._refreshNativeDownloadTasks(120);
    },
    async cancelTask(taskId) {
      const task = this._findTask(taskId);
      if (!task) return;
      await this._requestNativeTaskControl(task, "cancel");
      await this._refreshNativeDownloadTasks(160);
    },
    async deleteTask(taskId) {
      const normalizedTaskId = `${taskId || ""}`.trim();
      if (!normalizedTaskId) return { ok: false, reason: "missing_task_id" };
      try {
        const response = await apiRequest(`/api/download-tasks/${encodeURIComponent(normalizedTaskId)}`, {
          method: "DELETE"
        });
        const data = await response.json().catch(() => ({}));
        const payload = this._unwrapNativeControlResponse(data);
        if (objectOrEmpty(payload.stats) && Object.keys(payload.stats).length > 0) {
          this.nativeStats = payload.stats;
        }
        if (!response.ok || payload.success === false) {
          throw new Error(data.error || payload.error || payload.reason || `native-delete-task-failed(${response.status})`);
        }
        this.tasks = this.tasks.filter((task) => task.id !== normalizedTaskId);
        this._persistState(true);
        await this._refreshNativeDownloadTasks(120);
        return { ok: true, data: payload };
      } catch (error) {
        this._postNativeLog("native-delete-task-request-failed", {
          taskId: normalizedTaskId,
          error: error?.message || ""
        });
        this._scheduleNativeSync(260);
        return { ok: false, error };
      }
    },
    async _requestNativeTaskControl(taskOrId, action) {
      const task = typeof taskOrId === "string" ? this._findTask(taskOrId) : taskOrId;
      const taskId = `${task?.id || taskOrId || ""}`.trim();
      if (!taskId) {
        return { ok: false, skipped: true, reason: "missing_task_id" };
      }
      try {
        const response = await apiRequest(`/api/download-tasks/${encodeURIComponent(taskId)}/control`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: { action }
        });
        const data = await response.json().catch(() => ({}));
        const payload = this._unwrapNativeControlResponse(data);
        if (objectOrEmpty(payload.stats) && Object.keys(payload.stats).length > 0) {
          this.nativeStats = payload.stats;
        }
        if (!response.ok || payload?.success === false) {
          throw new Error(data.error || payload.error || payload.reason || `native-control-failed(${response.status})`);
        }
        const accepted = payload?.accepted !== false;
        if (!accepted) {
          this._postNativeLog("native-control-pending", {
            taskId,
            action,
            accepted,
            interrupted: payload?.interrupted === true
          });
        }
        this._scheduleNativeSync(accepted ? 140 : 320);
        return { ok: true, accepted, data: payload };
      } catch (error) {
        if (task) {
          this._appendTaskLog(task, "native_control_error", "native-control-request-failed", {
            action,
            error: error?.message || ""
          });
        }
        this._postNativeLog("native-control-request-failed", {
          taskId,
          action,
          error: error?.message || ""
        });
        this._scheduleNativeSync(280);
        return { ok: false, error };
      }
    },
    getTaskPanelGroup(task) {
      return getTaskPanelGroup(task);
    },
    getTaskTypeLabel(taskType) {
      return getTaskTypeLabel(taskType);
    },
    isPrimaryPanelTask(task) {
      return isPrimaryPanelTask(task);
    },
    _handleNativeDownloadEvent(event) {
      let payload = null;
      try {
        payload = typeof event === "string" ? JSON.parse(event) : event;
      } catch (_) {
        return;
      }
      payload = normalizeIncomingNativeEvent(payload);
      if (!payload || !payload.url && !payload.taskId) return;
      const payloadTaskType = normalizeTaskType(payload.taskType || "", "");
      const nativeErrorInfo = normalizeNativeErrorInfo(payload, payload.message || "");
      if (`${payload.mode || ""}`.toLowerCase() === "cover" || payloadTaskType === TASK_TYPE_COVER_DOWNLOAD) return;
      const nativeTaskBehavior = normalizeTaskBehavior(payload, payloadTaskType || TASK_TYPE_DOWNLOAD_EXPLICIT);
      const payloadTaskId = `${payload.taskId || ""}`.trim();
      const payloadUrl = `${payload.url || ""}`;
      const payloadDedupeKey = `${payload.dedupeKey || ""}`.trim();
      let candidateTask = null;
      if (payloadTaskId) {
        candidateTask = this._findTask(payloadTaskId);
      }
      if (!candidateTask && payloadDedupeKey) {
        const activeCandidates = this.tasks.filter(
          (task) => getStoredTaskIdentity(task) === payloadDedupeKey && ACTIVE_TASK_STATUSES.includes(normalizeMainTaskStatus(task.status, task.businessStatus))
        );
        if (activeCandidates.length === 1) {
          candidateTask = activeCandidates[0];
        }
      }
      if (!candidateTask && payloadUrl) {
        const activeCandidates = this.tasks.filter(
          (task) => task.video?.url === payloadUrl && ACTIVE_TASK_STATUSES.includes(normalizeMainTaskStatus(task.status, task.businessStatus))
        );
        if (activeCandidates.length === 1) {
          candidateTask = activeCandidates[0];
        }
      }
      if (!candidateTask) {
        this._scheduleNativeSync(payload.type === "progress" ? 120 : 220);
        return;
      }
      const at = now();
      if (payload.taskSource) candidateTask.taskSource = `${payload.taskSource}`.trim();
      if (payload.resourceTier) candidateTask.resourceTier = `${payload.resourceTier}`.trim();
      if (payload.videoId) candidateTask.videoId = `${payload.videoId}`.trim();
      if (payload.playlistItemId) candidateTask.playlistItemId = `${payload.playlistItemId}`.trim();
      if (payload.taskBehavior || payload.capabilities || payload.visibility || payload.controlLevel) {
        candidateTask.taskBehavior = nativeTaskBehavior;
        candidateTask.visibleInPanel = nativeTaskBehavior.visibleInPanel !== false;
      }
      if (applyNativeRuntimeSnapshot(candidateTask, payload)) {
        candidateTask.updatedAt = at;
      }
      if (payload.status === "cancelling") {
        candidateTask.status = "running";
        candidateTask.businessStatus = "cancelling";
        candidateTask.speedKbps = 0;
        candidateTask.updatedAt = at;
        this._appendTaskLog(candidateTask, "native_control", "native-cancelling", {
          taskId: payloadTaskId,
          dedupeKey: payloadDedupeKey
        });
        this._persistState(true);
        return;
      }
      if (payload.type === "start") {
        candidateTask.status = payload.status === "queued" ? "queued" : "running";
        candidateTask.businessStatus = payload.status === "queued" ? "queued" : "running";
        candidateTask.updatedAt = at;
        this._appendTaskLog(candidateTask, "native_event", `native-${payload.status || "start"}`, {
          taskId: payloadTaskId,
          dedupeKey: payloadDedupeKey
        });
        this._persistState(true);
        return;
      }
      if (payload.type === "progress") {
        candidateTask.status = "running";
        candidateTask.businessStatus = "running";
        if (Number.isFinite(payload.progress)) {
          candidateTask.progress = Math.min(99, Math.max(0, Math.trunc(payload.progress)));
        }
        if (Number.isFinite(payload.speedKbps)) {
          candidateTask.speedKbps = Math.max(0, Number(payload.speedKbps));
        }
        candidateTask.updatedAt = at;
        this._persistState();
        return;
      }
      if (payload.type === "success") {
        candidateTask.status = "success";
        candidateTask.businessStatus = "success";
        candidateTask.progress = 100;
        candidateTask.speedKbps = 0;
        candidateTask.errorMessage = "";
        candidateTask.errorInfo = null;
        candidateTask.endedAt = at;
        candidateTask.updatedAt = at;
        candidateTask.nextRunAt = 0;
        applyNativeArtifacts(candidateTask, payload);
        this._appendTaskLog(candidateTask, "native_terminal", "event-success", {
          taskId: payloadTaskId,
          dedupeKey: payloadDedupeKey,
          url: payloadUrl
        });
        this._persistState(true);
        this._scheduleNativeSync(220);
        return;
      }
      if (payload.type === "error") {
        const mappedStatus = this._mapNativeStatusToLocal({
          status: payload.status || "failed",
          businessStatus: payload.businessStatus || "",
          payload,
          error: payload.message || ""
        });
        const mappedBusinessStatus = this._mapNativeBusinessStatus({
          status: payload.status || "failed",
          businessStatus: payload.businessStatus || "",
          payload,
          error: payload.message || ""
        }, mappedStatus);
        candidateTask.status = mappedStatus;
        candidateTask.businessStatus = mappedBusinessStatus;
        candidateTask.progress = Math.min(99, Math.max(0, Math.trunc(candidateTask.progress || 0)));
        candidateTask.speedKbps = 0;
        candidateTask.errorMessage = ["paused", "cancelled"].includes(mappedStatus) ? "" : nativeErrorInfo?.userMessage || payload.message || candidateTask.errorMessage || "native-task-failed";
        candidateTask.errorInfo = ["paused", "cancelled"].includes(mappedStatus) ? null : nativeErrorInfo;
        candidateTask.updatedAt = at;
        candidateTask.endedAt = mappedStatus === "paused" || mappedBusinessStatus === "retry_wait" ? 0 : at;
        candidateTask.nextRunAt = Number.isFinite(payload.nextRunAt) ? payload.nextRunAt : 0;
        this._appendTaskLog(candidateTask, "native_terminal", "event-error", {
          taskId: payloadTaskId,
          dedupeKey: payloadDedupeKey,
          url: payloadUrl,
          message: payload.message || ""
        });
        this._persistState(true);
        this._scheduleNativeSync(220);
      }
    },
    _pruneOldTasks(keepMs = 14 * 24 * 60 * 60 * 1e3) {
      const cutoff = now() - keepMs;
      const before = this.tasks.length;
      this.tasks = this.tasks.filter((task) => {
        if (ACTIVE_TASK_STATUSES.includes(normalizeMainTaskStatus(task.status, task.businessStatus))) return true;
        return (task.updatedAt || task.createdAt || 0) >= cutoff;
      });
      if (this.tasks.length !== before) {
        this._persistState(true);
      }
    }
  }
});
const PLAY_MODES = {
  LOOP_LIST: "loop_list",
  // 列表循环（默认）
  LOOP_SINGLE: "loop_single",
  // 单曲循环
  SHUFFLE: "shuffle"
  // 随机播放
};
const PLAY_MODE_LABELS = {
  [PLAY_MODES.LOOP_LIST]: "列表循环",
  [PLAY_MODES.LOOP_SINGLE]: "单曲循环",
  [PLAY_MODES.SHUFFLE]: "随机播放"
};
const getNextPlayMode = (currentMode) => {
  const modes = Object.values(PLAY_MODES);
  const currentIndex = modes.indexOf(currentMode || PLAY_MODES.LOOP_LIST);
  const nextIndex = (currentIndex + 1) % modes.length;
  return modes[nextIndex];
};
const getPlayModeLabel = (mode) => {
  return PLAY_MODE_LABELS[mode] || PLAY_MODE_LABELS[PLAY_MODES.LOOP_LIST];
};
const _checkedMap = /* @__PURE__ */ new Map();
const CHECK_COOLDOWN = 5 * 60 * 1e3;
function useIntegrityCheck() {
  const checking = ref(false);
  const missingMap = ref(/* @__PURE__ */ new Map());
  async function checkPlaylistIntegrity(playlistId, songs) {
    if (!Array.isArray(songs) || songs.length === 0) return;
    if (checking.value) return;
    const lastCheck = _checkedMap.get(playlistId);
    if (lastCheck && Date.now() - lastCheck < CHECK_COOLDOWN) return;
    checking.value = true;
    _checkedMap.set(playlistId, Date.now());
    try {
      const songList = songs.map((s) => ({
        hash_id: s.hash_id || s.id,
        source_type: s.source_type || detectSourceType(s),
        bvid: s.bvid || null,
        bili_url: s.bili_url || null,
        hasAudio: checkHasAudio(s),
        hasCover: checkHasCover(s),
        hasLrc: checkHasLrc(s)
      }));
      const needCheck = songList.filter((s) => !s.hasAudio || !s.hasCover);
      if (needCheck.length === 0) return;
      const actions = buildIntegrityActions(needCheck);
      if (actions.length === 0) return;
      console.log(`[IntegrityCheck] 歌单 ${playlistId}: ${actions.length} 项需要补全`);
      for (const action of actions) {
        if (action.type === "placeholder") {
          missingMap.value.set(action.hash_id, {
            type: "missing",
            message: action.message
          });
        } else if (action.type === "download_audio") {
          await triggerAudioDownload(action);
        } else if (action.type === "download_cover") {
          triggerCoverDownload(action);
        }
      }
    } catch (e) {
      console.warn("[IntegrityCheck] 检查失败:", e.message);
    } finally {
      checking.value = false;
    }
  }
  async function checkSingleSongIntegrity(song) {
    if (!song) return null;
    try {
      const actions = buildIntegrityActions([
        {
          hash_id: song.hash_id || song.id,
          source_type: song.source_type || detectSourceType(song),
          bvid: song.bvid || null,
          bili_url: song.bili_url || null,
          cover: song.cover || null,
          hasAudio: false,
          // 播放失败，明确标记为缺失
          hasCover: true,
          // 封面非紧急
          hasLrc: true
        }
      ]);
      for (const action of actions) {
        if (action.type === "download_audio") {
          await triggerAudioDownload(action);
        } else if (action.type === "placeholder") {
          return action;
        }
      }
    } catch (e) {
      console.warn("[IntegrityCheck] 单曲检查失败:", e.message);
    }
    return null;
  }
  return {
    checking,
    missingMap,
    checkPlaylistIntegrity,
    checkSingleSongIntegrity
  };
}
function detectSourceType(song) {
  if (song.source_type) return song.source_type;
  if (song.bvid || song.bili_url) return "bilibili";
  if (song.local_file_hash) return "local";
  return "streaming";
}
function checkHasAudio(song) {
  if (song.src && !song.src.startsWith("/api/")) return true;
  if (window.Android?.hasLocalAudio) {
    return !!window.Android.hasLocalAudio(song.hash_id || song.id);
  }
  if (detectSourceType(song) !== "bilibili") return true;
  return true;
}
function checkHasCover(song) {
  if (song.cover && !song.cover.startsWith("/api/cover/")) return true;
  if (song.cover_user_path) return true;
  if (window.Android?.hasLocalCover) {
    return !!window.Android.hasLocalCover(song.hash_id || song.id);
  }
  return true;
}
function checkHasLrc(song) {
  return true;
}
function buildIntegrityActions(songList = []) {
  const actions = [];
  for (const song of songList) {
    const sourceType = song.source_type || detectSourceType(song);
    const hashId = song.hash_id || song.id;
    if (!hashId) continue;
    if (!song.hasAudio) {
      if (sourceType === "bilibili" && (song.bili_url || song.bvid)) {
        actions.push({
          type: "download_audio",
          hash_id: hashId,
          source: "bili",
          bvid: song.bvid || "",
          url: song.bili_url || "",
          methods: ["getUrl", "stream"]
        });
      } else {
        actions.push({
          type: "placeholder",
          hash_id: hashId,
          message: "音频资源缺失，暂时不可播放"
        });
      }
    }
    if (!song.hasCover && sourceType === "bilibili" && song.cover) {
      actions.push({
        type: "download_cover",
        hash_id: hashId,
        source: "bili_pic",
        url: song.cover
      });
    }
  }
  return actions;
}
async function triggerAudioDownload(action) {
  console.log(`[IntegrityCheck] 触发音频下载: ${action.hash_id} (source=${action.source})`);
  if (action.source === "bili") {
    const videoUrl = action.url || (action.bvid ? `https://www.bilibili.com/video/${action.bvid}` : "");
    if (!videoUrl) return;
    await apiRequest("/api/download-tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        url: videoUrl,
        bvid: action.bvid || "",
        forcedSongId: action.hash_id,
        source: "playlist_repair",
        taskSource: "playlist_repair",
        taskType: "download_repair",
        resourceTier: "PLAYLIST_BACKUP",
        saveToInternal: true,
        cacheMode: false
      }
    });
  }
}
function triggerCoverDownload(action) {
  console.log(`[IntegrityCheck] 触发封面下载: ${action.hash_id} (source=${action.source})`);
  if (action.source === "bili_pic" && action.url && window.Android?.downloadCoverFromUrl) {
    window.Android.downloadCoverFromUrl(action.hash_id, action.url);
  }
}
const PLAYER_RESUME_CACHE_KEY = "player_resume_cache_v1";
const RESUME_CACHE_VERSION = 1;
function getResumeUserId() {
  return `${storage.currentUserId || "guest"}`.trim() || "guest";
}
function hasAndroidResumeCache(methodName) {
  return typeof window !== "undefined" && window.Android && typeof window.Android[methodName] === "function";
}
function safeCloneTrack(track) {
  return track && typeof track === "object" ? { ...track } : null;
}
function normalizeSnapshot(raw) {
  if (!raw || typeof raw !== "object") return null;
  const resume = raw.resume && typeof raw.resume === "object" ? raw.resume : null;
  const currentHashId = `${resume?.currentHashId || ""}`.trim();
  if (!resume || !currentHashId) return null;
  const savedAt = Number(raw.savedAt || resume.updatedAt || Date.now()) || Date.now();
  return {
    version: RESUME_CACHE_VERSION,
    userId: `${raw.userId || getResumeUserId()}`.trim() || "guest",
    savedAt,
    playMode: raw.playMode || null,
    resume: {
      ...resume,
      currentHashId,
      updatedAt: Number(resume.updatedAt || savedAt) || savedAt
    },
    currentTrack: safeCloneTrack(raw.currentTrack)
  };
}
function buildSnapshot({ resume, currentTrack = null, playMode = null } = {}) {
  const now2 = Date.now();
  return normalizeSnapshot({
    userId: getResumeUserId(),
    savedAt: now2,
    playMode,
    resume: resume && typeof resume === "object" ? { ...resume, updatedAt: Number(resume.updatedAt || now2) || now2 } : null,
    currentTrack: safeCloneTrack(currentTrack)
  });
}
function readAndroidCache(userId) {
  if (!hasAndroidResumeCache("getPlayerResumeCache")) return null;
  try {
    const raw = window.Android.getPlayerResumeCache(userId);
    if (!raw || typeof raw !== "string") return null;
    return normalizeSnapshot(JSON.parse(raw));
  } catch (error) {
    console.warn("[PlayerResumeCache] read failed:", error);
    return null;
  }
}
function writeAndroidCache(userId, snapshot) {
  if (!hasAndroidResumeCache("savePlayerResumeCache")) return false;
  try {
    const ok = window.Android.savePlayerResumeCache(userId, JSON.stringify(snapshot));
    return ok !== false;
  } catch (error) {
    console.warn("[PlayerResumeCache] write failed:", error);
    return false;
  }
}
function readBrowserCache() {
  return normalizeSnapshot(storage.getJSON(PLAYER_RESUME_CACHE_KEY));
}
function writeBrowserCache(snapshot) {
  try {
    storage.setJSON(PLAYER_RESUME_CACHE_KEY, snapshot);
    return true;
  } catch (_) {
    return false;
  }
}
function readPlayerResumeCache() {
  const userId = getResumeUserId();
  if (hasAndroidResumeCache("getPlayerResumeCache")) {
    return readAndroidCache(userId);
  }
  return readBrowserCache();
}
function writePlayerResumeCache(payload) {
  const snapshot = buildSnapshot(payload);
  if (!snapshot) return null;
  const userId = getResumeUserId();
  if (hasAndroidResumeCache("savePlayerResumeCache")) {
    writeAndroidCache(userId, snapshot);
    return snapshot;
  }
  writeBrowserCache(snapshot);
  return snapshot;
}
const searchResultSubscribers = /* @__PURE__ */ new Set();
const searchCacheSubscribers = /* @__PURE__ */ new Set();
function parseEventPayload(event) {
  if (typeof event === "string") {
    try {
      return JSON.parse(event);
    } catch (error) {
      console.warn("[searchEventBus] failed to parse event payload", error, "raw:", String(event).substring(0, 500));
      return null;
    }
  }
  if (!event || typeof event !== "object") {
    console.warn("[searchEventBus] unexpected event type:", typeof event, "raw:", String(event).substring(0, 200));
    return null;
  }
  return event;
}
function emitToSubscribers(subscribers2, event) {
  const payload = parseEventPayload(event);
  if (!payload) return;
  subscribers2.forEach((callback) => {
    try {
      callback(payload);
    } catch (error) {
      console.warn("[searchEventBus] listener error", error);
    }
  });
}
function onSearchResult(callback) {
  searchResultSubscribers.add(callback);
  return () => {
    searchResultSubscribers.delete(callback);
  };
}
function onSearchCacheEvent(callback) {
  searchCacheSubscribers.add(callback);
  return () => {
    searchCacheSubscribers.delete(callback);
  };
}
function initSearchEventBus() {
  window.onSearchResult = (event) => {
    emitToSubscribers(searchResultSubscribers, event);
  };
  window.onSearchCacheEvent = (event) => {
    emitToSubscribers(searchCacheSubscribers, event);
  };
}
initSearchEventBus();
function resolveBackgroundPlaybackTick({ hidden, position, duration, trustedForEnd, leeway = 1.5 }) {
  const time = Number(position);
  const total = Number(duration);
  return {
    publishTiming: !hidden,
    nearEnd: trustedForEnd === true && Number.isFinite(time) && Number.isFinite(total) && total > 0 && time >= Math.max(0, total - leeway)
  };
}
function nativeProgressInterval(hidden) {
  return hidden ? 5e3 : 1e3;
}
let hlsModulePromise = null;
let resumeLifecycleBound = false;
const SEARCH_CACHE_READY_STATUSES = /* @__PURE__ */ new Set(["ready", "success", "exists", "completed", "complete"]);
const SEARCH_CACHE_FAILED_STATUSES = /* @__PURE__ */ new Set(["error", "failed", "failure", "cancelled", "canceled", "timeout"]);
const END_DETECTION_LEEWAY_SEC = 1.5;
const DURATION_MISMATCH_ABS_SEC = 8;
const DURATION_MISMATCH_RATIO = 0.08;
const MAX_REASONABLE_DURATION_SEC = 12 * 60 * 60;
function parseColonDurationSeconds(value) {
  const text = `${value || ""}`.trim();
  if (!text || !text.includes(":")) return 0;
  const parts = text.split(":").map((part) => Number(part));
  if (parts.length < 2 || parts.length > 3) return 0;
  if (parts.some((part) => !Number.isFinite(part) || part < 0)) return 0;
  return parts.reduce((total, part) => total * 60 + part, 0);
}
function normalizeDurationSeconds(value) {
  const colonDuration = typeof value === "string" ? parseColonDurationSeconds(value) : 0;
  const numeric = colonDuration > 0 ? colonDuration : Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0 || numeric > MAX_REASONABLE_DURATION_SEC) return 0;
  return numeric;
}
function normalizePositionSeconds(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return 0;
  return numeric;
}
function areDurationsClose(left, right) {
  const a = normalizeDurationSeconds(left);
  const b = normalizeDurationSeconds(right);
  if (a <= 0 || b <= 0) return false;
  return Math.abs(a - b) <= Math.max(DURATION_MISMATCH_ABS_SEC, Math.max(a, b) * DURATION_MISMATCH_RATIO);
}
function clampProgressPercent(currentTime, duration) {
  const time = normalizePositionSeconds(currentTime);
  const total = normalizeDurationSeconds(duration);
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, time / total * 100));
}
function readTrackDurationSeconds(track) {
  if (!track || typeof track !== "object") return 0;
  const candidates = [
    track.duration,
    track.duration_sec,
    track.duration_seconds,
    track.durationSec,
    track.durationText,
    track.duration_text,
    track.length,
    track.time
  ];
  for (const candidate of candidates) {
    const duration = normalizeDurationSeconds(candidate);
    if (duration > 0) return duration;
  }
  return 0;
}
function isHlsLikeSource(src) {
  const value = `${src || ""}`;
  if (!value) return false;
  return /\.m3u8(?:[?#]|$)/i.test(value) || value.includes("/api/stream/") && !value.includes("/api/stream_local");
}
async function getHls() {
  if (!hlsModulePromise) {
    hlsModulePromise = __vitePreload(() => import("./hls-runtime.js"), true ? [] : void 0, import.meta.url).then((module) => module.default);
  }
  return hlsModulePromise;
}
let _integrityChecker = null;
function getIntegrityChecker() {
  if (!_integrityChecker) _integrityChecker = useIntegrityCheck();
  return _integrityChecker;
}
const usePlayerStore$1 = defineStore("player", {
  state: () => ({
    audio: null,
    hls: null,
    // MiniPlayer / PlaylistDrawer 共享的抽屉开关
    showDrawer: false,
    // MiniPlayer 显示控制（编辑对话框等场景需要隐藏）
    // 初始化时隐藏，避免与开屏竞争显示
    hideMiniPlayer: true,
    miniPlayerHideReasons: ["splash-startup"],
    isPlaying: false,
    currentTrack: null,
    currentHashId: null,
    lastLocateHashId: null,
    uiDirection: null,
    progress: 0,
    duration: 0,
    currentTime: 0,
    // 播放模式
    playMode: PLAY_MODES.LOOP_LIST,
    _resumeLastSavedAt: 0,
    // 系统媒体卡片进度上报节流时间戳（毫秒）
    _progressLastReportedAt: 0,
    _initialized: false,
    _suppressPauseEvent: false,
    _pendingPlayTriggerSource: null,
    _pendingPauseTriggerSource: null,
    _playbackContextId: null,
    _playbackIntentSeq: 0,
    _currentPlaybackIntentId: null,
    _optimisticTrackSwitch: null,
    _autoAdvanceHandledIntentId: null,
    _searchCacheEventUnsubscribe: null,
    _durationSource: "none",
    _durationTrustedForEnd: false,
    _durationMismatchWarnedKey: null,
    isVideoActive: false
  }),
  actions: {
    _beginPlaybackIntent() {
      this._playbackIntentSeq += 1;
      return this._playbackIntentSeq;
    },
    _isPlaybackIntentActive(intentId) {
      return !intentId || intentId === this._playbackIntentSeq;
    },
    _registerPlaybackIntent(intentId) {
      this._currentPlaybackIntentId = intentId || null;
    },
    _autoAdvanceCurrentTrack({
      triggerSource = "auto_track_end",
      switchReason = "track_ended"
    } = {}) {
      const intentId = this._currentPlaybackIntentId;
      if (!intentId || this._autoAdvanceHandledIntentId === intentId) {
        if (intentId && this._autoAdvanceHandledIntentId === intentId) {
          console.log("[TY_PlayerStore] ⏭ _autoAdvance suppressed (duplicate intent)");
        }
        return false;
      }
      this._autoAdvanceHandledIntentId = intentId;
      console.log(`[TY_PlayerStore] ⏩ _autoAdvance → next() currentHash=${String(this.currentHashId).substring(0, 12)} switchReason=${switchReason}`);
      this.next({
        triggerSource,
        switchReason
      });
      return true;
    },
    _setMediaSessionPlaybackState(state) {
      if (!("mediaSession" in navigator)) return;
      try {
        navigator.mediaSession.playbackState = state;
      } catch (_) {
      }
    },
    // ── 系统媒体卡片进度/状态上报 ─────────────────────────────
    // 数据源与播放核心完全一致（audio.currentTime / duration / isPlaying），
    // 经 window.Android.updatePlaybackProgress / syncPlaybackToSystem 推给
    // MediaPlaybackService 的镜像 MediaSession，驱动系统通知/锁屏的进度条与 seek 条。
    // 同步路径不调用 notifySongStarted，避免触发下载/预缓存。
    _resolveNativeProgress() {
      const audioTime = Number(this.audio?.currentTime);
      const stateTime = Number(this.currentTime);
      const posSec = Number.isFinite(audioTime) && audioTime > 0 ? audioTime : Number.isFinite(stateTime) ? Math.max(0, stateTime) : 0;
      const audioDur = Number(this.audio?.duration);
      const durSec = Number.isFinite(audioDur) && audioDur > 0 ? audioDur : Number(this.duration) || 0;
      return {
        positionMs: Math.round(posSec * 1e3),
        durationMs: Math.round(durSec * 1e3)
      };
    },
    /** 1Hz 节流进度 tick；force=true 用于暂停/seek/切曲等关键时机立即上报。 */
    _reportNativePlaybackProgress(force = false) {
      if (!window.Android?.updatePlaybackProgress) return;
      if (!this.currentHashId || !this.audio) return;
      const now2 = Date.now();
      const interval = nativeProgressInterval(typeof document !== "undefined" && document.hidden);
      if (!force && now2 - this._progressLastReportedAt < interval) return;
      this._progressLastReportedAt = now2;
      const { positionMs, durationMs } = this._resolveNativeProgress();
      try {
        window.Android.updatePlaybackProgress(positionMs, durationMs, !!this.isPlaying);
      } catch (_) {
      }
    },
    /** 全量同步：按当前曲推元数据 + 进度 + 状态给系统卡片（进入 App / 恢复播放 / 换曲）。 */
    _syncNativePlaybackFull() {
      if (!window.Android?.syncPlaybackToSystem) return;
      if (!this.currentHashId || !this.currentTrack) return;
      this._progressLastReportedAt = Date.now();
      const { positionMs, durationMs } = this._resolveNativeProgress();
      try {
        window.Android.syncPlaybackToSystem(this.currentHashId, positionMs, durationMs, !!this.isPlaying);
      } catch (_) {
      }
    },
    _notifyNativeSongStarted() {
      if (!window.Android?.notifySongStarted || !this.currentHashId) return;
      if (this._nativeStartedIntentId === this._currentPlaybackIntentId) return;
      try {
        const nextTrack = usePlaylistStore().getNext(this.currentHashId);
        window.Android.notifySongStarted(this.currentHashId, nextTrack?.hash_id ?? nextTrack?.id ?? "", this.playMode || "");
        this._nativeStartedIntentId = this._currentPlaybackIntentId;
      } catch (_) {
      }
    },
    /** 由 Android onAppResume/onNewIntent 触发的同步入口：仅在播放中推送，暂停不复活已停止的卡片。 */
    syncSystemMediaStateToNative() {
      if (!this.isPlaying) return false;
      if (!window.Android?.syncPlaybackToSystem) return false;
      this._syncNativePlaybackFull();
      return true;
    },
    _buildLocalStreamSrc(path) {
      if (!path || typeof path !== "string") return "";
      try {
        return `/api/stream_local?path=${encodeURIComponent(path).replace(/\+/g, "%20")}`;
      } catch (_) {
        return "";
      }
    },
    _getAndroidLocalAudioPath(hashId) {
      const key = `${hashId || ""}`.trim();
      if (!key || !window.Android?.getLocalAudioPath) return "";
      try {
        return `${window.Android.getLocalAudioPath(key) || ""}`.trim();
      } catch (_) {
        return "";
      }
    },
    _attachLocalAudioSourceIfAvailable(track) {
      if (!track || typeof track !== "object") return track;
      const hashId = track.hash_id ?? track.id ?? null;
      if (!hashId) return track;
      const currentSrc = `${track.src || ""}`.trim();
      if (currentSrc.startsWith("/api/stream_local")) return track;
      if (currentSrc && !currentSrc.startsWith("/api/stream/") && !currentSrc.startsWith("http")) {
        return track;
      }
      const localPath = `${track.audio_local_path || this._getAndroidLocalAudioPath(hashId)}`.trim();
      const localSrc = this._buildLocalStreamSrc(localPath);
      if (!localSrc) return track;
      console.log("[TY_PlayerStore] _attachLocalAudioSource found local audio for", hashId.substring(0, 12), "path:", localPath.substring(localPath.lastIndexOf("/") + 1));
      return {
        ...track,
        src: localSrc,
        audio_local_path: localPath
      };
    },
    _syncTrackLocalSource(hashId, localPath = "") {
      if (!hashId) return;
      const localSrc = this._buildLocalStreamSrc(localPath);
      const applyLocalSource = (track) => {
        if (!track || typeof track !== "object") return;
        if (localSrc) track.src = localSrc;
        if (localPath) track.audio_local_path = localPath;
        delete track.pendingDownload;
      };
      if ((this.currentTrack?.hash_id ?? this.currentTrack?.id) === hashId) {
        applyLocalSource(this.currentTrack);
      }
      const playlistStore = usePlaylistStore();
      [playlistStore.queue, playlistStore.loopListQueue, playlistStore.historyQueue].forEach((list) => {
        if (!Array.isArray(list)) return;
        list.forEach((track) => {
          if ((track?.hash_id ?? track?.id) === hashId) {
            applyLocalSource(track);
          }
        });
      });
    },
    // 冷启动时扫描所有队列 track，发现已有本地音频但未同步 src 的 track 并同步。
    // 解决 App 被杀/WebView 销毁时缓存完成事件丢失导致 track 未标记本地路径的问题。
    _syncQueueLocalSources() {
      if (!window.Android?.getLocalAudioPath) return;
      const playlistStore = usePlaylistStore();
      const seen2 = /* @__PURE__ */ new Set();
      [playlistStore.queue, playlistStore.loopListQueue, playlistStore.historyQueue].forEach((list) => {
        if (!Array.isArray(list)) return;
        list.forEach((track) => {
          const hashId = track?.hash_id ?? track?.id ?? null;
          if (!hashId || seen2.has(hashId)) return;
          if (track.src && track.src.startsWith("/api/stream_local")) {
            seen2.add(hashId);
            return;
          }
          const localPath = this._getAndroidLocalAudioPath(hashId);
          if (localPath) {
            this._syncTrackLocalSource(hashId, localPath);
          }
          seen2.add(hashId);
        });
      });
    },
    _trackHasLocalAudio(track) {
      if (!track || typeof track !== "object") return false;
      const src = `${track.src || ""}`.trim();
      if (src && src.startsWith("/api/stream_local")) return true;
      if (src && !src.startsWith("/api/")) return true;
      const hashId = track.hash_id ?? track.id ?? null;
      if (!hashId) return false;
      if (this._getAndroidLocalAudioPath(hashId)) return true;
      if (!window.Android?.hasLocalAudio) return false;
      try {
        return !!window.Android.hasLocalAudio(hashId);
      } catch (_) {
        return false;
      }
    },
    _normalizeCacheEventStatus(value) {
      return `${value || ""}`.trim().toLowerCase();
    },
    _switchTargetTrackToLocalAudio(hashId, {
      path = "",
      triggerSource = "",
      switchReason = "local_cache_ready"
    } = {}) {
      const key = `${hashId || ""}`.trim();
      if (!key) return false;
      if (path) {
        this._syncTrackLocalSource(key, path);
      }
      const isCurrentTarget = this.currentHashId === key || (this.currentTrack?.hash_id ?? this.currentTrack?.id) === key;
      if (!isCurrentTarget) {
        console.log("[TY_PlayerStore] cache ready for non-current track, queued:", key.substring(0, 12));
        return false;
      }
      if (!this._trackHasLocalAudio(this.currentTrack)) {
        console.warn("[TY_PlayerStore] cache ready but _trackHasLocalAudio false for current track:", key.substring(0, 12));
        return false;
      }
      const nowTs = Date.now();
      if (!this._localAudioSwitchedAt) this._localAudioSwitchedAt = {};
      const lastTs = this._localAudioSwitchedAt[key] || 0;
      if (nowTs - lastTs < 3e4) return false;
      const targetTrack = this.currentTrack;
      if ((targetTrack?.hash_id ?? targetTrack?.id) !== key) return false;
      this._localAudioSwitchedAt[key] = nowTs;
      const audioTime = Number(this.audio?.currentTime);
      const stateTime = Number(this.currentTime);
      const seekTime = Number.isFinite(audioTime) && audioTime > 0 ? audioTime : Number.isFinite(stateTime) ? Math.max(0, stateTime) : 0;
      this.loadTrack(targetTrack, {
        autoplay: this.isPlaying,
        seekTime,
        triggerSource: triggerSource || "system_restore",
        switchReason: switchReason || "local_cache_ready"
      });
      return true;
    },
    playPendingTrackIfReady(hashId, options = {}) {
      return this._switchTargetTrackToLocalAudio(hashId, options);
    },
    _canUseAndroidCache(track) {
      if (!window.Android) return false;
      if (!track || typeof track !== "object") return false;
      const hashId = track.hash_id ?? track.id ?? null;
      if (!hashId) return false;
      const biliUrl = `${track.url || track.bili_url || ""}`.trim();
      return /bilibili\.com/i.test(biliUrl);
    },
    async _queueAndroidCache(track, { coverHint = "" } = {}) {
      const hashId = track?.hash_id ?? track?.id ?? null;
      if (!hashId) throw new Error("missing hash id");
      const downloadTaskStore = useDownloadTaskStore();
      downloadTaskStore.ensureInitializedNow();
      try {
        await downloadTaskStore.syncDownloadPolicyFromNative();
      } catch (_) {
      }
      if (!downloadTaskStore.canStartSearchCache()) {
        throw new Error("search cache disabled by policy");
      }
      const biliUrl = `${track?.url || track?.bili_url || ""}`.trim();
      if (!/bilibili\.com/i.test(biliUrl)) {
        throw new Error("track does not support bilibili cache playback");
      }
      const response = await apiRequest("/api/download-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
          url: biliUrl,
          title: track?.title || hashId,
          author: track?.artist || track?.author || "",
          producer: track?.producer || track?.uploader || track?.author || "",
          cover: coverHint || track?.cover_bili_url || track?.pic || track?.cover || "",
          forcedSongId: hashId,
          saveToInternal: true,
          cacheMode: true,
          source: "search_cache",
          taskType: "download_cache"
        }
      });
      const data = await response.json().catch(() => ({}));
      const payload = data?.data || data || {};
      const status = `${payload?.status || ""}`.toLowerCase();
      const acceptedStatuses = /* @__PURE__ */ new Set([
        "queued",
        "pending",
        "running",
        "deduped",
        "duplicate",
        "exists",
        "ready",
        "success",
        "completed",
        "complete"
      ]);
      if (!response.ok || !payload?.success && !acceptedStatuses.has(status)) {
        throw new Error(data?.error || payload?.error || `cache request failed (${response.status})`);
      }
      if (SEARCH_CACHE_READY_STATUSES.has(status)) {
        this.playPendingTrackIfReady(hashId, {
          path: payload?.path || payload?.filePath || "",
          switchReason: "search_cache_ready_response"
        });
      }
      return payload;
    },
    async queueSearchCacheForTrack(track, options = {}) {
      return this._queueAndroidCache(track, options);
    },
    _syncMiniPlayerHiddenState() {
      this.hideMiniPlayer = Array.isArray(this.miniPlayerHideReasons) && this.miniPlayerHideReasons.length > 0;
    },
    holdMiniPlayer(reason = "default") {
      const key = `${reason || "default"}`;
      if (!Array.isArray(this.miniPlayerHideReasons)) this.miniPlayerHideReasons = [];
      if (!this.miniPlayerHideReasons.includes(key)) {
        this.miniPlayerHideReasons.push(key);
      }
      this._syncMiniPlayerHiddenState();
    },
    releaseMiniPlayer(reason = "default") {
      const key = `${reason || "default"}`;
      if (!Array.isArray(this.miniPlayerHideReasons)) this.miniPlayerHideReasons = [];
      this.miniPlayerHideReasons = this.miniPlayerHideReasons.filter((item) => item !== key);
      this._syncMiniPlayerHiddenState();
    },
    setShowMiniPlayer(show = true, reason = "manual") {
      if (show) {
        this.releaseMiniPlayer(reason);
      } else {
        this.holdMiniPlayer(reason);
      }
    },
    _currentTrackId(track = this.currentTrack) {
      if (!track || typeof track !== "object") return null;
      return track.hash_id ?? track.id ?? null;
    },
    _resolveContextId(context) {
      if (!context) return null;
      if (typeof context === "string") return context;
      if (typeof context !== "object" || Array.isArray(context)) return null;
      return context.contextId ?? context.source ?? null;
    },
    _setPlaybackContext(contextId) {
      this._playbackContextId = contextId ? String(contextId) : null;
    },
    _getTrackDurationHint(track = this.currentTrack) {
      const directDuration = readTrackDurationSeconds(track);
      if (directDuration > 0) return directDuration;
      const trackId = this._currentTrackId(track);
      if (!trackId) return 0;
      try {
        const playlistStore = usePlaylistStore();
        const lists = [playlistStore.queue, playlistStore.loopListQueue, playlistStore.historyQueue];
        for (const list of lists) {
          if (!Array.isArray(list)) continue;
          const matched = list.find((item) => this._currentTrackId(item) === trackId);
          const duration = readTrackDurationSeconds(matched);
          if (duration > 0) return duration;
        }
      } catch (_) {
      }
      return 0;
    },
    _isCurrentAudioSourceHls() {
      const audioSrc = `${this.audio?.currentSrc || this.audio?.src || this.audio?.getAttribute?.("src") || ""}`;
      const trackSrc = `${this.currentTrack?.src || ""}`;
      return !!this.hls || isHlsLikeSource(audioSrc) || isHlsLikeSource(trackSrc);
    },
    _isCurrentAudioSourceLocal() {
      const audioSrc = `${this.audio?.currentSrc || this.audio?.src || this.audio?.getAttribute?.("src") || ""}`;
      const trackSrc = `${this.currentTrack?.src || ""}`;
      const source = audioSrc || trackSrc;
      if (!source) return false;
      if (source.includes("/api/stream_local")) return true;
      return !isHlsLikeSource(source) && !source.includes("/api/stream/");
    },
    _warnDurationMismatch(audioDuration, trackDuration, reason = "audio") {
      const trackId = this.currentHashId || this._currentTrackId(this.currentTrack) || "unknown";
      const warnKey = `${trackId}:${Math.round(audioDuration * 10)}:${Math.round(trackDuration * 10)}`;
      if (this._durationMismatchWarnedKey === warnKey) return;
      this._durationMismatchWarnedKey = warnKey;
      console.warn(
        `[TY_PlayerStore] ignored mismatched audio duration (${reason}) hash=${String(trackId).substring(0, 12)} audio=${audioDuration.toFixed(1)} track=${trackDuration.toFixed(1)}`
      );
    },
    _resolvePlaybackDuration(audioDurationValue = null, { reason = "state", allowAudioFallback = true } = {}) {
      const audioDuration = normalizeDurationSeconds(audioDurationValue);
      const trackDuration = this._getTrackDurationHint();
      if (trackDuration > 0) {
        if (audioDuration > 0 && !areDurationsClose(audioDuration, trackDuration)) {
          this._warnDurationMismatch(audioDuration, trackDuration, reason);
        }
        return {
          duration: trackDuration,
          source: "track",
          trustedForEnd: true
        };
      }
      if (allowAudioFallback && audioDuration > 0) {
        const isTrustedLocalAudio = this._isCurrentAudioSourceLocal() && !this._isCurrentAudioSourceHls();
        if (isTrustedLocalAudio) {
          return {
            duration: audioDuration,
            source: "audio_local",
            trustedForEnd: true
          };
        }
      }
      const stateDuration = normalizeDurationSeconds(this.duration);
      return {
        duration: stateDuration,
        source: stateDuration > 0 ? this._durationSource || "state" : audioDuration > 0 ? "audio_untrusted" : "none",
        trustedForEnd: stateDuration > 0 && !!this._durationTrustedForEnd
      };
    },
    _applyTimingState({
      currentTime = this.currentTime,
      duration = this.duration,
      source = this._durationSource || "state",
      trustedForEnd = this._durationTrustedForEnd
    } = {}) {
      const nextTime = normalizePositionSeconds(currentTime);
      const nextDuration = normalizeDurationSeconds(duration);
      this.currentTime = nextTime;
      this.duration = nextDuration;
      this._durationSource = nextDuration > 0 ? source : "none";
      this._durationTrustedForEnd = nextDuration > 0 && !!trustedForEnd;
      this.progress = clampProgressPercent(nextTime, nextDuration);
    },
    _applyInitialTrackTiming(track, seekTime = 0) {
      const duration = this._getTrackDurationHint(track);
      this._applyTimingState({
        currentTime: seekTime,
        duration,
        source: duration > 0 ? "track" : "none",
        trustedForEnd: duration > 0
      });
    },
    _syncPlaybackTimingFromAudio(reason = "audio") {
      const audioTime = normalizePositionSeconds(this.audio?.currentTime);
      const resolved = this._resolvePlaybackDuration(this.audio?.duration, { reason });
      this._applyTimingState({
        currentTime: audioTime,
        duration: resolved.duration,
        source: resolved.source,
        trustedForEnd: resolved.trustedForEnd
      });
      return resolved;
    },
    _isNearTrustedDurationEnd() {
      return this._durationTrustedForEnd === true && this.duration > 0 && this.currentTime >= Math.max(0, this.duration - END_DETECTION_LEEWAY_SEC);
    },
    _buildPlaybackSnapshot(extraPayload = {}) {
      const playlistStore = usePlaylistStore();
      const audio = this.audio;
      const audioTime = Number(audio?.currentTime);
      const stateTime = Number(this.currentTime);
      const positionSec = Number.isFinite(audioTime) && audioTime > 0 ? audioTime : Number.isFinite(stateTime) ? Math.max(0, stateTime) : 0;
      const resolvedDuration = this._resolvePlaybackDuration(audio?.duration, { reason: "snapshot" });
      const durationSec = resolvedDuration.duration > 0 ? resolvedDuration.duration : null;
      const payload = {
        track_id: this.currentHashId ?? null,
        playlist_id: this._playbackContextId,
        position_sec: positionSec,
        duration_sec: durationSec,
        is_playing: !!this.isPlaying,
        is_video_active: !!this.isVideoActive,
        playback_rate: Number.isFinite(Number(audio?.playbackRate)) ? Number(audio.playbackRate) : null,
        volume: Number.isFinite(Number(audio?.volume)) ? Number(audio.volume) : null,
        queue_length: Array.isArray(playlistStore.queue) ? playlistStore.queue.length : 0,
        play_mode: this.playMode
      };
      return {
        ...payload,
        ...extraPayload && typeof extraPayload === "object" ? extraPayload : {}
      };
    },
    _trackPlaybackEvent(eventType, payload = {}, { immediate = true } = {}) {
      if (!eventType) return;
      const fullPayload = this._buildPlaybackSnapshot(payload);
      if (immediate) {
        playbackEventTracker.trackImmediate(eventType, fullPayload);
      } else {
        playbackEventTracker.track(eventType, fullPayload);
      }
    },
    _cloneTrackForQueue(track) {
      return track && typeof track === "object" ? { ...track } : track;
    },
    _commitTrackForImmediateUi(track, {
      seekTime = null,
      playbackIntentId = null
    } = {}) {
      if (!track || typeof track !== "object") return null;
      if (playbackIntentId && !this._isPlaybackIntentActive(playbackIntentId)) return null;
      const newHash = track.hash_id ?? track.id ?? null;
      if (!newHash) return null;
      const prevHash = this.currentHashId;
      const prevTrackId = this._currentTrackId(this.currentTrack);
      const existingOptimisticSwitch = this._optimisticTrackSwitch;
      if (prevHash !== newHash) {
        const playlistStore = usePlaylistStore();
        if (prevHash && playlistStore.queue.length) {
          const prevIndex = playlistStore.getIndex(prevHash);
          const nextIndex = playlistStore.getIndex(newHash);
          this.uiDirection = prevIndex !== -1 && nextIndex !== -1 ? nextIndex > prevIndex ? "down" : "up" : null;
        } else {
          this.uiDirection = null;
        }
        this.lastLocateHashId = prevHash;
        this._optimisticTrackSwitch = {
          playbackIntentId,
          fromHashId: prevHash,
          fromTrackId: prevTrackId,
          toHashId: newHash
        };
      } else if (existingOptimisticSwitch && existingOptimisticSwitch.toHashId === newHash && (!playbackIntentId || existingOptimisticSwitch.playbackIntentId === playbackIntentId)) {
        this._optimisticTrackSwitch = existingOptimisticSwitch;
      }
      this.currentHashId = newHash;
      this.currentTrack = track;
      this._endOfTrackTriggered = false;
      this._durationMismatchWarnedKey = null;
      const normalizedSeekTime = Number(seekTime);
      const hasSeekTime = seekTime !== null && Number.isFinite(normalizedSeekTime);
      this._applyInitialTrackTiming(track, hasSeekTime ? Math.max(0, normalizedSeekTime) : 0);
      this._initialized = true;
      return {
        prevHash,
        prevTrackId,
        newHash
      };
    },
    async _buildQueueInChunks(sourceList, chunkSize = 120) {
      const output = [];
      for (let i = 0; i < sourceList.length; i += chunkSize) {
        const slice = sourceList.slice(i, i + chunkSize).map((item) => this._cloneTrackForQueue(item));
        output.push(...slice);
        if (i + chunkSize < sourceList.length) {
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      }
      return output;
    },
    _hydrateContextQueue(cloned, normalizedContext, queueOptions = void 0) {
      const playlistStore = usePlaylistStore();
      const isTransient = normalizedContext?.transient === true;
      const shuffled = [...cloned].sort(() => Math.random() - 0.5);
      playlistStore.loopListQueue = [...cloned];
      if (!isTransient) {
        playlistStore._persistModeCache("loop_list", cloned);
        playlistStore._persistModeCache("shuffle", shuffled);
      }
      if (playlistStore.mode === PLAY_MODES.SHUFFLE) {
        playlistStore.setQueue(shuffled, queueOptions);
      } else {
        playlistStore.setQueue(cloned, queueOptions);
      }
    },
    async setContextQueue(list, context = null) {
      const normalizedContext = context && typeof context === "object" && !Array.isArray(context) ? context : { contextId: context };
      const contextId = this._resolveContextId(normalizedContext);
      const prevContextId = this._playbackContextId;
      this._setPlaybackContext(contextId);
      if (contextId !== prevContextId) {
        this._trackPlaybackEvent("playlist_switch", {
          trigger_source: normalizedContext?.triggerSource || "manual_user",
          source: normalizedContext?.source || "context_queue_set",
          from_playlist_id: prevContextId,
          to_playlist_id: contextId
        }, { immediate: true });
      }
      const isTransient = normalizedContext?.transient === true;
      const queueOptions = isTransient ? { persist: false, sync: false } : void 0;
      const sourceList = Array.isArray(list) ? list : [];
      const useChunked = normalizedContext?.chunked === true;
      const hugeListThreshold = Number.isFinite(normalizedContext?.hugeListThreshold) ? Math.max(1, Math.trunc(normalizedContext.hugeListThreshold)) : 260;
      const cloned = useChunked && sourceList.length >= hugeListThreshold ? await this._buildQueueInChunks(sourceList) : sourceList.map((s) => this._cloneTrackForQueue(s));
      this._hydrateContextQueue(cloned, normalizedContext, queueOptions);
      return cloned;
    },
    _safeCloneTrack(track) {
      return track && typeof track === "object" ? { ...track } : null;
    },
    _restorePlayModeFromSnapshot(snapshot) {
      const savedMode = snapshot?.playMode || snapshot?.resume?.mode || null;
      if (!savedMode || !Object.values(PLAY_MODES).includes(savedMode)) return;
      this.playMode = savedMode;
      try {
        usePlaylistStore().mode = savedMode;
      } catch (_) {
      }
    },
    _primeResumeStateFromSnapshot() {
      if (this.currentTrack) return;
      const snapshot = readPlayerResumeCache();
      this._restorePlayModeFromSnapshot(snapshot);
      const saved = snapshot?.resume;
      const savedHashId = saved?.currentHashId ?? null;
      if (!savedHashId) return;
      const lastTrack = snapshot?.currentTrack;
      const lastHashId = lastTrack?.hash_id ?? lastTrack?.id ?? null;
      if (!lastTrack || lastHashId !== savedHashId) return;
      this.currentTrack = this._safeCloneTrack(lastTrack);
      this.currentHashId = savedHashId;
      const seekTime = Math.max(0, Number(saved?.currentTime ?? 0) || 0);
      const trackDuration = this._getTrackDurationHint(this.currentTrack);
      const savedDuration = normalizeDurationSeconds(saved?.duration);
      const duration = trackDuration > 0 ? trackDuration : 0;
      if (savedDuration > 0 && trackDuration > 0 && !areDurationsClose(savedDuration, trackDuration)) {
        this._warnDurationMismatch(savedDuration, trackDuration, "resume_cache");
      }
      this._applyTimingState({
        currentTime: seekTime,
        duration,
        source: duration > 0 ? "track" : "none",
        trustedForEnd: duration > 0
      });
      this.isPlaying = false;
      this.updateMediaSession();
    },
    _bindResumeLifecycleHooks() {
      if (resumeLifecycleBound || typeof window === "undefined") return;
      resumeLifecycleBound = true;
      const flushResume = () => {
        try {
          this.flushResumeState();
        } catch (_) {
        }
      };
      window.__tyPlayerResumeFlushNow = flushResume;
      window.__tyPauseForAudioRouteChange = () => {
        if (!this.audio || this.audio.paused) return false;
        this.pause("audio_route_disconnect");
        return true;
      };
      if (typeof document !== "undefined") {
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "hidden") {
            flushResume();
          } else if (this.audio) {
            this._syncPlaybackTimingFromAudio("foreground");
            this._reportNativePlaybackProgress(true);
          }
        });
      }
      window.addEventListener("pagehide", flushResume);
      window.addEventListener("beforeunload", flushResume);
    },
    flushResumeState() {
      this._saveResumeStateThrottled(true);
    },
    initAudio(audioElement) {
      if (this.audio) return;
      this.audio = audioElement;
      const playlistStore = usePlaylistStore();
      playlistStore.mode = this.playMode;
      playbackEventTracker.start(() => this._buildPlaybackSnapshot());
      playbackEventTracker.setSnapshotProvider(() => this._buildPlaybackSnapshot());
      this._bindResumeLifecycleHooks();
      this._primeResumeStateFromSnapshot();
      this.audio.ontimeupdate = () => {
        const tick = resolveBackgroundPlaybackTick({
          hidden: typeof document !== "undefined" && document.hidden,
          position: this.audio.currentTime,
          duration: this.duration,
          trustedForEnd: this._durationTrustedForEnd
        });
        if (tick.publishTiming) this._syncPlaybackTimingFromAudio("timeupdate");
        this._reportNativePlaybackProgress();
        this._saveResumeStateThrottled();
        if (tick.nearEnd && this.isPlaying && this.currentHashId && !this._endOfTrackTriggered) {
          const intentId = this._currentPlaybackIntentId;
          if (intentId && this._autoAdvanceHandledIntentId !== intentId) {
            this._endOfTrackTriggered = true;
            console.log(`[TY_PlayerStore] ⏱ end-of-track detected via ontimeupdate hash=${String(this.currentHashId).substring(0, 12)} time=${this.currentTime.toFixed(1)}/${this.duration.toFixed(1)}`);
            this._autoAdvanceCurrentTrack({
              triggerSource: "auto_track_end",
              switchReason: "track_ended_timeupdate"
            });
          }
        }
      };
      this.audio.onended = () => {
        console.log(`[TY_PlayerStore] 🔊 audio.onended fired hash=${String(this.currentHashId).substring(0, 12)}`);
        this._autoAdvanceCurrentTrack({
          triggerSource: "auto_track_end",
          switchReason: "track_ended"
        });
      };
      this.audio.ondurationchange = () => {
        this._syncPlaybackTimingFromAudio("durationchange");
      };
      this.audio.onplay = () => {
        this.isPlaying = true;
        this._notifyNativeSongStarted();
        this._setMediaSessionPlaybackState("playing");
        this._syncNativePlaybackFull();
        const triggerSource = this._pendingPlayTriggerSource || "manual_user";
        this._pendingPlayTriggerSource = null;
        this._trackPlaybackEvent("play_resume", {
          trigger_source: triggerSource
        }, { immediate: true });
        this._saveResumeStateThrottled(true);
      };
      this.audio.onpause = () => {
        if (this._suppressPauseEvent) {
          this._suppressPauseEvent = false;
          this._pendingPauseTriggerSource = null;
          return;
        }
        const wasPlaying = this.isPlaying;
        this.isPlaying = false;
        this._setMediaSessionPlaybackState("paused");
        const triggerSource = this._pendingPauseTriggerSource || "manual_user";
        this._pendingPauseTriggerSource = null;
        this._trackPlaybackEvent("play_pause", {
          trigger_source: triggerSource
        }, { immediate: true });
        this._saveResumeStateThrottled(true);
        this._syncPlaybackTimingFromAudio("pause");
        const nearDurationEnd = this._isNearTrustedDurationEnd();
        const isEndOfTrack = this.audio?.ended || nearDurationEnd;
        const wasActivelyPlaying = wasPlaying && !this._endOfTrackTriggered;
        if (isEndOfTrack && wasActivelyPlaying && this.currentHashId) {
          console.log(`[TY_PlayerStore] ⏹ onpause end-of-track detected hash=${String(this.currentHashId).substring(0, 12)} ended=${!!this.audio?.ended} nearEnd=${nearDurationEnd} time=${this.currentTime.toFixed(1)}/${this.duration.toFixed(1)}`);
          this._autoAdvanceCurrentTrack({
            triggerSource: "auto_track_end",
            switchReason: "track_ended_pause_fallback"
          });
        } else if (!this._endOfTrackTriggered) {
          this._reportNativePlaybackProgress(true);
        }
      };
      this.fetchPlaylistForMode(this.playMode).finally(() => {
        this.restoreResumeState();
      });
      if (!this._localAudioSwitchedAt) this._localAudioSwitchedAt = {};
      window.onLocalAudioReady = (event) => {
        try {
          const data = typeof event === "string" ? JSON.parse(event) : event;
          const hashId = data?.hashId || data;
          const localPath = data?.path || "";
          if (!hashId) return;
          console.log(`[TY_PlayerStore] 📥 onLocalAudioReady hashId=${String(hashId).substring(0, 12)} currentHash=${String(this.currentHashId).substring(0, 12)}`);
          this._switchTargetTrackToLocalAudio(hashId, {
            path: localPath,
            switchReason: "local_cache_ready"
          });
        } catch (_) {
        }
      };
      if (!this._searchCacheEventUnsubscribe) {
        this._searchCacheEventUnsubscribe = onSearchCacheEvent((event) => {
          try {
            const hashId = event?.hashId || event?.songId || "";
            if (!hashId) return;
            const eventType = this._normalizeCacheEventStatus(event?.type || event?.status);
            if (SEARCH_CACHE_READY_STATUSES.has(eventType)) {
              console.log(`[TY_PlayerStore] 📥 onSearchCacheEvent READY hashId=${String(hashId).substring(0, 12)} currentHash=${String(this.currentHashId).substring(0, 12)}`);
              this._switchTargetTrackToLocalAudio(hashId, {
                path: event?.path || "",
                switchReason: "search_cache_ready"
              });
              return;
            }
            if (SEARCH_CACHE_FAILED_STATUSES.has(eventType)) {
              console.warn(`[TY_PlayerStore] ⚠ search cache FAILED hashId=${String(hashId).substring(0, 12)}: ${event?.message || ""} — streaming continues`);
            }
          } catch (_) {
          }
        });
      }
      if (window.Android?.replayPendingCacheEvents) {
        try {
          window.Android.replayPendingCacheEvents();
        } catch (_) {
        }
      }
      this._syncQueueLocalSources();
    },
    _saveResumeStateThrottled(force = false) {
      const playlistStore = usePlaylistStore();
      try {
        if (!this.audio) {
          return;
        }
        if (!this.currentHashId) {
          return;
        }
        const now2 = Date.now();
        if (!force && now2 - this._resumeLastSavedAt < 5e3) return;
        const audioTime = normalizePositionSeconds(this.audio.currentTime);
        const stateTime = normalizePositionSeconds(this.currentTime);
        const currentTime = audioTime > 0 ? audioTime : stateTime;
        const resolvedDuration = this._resolvePlaybackDuration(this.audio.duration, { reason: "resume_save" });
        const duration = resolvedDuration.trustedForEnd ? resolvedDuration.duration : 0;
        const audioSrc = `${this.audio.currentSrc || this.audio.src || this.audio.getAttribute?.("src") || ""}`;
        if (!audioSrc && currentTime <= 0) return;
        const previous = readPlayerResumeCache()?.resume;
        const prevTime = Number(previous?.currentTime) || 0;
        const prevUpdatedAt = Number(previous?.updatedAt) || 0;
        const isFromPriorSession = prevUpdatedAt > 0 && now2 - prevUpdatedAt > 3e4;
        const prevHashMatches = previous?.currentHashId === this.currentHashId;
        const isNearZero = currentTime <= 0.25;
        if (prevHashMatches && !this.audio.ended) {
          if (isFromPriorSession && prevTime > 0.5 && isNearZero) {
            return;
          }
          if (!isFromPriorSession && prevTime > 2 && isNearZero) {
            return;
          }
        }
        this._resumeLastSavedAt = now2;
        const queueFingerprint = Array.isArray(playlistStore.queue) ? playlistStore.queue.slice(0, 2e3).map((t) => `${t?.hash_id ?? t?.id ?? ""}`).filter(Boolean) : [];
        const payload = {
          currentHashId: this.currentHashId,
          currentTime,
          duration,
          progress: clampProgressPercent(currentTime, duration),
          durationSource: resolvedDuration.source,
          durationTrusted: !!resolvedDuration.trustedForEnd,
          wasPlaying: !!this.isPlaying,
          pending: false,
          updatedAt: now2,
          mode: this.playMode,
          queueFingerprint
        };
        writePlayerResumeCache({
          resume: payload,
          currentTrack: this._safeCloneTrack(this.currentTrack),
          playMode: this.playMode
        });
      } catch (_) {
      }
    },
    restoreResumeState() {
      try {
        const snapshot = readPlayerResumeCache();
        const saved = snapshot?.resume;
        if (!saved || typeof saved !== "object") return;
        const savedHashId = saved?.currentHashId ?? null;
        if (!savedHashId) return;
        const playlistStore = usePlaylistStore();
        if (!Array.isArray(playlistStore.queue)) return;
        let track = playlistStore.queue.find((t) => (t?.hash_id ?? t?.id) === savedHashId);
        if (!track) {
          const lastTrack = snapshot?.currentTrack;
          const lastHashId = lastTrack?.hash_id ?? lastTrack?.id ?? null;
          if (lastHashId === savedHashId) {
            track = lastTrack;
            playlistStore._setQueueInternal([track, ...playlistStore.queue]);
          }
        }
        if (!track) {
          console.warn(`[PlayerStore] resume skipped: saved track not found (${savedHashId})`);
          return;
        }
        const seekTime = Math.max(0, Number(saved?.currentTime ?? 0) || 0);
        const autoplay = !!saved?.wasPlaying;
        this.playTrack(track, {
          autoplay,
          seekTime,
          triggerSource: "system_restore",
          switchReason: "resume_restore"
        });
      } catch (e) {
        console.warn("恢复上次播放进度失败", e);
      }
    },
    async loadTrack(track, {
      autoplay = true,
      seekTime = null,
      triggerSource = "manual_user",
      switchReason = "track_select",
      _playbackIntentId = null
    } = {}) {
      if (!track || !this.audio) return;
      const playbackIntentId = _playbackIntentId || this._beginPlaybackIntent();
      if (!this._isPlaybackIntentActive(playbackIntentId)) return;
      this._registerPlaybackIntent(playbackIntentId);
      const playlistStore = usePlaylistStore();
      playlistStore.addToHistory(track);
      const newHash = track.hash_id ?? track.id ?? null;
      const optimisticSwitch = this._optimisticTrackSwitch && this._optimisticTrackSwitch.toHashId === newHash && (!this._optimisticTrackSwitch.playbackIntentId || this._optimisticTrackSwitch.playbackIntentId === playbackIntentId) ? this._optimisticTrackSwitch : null;
      const prevHash = optimisticSwitch ? optimisticSwitch.fromHashId : this.currentHashId;
      const prevTrackId = optimisticSwitch ? optimisticSwitch.fromTrackId : this._currentTrackId(this.currentTrack);
      const isTrackChanged = prevHash !== newHash;
      if (optimisticSwitch) {
        this._optimisticTrackSwitch = null;
      }
      const _srcType = track.source_type || (track.bvid || track.bili_url ? "bilibili" : "official");
      const _localSrc = track.src && !track.src.startsWith("/api/");
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.log(
          `[PlayerStore] ▶ loadTrack | hash=${newHash} | source=${_srcType} | localAudio=${_localSrc} | autoplay=${autoplay} | seekTime=${seekTime}`
        );
      }
      if (this.currentHashId && playlistStore.queue.length) {
        const prevIndex = playlistStore.getIndex(this.currentHashId);
        const nextIndex = playlistStore.getIndex(newHash);
        this.uiDirection = prevIndex !== -1 && nextIndex !== -1 ? nextIndex > prevIndex ? "down" : "up" : null;
      }
      this.lastLocateHashId = prevHash;
      this.currentHashId = newHash;
      this.currentTrack = track;
      this._endOfTrackTriggered = false;
      this._durationMismatchWarnedKey = null;
      this._pendingPlayTriggerSource = triggerSource;
      const normalizedSeekTime = Number(seekTime);
      const hasSeekTime = seekTime !== null && Number.isFinite(normalizedSeekTime);
      this._applyInitialTrackTiming(track, hasSeekTime ? Math.max(0, normalizedSeekTime) : 0);
      if (isTrackChanged) {
        this._trackPlaybackEvent("track_switch", {
          trigger_source: triggerSource,
          switch_reason: switchReason,
          from_track_id: prevTrackId,
          to_track_id: newHash,
          from_playlist_id: this._playbackContextId,
          to_playlist_id: this._playbackContextId,
          autoplay,
          is_playing: !!autoplay && !!this.isPlaying,
          seek_time_sec: Number.isFinite(Number(seekTime)) ? Number(seekTime) : null
        }, { immediate: true });
      }
      if (autoplay) this._notifyNativeSongStarted();
      const streamId = newHash || track.id || track.hash_id || "";
      const streamUrl = track.src || (streamId ? `/api/stream/${encodeURIComponent(streamId)}/audio.m3u8` : "");
      if (!streamUrl) {
        console.warn("[PlayerStore] cannot resolve playable stream url:", track);
        this._onPlaybackFailed(track);
        return;
      }
      const shouldSuppressPauseEvent = !this.audio.paused || this.audio.ended;
      if (this._suppressPauseTimeoutId) {
        clearTimeout(this._suppressPauseTimeoutId);
        this._suppressPauseTimeoutId = null;
      }
      this._suppressPauseEvent = shouldSuppressPauseEvent;
      if (shouldSuppressPauseEvent) {
        this._pendingPauseTriggerSource = "system";
        this._suppressPauseTimeoutId = setTimeout(() => {
          this._suppressPauseEvent = false;
          this._pendingPauseTriggerSource = null;
          this._suppressPauseTimeoutId = null;
        }, 5e3);
      }
      try {
        this.audio.pause();
        this.audio.removeAttribute("src");
        this.audio.load();
      } catch (_) {
      }
      if (this.hls) {
        this.hls.destroy();
        this.hls = null;
      }
      const _clearSuppressionOnReady = () => {
        if (this._suppressPauseEvent) {
          this._suppressPauseEvent = false;
          this._pendingPauseTriggerSource = null;
        }
        if (this._suppressPauseTimeoutId) {
          clearTimeout(this._suppressPauseTimeoutId);
          this._suppressPauseTimeoutId = null;
        }
      };
      const applySeek = () => {
        if (!this.audio) return;
        if (!hasSeekTime) return;
        try {
          this.audio.currentTime = Math.max(0, normalizedSeekTime);
        } catch (_) {
        }
      };
      const tryAutoplay = () => {
        if (!this.audio) return;
        if (!autoplay) return;
        if (this.isVideoActive) {
          console.log("[PlayerStore] 视频模式激活，阻止音频自动播放");
          return;
        }
        this.audio.play().catch(() => {
        });
      };
      this.audio.onloadedmetadata = () => {
        _clearSuppressionOnReady();
        applySeek();
        this._syncPlaybackTimingFromAudio("loadedmetadata");
        tryAutoplay();
      };
      const Hls = streamUrl.endsWith(".m3u8") ? await getHls() : null;
      if (!this._isPlaybackIntentActive(playbackIntentId) || this.currentHashId !== newHash) {
        return;
      }
      if (Hls?.isSupported() && streamUrl.endsWith(".m3u8")) {
        this.hls = new Hls({
          // ── 按需缓冲配置 ─────────────────────────────────────────
          // 目标：只预取 2-3 个 TS 分片（每片约 5s），降低流式带宽消耗。
          // 等后台 Bili 下载完成后切换本地文件，整首歌只消耗 1-2 片网络流量。
          maxBufferLength: 12,
          // 最多向前缓冲 12 秒（约 2-3 片）
          maxMaxBufferLength: 18,
          // 绝对上限 18 秒
          maxBufferSize: 2 * 1024 * 1024,
          // 内存缓冲上限 2 MB
          startFragPrefetch: false
          // 不在当前分片播完前提前拉取下一片
          // ───────────────────────────────────────────────────────
        });
        this.hls.attachMedia(this.audio);
        this.hls.on(Hls.Events.MANIFEST_PARSED, (_ev, _data) => {
          _clearSuppressionOnReady();
          applySeek();
          this._syncPlaybackTimingFromAudio("hls_manifest");
          tryAutoplay();
        });
        let _hlsReady = false;
        this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
          _hlsReady = true;
        });
        this.hls.on(Hls.Events.LEVEL_LOADED, () => {
          _hlsReady = true;
        });
        const _fallbackId = setTimeout(() => {
          if (!_hlsReady && this.currentHashId === newHash) {
            _clearSuppressionOnReady();
            applySeek();
            this._syncPlaybackTimingFromAudio("hls_ready_fallback");
            tryAutoplay();
          }
        }, 3e3);
        this.hls.on(Hls.Events.LEVEL_LOADED, () => clearTimeout(_fallbackId));
        this.hls.loadSource(streamUrl);
        this.hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            console.warn(`[TY_PlayerStore] HLS fatal | hash=${newHash} | ${data.details}`);
          }
        });
      } else {
        this.audio.src = streamUrl;
      }
      this.audio.onerror = () => {
        const isStream = streamUrl.endsWith(".m3u8");
        if (!isStream) {
          console.warn("[TY_PlayerStore] audio.onerror non-M3U8", newHash);
          this._onPlaybackFailed(track);
        }
      };
      this.updateMediaSession();
      this._saveResumeStateThrottled(true);
    },
    /**
     * 设置视频模式状态
     * @param {boolean} active - 视频模式是否激活
     */
    setVideoMode(active) {
      const wasActive = this.isVideoActive;
      this.isVideoActive = !!active;
      console.log(`[PlayerStore] 视频模式${active ? "已激活" : "已关闭"}, isVideoActive=${this.isVideoActive}`);
      if (active && !wasActive) {
        playbackEventTracker.suspend();
      } else if (!active && wasActive) {
        playbackEventTracker.resume();
      }
      if (active && !wasActive && this.audio && !this.audio.paused) {
        console.log("[PlayerStore] 进入视频模式，暂停原生音频");
        try {
          this.audio.pause();
        } catch (err) {
          console.warn("[PlayerStore] 暂停音频失败:", err);
        }
      }
      if (!active && wasActive && this.isPlaying && this.audio) {
        console.log("[PlayerStore] 退出视频模式，准备恢复原生音频播放, audio.paused=", this.audio.paused);
        setTimeout(() => {
          if (this.audio && this.audio.paused) {
            console.log("[PlayerStore] 检测到音频已暂停，尝试恢复播放");
            this.audio.play().catch((err) => {
              console.warn("[PlayerStore] 退出视频模式后恢复播放失败:", err);
            });
          } else if (this.audio && !this.audio.paused) {
            console.log("[PlayerStore] 音频已在播放中，无需恢复");
          }
        }, 100);
      }
    },
    // ── 统一播放入口 ──────────────────────────────────────────────
    // 原则：始终流式兜底加载播放，后台静默入队缓存。就绪后自动切换本地文件。
    // 所有业务场景（手动、自动切歌、歌单、搜索）的唯一差异仅在于
    // {triggerSource, switchReason, hash_id 来源} —— 播放逻辑路径统一。
    async playTrack(track, {
      autoplay = true,
      seekTime = 0,
      triggerSource = "manual_user",
      switchReason = "track_select",
      _playbackIntentId = null,
      // 以下参数已废弃，仅保留签名兼容（内部始终启用缓存 + 流式兜底）
      cachePreference = true,
      cacheFallbackToStream = true
    } = {}) {
      const playbackIntentId = _playbackIntentId || this._beginPlaybackIntent();
      if (!this._isPlaybackIntentActive(playbackIntentId)) return;
      this._commitTrackForImmediateUi(track, {
        seekTime,
        playbackIntentId
      });
      let t = track;
      if (track && track.id && (track.cover_user_path === void 0 || track.lrc_user_path === void 0)) {
        const playlistStore = usePlaylistStore();
        const found = playlistStore.queue.find((s) => (s.hash_id ?? s.id) === (track.hash_id ?? track.id));
        if (found) {
          t = { ...track };
          const foundCover = found.cover_user_path;
          if (foundCover !== void 0 && t.cover_user_path === void 0) {
            t.cover_user_path = foundCover;
          }
          const foundLrc = found.lrc_user_path;
          if (foundLrc !== void 0 && t.lrc_user_path === void 0) {
            t.lrc_user_path = foundLrc;
          }
        }
      }
      t = this._attachLocalAudioSourceIfAvailable(t);
      this._commitTrackForImmediateUi(t, {
        seekTime,
        playbackIntentId
      });
      if (autoplay) {
        this.isPlaying = true;
        this._setMediaSessionPlaybackState("playing");
      }
      const tHash = t?.hash_id ?? t?.id ?? "?";
      const isLocal = (t?.src || "").startsWith("/api/stream_local");
      console.log(`[TY_PlayerStore] ▶ playTrack hash=${String(tHash).substring(0, 12)} switchReason=${switchReason} triggerSource=${triggerSource} localAudio=${isLocal} autoplay=${autoplay}`);
      const loadResult = await this.loadTrack(t, {
        autoplay,
        seekTime,
        triggerSource,
        switchReason,
        _playbackIntentId: playbackIntentId
      });
      if (!this._isPlaybackIntentActive(playbackIntentId)) return loadResult;
      const cacheEligible = this._canUseAndroidCache(t);
      const hasLocal = this._trackHasLocalAudio(t);
      if (cacheEligible && !hasLocal) {
        const targetHashId = t?.hash_id ?? t?.id ?? null;
        console.log(`[TY_PlayerStore] 📦 _queueAndroidCache starting for ${String(targetHashId).substring(0, 12)}`);
        this._queueAndroidCache(t).then((payload) => {
          if (!this._isPlaybackIntentActive(playbackIntentId)) {
            console.log("[TY_PlayerStore] 📦 _queueAndroidCache response stale (playback intent changed)");
            return;
          }
          const payloadStatus = this._normalizeCacheEventStatus(payload?.status);
          console.log(`[TY_PlayerStore] 📦 _queueAndroidCache response status=${payloadStatus} hasLocal=${this._trackHasLocalAudio(this.currentTrack)}`);
          if (this._trackHasLocalAudio(this.currentTrack) || SEARCH_CACHE_READY_STATUSES.has(payloadStatus)) {
            this.playPendingTrackIfReady(targetHashId, {
              path: payload?.path || payload?.filePath || "",
              switchReason: "search_cache_ready_response"
            });
          }
        }).catch((error) => {
          if (!this._isPlaybackIntentActive(playbackIntentId)) return;
          console.warn("[TY_PlayerStore] 📦 _queueAndroidCache FAILED:", error?.message || error);
        });
      } else if (cacheEligible && hasLocal) {
        console.log(`[TY_PlayerStore] 📦 _queueAndroidCache SKIPPED (already has local audio)`);
      }
      return loadResult;
    },
    // 点击列表播放上下文
    async playWithContext(list, index, context = null) {
      const playlistStore = usePlaylistStore();
      const normalizedContext = context && typeof context === "object" && !Array.isArray(context) ? context : { contextId: context };
      const triggerSource = normalizedContext?.triggerSource || "manual_user";
      const playbackIntentId = this._beginPlaybackIntent();
      const nextContextId = this._resolveContextId(normalizedContext);
      const prevContextId = this._playbackContextId;
      const isTransient = normalizedContext?.transient === true;
      const sourceList = Array.isArray(list) ? list : [];
      const clickedTrack = sourceList[index];
      this._commitTrackForImmediateUi(clickedTrack, {
        seekTime: 0,
        playbackIntentId
      });
      const useChunked = normalizedContext?.chunked === true;
      const hugeListThreshold = Number.isFinite(normalizedContext?.hugeListThreshold) ? Math.max(1, Math.trunc(normalizedContext.hugeListThreshold)) : 260;
      const cloned = useChunked && sourceList.length >= hugeListThreshold ? await this._buildQueueInChunks(sourceList) : sourceList.map((s) => this._cloneTrackForQueue(s));
      if (!this._isPlaybackIntentActive(playbackIntentId)) return;
      const shuffled = [...cloned].sort(() => Math.random() - 0.5);
      playlistStore.loopListQueue = [...cloned];
      if (!isTransient) {
        playlistStore._persistModeCache("loop_list", cloned);
        playlistStore._persistModeCache("shuffle", shuffled);
      }
      const queueOptions = isTransient ? { persist: false, sync: false } : void 0;
      if (playlistStore.mode === PLAY_MODES.SHUFFLE) {
        playlistStore.setQueue(shuffled, queueOptions);
      } else {
        playlistStore.setQueue(cloned, queueOptions);
      }
      this._setPlaybackContext(nextContextId);
      if (nextContextId !== prevContextId) {
        this._trackPlaybackEvent("playlist_switch", {
          trigger_source: triggerSource,
          source: normalizedContext?.source || "unknown",
          from_playlist_id: prevContextId,
          to_playlist_id: nextContextId,
          queue_length: playlistStore.queue.length
        }, { immediate: true });
      }
      const clickedHash = clickedTrack?.hash_id ?? clickedTrack?.id ?? null;
      const track = clickedHash ? playlistStore.queue.find((item) => (item?.hash_id ?? item?.id) === clickedHash) : playlistStore.queue[index];
      if (!track) return;
      this.playTrack(track, {
        triggerSource,
        switchReason: normalizedContext?.source ? `context_${normalizedContext.source}` : "context_click",
        _playbackIntentId: playbackIntentId
      });
      this._initialized = true;
    },
    // 冷启动恢复队列
    async fetchPlaylistForMode(mode) {
      const playlistStore = usePlaylistStore();
      try {
        const cachedSongs = readQueueForMode(mode);
        if (Array.isArray(cachedSongs) && cachedSongs.length > 0) {
          playlistStore._setQueueInternal(cachedSongs);
          const llSongs = readLoopList();
          playlistStore.loopListQueue = Array.isArray(llSongs) && llSongs.length > 0 ? [...llSongs] : [...cachedSongs];
          const firstTrack2 = playlistStore.queue[0];
          if (!this.currentTrack && firstTrack2) {
            this.currentTrack = firstTrack2;
            this.currentHashId = firstTrack2.hash_id ?? firstTrack2.id ?? null;
          }
          this._initialized = true;
          this.updateMediaSession();
          return;
        }
        const baseMode = mode === PLAY_MODES.LOOP_SINGLE || mode === PLAY_MODES.SHUFFLE ? PLAY_MODES.LOOP_LIST : mode;
        const res = await apiRequest(`/api/playlist/${baseMode}/get`);
        const data = res.ok ? await res.json() : {};
        const songs = Array.isArray(data.songs) ? data.songs : [];
        const shuffledFallback = [...songs].sort(() => Math.random() - 0.5);
        if (songs.length > 0) {
          playlistStore.loopListQueue = [...songs];
          playlistStore._persistModeCache("loop_list", songs);
          playlistStore._persistModeCache("shuffle", shuffledFallback);
          if (mode === PLAY_MODES.SHUFFLE) {
            playlistStore._setQueueInternal(shuffledFallback);
          } else {
            playlistStore._setQueueInternal(songs);
          }
        } else {
          playlistStore._setQueueInternal([]);
        }
        const firstTrack = playlistStore.queue[0];
        if (!this.currentTrack && firstTrack) {
          this.currentTrack = firstTrack;
          this.currentHashId = firstTrack.hash_id ?? firstTrack.id ?? null;
        }
        this._initialized = true;
        this.updateMediaSession();
      } catch (e) {
        console.warn("恢复播放列表失败", e);
      }
    },
    pause(triggerSource = "manual_user") {
      if (!this.audio) {
        this.isPlaying = false;
        this._setMediaSessionPlaybackState("paused");
        return;
      }
      this._pendingPauseTriggerSource = triggerSource;
      try {
        this.audio.pause();
      } catch (_) {
        this.isPlaying = false;
        this._setMediaSessionPlaybackState("paused");
        this._saveResumeStateThrottled(true);
      }
    },
    togglePlay(triggerSource = "manual_user") {
      if (!this.audio) return;
      if (this.currentTrack) {
        if (this.isPlaying) {
          this.pause(triggerSource);
        } else {
          this._pendingPlayTriggerSource = triggerSource;
          this.audio.play().catch(() => {
          });
        }
        return;
      }
      const playlistStore = usePlaylistStore();
      if (playlistStore.queue.length > 0) {
        const firstTrack = playlistStore.queue[0];
        if (firstTrack) {
          this.playTrack(firstTrack, {
            triggerSource,
            switchReason: "toggle_play_first_track"
          });
          return;
        }
      }
      console.warn("❌ 无法播放：没有currentTrack且播放列表为空");
    },
    // 切换播放模式
    async switchPlayMode(newMode, { triggerSource = "manual_user", source = "player_control" } = {}) {
      const playlistStore = usePlaylistStore();
      const prevMode = this.playMode;
      let loopList = [];
      if (playlistStore.loopListQueue.length > 0) {
        loopList = [...playlistStore.loopListQueue];
      } else {
        const llSongs = readLoopList();
        if (Array.isArray(llSongs) && llSongs.length > 0) {
          loopList = [...llSongs];
        } else if (playlistStore.mode === PLAY_MODES.LOOP_LIST || playlistStore.mode === PLAY_MODES.LOOP_SINGLE) {
          loopList = [...playlistStore.queue];
        }
      }
      this.playMode = newMode;
      playlistStore.mode = newMode;
      playlistStore.resetPriorityTask();
      this._trackPlaybackEvent("play_mode_change", {
        trigger_source: triggerSource,
        source,
        from_mode: prevMode,
        to_mode: newMode
      }, { immediate: true });
      if (loopList.length > 0) {
        playlistStore.loopListQueue = loopList;
        if (newMode === PLAY_MODES.SHUFFLE) {
          const shuffled = [...loopList].sort(() => Math.random() - 0.5);
          playlistStore._persistModeCache("shuffle", shuffled);
          playlistStore.setQueue(shuffled);
        } else {
          playlistStore._persistModeCache(newMode, loopList);
          playlistStore.setQueue([...loopList]);
        }
      } else {
        try {
          const res = await apiRequest(`/api/playlist/${PLAY_MODES.LOOP_LIST}/get`);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data.songs) && data.songs.length) {
              const songs = data.songs;
              playlistStore.loopListQueue = [...songs];
              playlistStore._persistModeCache("loop_list", songs);
              playlistStore._persistModeCache("loop_single", songs);
              const sh = [...songs].sort(() => Math.random() - 0.5);
              playlistStore._persistModeCache("shuffle", sh);
              playlistStore.setQueue(newMode === PLAY_MODES.SHUFFLE ? sh : [...songs]);
            }
          }
        } catch (e) {
          console.warn("切换模式时加载播放列表失败", e);
        }
      }
    },
    seek(percent, { triggerSource = "manual_user", source = "seek_bar" } = {}) {
      if (!this.audio) return;
      const resolvedDuration = this._resolvePlaybackDuration(this.audio.duration, { reason: "seek" });
      const duration = resolvedDuration.duration;
      if (duration <= 0) return;
      const normalizedPercent = Math.min(1, Math.max(0, Number(percent) || 0));
      const fromPosition = normalizePositionSeconds(this.audio.currentTime);
      const toPosition = duration * normalizedPercent;
      try {
        this.audio.currentTime = toPosition;
      } catch (_) {
        return;
      }
      this._applyTimingState({
        currentTime: toPosition,
        duration,
        source: resolvedDuration.source,
        trustedForEnd: resolvedDuration.trustedForEnd
      });
      this._trackPlaybackEvent("play_seek", {
        trigger_source: triggerSource,
        source,
        from_position_sec: fromPosition,
        to_position_sec: Number.isFinite(Number(toPosition)) ? Number(toPosition) : null
      }, { immediate: true });
      this._reportNativePlaybackProgress(true);
    },
    next({ triggerSource = "manual_user", switchReason = "manual_next" } = {}) {
      const playlistStore = usePlaylistStore();
      const nextTrack = playlistStore.getNext(this.currentHashId);
      if (nextTrack) {
        this.playTrack(nextTrack, {
          autoplay: true,
          triggerSource,
          switchReason
        });
      }
    },
    prev({ triggerSource = "manual_user", switchReason = "manual_prev" } = {}) {
      const playlistStore = usePlaylistStore();
      const prevTrack = playlistStore.getPrev(this.currentHashId);
      if (prevTrack) {
        this.playTrack(prevTrack, {
          autoplay: true,
          triggerSource,
          switchReason
        });
      }
    },
    // 静默切换歌曲（用于视频模式）
    silentNext({ triggerSource = "manual_user", switchReason = "silent_next" } = {}) {
      const playlistStore = usePlaylistStore();
      const nextTrack = playlistStore.getNext(this.currentHashId);
      if (nextTrack) {
        this.playTrack(nextTrack, {
          autoplay: false,
          seekTime: 0,
          triggerSource,
          switchReason
        });
      }
    },
    silentPrev({ triggerSource = "manual_user", switchReason = "silent_prev" } = {}) {
      const playlistStore = usePlaylistStore();
      const prevTrack = playlistStore.getPrev(this.currentHashId);
      if (prevTrack) {
        this.playTrack(prevTrack, {
          autoplay: false,
          seekTime: 0,
          triggerSource,
          switchReason
        });
      }
    },
    /**
     * 播放失败时触发单曲完善性检查，尝试补全音频资源后自动跳到下一首
     */
    async _onPlaybackFailed(track) {
      if (!track) return;
      const key = track.hash_id || track.id;
      if (this._failCheckLock?.[key] && Date.now() - this._failCheckLock[key] < 3e4) return;
      if (!this._failCheckLock) this._failCheckLock = {};
      this._failCheckLock[key] = Date.now();
      try {
        if (this._canUseAndroidCache(track)) {
          await this.playTrack(track, {
            autoplay: true,
            triggerSource: "auto_playback_fail",
            switchReason: "playback_failed_cache_retry"
          });
          return;
        }
        const checker = getIntegrityChecker();
        const result = await checker.checkSingleSongIntegrity(track);
        if (result && result.type === "placeholder") {
          console.warn(`[PlayerStore] 歌曲 ${key} 资源不可恢复，跳到下一首`);
          this.next({
            triggerSource: "auto_playback_fail",
            switchReason: "playback_failed_skip"
          });
        }
      } catch (e) {
        console.warn("[PlayerStore] 播放失败完善性检查异常:", e.message);
      }
    },
    updateMediaSession() {
      if (!("mediaSession" in navigator) || !this.currentTrack) return;
      navigator.mediaSession.metadata = new MediaMetadata({
        title: this.currentTrack.title,
        artist: this.currentTrack.artist || "未知艺术家",
        artwork: [{ src: this.currentTrack.cover || "/default_cover.jpg", sizes: "512x512", type: "image/jpeg" }]
      });
      this._setMediaSessionPlaybackState(this.isPlaying ? "playing" : "paused");
      navigator.mediaSession.setActionHandler("play", () => {
        if (!this.isPlaying) this.togglePlay("manual_user");
      });
      navigator.mediaSession.setActionHandler("pause", () => this.pause("manual_user"));
      navigator.mediaSession.setActionHandler("previoustrack", () => this.prev({
        triggerSource: "manual_user",
        switchReason: "media_session_prev"
      }));
      navigator.mediaSession.setActionHandler("nexttrack", () => this.next({
        triggerSource: "manual_user",
        switchReason: "media_session_next"
      }));
    }
  }
});
const logger$5 = createLogger("[CacheStore]");
const SEARCH_LAST_KEY = "search_last_snapshot";
const SEARCH_LAST_MAX_RESULTS = 150;
const lifecycleCallbacks = /* @__PURE__ */ new Map();
const pageBusinessStates = ref({});
const useCacheStore = defineStore("cache", () => {
  const searchCache = ref({
    query: "",
    results: [],
    scrollPosition: 0,
    isLoading: false,
    hasSearched: false,
    lastSearchQuery: "",
    biliMode: false
  });
  const playlistCache = ref({});
  const homeCache = ref({
    scrollPosition: 0,
    playlistsSnapshot: [],
    updatedAt: 0
  });
  const cachedViews = ref([]);
  const routeRestoreFlags = ref({});
  const routeNavigation = ref({
    direction: "forward",
    restoreKey: ""
  });
  const isHomeReady = ref(false);
  const registerLifecycleCallbacks = (pageKey, { onSave, onRestore }) => {
    if (!pageKey) return;
    const registration = {
      onSave: typeof onSave === "function" ? onSave : null,
      onRestore: typeof onRestore === "function" ? onRestore : null
    };
    lifecycleCallbacks.set(pageKey, registration);
    logger$5.log(`注册生命周期回调: ${pageKey}`);
    return () => {
      if (lifecycleCallbacks.get(pageKey) === registration) lifecycleCallbacks.delete(pageKey);
    };
  };
  const unregisterLifecycleCallbacks = (pageKey) => {
    if (!pageKey) return;
    lifecycleCallbacks.delete(pageKey);
    logger$5.log(`注销生命周期回调: ${pageKey}`);
  };
  const triggerSaveState = (pageKey) => {
    if (!pageKey) return;
    const callbacks = lifecycleCallbacks.get(pageKey);
    if (callbacks?.onSave) {
      logger$5.log(`触发状态保存: ${pageKey}`);
      try {
        callbacks.onSave();
      } catch (error) {
        logger$5.error(`状态保存失败: ${pageKey}`, error);
      }
    }
  };
  const triggerRestoreState = (pageKey) => {
    if (!pageKey) return;
    const callbacks = lifecycleCallbacks.get(pageKey);
    if (callbacks?.onRestore) {
      logger$5.log(`触发状态恢复: ${pageKey}`);
      try {
        callbacks.onRestore();
      } catch (error) {
        logger$5.error(`状态恢复失败: ${pageKey}`, error);
      }
    }
  };
  const clearAllLifecycleCallbacks = () => {
    const count = lifecycleCallbacks.size;
    logger$5.log(`清空所有生命周期回调: ${count}个`);
    lifecycleCallbacks.clear();
  };
  const addCachedView = (viewName) => {
    if (!viewName) return;
    if (!cachedViews.value.includes(viewName)) {
      cachedViews.value.push(viewName);
    }
  };
  const removeCachedView = (viewName) => {
    const index = cachedViews.value.indexOf(viewName);
    if (index > -1) {
      cachedViews.value.splice(index, 1);
    }
  };
  const clearCachedViews = () => {
    cachedViews.value = [];
  };
  const clearAllCachedViews = () => {
    cachedViews.value = [];
    clearAllLifecycleCallbacks();
  };
  const saveSearchState = (query, results, scrollPosition, isLoading = false, meta = {}) => {
    searchCache.value = {
      query,
      results,
      scrollPosition,
      isLoading,
      hasSearched: Boolean(meta.hasSearched),
      lastSearchQuery: meta.lastSearchQuery || "",
      biliMode: Boolean(meta.biliMode),
      searchPage: Number(meta.searchPage) || 1,
      searchHasMore: Boolean(meta.searchHasMore),
      searchResultTotal: Number(meta.searchResultTotal) || 0,
      searchRunSeed: meta.searchRunSeed || ""
    };
    try {
      const meaningful = Boolean(
        query && `${query}`.trim() || Array.isArray(results) && results.length > 0 || meta.hasSearched
      );
      if (meaningful) {
        storage.setJSON(SEARCH_LAST_KEY, {
          ...searchCache.value,
          results: Array.isArray(results) ? results.slice(0, SEARCH_LAST_MAX_RESULTS) : [],
          _persistedAt: Date.now()
        });
      }
    } catch (_) {
    }
  };
  const getSearchState = () => searchCache.value;
  const hydrateSearchFromPersisted = () => {
    const current = searchCache.value;
    if (current && Array.isArray(current.results) && current.results.length > 0) return false;
    let snapshot = null;
    try {
      snapshot = storage.getJSON(SEARCH_LAST_KEY);
    } catch (_) {
      snapshot = null;
    }
    if (!snapshot || typeof snapshot !== "object") return false;
    const hasPayload = Boolean(
      snapshot.query && `${snapshot.query}`.trim() || Array.isArray(snapshot.results) && snapshot.results.length > 0 || snapshot.hasSearched
    );
    if (!hasPayload) return false;
    searchCache.value = {
      query: snapshot.query || "",
      results: Array.isArray(snapshot.results) ? snapshot.results : [],
      scrollPosition: Number(snapshot.scrollPosition) || 0,
      isLoading: false,
      hasSearched: Boolean(snapshot.hasSearched),
      lastSearchQuery: snapshot.lastSearchQuery || snapshot.query || "",
      biliMode: Boolean(snapshot.biliMode),
      searchPage: Number(snapshot.searchPage) || 1,
      searchHasMore: Boolean(snapshot.searchHasMore),
      searchResultTotal: Number(snapshot.searchResultTotal) || 0,
      searchRunSeed: snapshot.searchRunSeed || ""
    };
    logger$5.log("hydrated search from persisted snapshot");
    return true;
  };
  const clearSearchState = () => {
    searchCache.value = {
      query: "",
      results: [],
      scrollPosition: 0,
      isLoading: false,
      hasSearched: false,
      lastSearchQuery: "",
      biliMode: false,
      searchPage: 1,
      searchHasMore: false,
      searchResultTotal: 0,
      searchRunSeed: ""
    };
  };
  const savePlaylistState = (playlistId, data) => {
    const clonedSongsSnapshot = Array.isArray(data.songsSnapshot) ? data.songsSnapshot.map((song) => song && typeof song === "object" ? { ...song } : song) : void 0;
    playlistCache.value[playlistId] = {
      scrollPosition: data.scrollPosition || 0,
      selectedItems: data.selectedItems || [],
      songsSnapshot: clonedSongsSnapshot,
      timestamp: Date.now()
    };
  };
  const getPlaylistState = (playlistId) => {
    return playlistCache.value[playlistId] || {
      scrollPosition: 0,
      selectedItems: [],
      songsSnapshot: []
    };
  };
  const clearPlaylistState = (playlistId) => {
    delete playlistCache.value[playlistId];
  };
  const saveHomeState = (payload = 0) => {
    if (payload && typeof payload === "object" && !Array.isArray(payload)) {
      const clonedSnapshot = Array.isArray(payload.playlistsSnapshot) ? payload.playlistsSnapshot.map((playlist) => playlist && typeof playlist === "object" ? { ...playlist } : playlist) : homeCache.value.playlistsSnapshot;
      homeCache.value = {
        ...homeCache.value,
        ...payload,
        playlistsSnapshot: clonedSnapshot,
        updatedAt: Date.now()
      };
      return;
    }
    homeCache.value = {
      ...homeCache.value,
      scrollPosition: Number(payload) || 0,
      updatedAt: Date.now()
    };
  };
  const getHomeState = () => homeCache.value;
  const normalizeRouteRestoreKey = (routeKey) => `${routeKey || ""}`.trim();
  const markRouteRestore = (routeKey) => {
    const key = normalizeRouteRestoreKey(routeKey);
    if (!key) return;
    routeRestoreFlags.value[key] = true;
  };
  const consumeRouteRestore = (routeKey) => {
    const key = normalizeRouteRestoreKey(routeKey);
    if (!key) return false;
    const shouldRestore = Boolean(routeRestoreFlags.value[key]);
    if (shouldRestore) {
      delete routeRestoreFlags.value[key];
    }
    return shouldRestore;
  };
  const clearRouteRestore = (routeKey) => {
    const key = normalizeRouteRestoreKey(routeKey);
    if (!key) return;
    delete routeRestoreFlags.value[key];
  };
  const clearAllRouteRestores = () => {
    routeRestoreFlags.value = {};
  };
  const setRouteNavigation = (direction = "forward", restoreKey = "") => {
    routeNavigation.value = {
      direction,
      restoreKey: `${restoreKey || ""}`.trim()
    };
  };
  const savePageState = (pageType, state) => {
    if (!pageType || !state) {
      logger$5.warn("savePageState 参数无效");
      return;
    }
    pageBusinessStates.value[pageType] = {
      ...state,
      _timestamp: Date.now()
    };
    logger$5.log(`已保存 ${pageType} 业务状态`);
  };
  const getPageState = (pageType) => {
    if (!pageType) return null;
    const state = pageBusinessStates.value[pageType];
    if (!state) return null;
    const { _timestamp, ...cleanState } = state;
    return cleanState;
  };
  const clearPageState = (pageType) => {
    if (!pageType) return;
    delete pageBusinessStates.value[pageType];
    logger$5.log(`已清除 ${pageType} 业务状态`);
  };
  const clearAllCache = () => {
    clearSearchState();
    playlistCache.value = {};
    homeCache.value = {
      scrollPosition: 0,
      playlistsSnapshot: [],
      updatedAt: 0
    };
    clearAllRouteRestores();
    pageBusinessStates.value = {};
    clearAllLifecycleCallbacks();
  };
  return {
    searchCache,
    saveSearchState,
    getSearchState,
    hydrateSearchFromPersisted,
    clearSearchState,
    playlistCache,
    savePlaylistState,
    getPlaylistState,
    clearPlaylistState,
    homeCache,
    saveHomeState,
    getHomeState,
    cachedViews,
    addCachedView,
    removeCachedView,
    clearCachedViews,
    clearAllCachedViews,
    routeRestoreFlags,
    markRouteRestore,
    consumeRouteRestore,
    clearRouteRestore,
    clearAllRouteRestores,
    routeNavigation,
    setRouteNavigation,
    isHomeReady,
    // 生命周期联动
    registerLifecycleCallbacks,
    unregisterLifecycleCallbacks,
    triggerSaveState,
    triggerRestoreState,
    clearAllLifecycleCallbacks,
    // 统一的页面业务状态管理
    savePageState,
    getPageState,
    clearPageState,
    clearAllCache
  };
});
const pendingConfirmResolvers = /* @__PURE__ */ new Map();
let confirmSeed = 0;
function inferToastType(message, explicitType) {
  if (explicitType) return explicitType;
  const text = String(message || "");
  if (/❌|失败|错误|异常|不可恢复/i.test(text)) return "error";
  if (/⚠️|警告|注意|风险|谨慎/i.test(text)) return "warning";
  if (/ℹ️|提示|说明/i.test(text)) return "info";
  return "success";
}
function showGlobalToast(message, options = {}) {
  if (typeof window === "undefined") return;
  const text = String(message ?? "").trim();
  if (!text) return;
  window.dispatchEvent(new CustomEvent("global-toast", {
    detail: {
      message: text,
      type: inferToastType(text, options.type),
      duration: Number(options.duration) > 0 ? Number(options.duration) : 2200
    }
  }));
}
function showGlobalConfirm(options = {}) {
  if (typeof window === "undefined") return Promise.resolve(false);
  const id = `global_confirm_${Date.now()}_${confirmSeed++}`;
  const payload = {
    id,
    title: options.title || "确认操作",
    message: options.message || "",
    confirmText: options.confirmText || "确认",
    cancelText: options.cancelText || "取消",
    danger: Boolean(options.danger)
  };
  return new Promise((resolve) => {
    pendingConfirmResolvers.set(id, resolve);
    window.dispatchEvent(new CustomEvent("global-confirm", { detail: payload }));
  });
}
function resolveGlobalConfirm(id, confirmed) {
  const resolve = pendingConfirmResolvers.get(id);
  if (!resolve) return;
  pendingConfirmResolvers.delete(id);
  resolve(Boolean(confirmed));
}
const useTimerStore = defineStore("timer", () => {
  const playerStore = usePlayerStore$1();
  const timerActive = ref(false);
  const timerWaitingForSongEnd = ref(false);
  const timerRemaining = ref("");
  const timerMode = ref("time");
  const selectedTimeMinutes = ref(30);
  const selectedSongCount = ref(7);
  const finishCurrentSong = ref(true);
  const lastTimeMinutes = ref(null);
  const lastSongCount = ref(null);
  const initialSongCount = ref(0);
  let timerInterval = null;
  let waitCurrentSongInterval = null;
  let timerEndTime = null;
  let restorePlaybackControl = null;
  const clearTimerStorage = () => {
    localStorage.removeItem("timer_mode");
    localStorage.removeItem("timer_end_time");
    localStorage.removeItem("timer_song_count");
    localStorage.removeItem("timer_finish_current");
  };
  const clearRunningIntervals = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    if (waitCurrentSongInterval) {
      clearInterval(waitCurrentSongInterval);
      waitCurrentSongInterval = null;
    }
  };
  const updateTimerDisplay = () => {
    if (timerWaitingForSongEnd.value) {
      timerRemaining.value = "等待当前歌曲播放结束后关闭";
      return;
    }
    const mode = timerMode.value || localStorage.getItem("timer_mode") || "time";
    if (mode === "time" && timerEndTime) {
      const remaining = Math.max(0, timerEndTime - Date.now());
      if (remaining <= 0) {
        timerRemaining.value = "即将关闭";
        return;
      }
      const hours = Math.floor(remaining / 36e5);
      const minutes = Math.floor(remaining % 36e5 / 6e4);
      const seconds = Math.floor(remaining % 6e4 / 1e3);
      if (hours > 0) {
        timerRemaining.value = `⏰ ${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      } else {
        timerRemaining.value = `⏰ ${minutes}:${seconds.toString().padStart(2, "0")}`;
      }
      return;
    }
    if (mode === "count") {
      timerRemaining.value = `🎵 剩余 ${Math.max(0, initialSongCount.value)} 首歌`;
      return;
    }
    timerRemaining.value = "";
  };
  const startTimeTimer = (minutes) => {
    const resolvedMinutes = Math.max(1, Math.trunc(Number(minutes) || 0));
    timerMode.value = "time";
    timerWaitingForSongEnd.value = false;
    timerActive.value = true;
    timerEndTime = Date.now() + resolvedMinutes * 60 * 1e3;
    initialSongCount.value = 0;
    localStorage.setItem("timer_mode", "time");
    localStorage.setItem("timer_end_time", timerEndTime.toString());
    localStorage.setItem("timer_finish_current", finishCurrentSong.value.toString());
    clearRunningIntervals();
    updateTimerDisplay();
    timerInterval = setInterval(() => {
      updateTimerDisplay();
      if (Date.now() >= timerEndTime) {
        executeTimerAction();
      }
    }, 1e3);
    lastTimeMinutes.value = resolvedMinutes;
    localStorage.setItem("last_time_minutes", resolvedMinutes.toString());
  };
  const startCountTimer = (count) => {
    const resolvedCount = Math.max(1, Math.trunc(Number(count) || 0));
    timerMode.value = "count";
    timerWaitingForSongEnd.value = false;
    timerActive.value = true;
    timerEndTime = null;
    if (playerStore.currentTrack && playerStore.isPlaying) {
      initialSongCount.value = resolvedCount - 1;
    } else {
      initialSongCount.value = resolvedCount;
    }
    localStorage.setItem("timer_mode", "count");
    localStorage.setItem("timer_song_count", initialSongCount.value.toString());
    localStorage.setItem("timer_finish_current", finishCurrentSong.value.toString());
    lastSongCount.value = resolvedCount;
    localStorage.setItem("last_song_count", resolvedCount.toString());
    clearRunningIntervals();
    updateTimerDisplay();
    if (initialSongCount.value <= 0) {
      executeTimerAction();
      return;
    }
    let lastTrackId = playerStore.currentHashId || null;
    timerInterval = setInterval(() => {
      const currentTrackId = playerStore.currentHashId;
      if (!lastTrackId && currentTrackId) {
        lastTrackId = currentTrackId;
        return;
      }
      if (currentTrackId && lastTrackId && currentTrackId !== lastTrackId) {
        lastTrackId = currentTrackId;
        initialSongCount.value -= 1;
        localStorage.setItem("timer_song_count", initialSongCount.value.toString());
        updateTimerDisplay();
        if (initialSongCount.value <= 0) {
          executeTimerAction();
        }
      }
    }, 500);
  };
  const cancelTimer = () => {
    timerActive.value = false;
    timerWaitingForSongEnd.value = false;
    timerEndTime = null;
    initialSongCount.value = 0;
    timerRemaining.value = "";
    clearRunningIntervals();
    clearTimerStorage();
    if (typeof restorePlaybackControl === "function") {
      restorePlaybackControl();
      restorePlaybackControl = null;
    }
  };
  const executeTimerAction = () => {
    const shouldFinishCurrent = localStorage.getItem("timer_finish_current") === "true";
    const originalOnEnded = playerStore.audio ? playerStore.audio.onended : null;
    const originalNext = playerStore.next;
    if (playerStore.audio) {
      playerStore.audio.onended = null;
    }
    let isBlocking = true;
    playerStore.next = function(...args) {
      if (isBlocking) return;
      return originalNext.apply(this, args);
    };
    const restoreAutoPlay = () => {
      isBlocking = false;
      playerStore.next = originalNext;
      if (playerStore.audio && originalOnEnded) {
        playerStore.audio.onended = originalOnEnded;
      }
      if (playerStore.audio) {
        playerStore.audio.removeEventListener("play", restoreAutoPlay);
      }
      restorePlaybackControl = null;
    };
    restorePlaybackControl = restoreAutoPlay;
    if (shouldFinishCurrent && playerStore.audio && !playerStore.audio.paused) {
      timerWaitingForSongEnd.value = true;
      timerActive.value = true;
      timerEndTime = null;
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      clearTimerStorage();
      updateTimerDisplay();
      if (waitCurrentSongInterval) {
        clearInterval(waitCurrentSongInterval);
      }
      waitCurrentSongInterval = setInterval(() => {
        if (!playerStore.audio || playerStore.audio.paused || playerStore.audio.ended) {
          if (waitCurrentSongInterval) {
            clearInterval(waitCurrentSongInterval);
            waitCurrentSongInterval = null;
          }
          timerWaitingForSongEnd.value = false;
          timerActive.value = false;
          timerRemaining.value = "";
          if (playerStore.audio) {
            playerStore.audio.pause();
            playerStore.isPlaying = false;
          }
          showGlobalToast("定时任务已完成：音乐已停止");
          setTimeout(() => {
            if (playerStore.audio) playerStore.audio.addEventListener("play", restoreAutoPlay);
          }, 300);
        }
      }, 500);
      return;
    }
    if (playerStore.audio) {
      playerStore.audio.pause();
      playerStore.isPlaying = false;
    }
    cancelTimer();
    showGlobalToast("定时任务已完成：音乐已停止");
    setTimeout(() => {
      if (playerStore.audio) playerStore.audio.addEventListener("play", restoreAutoPlay);
    }, 300);
  };
  const initTimerStatus = () => {
    timerWaitingForSongEnd.value = false;
    const mode = localStorage.getItem("timer_mode");
    const finishCurrent = localStorage.getItem("timer_finish_current");
    if (finishCurrent) {
      finishCurrentSong.value = finishCurrent === "true";
    }
    if (mode === "time") {
      timerMode.value = "time";
      const stored = localStorage.getItem("timer_end_time");
      if (stored) {
        timerEndTime = parseInt(stored, 10);
        if (timerEndTime > Date.now()) {
          timerActive.value = true;
          updateTimerDisplay();
          clearRunningIntervals();
          timerInterval = setInterval(() => {
            updateTimerDisplay();
            if (Date.now() >= timerEndTime) {
              executeTimerAction();
            }
          }, 1e3);
        } else {
          clearTimerStorage();
        }
      }
    } else if (mode === "count") {
      timerMode.value = "count";
      const stored = localStorage.getItem("timer_song_count");
      if (stored) {
        initialSongCount.value = parseInt(stored, 10);
        if (initialSongCount.value > 0) {
          timerActive.value = true;
          updateTimerDisplay();
          clearRunningIntervals();
          let lastTrackId = playerStore.currentHashId || null;
          timerInterval = setInterval(() => {
            const currentTrackId = playerStore.currentHashId;
            if (!lastTrackId && currentTrackId) {
              lastTrackId = currentTrackId;
              return;
            }
            if (currentTrackId && lastTrackId && currentTrackId !== lastTrackId) {
              lastTrackId = currentTrackId;
              initialSongCount.value -= 1;
              localStorage.setItem("timer_song_count", initialSongCount.value.toString());
              updateTimerDisplay();
              if (initialSongCount.value <= 0) {
                executeTimerAction();
              }
            }
          }, 500);
        } else {
          clearTimerStorage();
        }
      }
    }
    const lastTime = localStorage.getItem("last_time_minutes");
    const lastCount = localStorage.getItem("last_song_count");
    if (lastTime) lastTimeMinutes.value = parseInt(lastTime, 10);
    if (lastCount) lastSongCount.value = parseInt(lastCount, 10);
  };
  return {
    timerActive,
    timerWaitingForSongEnd,
    timerRemaining,
    timerMode,
    selectedTimeMinutes,
    selectedSongCount,
    finishCurrentSong,
    lastTimeMinutes,
    lastSongCount,
    startTimeTimer,
    startCountTimer,
    cancelTimer,
    initTimerStatus
  };
});
const useSelectionStore = defineStore("selection", {
  state: () => ({
    // 页面独立的多选状态：key 为页面标识，value 为该页面的选择状态
    pageStates: {},
    // 当前活动的页面标识
    currentPage: null,
    // 防抖相关
    _modeToggleTimeout: null
  }),
  getters: {
    // 当前页面是否在多选模式
    isModeActive(state) {
      const pageState = state.pageStates[state.currentPage];
      return pageState ? pageState.isModeActive : false;
    },
    // 当前页面选中的 ID 集合
    selectedIds(state) {
      const pageState = state.pageStates[state.currentPage];
      return pageState ? pageState.selectedIds : /* @__PURE__ */ new Set();
    },
    // 当前页面选中的 ID 顺序数组
    selectedIdsInOrder(state) {
      const pageState = state.pageStates[state.currentPage];
      if (!pageState) return [];
      return pageState.selectedOrder.filter((id) => pageState.selectedIds.has(id));
    },
    // 当前页面的选择类型
    currentType(state) {
      const pageState = state.pageStates[state.currentPage];
      return pageState ? pageState.currentType : null;
    },
    // 当前页面的任务 ID
    activeTaskId(state) {
      const pageState = state.pageStates[state.currentPage];
      return pageState ? pageState.activeTaskId : null;
    }
  },
  actions: {
    // 设置当前活动页面
    setCurrentPage(pageId) {
      this.currentPage = pageId;
      if (!this.pageStates[pageId]) {
        this.pageStates[pageId] = {
          isModeActive: false,
          selectedIds: /* @__PURE__ */ new Set(),
          selectedOrder: [],
          currentType: null,
          taskSeq: 0,
          activeTaskId: null
        };
      }
    },
    // 进入多选模式
    enterMode(type, firstId) {
      if (!this.currentPage) return;
      if (this._modeToggleTimeout) {
        clearTimeout(this._modeToggleTimeout);
        this._modeToggleTimeout = null;
      }
      const pageState = this.pageStates[this.currentPage];
      if (!pageState) return;
      pageState.isModeActive = true;
      pageState.currentType = type;
      pageState.selectedIds.clear();
      pageState.taskSeq += 1;
      pageState.activeTaskId = pageState.taskSeq;
      pageState.selectedOrder = [];
      if (firstId !== null && firstId !== void 0) {
        pageState.selectedIds.add(firstId);
        pageState.selectedOrder.push(firstId);
      }
    },
    // 选择全部项目
    selectAll(allIds) {
      if (!this.currentPage) return;
      const pageState = this.pageStates[this.currentPage];
      if (!pageState) return;
      pageState.selectedIds.clear();
      pageState.selectedOrder = [];
      allIds.forEach((id) => {
        pageState.selectedIds.add(id);
        pageState.selectedOrder.push(id);
      });
    },
    // 取消选择全部
    selectNone() {
      if (!this.currentPage) return;
      const pageState = this.pageStates[this.currentPage];
      if (!pageState) return;
      pageState.selectedIds.clear();
      pageState.selectedOrder = [];
    },
    // 切换单个项目的选中状态
    toggleItem(id) {
      if (!this.currentPage) return;
      const pageState = this.pageStates[this.currentPage];
      if (!pageState) return;
      if (pageState.selectedIds.has(id)) {
        pageState.selectedIds.delete(id);
        pageState.selectedOrder = pageState.selectedOrder.filter((selectedId) => selectedId !== id);
        if (pageState.selectedIds.size === 0) {
          this.exitMode();
        }
      } else {
        pageState.selectedIds.add(id);
        pageState.selectedOrder.push(id);
      }
    },
    // 退出多选模式
    async exitMode(autoExit = false) {
      if (!this.currentPage) return false;
      const pageState = this.pageStates[this.currentPage];
      if (!pageState) return false;
      if (!autoExit) {
        const selectedCount = pageState.selectedIds.size;
        if (selectedCount >= 5) {
          const confirmed = await showGlobalConfirm({
            title: "退出选择模式",
            message: `已选择 ${selectedCount} 项，确定要退出选择模式吗？`,
            confirmText: "退出",
            cancelText: "继续选择"
          });
          if (!confirmed) return false;
        }
      }
      if (this._modeToggleTimeout) {
        clearTimeout(this._modeToggleTimeout);
      }
      return await new Promise((resolve) => {
        this._modeToggleTimeout = setTimeout(() => {
          pageState.isModeActive = false;
          pageState.selectedIds.clear();
          pageState.selectedOrder = [];
          pageState.currentType = null;
          pageState.activeTaskId = null;
          this._modeToggleTimeout = null;
          resolve(true);
        }, 100);
      });
    }
  }
});
const isMusicControlOpenRef = ref(false);
const isMusicControlOpen = readonly(isMusicControlOpenRef);
function openMusicControl() {
  isMusicControlOpenRef.value = true;
}
function closeMusicControl() {
  isMusicControlOpenRef.value = false;
}
function isMusicControlVisible() {
  return isMusicControlOpenRef.value;
}
const logger$4 = createLogger("[PageStateMachine]");
let activeStackQuery = null;
function canNavigateBack() {
  return activeStackQuery ? activeStackQuery.canGoBack() : false;
}
function getNavPreviousPath() {
  return activeStackQuery ? activeStackQuery.getPreviousPath() : "";
}
const PageType = {
  HOME: "HOME",
  CACHEABLE: "CACHEABLE",
  TEMP: "TEMP"
};
const TransitionEvent = {
  ENTER_PAGE: "ENTER_PAGE",
  ENTER_TEMP: "ENTER_TEMP",
  RETURN_FROM_TEMP: "RETURN_FROM_TEMP",
  RESET_TO_HOME: "RESET_TO_HOME"
};
const ROUTE_TYPE_MAP = {
  home: PageType.HOME,
  search: PageType.CACHEABLE,
  playlist: PageType.CACHEABLE,
  account: PageType.CACHEABLE,
  "listen-stats": PageType.CACHEABLE,
  profile: PageType.CACHEABLE,
  "skin-studio": PageType.CACHEABLE,
  "bili-favorite": PageType.CACHEABLE,
  MusicControlPage: PageType.TEMP,
  auth: PageType.CACHEABLE
};
function inferRouteName(route) {
  if (!route) return "";
  if (route.name) return String(route.name);
  const path = route.path || "";
  if (path === "/" || path === "") return "home";
  if (path.startsWith("/playlist/")) return "playlist";
  if (path === "/search") return "search";
  if (path === "/account") return "account";
  if (path === "/listen-stats") return "listen-stats";
  if (path === "/skin-studio") return "skin-studio";
  if (path === "/music-control") return "MusicControlPage";
  if (path === "/bili-favorite") return "bili-favorite";
  if (path === "/profile") return "profile";
  return "";
}
function resolvePageType(route) {
  if (!route) return null;
  if (route.meta?.noCache) return PageType.TEMP;
  const name = inferRouteName(route);
  return ROUTE_TYPE_MAP[name] || PageType.CACHEABLE;
}
function getPageCacheKey(route) {
  if (!route) return "";
  const routeName = inferRouteName(route);
  if (!routeName) return "";
  if (routeName === "playlist" && route.params?.id) {
    return `playlist_${route.params.id}`;
  }
  return routeName;
}
function createPageStateMachine() {
  const cacheStore = useCacheStore();
  let transitionHistory = [];
  let tempSourceKey = "";
  let routeStack = [];
  activeStackQuery = {
    getDepth: () => routeStack.length,
    canGoBack: () => routeStack.length > 1,
    getTopKey: () => routeStack[routeStack.length - 1]?.key || "",
    getPreviousPath: () => routeStack[routeStack.length - 2]?.path || "",
    getStackSnapshot: () => routeStack.map((item) => ({ ...item }))
  };
  function recordTransition(data) {
    if (!isDebugEnabled()) return;
    const entry = {
      timestamp: Date.now(),
      ...data,
      stack: routeStack.map((item) => item.key || item.path)
    };
    transitionHistory.push(entry);
    if (transitionHistory.length > 100) {
      transitionHistory = transitionHistory.slice(-100);
    }
    if (typeof window !== "undefined") {
      window.__PAGE_STATE__ = {
        history: transitionHistory,
        routeStack: [...entry.stack],
        currentState: data.action
      };
    }
  }
  function log(...args) {
    logger$4.log(...args);
  }
  function makeStackEntry(route) {
    return {
      key: getPageCacheKey(route),
      name: inferRouteName(route),
      path: route?.fullPath || route?.path || "",
      type: resolvePageType(route) || PageType.CACHEABLE
    };
  }
  function hasRouteIdentity(entry) {
    return Boolean(entry?.key || entry?.path);
  }
  function isSameStackEntry(a, b) {
    if (!a || !b) return false;
    if (a.key && b.key) return a.key === b.key;
    return Boolean(a.path && b.path && a.path === b.path);
  }
  function cacheRouteForReturn(route, key = getPageCacheKey(route)) {
    if (!key || key === "home") return;
    if (resolvePageType(route) === PageType.TEMP) return;
    cacheStore.addCachedView(key);
  }
  function clearRouteForFreshEnter(key) {
    if (!key) return;
    cacheStore.removeCachedView(key);
    cacheStore.clearRouteRestore(key);
    cacheStore.clearPageState(key);
    if (key === "search") {
      cacheStore.clearSearchState();
    }
  }
  function enterHomeFresh(toEntry, reason) {
    cacheStore.clearCachedViews();
    cacheStore.clearAllRouteRestores();
    cacheStore.clearPageState("home");
    cacheStore.setRouteNavigation("forward", "");
    routeStack = hasRouteIdentity(toEntry) ? [toEntry] : [];
    tempSourceKey = "";
    log("home fresh", reason);
  }
  function pushForward(fromEntry, toEntry) {
    const top = routeStack[routeStack.length - 1];
    if (hasRouteIdentity(fromEntry) && !isSameStackEntry(top, fromEntry)) {
      routeStack.push(fromEntry);
    }
    if (hasRouteIdentity(toEntry) && !isSameStackEntry(routeStack[routeStack.length - 1], toEntry)) {
      routeStack.push(toEntry);
    }
  }
  function popReverse(fromEntry) {
    if (routeStack.length > 1 && isSameStackEntry(routeStack[routeStack.length - 1], fromEntry)) {
      routeStack.pop();
    }
  }
  function transition(to, from) {
    const toType = resolvePageType(to) || PageType.CACHEABLE;
    const fromType = resolvePageType(from) || PageType.CACHEABLE;
    const toName = inferRouteName(to);
    const fromName = inferRouteName(from);
    const toKey = getPageCacheKey(to);
    const fromKey = getPageCacheKey(from);
    const toEntry = makeStackEntry(to);
    const fromEntry = makeStackEntry(from);
    if (routeStack.length === 0 && hasRouteIdentity(fromEntry)) {
      routeStack = [fromEntry];
    }
    log("transition", {
      from: fromName || from?.path || "(unknown)",
      to: toName || to?.path || "(unknown)",
      fromKey,
      toKey,
      stack: routeStack.map((item) => item.key || item.path)
    });
    if (toKey === "home") {
      enterHomeFresh(toEntry, "home always refresh");
      recordTransition({
        event: TransitionEvent.RESET_TO_HOME,
        from: fromName,
        to: toName,
        fromType,
        toType,
        action: "HOME_FRESH_RECREATE"
      });
      return;
    }
    if (toType === PageType.TEMP) {
      tempSourceKey = fromKey || "";
      cacheRouteForReturn(from, fromKey);
      cacheStore.setRouteNavigation("temp", tempSourceKey);
      pushForward(fromEntry, toEntry);
      recordTransition({
        event: TransitionEvent.ENTER_TEMP,
        from: fromName,
        to: toName,
        fromType,
        toType,
        action: "CACHE_TEMP_SOURCE_ONLY"
      });
      return;
    }
    if (fromType === PageType.TEMP) {
      const shouldRestoreSource = Boolean(tempSourceKey && toKey && toKey === tempSourceKey);
      popReverse(fromEntry);
      if (shouldRestoreSource) {
        cacheStore.addCachedView(toKey);
        cacheStore.markRouteRestore(toKey);
        cacheStore.setRouteNavigation("back", toKey);
      } else {
        clearRouteForFreshEnter(toKey);
        cacheStore.setRouteNavigation("forward", "");
        pushForward(fromEntry, toEntry);
      }
      tempSourceKey = "";
      recordTransition({
        event: TransitionEvent.RETURN_FROM_TEMP,
        from: fromName,
        to: toName,
        fromType,
        toType,
        action: shouldRestoreSource ? "RESTORE_TEMP_SOURCE" : "FRESH_RECREATE"
      });
      return;
    }
    tempSourceKey = "";
    const top = routeStack[routeStack.length - 1];
    const previous = routeStack[routeStack.length - 2];
    const isReverse = routeStack.length > 1 && isSameStackEntry(top, fromEntry) && isSameStackEntry(previous, toEntry);
    if (isReverse) {
      popReverse(fromEntry);
      if (fromKey) {
        cacheStore.removeCachedView(fromKey);
        cacheStore.clearRouteRestore(fromKey);
      }
      if (toKey) {
        cacheStore.addCachedView(toKey);
        cacheStore.markRouteRestore(toKey);
        cacheStore.setRouteNavigation("back", toKey);
      }
    } else {
      cacheRouteForReturn(from, fromKey);
      clearRouteForFreshEnter(toKey);
      cacheStore.setRouteNavigation("forward", "");
      pushForward(fromEntry, toEntry);
    }
    recordTransition({
      event: TransitionEvent.ENTER_PAGE,
      from: fromName,
      to: toName,
      fromType,
      toType,
      action: isReverse ? "RESTORE_FROM_STACK" : "FRESH_RECREATE"
    });
  }
  function getHistory() {
    return [...transitionHistory];
  }
  function clearHistory() {
    transitionHistory = [];
  }
  return {
    transition,
    getHistory,
    clearHistory
  };
}
const pageStateMachine = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  PageType,
  TransitionEvent,
  canNavigateBack,
  createPageStateMachine,
  getNavPreviousPath,
  getPageCacheKey,
  resolvePageType
}, Symbol.toStringTag, { value: "Module" }));
const logger$3 = createLogger("[BackHandler]");
const customHandlers = [];
const HIGH_PRIORITY_HANDLER = 100;
const SKIN_SANDBOX_MESSAGE_TYPE$1 = "ty-skin-sandbox-action";
let installedBackContext = {
  playerStore: null,
  selectionStore: null,
  router: null
};
function postSkinSandboxExit() {
  if (typeof window === "undefined" || window.parent === window) return false;
  const targetOrigin = window.location.origin && window.location.origin !== "null" ? window.location.origin : "*";
  window.parent.postMessage({
    type: SKIN_SANDBOX_MESSAGE_TYPE$1,
    action: "exit-sandbox",
    payload: {}
  }, targetOrigin);
  return true;
}
function registerBackHandler(handler, options = {}) {
  const priority = Number(options?.priority || 0);
  const entry = {
    handler,
    priority: Number.isFinite(priority) ? priority : 0
  };
  customHandlers.push(entry);
  return () => {
    const idx = customHandlers.indexOf(entry);
    if (idx >= 0) customHandlers.splice(idx, 1);
  };
}
function dispatchCustomBackHandlers(predicate = () => true) {
  const handlers = customHandlers.map((entry, index) => ({ entry, index })).filter(({ entry }) => entry && predicate(entry)).sort((a, b) => {
    const priorityDelta = b.entry.priority - a.entry.priority;
    return priorityDelta || b.index - a.index;
  });
  for (const { entry } of handlers) {
    try {
      if (entry.handler()) {
        logger$3.log("handled by custom handler");
        return true;
      }
    } catch (e) {
      logger$3.warn("custom handler error:", e);
    }
  }
  return false;
}
function navigateByStateMachine(router2, currentRoute = {}) {
  const isHomeRoute = currentRoute.name === "home" || currentRoute.path === "/";
  const isSkinSandboxRuntime2 = typeof window !== "undefined" && window.parent !== window && `${currentRoute?.query?.skinSandbox || ""}` === "1";
  if (isSkinSandboxRuntime2 && isHomeRoute) {
    if (postSkinSandboxExit()) {
      logger$3.log("exit skin sandbox from home route");
      return true;
    }
  }
  if (isHomeRoute) {
    logger$3.log("home route, pass to native/default back");
    return false;
  }
  const previousPath = getNavPreviousPath();
  if (canNavigateBack() && previousPath) {
    void router2.replace(previousPath);
  } else if (canNavigateBack()) {
    router2.back();
  } else {
    void router2.replace("/");
  }
  logger$3.log("router back", currentRoute.fullPath || currentRoute.path);
  return true;
}
function performAppBack(context = {}) {
  try {
    const playerStore = context.playerStore || installedBackContext.playerStore;
    const selectionStore = context.selectionStore || installedBackContext.selectionStore;
    const router2 = context.router || installedBackContext.router;
    if (!playerStore || !selectionStore || !router2) {
      logger$3.warn("missing dependencies, fallback to default back behavior");
      return false;
    }
    if (dispatchCustomBackHandlers((entry) => entry.priority >= HIGH_PRIORITY_HANDLER)) return true;
    if (isMusicControlVisible()) {
      closeMusicControl();
      logger$3.log("close music control overlay");
      return true;
    }
    if (dispatchCustomBackHandlers((entry) => entry.priority < HIGH_PRIORITY_HANDLER)) return true;
    if (playerStore.showDrawer) {
      if (selectionStore.isModeActive) {
        selectionStore.exitMode();
        logger$3.log("exit selection mode in drawer");
        return true;
      }
      playerStore.showDrawer = false;
      logger$3.log("close drawer");
      return true;
    }
    if (selectionStore.isModeActive) {
      selectionStore.exitMode();
      logger$3.log("exit selection mode");
      return true;
    }
    return navigateByStateMachine(router2, router2.currentRoute?.value || {});
  } catch (e) {
    logger$3.warn("unexpected error, fallback to default back behavior:", e);
    return false;
  }
}
function installGlobalBackHandler({ playerStore = null, selectionStore = null, router: router2 = null } = {}) {
  installedBackContext = { playerStore, selectionStore, router: router2 };
  window.handleAndroidBack = () => performAppBack(installedBackContext);
}
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _hoisted_1$d = ["viewBox", "width", "height", "innerHTML"];
const _hoisted_2$b = ["src", "alt", "width", "height"];
const _hoisted_3$9 = {
  key: 2,
  class: "svg-icon-placeholder"
};
const DEFAULT_VIEWBOX = "0 0 1254 1254";
const _sfc_main$f = /* @__PURE__ */ Object.assign({
  name: "SvgIcon",
  inheritAttrs: false
}, {
  __name: "SvgIcon",
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: [String, Number],
      default: 24
    },
    color: {
      type: String,
      default: "currentColor"
    }
  },
  setup(__props) {
    const SVG_MAP = {
      play: "play.svg",
      pause: "pause.svg",
      prev: "prev.svg",
      next: "next.svg",
      playlist: "playlist.svg",
      back: "back.svg",
      backArrow: "back_arrow.svg",
      characterAvatar: "character_avatar.svg",
      loopList: "looplist.svg",
      loopSingle: "loopsingle.svg",
      musicBadge: "music_badge.svg",
      musicMagnifier: "music_magnifier.svg",
      musicPendant: "music_pendant.svg",
      shuffle: "shuffle.svg"
    };
    const SVG_CACHE = /* @__PURE__ */ new Map();
    const props = __props;
    const svgContent = ref("");
    const resolvedViewBox = ref(DEFAULT_VIEWBOX);
    const isLoading = ref(false);
    const normalizedSize = computed(
      () => typeof props.size === "number" ? `${props.size}px` : String(props.size)
    );
    const wrapperStyle = computed(() => {
      const baseStyle = {
        color: props.color,
        flex: "0 0 auto",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: normalizedSize.value,
        height: normalizedSize.value
      };
      return baseStyle;
    });
    const filename = computed(() => SVG_MAP[props.name]);
    const assetRelativePath = computed(() => `svg/${filename.value}`);
    const isAndroidWebView = computed(() => typeof window !== "undefined" && !!window.Android);
    const publicBase = "./".replace(/\/?$/, "/");
    const browserSvgPath = computed(
      () => `${publicBase}svg/${filename.value}`
    );
    const svgPath = computed(
      () => isAndroidWebView.value ? `tymusic://app/WebApp/svg/${filename.value}` : browserSvgPath.value
    );
    const fallbackSvgPath = computed(
      () => isAndroidWebView.value ? browserSvgPath.value : null
    );
    const imgSrc = computed(() => svgPath.value);
    const ensureIconName = () => {
      if (!(props.name in SVG_MAP)) {
        throw new Error(`Unsupported SvgIcon name: ${props.name}`);
      }
    };
    const sanitizeSvg = (rawContent) => {
      const svgOpenTagMatch = rawContent.match(/<svg\b[^>]*>/i);
      const svgOpenTag = svgOpenTagMatch?.[0] || "";
      const viewBoxMatch = svgOpenTag.match(/\bviewBox=(['"])([^'"]+)\1/i);
      const widthMatch = svgOpenTag.match(/\bwidth=(['"])([^'"]+)\1/i);
      const heightMatch = svgOpenTag.match(/\bheight=(['"])([^'"]+)\1/i);
      const extractNumber = (value) => value?.match(/[\d.]+/)?.[0] || null;
      const width = extractNumber(widthMatch?.[2]);
      const height = extractNumber(heightMatch?.[2]);
      const viewBox = viewBoxMatch?.[2] || (width && height ? `0 0 ${width} ${height}` : DEFAULT_VIEWBOX);
      let innerContent = rawContent.replace(/^[\s\S]*?<svg\b[^>]*>/i, "").replace(/<\/svg>\s*$/i, "");
      return {
        svgContent: innerContent,
        viewBox
      };
    };
    const fetchSvgAsset = async (path) => {
      if (!SVG_CACHE.has(path)) {
        SVG_CACHE.set(
          path,
          (async () => {
            const response = await fetch(path);
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }
            const rawContent = await response.text();
            return sanitizeSvg(rawContent);
          })().catch((error) => {
            SVG_CACHE.delete(path);
            throw error;
          })
        );
      }
      return SVG_CACHE.get(path);
    };
    let loadVersion = 0;
    const tryLoadFromAndroidBridge = () => {
      const reader = window.Android?.readAssetText;
      if (!isAndroidWebView.value || typeof reader !== "function") {
        console.log(`[SvgIcon ${props.name}] Android Bridge 不可用`);
        return null;
      }
      try {
        const rawContent = reader(assetRelativePath.value);
        if (!rawContent) {
          console.warn(`[SvgIcon ${props.name}] Android Bridge 返回空内容: ${assetRelativePath.value}`);
          return null;
        }
        console.log(`[SvgIcon ${props.name}] ✓ Android Bridge 成功读取: ${assetRelativePath.value} (${rawContent.length} bytes)`);
        return sanitizeSvg(rawContent);
      } catch (error) {
        console.error(`[SvgIcon ${props.name}] Android Bridge 调用失败:`, error);
        return null;
      }
    };
    const loadSvg = async () => {
      ensureIconName();
      isLoading.value = true;
      const currentVersion = ++loadVersion;
      const androidBridgeResult = tryLoadFromAndroidBridge();
      if (androidBridgeResult) {
        svgContent.value = androidBridgeResult.svgContent;
        resolvedViewBox.value = androidBridgeResult.viewBox;
        isLoading.value = false;
        console.log(`✓ Loaded SVG from Android Bridge: ${props.name}`);
        return;
      }
      const candidates = [svgPath.value, fallbackSvgPath.value].filter(
        (value, index, values) => value && values.indexOf(value) === index
      );
      let lastError = null;
      for (const candidate of candidates) {
        try {
          const result = await fetchSvgAsset(candidate);
          if (currentVersion !== loadVersion) {
            return;
          }
          svgContent.value = result.svgContent;
          resolvedViewBox.value = result.viewBox;
          isLoading.value = false;
          console.log(`✓ Loaded SVG from: ${candidate}`);
          return;
        } catch (error) {
          lastError = error;
          console.warn(`✗ Failed to load from ${candidate}:`, error.message);
        }
      }
      if (currentVersion !== loadVersion) {
        return;
      }
      svgContent.value = "";
      resolvedViewBox.value = DEFAULT_VIEWBOX;
      isLoading.value = false;
      if (lastError) {
        console.error(`✗ Failed to load SVG (${props.name}). Tried:`, candidates, lastError);
      }
    };
    watch([svgPath, fallbackSvgPath], () => {
      void loadSvg();
    }, { immediate: true });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("span", mergeProps({
        class: ["svg-icon-wrapper", `svg-icon-${__props.name}`, { "svg-icon-error": !svgContent.value && !isLoading.value }],
        style: wrapperStyle.value
      }, _ctx.$attrs), [
        svgContent.value ? (openBlock(), createElementBlock("svg", {
          key: 0,
          class: "svg-icon",
          viewBox: resolvedViewBox.value,
          width: normalizedSize.value,
          height: normalizedSize.value,
          preserveAspectRatio: "xMidYMid meet",
          "aria-hidden": "true",
          focusable: "false",
          innerHTML: svgContent.value
        }, null, 8, _hoisted_1$d)) : !isLoading.value ? (openBlock(), createElementBlock("img", {
          key: 1,
          src: imgSrc.value,
          alt: __props.name,
          class: "svg-icon",
          width: normalizedSize.value,
          height: normalizedSize.value
        }, null, 8, _hoisted_2$b)) : (openBlock(), createElementBlock("span", _hoisted_3$9, "⊕"))
      ], 16);
    };
  }
});
const SvgIcon = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["__scopeId", "data-v-538b1dba"]]);
const _hoisted_1$c = {
  key: 0,
  class: "top-nav-bar transparent-mode"
};
const _hoisted_2$a = {
  key: 1,
  class: "top-nav-bar"
};
const _sfc_main$e = {
  __name: "TopNavBar",
  setup(__props) {
    const router2 = useRouter();
    const route = useRoute();
    const playerStore = usePlayerStore$1();
    const selectionStore = useSelectionStore();
    const transparentPages = /* @__PURE__ */ new Set(["MusicControlPage", "account", "profile", "skin-studio", "listen-stats"]);
    const isTransparentMode = computed(() => transparentPages.has(route.name));
    const handleBack = () => {
      performAppBack({ playerStore, selectionStore, router: router2 });
    };
    const handleSearch = () => {
      router2.push("/search");
    };
    const handleAccount = () => {
      router2.push("/account");
    };
    return (_ctx, _cache) => {
      return isTransparentMode.value ? (openBlock(), createElementBlock("div", _hoisted_1$c, [
        createBaseVNode("button", {
          class: "nav-btn transparent-btn",
          type: "button",
          title: "返回",
          "aria-label": "返回",
          onClick: handleBack
        }, [
          createVNode(SvgIcon, {
            class: "nav-btn-icon nav-btn-icon--transparent",
            name: "backArrow",
            size: "22"
          })
        ])
      ])) : (openBlock(), createElementBlock("div", _hoisted_2$a, [
        createBaseVNode("button", {
          class: "nav-btn back-btn",
          type: "button",
          title: "返回",
          "aria-label": "返回",
          onClick: handleBack
        }, [
          createVNode(SvgIcon, {
            class: "nav-btn-icon",
            name: "backArrow",
            size: "22"
          })
        ]),
        _cache[0] || (_cache[0] = createBaseVNode("div", { class: "spacer" }, null, -1)),
        createBaseVNode("button", {
          class: "nav-btn search-btn",
          type: "button",
          title: "搜索",
          "aria-label": "搜索",
          onClick: handleSearch
        }, [
          createVNode(SvgIcon, {
            class: "nav-btn-icon",
            name: "musicMagnifier",
            size: "22"
          })
        ]),
        createBaseVNode("button", {
          class: "nav-btn account-btn",
          type: "button",
          title: "账户",
          "aria-label": "账户",
          onClick: handleAccount
        }, [
          createVNode(SvgIcon, {
            class: "nav-btn-icon",
            name: "characterAvatar",
            size: "22"
          })
        ])
      ]));
    };
  }
};
const TopNavBar = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["__scopeId", "data-v-e9f6d67e"]]);
const baseUrl = "./".replace(/\/?$/, "/");
function getBundledAssetUrl(relativePath = "") {
  const clean = `${relativePath || ""}`.replace(/^\/+/, "");
  if (!clean) return baseUrl;
  if (typeof window !== "undefined" && window.Android) {
    return `tymusic://app/WebApp/${clean}`;
  }
  return `${baseUrl}${clean}`;
}
const CACHE_LIMIT$1 = 160;
const CACHE_MAX_AGE_MS = 10 * 60 * 1e3;
const imageCache = /* @__PURE__ */ new Map();
function cleanupEntry(entry) {
  if (!entry) return;
  entry.disposed = true;
  entry.cancelSchedule?.();
  entry.finish?.(false);
  if (!entry.img) return;
  entry.img.onload = null;
  entry.img.onerror = null;
  entry.img.src = "";
  entry.img = null;
}
function evictStale(now2 = Date.now()) {
  for (const [key, entry] of imageCache) {
    if (now2 - entry.lastUsedAt > CACHE_MAX_AGE_MS) {
      cleanupEntry(entry);
      imageCache.delete(key);
    }
  }
}
function touch(url, entry) {
  entry.lastUsedAt = Date.now();
  imageCache.delete(url);
  imageCache.set(url, entry);
  evictStale(entry.lastUsedAt);
  while (imageCache.size > CACHE_LIMIT$1) {
    const firstKey = imageCache.keys().next().value;
    const firstEntry = imageCache.get(firstKey);
    cleanupEntry(firstEntry);
    imageCache.delete(firstKey);
  }
}
function schedule$1(callback) {
  if (typeof window === "undefined") {
    callback();
    return () => {
    };
  }
  if (window.requestIdleCallback) {
    const id2 = window.requestIdleCallback(callback, { timeout: 300 });
    return () => window.cancelIdleCallback(id2);
  }
  const id = window.setTimeout(callback, 1);
  return () => window.clearTimeout(id);
}
function prefetchImage(url) {
  if (!url) return Promise.resolve({ ok: false, src: "" });
  const cached = imageCache.get(url);
  if (cached) {
    touch(url, cached);
    return cached.promise;
  }
  const entry = {
    img: null,
    lastUsedAt: Date.now(),
    promise: null,
    disposed: false,
    cancelSchedule: null,
    finish: null
  };
  entry.promise = new Promise((resolve) => {
    let settled = false;
    let timer = null;
    entry.finish = (ok) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (entry.img) {
        entry.img.onload = null;
        entry.img.onerror = null;
      }
      const success = ok && !entry.disposed;
      if (!success && imageCache.get(url) === entry) imageCache.delete(url);
      resolve({ ok: success, src: url });
    };
    entry.cancelSchedule = schedule$1(() => {
      if (entry.disposed) return;
      const img = new Image();
      entry.img = img;
      timer = setTimeout(() => {
        entry.finish(false);
        img.src = "";
      }, 15e3);
      img.onload = () => {
        Promise.resolve().then(() => img.decode?.()).catch(() => {
        }).then(() => entry.finish(img.naturalWidth > 0));
      };
      img.onerror = () => entry.finish(false);
      img.decoding = "async";
      img.loading = "eager";
      img.src = url;
    });
  });
  touch(url, entry);
  return entry.promise;
}
function releaseImageCache({ aggressive = false } = {}) {
  if (aggressive) {
    clearImageCache();
    return;
  }
  evictStale();
}
function clearImageCache() {
  for (const entry of imageCache.values()) {
    cleanupEntry(entry);
  }
  imageCache.clear();
}
function getImageCacheSize() {
  return imageCache.size;
}
function useReadyCover(source, fallback) {
  const displayedSrc = ref(fallback);
  let generation = 0;
  let fallbackTimer = null;
  const stop = watch(source, async (src) => {
    const token = ++generation;
    clearTimeout(fallbackTimer);
    if (!src || src === fallback) {
      displayedSrc.value = fallback;
      return;
    }
    if (src === displayedSrc.value) return;
    fallbackTimer = setTimeout(() => {
      if (token === generation) displayedSrc.value = fallback;
    }, 1200);
    const result = await prefetchImage(src);
    if (token !== generation) return;
    clearTimeout(fallbackTimer);
    displayedSrc.value = result.ok ? src : fallback;
  }, { immediate: true });
  onScopeDispose(() => {
    ++generation;
    clearTimeout(fallbackTimer);
    stop();
  });
  return displayedSrc;
}
const _hoisted_1$b = { class: "mini-player-content" };
const _hoisted_2$9 = { class: "mini-cover" };
const _hoisted_3$8 = ["src"];
const _hoisted_4$7 = { class: "mini-info" };
const _hoisted_5$5 = { class: "mini-title" };
const _hoisted_6$5 = { class: "mini-artist" };
const _hoisted_7$4 = { class: "mini-controls" };
const _hoisted_8$4 = ["disabled"];
const _hoisted_9$3 = {
  viewBox: "0 0 24 24",
  width: "26",
  height: "26",
  fill: "currentColor"
};
const _hoisted_10$3 = {
  key: 0,
  d: "M8 5v14l11-7z"
};
const _hoisted_11$3 = {
  key: 1,
  d: "M6 19h4V5H6v14zm8-14v14h4V5h-4z"
};
const _hoisted_12$3 = ["disabled"];
const minSwipeDistance = 50;
const _sfc_main$d = {
  __name: "MiniPlayer",
  setup(__props) {
    const playerStore = usePlayerStore$1();
    const emptyCoverSrc = getBundledAssetUrl("svg/music_badge.svg");
    const touchStartX = ref(0);
    const touchEndX = ref(0);
    const isSwiping = ref(false);
    const progressBar = ref(null);
    const isDragging = ref(false);
    const localProgress = ref(0);
    const track = computed(() => playerStore.currentTrack);
    const miniCoverSrc = computed(() => {
      const current = track.value;
      if (!current) return emptyCoverSrc;
      return getSongCoverSrc(current) || `/api/cover/random?seed=${current?.id || "mini"}`;
    });
    const readyMiniCoverSrc = useReadyCover(miniCoverSrc, emptyCoverSrc);
    const isPlaying = computed(() => playerStore.isPlaying);
    const progress = computed(() => localProgress.value);
    const handleTouchStart = (e) => {
      if (isDragging.value) return;
      touchStartX.value = e.touches[0].clientX;
      isSwiping.value = false;
    };
    const handleTouchMove = (e) => {
      if (isDragging.value) return;
      touchEndX.value = e.touches[0].clientX;
      if (Math.abs(touchEndX.value - touchStartX.value) > 10) {
        isSwiping.value = true;
      }
    };
    const handleTouchEnd = () => {
      if (isDragging.value) return;
      if (!isSwiping.value) return;
      const swipeDistance = touchEndX.value - touchStartX.value;
      if (Math.abs(swipeDistance) > minSwipeDistance) {
        if (swipeDistance > 0) {
          console.log("👉 向右滑动：上一首");
          playerStore.prev({
            triggerSource: "manual_user",
            switchReason: "mini_player_swipe_prev"
          });
        } else {
          console.log("👈 向左滑动：下一首");
          playerStore.next({
            triggerSource: "manual_user",
            switchReason: "mini_player_swipe_next"
          });
        }
      }
      touchStartX.value = 0;
      touchEndX.value = 0;
    };
    const handleContainerClick = (e) => {
      console.log("MiniPlayer clicked");
      if (isSwiping.value) {
        console.log("Swipe detected, ignoring click");
        isSwiping.value = false;
        return;
      }
      console.log("Opening MusicControl overlay");
      openMusicControl();
    };
    const handleSeek = (e) => {
      if (isDragging.value && e.type === "click") return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = Math.max(0, Math.min(1, x / rect.width));
      playerStore.seek(percent, {
        triggerSource: "manual_user",
        source: "mini_player_seek_click"
      });
    };
    const startDragging = () => {
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
          source: "mini_player_seek_drag"
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
    watch(() => playerStore.currentTrack, (newTrack) => {
      if (newTrack) {
        console.log("🎵 MiniPlayer 数据更新:", newTrack.title);
      }
    }, { immediate: true });
    watch(() => playerStore.progress, (newVal) => {
      if (!isDragging.value) {
        localProgress.value = newVal;
      }
    }, { immediate: true });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "mini-player",
        id: "miniPlayerContainer",
        onClick: handleContainerClick,
        onTouchstart: handleTouchStart,
        onTouchmove: handleTouchMove,
        onTouchend: handleTouchEnd
      }, [
        createBaseVNode("div", {
          class: normalizeClass(["mini-progress-bar", { "is-active": isPlaying.value, "is-dragging": isDragging.value }]),
          onClick: withModifiers(handleSeek, ["stop"]),
          onMousedown: startDragging,
          onTouchstart: withModifiers(startDragging, ["stop"]),
          ref_key: "progressBar",
          ref: progressBar
        }, [
          createBaseVNode("div", {
            class: "mini-progress-inner",
            style: normalizeStyle({ width: progress.value + "%" })
          }, null, 4),
          createBaseVNode("div", {
            class: "mini-progress-thumb",
            style: normalizeStyle({ left: progress.value + "%" })
          }, null, 4)
        ], 34),
        createBaseVNode("div", _hoisted_1$b, [
          createBaseVNode("div", _hoisted_2$9, [
            createBaseVNode("img", {
              class: normalizeClass({ "rotate-record": isPlaying.value }),
              src: unref(readyMiniCoverSrc),
              alt: "封面",
              referrerpolicy: "no-referrer",
              onError: _cache[0] || (_cache[0] = (e) => e.target.src = unref(emptyCoverSrc))
            }, null, 42, _hoisted_3$8)
          ]),
          createBaseVNode("div", _hoisted_4$7, [
            createBaseVNode("div", _hoisted_5$5, toDisplayString(track.value ? unref(formatTitle)(track.value) : "未在播放"), 1),
            createBaseVNode("div", _hoisted_6$5, toDisplayString(track.value ? unref(formatArtistProducer)(track.value) : "等待选择歌曲"), 1)
          ]),
          createBaseVNode("div", _hoisted_7$4, [
            createBaseVNode("button", {
              class: "mini-btn",
              onClick: _cache[1] || (_cache[1] = withModifiers(($event) => unref(playerStore).togglePlay("manual_user"), ["stop"])),
              disabled: isDragging.value
            }, [
              (openBlock(), createElementBlock("svg", _hoisted_9$3, [
                !isPlaying.value ? (openBlock(), createElementBlock("path", _hoisted_10$3)) : (openBlock(), createElementBlock("path", _hoisted_11$3))
              ]))
            ], 8, _hoisted_8$4),
            createBaseVNode("button", {
              class: normalizeClass(["mini-btn", { "btn-active": unref(playerStore).showDrawer }]),
              onClick: _cache[2] || (_cache[2] = withModifiers(($event) => unref(playerStore).showDrawer = !unref(playerStore).showDrawer, ["stop"])),
              disabled: isDragging.value
            }, [
              (openBlock(), createElementBlock("svg", {
                viewBox: "0 0 24 24",
                width: "26",
                height: "26",
                style: normalizeStyle({ color: unref(playerStore).showDrawer ? "var(--ty-mini-progress, var(--ty-song-progress, #66ccff))" : "inherit" }),
                fill: "currentColor"
              }, [..._cache[3] || (_cache[3] = [
                createBaseVNode("path", { d: "M4 10h12v2H4v-2zm0-4h12v2H4V6zm0 8h8v2H4v-2zm10 0v6l5-3-5-3z" }, null, -1)
              ])], 4))
            ], 10, _hoisted_12$3)
          ])
        ])
      ], 32);
    };
  }
};
const MiniPlayer = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["__scopeId", "data-v-d1930c0c"]]);
function createFrameScheduler(callback) {
  let frameId = null;
  let latestArgs = [];
  function run() {
    frameId = null;
    const args = latestArgs;
    latestArgs = [];
    callback(...args);
  }
  function cancel() {
    if (frameId !== null) cancelAnimationFrame(frameId);
    frameId = null;
    latestArgs = [];
  }
  return {
    schedule(...args) {
      latestArgs = args;
      if (frameId === null) frameId = requestAnimationFrame(run);
    },
    flush() {
      if (frameId === null) return;
      cancelAnimationFrame(frameId);
      run();
    },
    cancel
  };
}
const DEFAULT_MAX_ACTIVE = 2;
const CACHE_LIMIT = 180;
const readyCache = /* @__PURE__ */ new Map();
const pendingQueue = [];
const subscribers = /* @__PURE__ */ new Set();
let activeCount = 0;
let drainScheduled = false;
function touchCache(src) {
  readyCache.delete(src);
  readyCache.set(src, true);
  while (readyCache.size > CACHE_LIMIT) {
    const firstKey = readyCache.keys().next().value;
    readyCache.delete(firstKey);
  }
}
function notify() {
  const stats = getThumbnailQueueStats();
  subscribers.forEach((subscriber) => subscriber(stats));
}
function scheduleIdle(callback) {
  if (typeof window === "undefined") {
    callback();
    return;
  }
  const requestIdle = window.requestIdleCallback || ((cb) => window.setTimeout(cb, 16));
  requestIdle(callback, { timeout: 240 });
}
function scheduleDrain() {
  if (drainScheduled) return;
  drainScheduled = true;
  if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
    window.requestAnimationFrame(drain);
  } else {
    setTimeout(drain, 0);
  }
}
function loadImage(src, task) {
  return new Promise((resolve) => {
    scheduleIdle(() => {
      if (task.cancelled) {
        resolve({ ok: false, cancelled: true, src });
        return;
      }
      const img = new Image();
      let settled = false;
      const finish = (ok) => {
        if (settled) return;
        settled = true;
        task.cancelLoad = null;
        img.onload = null;
        img.onerror = null;
        if (!ok || task.cancelled) {
          img.src = "";
          resolve({ ok: false, cancelled: task.cancelled, src });
          return;
        }
        const decoded = typeof img.decode === "function" ? img.decode().catch(() => {
        }) : Promise.resolve();
        decoded.finally(() => {
          touchCache(src);
          resolve({ ok: true, src });
        });
      };
      img.onload = () => finish(true);
      img.onerror = () => finish(false);
      task.cancelLoad = () => finish(false);
      img.decoding = "async";
      img.loading = "eager";
      img.src = src;
    });
  });
}
function drain() {
  drainScheduled = false;
  while (activeCount < DEFAULT_MAX_ACTIVE && pendingQueue.length > 0) {
    const task = pendingQueue.shift();
    if (!task || task.cancelled) continue;
    activeCount += 1;
    notify();
    const cached = readyCache.has(task.src);
    if (cached) touchCache(task.src);
    (cached ? Promise.resolve({ ok: true, src: task.src, cached: true }) : loadImage(task.src, task)).then((result) => {
      if (!task.cancelled) task.onDone(result);
    }).finally(() => {
      activeCount = Math.max(0, activeCount - 1);
      notify();
      if (pendingQueue.length > 0) scheduleDrain();
    });
  }
}
function queueThumbnailLoad(src, onDone) {
  const normalizedSrc = `${src || ""}`.trim();
  if (!normalizedSrc) {
    onDone?.({ ok: false, src: "" });
    return () => {
    };
  }
  const task = {
    src: normalizedSrc,
    cancelled: false,
    onDone: onDone || (() => {
    })
  };
  pendingQueue.push(task);
  notify();
  scheduleDrain();
  return () => {
    if (task.cancelled) return;
    task.cancelled = true;
    task.cancelLoad?.();
    const pendingIndex = pendingQueue.indexOf(task);
    if (pendingIndex >= 0) pendingQueue.splice(pendingIndex, 1);
    notify();
  };
}
function getThumbnailQueueStats() {
  return {
    active: activeCount,
    pending: pendingQueue.filter((task) => !task.cancelled).length,
    cached: readyCache.size
  };
}
function clearThumbnailCache() {
  readyCache.clear();
}
function subscribeThumbnailQueue(subscriber) {
  if (typeof subscriber !== "function") return () => {
  };
  subscribers.add(subscriber);
  subscriber(getThumbnailQueueStats());
  return () => subscribers.delete(subscriber);
}
const _hoisted_1$a = ["src", "alt"];
const defaultPlaceholder = "var(--ty-cover-placeholder, linear-gradient(135deg, #e8f8ff, #c8eefc))";
const _sfc_main$c = {
  __name: "DeferredThumbnail",
  props: {
    src: {
      type: String,
      default: ""
    },
    alt: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    },
    eager: {
      type: Boolean,
      default: false
    },
    enabled: { type: Boolean, default: true },
    imageStyle: { type: Object, default: void 0 },
    fallbackSrc: { type: String, default: "" },
    rootMargin: {
      type: String,
      default: "220px"
    }
  },
  emits: ["load-start", "load-end", "error"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const rootRef = ref(null);
    const resolvedSrc = ref("");
    const isLoading = ref(false);
    const isLoaded = ref(false);
    const isFailed = ref(false);
    let mounted = false;
    let viewActive = true;
    let observer = null;
    let stopCurrentLoad = null;
    let loadToken = 0;
    const nextFrame = typeof requestAnimationFrame === "function" ? requestAnimationFrame : (callback) => setTimeout(callback, 16);
    function cleanupObserver() {
      if (!observer) return;
      observer.disconnect();
      observer = null;
    }
    function cancelCurrentLoad() {
      if (stopCurrentLoad) {
        stopCurrentLoad();
        stopCurrentLoad = null;
      }
    }
    function resetState() {
      loadToken += 1;
      cancelCurrentLoad();
      cleanupObserver();
      resolvedSrc.value = "";
      isLoading.value = false;
      isLoaded.value = false;
      isFailed.value = false;
    }
    function beginLoad(source = props.src, fallback = false) {
      const src = `${source || ""}`.trim();
      if (!viewActive || !props.enabled || !src || isLoading.value || isLoaded.value || isFailed.value) return;
      const token = loadToken;
      isLoading.value = true;
      emit("load-start", src);
      stopCurrentLoad = queueThumbnailLoad(src, (result) => {
        if (token !== loadToken) return;
        stopCurrentLoad = null;
        isLoading.value = false;
        if (!result?.ok) {
          if (!fallback && props.fallbackSrc && props.fallbackSrc !== src) {
            beginLoad(props.fallbackSrc, true);
            return;
          }
          isFailed.value = true;
          emit("error", result);
          emit("load-end", result);
          return;
        }
        resolvedSrc.value = result.src;
        nextFrame(() => {
          if (token !== loadToken) return;
          isLoaded.value = true;
          emit("load-end", result);
        });
      });
    }
    function armObserver() {
      if (!mounted || !viewActive || !props.enabled) return;
      if (props.eager || typeof IntersectionObserver === "undefined") {
        beginLoad();
        return;
      }
      nextTick(() => {
        const node = rootRef.value;
        if (!node || observer || isLoaded.value) return;
        observer = new IntersectionObserver((entries2) => {
          if (!entries2.some((entry) => entry.isIntersecting || entry.intersectionRatio > 0)) return;
          cleanupObserver();
          beginLoad();
        }, {
          root: null,
          rootMargin: props.rootMargin,
          threshold: 0.01
        });
        observer.observe(node);
      });
    }
    function handleRenderedError() {
      isLoaded.value = false;
      isFailed.value = true;
      emit("error", { ok: false, src: props.src, rendered: true });
      emit("load-end", { ok: false, src: props.src, rendered: true });
    }
    watch(
      () => props.src,
      () => {
        resetState();
        armObserver();
      }
    );
    onMounted(() => {
      mounted = true;
      armObserver();
    });
    onUnmounted(() => {
      mounted = false;
      resetState();
    });
    function pauseLoading() {
      loadToken += 1;
      cancelCurrentLoad();
      cleanupObserver();
      isLoading.value = false;
    }
    watch(() => props.enabled, (enabled) => enabled ? armObserver() : pauseLoading());
    onActivated(() => {
      viewActive = true;
      armObserver();
    });
    onDeactivated(() => {
      viewActive = false;
      pauseLoading();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("span", {
        ref_key: "rootRef",
        ref: rootRef,
        class: normalizeClass(["deferred-thumbnail", {
          "is-loading": isLoading.value,
          "is-loaded": isLoaded.value,
          "is-failed": isFailed.value
        }]),
        style: normalizeStyle({ "--thumbnail-placeholder": __props.placeholder || defaultPlaceholder })
      }, [
        _cache[0] || (_cache[0] = createBaseVNode("span", {
          class: "deferred-thumbnail-placeholder",
          "aria-hidden": "true"
        }, null, -1)),
        resolvedSrc.value ? (openBlock(), createElementBlock("img", {
          key: 0,
          src: resolvedSrc.value,
          style: normalizeStyle(__props.imageStyle),
          alt: __props.alt,
          decoding: "async",
          loading: "eager",
          draggable: "false",
          onError: handleRenderedError
        }, null, 44, _hoisted_1$a)) : createCommentVNode("", true)
      ], 6);
    };
  }
};
const DeferredThumbnail = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-478e7271"]]);
function logGesture(...args) {
}
function useSelection() {
  const selectionStore = useSelectionStore();
  let longPressTimer = null;
  let startPos = { x: 0, y: 0 };
  let swipeCallback = null;
  let isLongPressTriggered = false;
  const handleTouchStart = (e, type, id, onSwipeLeft) => {
    const touch2 = e.touches[0];
    startPos = { x: touch2.clientX, y: touch2.clientY };
    swipeCallback = onSwipeLeft;
    isLongPressTriggered = false;
    logGesture(`[Gesture] 触摸开始 | 类型: ${type} | ID: ${id} | 坐标: (${Math.round(startPos.x)}, ${Math.round(startPos.y)})`);
    if (selectionStore.isModeActive) return;
    longPressTimer = setTimeout(() => {
      isLongPressTriggered = true;
      longPressTimer = null;
      selectionStore.enterMode(type, id);
      if (window.navigator.vibrate) window.navigator.vibrate(40);
    }, 500);
  };
  const handleTouchMove = (e) => {
    if (!longPressTimer) return;
    const touch2 = e.touches[0];
    const deltaX = startPos.x - touch2.clientX;
    const deltaY = Math.abs(startPos.y - touch2.clientY);
    if (deltaX > 50 && deltaX > deltaY * 2) {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
      if (swipeCallback) swipeCallback();
      return;
    }
    if (deltaY > 12) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
      return;
    }
    const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (dist > 25) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  };
  const handleTouchEnd = (e) => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    } else if (isLongPressTriggered) {
      if (e && e.cancelable) {
        e.preventDefault();
      }
    }
    isLongPressTriggered = false;
  };
  return { handleTouchStart, handleTouchMove, handleTouchEnd };
}
const SWIPE_REVEAL = Object.freeze({
  intentThreshold: 16,
  horizontalIntentRatio: 1.2,
  triggerThreshold: 120,
  iconRevealThreshold: 30,
  maxSwipe: 160,
  commitExtra: 14,
  commitDurationMs: 130,
  settleDurationMs: 240,
  deleteAccentRgb: "255, 69, 58",
  insertAccentRgb: "52, 199, 89"
});
function resolveSwipeRevealOffset(deltaX, direction = "left", config = SWIPE_REVEAL) {
  const isLeft = direction === "left";
  const raw = isLeft ? Math.min(deltaX, 0) : Math.max(deltaX, 0);
  if (raw === 0) return 0;
  const absDeltaX = Math.abs(raw);
  if (absDeltaX <= config.triggerThreshold) {
    return raw;
  }
  const extraDistance = absDeltaX - config.triggerThreshold;
  const resistedDistance = config.triggerThreshold + extraDistance * 0.38;
  const capped = Math.min(config.maxSwipe, resistedDistance);
  return isLeft ? -capped : capped;
}
function getSwipeRevealAbsOffset(offset, direction = "left") {
  return direction === "left" ? Math.abs(Math.min(offset, 0)) : Math.max(offset, 0);
}
function isSwipeRevealReady(offset, direction = "left", config = SWIPE_REVEAL) {
  return getSwipeRevealAbsOffset(offset, direction) >= config.triggerThreshold;
}
function isSwipeRevealIconVisible(offset, direction = "left", config = SWIPE_REVEAL) {
  return getSwipeRevealAbsOffset(offset, direction) > config.iconRevealThreshold;
}
function shouldSwipeRevealShake(offset, direction = "left", config = SWIPE_REVEAL) {
  return isSwipeRevealReady(offset, direction, config);
}
function getSwipeRevealBackgroundStyle({
  offset,
  direction = "left",
  accentRgb = SWIPE_REVEAL.insertAccentRgb,
  threshold = SWIPE_REVEAL.triggerThreshold
} = {}) {
  const absOffset = getSwipeRevealAbsOffset(offset, direction);
  return {
    background: `linear-gradient(135deg, rgba(${accentRgb}, .88), rgba(${accentRgb}, .72))`,
    width: `${SWIPE_REVEAL.maxSwipe}px`,
    transform: `translate3d(${(direction === "left" ? 1 : -1) * Math.max(0, SWIPE_REVEAL.maxSwipe - absOffset)}px, 0, 0)`,
    opacity: absOffset > 0 ? 1 : 0
  };
}
function getSwipeRevealContentStyle({
  offset,
  phase = "idle",
  isDragging = false,
  config = SWIPE_REVEAL
} = {}) {
  if (!offset && phase === "idle") return {};
  let transition = "none";
  if (!isDragging) {
    if (phase === "commit") {
      transition = `transform ${config.commitDurationMs}ms cubic-bezier(0.22, 0.9, 0.32, 1)`;
    } else if (phase === "settle" || phase === "idle") {
      transition = `transform ${config.settleDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1)`;
    } else {
      transition = "transform 180ms cubic-bezier(0.2, 0, 0, 1)";
    }
  }
  return {
    transform: `translate3d(${offset}px, 0, 0)`,
    transition,
    willChange: isDragging ? "transform" : "auto"
  };
}
function getSwipeRevealCommitOffset(offset, direction = "left", config = SWIPE_REVEAL) {
  const absOffset = getSwipeRevealAbsOffset(offset, direction);
  const target = Math.max(config.triggerThreshold + config.commitExtra, absOffset + 10);
  const capped = Math.min(config.maxSwipe, target);
  return direction === "left" ? -capped : capped;
}
const SWIPE_INSERT_ANIMATION = Object.freeze({
  ...SWIPE_REVEAL,
  intentThreshold: SWIPE_REVEAL.intentThreshold,
  horizontalIntentRatio: SWIPE_REVEAL.horizontalIntentRatio,
  triggerThreshold: SWIPE_REVEAL.triggerThreshold,
  iconRevealThreshold: SWIPE_REVEAL.iconRevealThreshold,
  maxSwipe: SWIPE_REVEAL.maxSwipe,
  commitExtra: SWIPE_REVEAL.commitExtra,
  commitDurationMs: SWIPE_REVEAL.commitDurationMs,
  settleDurationMs: SWIPE_REVEAL.settleDurationMs
});
function hasVisualState(active, offset, phase) {
  return active && (phase !== "idle" || offset < 0);
}
function resolvePhaseTransition(phase, config) {
  if (phase === "commit") {
    return `transform ${config.commitDurationMs}ms cubic-bezier(0.22, 0.9, 0.32, 1)`;
  }
  if (phase === "settle") {
    return `transform ${config.settleDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1)`;
  }
  return "none";
}
function hasSwipeInsertIntent(deltaX, deltaY, config = SWIPE_INSERT_ANIMATION) {
  return deltaX < -config.intentThreshold && Math.abs(deltaX) > deltaY * config.horizontalIntentRatio;
}
function resolveSwipeInsertOffset(deltaX, config = SWIPE_INSERT_ANIMATION) {
  return resolveSwipeRevealOffset(deltaX, "left", config);
}
function isSwipeInsertReady(offset, config = SWIPE_INSERT_ANIMATION) {
  return isSwipeRevealReady(offset, "left", config);
}
function getSwipeInsertCommitOffset(offset, config = SWIPE_INSERT_ANIMATION) {
  return getSwipeRevealCommitOffset(offset, "left", config);
}
function getSwipeInsertContentStyle(state, config = SWIPE_INSERT_ANIMATION) {
  const { active, offset, phase } = state;
  if (!hasVisualState(active, offset, phase)) return {};
  if (phase === "dragging") {
    return {
      transform: `translate3d(${offset}px, 0, 0)`,
      transition: "none",
      willChange: "transform"
    };
  }
  return {
    transform: `translate3d(${offset}px, 0, 0)`,
    transition: resolvePhaseTransition(phase, config),
    willChange: "auto"
  };
}
function getSwipeInsertBackgroundStyle(state, config = SWIPE_INSERT_ANIMATION) {
  const { active, offset, phase } = state;
  if (!hasVisualState(active, offset, phase)) return {};
  return getSwipeRevealBackgroundStyle({
    offset,
    direction: "left",
    accentRgb: SWIPE_REVEAL.insertAccentRgb,
    threshold: config.triggerThreshold
  });
}
const _hoisted_1$9 = ["data-hash"];
const _hoisted_2$8 = { class: "mini-cover" };
const _hoisted_3$7 = { class: "song-info" };
const _hoisted_4$6 = { class: "title-wrapper" };
const _hoisted_5$4 = { class: "title static" };
const _hoisted_6$4 = { class: "artist-wrapper" };
const _hoisted_7$3 = { class: "artist static" };
const _hoisted_8$3 = {
  key: 3,
  class: "swipe-actions"
};
const HORIZONTAL_INTENT_RATIO = 1.2;
const DELETE_SWIPE_DIRECTION = "right";
const SELECTION_LONG_PRESS_MS = 700;
const SELECTION_LONG_PRESS_CANCEL_DISTANCE = 12;
const _sfc_main$b = {
  __name: "SongItem",
  props: {
    song: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      default: 0
    },
    showDragHandle: {
      type: Boolean,
      default: true
    },
    renderDetails: { type: Boolean, default: true },
    canLoadCover: {
      type: Boolean,
      default: true
    },
    enableSwipeDelete: {
      type: Boolean,
      default: false
    },
    onDelete: {
      type: Function,
      default: null
    },
    enableSwipeInsert: {
      type: Boolean,
      default: false
    },
    isNextInQueue: {
      type: Boolean,
      default: void 0
    },
    onInsertNext: {
      type: Function,
      default: null
    },
    onLongPressWhileSelecting: {
      type: Function,
      default: null
    }
  },
  setup(__props) {
    const props = __props;
    const getRandomCoverSrc = (song) => {
      const seed = song?.hash_id ?? song?.id ?? Math.random().toString(36).slice(2);
      return `/api/cover/random?seed=${encodeURIComponent(seed)}`;
    };
    const isPlaying = computed(() => {
      const songId = `${props.song?.hash_id ?? props.song?.id ?? ""}`.trim();
      const currentId = `${playerStore.currentHashId ?? playerStore.currentTrack?.hash_id ?? playerStore.currentTrack?.id ?? ""}`.trim();
      return !!songId && songId === currentId;
    });
    const selectionStore = useSelectionStore();
    const playerStore = usePlayerStore$1();
    const playlistStore = usePlaylistStore();
    const songIdentity = computed(() => props.song?.hash_id ?? props.song?.id ?? null);
    const isSelected = ref(false);
    watch(
      () => {
        const key = songIdentity.value;
        return key ? selectionStore.selectedIds.has(key) : false;
      },
      (newValue) => {
        if (isSelected.value !== newValue) {
          isSelected.value = newValue;
        }
      },
      { immediate: true }
    );
    const showSwipeButton = ref(false);
    const coverFailed = ref(false);
    const coverUseRandom = ref(false);
    const canDelete = computed(() => {
      return props.enableSwipeDelete && !isPlaying.value;
    });
    const canInsertNext = computed(() => {
      if (!props.enableSwipeInsert) return false;
      if (isPlaying.value) return false;
      if (props.isNextInQueue !== void 0) return !props.isNextInQueue;
      const currentId = `${playerStore.currentHashId ?? playerStore.currentTrack?.hash_id ?? playerStore.currentTrack?.id ?? ""}`.trim();
      const queue = playlistStore.queue || [];
      const currentIndex = queue.findIndex((s) => `${s.hash_id ?? s.id ?? ""}`.trim() === currentId);
      const nextIndex = currentIndex + 1;
      if (nextIndex >= 0 && nextIndex < queue.length) {
        const nextSong = queue[nextIndex];
        const songId = props.song.hash_id ?? props.song.id;
        const nextSongId = nextSong.hash_id ?? nextSong.id;
        if (songId === nextSongId) return false;
      }
      return true;
    });
    const swipeOffset = ref(0);
    const isSwipingToDelete = ref(false);
    const isSwipingToInsert = ref(false);
    const shouldShake = ref(false);
    const shouldShakeInsert = ref(false);
    const swipeStartPos = ref({ x: 0, y: 0 });
    const isSwipeGesture = ref(false);
    const suppressNextClick = ref(false);
    const swipePhase = ref("idle");
    let selectionLongPressTimer = null;
    let selectionLongPressTriggered = false;
    const selectionLongPressStart = { x: 0, y: 0 };
    let swipeCommitTimer = null;
    let swipeResetTimer = null;
    const DELETE_THRESHOLD = SWIPE_REVEAL.triggerThreshold;
    const INSERT_THRESHOLD = SWIPE_INSERT_ANIMATION.triggerThreshold;
    const SWIPE_START_THRESHOLD = SWIPE_REVEAL.intentThreshold;
    const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSelection();
    const coverSrc = computed(() => {
      if (coverFailed.value) return "";
      return coverUseRandom.value ? getRandomCoverSrc(props.song) : getSongCoverSrc(props.song);
    });
    const handleCoverError = () => {
      if (coverUseRandom.value) coverFailed.value = true;
      else coverUseRandom.value = true;
    };
    watch(songIdentity, () => {
      coverFailed.value = false;
      coverUseRandom.value = false;
    });
    function clearSwipeAnimationTimers() {
      if (swipeCommitTimer) {
        window.clearTimeout(swipeCommitTimer);
        swipeCommitTimer = null;
      }
      if (swipeResetTimer) {
        window.clearTimeout(swipeResetTimer);
        swipeResetTimer = null;
      }
    }
    function clearSelectionLongPressTimer() {
      if (selectionLongPressTimer) {
        window.clearTimeout(selectionLongPressTimer);
        selectionLongPressTimer = null;
      }
    }
    function getInsertMotionState() {
      return {
        active: isSwipingToInsert.value || canInsertNext.value && (swipeOffset.value < 0 || swipePhase.value !== "idle"),
        offset: swipeOffset.value,
        phase: swipePhase.value
      };
    }
    function finishInsertMotion() {
      swipeOffset.value = 0;
      clearSwipeAnimationTimers();
      swipePhase.value = "idle";
      shouldShakeInsert.value = false;
      isSwipingToInsert.value = false;
    }
    function settleInsertMotion() {
      clearSwipeAnimationTimers();
      swipePhase.value = "settle";
      swipeOffset.value = 0;
      shouldShakeInsert.value = false;
      swipeResetTimer = window.setTimeout(() => {
        finishInsertMotion();
      }, SWIPE_INSERT_ANIMATION.settleDurationMs);
    }
    function finishDeleteMotion() {
      swipePhase.value = "idle";
      swipeOffset.value = 0;
      shouldShake.value = false;
      isSwipingToDelete.value = false;
    }
    function settleDeleteMotion() {
      clearSwipeAnimationTimers();
      swipePhase.value = "settle";
      swipeOffset.value = 0;
      shouldShake.value = false;
      swipeResetTimer = window.setTimeout(() => {
        finishDeleteMotion();
      }, SWIPE_REVEAL.settleDurationMs);
    }
    function commitInsertMotion() {
      clearSwipeAnimationTimers();
      swipePhase.value = "commit";
      swipeOffset.value = getSwipeInsertCommitOffset(swipeOffset.value);
      shouldShakeInsert.value = false;
      swipeCommitTimer = window.setTimeout(() => {
        swipePhase.value = "settle";
        swipeOffset.value = 0;
        swipeResetTimer = window.setTimeout(() => {
          finishInsertMotion();
        }, SWIPE_INSERT_ANIMATION.settleDurationMs);
      }, SWIPE_INSERT_ANIMATION.commitDurationMs);
    }
    const swipeStyle = computed(() => {
      if (isSwipingToDelete.value) {
        return getSwipeRevealContentStyle({
          offset: swipeOffset.value,
          phase: swipePhase.value,
          isDragging: isSwipeGesture.value
        });
      }
      if (isSwipingToInsert.value || swipeOffset.value < 0 || swipePhase.value !== "idle") {
        return getSwipeInsertContentStyle(getInsertMotionState());
      }
      if (swipeOffset.value === 0) return {};
      return {
        transform: `translateX(${swipeOffset.value}px)`,
        transition: isSwipeGesture.value ? "none" : "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      };
    });
    const deleteBackgroundStyle = computed(() => {
      if (!canDelete.value || swipeOffset.value <= 0) return { opacity: 0 };
      return getSwipeRevealBackgroundStyle({
        offset: swipeOffset.value,
        direction: DELETE_SWIPE_DIRECTION,
        accentRgb: SWIPE_REVEAL.deleteAccentRgb,
        threshold: DELETE_THRESHOLD
      });
    });
    const isDeleteIconVisible = computed(() => canDelete.value && isSwipeRevealIconVisible(swipeOffset.value, DELETE_SWIPE_DIRECTION));
    const isDeleteReady = computed(() => canDelete.value && swipeOffset.value >= DELETE_THRESHOLD);
    const isInsertIconVisible = computed(() => canInsertNext.value && isSwipeRevealIconVisible(swipeOffset.value, "left"));
    const insertBackgroundStyle = computed(() => {
      return getSwipeInsertBackgroundStyle(getInsertMotionState());
    });
    const isInsertReady = computed(() => canInsertNext.value && isSwipeInsertReady(swipeOffset.value));
    const checkShouldShake = () => {
      shouldShake.value = isSwipingToDelete.value && shouldSwipeRevealShake(swipeOffset.value, DELETE_SWIPE_DIRECTION);
      shouldShakeInsert.value = isSwipingToInsert.value && shouldSwipeRevealShake(swipeOffset.value, "left");
    };
    const handleTouchStartWrapper = (event) => {
      swipeFrame.cancel();
      swipeOffset.value = 0;
      clearSwipeAnimationTimers();
      const touch2 = event.touches?.[0];
      if (touch2) {
        swipeStartPos.value = { x: touch2.clientX, y: touch2.clientY };
      }
      isSwipeGesture.value = false;
      isSwipingToDelete.value = false;
      isSwipingToInsert.value = false;
      swipePhase.value = "idle";
      shouldShake.value = false;
      shouldShakeInsert.value = false;
      clearSelectionLongPressTimer();
      selectionLongPressTriggered = false;
      if (selectionStore.isModeActive && typeof props.onLongPressWhileSelecting === "function") {
        const touch3 = event.touches?.[0];
        if (touch3) {
          selectionLongPressStart.x = touch3.clientX;
          selectionLongPressStart.y = touch3.clientY;
        }
        selectionLongPressTimer = window.setTimeout(async () => {
          selectionLongPressTimer = null;
          selectionLongPressTriggered = true;
          suppressNextClick.value = true;
          try {
            if (window.navigator?.vibrate) window.navigator.vibrate(20);
          } catch (_) {
          }
          try {
            await props.onLongPressWhileSelecting(props.song);
          } catch (error) {
            console.warn("onLongPressWhileSelecting failed:", error);
          }
        }, SELECTION_LONG_PRESS_MS);
      }
      if (!canDelete.value && !canInsertNext.value || selectionStore.isModeActive) {
        handleTouchStart(event, "song", songIdentity.value, onSwipeLeft);
        return;
      }
      handleTouchStart(event, "song", songIdentity.value);
    };
    const swipeFrame = createFrameScheduler((deltaX) => {
      if (!isSwipeGesture.value) return;
      swipeOffset.value = isSwipingToDelete.value ? resolveSwipeRevealOffset(deltaX, DELETE_SWIPE_DIRECTION) : resolveSwipeInsertOffset(deltaX);
      checkShouldShake();
    });
    const handleTouchCancelWrapper = (event) => {
      swipeFrame.cancel();
      clearSelectionLongPressTimer();
      selectionLongPressTriggered = false;
      isSwipeGesture.value = false;
      if (isSwipingToDelete.value) settleDeleteMotion();
      else if (isSwipingToInsert.value) settleInsertMotion();
      handleTouchEnd(event);
    };
    const handleTouchMoveWrapper = (event) => {
      const touch2 = event.touches?.[0];
      if (selectionLongPressTimer && touch2) {
        const movedX = Math.abs(touch2.clientX - selectionLongPressStart.x);
        const movedY = Math.abs(touch2.clientY - selectionLongPressStart.y);
        if (movedX > SELECTION_LONG_PRESS_CANCEL_DISTANCE || movedY > SELECTION_LONG_PRESS_CANCEL_DISTANCE) {
          clearSelectionLongPressTimer();
        }
      }
      if (!canDelete.value && !canInsertNext.value) {
        handleTouchMove(event);
        return;
      }
      if (selectionStore.isModeActive) {
        isSwipeGesture.value = false;
        isSwipingToDelete.value = false;
        isSwipingToInsert.value = false;
        handleTouchMove(event);
        return;
      }
      if (!touch2) return;
      const deltaX = touch2.clientX - swipeStartPos.value.x;
      const deltaY = Math.abs(touch2.clientY - swipeStartPos.value.y);
      if (!isSwipeGesture.value) {
        const hasDeleteIntent = canDelete.value && deltaX > SWIPE_START_THRESHOLD && deltaX > deltaY * HORIZONTAL_INTENT_RATIO;
        const hasLeftSwipeIntent = canInsertNext.value && hasSwipeInsertIntent(deltaX, deltaY);
        if (!hasDeleteIntent && !hasLeftSwipeIntent) {
          handleTouchMove(event);
          return;
        }
        handleTouchEnd(event);
        isSwipeGesture.value = true;
        isSwipingToDelete.value = hasDeleteIntent;
        isSwipingToInsert.value = hasLeftSwipeIntent;
        swipePhase.value = hasDeleteIntent || hasLeftSwipeIntent ? "dragging" : "idle";
      }
      if (!isSwipeGesture.value) {
        handleTouchMove(event);
        return;
      }
      event.preventDefault();
      swipeFrame.schedule(deltaX);
    };
    const handleTouchEndWrapper = (event) => {
      swipeFrame.flush();
      if (selectionLongPressTimer) {
        clearSelectionLongPressTimer();
      }
      if (selectionLongPressTriggered) {
        selectionLongPressTriggered = false;
        suppressNextClick.value = true;
        handleTouchEnd(event);
        return;
      }
      if (!canDelete.value && !canInsertNext.value || !isSwipeGesture.value) {
        handleTouchEnd(event);
        return;
      }
      suppressNextClick.value = Math.abs(swipeOffset.value) > SWIPE_START_THRESHOLD;
      isSwipeGesture.value = false;
      if (isSwipingToDelete.value && swipeOffset.value >= DELETE_THRESHOLD) {
        executeDelete();
      } else if (isSwipingToInsert.value && swipeOffset.value <= -INSERT_THRESHOLD) {
        executeInsertNext();
      } else {
        shouldShake.value = false;
        if (isSwipingToDelete.value) {
          settleDeleteMotion();
        } else if (isSwipingToInsert.value) {
          settleInsertMotion();
        } else {
          swipeOffset.value = 0;
          isSwipingToInsert.value = false;
        }
      }
      handleTouchEnd(event);
    };
    const executeDelete = async () => {
      if (props.onDelete) {
        clearSwipeAnimationTimers();
        swipePhase.value = "commit";
        swipeOffset.value = getSwipeRevealCommitOffset(swipeOffset.value, DELETE_SWIPE_DIRECTION);
        shouldShake.value = false;
        try {
          await new Promise((resolve) => window.setTimeout(resolve, SWIPE_REVEAL.commitDurationMs));
          await props.onDelete(props.song);
          finishDeleteMotion();
        } catch (error) {
          console.error("鍒犻櫎澶辫触:", error);
          settleDeleteMotion();
        }
      } else {
        settleDeleteMotion();
      }
    };
    const executeInsertNext = async () => {
      if (props.onInsertNext) {
        commitInsertMotion();
        try {
          await props.onInsertNext(props.song);
        } catch (error) {
          console.error("鎻掑叆澶辫触:", error);
          settleInsertMotion();
        }
      }
    };
    const onSwipeLeft = () => {
      if (selectionStore.isModeActive) return;
      showSwipeButton.value = true;
    };
    const addToNext = () => {
      playlistStore.enqueuePriorityNext([props.song], {
        taskId: "swipe-add-next",
        currentHashId: playerStore.currentHashId,
        triggerSource: "manual_user",
        source: "song_item_swipe"
      });
      showSwipeButton.value = false;
      const event = new CustomEvent("song-added-to-playlist", {
        detail: { song: props.song }
      });
      window.dispatchEvent(event);
      console.log(`[UI] 宸叉坊鍔犲埌涓嬩竴棣栨挱鏀? ${props.song.title}`);
    };
    const handleContentClick = () => {
      if (suppressNextClick.value) {
        suppressNextClick.value = false;
        return;
      }
      if (showSwipeButton.value) {
        showSwipeButton.value = false;
        return;
      }
      console.log(
        `[UI] 鐐瑰嚮浜嬩欢 | 鏇茬洰: ${props.song.title} | 澶氶€夋ā寮? ${selectionStore.isModeActive}`
      );
      if (selectionStore.isModeActive) {
        const key = songIdentity.value;
        if (!key) return;
        selectionStore.toggleItem(key);
      } else {
        playerStore.playTrack(props.song, {
          triggerSource: "manual_user",
          switchReason: "song_item_click"
        });
      }
    };
    const hideSwipeButton = () => {
      showSwipeButton.value = false;
    };
    watch(showSwipeButton, (visible) => {
      if (visible) document.addEventListener("click", hideSwipeButton);
      else document.removeEventListener("click", hideSwipeButton);
    });
    onUnmounted(() => {
      swipeFrame.cancel();
      clearSwipeAnimationTimers();
      clearSelectionLongPressTimer();
      document.removeEventListener("click", hideSwipeButton);
    });
    return (_ctx, _cache) => {
      const _directive_marquee = resolveDirective("marquee");
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["song-box song-row-surface", {
          "is-row-enhanced": __props.renderDetails,
          "is-selected": isSelected.value,
          "mode-selection": unref(selectionStore).isModeActive,
          "is-playing": isPlaying.value,
          "swipe-active": showSwipeButton.value,
          "swipe-deleting": isSwipingToDelete.value,
          "swipe-inserting": isSwipingToInsert.value,
          "recently-inserted": __props.song._tempHighlight
        }]),
        "data-hash": __props.song.hash_id ?? __props.song.id
      }, [
        isSwipingToInsert.value || showSwipeButton.value ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "insert-background",
          style: normalizeStyle(insertBackgroundStyle.value)
        }, [
          createBaseVNode("div", {
            class: normalizeClass(["insert-icon action-reveal-icon", {
              visible: isInsertIconVisible.value,
              shake: shouldShakeInsert.value,
              armed: isInsertReady.value
            }])
          }, [..._cache[1] || (_cache[1] = [
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
            ], -1)
          ])], 2)
        ], 4)) : createCommentVNode("", true),
        isSwipingToDelete.value ? (openBlock(), createElementBlock("div", {
          key: 1,
          class: "delete-background",
          style: normalizeStyle(deleteBackgroundStyle.value)
        }, [
          createBaseVNode("div", {
            class: normalizeClass(["trash-icon action-reveal-icon", { shake: shouldShake.value, visible: isDeleteIconVisible.value, armed: isDeleteReady.value }])
          }, [..._cache[2] || (_cache[2] = [
            createStaticVNode('<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" data-v-b8a7c77e><path d="M5 7h14" data-v-b8a7c77e></path><path d="M9 7V5.8C9 4.8 9.8 4 10.8 4h2.4C14.2 4 15 4.8 15 5.8V7" data-v-b8a7c77e></path><path d="M7 7l.7 12.1c.1 1.1 1 1.9 2.1 1.9h4.4c1.1 0 2-.8 2.1-1.9L17 7" data-v-b8a7c77e></path><path d="M10 11v6" data-v-b8a7c77e></path><path d="M14 11v6" data-v-b8a7c77e></path></svg>', 1)
          ])], 2)
        ], 4)) : createCommentVNode("", true),
        createBaseVNode("div", {
          class: "content-area",
          style: normalizeStyle(swipeStyle.value),
          onTouchstart: handleTouchStartWrapper,
          onTouchmove: handleTouchMoveWrapper,
          onTouchend: handleTouchEndWrapper,
          onTouchcancel: handleTouchCancelWrapper,
          onClick: handleContentClick
        }, [
          createBaseVNode("div", _hoisted_2$8, [
            __props.renderDetails ? (openBlock(), createBlock(DeferredThumbnail, {
              key: 0,
              src: coverSrc.value,
              enabled: __props.canLoadCover,
              eager: "",
              onError: handleCoverError
            }, null, 8, ["src", "enabled"])) : createCommentVNode("", true)
          ]),
          createBaseVNode("div", _hoisted_3$7, [
            createBaseVNode("div", _hoisted_4$6, [
              withDirectives((openBlock(), createElementBlock("p", _hoisted_5$4, [
                createTextVNode(toDisplayString(unref(formatTitle)(__props.song)), 1)
              ])), [
                [_directive_marquee, isPlaying.value && __props.canLoadCover]
              ])
            ]),
            createBaseVNode("div", _hoisted_6$4, [
              withDirectives((openBlock(), createElementBlock("p", _hoisted_7$3, [
                createTextVNode(toDisplayString(unref(formatArtistProducer)(__props.song)), 1)
              ])), [
                [_directive_marquee, isPlaying.value && __props.canLoadCover]
              ])
            ])
          ])
        ], 36),
        props.showDragHandle ?? true ? (openBlock(), createElementBlock("div", {
          key: 2,
          class: normalizeClass([{ "handle-hidden": unref(selectionStore).isModeActive || showSwipeButton.value }, "drag-handle"]),
          style: normalizeStyle(swipeStyle.value),
          role: "button",
          "aria-label": "拖拽排序",
          onClick: _cache[0] || (_cache[0] = withModifiers(() => {
          }, ["stop"]))
        }, [..._cache[3] || (_cache[3] = [
          createBaseVNode("svg", {
            class: "drag-handle-icon",
            viewBox: "0 0 24 24",
            "aria-hidden": "true"
          }, [
            createBaseVNode("path", { d: "M8 7h8M8 12h8M8 17h8" })
          ], -1)
        ])], 6)) : createCommentVNode("", true),
        showSwipeButton.value && !props.enableSwipeDelete ? (openBlock(), createElementBlock("div", _hoisted_8$3, [
          createBaseVNode("button", {
            class: "action-btn add-next",
            onClick: addToNext
          }, " 添加到下一首播放 ")
        ])) : createCommentVNode("", true)
      ], 10, _hoisted_1$9);
    };
  }
};
const SongItem = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__scopeId", "data-v-b8a7c77e"]]);
function useRowHydration(items, range, active, identity) {
  const ready = shallowRef(/* @__PURE__ */ new Set());
  let frame = null;
  let pending2 = [];
  function cancel() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
  }
  function tick() {
    frame = null;
    if (!active.value) return;
    const next = new Set(ready.value);
    for (let count = 0; count < 2 && pending2.length; count++) next.add(pending2.shift());
    ready.value = next;
    if (pending2.length) frame = requestAnimationFrame(tick);
  }
  watch([items, range, active], () => {
    cancel();
    if (!items.value.length) {
      ready.value = /* @__PURE__ */ new Set();
      pending2 = [];
      return;
    }
    if (!active.value) return;
    const desired = items.value.slice(range.value.start, range.value.end).map(identity);
    const retained = new Set([...ready.value].filter((id) => desired.includes(id)));
    ready.value = retained;
    pending2 = desired.filter((id) => !retained.has(id));
    if (pending2.length) frame = requestAnimationFrame(tick);
  }, { immediate: true });
  onBeforeUnmount(cancel);
  return ready;
}
const _hoisted_1$8 = ["data-hash"];
const _hoisted_2$7 = { class: "preview-content" };
const _hoisted_3$6 = { class: "preview-copy" };
const _hoisted_4$5 = { class: "title" };
const _hoisted_5$3 = { class: "artist" };
const _hoisted_6$3 = {
  key: 0,
  class: "preview-handle",
  "aria-hidden": "true"
};
const _sfc_main$a = {
  __name: "SongRowPreview",
  props: { song: { type: Object, required: true }, showDragHandle: Boolean },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "song-box song-row-surface song-row-preview",
        "data-hash": __props.song.hash_id ?? __props.song.id
      }, [
        createBaseVNode("div", _hoisted_2$7, [
          _cache[0] || (_cache[0] = createBaseVNode("div", {
            class: "preview-cover",
            "aria-hidden": "true"
          }, null, -1)),
          createBaseVNode("div", _hoisted_3$6, [
            createBaseVNode("p", _hoisted_4$5, toDisplayString(unref(formatTitle)(__props.song)), 1),
            createBaseVNode("p", _hoisted_5$3, toDisplayString(unref(formatArtistProducer)(__props.song)), 1)
          ])
        ]),
        __props.showDragHandle ? (openBlock(), createElementBlock("span", _hoisted_6$3, "≡")) : createCommentVNode("", true)
      ], 8, _hoisted_1$8);
    };
  }
};
const SongRowPreview = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-f3bddaab"]]);
const _sfc_main$9 = {
  __name: "VirtualListRow",
  props: { row: { type: Object, required: true }, height: Number, stableContent: Boolean },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["virtual-scroll-item", { "is-placeholder": !__props.row.loaded }]),
        style: normalizeStyle({ height: __props.height + "px", width: "100%" })
      }, [
        __props.row.loaded && (__props.stableContent || __props.row.active) ? renderSlot(_ctx.$slots, "default", {
          key: 0,
          item: __props.row.item,
          index: __props.row.index,
          active: __props.row.active,
          canLoadMedia: __props.row.mediaAllowed
        }) : __props.row.loaded ? renderSlot(_ctx.$slots, "preview", {
          key: 1,
          item: __props.row.item,
          index: __props.row.index
        }, () => [
          createVNode(SongRowPreview, {
            song: __props.row.item
          }, null, 8, ["song"])
        ]) : renderSlot(_ctx.$slots, "placeholder", {
          key: 2,
          index: __props.row.index
        })
      ], 6);
    };
  }
};
function createScrollActivity(getElement, options = 160) {
  const { idleDelay = 180, onPhaseChange = () => {
  } } = typeof options === "number" ? { idleDelay: options } : options;
  let element = null;
  let timer = null;
  let lastScrollAt = 0;
  let lastTop = 0;
  let phase = "idle";
  function setPhase(next) {
    if (phase === next) return;
    phase = next;
    element?.classList.toggle("ty-scroll-fast", phase === "fast");
    onPhaseChange(phase);
  }
  function stop() {
    clearTimeout(timer);
    timer = null;
    element?.classList.remove("ty-scroll-active", "ty-scroll-fast");
    setPhase("idle");
    element = null;
  }
  function settle() {
    const remaining = idleDelay - (performance.now() - lastScrollAt);
    if (remaining > 1) timer = setTimeout(settle, remaining);
    else stop();
  }
  return {
    mark() {
      const target = getElement();
      if (!target) return;
      if (element !== target) {
        stop();
        element = target;
        element.classList.add("ty-scroll-active");
        lastTop = element.scrollTop;
        lastScrollAt = performance.now();
        setPhase("scrolling");
      }
      const now2 = performance.now();
      const distance = Math.abs(target.scrollTop - lastTop);
      const speed = distance / Math.max(8, now2 - lastScrollAt);
      if (speed > 1.5) setPhase("fast");
      else if (phase === "fast" && distance > 0 && speed < 0.4) setPhase("scrolling");
      lastTop = target.scrollTop;
      lastScrollAt = now2;
      if (timer === null) timer = setTimeout(settle, idleDelay);
    },
    stop
  };
}
const _hoisted_1$7 = {
  key: 0,
  class: "virtual-scroll-skeleton-track",
  "aria-hidden": "true"
};
const _sfc_main$8 = {
  __name: "VirtualList",
  props: {
    stableContent: { type: Boolean, default: false },
    retainText: { type: Boolean, default: false },
    items: {
      type: Array,
      required: true
    },
    itemHeight: {
      type: Number,
      required: true
    },
    itemKey: {
      type: [String, Function],
      default: "id"
    },
    totalItems: {
      type: Number,
      default: 0
    },
    baseIndex: {
      type: Number,
      default: 0
    },
    buffer: {
      type: Number,
      default: 8
    },
    height: {
      type: Number,
      default: 0
    },
    fillParent: {
      type: Boolean,
      default: true
    },
    measureOnScroll: {
      type: Boolean,
      default: false
    },
    showScrollSkeleton: {
      type: Boolean,
      default: true
    }
  },
  emits: ["range-change", "measure-change"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const containerRef = ref(null);
    const scrollTop = ref(0);
    const containerHeight = ref(props.height || 600);
    let active = true;
    const hydrationActive = ref(true);
    let measurePending = false;
    let lastMeasureKey = "";
    const scrollFrame = createFrameScheduler(syncScrollState);
    const renderPaused = ref(false);
    const scrollActivity = createScrollActivity(() => containerRef.value, { onPhaseChange: (phase) => {
      renderPaused.value = phase === "fast";
    } });
    const containerStyle = computed(() => {
      const fixedHeight = Number(props.height);
      const hasFixedHeight = Number.isFinite(fixedHeight) && fixedHeight > 0;
      return {
        height: hasFixedHeight ? `${fixedHeight}px` : props.fillParent ? "100%" : "auto",
        flex: hasFixedHeight ? void 0 : props.fillParent ? void 0 : "1 1 auto",
        minHeight: hasFixedHeight ? void 0 : "0",
        overflowY: "auto",
        contain: "layout paint style",
        willChange: "scroll-position",
        position: "relative",
        width: "100%"
      };
    });
    const effectiveTotalItems = computed(() => {
      if (Number.isFinite(props.totalItems) && props.totalItems > 0) {
        return props.totalItems;
      }
      return props.items.length;
    });
    const effectiveItemHeight = computed(() => {
      const h = Number(props.itemHeight);
      return Number.isFinite(h) && h > 0 ? h : 83;
    });
    const totalHeight = computed(() => effectiveTotalItems.value * effectiveItemHeight.value);
    const visibleCount = computed(() => {
      return Math.ceil(containerHeight.value / effectiveItemHeight.value);
    });
    const startIndex = computed(() => {
      return Math.max(0, Math.floor(scrollTop.value / effectiveItemHeight.value) - props.buffer);
    });
    const endIndex = computed(() => {
      return Math.min(
        effectiveTotalItems.value,
        Math.floor(scrollTop.value / effectiveItemHeight.value) + visibleCount.value + props.buffer
      );
    });
    const offset = computed(() => {
      return startIndex.value * effectiveItemHeight.value;
    });
    const renderedStartIndex = computed(() => {
      return props.retainText ? 0 : startIndex.value;
    });
    const renderedRows = computed(() => {
      const rows = [];
      for (let index = props.retainText ? 0 : startIndex.value; index < (props.retainText ? effectiveTotalItems.value : endIndex.value); index += 1) {
        const localIndex = index - props.baseIndex;
        const item = localIndex >= 0 && localIndex < props.items.length ? props.items[localIndex] : null;
        rows.push(shallowReactive({
          index,
          item,
          active: !props.retainText,
          mediaAllowed: !props.retainText,
          loaded: item != null
        }));
      }
      return rows;
    });
    const hydrationRange = computed(() => props.retainText ? { start: startIndex.value, end: endIndex.value } : { start: 0, end: renderedRows.value.length });
    const hydrated = useRowHydration(renderedRows, hydrationRange, computed(() => hydrationActive.value && !renderPaused.value), (row) => row.index);
    let activeRows = /* @__PURE__ */ new Set();
    watch([hydrated, renderedRows, renderPaused], () => {
      const rows = renderedRows.value;
      const next = hydrated.value;
      for (const row of activeRows) {
        if (!next.has(row.index) || rows[props.retainText ? row.index : row.index - startIndex.value] !== row) {
          row.active = false;
          row.mediaAllowed = false;
        }
      }
      const current = /* @__PURE__ */ new Set();
      for (const index of next) {
        const row = rows[props.retainText ? index : index - startIndex.value];
        if (!row) continue;
        row.active = true;
        row.mediaAllowed = !renderPaused.value;
        current.add(row);
      }
      activeRows = current;
    }, { immediate: true });
    function resolveItemKey(item, index) {
      if (typeof props.itemKey === "function") {
        return props.itemKey(item, index) || `vrow-${index}`;
      }
      if (item == null) return `vrow-${index}`;
      return item[props.itemKey] || item.hash_id || item.id || `vrow-${index}`;
    }
    function emitRangeChange() {
      const visibleStart = Math.max(0, Math.floor(scrollTop.value / effectiveItemHeight.value));
      const visibleEnd = Math.min(effectiveTotalItems.value, visibleStart + visibleCount.value);
      emit("range-change", {
        visibleStart,
        visibleEnd,
        overscanStart: startIndex.value,
        overscanEnd: endIndex.value,
        renderedStart: renderedStartIndex.value,
        renderedEnd: renderedStartIndex.value + renderedRows.value.length,
        totalItems: effectiveTotalItems.value,
        scrollTop: scrollTop.value,
        containerHeight: containerHeight.value
      });
    }
    function measureRenderedUnitHeight() {
      const container = containerRef.value;
      if (!container) return;
      const first = container.querySelector(".song-box");
      const second = first?.closest(".virtual-scroll-item")?.nextElementSibling?.querySelector(".song-box");
      const renderedItems = [first, second].filter(Boolean);
      let unitHeight = 0;
      if (renderedItems.length >= 2) {
        const firstTop = renderedItems[0].getBoundingClientRect().top;
        const secondTop = renderedItems[1].getBoundingClientRect().top;
        unitHeight = Math.abs(secondTop - firstTop);
      } else if (renderedItems.length === 1) {
        unitHeight = renderedItems[0].getBoundingClientRect().height;
      }
      if (Number.isFinite(unitHeight) && unitHeight > 0) {
        emit("measure-change", {
          itemHeight: renderedItems[0]?.getBoundingClientRect?.().height || unitHeight,
          unitHeight,
          renderedCount: renderedItems.length,
          containerHeight: containerHeight.value
        });
      }
    }
    function scheduleMeasureRenderedUnitHeight(force = false) {
      if (!active || !force && !props.measureOnScroll) return;
      const key = `${startIndex.value}:${endIndex.value}:${containerHeight.value}:${effectiveItemHeight.value}`;
      if (!force && key === lastMeasureKey) return;
      lastMeasureKey = key;
      if (measurePending) return;
      measurePending = true;
      nextTick(() => {
        measurePending = false;
        if (active) measureRenderedUnitHeight();
      });
    }
    function syncScrollState() {
      if (!active || !containerRef.value) return;
      scrollTop.value = containerRef.value.scrollTop;
      emitRangeChange();
      scheduleMeasureRenderedUnitHeight();
    }
    function onScroll() {
      if (!active) return;
      scrollActivity.mark();
      scrollFrame.schedule();
    }
    let resizeObserver = null;
    function updateHeight() {
      if (!active) return;
      if (containerRef.value) {
        const h = containerRef.value.clientHeight;
        if (h > 0) {
          containerHeight.value = h;
        }
      }
      syncScrollState();
      scheduleMeasureRenderedUnitHeight(true);
    }
    function activate() {
      active = true;
      hydrationActive.value = true;
      if (!resizeObserver) resizeObserver = new ResizeObserver(updateHeight);
      if (containerRef.value) resizeObserver.observe(containerRef.value);
      nextTick(updateHeight);
    }
    function deactivate() {
      active = false;
      hydrationActive.value = false;
      scrollFrame.cancel();
      scrollActivity.stop();
      lastMeasureKey = "";
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    }
    onMounted(activate);
    onActivated(activate);
    onDeactivated(deactivate);
    onUnmounted(deactivate);
    watch(
      () => [props.totalItems, props.items.length, props.baseIndex, props.itemHeight, props.buffer, props.height, props.fillParent],
      () => {
        nextTick(() => {
          if (!active) return;
          syncScrollState();
          scheduleMeasureRenderedUnitHeight();
        });
      },
      { deep: false }
    );
    const scrollToTop = () => {
      if (containerRef.value) {
        containerRef.value.scrollTop = 0;
        scrollTop.value = 0;
        emitRangeChange();
      }
    };
    __expose({ scrollToTop, containerRef, syncScrollState, measureRenderedUnitHeight });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "virtual-scroll-container",
        ref_key: "containerRef",
        ref: containerRef,
        onScrollPassive: onScroll,
        style: normalizeStyle(containerStyle.value)
      }, [
        createBaseVNode("div", {
          class: "virtual-scroll-spacer",
          style: normalizeStyle({
            height: totalHeight.value + "px",
            position: "relative",
            width: "100%",
            "--virtual-scroll-row-height": effectiveItemHeight.value + "px"
          })
        }, [
          __props.showScrollSkeleton && !__props.retainText && effectiveTotalItems.value > 0 ? (openBlock(), createElementBlock("div", _hoisted_1$7)) : createCommentVNode("", true),
          createBaseVNode("div", {
            class: "virtual-scroll-list",
            style: normalizeStyle({
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: __props.retainText ? "none" : `translateY(${offset.value}px)`
            })
          }, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(renderedRows.value, (row) => {
              return openBlock(), createBlock(_sfc_main$9, {
                key: resolveItemKey(row.item, row.index),
                row,
                height: effectiveItemHeight.value,
                "stable-content": __props.stableContent
              }, {
                default: withCtx((context) => [
                  renderSlot(_ctx.$slots, "default", mergeProps({ ref_for: true }, context), void 0, true)
                ]),
                preview: withCtx((context) => [
                  renderSlot(_ctx.$slots, "preview", mergeProps({ ref_for: true }, context), () => [
                    createVNode(SongRowPreview, {
                      song: context.item
                    }, null, 8, ["song"])
                  ], true)
                ]),
                placeholder: withCtx(({ index }) => [
                  renderSlot(_ctx.$slots, "placeholder", { index }, () => [
                    _cache[0] || (_cache[0] = createBaseVNode("div", {
                      class: "virtual-scroll-placeholder",
                      "aria-hidden": "true"
                    }, [
                      createBaseVNode("div", { class: "virtual-scroll-placeholder-cover" }),
                      createBaseVNode("div", { class: "virtual-scroll-placeholder-copy" }, [
                        createBaseVNode("div", { class: "virtual-scroll-placeholder-line virtual-scroll-placeholder-line-title" }),
                        createBaseVNode("div", { class: "virtual-scroll-placeholder-line virtual-scroll-placeholder-line-subtitle" })
                      ])
                    ], -1))
                  ], true)
                ]),
                _: 3
              }, 8, ["row", "height", "stable-content"]);
            }), 128))
          ], 4)
        ], 4)
      ], 36);
    };
  }
};
const VirtualList = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-649e5823"]]);
const SKIN_THEME_STORAGE_KEY = "ty_skin_theme_config_v2";
const SKIN_THEME_UPDATED_EVENT = "ty-skin-theme-updated";
const SKIN_SANDBOX_DRAFT_EVENT = "ty-skin-sandbox-draft-updated";
const SKIN_THEME_SCHEMA_VERSION = 4;
const COLOR_FALLBACKS = {
  accent: "#2f8fff",
  pageBg: "#f4f7fb",
  surface: "#ffffff",
  text: "#18283a",
  mutedText: "#60748c"
};
function clampNumber(value, min, max, fallback = min) {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, num));
}
function clampInt(value, min, max, fallback = min) {
  return Math.round(clampNumber(value, min, max, fallback));
}
function normalizeColor(value, fallback) {
  const raw = `${value || ""}`.trim();
  if (/^#[0-9a-fA-F]{3,8}$/.test(raw)) return raw;
  if (/^rgba?\([\d\s.,%]+\)$/.test(raw)) return raw;
  if (/^hsla?\([\d\s.,%degturnrad]+\)$/.test(raw)) return raw;
  return fallback;
}
function sanitizeString(value, maxLength = 240) {
  return `${value || ""}`.trim().slice(0, maxLength);
}
function sanitizeMediaSrc(value) {
  const src = sanitizeString(value, 18e5);
  if (!src) return "";
  if (/^(skin-asset:\/\/|data:image\/|data:video\/|https?:\/\/|\/|\.\.?\/|assets\/|random_covers\/)/i.test(src)) {
    return src;
  }
  return "";
}
function sanitizeMediaFit(value, fallback = "contain") {
  return ["contain", "cover"].includes(value) ? value : fallback;
}
function sanitizeMediaAsset(value) {
  if (!value || typeof value !== "object") return void 0;
  const id = sanitizeString(value.id, 120);
  if (!id) return void 0;
  return {
    id,
    name: sanitizeString(value.name, 180),
    type: sanitizeString(value.type, 80),
    size: clampInt(value.size, 0, 1024 * 1024 * 1024, 0),
    width: clampInt(value.width, 0, 2e4, 0),
    height: clampInt(value.height, 0, 2e4, 0),
    updatedAt: sanitizeString(value.updatedAt, 48)
  };
}
function sanitizeLive2dUrl(value) {
  const src = sanitizeString(value, 1200);
  if (!src) return "";
  if (/^(https?:\/\/|\/|\.\.?\/|assets\/)/i.test(src)) return src;
  return "";
}
function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}
function createSvgDataUrl({ title, subtitle = "", colors = ["#4f8cff", "#73c8ff"], width = 960, height = 960 }) {
  const safeTitle = `${title || ""}`.replace(/[<&>"]/g, "");
  const safeSubtitle = `${subtitle || ""}`.replace(/[<&>"]/g, "");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${colors[0]}" />
          <stop offset="100%" stop-color="${colors[1]}" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" rx="${Math.round(Math.min(width, height) * 0.08)}" fill="url(#g)" />
      <circle cx="${Math.round(width * 0.78)}" cy="${Math.round(height * 0.2)}" r="${Math.round(Math.min(width, height) * 0.16)}" fill="rgba(255,255,255,0.16)" />
      <circle cx="${Math.round(width * 0.18)}" cy="${Math.round(height * 0.82)}" r="${Math.round(Math.min(width, height) * 0.2)}" fill="rgba(255,255,255,0.11)" />
      <text x="${Math.round(width * 0.08)}" y="${Math.round(height * 0.62)}" font-size="${Math.round(width * 0.09)}" font-family="Arial, sans-serif" font-weight="700" fill="#ffffff">${safeTitle}</text>
      <text x="${Math.round(width * 0.08)}" y="${Math.round(height * 0.72)}" font-size="${Math.round(width * 0.032)}" font-family="Arial, sans-serif" fill="rgba(255,255,255,0.82)">${safeSubtitle}</text>
    </svg>
  `.trim();
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
const SKIN_ALLOWED_BOUNDARIES = Object.freeze([
  {
    id: "global_layout",
    zone: "app.global.css-vars",
    editable: ["app background image/video", "surface color", "container radius", "item radius", "cover radius", "list spacing"],
    blocked: ["DOM structure", "route behavior", "network/API calls", "arbitrary script"]
  },
  {
    id: "splash_screen",
    zone: "system.boot.splash",
    editable: ["image/video asset", "viewport transform", "overlay", "entry animation"],
    blocked: ["startup timing", "native WebView lifecycle", "remote JavaScript"]
  },
  {
    id: "song_item",
    zone: "component.song.item",
    editable: ["song row surface", "cover frame", "control button radius/color", "progress color", "decorative image/live2d URL metadata"],
    blocked: ["song data fields", "playback commands", "selection/delete gestures"]
  },
  {
    id: "search_song_item",
    zone: "component.search.song.item",
    editable: ["search result row surface", "cover frame", "text color", "row spacing", "decorative image metadata"],
    blocked: ["search endpoint contract", "download behavior", "selection/delete gestures"]
  },
  {
    id: "playlist_song_item",
    zone: "component.playlist.song.item",
    editable: ["playlist song row surface", "cover frame", "text color", "row spacing", "decorative image metadata"],
    blocked: ["playlist order contract", "download tasks", "selection/delete gestures"]
  },
  {
    id: "drawer_song_item",
    zone: "component.drawer.song.item",
    editable: ["drawer song row surface", "cover frame", "text color", "row spacing", "decorative image metadata"],
    blocked: ["queue/history source", "drawer open/close behavior", "playback commands"]
  },
  {
    id: "bili_video_item",
    zone: "component.account.bili-video.item",
    editable: ["Bilibili favorite row surface", "thumbnail radius", "text color", "row spacing"],
    blocked: ["Bilibili parsing contract", "download behavior", "external link behavior"]
  },
  {
    id: "player_controls",
    zone: "component.player.controls",
    editable: ["player progress color", "button radius/color", "control spacing"],
    blocked: ["playback state", "seek behavior", "video mode behavior"]
  },
  {
    id: "mini_player",
    zone: "component.mini.player",
    editable: ["mini player background", "cover radius/size", "button/progress color", "container gap and height"],
    blocked: ["current track source", "playback command logic", "drawer/open behavior"]
  },
  {
    id: "page_account",
    zone: "page.account.layout",
    editable: ["account page background", "account card radius", "account card/list spacing", "child-page card styling"],
    blocked: ["account identity data", "auth behavior", "navigation semantics"]
  },
  {
    id: "page_home",
    zone: "page.home.layout",
    editable: ["home list spacing", "home panel radius", "home cover radius", "hero overlay"],
    blocked: ["playlist creation/deletion behavior", "scan/import behavior", "queue semantics"]
  },
  {
    id: "page_playlist",
    zone: "page.playlist.layout",
    editable: ["playlist item height", "playlist list spacing", "playlist cover radius"],
    blocked: ["song order contract", "download tasks", "playback behavior"]
  },
  {
    id: "page_search",
    zone: "page.search.layout",
    editable: ["search page background", "top search bar surface", "search result spacing", "search item radius"],
    blocked: ["search endpoint contract", "download behavior", "selection behavior"]
  }
]);
const SKIN_TARGET_SCHEMAS = Object.freeze([
  {
    id: "splash_screen",
    group: "启动",
    title: "开屏自定义",
    description: "控制 Android WebView 开屏图像、遮罩与入场动效。",
    permissionZone: "system.boot.splash",
    previewKind: "splash",
    previewAspect: "9 / 16",
    capabilities: ["media", "transform", "overlay", "animation"],
    defaultValue: {
      enabled: false,
      mediaType: "image",
      mediaSrc: "",
      mediaFit: "contain",
      live2dModelUrl: "",
      scale: 1,
      translateX: 0,
      translateY: 0,
      overlayOpacity: 0,
      blur: 0,
      radius: 0,
      shadow: 0,
      animationName: "fade-scale",
      animationDurationMs: 1200,
      animationEasing: "ease-out"
    },
    previewSrc: createSvgDataUrl({
      title: "Splash",
      subtitle: "Opening Motion",
      colors: ["#16345f", "#58b7ff"],
      width: 900,
      height: 1600
    })
  },
  {
    id: "global_layout",
    group: "全局",
    title: "全局容器",
    description: "控制页面底色、容器圆角、列表间距和基础强调色。",
    permissionZone: "app.global.css-vars",
    previewKind: "layout",
    previewAspect: "10 / 12",
    capabilities: ["media", "transform", "colors", "radius", "spacing"],
    defaultValue: {
      enabled: true,
      mediaType: "image",
      mediaSrc: "",
      mediaFit: "cover",
      live2dModelUrl: "",
      scale: 1,
      translateX: 0,
      translateY: 0,
      accentColor: COLOR_FALLBACKS.accent,
      pageBackground: COLOR_FALLBACKS.pageBg,
      surfaceColor: COLOR_FALLBACKS.surface,
      textColor: COLOR_FALLBACKS.text,
      mutedTextColor: COLOR_FALLBACKS.mutedText,
      pageRadius: 24,
      containerRadius: 16,
      itemRadius: 12,
      coverRadius: 10,
      buttonRadius: 999,
      pagePadding: 14,
      cardGap: 14,
      listGap: 8,
      density: "comfortable"
    }
  },
  {
    id: "page_account",
    group: "页面",
    title: "账号页",
    description: "控制账号页 Hero、卡片密度和子页面统一圆角。",
    permissionZone: "page.account.layout",
    previewKind: "account",
    previewAspect: "10 / 12",
    capabilities: ["colors", "radius", "spacing", "overlay"],
    defaultValue: {
      enabled: true,
      accentColor: "#2f8fff",
      pageBackground: "#f3f7fb",
      surfaceColor: "#ffffff",
      heroOverlayOpacity: 0.34,
      heroBlur: 18,
      pageRadius: 24,
      containerRadius: 18,
      itemRadius: 14,
      pagePadding: 14,
      cardGap: 14,
      listGap: 10,
      compactCards: false
    }
  },
  {
    id: "page_home",
    group: "页面",
    title: "首页容器",
    description: "控制首页顶部播放区、歌单列表间距与 cover 子区。",
    permissionZone: "page.home.layout",
    previewKind: "home",
    previewAspect: "10 / 12",
    capabilities: ["radius", "spacing", "overlay"],
    defaultValue: {
      enabled: true,
      pageRadius: 20,
      containerRadius: 14,
      itemRadius: 12,
      coverRadius: 10,
      pagePadding: 10,
      listGap: 8,
      heroOverlayOpacity: 0.16,
      heroBlur: 0
    }
  },
  {
    id: "page_playlist",
    group: "页面",
    title: "歌单页容器",
    description: "控制歌单页歌曲列表高度、间距与 cover 子区。",
    permissionZone: "page.playlist.layout",
    previewKind: "playlist",
    previewAspect: "10 / 12",
    capabilities: ["radius", "spacing"],
    defaultValue: {
      enabled: true,
      pageRadius: 18,
      containerRadius: 14,
      itemRadius: 12,
      coverRadius: 10,
      pagePadding: 10,
      listGap: 8,
      songItemHeight: 83
    }
  },
  {
    id: "page_search",
    group: "页面",
    title: "搜索页顶部与容器",
    description: "控制搜索页顶部栏、页面背景、结果列表间距和歌曲项容器。",
    permissionZone: "page.search.layout",
    previewKind: "search",
    previewAspect: "10 / 12",
    capabilities: ["colors", "radius", "spacing"],
    defaultValue: {
      enabled: true,
      pageBackground: "#f5f5f5",
      surfaceColor: "#ffffff",
      accentColor: "#2f8fff",
      pageRadius: 18,
      containerRadius: 14,
      itemRadius: 12,
      pagePadding: 10,
      listGap: 8
    }
  },
  {
    id: "song_item",
    group: "组件",
    title: "歌曲项目样式组",
    description: "绑定歌曲项，覆盖 cover、歌曲 div、播放按钮和进度条的视觉变量。",
    permissionZone: "component.song.item",
    previewKind: "song",
    previewAspect: "10 / 4",
    capabilities: ["media", "colors", "radius", "spacing", "song-controls"],
    defaultValue: {
      enabled: false,
      mediaType: "image",
      mediaSrc: "",
      live2dModelUrl: "",
      mediaOpacity: 0.18,
      mediaPosition: "right center",
      mediaSize: "contain",
      backgroundColor: "#ffffff",
      textColor: "#18283a",
      mutedTextColor: "#6a7f96",
      playingColor: "#66ccff",
      progressColor: "#66ccff",
      buttonColor: "#1d1d1f",
      itemRadius: 12,
      coverRadius: 10,
      buttonRadius: 999,
      progressRadius: 999,
      itemPadding: 12,
      itemGap: 10,
      listGap: 8,
      itemHeight: 83,
      coverSize: 56
    }
  },
  {
    id: "search_song_item",
    group: "组件",
    title: "搜索结果项样式组",
    description: "绑定搜索页普通歌曲与 Bili 视频结果，不联动歌单页、抽屉或播放页。",
    permissionZone: "component.search.song.item",
    previewKind: "song",
    previewAspect: "10 / 4",
    capabilities: ["media", "colors", "radius", "spacing", "song-controls"],
    defaultValue: {
      enabled: false,
      mediaType: "image",
      mediaSrc: "",
      live2dModelUrl: "",
      mediaOpacity: 0.18,
      mediaPosition: "right center",
      mediaSize: "contain",
      backgroundColor: "#ffffff",
      textColor: "#18283a",
      mutedTextColor: "#6a7f96",
      playingColor: "#66ccff",
      progressColor: "#66ccff",
      buttonColor: "#1d1d1f",
      itemRadius: 12,
      coverRadius: 10,
      buttonRadius: 999,
      progressRadius: 999,
      itemPadding: 12,
      itemGap: 10,
      itemHeight: 83,
      coverSize: 56
    }
  },
  {
    id: "playlist_song_item",
    group: "组件",
    title: "歌单歌曲项样式组",
    description: "仅绑定歌单详情页歌曲列表，不联动搜索页或抽屉式播放列表。",
    permissionZone: "component.playlist.song.item",
    previewKind: "song",
    previewAspect: "10 / 4",
    capabilities: ["media", "colors", "radius", "spacing", "song-controls"],
    defaultValue: {
      enabled: false,
      mediaType: "image",
      mediaSrc: "",
      live2dModelUrl: "",
      mediaOpacity: 0.18,
      mediaPosition: "right center",
      mediaSize: "contain",
      backgroundColor: "#ffffff",
      textColor: "#18283a",
      mutedTextColor: "#6a7f96",
      playingColor: "#66ccff",
      progressColor: "#66ccff",
      buttonColor: "#1d1d1f",
      itemRadius: 12,
      coverRadius: 10,
      buttonRadius: 999,
      progressRadius: 999,
      itemPadding: 12,
      itemGap: 10,
      itemHeight: 83,
      coverSize: 56
    }
  },
  {
    id: "drawer_song_item",
    group: "组件",
    title: "抽屉歌曲项样式组",
    description: "仅绑定抽屉式播放列表/历史列表，不联动搜索页或歌单页。",
    permissionZone: "component.drawer.song.item",
    previewKind: "song",
    previewAspect: "10 / 4",
    capabilities: ["media", "colors", "radius", "spacing", "song-controls"],
    defaultValue: {
      enabled: false,
      mediaType: "image",
      mediaSrc: "",
      live2dModelUrl: "",
      mediaOpacity: 0.18,
      mediaPosition: "right center",
      mediaSize: "contain",
      backgroundColor: "#ffffff",
      textColor: "#18283a",
      mutedTextColor: "#6a7f96",
      playingColor: "#66ccff",
      progressColor: "#66ccff",
      buttonColor: "#1d1d1f",
      itemRadius: 12,
      coverRadius: 10,
      buttonRadius: 999,
      progressRadius: 999,
      itemPadding: 12,
      itemGap: 10,
      itemHeight: 83,
      coverSize: 56
    }
  },
  {
    id: "bili_video_item",
    group: "组件",
    title: "Bili 收藏项样式组",
    description: "仅绑定账号子页 Bilibili 收藏夹视频项。",
    permissionZone: "component.account.bili-video.item",
    previewKind: "song",
    previewAspect: "10 / 4",
    capabilities: ["colors", "radius", "spacing"],
    defaultValue: {
      enabled: false,
      backgroundColor: "#f8f8ff",
      textColor: "#18283a",
      mutedTextColor: "#6a7f96",
      playingColor: "#66ccff",
      progressColor: "#66ccff",
      buttonColor: "#1d1d1f",
      itemRadius: 12,
      coverRadius: 8,
      buttonRadius: 999,
      progressRadius: 999,
      itemPadding: 8,
      itemGap: 12,
      itemHeight: 92,
      coverSize: 68
    }
  },
  {
    id: "player_controls",
    group: "组件",
    title: "播放控件样式组",
    description: "仅绑定 MusicControl 播放页的进度条、按钮和控制区间距。",
    permissionZone: "component.player.controls",
    previewKind: "song",
    previewAspect: "10 / 3.2",
    capabilities: ["colors", "radius", "spacing"],
    defaultValue: {
      enabled: false,
      backgroundColor: "#ffffff",
      textColor: "#1d1d1f",
      mutedTextColor: "#6e6e73",
      progressColor: "#66ccff",
      buttonColor: "#1d1d1f",
      itemRadius: 18,
      coverRadius: 18,
      buttonRadius: 999,
      progressRadius: 999,
      itemGap: 10,
      itemHeight: 83,
      coverSize: 56
    }
  },
  {
    id: "mini_player",
    group: "组件",
    title: "迷你播放器样式组",
    description: "独立控制迷你播放器容器、封面、进度与按钮视觉，不联动歌曲列表。",
    permissionZone: "component.mini.player",
    previewKind: "song",
    previewAspect: "10 / 3.2",
    capabilities: ["colors", "radius", "spacing"],
    defaultValue: {
      enabled: false,
      backgroundColor: "#ffffff",
      textColor: "#18283a",
      mutedTextColor: "#6a7f96",
      progressColor: "#66ccff",
      buttonColor: "#1d1d1f",
      itemRadius: 20,
      coverRadius: 10,
      buttonRadius: 10,
      progressRadius: 999,
      itemGap: 12,
      itemHeight: 75,
      coverSize: 50
    }
  },
  {
    id: "home_hero_panel",
    group: "页面",
    title: "Home 顶部子区",
    description: "控制 Home 顶部子容器的素材、变换与遮罩。",
    permissionZone: "page.home.hero.child",
    previewKind: "media",
    previewAspect: "16 / 7",
    capabilities: ["media", "transform", "overlay", "radius"],
    defaultValue: {
      enabled: false,
      mediaType: "image",
      mediaSrc: "",
      mediaFit: "contain",
      live2dModelUrl: "",
      scale: 1,
      translateX: 0,
      translateY: 0,
      radius: 14,
      overlayOpacity: 0.22,
      blur: 0,
      shadow: 18
    },
    previewSrc: createSvgDataUrl({
      title: "Home Hero",
      subtitle: "Child Region",
      colors: ["#0f365f", "#79c0ff"],
      width: 1400,
      height: 620
    })
  },
  {
    id: "home_playlist_cover",
    group: "页面",
    title: "首页歌单 Cover",
    description: "控制首页歌单封面子区的变换与圆角。",
    permissionZone: "page.home.playlist.cover.child",
    previewKind: "cover",
    previewAspect: "1.52 / 1",
    capabilities: ["transform", "radius"],
    defaultValue: {
      enabled: false,
      mediaType: "image",
      mediaSrc: "",
      mediaFit: "contain",
      live2dModelUrl: "",
      scale: 1,
      translateX: 0,
      translateY: 0,
      radius: 10,
      overlayOpacity: 0,
      blur: 0,
      shadow: 0
    },
    previewSrc: createSvgDataUrl({
      title: "Playlist",
      subtitle: "Cover Frame",
      colors: ["#1a7a74", "#84d6c2"],
      width: 900,
      height: 592
    })
  },
  {
    id: "playlist_detail_cover",
    group: "页面",
    title: "歌单页 Cover",
    description: "控制歌单页歌曲封面子区的变换与圆角。",
    permissionZone: "page.playlist.detail.cover.child",
    previewKind: "cover",
    previewAspect: "1 / 1",
    capabilities: ["transform", "radius"],
    defaultValue: {
      enabled: false,
      mediaType: "image",
      mediaSrc: "",
      mediaFit: "contain",
      live2dModelUrl: "",
      scale: 1,
      translateX: 0,
      translateY: 0,
      radius: 10,
      overlayOpacity: 0,
      blur: 0,
      shadow: 0
    },
    previewSrc: createSvgDataUrl({
      title: "Detail Cover",
      subtitle: "Child Frame",
      colors: ["#4b4b92", "#96b2ff"],
      width: 900,
      height: 900
    })
  }
]);
function findSchema(targetId) {
  return SKIN_TARGET_SCHEMAS.find((item) => item.id === targetId) || null;
}
function normalizeTargetValue(schema, rawValue = {}) {
  const raw = rawValue && typeof rawValue === "object" ? rawValue : {};
  const value = { ...cloneValue(schema.defaultValue), ...raw };
  value.enabled = Boolean(value.enabled);
  if ("mediaType" in value) {
    value.mediaType = ["image", "video", "live2d"].includes(value.mediaType) ? value.mediaType : "image";
  }
  if ("mediaSrc" in value) value.mediaSrc = sanitizeMediaSrc(value.mediaSrc);
  if ("mediaFit" in value) value.mediaFit = sanitizeMediaFit(value.mediaFit);
  if ("mediaAsset" in value) {
    const mediaAsset = sanitizeMediaAsset(value.mediaAsset);
    if (mediaAsset) value.mediaAsset = mediaAsset;
    else delete value.mediaAsset;
  }
  if ("live2dModelUrl" in value) value.live2dModelUrl = sanitizeLive2dUrl(value.live2dModelUrl);
  if ("scale" in value) value.scale = clampNumber(value.scale, 0.05, 8, 1);
  if ("translateX" in value) value.translateX = clampInt(value.translateX, -1200, 1200, 0);
  if ("translateY" in value) value.translateY = clampInt(value.translateY, -1200, 1200, 0);
  if ("overlayOpacity" in value) value.overlayOpacity = clampNumber(value.overlayOpacity, 0, 0.85, 0);
  if ("mediaOpacity" in value) value.mediaOpacity = clampNumber(value.mediaOpacity, 0, 0.7, 0.18);
  if ("blur" in value) value.blur = clampInt(value.blur, 0, 36, 0);
  if ("shadow" in value) value.shadow = clampInt(value.shadow, 0, 64, 0);
  for (const key of ["pageRadius", "containerRadius", "itemRadius", "coverRadius", "buttonRadius", "progressRadius", "radius"]) {
    if (key in value) value[key] = clampInt(value[key], 0, key === "buttonRadius" || key === "progressRadius" ? 999 : 48, value[key]);
  }
  for (const key of ["pagePadding", "cardGap", "listGap", "itemPadding", "itemGap"]) {
    if (key in value) value[key] = clampInt(value[key], 0, 36, value[key]);
  }
  if ("itemHeight" in value) value.itemHeight = clampInt(value.itemHeight, 58, 128, 83);
  if ("songItemHeight" in value) value.songItemHeight = clampInt(value.songItemHeight, 58, 128, 83);
  if ("coverSize" in value) value.coverSize = clampInt(value.coverSize, 0, 360, 56);
  if ("animationDurationMs" in value) value.animationDurationMs = clampInt(value.animationDurationMs, 200, 5e3, 1200);
  for (const key of ["accentColor", "pageBackground", "surfaceColor", "textColor", "mutedTextColor", "backgroundColor", "playingColor", "progressColor", "buttonColor"]) {
    if (key in value) {
      const fallback = schema.defaultValue?.[key] || COLOR_FALLBACKS.accent;
      value[key] = normalizeColor(value[key], fallback);
    }
  }
  if ("density" in value) {
    value.density = ["compact", "comfortable", "airy"].includes(value.density) ? value.density : "comfortable";
  }
  if ("mediaPosition" in value) {
    value.mediaPosition = ["left center", "center center", "right center", "top center", "bottom center"].includes(value.mediaPosition) ? value.mediaPosition : "right center";
  }
  if ("mediaSize" in value) {
    value.mediaSize = ["cover", "contain", "auto"].includes(value.mediaSize) ? value.mediaSize : "contain";
  }
  if ("animationName" in value) {
    value.animationName = ["fade", "fade-scale", "rise", "soft-zoom", "none"].includes(value.animationName) ? value.animationName : "fade-scale";
  }
  if ("animationEasing" in value) {
    value.animationEasing = sanitizeString(value.animationEasing, 48) || "ease-out";
  }
  return value;
}
function createDefaultSkinThemeConfig() {
  return {
    version: SKIN_THEME_SCHEMA_VERSION,
    meta: {
      name: "TY Music Skin",
      author: "local",
      description: "Standard TY Music skin file",
      updatedAt: ""
    },
    boundaries: cloneValue(SKIN_ALLOWED_BOUNDARIES),
    targets: SKIN_TARGET_SCHEMAS.reduce((acc, schema) => {
      acc[schema.id] = cloneValue(schema.defaultValue);
      return acc;
    }, {})
  };
}
function createStandardSkinThemeTemplate() {
  const template = createDefaultSkinThemeConfig();
  template.meta = {
    name: "TY Music Skin Template",
    author: "",
    description: "Allowed editing area: CSS variables, media assets and whitelisted component visual fields only.",
    updatedAt: ""
  };
  return template;
}
function normalizeSkinThemeConfig(rawConfig) {
  const base = createDefaultSkinThemeConfig();
  const rawTargets = rawConfig?.targets && typeof rawConfig.targets === "object" ? rawConfig.targets : {};
  base.version = SKIN_THEME_SCHEMA_VERSION;
  base.meta = {
    ...base.meta,
    ...rawConfig?.meta && typeof rawConfig.meta === "object" ? rawConfig.meta : {}
  };
  base.meta.name = sanitizeString(base.meta.name, 80) || "TY Music Skin";
  base.meta.author = sanitizeString(base.meta.author, 80);
  base.meta.description = sanitizeString(base.meta.description, 240);
  base.meta.updatedAt = sanitizeString(base.meta.updatedAt, 48);
  for (const schema of SKIN_TARGET_SCHEMAS) {
    base.targets[schema.id] = normalizeTargetValue(schema, rawTargets[schema.id]);
  }
  return base;
}
function loadSkinThemeConfig() {
  try {
    const raw = localStorage.getItem(SKIN_THEME_STORAGE_KEY);
    if (!raw) return normalizeSkinThemeConfig(null);
    return normalizeSkinThemeConfig(JSON.parse(raw));
  } catch {
    return normalizeSkinThemeConfig(null);
  }
}
function saveSkinThemeConfig(nextConfig) {
  const normalized = normalizeSkinThemeConfig({
    ...nextConfig,
    meta: {
      ...nextConfig?.meta || {},
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    }
  });
  localStorage.setItem(SKIN_THEME_STORAGE_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new CustomEvent(SKIN_THEME_UPDATED_EVENT, { detail: normalized }));
  return normalized;
}
function readSkinThemeTarget(targetId) {
  const schema = findSchema(targetId);
  if (!schema) return null;
  const config = loadSkinThemeConfig();
  return normalizeTargetValue(schema, config.targets[targetId]);
}
function subscribeSkinThemeUpdates(callback) {
  const handler = (event) => {
    callback(event?.detail || loadSkinThemeConfig());
  };
  window.addEventListener(SKIN_THEME_UPDATED_EVENT, handler);
  return () => window.removeEventListener(SKIN_THEME_UPDATED_EVENT, handler);
}
function serializeSkinThemeConfig(config) {
  return JSON.stringify(normalizeSkinThemeConfig(config), null, 2);
}
function isSkinSandboxFrame() {
  if (typeof window === "undefined" || window.parent === window) return false;
  try {
    const hash = `${window.location.hash || ""}`;
    const search = `${window.location.search || ""}`;
    return /(?:\?|&)skinSandbox=1(?:&|$)/.test(hash) || /(?:\?|&)skinSandbox=1(?:&|$)/.test(search);
  } catch {
    return false;
  }
}
function loadInitialSkinThemeConfig() {
  if (isSkinSandboxFrame() && window.__TY_SKIN_SANDBOX_DRAFT_CONFIG) {
    return normalizeSkinThemeConfig(window.__TY_SKIN_SANDBOX_DRAFT_CONFIG);
  }
  return loadSkinThemeConfig();
}
function useSkinThemeConfig() {
  const config = ref(loadInitialSkinThemeConfig());
  let unsubscribe = null;
  let removeSandboxDraftListener = null;
  onMounted(() => {
    unsubscribe = subscribeSkinThemeUpdates((nextConfig) => {
      config.value = nextConfig;
    });
    if (isSkinSandboxFrame()) {
      const handleSandboxDraft = (event) => {
        config.value = normalizeSkinThemeConfig(event?.detail || window.__TY_SKIN_SANDBOX_DRAFT_CONFIG);
      };
      window.addEventListener(SKIN_SANDBOX_DRAFT_EVENT, handleSandboxDraft);
      removeSandboxDraftListener = () => window.removeEventListener(SKIN_SANDBOX_DRAFT_EVENT, handleSandboxDraft);
    }
  });
  onUnmounted(() => {
    if (typeof unsubscribe === "function") {
      unsubscribe();
      unsubscribe = null;
    }
    if (typeof removeSandboxDraftListener === "function") {
      removeSandboxDraftListener();
      removeSandboxDraftListener = null;
    }
  });
  function refreshSkinThemeConfig() {
    config.value = loadInitialSkinThemeConfig();
  }
  function useSkinTarget(targetId) {
    return computed(() => {
      const current = config.value?.targets?.[targetId];
      if (current) return current;
      return readSkinThemeTarget(targetId);
    });
  }
  return {
    skinThemeConfig: config,
    refreshSkinThemeConfig,
    useSkinTarget
  };
}
const logger$2 = createLogger("[CacheRegistry]");
const hasAndroid = (method) => typeof window !== "undefined" && window.Android && typeof window.Android[method] === "function";
const CACHE_MEDIUM = Object.freeze({
  MEMORY: "memory",
  LOCAL_STORAGE: "localStorage",
  SQLITE: "sqlite",
  SHARED_PREFS: "sharedPrefs",
  FILE: "file"
});
const CACHE_LIFECYCLE = Object.freeze({
  SESSION: "session",
  PERSISTENT: "persistent"
});
const MEMORY_PRESSURE = Object.freeze({
  LOW: "low",
  MODERATE: "moderate",
  CRITICAL: "critical"
});
const PRESSURE_THRESHOLD = {
  [MEMORY_PRESSURE.LOW]: 20,
  [MEMORY_PRESSURE.MODERATE]: 40,
  [MEMORY_PRESSURE.CRITICAL]: 1e3
};
const entries = /* @__PURE__ */ new Map();
function registerCache(entry) {
  if (!entry || !entry.id) {
    logger$2.warn("registerCache ignored: missing id");
    return () => {
    };
  }
  entries.set(entry.id, {
    id: entry.id,
    owner: entry.owner || "",
    medium: entry.medium || CACHE_MEDIUM.MEMORY,
    lifecycle: entry.lifecycle || CACHE_LIFECYCLE.SESSION,
    clearable: entry.clearable !== false,
    priority: Number.isFinite(entry.priority) ? entry.priority : 50,
    description: entry.description || "",
    getSize: typeof entry.getSize === "function" ? entry.getSize : null,
    clear: typeof entry.clear === "function" ? entry.clear : null
  });
  logger$2.log(`registered: ${entry.id}`);
  return () => entries.delete(entry.id);
}
function inventory() {
  return [...entries.values()].map((e) => {
    let size = null;
    if (e.getSize) {
      try {
        size = e.getSize();
      } catch (_) {
        size = null;
      }
    }
    return {
      id: e.id,
      owner: e.owner,
      medium: e.medium,
      lifecycle: e.lifecycle,
      clearable: e.clearable,
      priority: e.priority,
      description: e.description,
      size
    };
  });
}
function normalizeLevel(levelRaw) {
  const v = `${levelRaw ?? ""}`.toLowerCase();
  if (v === MEMORY_PRESSURE.CRITICAL || v === "complete") return MEMORY_PRESSURE.CRITICAL;
  if (v === MEMORY_PRESSURE.MODERATE) return MEMORY_PRESSURE.MODERATE;
  return MEMORY_PRESSURE.LOW;
}
function onMemoryPressure(levelRaw) {
  const level = normalizeLevel(levelRaw);
  const threshold = PRESSURE_THRESHOLD[level] ?? PRESSURE_THRESHOLD[MEMORY_PRESSURE.LOW];
  const targets = [...entries.values()].filter((e) => e.clearable && e.clear && e.priority <= threshold).sort((a, b) => a.priority - b.priority);
  let released = 0;
  for (const e of targets) {
    try {
      e.clear();
      released += 1;
    } catch (err) {
      logger$2.warn(`pressure clear failed: ${e.id}`, err);
    }
  }
  logger$2.log(`memory pressure=${level} threshold=${threshold} released=${released}`);
  return released;
}
let bridgeInstalled = false;
function installMemoryPressureBridge() {
  if (bridgeInstalled || typeof window === "undefined") return;
  bridgeInstalled = true;
  window.__tyMemoryPressure = (level) => {
    try {
      return onMemoryPressure(level);
    } catch (_) {
      return 0;
    }
  };
  window.__tyCacheInventory = () => inventory();
}
function registerCoreCaches({ cacheStore = null, loadingManager = null } = {}) {
  registerCache({
    id: "image-cache",
    owner: "imageCache",
    medium: CACHE_MEDIUM.MEMORY,
    lifecycle: CACHE_LIFECYCLE.SESSION,
    clearable: true,
    priority: 10,
    description: "封面预取内存缓存(LRU)",
    getSize: getImageCacheSize,
    clear: clearImageCache
  });
  registerCache({
    id: "thumbnail-queue",
    owner: "thumbnailLoadQueue",
    medium: CACHE_MEDIUM.MEMORY,
    lifecycle: CACHE_LIFECYCLE.SESSION,
    clearable: true,
    priority: 15,
    description: "列表缩略图就绪标记缓存",
    getSize: () => getThumbnailQueueStats().cached,
    clear: clearThumbnailCache
  });
  if (loadingManager) {
    registerCache({
      id: "loading-manager",
      owner: "LoadingManager",
      medium: CACHE_MEDIUM.MEMORY,
      lifecycle: CACHE_LIFECYCLE.SESSION,
      clearable: true,
      priority: 30,
      description: "歌单分片加载/视口缓存",
      getSize: () => Object.keys(loadingManager.playlistCache || {}).length,
      clear: () => loadingManager.clearAll()
    });
  }
  if (cacheStore) {
    registerCache({
      id: "page-state",
      owner: "CacheStore",
      medium: CACHE_MEDIUM.MEMORY,
      lifecycle: CACHE_LIFECYCLE.SESSION,
      clearable: false,
      priority: 60,
      description: "页面状态/keep-alive/搜索结果/滚动(会话内存)",
      getSize: () => Array.isArray(cacheStore.cachedViews) ? cacheStore.cachedViews.length : 0
    });
  }
  registerCache({
    id: "playback-queue",
    owner: "PlaylistStore",
    medium: hasAndroid("savePlaylistQueue") ? CACHE_MEDIUM.SQLITE : CACHE_MEDIUM.LOCAL_STORAGE,
    lifecycle: CACHE_LIFECYCLE.PERSISTENT,
    clearable: false,
    priority: 90,
    description: "播放队列(loop_list 原序 + shuffle 索引置换)"
  });
  registerCache({
    id: "player-resume",
    owner: "playerResumeCache",
    medium: hasAndroid("savePlayerResumeCache") ? CACHE_MEDIUM.SHARED_PREFS : CACHE_MEDIUM.LOCAL_STORAGE,
    lifecycle: CACHE_LIFECYCLE.PERSISTENT,
    clearable: false,
    priority: 95,
    description: "播放进度 resume 快照(currentTrack/进度/队列指纹)"
  });
  registerCache({
    id: "search-last",
    owner: "CacheStore/SearchView",
    medium: CACHE_MEDIUM.LOCAL_STORAGE,
    lifecycle: CACHE_LIFECYCLE.PERSISTENT,
    clearable: false,
    priority: 92,
    description: "最近一次搜索结果+滚动(冷启动恢复)"
  });
}
function createListMotion(getContainer) {
  const animations = /* @__PURE__ */ new Set();
  function cancel() {
    for (const animation of animations) animation.cancel();
    animations.clear();
  }
  function rows() {
    return [...getContainer()?.querySelectorAll(".content-area") || []].map((el) => el.closest("[data-row-id]")).filter(Boolean);
  }
  function capture() {
    const positions = new Map(rows().map((el) => [el.dataset.rowId, el.getBoundingClientRect().top]));
    cancel();
    return positions;
  }
  function play(positions) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const maximum = getContainer()?.clientHeight || 600;
    const moves = rows().map((el) => ({ el, delta: (positions.get(el.dataset.rowId) ?? el.getBoundingClientRect().top) - el.getBoundingClientRect().top }));
    for (const { el, delta } of moves) {
      if (Math.abs(delta) < 0.5 || Math.abs(delta) > maximum || !el.animate) continue;
      const animation = el.animate(
        [{ transform: `translateY(${delta}px)` }, { transform: "translateY(0)" }],
        { duration: 220, easing: "cubic-bezier(.2,.8,.2,1)" }
      );
      animations.add(animation);
      animation.onfinish = () => animations.delete(animation);
      animation.oncancel = () => animations.delete(animation);
    }
  }
  return { capture, play, cancel };
}
const ORDER_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ORDER_BASE = ORDER_CHARS.length;
const ORDER_INDEX = (() => {
  const map = /* @__PURE__ */ new Map();
  for (let i = 0; i < ORDER_CHARS.length; i++) map.set(ORDER_CHARS[i], i);
  return map;
})();
const MIN_CHAR = ORDER_CHARS[0];
const MAX_CHAR = ORDER_CHARS[ORDER_BASE - 1];
function isValidChar(ch) {
  return ORDER_INDEX.has(ch);
}
function normalizeOrderKey(key, minLength = 3) {
  if (key === null || key === void 0) return "";
  const raw = String(key).trim();
  if (!raw) return "".padStart(minLength, MIN_CHAR);
  let cleaned = "";
  for (const ch of raw) {
    if (!isValidChar(ch)) continue;
    cleaned += ch;
  }
  if (!cleaned) return "".padStart(minLength, MIN_CHAR);
  return cleaned;
}
function compareOrderKeysAsc(a, b, minLength = 3) {
  const ak = normalizeOrderKey(a, minLength);
  const bk = normalizeOrderKey(b, minLength);
  const min = Math.min(ak.length, bk.length);
  for (let i = 0; i < min; i++) {
    const ai = ORDER_INDEX.get(ak[i]);
    const bi = ORDER_INDEX.get(bk[i]);
    if (ai !== bi) return ai - bi;
  }
  return ak.length - bk.length;
}
function compareOrderKeysDesc(a, b, minLength = 3) {
  return -compareOrderKeysAsc(a, b, minLength);
}
function numberToOrderKey(num, minLength = 3) {
  if (!Number.isFinite(num) || num < 0) throw new Error("order num must be a non-negative number");
  let n = Math.floor(num);
  let result = "";
  do {
    result = ORDER_CHARS[n % ORDER_BASE] + result;
    n = Math.floor(n / ORDER_BASE);
  } while (n > 0);
  return result.padStart(minLength, MIN_CHAR);
}
function incrementOrderKey(key, minLength = 3, maxLength = 4) {
  const k = normalizeOrderKey(key, minLength);
  const digits = k.split("").map((ch) => ORDER_INDEX.get(ch));
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] < ORDER_BASE - 1) {
      digits[i] += 1;
      for (let j = i + 1; j < digits.length; j++) digits[j] = 0;
      return digits.map((d) => ORDER_CHARS[d]).join("");
    }
  }
  if (k.length >= maxLength) {
    throw new Error(`order key overflow: maxLength=${maxLength}`);
  }
  return k + MIN_CHAR;
}
function getOrderKeyBetweenAsc(lower, upper, minLength = 3, maxLength = 4) {
  const hasLower = lower !== null && lower !== void 0 && String(lower).trim() !== "";
  const hasUpper = upper !== null && upper !== void 0 && String(upper).trim() !== "";
  if (!hasLower && !hasUpper) {
    return MAX_CHAR.repeat(Math.min(minLength, maxLength));
  }
  if (hasLower && !hasUpper) {
    return incrementOrderKey(lower, minLength, maxLength);
  }
  const upperKey = hasUpper ? normalizeOrderKey(upper, minLength) : null;
  if (!hasLower && hasUpper) {
    const minKey = MIN_CHAR.repeat(Math.max(minLength, upperKey.length));
    return getOrderKeyBetweenAsc(minKey, upperKey, minLength, maxLength);
  }
  const lowerKey = normalizeOrderKey(lower, minLength);
  if (compareOrderKeysAsc(lowerKey, upperKey, minLength) >= 0) {
    throw new Error("lower must be < upper");
  }
  let prefix = "";
  let i = 0;
  while (true) {
    if (prefix.length >= maxLength) {
      throw new Error(`no space between order keys within maxLength=${maxLength}; rebalance required`);
    }
    const lowerDigit = i < lowerKey.length ? ORDER_INDEX.get(lowerKey[i]) : 0;
    const upperDigit = i < upperKey.length ? ORDER_INDEX.get(upperKey[i]) : ORDER_BASE - 1;
    if (lowerDigit === upperDigit) {
      prefix += ORDER_CHARS[lowerDigit];
      i++;
      continue;
    }
    if (upperDigit - lowerDigit > 1) {
      const mid = Math.floor((lowerDigit + upperDigit) / 2);
      const candidate = prefix + ORDER_CHARS[mid];
      if (candidate.length > maxLength) {
        throw new Error(`generated order key exceeds maxLength=${maxLength}; rebalance required`);
      }
      return candidate.length < minLength ? candidate.padStart(minLength, MIN_CHAR) : candidate;
    }
    prefix += ORDER_CHARS[lowerDigit];
    i++;
  }
}
function getOrderKeyBetweenDesc(prevHigher, nextLower, minLength = 3, maxLength = 4) {
  return getOrderKeyBetweenAsc(nextLower, prevHigher, minLength, maxLength);
}
function ensureQueueSortOrdersDesc(queue, minLength = 3, maxLength = 4) {
  if (!Array.isArray(queue) || queue.length === 0) return;
  const getKey = (s) => s?.order || s?.sort_order;
  const hasAny = queue.some((s) => s && getKey(s));
  if (!hasAny) {
    const max = Math.pow(ORDER_BASE, minLength) - 1;
    const step = Math.max(1, Math.floor(max / (queue.length + 1)));
    for (let i = 0; i < queue.length; i++) {
      const num = Math.max(0, max - (i + 1) * step);
      queue[i].order = numberToOrderKey(num, minLength);
      if (queue[i].sort_order !== void 0) delete queue[i].sort_order;
    }
    return;
  }
  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    if (!item) continue;
    const existingKey = getKey(item);
    if (existingKey) {
      item.order = normalizeOrderKey(existingKey, minLength);
      if (item.sort_order !== void 0) delete item.sort_order;
      continue;
    }
    const prev = i > 0 ? queue[i - 1] : null;
    let next = null;
    for (let j = i + 1; j < queue.length; j++) {
      if (getKey(queue[j])) {
        next = queue[j];
        break;
      }
    }
    const prevKey = getKey(prev) ? normalizeOrderKey(getKey(prev), minLength) : null;
    const nextKey = getKey(next) ? normalizeOrderKey(getKey(next), minLength) : null;
    let newKey;
    if (prevKey && nextKey) {
      newKey = getOrderKeyBetweenDesc(prevKey, nextKey, minLength, maxLength);
    } else if (prevKey && !nextKey) {
      newKey = getOrderKeyBetweenAsc(null, prevKey, minLength, maxLength);
    } else if (!prevKey && nextKey) {
      newKey = getOrderKeyBetweenAsc(nextKey, null, minLength, maxLength);
    } else {
      newKey = MAX_CHAR.repeat(minLength);
    }
    item.order = newKey;
    if (item.sort_order !== void 0) delete item.sort_order;
  }
}
function rebalanceQueueSortOrdersDesc(queue) {
  if (!Array.isArray(queue) || queue.length === 0) return false;
  queue.sort((a, b) => compareOrderKeysDesc(a?.order ?? a?.sort_order, b?.order ?? b?.sort_order));
  const N = queue.length;
  const { minLength, maxLength } = getOrderConstraints(N);
  for (let i = 0; i < N; i++) {
    const num = N - i;
    queue[i].order = numberToOrderKey(num, minLength);
    if (queue[i].sort_order !== void 0) delete queue[i].sort_order;
  }
  return { minLength, maxLength };
}
function getOrderConstraints(count) {
  const limit2 = Math.pow(ORDER_BASE, 2);
  const limit3 = Math.pow(ORDER_BASE, 3);
  const limit4 = Math.pow(ORDER_BASE, 4);
  if (count < limit2) return { minLength: 2, maxLength: 6 };
  if (count < limit3) return { minLength: 3, maxLength: 7 };
  if (count < limit4) return { minLength: 4, maxLength: 8 };
  return { minLength: 5, maxLength: 9 };
}
const _hoisted_1$6 = { class: "drawer-container" };
const _hoisted_2$6 = { class: "drawer-header" };
const _hoisted_3$5 = { class: "drawer-tabs" };
const _hoisted_4$4 = {
  key: 0,
  class: "playlist-content"
};
const _hoisted_5$2 = ["data-row-id"];
const _hoisted_6$2 = {
  key: 1,
  class: "empty-text"
};
const _hoisted_7$2 = {
  key: 1,
  class: "playlist-content"
};
const _hoisted_8$2 = {
  key: 1,
  class: "empty-text"
};
const _hoisted_9$2 = {
  key: 0,
  class: "fab-container"
};
const _hoisted_10$2 = {
  key: 0,
  class: "fab-menu"
};
const _hoisted_11$2 = {
  key: 0,
  class: "count-badge"
};
const _hoisted_12$2 = {
  key: 0,
  class: "playlist-input-overlay"
};
const _hoisted_13$2 = { class: "playlist-input-dialog" };
const _hoisted_14$2 = { class: "playlist-input-body" };
const _hoisted_15$2 = {
  key: 0,
  class: "playlist-list"
};
const _hoisted_16$2 = ["onClick"];
const _hoisted_17$2 = ["src", "alt"];
const _hoisted_18$2 = { class: "playlist-info" };
const _hoisted_19$2 = { class: "playlist-name" };
const _hoisted_20$2 = { class: "playlist-count" };
const _hoisted_21$2 = { class: "create-new-section" };
const _hoisted_22$2 = { class: "dialog-buttons" };
const _hoisted_23$2 = ["disabled"];
const ACTIVE_POSITION = 1;
const ITEM_HEIGHT = 83.3;
const MIN_DRAWER_UNIT_HEIGHT = 48;
const MAX_DRAWER_UNIT_HEIGHT = 220;
const DRAWER_DRAG_SCROLL_SENSITIVITY = 92;
const DRAWER_DRAG_SCROLL_SPEED = 9;
const COVER_PRELOAD_AHEAD = 8;
const COVER_PRELOAD_BEHIND = 4;
const DRAWER_QUEUE_PAGE = "playlist-drawer-queue";
const DRAWER_HISTORY_PAGE = "playlist-drawer-history";
const _sfc_main$7 = {
  __name: "PlaylistDrawer",
  setup(__props) {
    const playlistStore = usePlaylistStore();
    const playerStore = usePlayerStore$1();
    const selectionStore = useSelectionStore();
    const { useSkinTarget } = useSkinThemeConfig();
    const globalLayoutSkin = useSkinTarget("global_layout");
    const drawerSongItemSkin = useSkinTarget("drawer_song_item");
    const activeTab = ref("queue");
    const drawerContentRef = ref(null);
    const queueMotion = createListMotion(() => drawerContentRef.value);
    const historyVirtualListRef = ref(null);
    const queueRange = ref({ visibleStart: 0, visibleEnd: 0 });
    const historyRange = ref({ visibleStart: 0, visibleEnd: 0 });
    const measuredDrawerItemUnit = ref(0);
    const anchorQueueItemKeys = /* @__PURE__ */ new WeakMap();
    let anchorQueueItemKeySeed = 0;
    let pendingAnchorDragMove = null;
    const isAnchorDragging = ref(false);
    const queueDragItems = ref([]);
    const useVirtualHistory = computed(() => playlistStore.historyQueue.length > 0);
    function syncQueueDragItems() {
      if (!playerStore.showDrawer || isAnchorDragging.value) return;
      queueDragItems.value = Array.isArray(playlistStore.queue) ? playlistStore.queue.slice() : [];
    }
    watch(() => playerStore.showDrawer ? playlistStore.queue.slice() : null, syncQueueDragItems);
    const nextQueueSongId = computed(() => {
      if (!playerStore.showDrawer) return "";
      const queue = playlistStore.queue || [];
      const currentIndex = queue.findIndex((song) => getSongIdentity(song) === getCurrentPlaybackSongId());
      return getSongIdentity(queue[currentIndex + 1]);
    });
    const drawerListGap = computed(() => {
      const fallbackGap = Number(globalLayoutSkin.value?.listGap || 8);
      const defaultGap = Number.isFinite(fallbackGap) && fallbackGap >= 0 ? fallbackGap : 8;
      const rawGap = drawerSongItemSkin.value?.enabled ? Number(drawerSongItemSkin.value.listGap ?? defaultGap) : defaultGap;
      return Number.isFinite(rawGap) && rawGap >= 0 ? rawGap : defaultGap;
    });
    const baseDrawerItemHeight = computed(() => {
      const skinHeight = drawerSongItemSkin.value?.enabled ? Number(drawerSongItemSkin.value.itemHeight || ITEM_HEIGHT) : ITEM_HEIGHT;
      const baseHeight = Number.isFinite(skinHeight) && skinHeight > 0 ? skinHeight : ITEM_HEIGHT;
      return baseHeight + drawerListGap.value;
    });
    const drawerItemHeight = computed(() => {
      if (isValidDrawerUnitHeight(measuredDrawerItemUnit.value)) {
        return measuredDrawerItemUnit.value;
      }
      return baseDrawerItemHeight.value;
    });
    const drawerPreviousPage = ref(null);
    const isDrawerPresented = ref(false);
    const isDrawerContentMounted = ref(false);
    const isDrawerMediaReady = ref(false);
    let pendingMemoryRelease = false;
    let unregisterDrawerCache = null;
    let drawerMediaTimer = null;
    function releaseDrawerContent() {
      isDrawerContentMounted.value = false;
      isDrawerMediaReady.value = false;
      queueDragItems.value = [];
      pendingQueueViewportRestore = null;
      pendingMemoryRelease = false;
    }
    const hydrationRange = computed(() => ({
      start: Math.max(0, queueRange.value.visibleStart - 2),
      end: queueRange.value.visibleEnd + 2
    }));
    const drawerRenderPaused = ref(false);
    const hydratedQueueIds = useRowHydration(
      queueDragItems,
      hydrationRange,
      computed(() => isDrawerPresented.value && isDrawerContentMounted.value && !drawerRenderPaused.value),
      getSongIdentity
    );
    let drawerContentReleaseTimer = null;
    const drawerScrollFrame = createFrameScheduler(updateQueueRange);
    const drawerScrollActivity = createScrollActivity(() => drawerContentRef.value, { onPhaseChange: (phase) => {
      drawerRenderPaused.value = phase === "fast";
    } });
    let drawerOpenFrame = null;
    let pendingQueueViewportRestore = null;
    function isDrawerPage(pageId) {
      return pageId === DRAWER_QUEUE_PAGE || pageId === DRAWER_HISTORY_PAGE;
    }
    function syncDrawerCurrentPage() {
      selectionStore.setCurrentPage(activeTab.value === "history" ? DRAWER_HISTORY_PAGE : DRAWER_QUEUE_PAGE);
    }
    watch(activeTab, () => {
      if (!playerStore.showDrawer) return;
      syncDrawerCurrentPage();
    });
    const processCoverUrl2 = (data) => {
      if (!data) return "";
      let url = "";
      if (typeof data === "string") {
        url = data;
      } else if (typeof data === "object") {
        url = data.cover_user_path || data.cover || "";
      }
      return url.replace(/^http:/, "https:");
    };
    const isMenuOpen = ref(false);
    const showPlaylistDialog = ref(false);
    const newPlaylistName = ref("");
    const existingPlaylists = ref([]);
    const selectedSongIds = ref([]);
    let unregisterDrawerBackHandler = null;
    let stopDrawerQueueAutoAnimate = null;
    function handleDrawerBack() {
      if (!playerStore.showDrawer) return false;
      if (showPlaylistDialog.value) {
        closePlaylistDialog();
        return true;
      }
      if (isMenuOpen.value) {
        isMenuOpen.value = false;
        return true;
      }
      if (selectionStore.isModeActive) {
        void closeDrawer();
        return true;
      }
      void closeDrawer();
      return true;
    }
    const closeDrawer = async () => {
      if (selectionStore.isModeActive) {
        const exited = await selectionStore.exitMode(false);
        if (!exited) return;
      }
      isDrawerPresented.value = false;
      playerStore.showDrawer = false;
      isMenuOpen.value = false;
      closePlaylistDialog();
    };
    function normalizeRange(range) {
      return {
        visibleStart: range?.visibleStart || 0,
        visibleEnd: range?.visibleEnd || 0
      };
    }
    function handleHistoryRangeChange(range) {
      historyRange.value = normalizeRange(range);
    }
    function handleDrawerMeasureChange(measure) {
      acceptMeasuredDrawerItemUnit(measure?.unitHeight);
    }
    function isIndexInWindow(index, range) {
      const start = Math.max(0, (range?.visibleStart || 0) - COVER_PRELOAD_BEHIND);
      const end = Math.max(start + 1, (range?.visibleEnd || 0) + COVER_PRELOAD_AHEAD);
      return index >= start && index < end;
    }
    function shouldLoadQueueCover(index) {
      return isIndexInWindow(index, queueRange.value);
    }
    function shouldLoadHistoryCover(index) {
      if (!useVirtualHistory.value) return true;
      return isIndexInWindow(index, historyRange.value);
    }
    function getActiveScrollContainer() {
      if (activeTab.value === "history" && useVirtualHistory.value) {
        return historyVirtualListRef.value?.containerRef || null;
      }
      return drawerContentRef.value;
    }
    function getSongIdentity(song) {
      return `${song?.hash_id ?? song?.id ?? ""}`.trim();
    }
    function getCurrentPlaybackSongId() {
      return `${playerStore.currentHashId ?? playerStore.currentTrack?.hash_id ?? playerStore.currentTrack?.id ?? ""}`.trim();
    }
    function clampDrawerUnitHeight(unitHeight) {
      const baseHeight = Number(baseDrawerItemHeight.value || ITEM_HEIGHT);
      const skinAwareMax = Math.max(MAX_DRAWER_UNIT_HEIGHT, baseHeight * 1.8);
      if (!Number.isFinite(unitHeight)) return 0;
      if (unitHeight < MIN_DRAWER_UNIT_HEIGHT || unitHeight > skinAwareMax) return 0;
      return unitHeight;
    }
    function isValidDrawerUnitHeight(unitHeight) {
      return clampDrawerUnitHeight(Number(unitHeight)) > 0;
    }
    function acceptMeasuredDrawerItemUnit(rawUnitHeight) {
      const unitHeight = clampDrawerUnitHeight(Number(rawUnitHeight));
      if (unitHeight > 0) {
        measuredDrawerItemUnit.value = unitHeight;
        return unitHeight;
      }
      if (Number(rawUnitHeight) > 0) {
        measuredDrawerItemUnit.value = 0;
      }
      return 0;
    }
    function getAnchorQueueItemKey(song, absoluteIndex = 0) {
      const indexPart = Number.isFinite(Number(absoluteIndex)) ? Math.max(0, Math.trunc(Number(absoluteIndex))) : 0;
      if (!song || typeof song !== "object") return `queue-anchor-empty-${indexPart}`;
      const stableId = getSongIdentity(song);
      if (stableId) return `queue-anchor-${stableId}`;
      if (!anchorQueueItemKeys.has(song)) {
        const identity = getSongIdentity(song) || "unknown";
        anchorQueueItemKeys.set(song, `queue-anchor-${identity}-${anchorQueueItemKeySeed++}`);
      }
      return anchorQueueItemKeys.get(song);
    }
    function getQueueItemKeyForDrag(song) {
      return getAnchorQueueItemKey(song);
    }
    function updateQueueRange() {
      if (!playerStore.showDrawer || activeTab.value !== "queue") return;
      const container = drawerContentRef.value;
      const unitHeight = baseDrawerItemHeight.value;
      const visibleStart = Math.max(0, Math.floor((container?.scrollTop || 0) / unitHeight));
      const visibleCount = Math.max(1, Math.ceil((container?.clientHeight || unitHeight) / unitHeight));
      const visibleEnd = Math.min(playlistStore.queue?.length || 0, visibleStart + visibleCount);
      if (queueRange.value.visibleStart === visibleStart && queueRange.value.visibleEnd === visibleEnd) return;
      queueRange.value = {
        visibleStart,
        visibleEnd
      };
    }
    function handleDrawerScroll() {
      if (playerStore.showDrawer) drawerScrollActivity.mark();
      if (activeTab.value !== "queue") return;
      drawerScrollFrame.schedule();
    }
    function retainQueueViewportForNextMutation() {
      if (!playerStore.showDrawer || activeTab.value !== "queue") return null;
      const container = drawerContentRef.value;
      if (!container) return null;
      const retention = {
        scrollTop: Math.max(0, Number(container.scrollTop) || 0)
      };
      pendingQueueViewportRestore = retention;
      return retention;
    }
    function restoreQueueViewport(retention) {
      if (!retention || !playerStore.showDrawer || activeTab.value !== "queue") return false;
      const container = drawerContentRef.value;
      if (!container) return false;
      const maxScrollTop = Math.max(0, container.scrollHeight - container.clientHeight);
      container.scrollTop = Math.min(retention.scrollTop, maxScrollTop);
      updateQueueRange();
      return true;
    }
    async function closeMode(autoExit = false) {
      const exited = await selectionStore.exitMode(autoExit);
      if (!exited) return false;
      playlistStore.resetPriorityTask();
      isMenuOpen.value = false;
      return true;
    }
    async function handleLongPressExitSelection() {
      if (!selectionStore.isModeActive) return;
      await closeMode(false);
    }
    async function handleAction(type) {
      const selectedList = selectionStore.selectedIdsInOrder;
      if (selectedList.length === 0) {
        console.warn("鏈€夋嫨浠讳綍姝屾洸");
        return;
      }
      if (type === "addToPlaylist") {
        selectedSongIds.value = selectedList;
        await loadExistingPlaylists();
        showPlaylistDialog.value = true;
        return;
      }
      if (type === "playNext") {
        const tracks = selectedList.map((id) => playlistStore.queue?.find((s) => (s.hash_id ?? s.id) === id)).filter(Boolean);
        playlistStore.enqueuePriorityNext(tracks, {
          taskId: selectionStore.activeTaskId,
          currentHashId: playerStore.currentHashId,
          triggerSource: "manual_user",
          source: "playlist_drawer_batch_play_next"
        });
        await closeMode(true);
        return;
      }
      if (type === "delete") {
        const selectedSet = new Set((selectedList || []).map((id) => `${id || ""}`.trim()).filter(Boolean));
        if (!selectedSet.size) {
          showGlobalToast("未选择任何歌曲", { type: "warning" });
          return;
        }
        const currentQueue = Array.isArray(playlistStore.queue) ? playlistStore.queue : [];
        const currentHashId = getCurrentPlaybackSongId();
        const currentIndex = currentQueue.findIndex((song) => getSongIdentity(song) === currentHashId);
        const currentRemoved = currentIndex >= 0 && selectedSet.has(currentHashId);
        const newQueue = currentQueue.filter((song) => {
          const key = getSongIdentity(song);
          return key && !selectedSet.has(key);
        });
        if (newQueue.length === currentQueue.length) {
          showGlobalToast("未找到可删除的歌曲", { type: "warning" });
          return;
        }
        if (currentRemoved) {
          if (newQueue.length > 0) {
            const fallbackIndex = Math.min(Math.max(currentIndex, 0), newQueue.length - 1);
            const nextSong = newQueue[fallbackIndex];
            await playerStore.playTrack(nextSong, {
              triggerSource: "manual_user",
              switchReason: "drawer_batch_delete_current"
            });
          } else {
            playerStore.pause();
          }
        }
        playlistStore.setQueue(newQueue, {
          analytics: {
            eventType: "queue_remove",
            triggerSource: "manual_user",
            payload: {
              source: "drawer_batch_delete",
              removed_count: currentQueue.length - newQueue.length,
              removed_track_ids: Array.from(selectedSet)
            }
          }
        });
        showGlobalToast(`已从播放列表删除 ${currentQueue.length - newQueue.length} 首歌曲`);
        await closeMode(true);
        return;
      }
      console.group(`%c执行批量操作: ${type}`, "color: #007aff; font-weight: bold;");
      console.log("目标 ID 列表:", selectedList);
      console.groupEnd();
      await closeMode();
    }
    async function loadExistingPlaylists() {
      try {
        const response = await apiRequest("/api/playlists");
        if (response.ok) {
          const data = await response.json();
          existingPlaylists.value = (data.playlists || []).filter((p) => p.isCustom === true);
          console.log("加载歌单列表成功:", existingPlaylists.value.length);
        } else {
          console.error("加载歌单列表失败");
          existingPlaylists.value = [];
        }
      } catch (error) {
        console.error("加载歌单列表错误:", error);
        existingPlaylists.value = [];
      }
    }
    function closePlaylistDialog() {
      showPlaylistDialog.value = false;
      newPlaylistName.value = "";
      selectedSongIds.value = [];
      existingPlaylists.value = [];
    }
    async function addToExistingPlaylist(playlistId) {
      if (selectedSongIds.value.length === 0) {
        showGlobalToast("请先选择歌曲", { type: "warning" });
        return;
      }
      try {
        const payload = {
          playlistId,
          hashIds: selectedSongIds.value
        };
        console.log("发送添加到歌单请求:", payload);
        const response = await apiRequest("/api/playlist/batch-add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (response.ok) {
          const playlist = existingPlaylists.value.find((p) => p.id === playlistId);
          showGlobalToast(`已添加 ${selectedSongIds.value.length} 首歌曲到歌单《${playlist?.name || "歌单"}》`);
          closePlaylistDialog();
          await closeMode(true);
        } else {
          showGlobalToast("添加到歌单失败", { type: "error" });
        }
      } catch (error) {
        console.error("添加到歌单错误", error);
        showGlobalToast("添加到歌单出错: " + error.message, { type: "error" });
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
        const firstSongIndex = playlistStore.queue?.findIndex((song) => selectedSongIds.value.includes(song.hash_id ?? song.id));
        const firstSong = playlistStore.queue?.[firstSongIndex];
        const coverUrl = firstSong?.cover || `/api/cover/${firstSong?.id}`;
        const payload = {
          playlistName,
          coverUrl,
          songIds: selectedSongIds.value
        };
        console.log("发送创建歌单请求:", payload);
        const response = await apiRequest("/api/playlist/custom/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (response.ok) {
          showGlobalToast(`已创建歌单《${playlistName}》并添加 ${selectedSongIds.value.length} 首歌曲`);
          closePlaylistDialog();
          await closeMode(true);
        } else {
          showGlobalToast("创建歌单失败", { type: "error" });
        }
      } catch (error) {
        console.error("创建歌单错误:", error);
        showGlobalToast("创建歌单出错: " + error.message, { type: "error" });
      }
    }
    const scrollToCurrent = async () => {
      await nextTick();
      const container = getActiveScrollContainer();
      if (!container) return;
      if (activeTab.value === "queue") {
        const queue = playlistStore.queue || [];
        const currentSongId = getCurrentPlaybackSongId();
        const currentIndex = queue.findIndex((s) => getSongIdentity(s) === currentSongId);
        if (queue.length > 0) {
          await nextTick();
          if (currentIndex >= 0) {
            const unitHeight = baseDrawerItemHeight.value;
            container.scrollTop = Math.max(0, (currentIndex - ACTIVE_POSITION) * unitHeight);
          } else {
            container.scrollTop = 0;
          }
          updateQueueRange();
        }
      } else {
        container.scrollTop = 0;
        historyVirtualListRef.value?.syncScrollState?.();
      }
    };
    function cancelDrawerOpenTasks() {
      clearTimeout(drawerMediaTimer);
      if (drawerOpenFrame !== null) {
        window.cancelAnimationFrame(drawerOpenFrame);
        drawerOpenFrame = null;
      }
    }
    function presentDrawerOnNextFrame() {
      if (drawerOpenFrame !== null) {
        window.cancelAnimationFrame(drawerOpenFrame);
      }
      drawerOpenFrame = window.requestAnimationFrame(() => {
        drawerOpenFrame = null;
        if (!playerStore.showDrawer) return;
        isDrawerPresented.value = true;
        if (!isDrawerMediaReady.value) drawerMediaTimer = setTimeout(() => {
          if (playerStore.showDrawer) isDrawerMediaReady.value = true;
        }, 320);
      });
    }
    function resetDrawerQueueMeasurement() {
      measuredDrawerItemUnit.value = 0;
      queueRange.value = { visibleStart: 0, visibleEnd: 0 };
      syncQueueDragItems();
    }
    watch(() => playerStore.showDrawer, async (show) => {
      cancelDrawerOpenTasks();
      drawerScrollFrame.cancel();
      drawerScrollActivity.stop();
      clearTimeout(drawerContentReleaseTimer);
      if (!show) {
        queueMotion.cancel();
        isDrawerPresented.value = false;
        drawerContentReleaseTimer = setTimeout(() => {
          if (pendingMemoryRelease) releaseDrawerContent();
        }, 280);
        playlistStore.resetPriorityTask();
        if (isDrawerPage(selectionStore.currentPage) && drawerPreviousPage.value) {
          selectionStore.setCurrentPage(drawerPreviousPage.value);
        }
        drawerPreviousPage.value = null;
        console.log("抽屉关闭，重置优先级任务状态");
        return;
      }
      if (!isDrawerContentMounted.value) isDrawerMediaReady.value = false;
      isDrawerContentMounted.value = true;
      resetDrawerQueueMeasurement();
      const initialIndex = Math.max(0, playlistStore.queue.findIndex((song) => getSongIdentity(song) === getCurrentPlaybackSongId()) - ACTIVE_POSITION);
      queueRange.value = { visibleStart: initialIndex, visibleEnd: initialIndex + 8 };
      if (!isDrawerPage(selectionStore.currentPage)) {
        drawerPreviousPage.value = selectionStore.currentPage;
      }
      syncDrawerCurrentPage();
      await nextTick();
      if (!playerStore.showDrawer) return;
      setupDrawerQueueAutoAnimate();
      if (activeTab.value === "queue") {
        const queue = playlistStore.queue || [];
        const currentSongId = getCurrentPlaybackSongId();
        const currentIndex = queue.findIndex((s) => getSongIdentity(s) === currentSongId);
        if (currentIndex >= 0) {
          await scrollToCurrent();
          console.log("抽屉定位完成，索引:", currentIndex);
        }
      }
      presentDrawerOnNextFrame();
    });
    watch(
      () => playerStore.showDrawer ? playlistStore.queue : null,
      () => {
        if (!playerStore.showDrawer || isAnchorDragging.value) return;
        const viewportRetention = pendingQueueViewportRestore;
        pendingQueueViewportRestore = null;
        syncQueueDragItems();
        if (activeTab.value !== "queue") return;
        nextTick(() => {
          if (viewportRetention) restoreQueueViewport(viewportRetention);
          updateQueueRange();
        });
      }
    );
    watch(activeTab, () => {
      if (!playerStore.showDrawer) return;
      measuredDrawerItemUnit.value = 0;
      setupDrawerQueueAutoAnimate();
      setTimeout(() => {
        scrollToCurrent();
      }, 20);
    });
    watch(() => playerStore.currentHashId, (newHashId, oldHashId) => {
      if (!playerStore.showDrawer) return;
      if (!oldHashId || !newHashId) return;
      if (newHashId === oldHashId) return;
      playlistStore.resetPriorityTask();
      console.log("检测到抽屉内切歌，重置优先级任务状态:", oldHashId, "->", newHashId);
    }, { flush: "post" });
    onMounted(() => {
      unregisterDrawerCache = registerCache({
        id: "playlist-drawer-view",
        owner: "PlaylistDrawer",
        priority: 30,
        description: "抽屉轻量文字及有界交互行视图，不包含队列持久化数据",
        getSize: () => ({ rows: queueDragItems.value.length, complexRows: hydratedQueueIds.value.size }),
        clear: () => {
          pendingMemoryRelease = true;
          if (!playerStore.showDrawer) {
            clearTimeout(drawerContentReleaseTimer);
            drawerContentReleaseTimer = setTimeout(releaseDrawerContent, 280);
          }
        }
      });
      unregisterDrawerBackHandler = registerBackHandler(handleDrawerBack, { priority: 100 });
      setupDrawerQueueAutoAnimate();
    });
    onUnmounted(() => {
      queueMotion.cancel();
      unregisterDrawerCache?.();
      cancelDrawerOpenTasks();
      clearTimeout(drawerContentReleaseTimer);
      drawerScrollFrame.cancel();
      drawerScrollActivity.stop();
      pendingQueueViewportRestore = null;
      if (typeof unregisterDrawerBackHandler === "function") {
        unregisterDrawerBackHandler();
        unregisterDrawerBackHandler = null;
      }
      stopDrawerQueueAutoAnimate?.disable?.();
      stopDrawerQueueAutoAnimate = null;
    });
    function setupDrawerQueueAutoAnimate() {
      stopDrawerQueueAutoAnimate?.disable?.();
      stopDrawerQueueAutoAnimate = null;
    }
    function handleAnchorDragStart() {
      isAnchorDragging.value = true;
      pendingAnchorDragMove = null;
      stopDrawerQueueAutoAnimate?.disable?.();
      stopDrawerQueueAutoAnimate = null;
      if (window.navigator.vibrate) window.navigator.vibrate(10);
    }
    async function handleAnchorDragEnd(evt) {
      try {
        await commitAnchorDragMove(evt);
      } finally {
        await nextTick();
        pendingAnchorDragMove = null;
        isAnchorDragging.value = false;
        syncQueueDragItems();
        setupDrawerQueueAutoAnimate();
      }
    }
    function readDragIndex(value) {
      const index = Number(value);
      return Number.isFinite(index) ? Math.trunc(index) : -1;
    }
    function handleAnchorDragChange(evt) {
      if (!evt?.moved) return;
      pendingAnchorDragMove = {
        oldIndex: readDragIndex(evt.moved.oldIndex),
        newIndex: readDragIndex(evt.moved.newIndex)
      };
    }
    async function commitAnchorDragMove(evt) {
      const queue = Array.isArray(playlistStore.queue) ? [...playlistStore.queue] : [];
      if (!queue.length) return;
      let oldIndex = readDragIndex(evt?.oldDraggableIndex ?? evt?.oldIndex);
      let newIndex = readDragIndex(evt?.newDraggableIndex ?? evt?.newIndex);
      if (oldIndex < 0 || newIndex < 0) {
        oldIndex = readDragIndex(pendingAnchorDragMove?.oldIndex);
        newIndex = readDragIndex(pendingAnchorDragMove?.newIndex);
      }
      pendingAnchorDragMove = null;
      if (oldIndex < 0 || newIndex < 0) return;
      const absoluteOldIndex = oldIndex;
      const absoluteNewIndex = newIndex;
      if (absoluteOldIndex < 0 || absoluteOldIndex >= queue.length || absoluteNewIndex < 0 || absoluteNewIndex >= queue.length || absoluteOldIndex === absoluteNewIndex) {
        return;
      }
      const [movedSong] = queue.splice(absoluteOldIndex, 1);
      queue.splice(absoluteNewIndex, 0, movedSong);
      try {
        ensureQueueSortOrdersDesc(queue, 3, 6);
        const prev = queue[absoluteNewIndex - 1] || null;
        const next = queue[absoluteNewIndex + 1] || null;
        const prevKey = prev?.order || prev?.sort_order ? normalizeOrderKey(prev.order || prev.sort_order, 3) : null;
        const nextKey = next?.order || next?.sort_order ? normalizeOrderKey(next.order || next.sort_order, 3) : null;
        const newOrder = getOrderKeyBetweenDesc(prevKey, nextKey, 3, 8);
        movedSong.order = newOrder;
        if (movedSong.sort_order !== void 0) delete movedSong.sort_order;
      } catch (error) {
        console.warn("拖拽排序 key 空间不足，执行队列重排", error);
        rebalanceQueueSortOrdersDesc(queue);
      }
      playlistStore.setQueueInPlace(queue, {
        analytics: {
          eventType: "queue_reorder",
          triggerSource: "manual_user",
          payload: {
            source: "playlist_drawer_drag",
            moved_track_id: getSongIdentity(movedSong),
            old_index: absoluteOldIndex,
            new_index: absoluteNewIndex
          }
        }
      });
      await nextTick();
      syncQueueDragItems();
      updateQueueRange();
    }
    const handleSwipeDelete = async (song) => {
      if (!song || !playlistStore.queue) return;
      const songId = getSongIdentity(song);
      const currentIndex = playlistStore.queue.findIndex((s) => getSongIdentity(s) === songId);
      if (currentIndex === -1) {
        console.warn("歌曲不在播放列表中");
        return;
      }
      const isCurrentlyPlaying = getCurrentPlaybackSongId() === songId;
      try {
        console.log(`从播放列表删除 ${song.title}`);
        const positions = queueMotion.capture();
        const newQueue = [...playlistStore.queue];
        newQueue.splice(currentIndex, 1);
        if (isCurrentlyPlaying && newQueue.length > 0) {
          const nextSong = newQueue[Math.min(currentIndex, newQueue.length - 1)];
          console.log("切换到下一首:", nextSong.title);
          await playerStore.playTrack(nextSong, {
            triggerSource: "manual_user",
            switchReason: "track_removed_while_playing"
          });
        } else if (newQueue.length === 0) {
          playerStore.pause();
        }
        const viewportRetention = retainQueueViewportForNextMutation();
        try {
          playlistStore.setQueue(newQueue, {
            analytics: {
              eventType: "queue_remove",
              triggerSource: "manual_user",
              payload: {
                source: "swipe_delete",
                removed_track_id: songId,
                index: currentIndex
              }
            }
          });
        } catch (error) {
          if (pendingQueueViewportRestore === viewportRetention) {
            pendingQueueViewportRestore = null;
          }
          throw error;
        }
        await nextTick();
        queueMotion.play(positions);
        console.log("删除成功，剩余歌曲数:", newQueue.length);
      } catch (error) {
        console.error("删除失败:", error);
        throw error;
      }
    };
    const handleSwipeInsertNext = async (song) => {
      if (!song) return;
      try {
        console.log(`插入到下一首 ${song.title}`);
        const positions = queueMotion.capture();
        await playlistStore.enqueuePriorityNext([song], {
          taskId: "swipe-insert-next",
          currentHashId: playerStore.currentHashId,
          triggerSource: "manual_user",
          source: "swipe_insert_next"
        });
        await nextTick();
        queueMotion.play(positions);
        console.log("插入成功");
      } catch (error) {
        console.error("插入失败:", error);
        throw error;
      }
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$6, [
        createBaseVNode("div", {
          class: normalizeClass(["drawer-overlay", { active: unref(playerStore).showDrawer }]),
          onClick: closeDrawer
        }, null, 2),
        createBaseVNode("div", {
          class: normalizeClass(["playlist-drawer", { open: isDrawerPresented.value }])
        }, [
          createBaseVNode("div", _hoisted_2$6, [
            createBaseVNode("h3", null, "当前列表 (" + toDisplayString(unref(playlistStore).queue?.length ?? 0) + ")", 1),
            createBaseVNode("div", _hoisted_3$5, [
              createBaseVNode("button", {
                class: normalizeClass({ active: activeTab.value === "queue" }),
                onClick: _cache[0] || (_cache[0] = ($event) => activeTab.value = "queue")
              }, " 播放列表 ", 2),
              createBaseVNode("button", {
                class: normalizeClass({ active: activeTab.value === "history" }),
                onClick: _cache[1] || (_cache[1] = ($event) => activeTab.value = "history")
              }, " 历史播放 ", 2)
            ])
          ]),
          isDrawerContentMounted.value ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: normalizeClass(["drawer-content", { "is-drag-sorting": isAnchorDragging.value }]),
            ref_key: "drawerContentRef",
            ref: drawerContentRef,
            onScrollPassive: handleDrawerScroll
          }, [
            activeTab.value === "queue" ? (openBlock(), createElementBlock("div", _hoisted_4$4, [
              unref(playlistStore).queue && unref(playlistStore).queue.length ? (openBlock(), createBlock(unref(draggable), {
                key: 0,
                list: queueDragItems.value,
                "item-key": getQueueItemKeyForDrag,
                tag: "div",
                class: "drawer-list drawer-queue-list",
                handle: ".drag-handle",
                animation: 120,
                scroll: true,
                "scroll-sensitivity": DRAWER_DRAG_SCROLL_SENSITIVITY,
                "scroll-speed": DRAWER_DRAG_SCROLL_SPEED,
                "bubble-scroll": false,
                delay: 120,
                "delay-on-touch-only": true,
                "touch-start-threshold": 5,
                "force-fallback": false,
                "fallback-tolerance": 0,
                "fallback-on-body": false,
                disabled: unref(selectionStore).isModeActive,
                "fallback-class": "sortable-fallback",
                "ghost-class": "sortable-ghost",
                "drag-class": "sortable-drag",
                "chosen-class": "sortable-chosen",
                onStart: handleAnchorDragStart,
                onEnd: handleAnchorDragEnd,
                onChange: handleAnchorDragChange
              }, {
                item: withCtx(({ element: song, index }) => [
                  createBaseVNode("div", {
                    class: "drawer-row-anchor",
                    "data-row-id": getSongIdentity(song),
                    style: normalizeStyle({ height: baseDrawerItemHeight.value - drawerListGap.value + "px" })
                  }, [
                    createVNode(SongItem, {
                      "render-details": isAnchorDragging.value || unref(hydratedQueueIds).has(getSongIdentity(song)),
                      song,
                      index,
                      "show-drag-handle": true,
                      "can-load-cover": isDrawerMediaReady.value && !drawerRenderPaused.value && shouldLoadQueueCover(index),
                      "enable-swipe-delete": true,
                      "on-delete": handleSwipeDelete,
                      "enable-swipe-insert": true,
                      "is-next-in-queue": getSongIdentity(song) === nextQueueSongId.value,
                      "on-insert-next": handleSwipeInsertNext,
                      "on-long-press-while-selecting": handleLongPressExitSelection
                    }, null, 8, ["render-details", "song", "index", "can-load-cover", "is-next-in-queue"])
                  ], 12, _hoisted_5$2)
                ]),
                _: 1
              }, 8, ["list", "disabled"])) : (openBlock(), createElementBlock("div", _hoisted_6$2, "列表为空"))
            ])) : createCommentVNode("", true),
            activeTab.value === "history" ? (openBlock(), createElementBlock("div", _hoisted_7$2, [
              unref(playlistStore).historyQueue.length ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                useVirtualHistory.value ? (openBlock(), createBlock(VirtualList, {
                  key: 0,
                  ref_key: "historyVirtualListRef",
                  ref: historyVirtualListRef,
                  items: unref(playlistStore).historyQueue,
                  "retain-text": "",
                  "stable-content": "",
                  "item-height": drawerItemHeight.value,
                  buffer: 2,
                  "measure-on-scroll": true,
                  class: "drawer-list drawer-virtual-list",
                  onRangeChange: handleHistoryRangeChange,
                  onMeasureChange: handleDrawerMeasureChange
                }, {
                  default: withCtx(({ item: song, index, active, canLoadMedia }) => [
                    createVNode(SongItem, {
                      song,
                      index,
                      "show-drag-handle": false,
                      "render-details": active,
                      "can-load-cover": isDrawerMediaReady.value && canLoadMedia && shouldLoadHistoryCover(index),
                      "on-long-press-while-selecting": handleLongPressExitSelection
                    }, null, 8, ["song", "index", "render-details", "can-load-cover"])
                  ]),
                  _: 1
                }, 8, ["items", "item-height"])) : createCommentVNode("", true)
              ], 64)) : (openBlock(), createElementBlock("div", _hoisted_8$2, "暂无历史播放记录"))
            ])) : createCommentVNode("", true)
          ], 34)) : createCommentVNode("", true)
        ], 2),
        createVNode(Transition, { name: "fade" }, {
          default: withCtx(() => [
            unref(selectionStore).isModeActive && unref(playerStore).showDrawer ? (openBlock(), createElementBlock("div", _hoisted_9$2, [
              createVNode(Transition, { name: "slide-up" }, {
                default: withCtx(() => [
                  isMenuOpen.value ? (openBlock(), createElementBlock("div", _hoisted_10$2, [
                    activeTab.value === "queue" ? (openBlock(), createElementBlock("div", {
                      key: 0,
                      class: "menu-item delete danger-soft",
                      onClick: _cache[2] || (_cache[2] = ($event) => handleAction("delete"))
                    }, "删除")) : createCommentVNode("", true),
                    createBaseVNode("div", {
                      class: "menu-item",
                      onClick: _cache[3] || (_cache[3] = ($event) => handleAction("playNext"))
                    }, "优先播放"),
                    createBaseVNode("div", {
                      class: "menu-item",
                      onClick: _cache[4] || (_cache[4] = ($event) => handleAction("addToPlaylist"))
                    }, "收藏到歌单"),
                    _cache[7] || (_cache[7] = createBaseVNode("div", { class: "menu-divider" }, null, -1)),
                    createBaseVNode("div", {
                      class: "menu-item cancel",
                      onClick: closeMode
                    }, "退出选择")
                  ])) : createCommentVNode("", true)
                ]),
                _: 1
              }),
              createBaseVNode("button", {
                class: "fab-main-btn",
                onClick: _cache[5] || (_cache[5] = ($event) => isMenuOpen.value = !isMenuOpen.value)
              }, [
                unref(selectionStore).selectedIds.size > 0 ? (openBlock(), createElementBlock("span", _hoisted_11$2, toDisplayString(unref(selectionStore).selectedIds.size), 1)) : createCommentVNode("", true),
                _cache[8] || (_cache[8] = createBaseVNode("svg", {
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
            showPlaylistDialog.value ? (openBlock(), createElementBlock("div", _hoisted_12$2, [
              createBaseVNode("div", _hoisted_13$2, [
                _cache[10] || (_cache[10] = createBaseVNode("h3", null, "收藏到歌单", -1)),
                createBaseVNode("div", _hoisted_14$2, [
                  existingPlaylists.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_15$2, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(existingPlaylists.value, (pl) => {
                      return openBlock(), createElementBlock("div", {
                        key: pl.id,
                        class: "playlist-item",
                        onClick: ($event) => addToExistingPlaylist(pl.id)
                      }, [
                        createBaseVNode("img", {
                          src: processCoverUrl2(pl.cover),
                          alt: pl.name,
                          class: "playlist-cover"
                        }, null, 8, _hoisted_17$2),
                        createBaseVNode("div", _hoisted_18$2, [
                          createBaseVNode("p", _hoisted_19$2, toDisplayString(pl.name), 1),
                          createBaseVNode("p", _hoisted_20$2, toDisplayString(pl.count) + " 首", 1)
                        ])
                      ], 8, _hoisted_16$2);
                    }), 128))
                  ])) : createCommentVNode("", true),
                  createBaseVNode("div", _hoisted_21$2, [
                    _cache[9] || (_cache[9] = createBaseVNode("p", { class: "create-label" }, "或创建新歌单", -1)),
                    withDirectives(createBaseVNode("input", {
                      "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => newPlaylistName.value = $event),
                      type: "text",
                      placeholder: "请输入歌单名称",
                      maxlength: "30",
                      onKeyup: withKeys(createNewPlaylist, ["enter"])
                    }, null, 544), [
                      [vModelText, newPlaylistName.value]
                    ])
                  ])
                ]),
                createBaseVNode("div", _hoisted_22$2, [
                  createBaseVNode("button", {
                    class: "btn-cancel",
                    onClick: closePlaylistDialog
                  }, "取消"),
                  createBaseVNode("button", {
                    class: "btn-confirm",
                    onClick: createNewPlaylist,
                    disabled: !newPlaylistName.value.trim()
                  }, "创建", 8, _hoisted_23$2)
                ])
              ])
            ])) : createCommentVNode("", true)
          ]),
          _: 1
        })
      ]);
    };
  }
};
const PlaylistDrawer = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-b9459b71"]]);
const useToastStore = defineStore("toast", {
  state: () => ({
    visible: false,
    message: "",
    type: "success",
    // 'success' | 'error' | 'warning' | 'info'
    duration: 2e3
  }),
  actions: {
    /**
     * 显示 Toast
     * @param {string} message - 提示消息
     * @param {Object} options - 配置选项
     * @param {string} options.type - 类型 ('success' | 'error' | 'warning' | 'info')
     * @param {number} options.duration - 显示时长（毫秒）
     */
    show(message, options = {}) {
      this.message = message;
      this.type = options.type || "success";
      this.duration = options.duration || 2e3;
      this.visible = true;
      setTimeout(() => {
        this.hide();
      }, this.duration);
    },
    /**
     * 隐藏 Toast
     */
    hide() {
      this.visible = false;
    }
  }
});
const _hoisted_1$5 = { class: "toast-content" };
const _hoisted_2$5 = { class: "toast-message" };
const _sfc_main$6 = {
  __name: "Toast",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: "操作成功"
    },
    duration: {
      type: Number,
      default: 2e3
    },
    type: {
      type: String,
      default: "success",
      validator: (value) => ["success", "error", "warning", "info"].includes(value)
    }
  },
  emits: ["hide"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const isVisible = ref(false);
    let hideTimer = null;
    watch(() => props.visible, (newVal) => {
      if (newVal) {
        isVisible.value = true;
        if (hideTimer) {
          clearTimeout(hideTimer);
        }
        hideTimer = setTimeout(() => {
          isVisible.value = false;
          emit("hide");
        }, props.duration);
      } else {
        isVisible.value = false;
        if (hideTimer) {
          clearTimeout(hideTimer);
        }
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Transition, { name: "toast-fade" }, {
        default: withCtx(() => [
          isVisible.value ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: normalizeClass(["toast-container", props.type])
          }, [
            createBaseVNode("div", _hoisted_1$5, [
              _cache[0] || (_cache[0] = createBaseVNode("span", { class: "toast-icon spinner" }, null, -1)),
              createBaseVNode("span", _hoisted_2$5, toDisplayString(__props.message), 1)
            ])
          ], 2)) : createCommentVNode("", true)
        ]),
        _: 1
      });
    };
  }
};
const Toast = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-395768a5"]]);
const _sfc_main$5 = {
  __name: "GlobalToast",
  setup(__props) {
    const toastStore = useToastStore();
    function handleGlobalToast(event) {
      const { message, type, duration } = event.detail;
      toastStore.show(message, { type, duration });
    }
    onMounted(() => {
      window.addEventListener("global-toast", handleGlobalToast);
    });
    onBeforeUnmount(() => {
      window.removeEventListener("global-toast", handleGlobalToast);
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Toast, {
        visible: unref(toastStore).visible,
        message: unref(toastStore).message,
        duration: unref(toastStore).duration,
        type: unref(toastStore).type,
        onHide: _cache[0] || (_cache[0] = ($event) => unref(toastStore).hide())
      }, null, 8, ["visible", "message", "duration", "type"]);
    };
  }
};
const _hoisted_1$4 = { class: "confirm-title" };
const _hoisted_2$4 = { class: "confirm-message" };
const _hoisted_3$4 = { class: "confirm-actions" };
const _sfc_main$4 = {
  __name: "GlobalConfirm",
  setup(__props) {
    const defaults = {
      id: "",
      title: "确认操作",
      message: "",
      confirmText: "确认",
      cancelText: "取消",
      danger: false
    };
    const visible = ref(false);
    const current = ref({ ...defaults });
    const queue = [];
    let unregisterConfirmBackHandler = null;
    function openConfirm(detail = {}) {
      const payload = {
        ...defaults,
        ...detail
      };
      if (visible.value) {
        queue.push(payload);
        return;
      }
      current.value = payload;
      visible.value = true;
    }
    function flushNext() {
      if (queue.length <= 0) {
        current.value = { ...defaults };
        return;
      }
      const next = queue.shift();
      requestAnimationFrame(() => {
        openConfirm(next);
      });
    }
    function finish(confirmed) {
      const id = current.value.id;
      visible.value = false;
      if (id) {
        resolveGlobalConfirm(id, confirmed);
      }
      flushNext();
    }
    function handleConfirm() {
      finish(true);
    }
    function handleCancel() {
      finish(false);
    }
    function handleGlobalConfirm(event) {
      openConfirm(event?.detail || {});
    }
    function handleEscape(event) {
      if (event.key !== "Escape" || !visible.value) return;
      handleCancel();
    }
    onMounted(() => {
      window.addEventListener("global-confirm", handleGlobalConfirm);
      window.addEventListener("keydown", handleEscape);
      unregisterConfirmBackHandler = registerBackHandler(() => {
        if (!visible.value) return false;
        handleCancel();
        return true;
      }, { priority: 300 });
    });
    onBeforeUnmount(() => {
      window.removeEventListener("global-confirm", handleGlobalConfirm);
      window.removeEventListener("keydown", handleEscape);
      unregisterConfirmBackHandler?.();
      unregisterConfirmBackHandler = null;
      if (current.value.id) {
        resolveGlobalConfirm(current.value.id, false);
      }
      while (queue.length > 0) {
        const item = queue.shift();
        if (item?.id) {
          resolveGlobalConfirm(item.id, false);
        }
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Transition, { name: "confirm-fade" }, {
        default: withCtx(() => [
          visible.value ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: "confirm-overlay",
            onClick: handleCancel
          }, [
            createBaseVNode("div", {
              class: "confirm-dialog",
              onClick: _cache[0] || (_cache[0] = withModifiers(() => {
              }, ["stop"]))
            }, [
              createBaseVNode("h3", _hoisted_1$4, toDisplayString(current.value.title), 1),
              createBaseVNode("p", _hoisted_2$4, toDisplayString(current.value.message), 1),
              createBaseVNode("div", _hoisted_3$4, [
                createBaseVNode("button", {
                  class: "confirm-btn cancel",
                  onClick: handleCancel
                }, toDisplayString(current.value.cancelText), 1),
                createBaseVNode("button", {
                  class: normalizeClass(["confirm-btn confirm", { danger: current.value.danger }]),
                  onClick: handleConfirm
                }, toDisplayString(current.value.confirmText), 3)
              ])
            ])
          ])) : createCommentVNode("", true)
        ]),
        _: 1
      });
    };
  }
};
const GlobalConfirm = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-e21f79fc"]]);
const useLoadingManager = defineStore("loadingManager", {
  state: () => ({
    // 数据缓存
    playlistCache: {},
    // 当前可见区域信息
    viewportInfo: {
      playlistId: null,
      startIndex: 0,
      endIndex: 0,
      visibleCount: 0
    },
    // 加载优先级配置
    config: {
      preloadAbove: 10,
      // 上方预加载条数
      preloadBelow: 20,
      // 下方预加载条数（用户要求预渲染20首）
      nearPlayingTrack: {
        before: 5,
        // 正在播放歌曲前5条
        after: 10
        // 正在播放歌曲后10条
      }
    },
    // 任务管理
    activePlaylistId: null,
    // 当前正在查看的歌单 ID
    abortControllers: {},
    // { playlistId: AbortController }
    loadingTasks: {},
    // 跟踪正在进行的加载任务
    audioLoadQueue: [],
    // 音频加载队列 [{ priority, index, trackId, playlistId }]
    isProcessingAudioQueue: false
  }),
  getters: {
    // 获取应该加载的索引范围
    shouldLoadIndexes: (state) => (playlistId, allDataLength) => {
      const viewport = state.viewportInfo;
      const result = /* @__PURE__ */ new Set();
      for (let i = viewport.startIndex; i <= viewport.endIndex; i++) {
        result.add(i);
      }
      const aboveStart = Math.max(0, viewport.startIndex - state.config.preloadAbove);
      for (let i = aboveStart; i < viewport.startIndex; i++) {
        result.add(i);
      }
      const belowEnd = Math.min(allDataLength - 1, viewport.endIndex + state.config.preloadBelow);
      for (let i = viewport.endIndex + 1; i <= belowEnd; i++) {
        result.add(i);
      }
      return Array.from(result).sort((a, b) => a - b);
    },
    // 获取正在播放歌曲周围的索引
    playingTrackNearbyIndexes: (state) => (playlistId, allData) => {
      const playerStore = usePlayerStore$1();
      if (!playerStore.currentTrack) return [];
      const currentTrackId = playerStore.currentTrack.id;
      const currentIndex = allData.findIndex((song) => song.id === currentTrackId);
      if (currentIndex === -1) return [];
      const result = /* @__PURE__ */ new Set();
      const { before, after } = state.config.nearPlayingTrack;
      const beforeStart = Math.max(0, currentIndex - before);
      for (let i = beforeStart; i < currentIndex; i++) {
        result.add(i);
      }
      const afterEnd = Math.min(allData.length - 1, currentIndex + after);
      for (let i = currentIndex + 1; i <= afterEnd; i++) {
        result.add(i);
      }
      return Array.from(result).sort((a, b) => a - b);
    }
  },
  actions: {
    /**
     * 初始化播放列表缓存
     */
    initPlaylist(playlistId, allData) {
      this.activePlaylistId = playlistId;
      if (!this.playlistCache[playlistId]) {
        this.playlistCache[playlistId] = {
          allData: [...allData],
          textLoaded: /* @__PURE__ */ new Set(),
          coverLoaded: /* @__PURE__ */ new Set(),
          audioLoaded: /* @__PURE__ */ new Set()
        };
      }
      if (!this.abortControllers[playlistId]) {
        this.abortControllers[playlistId] = new AbortController();
      }
      if (!this.loadingTasks[playlistId]) {
        this.loadingTasks[playlistId] = {
          textLoading: null,
          coverLoading: null
        };
      }
    },
    /**
     * 更新视口信息（用户滚动时调用）
     * 视口变化时中断旧任务，启动新任务
     */
    updateViewport(startIndex, endIndex, visibleCount, playlistId) {
      const previous = this.viewportInfo;
      if (previous.playlistId === playlistId && previous.startIndex === startIndex && previous.endIndex === endIndex && previous.visibleCount === visibleCount) return false;
      this.viewportInfo = { startIndex, endIndex, visibleCount, playlistId };
      this.abortPreviousTasks(playlistId);
      return true;
    },
    /**
     * 中断之前的加载任务
     */
    abortPreviousTasks(playlistId) {
      if (this.abortControllers[playlistId]) {
        this.abortControllers[playlistId].abort();
        this.abortControllers[playlistId] = new AbortController();
      }
    },
    /**
     * 标记文本数据已加载
     */
    markTextLoaded(playlistId, indexes) {
      if (!this.playlistCache[playlistId]) return;
      indexes.forEach((idx) => this.playlistCache[playlistId].textLoaded.add(idx));
    },
    /**
     * 标记封面已加载
     */
    markCoverLoaded(playlistId, index) {
      if (!this.playlistCache[playlistId]) return;
      this.playlistCache[playlistId].coverLoaded.add(index);
    },
    /**
     * 标记音频已加载
     */
    markAudioLoaded(playlistId, index) {
      if (!this.playlistCache[playlistId]) return;
      this.playlistCache[playlistId].audioLoaded.add(index);
    },
    /**
     * 获取需要加载的文本数据
     */
    getTextToLoad(playlistId) {
      const cache = this.playlistCache[playlistId];
      if (!cache) return [];
      const shouldLoad = this.shouldLoadIndexes(playlistId, cache.allData.length);
      return Array.from(shouldLoad).filter((idx) => !cache.textLoaded.has(idx)).map((idx) => ({ index: idx, data: cache.allData[idx] }));
    },
    /**
     * 获取需要加载的封面
     */
    getCoverToLoad(playlistId) {
      const cache = this.playlistCache[playlistId];
      if (!cache) return [];
      const shouldLoad = this.shouldLoadIndexes(playlistId, cache.allData.length);
      const toLoad = Array.from(shouldLoad).filter((idx) => !cache.coverLoaded.has(idx) && cache.allData[idx]).map((idx) => ({ index: idx, data: cache.allData[idx] }));
      toLoad.sort((a, b) => a.index - b.index);
      return toLoad;
    },
    /**
     * 添加音频加载任务到队列
     * priority: 优先级，数值越小越优先 (0=后5条, 1=前2条, 2=用户点击)
     */
    addAudioLoadTask(playlistId, index, trackId, priority = 2) {
      return;
    },
    /**
     * 预加载正在播放歌曲周围的音频
     */
    preloadPlayingTrackAudio(playlistId) {
      return;
    },
    /**
     * 处理音频加载队列
     */
    async processAudioLoadQueue() {
      if (this.isProcessingAudioQueue || this.audioLoadQueue.length === 0) return;
      this.isProcessingAudioQueue = true;
      while (this.audioLoadQueue.length > 0) {
        const task = this.audioLoadQueue.shift();
        const { playlistId, index, trackId } = task;
        if (this.abortControllers[playlistId]?.signal.aborted) {
          continue;
        }
        try {
          await this.loadAudio(playlistId, index, trackId);
        } catch (err) {
          if (err.name !== "AbortError") {
            console.warn(`Audio preload failed for ${trackId}:`, err);
          }
        }
      }
      this.isProcessingAudioQueue = false;
    },
    /**
     * 实际加载音频
     */
    async loadAudio(playlistId, index, trackId) {
      return new Promise((resolve, reject) => {
        const audioUrl = `/api/stream/${trackId}/audio.m3u8`;
        const audio = new Audio();
        let settled = false;
        const signal = this.abortControllers[playlistId]?.signal;
        const cleanup = () => {
          audio.onloadedmetadata = null;
          audio.onerror = null;
          audio.pause();
          audio.removeAttribute("src");
          try {
            audio.load();
          } catch (_) {
          }
        };
        const settle = (callback) => {
          if (settled) return;
          settled = true;
          signal?.removeEventListener("abort", handleAbort);
          cleanup();
          callback();
        };
        if (signal?.aborted) {
          reject(new DOMException("Aborted", "AbortError"));
          return;
        }
        const handleAbort = () => {
          settle(() => reject(new DOMException("Aborted", "AbortError")));
        };
        signal?.addEventListener("abort", handleAbort);
        audio.preload = "metadata";
        audio.onloadedmetadata = () => {
          settle(() => {
            this.markAudioLoaded(playlistId, index);
            resolve();
          });
        };
        audio.onerror = () => {
          settle(() => {
            this.markAudioLoaded(playlistId, index);
            reject(new Error(`Failed to load: ${audioUrl}`));
          });
        };
        audio.src = audioUrl;
      });
    },
    /**
     * 清除缓存
     */
    clearPlaylistCache(playlistId) {
      this.abortControllers[playlistId]?.abort();
      delete this.playlistCache[playlistId];
      delete this.abortControllers[playlistId];
      delete this.loadingTasks[playlistId];
      this.audioLoadQueue = this.audioLoadQueue.filter(
        (task) => task.playlistId !== playlistId
      );
    },
    /**
     * 清除所有缓存
     */
    clearAll() {
      Object.values(this.abortControllers).forEach((controller) => controller?.abort());
      this.playlistCache = {};
      this.abortControllers = {};
      this.loadingTasks = {};
      this.audioLoadQueue = [];
      this.isProcessingAudioQueue = false;
    }
  }
});
const SKIN_ASSET_SCHEME = "skin-asset://";
const DB_NAME = "ty_skin_media_assets_v1";
const DB_VERSION = 1;
const STORE_NAME = "assets";
const objectUrlCache = /* @__PURE__ */ new Map();
let dbPromise = null;
function createSkinAssetId() {
  const randomPart = Math.random().toString(36).slice(2, 10);
  return `${Date.now().toString(36)}-${randomPart}`;
}
function openSkinMediaDb() {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("IndexedDB is not available in this environment."));
  }
  if (dbPromise) return dbPromise;
  let settled = false;
  let blocked = false;
  let openedPromise;
  openedPromise = new Promise((resolve, reject) => {
    const fail = (error) => {
      if (settled) return;
      settled = true;
      if (dbPromise === openedPromise) dbPromise = null;
      reject(error);
    };
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("updatedAt", "updatedAt");
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      if (blocked) {
        db.close();
        return;
      }
      db.onversionchange = () => {
        db.close();
        if (dbPromise === openedPromise) dbPromise = null;
      };
      db.onclose = () => {
        if (dbPromise === openedPromise) dbPromise = null;
      };
      if (!settled) {
        settled = true;
        resolve(db);
      }
    };
    request.onerror = () => fail(request.error || new Error("Failed to open skin media asset database."));
    request.onblocked = () => {
      blocked = true;
      fail(new Error("Skin media asset database is blocked by another tab."));
    };
  });
  dbPromise = openedPromise;
  return openedPromise;
}
function resetSkinMediaDbConnection(db) {
  const currentPromise = dbPromise;
  if (!currentPromise) return;
  currentPromise.then((currentDb) => {
    if (currentDb !== db) return;
    dbPromise = null;
    db.close();
  }, () => {
    if (dbPromise === currentPromise) dbPromise = null;
  });
}
function withAssetStore(mode, callback) {
  return openSkinMediaDb().then((db) => new Promise((resolve, reject) => {
    let tx;
    let result;
    try {
      tx = db.transaction(STORE_NAME, mode);
    } catch (error) {
      resetSkinMediaDbConnection(db);
      reject(error);
      return;
    }
    const store = tx.objectStore(STORE_NAME);
    tx.oncomplete = () => resolve(result);
    tx.onerror = () => {
      resetSkinMediaDbConnection(db);
      reject(tx.error || new Error("Skin media asset transaction failed."));
    };
    tx.onabort = () => {
      resetSkinMediaDbConnection(db);
      reject(tx.error || new Error("Skin media asset transaction aborted."));
    };
    try {
      result = callback(store);
    } catch (error) {
      tx.abort();
      reject(error);
    }
  }));
}
function readImageDimensions(fileUrl) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve({
      width: image.naturalWidth || 0,
      height: image.naturalHeight || 0
    });
    image.onerror = () => resolve({ width: 0, height: 0 });
    image.decoding = "async";
    image.src = fileUrl;
  });
}
function readVideoDimensions(fileUrl) {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      resolve({
        width: video.videoWidth || 0,
        height: video.videoHeight || 0
      });
    };
    const timer = window.setTimeout(finish, 5e3);
    video.preload = "metadata";
    video.muted = true;
    video.onloadedmetadata = () => {
      window.clearTimeout(timer);
      finish();
    };
    video.onerror = () => {
      window.clearTimeout(timer);
      finish();
    };
    video.src = fileUrl;
  });
}
async function readMediaDimensions(file) {
  if (typeof URL === "undefined" || !URL.createObjectURL || typeof document === "undefined") {
    return { width: 0, height: 0 };
  }
  const url = URL.createObjectURL(file);
  try {
    if (file.type?.startsWith("video/")) {
      return await readVideoDimensions(url);
    }
    return await readImageDimensions(url);
  } finally {
    URL.revokeObjectURL(url);
  }
}
function isSkinAssetUrl(src) {
  return `${src || ""}`.startsWith(SKIN_ASSET_SCHEME);
}
function getSkinAssetId(src) {
  if (!isSkinAssetUrl(src)) return "";
  return `${src || ""}`.slice(SKIN_ASSET_SCHEME.length).replace(/^\/+/, "").trim();
}
async function saveSkinMediaFile(file) {
  const isFile = typeof File !== "undefined" && file instanceof File;
  const isBlob = typeof Blob !== "undefined" && file instanceof Blob;
  if (!isFile && !isBlob) {
    throw new Error("Invalid skin media file.");
  }
  const id = createSkinAssetId();
  const now2 = (/* @__PURE__ */ new Date()).toISOString();
  const dimensions = await readMediaDimensions(file);
  const type = file.type || "application/octet-stream";
  const name = file.name || `skin-media-${id}`;
  const mediaType = type.startsWith("video/") ? "video" : "image";
  const record = {
    id,
    blob: file,
    name,
    type,
    size: Number(file.size || 0),
    width: Number(dimensions.width || 0),
    height: Number(dimensions.height || 0),
    updatedAt: now2
  };
  await withAssetStore("readwrite", (store) => {
    store.put(record);
  });
  return {
    mediaSrc: `${SKIN_ASSET_SCHEME}${id}`,
    mediaType,
    mediaAsset: {
      id,
      name,
      type,
      size: record.size,
      width: record.width,
      height: record.height,
      updatedAt: now2
    }
  };
}
async function getSkinMediaAssetRecord(srcOrId) {
  const id = isSkinAssetUrl(srcOrId) ? getSkinAssetId(srcOrId) : `${srcOrId || ""}`.trim();
  if (!id) return null;
  const request = await withAssetStore("readonly", (store) => store.get(id));
  return request?.result || null;
}
async function resolveSkinMediaSrc(src) {
  const raw = `${src || ""}`.trim();
  if (!raw || !isSkinAssetUrl(raw)) return raw;
  if (objectUrlCache.has(raw)) return objectUrlCache.get(raw);
  let record = null;
  let lastError = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      record = await getSkinMediaAssetRecord(raw);
      lastError = null;
      break;
    } catch (error) {
      lastError = error;
      if (attempt < 2) {
        await new Promise((resolve) => window.setTimeout(resolve, 120 * (attempt + 1)));
      }
    }
  }
  if (lastError) throw lastError;
  const blob = record?.blob;
  if (!blob || typeof URL === "undefined" || !URL.createObjectURL) return "";
  const objectUrl = URL.createObjectURL(blob);
  objectUrlCache.set(raw, objectUrl);
  return objectUrl;
}
function useResolvedSkinMediaSrc(source) {
  const resolvedSrc = ref("");
  let requestId = 0;
  let stopped = false;
  const stop = watch(
    () => unref(source),
    async (nextSrc) => {
      const currentRequest = ++requestId;
      const raw = `${nextSrc || ""}`.trim();
      if (!raw) {
        resolvedSrc.value = "";
        return;
      }
      try {
        const resolved = await resolveSkinMediaSrc(raw);
        if (!stopped && currentRequest === requestId) {
          resolvedSrc.value = resolved || "";
        }
      } catch (error) {
        if (!stopped && currentRequest === requestId) {
          console.warn("Failed to resolve skin media source:", error);
          resolvedSrc.value = "";
        }
      }
    },
    { immediate: true }
  );
  onUnmounted(() => {
    stopped = true;
    stop();
  });
  return resolvedSrc;
}
function normalizeSkinMediaFit(value, fallback = "contain") {
  const raw = `${value || ""}`.trim().toLowerCase();
  if (raw === "cover" || raw === "contain") return raw;
  return fallback === "cover" ? "cover" : "contain";
}
function getSkinMediaScale(target, fallback = 1) {
  const scale = Number(target?.scale);
  if (!Number.isFinite(scale)) return fallback;
  return Math.max(0.05, Math.min(8, scale));
}
function getSkinMediaTranslate(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return 0;
  return Math.round(Math.max(-1200, Math.min(1200, num)));
}
function getSkinMediaFitScale(mediaWidth, mediaHeight, viewportWidth, viewportHeight, fit = "contain") {
  if (![mediaWidth, mediaHeight, viewportWidth, viewportHeight].every((value) => Number.isFinite(value) && value > 0)) return 1;
  return (fit === "cover" ? Math.max : Math.min)(viewportWidth / mediaWidth, viewportHeight / mediaHeight);
}
function skinTransformToCropper(transform, baseMatrix, viewportScale) {
  const fitScale = Math.hypot(baseMatrix[0], baseMatrix[1]) || 1;
  return [
    ...transform.slice(0, 4).map((value) => Number(value) * fitScale),
    baseMatrix[4] + Number(transform[4] || 0) * viewportScale.x,
    baseMatrix[5] + Number(transform[5] || 0) * viewportScale.y
  ];
}
function cropperTransformToSkin(transform, baseMatrix, viewportScale) {
  const fitScale = Math.hypot(baseMatrix[0], baseMatrix[1]) || 1;
  return [
    ...transform.slice(0, 4).map((value) => Number(value) / fitScale),
    (Number(transform[4]) - baseMatrix[4]) / viewportScale.x,
    (Number(transform[5]) - baseMatrix[5]) / viewportScale.y
  ];
}
function buildSkinMediaElementStyle(target = {}, options = {}) {
  const {
    defaultFit = "contain",
    enabledOnly = false,
    includeSizing = true
  } = options;
  if (enabledOnly && !target?.enabled) return {};
  const tx = getSkinMediaTranslate(target?.translateX);
  const ty = getSkinMediaTranslate(target?.translateY);
  const scale = getSkinMediaScale(target);
  const style = {
    objectFit: normalizeSkinMediaFit(target?.mediaFit, defaultFit),
    objectPosition: "center center",
    transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
    transformOrigin: "center center"
  };
  if (includeSizing) {
    style.width = "100%";
    style.height = "100%";
    style.maxWidth = "none";
    style.maxHeight = "none";
  }
  return style;
}
function scheduleViewWarmup(loaders, isBusy) {
  let disposed = false;
  let timer = null;
  let idle = null;
  let index = 0;
  const schedule2 = () => {
    if (disposed || index >= loaders.length) return;
    timer = setTimeout(() => {
      timer = null;
      if (document.hidden || isBusy()) {
        schedule2();
        return;
      }
      const run = async () => {
        idle = null;
        if (disposed || document.hidden || isBusy()) {
          schedule2();
          return;
        }
        try {
          await loaders[index++]();
        } catch {
        }
        schedule2();
      };
      if (window.requestIdleCallback) idle = requestIdleCallback(run);
      else timer = setTimeout(run, 100);
    }, 1800);
  };
  schedule2();
  return () => {
    disposed = true;
    clearTimeout(timer);
    if (idle !== null) window.cancelIdleCallback?.(idle);
  };
}
const logger$1 = createLogger("[Analyzer]");
const ISSUE_SEVERITY = {
  CRITICAL: "CRITICAL",
  // 严重问题,必须修复
  WARNING: "WARNING",
  // 警告,建议修复
  INFO: "INFO"
  // 信息,可选优化
};
const ISSUE_TYPE = {
  SCROLL_POSITION_CONFLICT: "SCROLL_POSITION_CONFLICT",
  // 滚动位置冲突
  STATE_LOST: "STATE_LOST",
  // 状态丢失
  DUPLICATE_INSTANCE: "DUPLICATE_INSTANCE",
  // 重复实例
  MISSING_KEY: "MISSING_KEY"
};
class PageBehaviorAnalyzer {
  constructor() {
    this.cacheStore = useCacheStore();
    this.issues = [];
    this.componentRegistry = /* @__PURE__ */ new Map();
    this.scrollPositions = /* @__PURE__ */ new Map();
    this.stateSnapshots = /* @__PURE__ */ new Map();
    if (typeof window !== "undefined") {
      window.__PAGE_ANALYZER__ = this;
    }
  }
  /**
   * 注册组件实例
   * @param {string} componentName - 组件名称
   * @param {string} instanceId - 实例ID(通常是 route.fullPath)
   */
  registerComponent(componentName, instanceId) {
    if (!this.componentRegistry.has(componentName)) {
      this.componentRegistry.set(componentName, /* @__PURE__ */ new Set());
    }
    const instances = this.componentRegistry.get(componentName);
    instances.add(instanceId);
    logger$1.log(`注册组件: ${componentName}#${instanceId} 当前实例数: ${instances.size}`);
  }
  /**
   * 注销组件实例
   */
  unregisterComponent(componentName, instanceId) {
    const instances = this.componentRegistry.get(componentName);
    if (instances) {
      instances.delete(instanceId);
      if (instances.size === 0) {
        this.componentRegistry.delete(componentName);
      }
      logger$1.log(`注销组件: ${componentName}#${instanceId} 剩余实例数: ${instances.size}`);
    }
  }
  /**
   * 记录滚动位置
   */
  recordScrollPosition(pageKey, position) {
    this.scrollPositions.set(pageKey, position);
  }
  /**
   * 记录状态快照
   */
  recordStateSnapshot(pageKey, snapshot) {
    this.stateSnapshots.set(pageKey, {
      ...snapshot,
      timestamp: Date.now()
    });
  }
  /**
   * 运行全面诊断
   */
  runDiagnostics() {
    this.issues = [];
    this._checkDuplicateInstances();
    this._checkIncludeMismatch();
    this._checkScrollConflicts();
    this._checkStateConsistency();
    this._checkCacheLeaks();
    return this.getReport();
  }
  /**
   * 检查重复实例(同一组件有多个活跃实例但没有 key)
   */
  _checkDuplicateInstances() {
    for (const [componentName, instances] of this.componentRegistry.entries()) {
      if (instances.size > 1) {
        const isMultiInstancePage = componentName === "PlaylistDetailView";
        if (!isMultiInstancePage) {
          this.issues.push({
            severity: ISSUE_SEVERITY.CRITICAL,
            type: ISSUE_TYPE.DUPLICATE_INSTANCE,
            component: componentName,
            instances: Array.from(instances),
            message: `组件 "${componentName}" 有 ${instances.size} 个活跃实例,但未标记为多实例页面`,
            suggestion: "为该组件添加 :key 属性以确保实例唯一性"
          });
        } else {
          this.issues.push({
            severity: ISSUE_SEVERITY.WARNING,
            type: ISSUE_TYPE.MISSING_KEY,
            component: componentName,
            instances: Array.from(instances),
            message: `多实例页面 "${componentName}" 有 ${instances.size} 个实例`,
            suggestion: '确保 App.vue 中使用了 :key="route.fullPath"'
          });
        }
      }
    }
  }
  /**
   * 检查 keep-alive include 与组件 name 是否匹配
   */
  _checkIncludeMismatch() {
    const cachedViews = this.cacheStore.cachedViews;
    for (const viewKey of cachedViews) {
      if (viewKey.startsWith("playlist_")) ;
      else if (viewKey.endsWith("View")) ;
      else {
        viewKey.charAt(0).toUpperCase() + viewKey.slice(1) + "View";
      }
    }
  }
  /**
   * 检查滚动位置冲突
   */
  _checkScrollConflicts() {
    const positions = Array.from(this.scrollPositions.entries());
    const positionMap = /* @__PURE__ */ new Map();
    for (const [pageKey, position] of positions) {
      if (!positionMap.has(position)) {
        positionMap.set(position, []);
      }
      positionMap.get(position).push(pageKey);
    }
    for (const [position, pages] of positionMap.entries()) {
      if (pages.length > 1 && position !== 0) {
        this.issues.push({
          severity: ISSUE_SEVERITY.CRITICAL,
          type: ISSUE_TYPE.SCROLL_POSITION_CONFLICT,
          pages,
          position,
          message: `以下页面共享相同的滚动位置 ${position}: ${pages.join(", ")}`,
          suggestion: "确保每个页面使用独立的 scrollPosition 存储键"
        });
      }
    }
  }
  /**
   * 检查状态一致性
   */
  _checkStateConsistency() {
    const cachedViews = this.cacheStore.cachedViews;
    for (const viewKey of cachedViews) {
      const snapshot = this.stateSnapshots.get(viewKey);
      if (!snapshot) {
        this.issues.push({
          severity: ISSUE_SEVERITY.WARNING,
          type: ISSUE_TYPE.STATE_LOST,
          page: viewKey,
          message: `页面 "${viewKey}" 在缓存中但没有状态快照`,
          suggestion: "确保在 onDeactivated 中调用 saveState()"
        });
      }
    }
  }
  /**
   * 检查缓存泄漏
   */
  _checkCacheLeaks() {
    const cachedViews = this.cacheStore.cachedViews;
    const registeredComponents = /* @__PURE__ */ new Set();
    for (const instances of this.componentRegistry.values()) {
      for (const instanceId of instances) {
        registeredComponents.add(instanceId);
      }
    }
    for (const viewKey of cachedViews) {
      if (viewKey === "home") continue;
    }
  }
  /**
   * 获取诊断报告
   */
  getReport() {
    const criticalIssues = this.issues.filter((i) => i.severity === ISSUE_SEVERITY.CRITICAL);
    const warnings = this.issues.filter((i) => i.severity === ISSUE_SEVERITY.WARNING);
    const infos = this.issues.filter((i) => i.severity === ISSUE_SEVERITY.INFO);
    return {
      summary: {
        total: this.issues.length,
        critical: criticalIssues.length,
        warnings: warnings.length,
        info: infos.length
      },
      issues: this.issues,
      recommendations: this._generateRecommendations()
    };
  }
  /**
   * 生成修复建议
   */
  _generateRecommendations() {
    const recommendations = [];
    const hasCritical = this.issues.some((i) => i.severity === ISSUE_SEVERITY.CRITICAL);
    const hasMissingKey = this.issues.some((i) => i.type === ISSUE_TYPE.MISSING_KEY);
    const hasScrollConflict = this.issues.some((i) => i.type === ISSUE_TYPE.SCROLL_POSITION_CONFLICT);
    if (hasMissingKey) {
      recommendations.push({
        priority: "HIGH",
        action: '在 App.vue 的 <component> 标签中添加 :key="$route.fullPath"',
        code: `<component :is="Component" :key="$route.fullPath" />`
      });
    }
    if (hasScrollConflict) {
      recommendations.push({
        priority: "HIGH",
        action: "确保每个页面使用独立的 scrollPosition 存储",
        code: `cacheStore.saveSearchState(query, results, scrollPosition, ...)`
      });
    }
    if (hasCritical) {
      recommendations.push({
        priority: "CRITICAL",
        action: "立即修复上述严重问题,否则会导致状态混乱"
      });
    }
    return recommendations;
  }
  /**
   * 清空所有数据
   */
  clear() {
    this.issues = [];
    this.componentRegistry.clear();
    this.scrollPositions.clear();
    this.stateSnapshots.clear();
  }
  /**
   * 打印报告到控制台
   */
  printReport() {
    const report = this.getReport();
    console.group("[PageBehaviorAnalyzer] 📊 诊断报告");
    console.log("摘要:", report.summary);
    if (report.issues.length > 0) {
      console.group("发现的问题:");
      report.issues.forEach((issue, index) => {
        console.log(`${index + 1}. [${issue.severity}] ${issue.message}`);
        if (issue.suggestion) {
          console.log(`   💡 建议: ${issue.suggestion}`);
        }
      });
      console.groupEnd();
    }
    if (report.recommendations.length > 0) {
      console.group("修复建议:");
      report.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. [${rec.priority}] ${rec.action}`);
        if (rec.code) {
          console.log(`   \`${rec.code}\``);
        }
      });
      console.groupEnd();
    }
    console.groupEnd();
    return report;
  }
}
let analyzerInstance = null;
function getPageBehaviorAnalyzer() {
  if (!analyzerInstance) {
    analyzerInstance = new PageBehaviorAnalyzer();
  }
  return analyzerInstance;
}
const logger = createLogger("[usePageLifecycle]");
function usePageLifecycle(pageName) {
  const route = useRoute();
  const cacheStore = useCacheStore();
  const analyzer = getPageBehaviorAnalyzer();
  const routePageKey = getPageCacheKey(route);
  const pageKey = routePageKey || pageName;
  const instance = getCurrentInstance();
  const componentName = instance?.type?.name || route.name || pageName;
  const lifecycleHooks = {
    onMountedCallbacks: [],
    onActivatedCallbacks: [],
    onDeactivatedCallbacks: []
  };
  const wrappedOnSave = () => {
    lifecycleHooks.onDeactivatedCallbacks.forEach((cb) => {
      try {
        cb();
      } catch (error) {
        logger.error("onDeactivated 回调执行失败:", error);
      }
    });
    if (analyzer) {
      analyzer.recordStateSnapshot(pageKey, {
        componentName,
        timestamp: Date.now()
      });
    }
  };
  const wrappedOnRestore = () => {
    const shouldRestore = cacheStore.consumeRouteRestore(pageKey);
    lifecycleHooks.onActivatedCallbacks.forEach((cb) => {
      try {
        cb({ shouldRestore });
      } catch (error) {
        logger.error("onActivated 回调执行失败:", error);
      }
    });
    if (!shouldRestore) {
      logger.log(`Activated (non-restore): ${pageKey}`);
    }
  };
  const unregisterOwnLifecycle = cacheStore.registerLifecycleCallbacks(pageKey, {
    onSave: wrappedOnSave,
    onRestore: wrappedOnRestore
  });
  if (analyzer && componentName) {
    analyzer.registerComponent(componentName, pageKey);
  }
  onMounted(() => {
    logger.log(`Mounted: ${pageKey}`);
    lifecycleHooks.onMountedCallbacks.forEach((cb) => {
      try {
        cb();
      } catch (error) {
        logger.error("onMounted 回调执行失败:", error);
      }
    });
  });
  onActivated(() => {
    logger.log(`Activated: ${pageKey}`);
    wrappedOnRestore();
  });
  onDeactivated(() => {
    logger.log(`Deactivated: ${pageKey}`);
    wrappedOnSave();
  });
  onBeforeUnmount(() => {
    logger.log(`Unmount: ${pageKey}`);
    unregisterOwnLifecycle?.();
    if (analyzer && componentName) {
      analyzer.unregisterComponent(componentName, pageKey);
    }
  });
  const registerOnMounted = (callback) => {
    if (typeof callback === "function") {
      lifecycleHooks.onMountedCallbacks.push(callback);
    }
  };
  const registerOnActivated = (callback) => {
    if (typeof callback === "function") {
      lifecycleHooks.onActivatedCallbacks.push(callback);
    }
  };
  const registerOnDeactivated = (callback) => {
    if (typeof callback === "function") {
      lifecycleHooks.onDeactivatedCallbacks.push(callback);
    }
  };
  return {
    pageKey,
    componentName,
    onMounted: registerOnMounted,
    onActivated: registerOnActivated,
    onDeactivated: registerOnDeactivated
  };
}
function cleanSelectedIds(ids) {
  if (!Array.isArray(ids)) return [];
  const seen2 = /* @__PURE__ */ new Set();
  const normalized = [];
  for (const raw of ids) {
    const id = `${raw ?? ""}`.trim();
    if (!id || seen2.has(id)) continue;
    seen2.add(id);
    normalized.push(id);
  }
  return normalized;
}
function useSelectionModeMicroservice(options) {
  const {
    selectionStore,
    playlistStore,
    isMenuOpen,
    getAllIds,
    openAddToPlaylist,
    getTracksBySelectedIds,
    getCurrentHashId,
    playNextSource = "selection_mode_batch_play_next",
    runBatchDownload,
    runDelete,
    closeModeImpl
  } = options;
  async function closeMode(autoExit = false) {
    let exited = true;
    if (typeof closeModeImpl === "function") {
      exited = await closeModeImpl(autoExit);
    } else {
      exited = await selectionStore.exitMode(autoExit);
      if (!exited) return false;
      if (playlistStore?.resetPriorityTask) {
        playlistStore.resetPriorityTask();
      }
    }
    if (!exited) return false;
    if (isMenuOpen) {
      isMenuOpen.value = false;
    }
    return true;
  }
  function selectAll() {
    const allIds = cleanSelectedIds(typeof getAllIds === "function" ? getAllIds() : []);
    if (!allIds.length) return;
    selectionStore.selectAll(allIds);
    if (isMenuOpen) {
      isMenuOpen.value = false;
    }
  }
  async function handleAction(type) {
    const selectedList = cleanSelectedIds(selectionStore.selectedIdsInOrder);
    if (!selectedList.length) {
      console.warn("未选择任何项目");
      return;
    }
    if (type === "addToPlaylist") {
      if (typeof openAddToPlaylist === "function") {
        await openAddToPlaylist(selectedList);
      }
      return;
    }
    if (type === "playNext") {
      if (typeof getTracksBySelectedIds === "function" && playlistStore?.enqueuePriorityNext) {
        const tracks = (getTracksBySelectedIds(selectedList) || []).filter(Boolean);
        if (tracks.length > 0) {
          playlistStore.enqueuePriorityNext(tracks, {
            taskId: selectionStore.activeTaskId,
            currentHashId: typeof getCurrentHashId === "function" ? getCurrentHashId() : void 0,
            triggerSource: "manual_user",
            source: playNextSource
          });
        }
      }
      await closeMode(true);
      return;
    }
    if (type === "batchDownload") {
      await closeMode(true);
      if (typeof runBatchDownload === "function") {
        setTimeout(() => runBatchDownload(selectedList), 0);
      }
      return;
    }
    if (type === "delete") {
      if (typeof runDelete === "function") {
        const shouldClose = await runDelete(selectedList);
        if (shouldClose === false) return;
        await closeMode(true);
        return;
      }
      await closeMode();
      return;
    }
    await closeMode();
  }
  return {
    closeMode,
    selectAll,
    handleAction
  };
}
function useHomeQueueMotion(queue, currentHashId) {
  const viewportB = ref(null);
  const queueContainer = ref(null);
  const displayRange = ref({ start: 0, end: 40 });
  const scrollOffset = ref(0);
  const manualMode = ref(false);
  const renderedQueue = computed(() => queue.value.slice(displayRange.value.start, displayRange.value.end));
  const queueStyle = computed(() => ({ transform: `translateY(${scrollOffset.value}px)` }));
  let itemHeight = 60;
  let viewportHeight = 0;
  let animation = null;
  let restoreTimer = null;
  let active = true;
  let sequence = 0;
  let pointerId = null;
  let pointerTarget = null;
  let startY = 0;
  let startOffset = 0;
  let observer = null;
  let hasPosition = false;
  function visualOffset() {
    if (!queueContainer.value) return scrollOffset.value;
    const transform = getComputedStyle(queueContainer.value).transform;
    return transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m42;
  }
  function stopAnimation() {
    animation?.cancel();
    animation = null;
  }
  function updateMeasurements() {
    if (!active) return;
    viewportHeight = viewportB.value?.clientHeight || 0;
    const height = viewportB.value?.querySelector(".abode-queue-item")?.getBoundingClientRect().height;
    if (height > 0) itemHeight = height;
  }
  async function syncDisplay() {
    if (!active || manualMode.value) return;
    const token = ++sequence;
    const index = queue.value.findIndex((song) => (song.hash_id ?? song.id) === currentHashId.value);
    if (index < 0) {
      if (!queue.value.length) {
        stopAnimation();
        displayRange.value = { start: 0, end: 40 };
        scrollOffset.value = 0;
      }
      return;
    }
    updateMeasurements();
    const start = Math.max(0, index - 15);
    const end = Math.min(queue.value.length, index + 20);
    const from = visualOffset() + (start - displayRange.value.start) * itemHeight;
    const shouldAnimate = hasPosition && Boolean(queueContainer.value);
    hasPosition = true;
    stopAnimation();
    displayRange.value = { start, end };
    const target = Math.min(0, -(index - start - 1) * itemHeight);
    scrollOffset.value = target;
    await nextTick();
    if (!active || manualMode.value || token !== sequence || !queueContainer.value) return;
    const element = queueContainer.value;
    if (!shouldAnimate || Math.abs(from - target) < 0.5 || !element.animate || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    animation = element.animate([
      { transform: `translateY(${from}px)` },
      { transform: `translateY(${target}px)` }
    ], { duration: 400, easing: "cubic-bezier(0.25, 0.1, 0.25, 1)" });
    const running = animation;
    running.onfinish = () => {
      if (animation === running) animation = null;
    };
  }
  const moveFrame = createFrameScheduler((clientY) => {
    if (!active || pointerId === null) return;
    let offset = startOffset + clientY - startY;
    const totalHeight = renderedQueue.value.length * itemHeight;
    offset = Math.min(0, Math.max(Math.min(0, viewportHeight - totalHeight), offset));
    scrollOffset.value = offset;
    if (offset > -itemHeight * 3 && displayRange.value.start > 0) {
      const count = Math.min(10, displayRange.value.start);
      displayRange.value = { ...displayRange.value, start: displayRange.value.start - count };
      scrollOffset.value -= count * itemHeight;
      startOffset -= count * itemHeight;
    }
    if (offset + totalHeight < viewportHeight + itemHeight * 3 && displayRange.value.end < queue.value.length) {
      displayRange.value = { ...displayRange.value, end: Math.min(queue.value.length, displayRange.value.end + 10) };
    }
  });
  function handlePointerDown(event) {
    if (event.isPrimary === false || event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    ++sequence;
    clearTimeout(restoreTimer);
    scrollOffset.value = visualOffset();
    stopAnimation();
    manualMode.value = true;
    updateMeasurements();
    pointerId = event.pointerId;
    pointerTarget = event.target;
    pointerTarget.setPointerCapture?.(pointerId);
    startY = event.clientY;
    startOffset = scrollOffset.value;
  }
  function handlePointerMove(event) {
    if (event.pointerId !== pointerId) return;
    moveFrame.schedule(event.clientY);
  }
  function releasePointer() {
    if (pointerId !== null && pointerTarget?.hasPointerCapture?.(pointerId)) pointerTarget.releasePointerCapture(pointerId);
    pointerId = null;
    pointerTarget = null;
  }
  function handlePointerUp(event) {
    if (pointerId === null || event && event.pointerId !== pointerId) return;
    moveFrame.flush();
    releasePointer();
    clearTimeout(restoreTimer);
    restoreTimer = setTimeout(() => {
      manualMode.value = false;
      syncDisplay();
    }, 5e3);
  }
  function deactivate() {
    active = false;
    ++sequence;
    moveFrame.cancel();
    stopAnimation();
    clearTimeout(restoreTimer);
    releasePointer();
    manualMode.value = false;
    observer?.disconnect();
  }
  function activate() {
    active = true;
    hasPosition = false;
    if (!observer) observer = new ResizeObserver(() => {
      updateMeasurements();
      syncDisplay();
    });
    if (viewportB.value) observer.observe(viewportB.value);
    nextTick(syncDisplay);
  }
  watch([currentHashId, queue, () => queue.value.length], syncDisplay);
  onMounted(activate);
  onActivated(activate);
  onDeactivated(deactivate);
  onBeforeUnmount(deactivate);
  return {
    viewportB,
    queueContainer,
    renderedQueue,
    displayRange,
    queueStyle,
    updateMeasurements,
    syncDisplay,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  };
}
const _hoisted_1$3 = { class: "image-cropper-header" };
const _hoisted_2$3 = { class: "image-cropper-body" };
const _hoisted_3$3 = { class: "image-cropper-stage" };
const _hoisted_4$3 = { class: "image-cropper-actions" };
const _sfc_main$3 = {
  __name: "ImageCropperDialog",
  props: {
    visible: { type: Boolean, default: false },
    src: { type: String, default: "" },
    title: { type: String, default: "裁剪图片" },
    aspectRatio: { type: Number, default: 1 },
    outputWidth: { type: Number, default: 960 },
    outputHeight: { type: Number, default: 960 },
    outputType: { type: String, default: "image/jpeg" },
    outputQuality: { type: Number, default: 0.92 },
    panelMaxWidth: { type: Number, default: 760 },
    sourceViewportWidth: { type: Number, default: 0 },
    sourceViewportHeight: { type: Number, default: 0 },
    initialTransform: { type: Array, default: null },
    transformOnly: { type: Boolean, default: false },
    mediaFit: { type: String, default: "contain" },
    previewBackground: { type: String, default: "#f2f5f8" },
    overlayOpacity: { type: Number, default: 0 }
  },
  emits: ["close", "confirm", "request-file"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const cropperContainer = ref(null);
    const cropperInstance = ref(null);
    const currentMediaFit = ref(props.mediaFit);
    let skinBaseMatrix = [1, 0, 0, 1, 0, 0];
    const safeAspectRatio = computed(() => {
      const ratio = Number(props.aspectRatio);
      return Number.isFinite(ratio) && ratio > 0 ? ratio : 1;
    });
    const panelStyle = computed(() => ({
      "--cropper-panel-max-width": `${Math.max(320, Number(props.panelMaxWidth || 760))}px`
    }));
    const containerStyle = computed(() => ({
      "--cropper-aspect-ratio": String(safeAspectRatio.value),
      "--cropper-preview-bg": props.previewBackground,
      "--cropper-overlay-opacity": props.overlayOpacity
    }));
    function waitForCropperLayout() {
      return new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(resolve);
        });
      });
    }
    function getEditorViewportSize() {
      const rect = cropperContainer.value?.getBoundingClientRect?.();
      return {
        width: Math.max(1, Math.round((props.transformOnly ? cropperContainer.value?.clientWidth : rect?.width) || 0)),
        height: Math.max(1, Math.round((props.transformOnly ? cropperContainer.value?.clientHeight : rect?.height) || 0))
      };
    }
    function getTransformViewportScale() {
      const editorSize = getEditorViewportSize();
      const sourceWidth = Number(props.sourceViewportWidth || 0);
      const sourceHeight = Number(props.sourceViewportHeight || 0);
      return {
        x: sourceWidth > 0 ? editorSize.width / sourceWidth : 1,
        y: sourceHeight > 0 ? editorSize.height / sourceHeight : 1
      };
    }
    function scaleTransformTranslation(transform, direction = "to-editor") {
      if (!Array.isArray(transform)) return transform;
      const next = [...transform];
      const scale = getTransformViewportScale();
      const xScale = scale.x || 1;
      const yScale = scale.y || 1;
      if (direction === "to-source") {
        next[4] = Number(next[4] || 0) / xScale;
        next[5] = Number(next[5] || 0) / yScale;
      } else {
        next[4] = Number(next[4] || 0) * xScale;
        next[5] = Number(next[5] || 0) * yScale;
      }
      return next;
    }
    function destroyCropper() {
      if (cropperInstance.value && typeof cropperInstance.value.destroy === "function") {
        cropperInstance.value.destroy();
      }
      cropperInstance.value = null;
      if (cropperContainer.value) {
        cropperContainer.value.innerHTML = "";
      }
    }
    async function syncFixedFrame(restoreTransform = true) {
      const cropper = cropperInstance.value;
      const container = cropperContainer.value;
      if (!cropper || !container) return;
      await waitForCropperLayout();
      const { width, height } = getEditorViewportSize();
      const canvas = cropper.getCropperCanvas?.();
      const image = cropper.getCropperImage?.();
      const selection = cropper.getCropperSelection?.();
      if (canvas) {
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
      if (image && typeof image.$ready === "function") {
        await image.$ready();
      }
      if (image && typeof image.$center === "function") {
        if (props.transformOnly) image.$resetTransform();
        image.$center(props.transformOnly ? currentMediaFit.value : "cover");
        if (props.transformOnly) skinBaseMatrix = image.$getTransform();
      }
      if (selection && typeof selection.$change === "function") {
        selection.$change(0, 0, width, height, safeAspectRatio.value);
      }
      if (restoreTransform && image && Array.isArray(props.initialTransform) && typeof image.$setTransform === "function") {
        try {
          const matrix = props.transformOnly ? skinTransformToCropper(props.initialTransform, skinBaseMatrix, getTransformViewportScale()) : scaleTransformTranslation(props.initialTransform, "to-editor");
          image.$setTransform(...matrix);
        } catch (error) {
          console.warn("恢复裁剪位置失败:", error);
        }
      }
    }
    async function setMediaFit(mode) {
      currentMediaFit.value = mode;
      await syncFixedFrame(false);
    }
    async function initCropper() {
      if (!props.visible || !props.src || !cropperContainer.value) return;
      destroyCropper();
      const image = new Image();
      image.src = props.src;
      image.alt = props.title;
      cropperInstance.value = new Cropper(image, {
        container: cropperContainer.value,
        template: `
      <cropper-canvas ${props.transformOnly ? "" : "background"}>
        <cropper-image ${props.transformOnly ? "" : "rotatable skewable"} scalable translatable></cropper-image>
        <cropper-shade></cropper-shade>
        <cropper-selection aspect-ratio="${safeAspectRatio.value}" outlined>
          <cropper-grid role="grid" bordered covered></cropper-grid>
          <cropper-crosshair centered></cropper-crosshair>
          <cropper-handle action="move" plain></cropper-handle>
        </cropper-selection>
      </cropper-canvas>
    `
      });
      await syncFixedFrame();
      if (!props.transformOnly) setupSnapOnRelease();
    }
    function setupSnapOnRelease() {
      const container = cropperContainer.value;
      if (!container) return;
      const snapThreshold = 0.03;
      const snapPoints = [0, 0.25, 1 / 3, 0.5, 2 / 3, 0.75, 1];
      const trySnap = () => {
        const selection = cropperInstance.value?.getCropperSelection?.();
        if (!selection || typeof selection.$change !== "function") return;
        const canvas = cropperInstance.value?.getCropperCanvas?.();
        if (!canvas) return;
        const canvasRect = canvas.getBoundingClientRect();
        const cw = canvasRect.width || 1;
        const ch = canvasRect.height || 1;
        const selRect = selection.getBoundingClientRect();
        const sx = (selRect.left - canvasRect.left) / cw;
        const sy = (selRect.top - canvasRect.top) / ch;
        const sw = selRect.width / cw;
        const sh = selRect.height / ch;
        let snappedX = sx, snappedY = sy;
        let snappedW = sw, snappedH = sh;
        for (const p of snapPoints) {
          if (Math.abs(sx - p) < snapThreshold) snappedX = p;
          if (Math.abs(sx + sw - p) < snapThreshold) snappedW = p - snappedX;
        }
        for (const p of snapPoints) {
          if (Math.abs(sy - p) < snapThreshold) snappedY = p;
          if (Math.abs(sy + sh - p) < snapThreshold) snappedH = p - snappedY;
        }
        const imgCenterX = snappedX + snappedW / 2;
        if (Math.abs(imgCenterX - 0.5) < snapThreshold) {
          snappedX = 0.5 - snappedW / 2;
        }
        const imgCenterY = snappedY + snappedH / 2;
        if (Math.abs(imgCenterY - 0.5) < snapThreshold) {
          snappedY = 0.5 - snappedH / 2;
        }
        if (snappedX !== sx || snappedY !== sy || snappedW !== sw || snappedH !== sh) {
          selection.$change(
            Math.max(0, Math.min(1 - snappedW, snappedX)) * cw,
            Math.max(0, Math.min(1 - snappedH, snappedY)) * ch,
            Math.min(sw, 1 - snappedX) * cw,
            Math.min(sh, 1 - snappedY) * ch
          );
        }
      };
      container.addEventListener("pointerup", () => {
        setTimeout(trySnap, 60);
      });
      container.addEventListener("touchend", () => {
        setTimeout(trySnap, 60);
      }, { passive: true });
    }
    function rotateImage(degrees) {
      const image = cropperInstance.value?.getCropperImage?.();
      if (image && typeof image.$rotate === "function") {
        const currentDeg = getCurrentRotation();
        const targetDeg = snapRotation(currentDeg + degrees);
        const deltaDeg = targetDeg - currentDeg;
        image.$rotate(`${deltaDeg}deg`);
      }
    }
    function getCurrentRotation() {
      const image = cropperInstance.value?.getCropperImage?.();
      if (image && typeof image.$getTransform === "function") {
        try {
          const transform = image.$getTransform();
          const a = Number(transform[0]) || 1;
          const b = Number(transform[1]) || 0;
          const angleRad = Math.atan2(b, a);
          return Math.round(angleRad * (180 / Math.PI));
        } catch (_) {
        }
      }
      return 0;
    }
    function snapRotation(degrees) {
      const normalized = (degrees % 360 + 360) % 360;
      const snapPoints = [0, 90, 180, 270, 360];
      for (const snap of snapPoints) {
        if (Math.abs(normalized - snap) <= 5) return snap % 360;
      }
      return Math.round(normalized);
    }
    function zoomImage(delta) {
      const image = cropperInstance.value?.getCropperImage?.();
      if (image && typeof image.$zoom === "function") {
        image.$zoom(delta);
      }
    }
    function canvasToBlob(canvas) {
      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("裁剪结果生成失败"));
        }, props.outputType, props.outputQuality);
      });
    }
    async function confirmCrop() {
      const rawTransform = cropperInstance.value?.getCropperImage?.()?.$getTransform?.() || null;
      const sourceTransform = rawTransform ? props.transformOnly ? cropperTransformToSkin(rawTransform, skinBaseMatrix, getTransformViewportScale()) : scaleTransformTranslation(rawTransform, "to-source") : null;
      if (props.transformOnly) {
        emit("confirm", {
          blob: null,
          dataUrl: "",
          width: 0,
          height: 0,
          transform: sourceTransform,
          mediaFit: currentMediaFit.value,
          editorTransform: rawTransform,
          editorViewport: getEditorViewportSize(),
          sourceViewport: {
            width: Number(props.sourceViewportWidth || 0),
            height: Number(props.sourceViewportHeight || 0)
          }
        });
        return;
      }
      const selection = cropperInstance.value?.getCropperSelection?.();
      if (!selection || typeof selection.$toCanvas !== "function") {
        throw new Error("裁剪器尚未准备好，请稍后重试");
      }
      const canvas = await selection.$toCanvas({
        width: props.outputWidth,
        height: props.outputHeight,
        beforeDraw(context) {
          context.fillStyle = "#fff";
          context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        }
      });
      const blob = await canvasToBlob(canvas);
      const dataUrl = canvas.toDataURL(props.outputType, props.outputQuality);
      emit("confirm", {
        blob,
        dataUrl,
        width: canvas.width,
        height: canvas.height,
        transform: sourceTransform,
        editorTransform: rawTransform
      });
    }
    function emitClose() {
      emit("close");
    }
    watch(
      () => [props.visible, props.src, safeAspectRatio.value, props.sourceViewportWidth, props.sourceViewportHeight],
      async ([visible]) => {
        if (!visible) {
          destroyCropper();
          return;
        }
        await nextTick();
        currentMediaFit.value = props.mediaFit;
        await initCropper();
      },
      { immediate: true }
    );
    onUnmounted(destroyCropper);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["image-cropper-sheet", { active: __props.visible }]),
        onClick: withModifiers(emitClose, ["self"])
      }, [
        createBaseVNode("div", {
          class: "image-cropper-panel",
          style: normalizeStyle(panelStyle.value)
        }, [
          createBaseVNode("div", _hoisted_1$3, [
            createBaseVNode("h4", null, toDisplayString(__props.title), 1),
            createBaseVNode("button", {
              class: "image-cropper-close",
              type: "button",
              onClick: emitClose
            }, "x")
          ]),
          createBaseVNode("div", _hoisted_2$3, [
            createBaseVNode("div", _hoisted_3$3, [
              createBaseVNode("div", {
                ref_key: "cropperContainer",
                ref: cropperContainer,
                class: normalizeClass(["image-cropper-container", { "is-skin-viewport": __props.transformOnly }]),
                style: normalizeStyle(containerStyle.value)
              }, null, 6),
              _cache[7] || (_cache[7] = createStaticVNode('<div class="crop-guide-overlay" aria-hidden="true" data-v-c858a4d8><div class="crop-guide crop-guide--h crop-guide--top" data-v-c858a4d8></div><div class="crop-guide crop-guide--h crop-guide--third-top" data-v-c858a4d8></div><div class="crop-guide crop-guide--h crop-guide--mid" data-v-c858a4d8></div><div class="crop-guide crop-guide--h crop-guide--third-bottom" data-v-c858a4d8></div><div class="crop-guide crop-guide--h crop-guide--bottom" data-v-c858a4d8></div><div class="crop-guide crop-guide--v crop-guide--left" data-v-c858a4d8></div><div class="crop-guide crop-guide--v crop-guide--third-left" data-v-c858a4d8></div><div class="crop-guide crop-guide--v crop-guide--center" data-v-c858a4d8></div><div class="crop-guide crop-guide--v crop-guide--third-right" data-v-c858a4d8></div><div class="crop-guide crop-guide--v crop-guide--right" data-v-c858a4d8></div></div>', 1))
            ]),
            createBaseVNode("div", _hoisted_4$3, [
              __props.transformOnly ? (openBlock(), createElementBlock("button", {
                key: 0,
                class: "image-cropper-secondary",
                type: "button",
                onClick: _cache[0] || (_cache[0] = ($event) => setMediaFit("contain"))
              }, "完整显示")) : createCommentVNode("", true),
              __props.transformOnly ? (openBlock(), createElementBlock("button", {
                key: 1,
                class: "image-cropper-secondary",
                type: "button",
                onClick: _cache[1] || (_cache[1] = ($event) => setMediaFit("cover"))
              }, "铺满裁切")) : createCommentVNode("", true),
              createBaseVNode("button", {
                class: "image-cropper-secondary",
                type: "button",
                onClick: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("request-file"))
              }, "换一张"),
              createBaseVNode("button", {
                class: "image-cropper-secondary",
                type: "button",
                onClick: _cache[3] || (_cache[3] = ($event) => zoomImage(-0.08))
              }, "缩小"),
              createBaseVNode("button", {
                class: "image-cropper-secondary",
                type: "button",
                onClick: _cache[4] || (_cache[4] = ($event) => zoomImage(0.08))
              }, "放大"),
              !__props.transformOnly ? (openBlock(), createElementBlock("button", {
                key: 2,
                class: "image-cropper-secondary",
                type: "button",
                onClick: _cache[5] || (_cache[5] = ($event) => rotateImage(-90))
              }, "左旋")) : createCommentVNode("", true),
              !__props.transformOnly ? (openBlock(), createElementBlock("button", {
                key: 3,
                class: "image-cropper-secondary",
                type: "button",
                onClick: _cache[6] || (_cache[6] = ($event) => rotateImage(90))
              }, "右旋")) : createCommentVNode("", true),
              createBaseVNode("button", {
                class: "image-cropper-primary",
                type: "button",
                onClick: confirmCrop
              }, "完成")
            ])
          ])
        ], 4)
      ], 2);
    };
  }
};
const ImageCropperDialog = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-c858a4d8"]]);
const _hoisted_1$2 = ["data-type"];
const _hoisted_2$2 = { class: "dialog-header" };
const _hoisted_3$2 = { class: "dialog-body" };
const _hoisted_4$2 = { class: "grid-layout" };
const _hoisted_5$1 = { class: "grid-cell cover-cell" };
const _hoisted_6$1 = { class: "cover-preview-card" };
const _hoisted_7$1 = ["src", "alt"];
const _hoisted_8$1 = {
  key: 1,
  class: "vp-hint"
};
const _hoisted_9$1 = ["title"];
const _hoisted_10$1 = { class: "grid-cell title-cell" };
const _hoisted_11$1 = { class: "field-container" };
const _hoisted_12$1 = { class: "label-with-reset" };
const _hoisted_13$1 = {
  key: 0,
  class: "grid-cell merged-cell"
};
const _hoisted_14$1 = { class: "scrollable-fields" };
const _hoisted_15$1 = { class: "field-container" };
const _hoisted_16$1 = { class: "label-with-reset" };
const _hoisted_17$1 = { class: "field-container" };
const _hoisted_18$1 = { class: "label-with-reset" };
const _hoisted_19$1 = { class: "field-container" };
const _hoisted_20$1 = ["value"];
const _hoisted_21$1 = ["value"];
const _hoisted_22$1 = { class: "dialog-buttons" };
const _hoisted_23$1 = ["disabled"];
const _sfc_main$2 = {
  __name: "DataEditDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    },
    isPlaylist: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:visible", "saved"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const playerStore = usePlayerStore$1();
    const coverFileInput = ref(null);
    const coverPreviewImg = ref(null);
    const lyricsFileInput = ref(null);
    const nameTextarea = ref(null);
    const titleTextarea = ref(null);
    const editData = ref({
      name: "",
      title: "",
      artist: "",
      uploader: "",
      cover_user_path: "",
      cover_source_path: "",
      cover_crop_transform: "",
      lrc_user_path: ""
    });
    const selectedCoverFile = ref(null);
    const previewCoverUrl = ref("");
    const croppedCoverPreviewUrl = ref("");
    const croppedCoverBlob = ref(null);
    const coverCropTransform = ref(null);
    const coverEditSourceMode = ref("");
    const selectedLyricsFile = ref(null);
    const selectedLyricsSourceUri = ref("");
    const currentCoverUrl = ref("");
    const coverCropperVisible = ref(false);
    const coverResetFlag = ref(false);
    const lyricsResetFlag = ref(false);
    const isSaving = ref(false);
    function hasAndroidBridge() {
      return typeof window !== "undefined" && !!window.Android;
    }
    function revokePreviewCoverUrl() {
      if (previewCoverUrl.value && previewCoverUrl.value.startsWith("blob:")) {
        URL.revokeObjectURL(previewCoverUrl.value);
      }
      previewCoverUrl.value = "";
      if (croppedCoverPreviewUrl.value && croppedCoverPreviewUrl.value.startsWith("blob:")) {
        URL.revokeObjectURL(croppedCoverPreviewUrl.value);
      }
      croppedCoverPreviewUrl.value = "";
      croppedCoverBlob.value = null;
      coverCropTransform.value = null;
      coverEditSourceMode.value = "";
    }
    function resetPendingCoverSelection(clearInput = true) {
      selectedCoverFile.value = null;
      revokePreviewCoverUrl();
      if (clearInput && coverFileInput.value) coverFileInput.value.value = "";
    }
    function parseCoverCropTransform(value) {
      if (Array.isArray(value)) return value;
      const raw = `${value || ""}`.trim();
      if (!raw) return null;
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : null;
      } catch {
        return null;
      }
    }
    function resetPendingLyricsSelection(clearInput = true) {
      selectedLyricsFile.value = null;
      selectedLyricsSourceUri.value = "";
      if (clearInput && lyricsFileInput.value) lyricsFileInput.value.value = "";
    }
    function consumePickedFileUri() {
      if (!hasAndroidBridge() || typeof window.Android.consumePickedFileUri !== "function") return "";
      try {
        return `${window.Android.consumePickedFileUri() || ""}`.trim();
      } catch (error) {
        console.warn("读取 Android 原始文件 URI 失败:", error);
        return "";
      }
    }
    const hasCustomLyrics = computed(() => {
      return !!(editData.value.lrc_user_path || selectedLyricsFile.value || props.data?.lrc_user_path);
    });
    const hasCustomCover = computed(() => {
      return !!(editData.value.cover_user_path || selectedCoverFile.value);
    });
    const coverAspectRatio = computed(() => {
      return props.isPlaylist ? 1.52 : 1;
    });
    const coverOutputSize = computed(() => {
      if (props.isPlaylist) return { width: 1216, height: 800 };
      return { width: 960, height: 960 };
    });
    const hasChanges = computed(() => {
      if (!props.data) return false;
      if (selectedCoverFile.value || coverResetFlag.value) return true;
      if (selectedLyricsFile.value || lyricsResetFlag.value) return true;
      if (props.isPlaylist) {
        const originalName = props.data.user_name || props.data.name || "";
        const originalCover = props.data.cover_user_path || "";
        return editData.value.name !== originalName || editData.value.cover_user_path !== originalCover;
      } else {
        const originalTitle = props.data.user_title || props.data.title || "";
        const originalArtist = props.data.user_artist || props.data.artist || "";
        const originalUploader = props.data.user_uploader || props.data.uploader || props.data.producer || props.data.author || "";
        const originalCover = props.data.cover_user_path || "";
        const originalLyrics = props.data.lrc_user_path || "";
        return editData.value.title !== originalTitle || editData.value.artist !== originalArtist || editData.value.uploader !== originalUploader || editData.value.cover_user_path !== originalCover || editData.value.lrc_user_path !== originalLyrics;
      }
    });
    function buildDefaultCoverUrl(data, isPlaylist) {
      if (!data) return "";
      if (isPlaylist) return normalizeCoverUrl(data.cover) || "";
      return getSongCoverSrc(data) || normalizeCoverUrl(data.cover) || "";
    }
    function buildBaseCoverUrl(data, isPlaylist) {
      if (!data) return "";
      if (isPlaylist) {
        return normalizeCoverUrl(data.cover) || `/api/cover/random?seed=${data.id || "default"}`;
      }
      const baseSong = { ...data, cover_user_path: "" };
      return getSongCoverSrc(baseSong) || normalizeCoverUrl(data.cover) || `/api/cover/${data.id || "default"}`;
    }
    function buildCurrentCoverUrl(data, isPlaylist, userCover = "") {
      if (!data) return userCover || "";
      if (userCover) return userCover;
      return buildDefaultCoverUrl(data, isPlaylist) || (isPlaylist ? `/api/cover/random?seed=${data.id || "default"}` : `/api/cover/${data.id || "default"}`);
    }
    watch(() => props.data, (newData) => {
      resetPendingCoverSelection();
      resetPendingLyricsSelection();
      coverResetFlag.value = false;
      lyricsResetFlag.value = false;
      if (newData) {
        if (props.isPlaylist) {
          editData.value = {
            name: newData.user_name || newData.name || "",
            title: "",
            artist: "",
            uploader: "",
            cover_user_path: newData.cover_user_path || "",
            cover_source_path: newData.cover_source_path || "",
            cover_crop_transform: newData.cover_crop_transform || ""
          };
          coverCropTransform.value = parseCoverCropTransform(editData.value.cover_crop_transform);
          currentCoverUrl.value = buildCurrentCoverUrl(newData, true, editData.value.cover_user_path);
        } else {
          editData.value = {
            name: "",
            title: newData.user_title || newData.title || "",
            artist: newData.user_artist || newData.artist || "",
            uploader: newData.user_uploader || newData.uploader || newData.producer || newData.author || "",
            cover_user_path: newData.cover_user_path || "",
            cover_source_path: newData.cover_source_path || "",
            cover_crop_transform: newData.cover_crop_transform || "",
            lrc_user_path: newData.lrc_user_path || ""
          };
          coverCropTransform.value = parseCoverCropTransform(editData.value.cover_crop_transform);
          currentCoverUrl.value = buildCurrentCoverUrl(newData, false, editData.value.cover_user_path);
        }
      }
      nextTick(() => {
        autoResizeTextarea();
      });
    }, { immediate: true });
    watch(() => props.visible, (visible) => {
      if (visible) {
        playerStore.holdMiniPlayer("data-edit-dialog");
      } else {
        playerStore.releaseMiniPlayer("data-edit-dialog");
        coverCropperVisible.value = false;
        resetPendingCoverSelection();
        resetPendingLyricsSelection();
        coverResetFlag.value = false;
        lyricsResetFlag.value = false;
        currentCoverUrl.value = buildCurrentCoverUrl(
          props.data,
          props.isPlaylist,
          editData.value.cover_user_path
        );
      }
    });
    onUnmounted(() => {
      playerStore.releaseMiniPlayer("data-edit-dialog");
      resetPendingCoverSelection();
    });
    function autoResizeTextarea(event) {
      const textarea = event?.target || nameTextarea.value || titleTextarea.value;
      if (!textarea) return;
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 96);
      textarea.style.height = newHeight + "px";
    }
    function triggerCoverFileSelect() {
      coverFileInput.value?.click();
    }
    async function handleCoverFileSelect(event) {
      const file = event.target.files?.[0];
      if (!file) return;
      if (!file.type?.startsWith("image/")) {
        showGlobalToast("请选择图片文件", { type: "warning" });
        if (coverFileInput.value) coverFileInput.value.value = "";
        return;
      }
      resetPendingCoverSelection(false);
      selectedCoverFile.value = file;
      coverEditSourceMode.value = "file";
      previewCoverUrl.value = URL.createObjectURL(file);
      currentCoverUrl.value = previewCoverUrl.value;
      editData.value.cover_user_path = props.data?.cover_user_path || "";
      coverResetFlag.value = false;
      coverCropperVisible.value = true;
      await nextTick();
    }
    async function blobFromUrl(url) {
      if (!url) throw new Error("封面地址为空");
      const isLocalPath = url.startsWith("/") && !url.startsWith("//");
      const isSameOrigin = !isLocalPath && (() => {
        try {
          return new URL(url, location.href).origin === location.origin;
        } catch (_) {
          return false;
        }
      })();
      if (isLocalPath || isSameOrigin) {
        try {
          const response = await fetch(url);
          if (response.ok) return await response.blob();
        } catch (_) {
        }
      }
      const canvasBlob = await blobFromLoadedImage(url);
      if (canvasBlob) return canvasBlob;
      try {
        const response = await fetch(url, { mode: "cors" });
        if (response.ok) return await response.blob();
      } catch (_) {
      }
      throw new Error('封面读取失败：图片源不支持跨域访问，请使用"选择封面"上传本地图片');
    }
    function blobFromLoadedImage(url) {
      return new Promise((resolve) => {
        const sourceImg = coverPreviewImg.value;
        const isCurrentPreview = sourceImg && (sourceImg.src === url || sourceImg.getAttribute("src") === url);
        const image = isCurrentPreview ? sourceImg : new Image();
        let settled = false;
        const finish = (blob) => {
          if (settled) return;
          settled = true;
          resolve(blob || null);
        };
        const draw = () => {
          const width = image.naturalWidth || 0;
          const height = image.naturalHeight || 0;
          if (!width || !height) {
            finish(null);
            return;
          }
          try {
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const context = canvas.getContext("2d");
            if (!context) {
              finish(null);
              return;
            }
            context.drawImage(image, 0, 0, width, height);
            canvas.toBlob((blob) => finish(blob), "image/jpeg", 0.92);
          } catch (error) {
            console.warn("封面 canvas 读取失败:", error);
            finish(null);
          }
        };
        if (image.complete && (image.naturalWidth || 0) > 0) {
          draw();
          return;
        }
        image.onload = draw;
        image.onerror = () => finish(null);
        if (image !== sourceImg) {
          image.decoding = "async";
          image.src = url;
        }
      });
    }
    async function blobFromCoverSources(sources = []) {
      const uniqueSources = Array.from(new Set(
        sources.map((source) => `${source || ""}`.trim()).filter(Boolean)
      ));
      let lastError = null;
      for (const source of uniqueSources) {
        try {
          return await blobFromUrl(source);
        } catch (error) {
          lastError = error;
        }
      }
      const previewBlob = await blobFromLoadedImage(currentCoverUrl.value);
      if (previewBlob) return previewBlob;
      throw lastError || new Error("当前封面无法读取");
    }
    async function openCurrentCoverEditor() {
      if (!currentCoverUrl.value) return;
      if (previewCoverUrl.value && selectedCoverFile.value) {
        coverEditSourceMode.value = "file";
        coverCropperVisible.value = true;
        await nextTick();
        return;
      }
      try {
        resetPendingCoverSelection(false);
        const sourceUrl = props.data?.cover_source_path || editData.value.cover_source_path || currentCoverUrl.value;
        coverCropTransform.value = parseCoverCropTransform(props.data?.cover_crop_transform);
        const blob = await blobFromCoverSources([
          sourceUrl,
          editData.value.cover_source_path,
          props.data?.cover_user_path,
          currentCoverUrl.value
        ]);
        const fileType = blob.type || "image/jpeg";
        selectedCoverFile.value = new File([blob], "current-cover.jpg", { type: fileType });
        coverEditSourceMode.value = "current";
        previewCoverUrl.value = URL.createObjectURL(blob);
        editData.value.cover_user_path = props.data?.cover_user_path || "";
        coverResetFlag.value = false;
        coverCropperVisible.value = true;
        await nextTick();
      } catch (error) {
        console.warn("当前封面编辑源读取失败:", error);
        showGlobalToast("当前封面无法直接编辑，请重新选择图片", { type: "error" });
      }
    }
    function closeCoverCropper() {
      coverCropperVisible.value = false;
      if (coverEditSourceMode.value === "current" && !croppedCoverBlob.value) {
        resetPendingCoverSelection();
        currentCoverUrl.value = buildCurrentCoverUrl(props.data, props.isPlaylist, editData.value.cover_user_path);
      }
    }
    async function finishCoverCrop(payload) {
      try {
        const blob = payload?.blob;
        if (blob) {
          if (croppedCoverPreviewUrl.value?.startsWith("blob:")) {
            URL.revokeObjectURL(croppedCoverPreviewUrl.value);
          }
          croppedCoverBlob.value = blob;
          croppedCoverPreviewUrl.value = URL.createObjectURL(blob);
          currentCoverUrl.value = croppedCoverPreviewUrl.value;
          coverCropTransform.value = Array.isArray(payload?.transform) ? payload.transform : null;
        }
        coverCropperVisible.value = false;
      } catch (error) {
        showGlobalToast(error.message || "裁剪预览生成失败", { type: "error" });
      }
    }
    function resetCover() {
      resetPendingCoverSelection();
      coverCropperVisible.value = false;
      editData.value.cover_user_path = "";
      editData.value.cover_source_path = "";
      editData.value.cover_crop_transform = "";
      coverResetFlag.value = true;
      currentCoverUrl.value = buildBaseCoverUrl(props.data, props.isPlaylist);
    }
    function blobToObjectUrlDownload(blob, filename) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    async function downloadCurrentCover() {
      if (!currentCoverUrl.value) return;
      try {
        const source = currentCoverUrl.value;
        if (hasAndroidBridge() && typeof window.Android.saveImageToGallery === "function") {
          if (source.startsWith("blob:") || source.startsWith("/") && !source.startsWith("/api/cover/")) {
            const blob2 = await blobFromUrl(source);
            const dataUrl = await blobToDataUrl(blob2);
            window.Android.saveImageToGallery(dataUrl);
          } else {
            window.Android.saveImageToGallery(source);
          }
          showGlobalToast("已提交封面保存");
          return;
        }
        const blob = await blobFromUrl(source);
        blobToObjectUrlDownload(blob, `${props.data?.id || "cover"}.jpg`);
      } catch (error) {
        showGlobalToast(error.message || "封面下载失败", { type: "error" });
      }
    }
    function resolveFieldResetMeta(fieldName) {
      if (props.isPlaylist && fieldName === "name") {
        return {
          editKey: "name",
          defaultValue: props.data?.name || "",
          payload: { user_name: "" }
        };
      }
      if (!props.isPlaylist && fieldName === "title") {
        return {
          editKey: "title",
          defaultValue: props.data?.title || "",
          payload: { user_title: "" }
        };
      }
      if (!props.isPlaylist && fieldName === "artist") {
        return {
          editKey: "artist",
          defaultValue: props.data?.artist || "",
          payload: { user_artist: "" }
        };
      }
      if (!props.isPlaylist && fieldName === "uploader") {
        return {
          editKey: "uploader",
          defaultValue: props.data?.uploader || props.data?.producer || props.data?.author || "",
          payload: { user_uploader: "" }
        };
      }
      return null;
    }
    async function resetField(fieldName) {
      const meta = resolveFieldResetMeta(fieldName);
      if (!meta || !props.data?.id) return;
      const previousValue = editData.value[meta.editKey];
      editData.value[meta.editKey] = meta.defaultValue;
      try {
        const response = await apiRequest(`/api/${props.isPlaylist ? "playlist" : "song"}/update-metadata`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: {
            id: props.data.id,
            ...meta.payload
          }
        });
        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          editData.value[meta.editKey] = previousValue;
          showGlobalToast(`重置失败: ${err.error || "未知错误"}`, { type: "error" });
          return;
        }
        Object.assign(props.data, meta.payload);
        emit("saved", meta.payload);
        showGlobalToast("已恢复默认文本");
      } catch (error) {
        editData.value[meta.editKey] = previousValue;
        showGlobalToast(`重置失败: ${error.message}`, { type: "error" });
      }
    }
    function triggerLyricsFileSelect() {
      console.log("触发歌词文件选择器");
      lyricsFileInput.value?.click();
    }
    function handleLyricsFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        console.log("🎵 [DataEditDialog] handleLyricsFileSelect called with file:", file.name);
        if (!file.name.toLowerCase().endsWith(".lrc")) {
          console.warn("🎵 [DataEditDialog] invalid file extension, not .lrc");
          showGlobalToast("请选择 .lrc 格式的歌词文件", { type: "warning" });
          return;
        }
        console.log("🎵 [DataEditDialog] valid .lrc file selected");
        resetPendingLyricsSelection(false);
        selectedLyricsFile.value = file;
        selectedLyricsSourceUri.value = consumePickedFileUri();
        if (hasAndroidBridge() && !selectedLyricsSourceUri.value) {
          console.warn("Android 未返回歌词原始文件 URI，保存时将无法走原始流上传");
        }
      }
    }
    const resetLyrics = () => {
      console.log("🎵 [DataEditDialog] resetLyrics called");
      resetPendingLyricsSelection();
      editData.value.lrc_user_path = "";
      lyricsResetFlag.value = true;
      console.log("🎵 [DataEditDialog] lyrics reset, lyricsResetFlag set to true");
    };
    function getLyricsFilename(url) {
      if (!url) return "";
      try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        const filename = pathname.split("/").pop();
        return filename || "未知文件名";
      } catch (e) {
        const parts = url.split("/");
        return parts[parts.length - 1] || "未知文件名";
      }
    }
    function blobToDataUrl(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(reader.error || new Error("图片读取失败"));
        reader.readAsDataURL(blob);
      });
    }
    async function getCroppedCoverBlob() {
      if (!selectedCoverFile.value) return null;
      if (!croppedCoverBlob.value) throw new Error("请先完成封面裁剪");
      return croppedCoverBlob.value;
    }
    async function uploadCroppedCover() {
      const blob = await getCroppedCoverBlob();
      if (!blob) return null;
      if (hasAndroidBridge()) {
        const dataUrl = await blobToDataUrl(blob);
        const uploadResponse2 = await apiRequest("/api/upload/cover", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: {
            type: props.isPlaylist ? "playlist" : "song",
            id: props.data.id,
            data_url: dataUrl,
            file_name: selectedCoverFile.value?.name || "cover.jpg",
            mime_type: "image/jpeg"
          }
        });
        if (uploadResponse2.ok) {
          const uploadData = await uploadResponse2.json();
          return uploadData.url;
        }
        const errorData2 = await uploadResponse2.json().catch(() => ({}));
        throw new Error(errorData2.error || "封面上传失败");
      }
      const formData = new FormData();
      formData.append("file", blob, selectedCoverFile.value?.name || "cover.jpg");
      formData.append("type", props.isPlaylist ? "playlist" : "song");
      formData.append("id", props.data.id);
      const uploadResponse = await apiRequest("/api/upload/cover", {
        method: "POST",
        body: formData
      });
      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        return uploadData.url;
      }
      const errorData = await uploadResponse.json().catch(() => ({}));
      throw new Error(errorData.error || "封面上传失败");
    }
    async function uploadOriginalCoverSource() {
      if (!selectedCoverFile.value) return null;
      if (hasAndroidBridge()) {
        const dataUrl = await blobToDataUrl(selectedCoverFile.value);
        const uploadResponse2 = await apiRequest("/api/upload/cover", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: {
            type: props.isPlaylist ? "playlist_source" : "song_source",
            id: props.data.id,
            data_url: dataUrl,
            file_name: selectedCoverFile.value?.name || "cover-source.jpg",
            mime_type: selectedCoverFile.value?.type || "image/jpeg"
          }
        });
        if (uploadResponse2.ok) {
          const uploadData = await uploadResponse2.json();
          return uploadData.url;
        }
        const errorData2 = await uploadResponse2.json().catch(() => ({}));
        throw new Error(errorData2.error || "原始封面上传失败");
      }
      const formData = new FormData();
      formData.append("file", selectedCoverFile.value, selectedCoverFile.value?.name || "cover-source.jpg");
      formData.append("type", props.isPlaylist ? "playlist_source" : "song_source");
      formData.append("id", props.data.id);
      const uploadResponse = await apiRequest("/api/upload/cover", {
        method: "POST",
        body: formData
      });
      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        return uploadData.url;
      }
      const errorData = await uploadResponse.json().catch(() => ({}));
      throw new Error(errorData.error || "原始封面上传失败");
    }
    async function save() {
      if (isSaving.value) return;
      isSaving.value = true;
      console.log("开始保存编辑数据...", { isPlaylist: props.isPlaylist, data: props.data });
      try {
        let coverUrl = null;
        let coverSourceUrl = null;
        if (selectedCoverFile.value) {
          coverUrl = await uploadCroppedCover();
          coverSourceUrl = await uploadOriginalCoverSource();
        }
        let lyricsUrl = null;
        if (selectedLyricsFile.value) {
          console.log("🎵 [DataEditDialog] uploading lyrics file:", selectedLyricsFile.value.name);
          if (hasAndroidBridge()) {
            if (!selectedLyricsSourceUri.value) {
              throw new Error("未获取到 Android 原始歌词句柄，请重新选择歌词后重试");
            }
            const uploadResponse = await apiRequest("/api/upload/lyrics", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: {
                type: "song",
                id: props.data.id,
                source_uri: selectedLyricsSourceUri.value,
                file_name: selectedLyricsFile.value.name,
                mime_type: selectedLyricsFile.value.type
              }
            });
            if (uploadResponse.ok) {
              const uploadData = await uploadResponse.json();
              lyricsUrl = uploadData.url;
              console.log("🎵 [DataEditDialog] lyrics upload success, url:", lyricsUrl);
            } else {
              const errorData = await uploadResponse.json();
              console.error("🎵 [DataEditDialog] lyrics upload failed:", errorData);
              showGlobalToast("歌词上传失败: " + (errorData.error || "未知错误"), { type: "error" });
              return;
            }
          } else {
            const formData = new FormData();
            formData.append("file", selectedLyricsFile.value);
            formData.append("type", "song");
            formData.append("id", props.data.id);
            const uploadResponse = await apiRequest("/api/upload/lyrics", {
              method: "POST",
              body: formData
            });
            if (uploadResponse.ok) {
              const uploadData = await uploadResponse.json();
              lyricsUrl = uploadData.url;
              console.log("🎵 [DataEditDialog] lyrics upload success, url:", lyricsUrl);
            } else {
              const errorData = await uploadResponse.json();
              console.error("🎵 [DataEditDialog] lyrics upload failed:", errorData);
              showGlobalToast("歌词上传失败: " + (errorData.error || "未知错误"), { type: "error" });
              return;
            }
          }
        }
        const updateData = {};
        if (props.isPlaylist) {
          if (editData.value.name !== (props.data.user_name || props.data.name)) {
            updateData.user_name = editData.value.name;
          }
          if (coverUrl !== null) {
            updateData.cover_user_path = coverUrl;
            if (coverSourceUrl) {
              updateData.cover_source_path = coverSourceUrl;
            }
            updateData.cover_crop_transform = JSON.stringify(coverCropTransform.value || []);
          } else if (coverResetFlag.value || editData.value.cover_user_path !== (props.data.cover_user_path || "")) {
            updateData.cover_user_path = editData.value.cover_user_path;
            updateData.cover_source_path = "";
            updateData.cover_crop_transform = "";
          }
        } else {
          if (editData.value.title !== (props.data.user_title || props.data.title)) {
            updateData.user_title = editData.value.title;
          }
          if (editData.value.artist !== (props.data.user_artist || props.data.artist)) {
            updateData.user_artist = editData.value.artist;
          }
          if (editData.value.uploader !== (props.data.user_uploader || props.data.uploader || props.data.producer || props.data.author)) {
            updateData.user_uploader = editData.value.uploader;
          }
          if (coverUrl !== null) {
            updateData.cover_user_path = coverUrl;
            if (coverSourceUrl) {
              updateData.cover_source_path = coverSourceUrl;
            }
            updateData.cover_crop_transform = JSON.stringify(coverCropTransform.value || []);
          } else if (coverResetFlag.value || editData.value.cover_user_path !== (props.data.cover_user_path || "")) {
            updateData.cover_user_path = editData.value.cover_user_path;
            updateData.cover_source_path = "";
            updateData.cover_crop_transform = "";
          }
          if (lyricsUrl !== null) {
            updateData.lrc_user_path = lyricsUrl;
            console.log("🎵 [DataEditDialog] setting lrc_user_path from upload:", lyricsUrl);
          } else if (lyricsResetFlag.value || editData.value.lrc_user_path !== (props.data.lrc_user_path || "")) {
            updateData.lrc_user_path = editData.value.lrc_user_path;
            console.log("🎵 [DataEditDialog] setting lrc_user_path from edit/reset:", editData.value.lrc_user_path, "lyricsResetFlag:", lyricsResetFlag.value);
          }
        }
        const response = await apiRequest(`/api/${props.isPlaylist ? "playlist" : "song"}/update-metadata`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: {
            id: props.data.id,
            ...updateData
          }
        });
        if (response.ok) {
          if (coverUrl !== null) {
            editData.value.cover_user_path = coverUrl;
            editData.value.cover_source_path = coverSourceUrl || "";
            editData.value.cover_crop_transform = JSON.stringify(coverCropTransform.value || []);
            currentCoverUrl.value = coverUrl;
            coverResetFlag.value = false;
            coverCropperVisible.value = false;
            resetPendingCoverSelection();
          }
          if (lyricsUrl !== null) {
            editData.value.lrc_user_path = lyricsUrl;
            resetPendingLyricsSelection();
            lyricsResetFlag.value = false;
          }
          if (props.data) {
            Object.assign(props.data, updateData);
          }
          showGlobalToast("保存成功！");
          emit("saved", updateData);
          close();
        } else {
          const errorData = await response.json();
          showGlobalToast("保存失败: " + (errorData.error || "未知错误"), { type: "error" });
        }
      } catch (error) {
        showGlobalToast("保存失败: " + error.message, { type: "error" });
      } finally {
        isSaving.value = false;
      }
    }
    function close() {
      coverCropperVisible.value = false;
      emit("update:visible", false);
    }
    function handleOverlayClick() {
      if (coverCropperVisible.value) {
        closeCoverCropper();
        return;
      }
      close();
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Transition, { name: "fade" }, {
        default: withCtx(() => [
          __props.visible ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: "dialog-overlay",
            onClick: handleOverlayClick
          }, [
            createBaseVNode("div", {
              class: "dialog-container",
              "data-type": __props.isPlaylist ? "playlist" : "song",
              onClick: _cache[8] || (_cache[8] = withModifiers(() => {
              }, ["stop"]))
            }, [
              createBaseVNode("div", _hoisted_2$2, [
                createBaseVNode("h3", null, toDisplayString(__props.isPlaylist ? "编辑歌单信息" : "编辑歌曲信息"), 1),
                createBaseVNode("button", {
                  class: "close-btn",
                  onClick: close
                }, "✕")
              ]),
              createBaseVNode("div", _hoisted_3$2, [
                createBaseVNode("div", _hoisted_4$2, [
                  createBaseVNode("div", _hoisted_5$1, [
                    createBaseVNode("div", _hoisted_6$1, [
                      currentCoverUrl.value ? (openBlock(), createElementBlock("img", {
                        key: 0,
                        ref_key: "coverPreviewImg",
                        ref: coverPreviewImg,
                        src: currentCoverUrl.value,
                        alt: __props.isPlaylist ? "歌单封面" : "歌曲封面",
                        class: "cover-preview-img",
                        crossorigin: "anonymous",
                        draggable: "false"
                      }, null, 8, _hoisted_7$1)) : (openBlock(), createElementBlock("div", _hoisted_8$1, "无封面")),
                      currentCoverUrl.value ? (openBlock(), createElementBlock("button", {
                        key: 2,
                        class: "cover-edit-hotspot",
                        type: "button",
                        title: __props.isPlaylist ? "编辑当前歌单封面" : "编辑当前歌曲封面",
                        onClick: openCurrentCoverEditor
                      }, [..._cache[9] || (_cache[9] = [
                        createBaseVNode("span", null, "编辑封面", -1)
                      ])], 8, _hoisted_9$1)) : createCommentVNode("", true)
                    ]),
                    createBaseVNode("input", {
                      ref_key: "coverFileInput",
                      ref: coverFileInput,
                      type: "file",
                      accept: "image/*",
                      onChange: handleCoverFileSelect,
                      style: { "display": "none" }
                    }, null, 544),
                    createBaseVNode("div", {
                      class: normalizeClass(["cover-buttons", { "has-reset": hasCustomCover.value }])
                    }, [
                      createBaseVNode("button", {
                        class: "select-btn",
                        onClick: triggerCoverFileSelect
                      }, " 选择封面 "),
                      !__props.isPlaylist && currentCoverUrl.value ? (openBlock(), createElementBlock("button", {
                        key: 0,
                        class: "download-action-btn",
                        onClick: downloadCurrentCover
                      }, " 下载封面 ")) : createCommentVNode("", true),
                      hasCustomCover.value ? (openBlock(), createElementBlock("button", {
                        key: 1,
                        class: "reset-action-btn",
                        onClick: resetCover
                      }, " 重置封面 ")) : createCommentVNode("", true)
                    ], 2)
                  ]),
                  createBaseVNode("div", _hoisted_10$1, [
                    createBaseVNode("div", _hoisted_11$1, [
                      createBaseVNode("div", _hoisted_12$1, [
                        createBaseVNode("label", null, toDisplayString(__props.isPlaylist ? "歌单名称" : "歌曲标题"), 1),
                        __props.isPlaylist && (Boolean(props.data.user_name) || editData.value.name !== (props.data.user_name || props.data.name || "")) ? (openBlock(), createElementBlock("button", {
                          key: 0,
                          class: "reset-field-btn",
                          onClick: _cache[0] || (_cache[0] = ($event) => resetField("name"))
                        }, " 重置 ")) : createCommentVNode("", true),
                        !__props.isPlaylist && (Boolean(props.data.user_title) || editData.value.title !== (props.data.user_title || props.data.title || "")) ? (openBlock(), createElementBlock("button", {
                          key: 1,
                          class: "reset-field-btn",
                          onClick: _cache[1] || (_cache[1] = ($event) => resetField("title"))
                        }, " 重置 ")) : createCommentVNode("", true)
                      ]),
                      __props.isPlaylist ? withDirectives((openBlock(), createElementBlock("textarea", {
                        key: 0,
                        ref_key: "nameTextarea",
                        ref: nameTextarea,
                        "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => editData.value.name = $event),
                        placeholder: "请输入歌单名称",
                        maxlength: "50",
                        rows: "1",
                        onInput: autoResizeTextarea,
                        class: "auto-resize title-textarea",
                        style: { "width": "100%", "min-height": "38px", "max-height": "96px", "resize": "none", "overflow-y": "auto", "box-sizing": "border-box" }
                      }, null, 544)), [
                        [vModelText, editData.value.name]
                      ]) : withDirectives((openBlock(), createElementBlock("textarea", {
                        key: 1,
                        ref_key: "titleTextarea",
                        ref: titleTextarea,
                        "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => editData.value.title = $event),
                        placeholder: "请输入歌曲标题",
                        maxlength: "100",
                        rows: "1",
                        onInput: autoResizeTextarea,
                        class: "auto-resize title-textarea",
                        style: { "width": "100%", "min-height": "38px", "max-height": "96px", "resize": "none", "overflow-y": "auto", "box-sizing": "border-box" }
                      }, null, 544)), [
                        [vModelText, editData.value.title]
                      ])
                    ])
                  ]),
                  !__props.isPlaylist ? (openBlock(), createElementBlock("div", _hoisted_13$1, [
                    createBaseVNode("div", _hoisted_14$1, [
                      createBaseVNode("div", _hoisted_15$1, [
                        createBaseVNode("div", _hoisted_16$1, [
                          _cache[10] || (_cache[10] = createBaseVNode("label", null, "歌手", -1)),
                          Boolean(props.data.user_artist) || editData.value.artist !== (props.data.user_artist || props.data.artist || "") ? (openBlock(), createElementBlock("button", {
                            key: 0,
                            class: "reset-field-btn",
                            onClick: _cache[4] || (_cache[4] = ($event) => resetField("artist"))
                          }, " 重置 ")) : createCommentVNode("", true)
                        ]),
                        withDirectives(createBaseVNode("input", {
                          "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => editData.value.artist = $event),
                          type: "text",
                          placeholder: "请输入歌手名称",
                          maxlength: "50"
                        }, null, 512), [
                          [vModelText, editData.value.artist]
                        ])
                      ]),
                      createBaseVNode("div", _hoisted_17$1, [
                        createBaseVNode("div", _hoisted_18$1, [
                          _cache[11] || (_cache[11] = createBaseVNode("label", null, "P主/UP主", -1)),
                          Boolean(props.data.user_uploader) || editData.value.uploader !== (props.data.user_uploader || props.data.uploader || props.data.producer || props.data.author || "") ? (openBlock(), createElementBlock("button", {
                            key: 0,
                            class: "reset-field-btn",
                            onClick: _cache[6] || (_cache[6] = ($event) => resetField("uploader"))
                          }, " 重置 ")) : createCommentVNode("", true)
                        ]),
                        withDirectives(createBaseVNode("input", {
                          "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => editData.value.uploader = $event),
                          type: "text",
                          placeholder: "请输入P主/UP主名称",
                          maxlength: "50"
                        }, null, 512), [
                          [vModelText, editData.value.uploader]
                        ])
                      ]),
                      createBaseVNode("div", _hoisted_19$1, [
                        createBaseVNode("input", {
                          ref_key: "lyricsFileInput",
                          ref: lyricsFileInput,
                          type: "file",
                          accept: "*/*",
                          onChange: handleLyricsFileSelect,
                          style: { "display": "none" }
                        }, null, 544),
                        createBaseVNode("div", {
                          class: normalizeClass(["lyrics-buttons", { "has-reset": hasCustomLyrics.value }])
                        }, [
                          createBaseVNode("button", {
                            class: "select-btn",
                            onClick: triggerLyricsFileSelect
                          }, " 🎵 选择歌词 "),
                          hasCustomLyrics.value ? (openBlock(), createElementBlock("button", {
                            key: 0,
                            class: "reset-action-btn",
                            onClick: resetLyrics
                          }, " 重置歌词 ")) : createCommentVNode("", true)
                        ], 2),
                        hasCustomLyrics.value && selectedLyricsFile.value ? (openBlock(), createElementBlock("input", {
                          key: 0,
                          type: "text",
                          value: selectedLyricsFile.value.name,
                          readonly: "",
                          class: "lyrics-filename-display",
                          placeholder: "已选择的文件名"
                        }, null, 8, _hoisted_20$1)) : hasCustomLyrics.value && editData.value.lrc_user_path ? (openBlock(), createElementBlock("input", {
                          key: 1,
                          type: "text",
                          value: getLyricsFilename(editData.value.lrc_user_path),
                          readonly: "",
                          class: "lyrics-filename-display",
                          placeholder: "已上传的歌词文件"
                        }, null, 8, _hoisted_21$1)) : createCommentVNode("", true)
                      ])
                    ])
                  ])) : createCommentVNode("", true)
                ])
              ]),
              createBaseVNode("div", _hoisted_22$1, [
                createBaseVNode("button", {
                  class: "btn-cancel",
                  onClick: close
                }, "取消"),
                createBaseVNode("button", {
                  class: "btn-confirm",
                  onClick: save,
                  disabled: !hasChanges.value || isSaving.value
                }, toDisplayString(isSaving.value ? "保存中..." : "保存"), 9, _hoisted_23$1)
              ]),
              createVNode(ImageCropperDialog, {
                visible: coverCropperVisible.value,
                src: previewCoverUrl.value,
                title: __props.isPlaylist ? "裁剪歌单封面" : "裁剪歌曲封面",
                "aspect-ratio": coverAspectRatio.value,
                "output-width": coverOutputSize.value.width,
                "output-height": coverOutputSize.value.height,
                "initial-transform": coverCropTransform.value,
                onClose: closeCoverCropper,
                onRequestFile: triggerCoverFileSelect,
                onConfirm: finishCoverCrop
              }, null, 8, ["visible", "src", "title", "aspect-ratio", "output-width", "output-height", "initial-transform"])
            ], 8, _hoisted_1$2)
          ])) : createCommentVNode("", true)
        ]),
        _: 1
      });
    };
  }
};
const DataEditDialog = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-c50c480c"]]);
const _hoisted_1$1 = { class: "home-page-container" };
const _hoisted_2$1 = { class: "lastPlaylist-container" };
const _hoisted_3$1 = {
  key: 0,
  class: "skin-media-layer"
};
const _hoisted_4$1 = ["src"];
const _hoisted_5 = { class: "abode-cover skin-region-foreground" };
const _hoisted_6 = ["src"];
const _hoisted_7 = ["onClick"];
const _hoisted_8 = { class: "abode-queue-index" };
const _hoisted_9 = { class: "abode-queue-main" };
const _hoisted_10 = { class: "abode-queue-title" };
const _hoisted_11 = { class: "abode-queue-artist" };
const _hoisted_12 = {
  key: 1,
  class: "abode-fallback"
};
const _hoisted_13 = { class: "abode-fallback-title" };
const _hoisted_14 = { class: "abode-fallback-artist" };
const _hoisted_15 = { class: "mainPlaylist-container home-playlist-stage" };
const _hoisted_16 = {
  key: 0,
  class: "playlist-drag-list home-playlist-skeleton-list",
  "aria-hidden": "true"
};
const _hoisted_17 = { class: "left-box-main" };
const _hoisted_18 = { class: "left-box-main" };
const _hoisted_19 = {
  class: "cover-box",
  style: { "display": "flex", "align-items": "center", "justify-content": "center", "background": "#f0f0f0" }
};
const _hoisted_20 = { style: { "font-size": "2em" } };
const _hoisted_21 = { class: "right-box" };
const _hoisted_22 = { class: "up-title-box" };
const _hoisted_23 = { class: "down-playtimes-box" };
const _hoisted_24 = {
  key: 0,
  style: { "font-size": "12px", "color": "#888" }
};
const _hoisted_25 = { key: 1 };
const _hoisted_26 = ["onClick", "onTouchstart"];
const _hoisted_27 = ["onClick"];
const _hoisted_28 = ["src", "onError"];
const _hoisted_29 = ["onClick"];
const _hoisted_30 = { class: "up-title-box" };
const _hoisted_31 = {
  key: 0,
  class: "pinned-badge",
  "aria-hidden": "true"
};
const _hoisted_32 = { class: "down-playtimes-box" };
const _hoisted_33 = {
  key: 0,
  class: "fab-container"
};
const _hoisted_34 = {
  key: 0,
  class: "fab-menu"
};
const _hoisted_35 = {
  key: 0,
  class: "count-badge"
};
const HOME_SELECTION_PAGE = "home-view";
const SKIN_SANDBOX_MESSAGE_TYPE = "ty-skin-sandbox-action";
const DRAG_DELAY = 150;
const HOME_SKELETON_COUNT = 8;
const _sfc_main$1 = /* @__PURE__ */ Object.assign({
  name: "HomeView"
}, {
  __name: "HomeView",
  setup(__props) {
    const playerStore = usePlayerStore$1();
    const playlistStore = usePlaylistStore();
    const cacheStore = useCacheStore();
    const selectionStore = useSelectionStore();
    const { useSkinTarget } = useSkinThemeConfig();
    const pageHomeSkin = useSkinTarget("page_home");
    const homeHeroPanel = useSkinTarget("home_hero_panel");
    const homePlaylistCoverSkin = useSkinTarget("home_playlist_cover");
    const homeHeroMediaSrc = useResolvedSkinMediaSrc(computed(() => homeHeroPanel.value?.mediaSrc || ""));
    const emptyCoverSrc = getBundledAssetUrl("svg/music_badge.svg");
    const isMenuOpen = ref(false);
    const route = useRoute();
    const isSkinSandboxHome = computed(() => route.query.skinSandbox === "1");
    const {
      handleTouchStart: baseHandleTouchStart,
      handleTouchMove: baseHandleTouchMove,
      handleTouchEnd: baseHandleTouchEnd
    } = useSelection();
    reactive({
      state: { current: "idle" },
      transition(event, payload) {
        console.log(`[BSM Home] ${this.state.current} --${event}-->`, payload);
        switch (event) {
          case "LOAD":
            this.state.current = "loading";
            break;
          case "SUCCESS":
            this.state.current = "success";
            break;
          case "ERROR":
            this.state.current = "error";
            break;
          default:
            console.warn("[BSM Home] Unknown event:", event);
        }
      }
    });
    const pageLifecycle = usePageLifecycle("home");
    const PINNED_IDS = ["local_music", "bili_downloads"];
    const isPinned = (id) => PINNED_IDS.includes(id);
    const canDrag = (id) => !isPinned(id);
    function normalizePlaylists(arr) {
      const savedOrder = (() => {
        try {
          return JSON.parse(localStorage.getItem("home_playlist_order") || "[]");
        } catch {
          return [];
        }
      })();
      const pinned = PINNED_IDS.map((id) => arr.find((p) => p.id === id)).filter(Boolean);
      let rest = arr.filter((p) => !PINNED_IDS.includes(p.id));
      if (savedOrder.length) {
        rest = [...rest].sort((a, b) => {
          let ia = savedOrder.indexOf(a.id);
          let ib = savedOrder.indexOf(b.id);
          if (ia === -1) ia = 99999;
          if (ib === -1) ib = 99999;
          return ia - ib;
        });
      }
      return [...pinned, ...rest];
    }
    function savePlaylistOrder() {
      const ids = playlists2.value.filter((p) => !PINNED_IDS.includes(p.id)).map((p) => p.id);
      localStorage.setItem("home_playlist_order", JSON.stringify(ids));
    }
    const onDragEnd = (evt) => {
      if (evt.moved) {
        console.log("[HomeView] 歌单顺序已变更，保存到 localStorage");
        savePlaylistOrder();
      }
    };
    function postSkinSandboxAction(action, payload = {}) {
      if (typeof window === "undefined" || window.parent === window) return;
      const targetOrigin = window.location.origin && window.location.origin !== "null" ? window.location.origin : "*";
      window.parent.postMessage({
        type: SKIN_SANDBOX_MESSAGE_TYPE,
        action,
        payload
      }, targetOrigin);
    }
    async function confirmExitSkinSandbox() {
      const confirmed = await showGlobalConfirm({
        title: "退出沙盒",
        message: "将离开当前皮肤编辑预览，未保存的抽屉改动不会自动写入正式皮肤。确认退出吗？",
        confirmText: "确认退出",
        cancelText: "继续编辑"
      });
      if (confirmed) {
        postSkinSandboxAction("exit-sandbox");
      }
    }
    const {
      viewportB,
      queueContainer,
      renderedQueue,
      displayRange,
      queueStyle,
      updateMeasurements,
      syncDisplay,
      handlePointerDown,
      handlePointerMove,
      handlePointerUp
    } = useHomeQueueMotion(computed(() => playlistStore.queue || []), computed(() => playerStore.currentHashId));
    const playlists2 = ref([]);
    const isHomeBooting = ref(true);
    const showHomeSkeleton = computed(() => isHomeBooting.value && playlists2.value.length === 0);
    const homePlaylistContentVisible = computed(() => !showHomeSkeleton.value);
    const hasLocalMusic = computed(() => playlists2.value.some((p) => p.id === "local_music"));
    const router2 = useRouter();
    function clonePlaylistSnapshot(source = []) {
      return Array.isArray(source) ? source.filter((item) => item && typeof item === "object").map((item) => ({ ...item })) : [];
    }
    function restoreHomePlaylistsFromCache() {
      const cachedState = cacheStore.getHomeState();
      const cachedSnapshot = Array.isArray(cachedState?.playlistsSnapshot) ? cachedState.playlistsSnapshot : [];
      if (cachedSnapshot.length === 0) {
        return false;
      }
      playlists2.value = normalizePlaylists(clonePlaylistSnapshot(cachedSnapshot));
      return true;
    }
    function persistHomePlaylistsSnapshot() {
      cacheStore.saveHomeState({
        playlistsSnapshot: clonePlaylistSnapshot(playlists2.value)
      });
    }
    const homeHeroFrameStyle = computed(() => ({
      borderRadius: `${homeHeroPanel.value?.enabled ? Math.round(Number(homeHeroPanel.value?.radius || 10)) : 10}px`,
      boxShadow: homeHeroPanel.value?.enabled && Number(homeHeroPanel.value?.shadow || 0) > 0 ? `0 18px ${Math.round(Number(homeHeroPanel.value.shadow || 0) * 1.3)}px rgba(10, 22, 34, 0.16)` : void 0
    }));
    const homeHeroMediaStyle = computed(() => buildSkinMediaElementStyle(homeHeroPanel.value, {
      defaultFit: "contain",
      enabledOnly: false
    }));
    const homeHeroOverlayStyle = computed(() => ({
      background: `rgba(8, 18, 29, ${Number(homeHeroPanel.value?.overlayOpacity || 0)})`,
      backdropFilter: Number(homeHeroPanel.value?.blur || 0) ? `blur(${Math.round(Number(homeHeroPanel.value.blur || 0))}px)` : "none",
      WebkitBackdropFilter: Number(homeHeroPanel.value?.blur || 0) ? `blur(${Math.round(Number(homeHeroPanel.value.blur || 0))}px)` : "none"
    }));
    const homePlaylistCoverFrameStyle = computed(() => ({
      borderRadius: `${homePlaylistCoverSkin.value?.enabled ? Math.round(Number(homePlaylistCoverSkin.value?.radius || 8)) : Math.round(Number(pageHomeSkin.value?.coverRadius || 8))}px`,
      boxShadow: homePlaylistCoverSkin.value?.enabled && Number(homePlaylistCoverSkin.value?.shadow || 0) > 0 ? `0 12px ${Math.round(Number(homePlaylistCoverSkin.value.shadow || 0) * 1.1)}px rgba(12, 28, 40, 0.14)` : void 0
    }));
    const homePlaylistCoverImageStyle = computed(() => buildSkinMediaElementStyle(homePlaylistCoverSkin.value, {
      defaultFit: "contain",
      enabledOnly: true
    }));
    const homeSkeletonCoverStyle = computed(() => ({
      borderRadius: homePlaylistCoverFrameStyle.value?.borderRadius
    }));
    function revealPlaylistCover(event) {
      event?.target?.classList?.add("cover-loaded");
    }
    function handlePlaylistCoverError(event, playlistId) {
      const target = event?.target;
      if (!target) return;
      target.classList.add("cover-loaded");
      target.src = `/api/cover/random?seed=${playlistId}_err`;
    }
    const isHomeSelectionMode = computed(() => selectionStore.currentPage === HOME_SELECTION_PAGE && selectionStore.isModeActive && selectionStore.currentType === "playlist");
    function getHomeDeletablePlaylistIds(sourceIds = []) {
      return (sourceIds || []).map((id) => `${id || ""}`.trim()).filter((id) => id && !PINNED_IDS.includes(id) && id.startsWith("custom_"));
    }
    function refreshHomePlaylistsFromData(data) {
      playlists2.value = normalizePlaylists(data?.playlists || []);
    }
    async function refreshHomePlaylists(applyToState = true) {
      const res = await apiRequest("/api/playlists");
      const data = await res.json();
      if (applyToState) {
        refreshHomePlaylistsFromData(data);
      }
      return data;
    }
    async function handleDeleteSelectedPlaylists(selectedIds = []) {
      const deletableIds = getHomeDeletablePlaylistIds(selectedIds);
      const blockedCount = Math.max((selectedIds || []).length - deletableIds.length, 0);
      if (deletableIds.length === 0) {
        showGlobalToast("未选中可删除的自建歌单", { type: "warning" });
        return false;
      }
      const firstConfirm = await showGlobalConfirm({
        title: "批量删除歌单",
        message: `将删除 ${deletableIds.length} 个自建歌单，删除后不可恢复。`,
        confirmText: "继续",
        cancelText: "取消"
      });
      if (!firstConfirm) return false;
      const secondConfirm = await showGlobalConfirm({
        title: "请再次确认",
        message: "该操作会永久删除所选歌单及其索引关系，是否确认执行？",
        confirmText: "确认删除",
        cancelText: "再想想"
      });
      if (!secondConfirm) return false;
      let responseData = null;
      try {
        const res = await apiRequest("/api/playlists/batch-delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playlistIds: deletableIds })
        });
        responseData = await res.json();
        if (!res.ok) {
          showGlobalToast(responseData?.error || "批量删除歌单失败", { type: "error" });
          return false;
        }
      } catch (error) {
        showGlobalToast(`批量删除歌单失败: ${error?.message || "未知错误"}`, { type: "error" });
        return false;
      }
      try {
        await refreshHomePlaylists();
      } catch (_) {
      }
      const removedCount = Number(responseData?.removedCount);
      const removed = Number.isFinite(removedCount) ? removedCount : deletableIds.length;
      const blocked = blockedCount + (Array.isArray(responseData?.blockedIds) ? responseData.blockedIds.length : 0);
      const suffix = blocked > 0 ? `，${blocked} 个受保护歌单已跳过` : "";
      showGlobalToast(`已删除 ${removed} 个歌单${suffix}`);
      return true;
    }
    const selectionModeService = useSelectionModeMicroservice({
      selectionStore,
      playlistStore,
      isMenuOpen,
      getAllIds: () => playlists2.value.map((playlist) => `${playlist?.id || ""}`.trim()).filter((id) => id && id.startsWith("custom_") && !PINNED_IDS.includes(id)),
      runDelete: async (selectedIds) => handleDeleteSelectedPlaylists(selectedIds)
    });
    const closeMode = selectionModeService.closeMode;
    const selectAll = selectionModeService.selectAll;
    const handleAction = selectionModeService.handleAction;
    const showDataEditDialog = ref(false);
    const editingData = ref(null);
    const isImporting = ref(false);
    const importProgressMsg = ref("");
    let importPollTimer = null;
    async function handleImportLocal() {
      if (isImporting.value) return;
      try {
        isImporting.value = true;
        importProgressMsg.value = "正在启动扫描...";
        const res = await apiRequest("/api/playlist/scan-local", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: "" })
        });
        const data = await res.json();
        if (!res.ok) {
          isImporting.value = false;
          showGlobalToast("扫描失败: " + (data.error || "Unknown error"), { type: "error" });
          return;
        }
        const resp = data.data || data;
        if (!resp.started && !resp.alreadyRunning) {
          isImporting.value = false;
          return;
        }
        const poll = async () => {
          try {
            const pr = await apiRequest("/api/scan-progress");
            if (!pr.ok) return;
            const raw = await pr.json();
            const pd = raw.data || raw;
            importProgressMsg.value = pd.message || "扫描中...";
            if (!pd.isRunning) {
              clearInterval(importPollTimer);
              importPollTimer = null;
              isImporting.value = false;
              if (pd.phase === "error") {
                showGlobalToast("扫描出错: " + (pd.error || "未知"), { type: "error" });
              } else {
                const msg = pd.newCount > 0 ? `扫描完成！新增 ${pd.newCount} 首歌曲，总计 ${pd.count} 首` : `扫描完成！未发现新歌曲，总计 ${pd.count} 首`;
                showGlobalToast(msg);
              }
              const r = await apiRequest("/api/playlists");
              const d = await r.json();
              playlists2.value = normalizePlaylists(d.playlists || []);
            }
          } catch (_) {
          }
        };
        clearInterval(importPollTimer);
        importPollTimer = setInterval(poll, 600);
        poll();
      } catch (e) {
        isImporting.value = false;
        console.error(e);
        showGlobalToast("扫描请求失败: " + e.message, { type: "error" });
      }
    }
    function onPlaylistClick(id) {
      try {
        router2.push(`/playlist/${id}`);
      } catch (e) {
        console.warn(e);
      }
    }
    function handlePlaylistPrimaryClick(id) {
      const playlistId = `${id || ""}`.trim();
      if (!playlistId) return;
      if (isHomeSelectionMode.value) {
        if (isPinned(playlistId)) {
          showGlobalToast("系统歌单不支持删除", { type: "warning" });
          return;
        }
        selectionStore.toggleItem(playlistId);
        return;
      }
      onPlaylistClick(playlistId);
    }
    function handlePlaylistTouchStart(event, playlist) {
      const id = `${playlist?.id || ""}`.trim();
      if (!id || isPinned(id)) return;
      if (event?.target?.closest && event.target.closest(".drag-handle")) return;
      baseHandleTouchStart(event, "playlist", id);
    }
    function handlePlaylistTouchMove(event) {
      baseHandleTouchMove(event);
    }
    function handlePlaylistTouchEnd(event) {
      baseHandleTouchEnd(event);
    }
    function openDataEdit(playlist) {
      if (isHomeSelectionMode.value) {
        const id = `${playlist?.id || ""}`.trim();
        if (!id) return;
        if (isPinned(id)) {
          showGlobalToast("系统歌单不支持删除", { type: "warning" });
          return;
        }
        selectionStore.toggleItem(id);
        return;
      }
      console.log("打开歌单编辑对话框:", playlist);
      editingData.value = playlist;
      showDataEditDialog.value = true;
    }
    async function handleDataSaved(updateData) {
      console.log("接收到更新数据:", updateData);
      if (editingData.value) {
        Object.assign(editingData.value, updateData);
      }
      if (editingData.value && Array.isArray(playlists2.value)) {
        const editedId = `${editingData.value.id || ""}`.trim();
        const idx = playlists2.value.findIndex((p) => `${p?.id || ""}` === editedId);
        if (idx >= 0) {
          const updated = { ...playlists2.value[idx], ...updateData };
          playlists2.value[idx] = updated;
          cacheStore.saveHomeState({ playlistsSnapshot: playlists2.value });
        }
      }
      try {
        await refreshHomePlaylists();
        console.log("歌单列表已刷新");
      } catch (e) {
        console.error("刷新歌单列表失败:", e);
      }
    }
    const currentPlaylist = computed(() => {
      const contextId = playerStore._playbackContextId;
      if (contextId && Array.isArray(playlists2.value)) {
        const found = playlists2.value.find((p) => `${p?.id || ""}` === `${contextId}`);
        if (found) return found;
      }
      if (playerStore.currentTrack && Array.isArray(playlists2.value)) {
        for (const pl of playlists2.value) {
          if (!pl || typeof pl !== "object") continue;
        }
      }
      return null;
    });
    const currentCover = computed(() => {
      const t = playerStore.currentTrack;
      if (t) {
        const trackCover = getSongCoverSrc(t);
        if (trackCover) return trackCover;
      }
      const pl = currentPlaylist.value;
      if (pl) {
        const url = processCoverUrl(pl);
        if (url) return url;
      }
      return emptyCoverSrc;
    });
    const readyHomeCover = useReadyCover(currentCover, emptyCoverSrc);
    const currentTitle = computed(() => playerStore.currentTrack?.title || "暂无播放");
    const currentArtist = computed(() => playerStore.currentTrack ? formatArtistProducer(playerStore.currentTrack) : "");
    function handleQueueClick(song) {
      playerStore.playTrack(song, {
        triggerSource: "manual_user",
        switchReason: "home_queue_click"
      });
    }
    onBeforeMount(() => {
      selectionStore.setCurrentPage(HOME_SELECTION_PAGE);
      const restored = restoreHomePlaylistsFromCache();
      isHomeBooting.value = !restored;
      if (currentCover.value) prefetchImage(currentCover.value);
    });
    pageLifecycle.onMounted(async () => {
      selectionStore.setCurrentPage(HOME_SELECTION_PAGE);
      await nextTick();
      if (playlists2.value.length > 0) {
        cacheStore.isHomeReady = true;
      }
      const handlePlaylistUpdated = (evt) => {
        const payload = evt?.detail || {};
        const playlistId = `${payload?.playlistId || ""}`.trim();
        if (playlistId === "bili_downloads") {
          refreshHomePlaylists();
        }
      };
      window.addEventListener("playlist-song-updated", handlePlaylistUpdated);
      try {
        const data = await refreshHomePlaylists(false);
        const allPlaylists = normalizePlaylists(data.playlists || []);
        const CHUNK_SIZE = 8;
        let count = 0;
        const firstChunk = allPlaylists.slice(0, CHUNK_SIZE);
        playlists2.value = firstChunk;
        persistHomePlaylistsSnapshot();
        firstChunk.forEach((pl) => {
          const cover = processCoverUrl(pl) || `/api/cover/random?seed=${pl.id}`;
          prefetchImage(cover);
        });
        count = CHUNK_SIZE;
        isHomeBooting.value = false;
        await nextTick();
        cacheStore.isHomeReady = true;
        const renderMore = () => {
          if (count >= allPlaylists.length) return;
          const next = allPlaylists.slice(count, count + CHUNK_SIZE);
          playlists2.value.push(...next);
          persistHomePlaylistsSnapshot();
          setTimeout(() => {
            next.forEach((pl) => {
              const cover = processCoverUrl(pl) || `/api/cover/random?seed=${pl.id}`;
              prefetchImage(cover);
            });
          }, 0);
          count += CHUNK_SIZE;
          setTimeout(renderMore, 32);
        };
        if (count < allPlaylists.length) {
          setTimeout(renderMore, 200);
        }
      } catch (e) {
        isHomeBooting.value = false;
        await nextTick();
        cacheStore.isHomeReady = true;
      }
      await nextTick();
      updateMeasurements();
      syncDisplay();
    });
    onUnmounted(() => {
      persistHomePlaylistsSnapshot();
    });
    pageLifecycle.onActivated(async ({ shouldRestore } = {}) => {
      console.log(`🔄 HomeView 已激活，shouldRestore=${shouldRestore}`);
      selectionStore.setCurrentPage(HOME_SELECTION_PAGE);
      if (!shouldRestore) {
        if (playlists2.value.length === 0 && restoreHomePlaylistsFromCache()) {
          isHomeBooting.value = false;
        }
        try {
          await refreshHomePlaylists();
          persistHomePlaylistsSnapshot();
          console.log("✅ 歌单列表已刷新:", playlists2.value.length, "个");
        } catch (e) {
          console.error("刷新歌单列表失败:", e);
        }
      }
      await nextTick();
      updateMeasurements();
      syncDisplay();
    });
    pageLifecycle.onDeactivated(() => {
      isMenuOpen.value = false;
      persistHomePlaylistsSnapshot();
      console.log("💤 HomeView 已停用");
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("div", _hoisted_1$1, [
          createBaseVNode("div", _hoisted_2$1, [
            createBaseVNode("div", {
              class: "abode-box",
              style: normalizeStyle(homeHeroFrameStyle.value)
            }, [
              unref(homeHeroPanel).enabled && unref(homeHeroMediaSrc) ? (openBlock(), createElementBlock("div", _hoisted_3$1, [
                createBaseVNode("img", {
                  src: unref(homeHeroMediaSrc),
                  style: normalizeStyle(homeHeroMediaStyle.value),
                  alt: "Home Hero Skin"
                }, null, 12, _hoisted_4$1),
                createBaseVNode("div", {
                  class: "skin-media-overlay",
                  style: normalizeStyle(homeHeroOverlayStyle.value)
                }, null, 4)
              ])) : createCommentVNode("", true),
              createBaseVNode("div", _hoisted_5, [
                createBaseVNode("img", {
                  src: unref(readyHomeCover),
                  alt: "播放封面",
                  referrerpolicy: "no-referrer",
                  onError: _cache[0] || (_cache[0] = (e) => e.target.src = unref(emptyCoverSrc))
                }, null, 40, _hoisted_6)
              ]),
              createBaseVNode("div", {
                class: "abode-playlist skin-region-foreground",
                ref_key: "viewportB",
                ref: viewportB,
                onPointerdown: _cache[1] || (_cache[1] = (...args) => unref(handlePointerDown) && unref(handlePointerDown)(...args)),
                onPointermove: _cache[2] || (_cache[2] = (...args) => unref(handlePointerMove) && unref(handlePointerMove)(...args)),
                onPointerup: _cache[3] || (_cache[3] = (...args) => unref(handlePointerUp) && unref(handlePointerUp)(...args)),
                onPointerleave: _cache[4] || (_cache[4] = (...args) => unref(handlePointerUp) && unref(handlePointerUp)(...args)),
                onPointercancel: _cache[5] || (_cache[5] = (...args) => unref(handlePointerUp) && unref(handlePointerUp)(...args))
              }, [
                unref(renderedQueue).length ? (openBlock(), createElementBlock("div", {
                  key: 0,
                  class: "abode-queue abode-queue-motion",
                  ref_key: "queueContainer",
                  ref: queueContainer,
                  style: normalizeStyle(unref(queueStyle))
                }, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(unref(renderedQueue), (song, idx) => {
                    return openBlock(), createElementBlock("div", {
                      key: song.hash_id || song.id || idx,
                      class: normalizeClass(["abode-queue-item", { active: (song.hash_id ?? song.id) === unref(playerStore).currentHashId }]),
                      onClick: ($event) => handleQueueClick(song)
                    }, [
                      createBaseVNode("div", _hoisted_8, toDisplayString(unref(displayRange).start + idx + 1), 1),
                      createBaseVNode("div", _hoisted_9, [
                        createBaseVNode("div", _hoisted_10, toDisplayString(unref(formatTitle)(song)), 1),
                        createBaseVNode("div", _hoisted_11, toDisplayString(unref(formatArtistProducer)(song)), 1)
                      ])
                    ], 10, _hoisted_7);
                  }), 128))
                ], 4)) : (openBlock(), createElementBlock("div", _hoisted_12, [
                  createBaseVNode("div", _hoisted_13, toDisplayString(currentTitle.value), 1),
                  createBaseVNode("div", _hoisted_14, toDisplayString(currentArtist.value), 1)
                ]))
              ], 544)
            ], 4)
          ]),
          isSkinSandboxHome.value ? (openBlock(), createElementBlock("button", {
            key: 0,
            class: "skin-sandbox-exit-btn",
            type: "button",
            onClick: confirmExitSkinSandbox
          }, " 退出沙盒 ")) : createCommentVNode("", true),
          createBaseVNode("div", _hoisted_15, [
            createVNode(Transition, { name: "home-skeleton-fade" }, {
              default: withCtx(() => [
                showHomeSkeleton.value ? (openBlock(), createElementBlock("div", _hoisted_16, [
                  _cache[21] || (_cache[21] = createBaseVNode("p", { class: "home-playlist-skeleton-caption" }, "正在准备首页内容...", -1)),
                  (openBlock(), createElementBlock(Fragment, null, renderList(HOME_SKELETON_COUNT, (item) => {
                    return createBaseVNode("div", {
                      key: `home-skeleton-${item}`,
                      class: "Playlist-box home-playlist-skeleton-item"
                    }, [
                      createBaseVNode("div", _hoisted_17, [
                        createBaseVNode("div", {
                          class: "cover-box home-playlist-skeleton-cover",
                          style: normalizeStyle(homeSkeletonCoverStyle.value)
                        }, null, 4)
                      ]),
                      _cache[19] || (_cache[19] = createBaseVNode("div", { class: "right-box" }, [
                        createBaseVNode("div", { class: "up-title-box" }, [
                          createBaseVNode("div", { class: "home-playlist-skeleton-line home-playlist-skeleton-line-title" })
                        ]),
                        createBaseVNode("div", { class: "down-playtimes-box" }, [
                          createBaseVNode("div", { class: "home-playlist-skeleton-line home-playlist-skeleton-line-subtitle" })
                        ])
                      ], -1)),
                      _cache[20] || (_cache[20] = createBaseVNode("div", {
                        class: "home-playlist-skeleton-drag",
                        "aria-hidden": "true"
                      }, null, -1))
                    ]);
                  }), 64))
                ])) : createCommentVNode("", true)
              ]),
              _: 1
            }),
            createBaseVNode("div", {
              class: normalizeClass(["home-playlist-content", { "is-revealed": homePlaylistContentVisible.value }])
            }, [
              !hasLocalMusic.value && !showHomeSkeleton.value ? (openBlock(), createElementBlock("div", {
                key: 0,
                class: "Playlist-box",
                onClick: _cache[6] || (_cache[6] = ($event) => !isImporting.value && handleImportLocal())
              }, [
                createBaseVNode("div", _hoisted_18, [
                  createBaseVNode("div", _hoisted_19, [
                    createBaseVNode("span", _hoisted_20, toDisplayString(isImporting.value ? "⏳" : "📂"), 1)
                  ])
                ]),
                createBaseVNode("div", _hoisted_21, [
                  createBaseVNode("div", _hoisted_22, [
                    createBaseVNode("p", null, toDisplayString(isImporting.value ? "扫描中..." : "导入本地音乐"), 1)
                  ]),
                  createBaseVNode("div", _hoisted_23, [
                    isImporting.value ? (openBlock(), createElementBlock("p", _hoisted_24, toDisplayString(importProgressMsg.value || "正在扫描音频文件..."), 1)) : (openBlock(), createElementBlock("p", _hoisted_25, "点击扫描本机音频"))
                  ])
                ])
              ])) : createCommentVNode("", true),
              withDirectives(createVNode(unref(draggable), {
                modelValue: playlists2.value,
                "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => playlists2.value = $event),
                "item-key": "id",
                tag: "div",
                class: "playlist-drag-list",
                handle: ".drag-handle",
                animation: 150,
                scroll: true,
                "scroll-sensitivity": 50,
                "scroll-speed": 25,
                delay: DRAG_DELAY,
                "delay-on-touch-only": true,
                "touch-start-threshold": 5,
                "force-fallback": true,
                "fallback-tolerance": 0,
                "fallback-on-body": true,
                "fallback-class": "sortable-fallback",
                "ghost-class": "sortable-ghost",
                "drag-class": "sortable-drag",
                "chosen-class": "sortable-chosen",
                onChange: onDragEnd
              }, {
                item: withCtx(({ element: pl }) => [
                  createBaseVNode("div", {
                    class: normalizeClass(["Playlist-box", {
                      "is-pinned": isPinned(pl.id),
                      "is-selected": isHomeSelectionMode.value && unref(selectionStore).selectedIds.has(pl.id)
                    }]),
                    "data-skin-sandbox-pass-click": "1",
                    onClick: ($event) => handlePlaylistPrimaryClick(pl.id),
                    onTouchstart: ($event) => handlePlaylistTouchStart($event, pl),
                    onTouchmove: handlePlaylistTouchMove,
                    onTouchend: handlePlaylistTouchEnd,
                    onTouchcancel: handlePlaylistTouchEnd
                  }, [
                    createBaseVNode("div", {
                      class: "left-box-main",
                      onClick: withModifiers(($event) => openDataEdit(pl), ["stop"]),
                      onPointerdown: _cache[7] || (_cache[7] = withModifiers(() => {
                      }, ["stop"])),
                      onPointerup: _cache[8] || (_cache[8] = withModifiers(() => {
                      }, ["stop"])),
                      onPointercancel: _cache[9] || (_cache[9] = withModifiers(() => {
                      }, ["stop"])),
                      onPointerleave: _cache[10] || (_cache[10] = withModifiers(() => {
                      }, ["stop"]))
                    }, [
                      createBaseVNode("div", {
                        class: "cover-box",
                        style: normalizeStyle(homePlaylistCoverFrameStyle.value)
                      }, [
                        createBaseVNode("img", {
                          class: "home-playlist-cover-img",
                          style: normalizeStyle(homePlaylistCoverImageStyle.value),
                          src: unref(processCoverUrl)(pl) || `/api/cover/random?seed=${pl.id}`,
                          loading: "lazy",
                          decoding: "async",
                          referrerpolicy: "no-referrer",
                          onLoad: revealPlaylistCover,
                          onError: ($event) => handlePlaylistCoverError($event, pl.id)
                        }, null, 44, _hoisted_28)
                      ], 4)
                    ], 40, _hoisted_27),
                    createBaseVNode("div", {
                      class: "right-box",
                      "data-skin-sandbox-pass-click": "1",
                      onClick: withModifiers(($event) => handlePlaylistPrimaryClick(pl.id), ["stop"])
                    }, [
                      createBaseVNode("div", _hoisted_30, [
                        createBaseVNode("p", null, toDisplayString(unref(formatPlaylistName)(pl)), 1),
                        isPinned(pl.id) ? (openBlock(), createElementBlock("span", _hoisted_31, [
                          createVNode(SvgIcon, {
                            class: "pinned-badge-icon",
                            name: "musicPendant",
                            size: "16"
                          })
                        ])) : createCommentVNode("", true)
                      ]),
                      createBaseVNode("div", _hoisted_32, [
                        createBaseVNode("p", null, toDisplayString(pl.count || 0) + " 首歌曲", 1)
                      ])
                    ], 8, _hoisted_29),
                    canDrag(pl.id) ? (openBlock(), createElementBlock("div", {
                      key: 0,
                      class: "drag-handle",
                      onClick: _cache[11] || (_cache[11] = withModifiers(() => {
                      }, ["stop"])),
                      onTouchstart: _cache[12] || (_cache[12] = withModifiers(() => {
                      }, ["stop"])),
                      title: "拖拽排序"
                    }, [..._cache[22] || (_cache[22] = [
                      createBaseVNode("span", null, "⠇", -1)
                    ])], 32)) : createCommentVNode("", true)
                  ], 42, _hoisted_26)
                ]),
                _: 1
              }, 8, ["modelValue"]), [
                [vShow, playlists2.value.length > 0]
              ])
            ], 2)
          ]),
          createVNode(Transition, { name: "fade" }, {
            default: withCtx(() => [
              isHomeSelectionMode.value ? (openBlock(), createElementBlock("div", _hoisted_33, [
                createVNode(Transition, { name: "slide-up" }, {
                  default: withCtx(() => [
                    isMenuOpen.value ? (openBlock(), createElementBlock("div", _hoisted_34, [
                      createBaseVNode("div", {
                        class: "menu-item delete danger-soft",
                        onClick: _cache[14] || (_cache[14] = ($event) => unref(handleAction)("delete"))
                      }, "删除歌单"),
                      createBaseVNode("div", {
                        class: "menu-item",
                        onClick: _cache[15] || (_cache[15] = (...args) => unref(selectAll) && unref(selectAll)(...args))
                      }, "全选"),
                      _cache[23] || (_cache[23] = createBaseVNode("div", { class: "menu-divider" }, null, -1)),
                      createBaseVNode("div", {
                        class: "menu-item cancel",
                        onClick: _cache[16] || (_cache[16] = (...args) => unref(closeMode) && unref(closeMode)(...args))
                      }, "退出选择")
                    ])) : createCommentVNode("", true)
                  ]),
                  _: 1
                }),
                createBaseVNode("button", {
                  class: "fab-main-btn",
                  onClick: _cache[17] || (_cache[17] = ($event) => isMenuOpen.value = !isMenuOpen.value)
                }, [
                  unref(selectionStore).selectedIds.size > 0 ? (openBlock(), createElementBlock("span", _hoisted_35, toDisplayString(unref(selectionStore).selectedIds.size), 1)) : createCommentVNode("", true),
                  _cache[24] || (_cache[24] = createBaseVNode("svg", {
                    width: "24",
                    height: "24",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg"
                  }, [
                    createBaseVNode("circle", {
                      cx: "5",
                      cy: "12",
                      r: "2",
                      fill: "currentColor"
                    }),
                    createBaseVNode("circle", {
                      cx: "12",
                      cy: "12",
                      r: "2",
                      fill: "currentColor"
                    }),
                    createBaseVNode("circle", {
                      cx: "19",
                      cy: "12",
                      r: "2",
                      fill: "currentColor"
                    })
                  ], -1))
                ])
              ])) : createCommentVNode("", true)
            ]),
            _: 1
          })
        ]),
        createVNode(DataEditDialog, {
          visible: showDataEditDialog.value,
          "onUpdate:visible": _cache[18] || (_cache[18] = ($event) => showDataEditDialog.value = $event),
          data: editingData.value,
          "is-playlist": true,
          onSaved: handleDataSaved
        }, null, 8, ["visible", "data"])
      ], 64);
    };
  }
});
const HomeView = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-317e32bf"]]);
const PlaylistDetailView = () => __vitePreload(() => import("./PlaylistDetailView.js"), true ? __vite__mapDeps([0,1,2,3,4,5]) : void 0, import.meta.url);
const SearchView = () => __vitePreload(() => import("./SearchView.js"), true ? __vite__mapDeps([6,1,3,4,2,7]) : void 0, import.meta.url);
const AccountView = () => __vitePreload(() => import("./AccountView.js"), true ? __vite__mapDeps([8,1,9,10]) : void 0, import.meta.url);
const ListenStatsView = () => __vitePreload(() => import("./ListenStatsView.js"), true ? __vite__mapDeps([11,1,12]) : void 0, import.meta.url);
const BiliFavoriteView = () => __vitePreload(() => import("./BiliFavoriteView.js"), true ? __vite__mapDeps([13,1,3,4,14]) : void 0, import.meta.url);
const UserProfileView = () => __vitePreload(() => import("./UserProfileView.js"), true ? __vite__mapDeps([15,1,16]) : void 0, import.meta.url);
const SkinStudioView = () => __vitePreload(() => import("./SkinStudioView.js"), true ? __vite__mapDeps([17,1,18]) : void 0, import.meta.url);
const primaryViewLoaders = [PlaylistDetailView, SearchView];
const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView
  },
  {
    path: "/playlist/:id",
    name: "playlist",
    component: PlaylistDetailView,
    props: true
    // Pass :id as props to the component
  },
  {
    path: "/search",
    name: "search",
    component: SearchView
  },
  {
    path: "/account",
    name: "account",
    component: AccountView
  },
  {
    path: "/listen-stats",
    name: "listen-stats",
    component: ListenStatsView
  },
  {
    path: "/bili-favorite",
    name: "bili-favorite",
    component: BiliFavoriteView
  },
  {
    path: "/profile",
    name: "profile",
    component: UserProfileView
  },
  {
    path: "/skin-studio",
    name: "skin-studio",
    component: SkinStudioView
  }
];
const router = createRouter({
  history: createWebHashHistory(),
  routes
});
let stateMachine = null;
let stateMachinePromise = null;
async function getStateMachine() {
  if (stateMachine) {
    return stateMachine;
  }
  if (stateMachinePromise) {
    return stateMachinePromise;
  }
  stateMachinePromise = (async () => {
    const { createPageStateMachine: createPageStateMachine2 } = await __vitePreload(async () => {
      const { createPageStateMachine: createPageStateMachine3 } = await Promise.resolve().then(() => pageStateMachine);
      return { createPageStateMachine: createPageStateMachine3 };
    }, true ? void 0 : void 0, import.meta.url);
    stateMachine = createPageStateMachine2();
    stateMachinePromise = null;
    return stateMachine;
  })();
  return stateMachinePromise;
}
router.beforeEach(async (to, from, next) => {
  const isIframeRuntime = typeof window !== "undefined" && window.parent !== window;
  const sandboxQueryFrom = `${from?.query?.skinSandbox || ""}`;
  const sandboxQueryTo = `${to?.query?.skinSandbox || ""}`;
  const shouldPreserveSkinSandbox = isIframeRuntime && to.name !== "skin-studio" && (sandboxQueryFrom === "1" || sandboxQueryTo === "1") && sandboxQueryTo !== "1";
  if (shouldPreserveSkinSandbox) {
    const sandboxQuery = {
      ...to.query || {},
      skinSandbox: "1"
    };
    if (to.name) {
      next({
        name: to.name,
        params: to.params,
        query: sandboxQuery,
        hash: to.hash,
        replace: true
      });
    } else {
      next({
        path: to.path,
        query: sandboxQuery,
        hash: to.hash,
        replace: true
      });
    }
    return;
  }
  try {
    const sm = await getStateMachine();
    if (sm) {
      sm.transition(to, from);
    }
  } catch (error) {
    console.error("[Router] 状态机转换失败:", error);
  }
  next();
});
const SPLASH_BACKGROUND = "#f2f5f8";
let syncGeneration = 0;
let pendingKey = "";
let pendingSync = null;
function afterStartupPaint() {
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}
function snapshotKey(target) {
  const value = JSON.stringify([target, innerWidth, innerHeight]);
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) hash = Math.imul(hash ^ value.charCodeAt(i), 16777619);
  return `splash-v2-${hash >>> 0}-${value.length}`;
}
async function loadSnapshotMedia(target) {
  const src = await resolveSkinMediaSrc(target.mediaSrc);
  if (!src) throw new Error("开屏素材无法读取，请重新上传后保存");
  const isVideo = target.mediaType === "video";
  const media = document.createElement(isVideo ? "video" : "img");
  if (isVideo) {
    media.muted = true;
    media.playsInline = true;
    media.preload = "auto";
  } else {
    media.crossOrigin = "anonymous";
  }
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => finish(new Error("开屏素材加载超时")), 8e3);
    const finish = (error) => {
      clearTimeout(timer);
      media.onload = media.onloadeddata = media.onerror = null;
      if (error) reject(error);
      else resolve();
    };
    media[isVideo ? "onloadeddata" : "onload"] = () => finish();
    media.onerror = () => finish(new Error("开屏素材无法解码"));
    media.src = src;
  });
  if (!isVideo && media.decode) await media.decode();
  return media;
}
function renderSnapshot(media, target) {
  const width = Math.max(1, innerWidth);
  const height = Math.max(1, innerHeight);
  const ratio = Math.min(devicePixelRatio || 1, 1920 / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  const ctx = canvas.getContext("2d");
  ctx.scale(ratio, ratio);
  ctx.fillStyle = SPLASH_BACKGROUND;
  ctx.fillRect(0, 0, width, height);
  const mediaWidth = media.naturalWidth || media.videoWidth;
  const mediaHeight = media.naturalHeight || media.videoHeight;
  const size = getSkinMediaFitScale(mediaWidth, mediaHeight, width, height, target.mediaFit);
  const scale = Number(target.scale ?? 1);
  ctx.save();
  ctx.translate(width / 2 + Number(target.translateX || 0), height / 2 + Number(target.translateY || 0));
  ctx.scale(scale, scale);
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(-width / 2, -height / 2, width, height, Number(target.radius || 0));
  else ctx.rect(-width / 2, -height / 2, width, height);
  ctx.clip();
  if (target.blur) ctx.filter = `blur(${Number(target.blur)}px)`;
  ctx.drawImage(media, -mediaWidth * size / 2, -mediaHeight * size / 2, mediaWidth * size, mediaHeight * size);
  ctx.restore();
  ctx.fillStyle = `rgba(0,0,0,${Number(target.overlayOpacity ?? 0)})`;
  ctx.fillRect(0, 0, width, height);
  return canvas.toDataURL("image/png");
}
function syncNativeStartupSplash(config = loadSkinThemeConfig()) {
  const bridge = window.AndroidStartup;
  if (!bridge || window.parent !== window) return Promise.resolve();
  const target = config.targets?.splash_screen;
  const enabled = Boolean(target?.enabled && target?.mediaSrc && target.mediaType !== "live2d");
  const key = enabled ? snapshotKey(target) : "";
  if (pendingSync && key === pendingKey) return pendingSync;
  const generation = ++syncGeneration;
  pendingKey = key;
  pendingSync = (async () => {
    if (!enabled) {
      bridge.clearSnapshot();
      return;
    }
    if (bridge.getSnapshotKey() === key) return;
    const media = await loadSnapshotMedia(target);
    try {
      if (generation !== syncGeneration) return;
      const dataUrl = renderSnapshot(media, target);
      if (!bridge.cacheSnapshot(key, dataUrl)) throw new Error("原生开屏缓存保存失败");
    } finally {
      if (media.tagName === "VIDEO") {
        media.removeAttribute("src");
        media.load();
      }
    }
  })().finally(() => {
    if (generation === syncGeneration) pendingSync = null;
  });
  return pendingSync;
}
function installNativeStartupSplash() {
  if (!window.AndroidStartup || window.parent !== window) return;
  window.__TY_NATIVE_SPLASH_SYNC_PROMISE = syncNativeStartupSplash();
  window.__TY_NATIVE_SPLASH_SYNC_PROMISE.catch((error) => console.warn("[StartupSplash]", error));
  window.addEventListener(SKIN_THEME_UPDATED_EVENT, (event) => {
    syncNativeStartupSplash(event.detail).catch((error) => console.warn("[StartupSplash]", error));
  });
  let viewportWidth = innerWidth;
  let resizeTimer;
  window.addEventListener("resize", () => {
    if (innerWidth === viewportWidth) return;
    viewportWidth = innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      syncNativeStartupSplash().catch((error) => console.warn("[StartupSplash]", error));
    }, 250);
  });
}
async function waitForStartupImages(root = document) {
  const images = Array.from(root.querySelectorAll("img")).filter((image) => {
    if (image.closest("#app-splash") || !image.getAttribute("src")) return false;
    const rect = image.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth;
  });
  await Promise.all(images.map(async (image) => {
    if (!image.complete) await new Promise((resolve, reject) => {
      const finish = (error) => {
        clearTimeout(timer);
        image.removeEventListener("load", finish);
        image.removeEventListener("error", finish);
        if (error instanceof Error) reject(error);
        else resolve();
      };
      const timer = setTimeout(() => finish(new Error("首页图片尚未加载完成")), 8e3);
      image.addEventListener("load", finish, { once: true });
      image.addEventListener("error", finish, { once: true });
      if (image.complete) finish();
    });
    if (image.naturalWidth && image.decode) await image.decode().catch(() => {
    });
  }));
  await afterStartupPaint();
}
const _hoisted_1 = ["src"];
const _hoisted_2 = ["src"];
const _hoisted_3 = ["src", "poster"];
const _hoisted_4 = {
  key: 3,
  class: "music-control-overlay",
  role: "dialog",
  "aria-modal": "true"
};
const MAIN_SCROLL_CACHE_LIMIT = 32;
const _sfc_main = {
  __name: "App",
  setup(__props) {
    const logger2 = createLogger("[App]");
    const MusicControlPage = defineAsyncComponent(() => __vitePreload(() => import("./MusicControlPage.js"), true ? __vite__mapDeps([19,1,9,20]) : void 0, import.meta.url));
    const audioRef = ref(null);
    const mainContentRef = ref(null);
    const route = useRoute();
    const playerStore = usePlayerStore$1();
    const cacheStore = useCacheStore();
    const timerStore = useTimerStore();
    const playlistStore = usePlaylistStore();
    const selectionStore = useSelectionStore();
    const downloadTaskStore = useDownloadTaskStore();
    const loadingManager = useLoadingManager();
    const router2 = useRouter();
    const { useSkinTarget } = useSkinThemeConfig();
    const globalLayoutSkin = useSkinTarget("global_layout");
    const globalBackgroundMediaSrc = useResolvedSkinMediaSrc(computed(() => globalLayoutSkin.value?.enabled && globalLayoutSkin.value?.mediaSrc ? globalLayoutSkin.value?.mediaSrc : ""));
    const globalBackgroundImageSrc = computed(() => globalLayoutSkin.value?.mediaType === "image" ? globalBackgroundMediaSrc.value : "");
    const globalBackgroundVideoSrc = computed(() => globalLayoutSkin.value?.mediaType === "video" ? globalBackgroundMediaSrc.value : "");
    const isGlobalBackgroundImageReady = ref(false);
    const isGlobalBackgroundVideoReady = ref(false);
    const globalBackgroundVideoPosterSrc = ref("");
    const backgroundVideoPosterCache = /* @__PURE__ */ new Map();
    const hasReadyBackgroundMedia = computed(() => {
      if (globalBackgroundImageSrc.value) return isGlobalBackgroundImageReady.value;
      if (globalBackgroundVideoSrc.value) {
        return isGlobalBackgroundVideoReady.value || Boolean(globalBackgroundVideoPosterSrc.value);
      }
      return false;
    });
    const globalBackgroundMediaStyle = computed(() => buildSkinMediaElementStyle(globalLayoutSkin.value, {
      defaultFit: "cover"
    }));
    const isSkinSandboxRuntime2 = computed(() => `${route.query?.skinSandbox || ""}` === "1");
    const mainContentScrollCache = /* @__PURE__ */ new Map();
    let scrollRestoreGeneration = 0;
    const mainScrollFrame = createFrameScheduler((target) => {
      if (mainContentRef.value) mainContentRef.value.scrollTop = target;
    });
    function getMainContentScrollKey(path) {
      const rawPath = String(path || "/").trim();
      if (!rawPath) return "/";
      const hashIndex = rawPath.indexOf("#");
      const withoutHash = hashIndex >= 0 ? rawPath.slice(0, hashIndex) : rawPath;
      const queryIndex = withoutHash.indexOf("?");
      let normalizedPath = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;
      if (!normalizedPath) return "/";
      if (normalizedPath.length > 1) {
        normalizedPath = normalizedPath.replace(/\/+$/, "");
      }
      const playlistMatch = normalizedPath.match(/^\/playlist\/([^/?#]+)/);
      if (playlistMatch?.[1]) {
        try {
          return `/playlist/${decodeURIComponent(playlistMatch[1])}`;
        } catch {
          return `/playlist/${playlistMatch[1]}`;
        }
      }
      return normalizedPath || "/";
    }
    function saveMainContentScroll(path) {
      if (!mainContentRef.value) return;
      const key = getMainContentScrollKey(path);
      mainContentScrollCache.delete(key);
      mainContentScrollCache.set(
        key,
        mainContentRef.value.scrollTop || 0
      );
      while (mainContentScrollCache.size > MAIN_SCROLL_CACHE_LIMIT) {
        mainContentScrollCache.delete(mainContentScrollCache.keys().next().value);
      }
    }
    function restoreMainContentScroll(path, forceTop = false) {
      const token = ++scrollRestoreGeneration;
      mainScrollFrame.cancel();
      const targetScrollTop = forceTop ? 0 : mainContentScrollCache.get(getMainContentScrollKey(path)) || 0;
      nextTick(() => {
        if (token === scrollRestoreGeneration) mainScrollFrame.schedule(targetScrollTop);
      });
    }
    function resolveKeepAliveComponentName(cacheKey) {
      if (!cacheKey || typeof cacheKey !== "string") return "";
      if (cacheKey.startsWith("playlist_")) return "PlaylistDetailView";
      const map = {
        home: "HomeView",
        search: "SearchView",
        account: "account",
        "listen-stats": "ListenStatsView",
        "bili-favorite": "bili-favorite",
        "skin-studio": "SkinStudioView",
        profile: "UserProfileView"
      };
      return map[cacheKey] || "";
    }
    const keepAliveInclude = computed(() => {
      const includes = cacheStore.cachedViews.map(resolveKeepAliveComponentName).filter(Boolean);
      return Array.from(new Set(includes));
    });
    let pageAnimation = null;
    function retriggerPageAnimation() {
      const el = mainContentRef.value;
      pageAnimation?.cancel();
      if (!el?.animate || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      pageAnimation = el.animate([{ opacity: 0.35 }, { opacity: 1 }], { duration: 180, easing: "ease" });
    }
    const mainContentPaddingBottom = computed(() => {
      return "0px";
    });
    const pageBottomScrollSpace = computed(() => {
      return "calc(112px + var(--ty-safe-area-bottom, env(safe-area-inset-bottom, 0px)))";
    });
    function handleAppBack() {
      performAppBack({ playerStore, selectionStore, router: router2 });
    }
    function getPageInstanceKey(route2) {
      let routeName = route2.name;
      if (!routeName) {
        const path = route2.path || "";
        if (path === "/" || path === "") routeName = "home";
        else if (path.startsWith("/playlist/")) routeName = "playlist";
        else if (path === "/search") routeName = "search";
        else if (path === "/account") routeName = "account";
        else if (path === "/listen-stats") routeName = "listen-stats";
        else if (path === "/music-control") routeName = "MusicControlPage";
        else if (path === "/bili-favorite") routeName = "bili-favorite";
        else routeName = path;
      }
      if (routeName === "playlist") {
        return route2.fullPath;
      }
      if (route2.meta.noCache || routeName === "MusicControlPage") {
        return `${routeName}_${Date.now()}`;
      }
      return String(routeName);
    }
    watch(() => route.fullPath, (newPath, oldPath) => {
      if (oldPath) {
        saveMainContentScroll(oldPath);
      }
      const isTempRoute = Boolean(route.meta?.noCache) || route.name === "MusicControlPage";
      const navDirection = cacheStore.routeNavigation?.direction || "forward";
      const shouldRestoreScroll = navDirection === "back" && route.name !== "home" && route.path !== "/";
      restoreMainContentScroll(newPath, isTempRoute || !shouldRestoreScroll);
      if (oldPath) retriggerPageAnimation();
      logger2.log(`route changed: ${oldPath} -> ${newPath}`, cacheStore.cachedViews);
    }, { immediate: true });
    let appReadyFallbackTimer = null;
    let appReadyHardTimer = null;
    let appReadyInFlight = false;
    function clearAppReadyTimers() {
      if (appReadyFallbackTimer) {
        clearTimeout(appReadyFallbackTimer);
        appReadyFallbackTimer = null;
      }
      if (appReadyHardTimer) {
        clearTimeout(appReadyHardTimer);
        appReadyHardTimer = null;
      }
    }
    function disposeStartupResources() {
      clearAppReadyTimers();
      releaseImageCache({ aggressive: false });
    }
    function showStartupFailure(message) {
      if (window.__TY_NATIVE_SPLASH_ACTIVE) {
        window.AndroidStartup.showFailure(message);
      } else {
        const content = document.querySelector("#app-splash .splash-content");
        if (!content) return;
        content.replaceChildren();
        const button = document.createElement("button");
        button.textContent = `${message}，点击重试`;
        button.onclick = () => location.reload();
        content.appendChild(button);
      }
    }
    function waitForStartupBackground() {
      const requiresMedia = () => globalLayoutSkin.value?.enabled && globalLayoutSkin.value?.mediaSrc && ["image", "video"].includes(globalLayoutSkin.value?.mediaType);
      if (!requiresMedia() || hasReadyBackgroundMedia.value) return Promise.resolve();
      return new Promise((resolve, reject) => {
        const stop = watch(() => !requiresMedia() || hasReadyBackgroundMedia.value, (ready) => {
          if (!ready) return;
          clearTimeout(timer);
          stop();
          resolve();
        });
        const timer = setTimeout(() => {
          stop();
          reject(new Error("首页背景尚未加载完成"));
        }, 8e3);
      });
    }
    async function markAppReady(reason = "unknown") {
      if (!document?.body || appReadyInFlight || document.body.classList.contains("app-ready")) return;
      appReadyInFlight = true;
      try {
        if (window.__TY_NATIVE_SPLASH_ACTIVE) await window.__TY_NATIVE_SPLASH_SYNC_PROMISE;
        else await window.__TY_SPLASH_MEDIA_READY_PROMISE;
        await nextTick();
        await waitForStartupBackground();
        playerStore.releaseMiniPlayer("splash-startup");
        await nextTick();
        await waitForStartupImages(document.getElementById("app-container"));
        document.body.classList.add("app-ready");
        await afterStartupPaint();
        if (window.__TY_NATIVE_SPLASH_ACTIVE) window.AndroidStartup.finishStartup();
        logger2.log(`Splash dismissed by: ${reason}`);
        clearAppReadyTimers();
      } catch (error) {
        console.warn("[StartupSplash] 首页交接失败", error);
        showStartupFailure(error?.message || "首页尚未准备完成");
      } finally {
        appReadyInFlight = false;
      }
    }
    function resetGlobalBackgroundMediaState() {
      isGlobalBackgroundImageReady.value = false;
      isGlobalBackgroundVideoReady.value = false;
      globalBackgroundVideoPosterSrc.value = globalBackgroundVideoSrc.value ? backgroundVideoPosterCache.get(globalBackgroundVideoSrc.value) || "" : "";
    }
    function handleGlobalBackgroundImageReady(event) {
      const image = event?.target;
      if (image?.getAttribute?.("src") && image.getAttribute("src") !== globalBackgroundImageSrc.value) return;
      isGlobalBackgroundImageReady.value = true;
    }
    function captureVideoPoster(video) {
      if (!video || !globalBackgroundVideoSrc.value) return;
      const width = video.videoWidth || 0;
      const height = video.videoHeight || 0;
      if (!width || !height) return;
      try {
        const canvas = document.createElement("canvas");
        canvas.width = Math.min(960, width);
        canvas.height = Math.max(1, Math.round(canvas.width / (width / height)));
        const context = canvas.getContext("2d");
        if (!context) return;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const poster = canvas.toDataURL("image/jpeg", 0.78);
        backgroundVideoPosterCache.set(globalBackgroundVideoSrc.value, poster);
        globalBackgroundVideoPosterSrc.value = poster;
      } catch {
      }
    }
    function handleGlobalBackgroundVideoReady(event) {
      const video = event?.target;
      if (!video || video.getAttribute?.("src") !== globalBackgroundVideoSrc.value) return;
      isGlobalBackgroundVideoReady.value = true;
      captureVideoPoster(video);
    }
    function handleGlobalBackgroundMediaError(event) {
      const media = event?.target;
      const mediaSrc = media?.getAttribute?.("src") || "";
      if (mediaSrc && mediaSrc !== globalBackgroundImageSrc.value && mediaSrc !== globalBackgroundVideoSrc.value) return;
      isGlobalBackgroundImageReady.value = false;
      isGlobalBackgroundVideoReady.value = false;
    }
    watch(() => cacheStore.isHomeReady, (ready) => {
      if (ready) {
        markAppReady("home-ready");
        logger2.log("Home ready");
      }
    }, { immediate: false });
    watch(() => selectionStore.isModeActive && !playerStore.showDrawer, (isActive) => {
      if (isActive) {
        playerStore.holdMiniPlayer("selection-mode");
      } else {
        playerStore.releaseMiniPlayer("selection-mode");
      }
    }, { immediate: true });
    watch(
      () => [globalBackgroundMediaSrc.value, globalLayoutSkin.value?.mediaType],
      resetGlobalBackgroundMediaState,
      { immediate: true }
    );
    let cancelViewWarmup = () => {
    };
    onBeforeUnmount(() => cancelViewWarmup());
    onMounted(() => {
      cancelViewWarmup = scheduleViewWarmup(
        primaryViewLoaders,
        () => !cacheStore.isHomeReady || playerStore.showDrawer || selectionStore.isModeActive
      );
      router2.isReady().then(() => {
        const isHomeRoute = route.path === "/" || route.name === "home";
        if (!isHomeRoute) {
          appReadyFallbackTimer = setTimeout(() => {
            markAppReady("router-ready-non-home");
          }, 600);
        }
      }).catch(() => {
        showStartupFailure("首页初始化失败");
      });
      appReadyHardTimer = setTimeout(() => {
        if (!document.body.classList.contains("app-ready")) showStartupFailure("首页准备超时");
      }, 2e4);
      installGlobalBackHandler({ playerStore, selectionStore, router: router2 });
      registerCoreCaches({ cacheStore, loadingManager });
      installMemoryPressureBridge();
      storage.cleanupExpiredUsers();
      const token = localStorage.getItem("userToken");
      const userInfoStr = localStorage.getItem("userInfo");
      if (token && userInfoStr) {
        try {
          const user = JSON.parse(userInfoStr);
          if (user?.id) {
            storage.switchToUser(user.id);
            storage.touchActiveTime();
            logger2.log(`已登录用户 ${user.id}，切换存储命名空间`);
          } else {
            storage.switchToGuest();
          }
        } catch {
          storage.switchToGuest();
        }
      } else {
        storage.switchToGuest();
        logger2.log("未登录，使用 guest 命名空间");
      }
      if (audioRef.value) {
        playerStore.initAudio(audioRef.value);
        playerStore.updateMediaSession();
      }
      window.__tyPlaybackCommand = (cmd, payload) => {
        if (!playerStore?.currentTrack) return false;
        switch (cmd) {
          case "play":
            if (!playerStore.isPlaying) playerStore.togglePlay("media_button");
            break;
          case "pause":
            if (playerStore.isPlaying) playerStore.pause("media_button");
            break;
          case "toggle":
            playerStore.togglePlay("media_button");
            break;
          case "next":
            playerStore.next({ triggerSource: "media_button", switchReason: "media_next" });
            break;
          case "prev":
            playerStore.prev({ triggerSource: "media_button", switchReason: "media_prev" });
            break;
          case "seek": {
            const posMs = Number(payload?.position);
            if (Number.isFinite(posMs) && playerStore.audio && playerStore.audio.duration > 0) {
              playerStore.seek(posMs / 1e3 / playerStore.audio.duration, {
                triggerSource: "media_button",
                source: "media_session_seek"
              });
            }
            break;
          }
          default:
            return false;
        }
        return true;
      };
      window.__tySyncSystemMediaState = () => {
        if (!playerStore) return false;
        try {
          return playerStore.syncSystemMediaStateToNative() === true;
        } catch (_) {
          return false;
        }
      };
      timerStore.initTimerStatus();
      downloadTaskStore.initDeferred(2600);
      window.onPlaylistSongUpdated = (eventStr) => {
        try {
          const ev = typeof eventStr === "string" ? JSON.parse(eventStr) : eventStr;
          try {
            window.dispatchEvent(new CustomEvent("playlist-song-updated", { detail: ev }));
          } catch (_) {
          }
          const { songId, src, cover } = ev;
          if (!songId || !src) return;
          if (playlistStore.queue && playlistStore.queue.length > 0) {
            playlistStore.queue.forEach((song) => {
              if ((song.hash_id || song.id) === songId) {
                song.src = src;
                if (cover) {
                  song.cover = cover;
                }
              }
            });
          }
          if (playerStore.currentHashId === songId && playerStore.currentTrack) {
            playerStore.currentTrack.src = src;
            if (cover) {
              playerStore.currentTrack.cover = cover;
            }
          }
        } catch (e) {
          console.warn("[onPlaylistSongUpdated] parse error", e);
        }
      };
      window.onCoverSyncComplete = (eventStr) => {
        try {
          const ev = typeof eventStr === "string" ? JSON.parse(eventStr) : eventStr;
          logger2.log(`封面同步完成: 新下载=${ev.downloaded}, 已有=${ev.alreadyHave}`);
        } catch (_) {
        }
      };
    });
    onBeforeUnmount(() => {
      ++scrollRestoreGeneration;
      mainScrollFrame.cancel();
      pageAnimation?.cancel();
      disposeStartupResources();
    });
    return (_ctx, _cache) => {
      const _component_router_view = resolveComponent("router-view");
      return openBlock(), createElementBlock("div", {
        id: "app-container",
        class: normalizeClass({
          "has-custom-bg-media": Boolean(unref(globalBackgroundMediaSrc)),
          "has-ready-bg-media": hasReadyBackgroundMedia.value,
          "has-custom-bg-video": Boolean(globalBackgroundVideoSrc.value),
          "has-ready-bg-video": isGlobalBackgroundVideoReady.value
        })
      }, [
        globalBackgroundImageSrc.value ? (openBlock(), createElementBlock("img", {
          key: 0,
          class: normalizeClass(["app-background-media", { "is-ready": isGlobalBackgroundImageReady.value }]),
          src: globalBackgroundImageSrc.value,
          style: normalizeStyle(globalBackgroundMediaStyle.value),
          alt: "",
          draggable: "false",
          decoding: "async",
          onLoad: handleGlobalBackgroundImageReady,
          onError: handleGlobalBackgroundMediaError
        }, null, 46, _hoisted_1)) : createCommentVNode("", true),
        globalBackgroundVideoPosterSrc.value && globalBackgroundVideoSrc.value && !isGlobalBackgroundVideoReady.value ? (openBlock(), createElementBlock("img", {
          key: 1,
          class: "app-background-media app-background-video-poster is-ready",
          src: globalBackgroundVideoPosterSrc.value,
          style: normalizeStyle(globalBackgroundMediaStyle.value),
          alt: "",
          draggable: "false"
        }, null, 12, _hoisted_2)) : createCommentVNode("", true),
        globalBackgroundVideoSrc.value ? (openBlock(), createElementBlock("video", {
          key: 2,
          class: normalizeClass(["app-background-media", { "is-ready": isGlobalBackgroundVideoReady.value }]),
          src: globalBackgroundVideoSrc.value,
          poster: globalBackgroundVideoPosterSrc.value,
          style: normalizeStyle(globalBackgroundMediaStyle.value),
          autoplay: "",
          muted: "",
          loop: "",
          playsinline: "",
          preload: "auto",
          onLoadeddata: handleGlobalBackgroundVideoReady,
          onCanplay: handleGlobalBackgroundVideoReady,
          onPlaying: handleGlobalBackgroundVideoReady,
          onError: handleGlobalBackgroundMediaError
        }, null, 46, _hoisted_3)) : createCommentVNode("", true),
        createVNode(TopNavBar),
        createBaseVNode("main", {
          ref_key: "mainContentRef",
          ref: mainContentRef,
          class: "main-content",
          style: normalizeStyle({
            paddingBottom: mainContentPaddingBottom.value,
            "--page-bottom-scroll-space": pageBottomScrollSpace.value
          })
        }, [
          createVNode(_component_router_view, null, {
            default: withCtx(({ Component }) => [
              (openBlock(), createBlock(KeepAlive, { include: keepAliveInclude.value }, [
                (openBlock(), createBlock(resolveDynamicComponent(Component), {
                  key: getPageInstanceKey(unref(route))
                }))
              ], 1032, ["include"]))
            ]),
            _: 1
          })
        ], 4),
        withDirectives(createVNode(MiniPlayer, null, null, 512), [
          [vShow, !unref(playerStore).hideMiniPlayer && !unref(isMusicControlOpen) && !isSkinSandboxRuntime2.value]
        ]),
        unref(isMusicControlOpen) ? (openBlock(), createElementBlock("section", _hoisted_4, [
          createBaseVNode("button", {
            class: "music-control-close-btn",
            type: "button",
            title: "返回",
            "aria-label": "返回",
            onClick: handleAppBack
          }, [
            createVNode(SvgIcon, {
              class: "music-control-close-icon",
              name: "back",
              size: "22"
            })
          ]),
          createVNode(unref(MusicControlPage))
        ])) : createCommentVNode("", true),
        createVNode(PlaylistDrawer),
        createVNode(_sfc_main$5),
        createVNode(GlobalConfirm),
        createBaseVNode("audio", {
          ref_key: "audioRef",
          ref: audioRef,
          style: { "display": "none" }
        }, null, 512)
      ], 2);
    };
  }
};
function ensureContentSpan(el) {
  const textContent = el.textContent || el.innerText || "";
  const current = el.querySelector(".text-marquee-content") || el.firstChild;
  if (current && current.nodeType === Node.TEXT_NODE) {
    const wrapper = document.createElement("span");
    wrapper.className = "text-marquee-content";
    wrapper.setAttribute("data-text", textContent);
    wrapper.textContent = textContent;
    el.textContent = "";
    el.appendChild(wrapper);
    return wrapper;
  }
  if (current && current.classList) {
    current.classList.add("text-marquee-content");
    current.setAttribute("data-text", textContent);
    return current;
  }
  return null;
}
const states = /* @__PURE__ */ new WeakMap();
const pending = /* @__PURE__ */ new Set();
const measureFrame = createFrameScheduler(() => {
  const entries2 = Array.from(pending).filter((el) => states.has(el) && el.isConnected);
  pending.clear();
  const prepared = entries2.map((el) => ({ el, span: ensureContentSpan(el), state: states.get(el) }));
  const measured = prepared.map(({ el, span, state }) => {
    const range = document.createRange();
    if (span) range.selectNodeContents(span);
    return { el, state, width: el.clientWidth, textWidth: span ? range.getBoundingClientRect().width : 0 };
  });
  measured.forEach(({ el, state, width, textWidth }) => {
    if (state.value === false) return;
    const overflow = width > 0 && textWidth > width + 1;
    el.classList.toggle("is-overflow", overflow);
    if (overflow) el.style.setProperty("--marquee-duration", `${Math.max(Number(state.value?.speed) || 10, textWidth / 50)}s`);
  });
});
function schedule(el, delay = 0) {
  const state = states.get(el);
  if (!state) return;
  clearTimeout(state.timer);
  state.timer = null;
  if (state.value === false) {
    pending.delete(el);
    el.classList.remove("is-overflow");
    el.style.removeProperty("--marquee-duration");
    return;
  }
  const queue = () => {
    pending.add(el);
    measureFrame.schedule();
  };
  if (delay > 0) state.timer = setTimeout(queue, delay);
  else queue();
}
const marqueeDirective = {
  mounted(el, binding) {
    el.classList.add("text-marquee");
    const state = { value: binding.value, speed: binding.value?.speed, enabled: binding.value !== false, text: el.textContent, timer: null, observer: null };
    states.set(el, state);
    if (state.enabled) {
      state.observer = new ResizeObserver(() => schedule(el));
      state.observer.observe(el);
    }
    schedule(el, binding.value?.delay ?? 500);
  },
  updated(el, binding) {
    const state = states.get(el);
    if (!state) return;
    const textChanged = state.text !== el.textContent;
    const changed = textChanged || state.enabled !== (binding.value !== false) || state.speed !== binding.value?.speed;
    state.text = el.textContent;
    state.value = binding.value;
    state.speed = binding.value?.speed;
    state.enabled = binding.value !== false;
    if (!state.enabled) {
      state.observer?.disconnect();
      state.observer = null;
    } else if (!state.observer) {
      state.observer = new ResizeObserver(() => schedule(el));
      state.observer.observe(el);
    }
    if (changed) {
      schedule(el, binding.value === false ? 0 : 60);
    }
  },
  unmounted(el) {
    const state = states.get(el);
    clearTimeout(state?.timer);
    state?.observer?.disconnect();
    pending.delete(el);
    states.delete(el);
    if (!pending.size) measureFrame.cancel();
  }
};
function setupMarqueeDirective(app2) {
  app2.directive("marquee", marqueeDirective);
}
let runtimeInstalled = false;
const mediaCssApplyVersions = /* @__PURE__ */ new WeakMap();
const DEFAULT_PAGE_BG_SRC = getBundledAssetUrl("png/001.png");
function asPx(value, fallback = 0) {
  const num = Number(value);
  return `${Number.isFinite(num) ? Math.round(num) : fallback}px`;
}
function asOpacity(value, fallback = 0) {
  const num = Number(value);
  if (!Number.isFinite(num)) return String(fallback);
  return String(Math.max(0, Math.min(1, num)));
}
function cssUrl(value) {
  const src = `${value || ""}`.trim();
  if (!src) return "none";
  return `url("${src.replace(/["\\]/g, "\\$&")}")`;
}
function getDefaultMediaCssVar(prefix) {
  return prefix === "page-bg" ? cssUrl(DEFAULT_PAGE_BG_SRC) : "none";
}
function setVars(style, vars) {
  for (const [name, value] of Object.entries(vars)) {
    style.setProperty(name, value);
  }
}
function removeVars(style, names) {
  for (const name of names) style.removeProperty(name);
}
const songTargetVarSuffixes = [
  "item-bg",
  "item-bg-image",
  "item-media-opacity",
  "item-media-position",
  "item-media-size",
  "item-radius",
  "cover-radius",
  "button-radius",
  "progress-radius",
  "item-padding",
  "item-gap",
  "list-gap",
  "item-height",
  "cover-size",
  "text",
  "muted",
  "playing",
  "progress",
  "button"
];
const scopedSongTargetPrefixes = ["search-song", "playlist-song", "drawer-song", "bili-video"];
const runtimeMediaTargets = Object.freeze([
  ["page-bg", "global_layout"],
  ["song", "song_item"],
  ["search-song", "search_song_item"],
  ["playlist-song", "playlist_song_item"],
  ["drawer-song", "drawer_song_item"],
  ["bili-video", "bili_video_item"]
]);
function buildSongTargetVars(prefix, target = {}, fallback = {}) {
  const enabled = Boolean(target.enabled);
  const source = enabled ? target : {};
  const fallbackBg = fallback.backgroundColor || "var(--ty-surface-bg)";
  const fallbackText = fallback.textColor || "var(--ty-text-main)";
  const fallbackMuted = fallback.mutedTextColor || "var(--ty-text-muted)";
  const fallbackAccent = fallback.accentColor || "var(--ty-color-accent)";
  return {
    [`--ty-${prefix}-item-bg`]: enabled ? source.backgroundColor || "#ffffff" : fallbackBg,
    [`--ty-${prefix}-item-bg-image`]: enabled && source.mediaType === "image" ? cssUrl(source.mediaSrc) : "none",
    [`--ty-${prefix}-item-media-opacity`]: enabled ? asOpacity(source.mediaOpacity, 0.18) : "0",
    [`--ty-${prefix}-item-media-position`]: source.mediaPosition || "right center",
    [`--ty-${prefix}-item-media-size`]: source.mediaSize || "cover",
    [`--ty-${prefix}-item-radius`]: asPx(enabled ? source.itemRadius : fallback.itemRadius, 12),
    [`--ty-${prefix}-cover-radius`]: asPx(enabled ? source.coverRadius : fallback.coverRadius, 10),
    [`--ty-${prefix}-button-radius`]: asPx(enabled ? source.buttonRadius : fallback.buttonRadius, 999),
    [`--ty-${prefix}-progress-radius`]: asPx(enabled ? source.progressRadius : fallback.progressRadius, 999),
    [`--ty-${prefix}-item-padding`]: asPx(enabled ? source.itemPadding : fallback.itemPadding, 12),
    [`--ty-${prefix}-item-gap`]: asPx(enabled ? source.itemGap : fallback.itemGap, 10),
    [`--ty-${prefix}-list-gap`]: asPx(enabled ? source.listGap : fallback.listGap, 8),
    [`--ty-${prefix}-item-height`]: asPx(enabled ? source.itemHeight : fallback.itemHeight, 83),
    [`--ty-${prefix}-cover-size`]: asPx(enabled ? source.coverSize : fallback.coverSize, 56),
    [`--ty-${prefix}-text`]: enabled ? source.textColor || "#18283a" : fallbackText,
    [`--ty-${prefix}-muted`]: enabled ? source.mutedTextColor || "#6a7f96" : fallbackMuted,
    [`--ty-${prefix}-playing`]: enabled ? source.playingColor || "#66ccff" : fallbackAccent,
    [`--ty-${prefix}-progress`]: enabled ? source.progressColor || "#66ccff" : fallbackAccent,
    [`--ty-${prefix}-button`]: enabled ? source.buttonColor || "#1d1d1f" : fallbackText
  };
}
const runtimeVarNames = [
  "--ty-color-accent",
  "--ty-page-bg",
  "--ty-page-bg-photo",
  "--ty-surface-bg",
  "--ty-text-main",
  "--ty-text-muted",
  "--ty-page-radius",
  "--ty-container-radius",
  "--ty-item-radius",
  "--ty-cover-radius",
  "--ty-button-radius",
  "--ty-page-padding",
  "--ty-card-gap",
  "--ty-list-gap",
  "--ty-account-bg",
  "--ty-account-surface",
  "--ty-account-accent",
  "--ty-account-hero-overlay",
  "--ty-account-hero-blur",
  "--ty-account-page-radius",
  "--ty-account-card-radius",
  "--ty-account-card-gap",
  "--ty-account-list-gap",
  "--ty-home-page-radius",
  "--ty-home-container-radius",
  "--ty-home-item-radius",
  "--ty-home-cover-radius",
  "--ty-home-list-gap",
  "--ty-home-hero-overlay",
  "--ty-home-hero-blur",
  "--ty-playlist-page-radius",
  "--ty-playlist-item-radius",
  "--ty-playlist-cover-radius",
  "--ty-playlist-list-gap",
  "--ty-playlist-song-height",
  "--ty-search-bg",
  "--ty-search-surface",
  "--ty-search-accent",
  "--ty-search-page-radius",
  "--ty-search-container-radius",
  "--ty-search-item-radius",
  "--ty-search-page-padding",
  "--ty-search-list-gap",
  "--ty-song-item-bg",
  "--ty-song-item-bg-image",
  "--ty-song-item-media-opacity",
  "--ty-song-item-media-position",
  "--ty-song-item-media-size",
  "--ty-song-item-radius",
  "--ty-song-cover-radius",
  "--ty-song-button-radius",
  "--ty-song-progress-radius",
  "--ty-song-item-padding",
  "--ty-song-item-gap",
  "--ty-song-item-height",
  "--ty-song-cover-size",
  "--ty-song-text",
  "--ty-song-muted",
  "--ty-song-playing",
  "--ty-song-progress",
  "--ty-song-button",
  "--ty-mini-bg",
  "--ty-mini-text",
  "--ty-mini-muted",
  "--ty-mini-progress",
  "--ty-mini-button",
  "--ty-mini-radius",
  "--ty-mini-cover-radius",
  "--ty-mini-button-radius",
  "--ty-mini-progress-radius",
  "--ty-mini-gap",
  "--ty-mini-height",
  "--ty-mini-cover-size",
  "--ty-player-control-bg",
  "--ty-player-control-text",
  "--ty-player-control-muted",
  "--ty-player-control-progress",
  "--ty-player-control-button",
  "--ty-player-control-radius",
  "--ty-player-control-cover-radius",
  "--ty-player-control-button-radius",
  "--ty-player-control-progress-radius",
  "--ty-player-control-gap",
  "--ty-player-control-height",
  ...scopedSongTargetPrefixes.flatMap((prefix) => songTargetVarSuffixes.map((suffix) => `--ty-${prefix}-${suffix}`))
];
function buildSkinThemeCssVars(rawConfig = loadSkinThemeConfig()) {
  const config = normalizeSkinThemeConfig(rawConfig);
  const targets = config.targets || {};
  const globalLayout = targets.global_layout || {};
  const account = targets.page_account || {};
  const home = targets.page_home || {};
  const playlist = targets.page_playlist || {};
  const search = targets.page_search || {};
  const song = targets.song_item || {};
  const searchSong = targets.search_song_item || {};
  const playlistSong = targets.playlist_song_item || {};
  const drawerSong = targets.drawer_song_item || {};
  const biliVideo = targets.bili_video_item || {};
  const playerControls = targets.player_controls || {};
  const mini = targets.mini_player || {};
  return {
    "--ty-color-accent": globalLayout.accentColor || "#2f8fff",
    "--ty-page-bg": globalLayout.pageBackground || "#f4f7fb",
    "--ty-page-bg-photo": globalLayout.enabled && globalLayout.mediaSrc ? globalLayout.mediaType === "image" ? cssUrl(globalLayout.mediaSrc) : "none" : cssUrl(DEFAULT_PAGE_BG_SRC),
    "--ty-surface-bg": globalLayout.surfaceColor || "#ffffff",
    "--ty-text-main": globalLayout.textColor || "#18283a",
    "--ty-text-muted": globalLayout.mutedTextColor || "#60748c",
    "--ty-page-radius": asPx(globalLayout.pageRadius, 24),
    "--ty-container-radius": asPx(globalLayout.containerRadius, 16),
    "--ty-item-radius": asPx(globalLayout.itemRadius, 12),
    "--ty-cover-radius": asPx(globalLayout.coverRadius, 10),
    "--ty-button-radius": asPx(globalLayout.buttonRadius, 999),
    "--ty-page-padding": asPx(globalLayout.pagePadding, 14),
    "--ty-card-gap": asPx(globalLayout.cardGap, 14),
    "--ty-list-gap": asPx(globalLayout.listGap, 8),
    "--ty-account-bg": account.pageBackground || globalLayout.pageBackground || "#f3f7fb",
    "--ty-account-surface": account.surfaceColor || globalLayout.surfaceColor || "#ffffff",
    "--ty-account-accent": account.accentColor || globalLayout.accentColor || "#2f8fff",
    "--ty-account-hero-overlay": asOpacity(account.heroOverlayOpacity, 0.34),
    "--ty-account-hero-blur": asPx(account.heroBlur, 18),
    "--ty-account-page-radius": asPx(account.pageRadius || globalLayout.pageRadius, 24),
    "--ty-account-card-radius": asPx(account.containerRadius || globalLayout.containerRadius, 18),
    "--ty-account-card-gap": asPx(account.cardGap || globalLayout.cardGap, 14),
    "--ty-account-list-gap": asPx(account.listGap || globalLayout.listGap, 10),
    "--ty-home-page-radius": asPx(home.pageRadius || globalLayout.pageRadius, 20),
    "--ty-home-container-radius": asPx(home.containerRadius || globalLayout.containerRadius, 14),
    "--ty-home-item-radius": asPx(home.itemRadius || globalLayout.itemRadius, 12),
    "--ty-home-cover-radius": asPx(home.coverRadius || globalLayout.coverRadius, 10),
    "--ty-home-list-gap": asPx(home.listGap || globalLayout.listGap, 8),
    "--ty-home-hero-overlay": asOpacity(home.heroOverlayOpacity, 0.16),
    "--ty-home-hero-blur": asPx(home.heroBlur, 0),
    "--ty-playlist-page-radius": asPx(playlist.pageRadius || globalLayout.pageRadius, 18),
    "--ty-playlist-item-radius": asPx(playlist.itemRadius || globalLayout.itemRadius, 12),
    "--ty-playlist-cover-radius": asPx(playlist.coverRadius || globalLayout.coverRadius, 10),
    "--ty-playlist-list-gap": asPx(playlist.listGap || globalLayout.listGap, 8),
    "--ty-playlist-song-height": asPx(playlist.songItemHeight, 83),
    "--ty-search-bg": search.pageBackground || globalLayout.pageBackground || "#f5f5f5",
    "--ty-search-surface": search.surfaceColor || globalLayout.surfaceColor || "#ffffff",
    "--ty-search-accent": search.accentColor || globalLayout.accentColor || "#2f8fff",
    "--ty-search-page-radius": asPx(search.pageRadius || globalLayout.pageRadius, 18),
    "--ty-search-container-radius": asPx(search.containerRadius || globalLayout.containerRadius, 14),
    "--ty-search-item-radius": asPx(search.itemRadius || globalLayout.itemRadius, 12),
    "--ty-search-page-padding": asPx(search.pagePadding || globalLayout.pagePadding, 10),
    "--ty-search-list-gap": asPx(search.listGap || globalLayout.listGap, 8),
    "--ty-song-item-bg": song.enabled ? song.backgroundColor || "#ffffff" : "var(--ty-surface-bg)",
    "--ty-song-item-bg-image": song.enabled && song.mediaType === "image" ? cssUrl(song.mediaSrc) : "none",
    "--ty-song-item-media-opacity": song.enabled ? asOpacity(song.mediaOpacity, 0.18) : "0",
    "--ty-song-item-media-position": song.mediaPosition || "right center",
    "--ty-song-item-media-size": song.mediaSize || "cover",
    "--ty-song-item-radius": asPx(song.enabled ? song.itemRadius : playlist.itemRadius || globalLayout.itemRadius, 12),
    "--ty-song-cover-radius": asPx(song.enabled ? song.coverRadius : playlist.coverRadius || globalLayout.coverRadius, 10),
    "--ty-song-button-radius": asPx(song.enabled ? song.buttonRadius : globalLayout.buttonRadius, 999),
    "--ty-song-progress-radius": asPx(song.enabled ? song.progressRadius : globalLayout.buttonRadius, 999),
    "--ty-song-item-padding": asPx(song.enabled ? song.itemPadding : 12, 12),
    "--ty-song-item-gap": asPx(song.enabled ? song.itemGap : 10, 10),
    "--ty-song-item-height": asPx(song.enabled ? song.itemHeight : playlist.songItemHeight || 83, 83),
    "--ty-song-cover-size": asPx(song.enabled ? song.coverSize : 56, 56),
    "--ty-song-text": song.enabled ? song.textColor || "#18283a" : "var(--ty-text-main)",
    "--ty-song-muted": song.enabled ? song.mutedTextColor || "#6a7f96" : "var(--ty-text-muted)",
    "--ty-song-playing": song.enabled ? song.playingColor || "#66ccff" : "var(--ty-color-accent)",
    "--ty-song-progress": song.enabled ? song.progressColor || "#66ccff" : "var(--ty-color-accent)",
    "--ty-song-button": song.enabled ? song.buttonColor || "#1d1d1f" : "var(--ty-text-main)",
    ...buildSongTargetVars("search-song", searchSong, {
      backgroundColor: "var(--ty-search-surface)",
      textColor: "var(--ty-text-main)",
      mutedTextColor: "var(--ty-text-muted)",
      accentColor: "var(--ty-search-accent)",
      itemRadius: search.itemRadius || globalLayout.itemRadius,
      coverRadius: globalLayout.coverRadius,
      buttonRadius: globalLayout.buttonRadius,
      progressRadius: globalLayout.buttonRadius,
      itemPadding: 12,
      itemGap: 10,
      listGap: search.listGap || globalLayout.listGap,
      itemHeight: 83,
      coverSize: 56
    }),
    ...buildSongTargetVars("playlist-song", playlistSong, {
      backgroundColor: "var(--ty-surface-bg)",
      textColor: "var(--ty-text-main)",
      mutedTextColor: "var(--ty-text-muted)",
      accentColor: "var(--ty-color-accent)",
      itemRadius: playlist.itemRadius || globalLayout.itemRadius,
      coverRadius: playlist.coverRadius || globalLayout.coverRadius,
      buttonRadius: globalLayout.buttonRadius,
      progressRadius: globalLayout.buttonRadius,
      itemPadding: 12,
      itemGap: 10,
      listGap: playlist.listGap || globalLayout.listGap,
      itemHeight: playlist.songItemHeight || 83,
      coverSize: 56
    }),
    ...buildSongTargetVars("drawer-song", drawerSong, {
      backgroundColor: "var(--ty-surface-bg)",
      textColor: "var(--ty-text-main)",
      mutedTextColor: "var(--ty-text-muted)",
      accentColor: "var(--ty-color-accent)",
      itemRadius: globalLayout.itemRadius,
      coverRadius: globalLayout.coverRadius,
      buttonRadius: globalLayout.buttonRadius,
      progressRadius: globalLayout.buttonRadius,
      itemPadding: 12,
      itemGap: 10,
      listGap: globalLayout.listGap,
      itemHeight: 83,
      coverSize: 56
    }),
    ...buildSongTargetVars("bili-video", biliVideo, {
      backgroundColor: "var(--ty-account-surface)",
      textColor: "var(--ty-text-main)",
      mutedTextColor: "var(--ty-text-muted)",
      accentColor: "var(--ty-account-accent)",
      itemRadius: 10,
      coverRadius: 8,
      buttonRadius: globalLayout.buttonRadius,
      progressRadius: globalLayout.buttonRadius,
      itemPadding: 8,
      itemGap: 12,
      listGap: account.listGap || globalLayout.listGap,
      itemHeight: 92,
      coverSize: 68
    }),
    "--ty-player-control-bg": playerControls.enabled ? playerControls.backgroundColor || "#ffffff" : "var(--ty-surface-bg)",
    "--ty-player-control-text": playerControls.enabled ? playerControls.textColor || "#1d1d1f" : "var(--ty-text-main)",
    "--ty-player-control-muted": playerControls.enabled ? playerControls.mutedTextColor || "#6e6e73" : "var(--ty-text-muted)",
    "--ty-player-control-progress": playerControls.enabled ? playerControls.progressColor || "#66ccff" : "var(--ty-color-accent)",
    "--ty-player-control-button": playerControls.enabled ? playerControls.buttonColor || "#1d1d1f" : "var(--ty-text-main)",
    "--ty-player-control-radius": asPx(playerControls.enabled ? playerControls.itemRadius : globalLayout.containerRadius, 18),
    "--ty-player-control-cover-radius": asPx(playerControls.enabled ? playerControls.coverRadius : globalLayout.containerRadius, 18),
    "--ty-player-control-button-radius": asPx(playerControls.enabled ? playerControls.buttonRadius : globalLayout.buttonRadius, 999),
    "--ty-player-control-progress-radius": asPx(playerControls.enabled ? playerControls.progressRadius : globalLayout.buttonRadius, 999),
    "--ty-player-control-gap": asPx(playerControls.enabled ? playerControls.itemGap : 10, 10),
    "--ty-player-control-height": asPx(playerControls.enabled ? playerControls.itemHeight : 83, 83),
    "--ty-mini-bg": mini.enabled ? mini.backgroundColor || "#ffffff" : song.enabled ? song.backgroundColor || "#ffffff" : "var(--ty-surface-bg)",
    "--ty-mini-text": mini.enabled ? mini.textColor || "#18283a" : song.enabled ? song.textColor || "#18283a" : "var(--ty-text-main)",
    "--ty-mini-muted": mini.enabled ? mini.mutedTextColor || "#6a7f96" : song.enabled ? song.mutedTextColor || "#6a7f96" : "var(--ty-text-muted)",
    "--ty-mini-progress": mini.enabled ? mini.progressColor || "#66ccff" : song.enabled ? song.progressColor || "#66ccff" : "var(--ty-color-accent)",
    "--ty-mini-button": mini.enabled ? mini.buttonColor || "#1d1d1f" : song.enabled ? song.buttonColor || "#1d1d1f" : "var(--ty-text-main)",
    "--ty-mini-radius": asPx(mini.enabled ? mini.itemRadius : globalLayout.containerRadius || 20, 20),
    "--ty-mini-cover-radius": asPx(mini.enabled ? mini.coverRadius : song.enabled ? song.coverRadius : globalLayout.coverRadius || 10, 10),
    "--ty-mini-button-radius": asPx(mini.enabled ? mini.buttonRadius : song.enabled ? song.buttonRadius : globalLayout.buttonRadius, 10),
    "--ty-mini-progress-radius": asPx(mini.enabled ? mini.progressRadius : song.enabled ? song.progressRadius : globalLayout.buttonRadius, 999),
    "--ty-mini-gap": asPx(mini.enabled ? mini.itemGap : song.enabled ? song.itemGap : 12, 12),
    "--ty-mini-height": asPx(mini.enabled ? mini.itemHeight : song.enabled ? song.itemHeight : 75, 75),
    "--ty-mini-cover-size": asPx(mini.enabled ? mini.coverSize : song.enabled ? song.coverSize : 50, 50)
  };
}
async function applyResolvedSkinThemeMediaCssVars(rawConfig = loadSkinThemeConfig(), style = null) {
  const targetStyle = style || (typeof document !== "undefined" ? document.documentElement?.style : null);
  if (!targetStyle) return;
  const applyVersion = (mediaCssApplyVersions.get(targetStyle) || 0) + 1;
  mediaCssApplyVersions.set(targetStyle, applyVersion);
  const config = normalizeSkinThemeConfig(rawConfig);
  const targets = config.targets || {};
  await Promise.all(runtimeMediaTargets.map(async ([prefix, targetId]) => {
    const target = targets[targetId] || {};
    const varName = prefix === "page-bg" ? "--ty-page-bg-photo" : `--ty-${prefix}-item-bg-image`;
    if (!target.enabled || !target.mediaSrc) {
      targetStyle.setProperty(varName, getDefaultMediaCssVar(prefix));
      return;
    }
    if (target.mediaType !== "image") {
      targetStyle.setProperty(varName, "none");
      return;
    }
    if (!isSkinAssetUrl(target.mediaSrc)) return;
    try {
      const resolved = await resolveSkinMediaSrc(target.mediaSrc);
      if (mediaCssApplyVersions.get(targetStyle) !== applyVersion) return;
      targetStyle.setProperty(varName, resolved ? cssUrl(resolved) : getDefaultMediaCssVar(prefix));
    } catch (error) {
      if (mediaCssApplyVersions.get(targetStyle) !== applyVersion) return;
      console.warn("Failed to resolve skin theme media CSS variable:", error);
      targetStyle.setProperty(varName, getDefaultMediaCssVar(prefix));
    }
  }));
}
function applySkinThemeRuntime(rawConfig = loadSkinThemeConfig()) {
  if (typeof document === "undefined") return normalizeSkinThemeConfig(rawConfig);
  const config = normalizeSkinThemeConfig(rawConfig);
  const root = document.documentElement;
  const style = root.style;
  const song = config.targets?.song_item || {};
  removeVars(style, runtimeVarNames);
  setVars(style, buildSkinThemeCssVars(config));
  void applyResolvedSkinThemeMediaCssVars(config, style);
  root.classList.toggle("ty-skin-song-item-on", Boolean(song.enabled));
  root.classList.toggle("ty-skin-song-live2d-meta-on", Boolean(song.enabled && song.mediaType === "live2d" && song.live2dModelUrl));
  root.dataset.tySkinVersion = String(config.version || 3);
  return config;
}
function installSkinThemeRuntime() {
  if (runtimeInstalled || typeof window === "undefined") return;
  runtimeInstalled = true;
  applySkinThemeRuntime(loadSkinThemeConfig());
  window.addEventListener(SKIN_THEME_UPDATED_EVENT, (event) => {
    applySkinThemeRuntime(event?.detail || loadSkinThemeConfig());
  });
  window.addEventListener(SKIN_SANDBOX_DRAFT_EVENT, (event) => {
    applySkinThemeRuntime(event?.detail || loadSkinThemeConfig());
  });
  window.addEventListener("storage", (event) => {
    if (event.key) applySkinThemeRuntime(loadSkinThemeConfig());
  });
}
const FOCUSABLE_SELECTOR = 'input, textarea, select, [contenteditable="true"]';
const SCROLL_CONTAINER_SELECTOR = [
  ".main-content",
  ".dialog-body",
  ".dialog-overlay",
  ".playlist-input-body",
  ".playlist-input-dialog",
  ".browser-container",
  ".folder-browser-dialog",
  ".drawer-content",
  ".drawer-scroll",
  ".song-list-container",
  ".mainPlaylist-container"
].join(", ");
let installed = false;
let activeField = null;
let scrollTimer = 0;
function px(value) {
  return `${Math.max(0, Math.round(Number(value) || 0))}px`;
}
function getVisualViewport() {
  return window.visualViewport || null;
}
function getKeyboardBottom() {
  const viewport = getVisualViewport();
  if (!viewport) {
    return Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--ty-native-keyboard-bottom")) || 0;
  }
  const layoutHeight = window.innerHeight || document.documentElement.clientHeight || viewport.height;
  const keyboardBottom = layoutHeight - viewport.height - viewport.offsetTop;
  const nativeKeyboardBottom = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--ty-native-keyboard-bottom")
  ) || 0;
  return Math.max(0, keyboardBottom, nativeKeyboardBottom);
}
function updateViewportVars() {
  const viewport = getVisualViewport();
  const viewportHeight = viewport?.height || window.innerHeight || document.documentElement.clientHeight || 0;
  const keyboardBottom = getKeyboardBottom();
  const keyboardOpen = keyboardBottom > 60;
  const layoutHeight = window.innerHeight || document.documentElement.clientHeight || viewportHeight;
  const viewportAlreadyShrunk = viewport ? layoutHeight - viewport.height - viewport.offsetTop > 60 : false;
  const keyboardOverlapBottom = keyboardOpen && !viewportAlreadyShrunk ? keyboardBottom : 0;
  document.documentElement.style.setProperty("--ty-viewport-height", px(viewportHeight));
  document.documentElement.style.setProperty("--ty-keyboard-bottom", px(keyboardBottom));
  document.documentElement.style.setProperty("--ty-keyboard-overlap-bottom", px(keyboardOverlapBottom));
  document.documentElement.classList.toggle("ty-keyboard-open", keyboardOpen);
  document.documentElement.classList.toggle("ty-viewport-shrunk", viewportAlreadyShrunk);
}
function isScrollable(element) {
  if (!element || element === document || element === document.documentElement) return false;
  const style = window.getComputedStyle(element);
  const overflowY = style.overflowY;
  return /(auto|scroll|overlay)/.test(overflowY) && element.scrollHeight > element.clientHeight + 1;
}
function findScrollContainer(element) {
  let current = element?.parentElement || null;
  while (current && current !== document.body) {
    if (isScrollable(current) || current.matches?.(SCROLL_CONTAINER_SELECTOR)) {
      return current;
    }
    current = current.parentElement;
  }
  return document.querySelector(".main-content") || document.scrollingElement || document.documentElement;
}
function getVisibleBounds() {
  const viewport = getVisualViewport();
  const top = viewport?.offsetTop || 0;
  const height = viewport?.height || window.innerHeight || document.documentElement.clientHeight || 0;
  const safeTop = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--ty-safe-area-top")
  ) || 0;
  return {
    top: top + safeTop + 12,
    bottom: top + height - 18
  };
}
function scrollContainerBy(container, delta) {
  if (!container || Math.abs(delta) < 1) return;
  if (container === document.scrollingElement || container === document.documentElement || container === document.body) {
    window.scrollBy({ top: delta, behavior: "smooth" });
    return;
  }
  container.scrollTo({ top: container.scrollTop + delta, behavior: "smooth" });
}
function ensureActiveFieldVisible() {
  if (!activeField || !document.contains(activeField)) return;
  if (!activeField.matches?.(FOCUSABLE_SELECTOR)) return;
  updateViewportVars();
  const rect = activeField.getBoundingClientRect();
  const bounds = getVisibleBounds();
  const keyboardBottom = getKeyboardBottom();
  const viewport = getVisualViewport();
  const layoutHeight = window.innerHeight || document.documentElement.clientHeight || viewport?.height || 0;
  const viewportAlreadyShrunk = viewport ? layoutHeight - viewport.height - viewport.offsetTop > 60 : false;
  const bottomInset = keyboardBottom > 60 && !viewportAlreadyShrunk ? keyboardBottom : 0;
  const visibleBottom = bounds.bottom - bottomInset;
  const container = findScrollContainer(activeField);
  if (rect.bottom > visibleBottom) {
    scrollContainerBy(container, rect.bottom - visibleBottom + 18);
    return;
  }
  if (rect.top < bounds.top) {
    scrollContainerBy(container, rect.top - bounds.top - 18);
  }
}
function scheduleEnsureVisible(delay = 80) {
  window.clearTimeout(scrollTimer);
  scrollTimer = window.setTimeout(() => {
    ensureActiveFieldVisible();
  }, delay);
}
function installKeyboardViewportGuard() {
  if (installed || typeof window === "undefined") return;
  installed = true;
  updateViewportVars();
  window.addEventListener("ty-native-insets", () => {
    updateViewportVars();
    scheduleEnsureVisible(40);
  });
  window.addEventListener("resize", () => {
    updateViewportVars();
    scheduleEnsureVisible(80);
  });
  const viewport = getVisualViewport();
  viewport?.addEventListener("resize", () => {
    updateViewportVars();
    scheduleEnsureVisible(80);
  });
  viewport?.addEventListener("scroll", () => {
    updateViewportVars();
    scheduleEnsureVisible(40);
  });
  document.addEventListener("focusin", (event) => {
    const target = event.target;
    if (!target?.matches?.(FOCUSABLE_SELECTOR)) return;
    activeField = target;
    document.documentElement.classList.add("ty-input-focused");
    scheduleEnsureVisible(140);
    scheduleEnsureVisible(360);
  });
  document.addEventListener("focusout", (event) => {
    if (event.target === activeField) {
      activeField = null;
    }
    window.setTimeout(() => {
      if (!document.activeElement?.matches?.(FOCUSABLE_SELECTOR)) {
        document.documentElement.classList.remove("ty-input-focused");
        updateViewportVars();
      }
    }, 60);
  });
}
window.addEventListener("error", (event) => {
  console.error("========== GLOBAL ERROR ==========");
  console.error("Message:", event.message);
  console.error("Filename:", event.filename);
  console.error("Line:", event.lineno, "Col:", event.colno);
  console.error("Error object:", event.error);
  if (event.error && event.error.stack) {
    console.error("Stack trace:");
    console.error(event.error.stack);
  }
  console.error("Target element:", event.target);
  console.error("==================================");
});
window.addEventListener("unhandledrejection", (event) => {
  console.error("========== UNHANDLED PROMISE REJECTION ==========");
  console.error("Reason:", event.reason);
  console.error("Promise:", event.promise);
  if (event.reason && event.reason.stack) {
    console.error("Stack trace:");
    console.error(event.reason.stack);
  }
  console.error("================================================");
});
const app = createApp(_sfc_main);
app.config.errorHandler = (err, instance, info) => {
  console.error("========== VUE ERROR HANDLER ==========");
  console.error("Error name:", err.name);
  console.error("Error message:", err.message);
  console.error("Error stack:", err.stack);
  console.error("Info (lifecycle hook):", info);
  console.error("Component name:", instance?.$options?.name || "anonymous");
  console.error("Component props:", instance?.$props);
  console.error("=======================================");
};
app.use(createPinia());
app.use(router);
setupMarqueeDirective(app);
installSkinThemeRuntime();
installKeyboardViewportGuard();
installNativeStartupSplash();
app.mount("#app");
export {
  saveSkinMediaFile as $,
  getSwipeRevealBackgroundStyle as A,
  getSwipeRevealContentStyle as B,
  CACHE_LIFECYCLE as C,
  DataEditDialog as D,
  getTrustedBiliApiCoverUrl as E,
  isMusicControlVisible as F,
  isSwipeRevealIconVisible as G,
  isSwipeRevealReady as H,
  ImageCropperDialog as I,
  loadSkinThemeConfig as J,
  normalizeSkinMediaFit as K,
  normalizeSkinThemeConfig as L,
  onBiliDownload as M,
  onSearchResult as N,
  playbackEventTracker as O,
  PLAY_MODES as P,
  prefetchImage as Q,
  processCoverUrl as R,
  SKIN_SANDBOX_DRAFT_EVENT as S,
  Toast as T,
  readPlayerResumeCache as U,
  VirtualList as V,
  readSkinThemeTarget as W,
  registerBackHandler as X,
  registerCache as Y,
  resolveSwipeRevealOffset as Z,
  _export_sfc as _,
  CACHE_MEDIUM as a,
  saveSkinThemeConfig as a0,
  serializeSkinThemeConfig as a1,
  showGlobalConfirm as a2,
  showGlobalToast as a3,
  storage as a4,
  subscribeThumbnailQueue as a5,
  syncNativeStartupSplash as a6,
  useCacheStore as a7,
  useDownloadTaskStore as a8,
  useIntegrityCheck as a9,
  useLoadingManager as aa,
  usePageLifecycle as ab,
  usePlayerStore$1 as ac,
  usePlaylistStore as ad,
  useReadyCover as ae,
  useResolvedSkinMediaSrc as af,
  useRowHydration as ag,
  useSelection as ah,
  useSelectionModeMicroservice as ai,
  useSelectionStore as aj,
  useSkinThemeConfig as ak,
  useTimerStore as al,
  DeferredThumbnail as b,
  SKIN_TARGET_SCHEMAS as c,
  SWIPE_REVEAL as d,
  SvgIcon as e,
  apiRequest as f,
  applyResolvedSkinThemeMediaCssVars as g,
  applySkinThemeRuntime as h,
  buildSkinMediaElementStyle as i,
  buildSkinThemeCssVars as j,
  closeMusicControl as k,
  compareOrderKeysDesc as l,
  createFrameScheduler as m,
  createLogger as n,
  createScrollActivity as o,
  createStandardSkinThemeTemplate as p,
  formatArtistProducer as q,
  formatTitle as r,
  getBiliVideoUrl as s,
  getBundledAssetUrl as t,
  getNextPlayMode as u,
  getOrderConstraints as v,
  getOrderKeyBetweenDesc as w,
  getPlayModeLabel as x,
  getSkinMediaFitScale as y,
  getSongCoverSrc as z
};
