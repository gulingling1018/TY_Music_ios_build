import { ad as usePlaylistStore, ac as usePlayerStore } from "./index.js";
import { J as reactive } from "./vendor.js";
const batchState = reactive({
  currentTaskId: null,
  lastActivityTime: 0,
  BATCH_WINDOW: 60 * 1e3
  // 1分钟批次窗口
});
const toastQueue = {
  pending: [],
  timer: null,
  DELAY: 300
  // 300ms 内合并
};
function useSwipeInsertManager(pageContext) {
  const playlistStore = usePlaylistStore();
  const playerStore = usePlayerStore();
  function getTaskId() {
    const now = Date.now();
    if (!batchState.currentTaskId || now - batchState.lastActivityTime > batchState.BATCH_WINDOW) {
      batchState.currentTaskId = `${pageContext}_${Date.now()}`;
      console.log(`🆕 [SwipeInsert] 创建新批次: ${batchState.currentTaskId}`);
    }
    batchState.lastActivityTime = now;
    return batchState.currentTaskId;
  }
  async function insertNext(song) {
    if (!song) {
      console.warn("[SwipeInsert] 无效的歌曲对象");
      return false;
    }
    try {
      console.log(`➕ [SwipeInsert] 插入到下一首: ${song.title}`);
      await playlistStore.enqueuePriorityNext([song], {
        taskId: getTaskId(),
        currentHashId: playerStore.currentHashId,
        triggerSource: "manual_user",
        source: "swipe_insert_next"
      });
      enqueueToast(song);
      console.log("✅ [SwipeInsert] 插入成功");
      return true;
    } catch (error) {
      console.error("❌ [SwipeInsert] 插入失败:", error);
      return false;
    }
  }
  function enqueueToast(song) {
    toastQueue.pending.push(song);
    if (toastQueue.timer) {
      clearTimeout(toastQueue.timer);
    }
    toastQueue.timer = setTimeout(() => {
      flushToast();
    }, toastQueue.DELAY);
  }
  function flushToast() {
    if (toastQueue.pending.length === 0) return;
    const count = toastQueue.pending.length;
    const firstSong = toastQueue.pending[0];
    const message = count === 1 ? `已添加"${firstSong.title}"到下一首播放` : `已添加 ${count} 首歌曲到下一首播放`;
    window.dispatchEvent(new CustomEvent("global-toast", {
      detail: {
        message,
        type: "success",
        duration: 2e3
      }
    }));
    console.log(`📢 [SwipeInsert] Toast 播报: ${message}`);
    toastQueue.pending = [];
  }
  function resetBatch() {
    batchState.currentTaskId = null;
    batchState.lastActivityTime = 0;
    console.log(`🔄 [SwipeInsert] 页面激活，重置批次: ${pageContext}`);
  }
  return {
    insertNext,
    resetBatch
  };
}
function ensureAndroidFeaturePermission(scene = "generic") {
  if (typeof window === "undefined" || !window.Android) return true;
  if (typeof window.Android.ensureFeaturePermissions !== "function") return true;
  try {
    return !!window.Android.ensureFeaturePermissions(scene);
  } catch (error) {
    console.warn("[Permission] ensureFeaturePermissions failed:", error);
    return true;
  }
}
export {
  ensureAndroidFeaturePermission as e,
  useSwipeInsertManager as u
};
