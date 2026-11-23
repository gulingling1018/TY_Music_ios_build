import { M as ref, c as computed, I as openBlock, g as createElementBlock, d as createBaseVNode, Y as toDisplayString, k as createTextVNode, F as Fragment, O as renderList, w as normalizeClass, l as createVNode, a6 as withCtx, f as createCommentVNode, x as normalizeStyle, J as reactive, a5 as watch, v as nextTick, A as onBeforeUnmount, R as resolveComponent, S as resolveDirective, Z as unref, a7 as withDirectives, t as isRef, a0 as vModelCheckbox, T as Transition, q as draggable, a9 as withModifiers, e as createBlock, a4 as vShow, a8 as withKeys, a3 as vModelText } from "./vendor.js";
import { aj as useSelectionStore, ad as usePlaylistStore, a3 as showGlobalToast, f as apiRequest, _ as _export_sfc, V as VirtualList, ac as usePlayerStore, aa as useLoadingManager, a8 as useDownloadTaskStore, a7 as useCacheStore, ak as useSkinThemeConfig, a9 as useIntegrityCheck, ah as useSelection, ab as usePageLifecycle, i as buildSkinMediaElementStyle, ag as useRowHydration, o as createScrollActivity, ai as useSelectionModeMicroservice, d as SWIPE_REVEAL, X as registerBackHandler, r as formatTitle, q as formatArtistProducer, b as DeferredThumbnail, z as getSongCoverSrc, D as DataEditDialog, l as compareOrderKeysDesc, a2 as showGlobalConfirm, v as getOrderConstraints, w as getOrderKeyBetweenDesc, Z as resolveSwipeRevealOffset, A as getSwipeRevealBackgroundStyle, H as isSwipeRevealReady, G as isSwipeRevealIconVisible, B as getSwipeRevealContentStyle, Q as prefetchImage } from "./index.js";
import { u as useSwipeInsertManager, e as ensureAndroidFeaturePermission } from "./androidPermission.js";
import { S as ScrollSurface } from "./ScrollSurface.js";
function usePlaylistActions() {
  const selectionStore = useSelectionStore();
  const playlistStore = usePlaylistStore();
  const showPlaylistDialog = ref(false);
  const newPlaylistName = ref("");
  const existingPlaylists = ref([]);
  const selectedSongIds = ref([]);
  const isMenuOpen = ref(false);
  const isLoading = ref(false);
  const hasSelection = computed(() => selectionStore.selectedIdsInOrder.length > 0);
  async function loadExistingPlaylists(excludePlaylistId = null) {
    try {
      const response = await apiRequest("/api/playlists");
      if (!response.ok) throw new Error("网络响应异常");
      const data = await response.json();
      existingPlaylists.value = (data.playlists || []).filter(
        (p) => p.isCustom === true && p.id !== excludePlaylistId
      );
    } catch (error) {
      console.error("加载歌单列表失败:", error);
      existingPlaylists.value = [];
    }
  }
  function closePlaylistDialog() {
    showPlaylistDialog.value = false;
    newPlaylistName.value = "";
    selectedSongIds.value = [];
    existingPlaylists.value = [];
  }
  async function requestWrapper(apiPath, payload, successMsg, onSuccess) {
    isLoading.value = true;
    try {
      const response = await apiRequest(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload
      });
      if (response.ok) {
        if (successMsg) showGlobalToast(successMsg);
        if (onSuccess) await onSuccess();
        return true;
      }
      throw new Error("请求失败");
    } catch (error) {
      showGlobalToast(`操作失败: ${error.message}`, { type: "error" });
      return false;
    } finally {
      isLoading.value = false;
    }
  }
  async function addToExistingPlaylist(playlistId, onSuccess) {
    if (!selectedSongIds.value.length) {
      showGlobalToast("请先选择歌曲", { type: "warning" });
      return;
    }
    const success = await requestWrapper(
      "/api/playlist/batch-add",
      { playlistId, hashIds: selectedSongIds.value },
      `✅ 已成功添加到歌单`,
      onSuccess
    );
    if (success) closePlaylistDialog();
  }
  async function createNewPlaylist(songs = [], onSuccess) {
    const name = newPlaylistName.value.trim();
    if (!name) {
      showGlobalToast("请输入歌单名称", { type: "warning" });
      return;
    }
    const firstSongId = selectedSongIds.value[0];
    const firstSong = songs.find((s) => s.id === firstSongId);
    const coverUrl = firstSong?.cover || `/api/cover/${firstSongId}`;
    const success = await requestWrapper(
      "/api/playlist/custom/add",
      { playlistName: name, coverUrl, songIds: selectedSongIds.value },
      `✅ 歌单《${name}》创建成功`,
      onSuccess
    );
    if (success) closePlaylistDialog();
  }
  async function closeMode(autoExit = false) {
    const exited = await selectionStore.exitMode(autoExit);
    if (!exited) return false;
    playlistStore.resetPriorityTask();
    isMenuOpen.value = false;
    return true;
  }
  async function handleAction(type, songs, currentPlaylistId, playerStore, onSuccess) {
    const selectedList = selectionStore.selectedIdsInOrder;
    if (selectedList.length === 0) return;
    switch (type) {
      case "addToPlaylist":
        selectedSongIds.value = [...selectedList];
        await loadExistingPlaylists(currentPlaylistId);
        showPlaylistDialog.value = true;
        break;
      case "playNext":
        const tracks = selectedList.map((id) => songs?.find((s) => s.id === id)).filter(Boolean);
        playlistStore.enqueuePriorityNext(tracks, {
          taskId: selectionStore.activeTaskId,
          currentHashId: playerStore?.currentHashId,
          triggerSource: "manual_user",
          source: "playlist_actions_batch_play_next"
        });
        await closeMode(true);
        break;
      default:
        await closeMode();
    }
  }
  return {
    showPlaylistDialog,
    newPlaylistName,
    existingPlaylists,
    selectedSongIds,
    isMenuOpen,
    isLoading,
    hasSelection,
    loadExistingPlaylists,
    closePlaylistDialog,
    addToExistingPlaylist,
    createNewPlaylist,
    closeMode,
    handleAction
  };
}
const _hoisted_1$1 = { class: "download-task-panel" };
const _hoisted_2$1 = { class: "task-header" };
const _hoisted_3$1 = { class: "header-title" };
const _hoisted_4$1 = { class: "header-actions" };
const _hoisted_5$1 = { class: "parallelism-select" };
const _hoisted_6$1 = ["value"];
const _hoisted_7$1 = ["value"];
const _hoisted_8$1 = { class: "policy-bar" };
const _hoisted_9$1 = { class: "policy-field" };
const _hoisted_10$1 = ["value"];
const _hoisted_11$1 = { class: "policy-field" };
const _hoisted_12$1 = ["value"];
const _hoisted_13$1 = { class: "policy-field" };
const _hoisted_14$1 = ["value"];
const _hoisted_15$1 = { class: "policy-field compact" };
const _hoisted_16$1 = ["value"];
const _hoisted_17$1 = ["value"];
const _hoisted_18$1 = { class: "policy-field compact" };
const _hoisted_19$1 = ["value"];
const _hoisted_20$1 = ["value"];
const _hoisted_21$1 = { class: "policy-toggle" };
const _hoisted_22$1 = ["checked"];
const _hoisted_23$1 = { class: "policy-toggle" };
const _hoisted_24$1 = ["checked"];
const _hoisted_25$1 = { class: "task-tabs" };
const _hoisted_26$1 = ["onClick"];
const _hoisted_27$1 = { class: "task-list-wrap" };
const _hoisted_28$1 = { class: "task-card" };
const _hoisted_29$1 = { class: "task-main" };
const _hoisted_30$1 = { class: "task-title" };
const _hoisted_31$1 = { class: "task-sub" };
const _hoisted_32$1 = { key: 0 };
const _hoisted_33$1 = { key: 1 };
const _hoisted_34$1 = { key: 2 };
const _hoisted_35$1 = { key: 3 };
const _hoisted_36$1 = { key: 4 };
const _hoisted_37$1 = {
  key: 0,
  class: "task-path"
};
const _hoisted_38$1 = {
  key: 0,
  class: "task-controls"
};
const _hoisted_39$1 = ["onClick"];
const _hoisted_40$1 = ["onClick"];
const _hoisted_41$1 = ["onClick"];
const _hoisted_42$1 = ["onClick"];
const _hoisted_43$1 = ["onClick"];
const _hoisted_44$1 = {
  key: 1,
  class: "progress-rail"
};
const _hoisted_45$1 = {
  key: 2,
  class: "task-error"
};
const _hoisted_46$1 = {
  key: 0,
  class: "task-error-meta"
};
const _hoisted_47$1 = {
  key: 0,
  class: "task-empty"
};
const _sfc_main$1 = {
  __name: "DownloadTaskPanel",
  props: {
    tasks: {
      type: Array,
      default: () => []
    },
    policy: {
      type: Object,
      default: () => ({})
    },
    nativeStats: {
      type: Object,
      default: null
    },
    parallelism: {
      type: Number,
      default: 2
    },
    pausedAll: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    "set-parallelism",
    "pause-all",
    "resume-all",
    "pause-task",
    "resume-task",
    "retry-task",
    "cancel-task",
    "delete-task",
    "clear-completed",
    "clear-cancelled",
    "update-download-policy"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const activeTab = ref("active");
    const normalizedPolicy = computed(() => normalizePolicy(props.policy));
    const tabs = computed(() => {
      const allTasks = panelTasks.value;
      return [
        { key: "active", label: "进行中", count: allTasks.filter((task) => taskPanelGroup(task) === "active").length },
        { key: "completed", label: "已完成", count: allTasks.filter((task) => taskPanelGroup(task) === "completed").length },
        { key: "exception", label: "异常", count: allTasks.filter((task) => taskPanelGroup(task) === "exception").length }
      ];
    });
    const currentTabLabel = computed(() => {
      return tabs.value.find((tab) => tab.key === activeTab.value)?.label || "进行中";
    });
    const manualRunningCount = computed(() => {
      const nativeCount = nativeStatNumber("manualRunning");
      if (nativeCount !== null) return nativeCount;
      return (props.tasks || []).filter((task) => {
        const status = taskStatus(task);
        return status === "running" && isManualTaskType(task);
      }).length;
    });
    const systemRunningCount = computed(() => {
      const nativeCount = nativeStatNumber("systemRunning");
      if (nativeCount !== null) return nativeCount;
      return (props.tasks || []).filter((task) => {
        const status = taskStatus(task);
        return status === "running" && isBackgroundTaskType(task);
      }).length;
    });
    const visibleTasks = computed(() => {
      return panelTasks.value.filter((task) => ["queued", "running", "paused", "success", "failed", "cancelled", "crashed"].includes(taskStatus(task))).filter((task) => taskPanelGroup(task) === activeTab.value).sort((a, b) => {
        if (a?.batchId && b?.batchId && a.batchId === b.batchId) {
          return (a.batchIndex || 0) - (b.batchIndex || 0);
        }
        return (a.queueOrderHint || a.createdAt || 0) - (b.queueOrderHint || b.createdAt || 0);
      });
    });
    const emptyText = computed(() => {
      switch (activeTab.value) {
        case "completed":
          return "暂无已完成任务";
        case "exception":
          return "暂无异常任务";
        default:
          return "暂无进行中的下载任务";
      }
    });
    const panelTasks = computed(() => {
      const policy = normalizedPolicy.value;
      return (props.tasks || []).filter((task) => task?.visibleInPanel !== false).filter((task) => shouldShowTask(task, policy));
    });
    function onParallelismChange(event) {
      const value = Number(event.target.value);
      emit("set-parallelism", value);
    }
    function onPolicyChange(key, event) {
      const raw = event?.target?.value;
      const numericKeys = ["maxBackgroundDispatch", "maxManualDispatch", "maxGlobalDispatch"];
      const patch = { [key]: numericKeys.includes(key) ? Number(raw) : raw };
      emit("update-download-policy", patch);
    }
    function onPolicyToggle(key, event) {
      emit("update-download-policy", { [key]: event?.target?.checked === true });
    }
    function safeProgress(value) {
      if (!Number.isFinite(value)) return 0;
      return Math.min(100, Math.max(0, Math.trunc(value)));
    }
    function formatProgress(value) {
      return `${safeProgress(value)}%`;
    }
    function formatSpeed(speedKbps) {
      if (!Number.isFinite(speedKbps) || speedKbps <= 0) return "--";
      if (speedKbps >= 1024) return `${(speedKbps / 1024).toFixed(2)} MB/s`;
      return `${speedKbps.toFixed(0)} KB/s`;
    }
    function nativeStatNumber(key) {
      const value = Number(props.nativeStats?.[key]);
      return Number.isFinite(value) ? value : null;
    }
    function taskCapabilities(task) {
      return task?.taskBehavior?.capabilities || task?.capabilities || {};
    }
    function taskStatus(task) {
      return normalizePanelStatus(task?.status, task?.businessStatus);
    }
    function taskBusinessStatus(task) {
      return normalizePanelBusinessStatus(task?.businessStatus, taskStatus(task));
    }
    function normalizePanelStatus(status, businessStatus = "") {
      const business = `${businessStatus || ""}`.toLowerCase();
      if (business === "retry_wait") return "queued";
      if (business === "cancelling") return "running";
      if (business === "failed_retryable" || business === "failed_final") return "failed";
      const raw = `${status || ""}`.toLowerCase();
      switch (raw) {
        case "retry_wait":
        case "queued":
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
    function normalizePanelBusinessStatus(businessStatus, status = "") {
      const raw = `${businessStatus || ""}`.toLowerCase();
      switch (raw) {
        case "queued":
        case "retry_wait":
        case "running":
        case "cancelling":
        case "paused":
        case "success":
        case "failed_retryable":
        case "failed_final":
        case "cancelled":
        case "crashed":
          return raw;
        case "paused_queue":
          return "paused";
        default:
          return status || "queued";
      }
    }
    function canResumeTask(task) {
      const capabilities = taskCapabilities(task);
      return (capabilities.resumeQueue === true || capabilities.pauseQueue === true) && taskStatus(task) === "paused";
    }
    function canPauseTask(task) {
      return taskCapabilities(task).pauseQueue === true && taskStatus(task) === "queued";
    }
    function canRetryTask(task) {
      return taskCapabilities(task).retry === true && ["failed_retryable", "cancelled", "crashed"].includes(taskBusinessStatus(task));
    }
    function canCancelTask(task) {
      const capabilities = taskCapabilities(task);
      const status = taskStatus(task);
      if (status === "running") return capabilities.cancelRunning === true || capabilities.cancel === true;
      return capabilities.cancel === true && ["queued", "paused"].includes(status);
    }
    function canDeleteTask(task) {
      return taskCapabilities(task).delete === true && ["success", "failed", "cancelled", "crashed"].includes(taskStatus(task));
    }
    function statusLabel(status) {
      switch (status) {
        case "queued":
          return "等待中";
        case "retry_wait":
          return "等待重试";
        case "running":
          return "下载中";
        case "cancelling":
          return "正在取消";
        case "paused":
          return "排队已暂停";
        case "paused_queue":
          return "排队已暂停";
        case "success":
          return "已完成";
        case "failed":
          return "下载失败";
        case "failed_retryable":
          return "可重试失败";
        case "failed_final":
          return "失败终态";
        case "cancelled":
          return "已取消";
        case "crashed":
          return "异常中断";
        default:
          return "未知";
      }
    }
    function normalizePolicy(value) {
      const source = value && typeof value === "object" ? value : {};
      return {
        startupScanMode: ["always", "manual", "off"].includes(`${source.startupScanMode || ""}`) ? `${source.startupScanMode}` : "always",
        searchCacheMode: `${source.searchCacheMode || ""}` === "off" ? "off" : "current_track",
        autoRepairMode: ["wifi_only", "always", "off"].includes(`${source.autoRepairMode || ""}`) ? `${source.autoRepairMode}` : "wifi_only",
        maxBackgroundDispatch: [1, 2, 3, 4].includes(Number(source.maxBackgroundDispatch)) ? Number(source.maxBackgroundDispatch) : 1,
        maxManualDispatch: [1, 2, 3, 4].includes(Number(source.maxManualDispatch)) ? Number(source.maxManualDispatch) : Number.isFinite(Number(props.parallelism)) ? Number(props.parallelism) : 2,
        maxGlobalDispatch: [1, 2, 3, 4, 5, 6].includes(Number(source.maxGlobalDispatch)) ? Number(source.maxGlobalDispatch) : 3,
        panelShowBackgroundTasks: source.panelShowBackgroundTasks === true,
        panelManualOnly: source.panelManualOnly === true
      };
    }
    function shouldShowTask(task, policy) {
      if (!isPrimaryPanelTask(task)) return false;
      const type = `${task?.type || ""}`.toLowerCase();
      if (!policy.panelShowBackgroundTasks && isBackgroundTaskType(type)) return false;
      if (policy.panelManualOnly && !isManualTaskType(type)) return false;
      return true;
    }
    function isBackgroundTaskType(taskOrType) {
      const type = `${typeof taskOrType === "string" ? taskOrType : taskOrType?.type || ""}`.toLowerCase();
      return type === "download_cache" || type === "download_repair" || type === "download_backfill" || type === "download_reconcile";
    }
    function isManualTaskType(taskOrType) {
      const type = `${typeof taskOrType === "string" ? taskOrType : taskOrType?.type || ""}`.toLowerCase();
      return type === "download_explicit" || type === "browser_export_download";
    }
    function taskSourceLabel(value) {
      switch (`${value || ""}`.toLowerCase()) {
        case "search":
          return "搜索";
        case "search_cache":
          return "搜索缓存";
        case "bili_favorite":
          return "歌单";
        case "startup_scan":
          return "启动扫描";
        case "bili-downloads-backfill":
          return "启动补全";
        case "playlist_repair":
          return "歌单修复";
        case "resource_reconcile":
          return "索引补账";
        case "manual_user":
          return "手动";
        default:
          return `${value || ""}`;
      }
    }
    function resourceTierLabel(value) {
      switch (`${value || ""}`.toUpperCase()) {
        case "TEMP_CACHE":
          return "临时缓存";
        case "PLAYLIST_BACKUP":
          return "歌单补全";
        case "PERSISTENT_BILI":
          return "持久下载";
        default:
          return `${value || ""}`;
      }
    }
    function watchdogLabel(value) {
      const reason = `${value?.reason || ""}`;
      switch (reason) {
        case "no_progress_timeout":
          return "无进度超时";
        case "stage_timeout":
          return "阶段超时";
        case "total_timeout":
          return "总耗时超时";
        default:
          return "Watchdog";
      }
    }
    function taskPanelGroup(task) {
      const status = taskStatus(task);
      if (["queued", "running", "paused"].includes(status)) return "active";
      if (status === "success") return "completed";
      if (["failed", "cancelled", "crashed"].includes(status)) return "exception";
      return "hidden";
    }
    function isPrimaryPanelTask(task) {
      const type = `${task?.type || ""}`.toLowerCase();
      return type !== "cover_download";
    }
    function taskTypeLabel(type) {
      switch (`${type || ""}`.toLowerCase()) {
        case "download_explicit":
        case "explicit_download":
        case "download":
          return "手动下载";
        case "cache_download":
        case "download_cache":
          return "播放缓存";
        case "download_repair":
          return "资源修复";
        case "download_backfill":
          return "启动补全";
        case "download_reconcile":
          return "索引补账";
        case "browser_export_download":
          return "浏览器导出";
        default:
          return "下载任务";
      }
    }
    function compactPath(path) {
      const value = `${path || ""}`;
      if (value.length <= 42) return value;
      return `...${value.slice(-39)}`;
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", _hoisted_1$1, [
        createBaseVNode("header", _hoisted_2$1, [
          createBaseVNode("div", _hoisted_3$1, [
            _cache[10] || (_cache[10] = createBaseVNode("h3", null, "下载管理", -1)),
            createBaseVNode("p", null, toDisplayString(currentTabLabel.value) + " · " + toDisplayString(visibleTasks.value.length) + " 个任务 · 手动运行 " + toDisplayString(manualRunningCount.value) + " · 系统运行 " + toDisplayString(systemRunningCount.value), 1)
          ]),
          createBaseVNode("div", _hoisted_4$1, [
            createBaseVNode("label", _hoisted_5$1, [
              _cache[11] || (_cache[11] = createTextVNode(" 手动队列并发 ", -1)),
              createBaseVNode("select", {
                value: normalizedPolicy.value.maxManualDispatch,
                onChange: onParallelismChange
              }, [
                (openBlock(), createElementBlock(Fragment, null, renderList([1, 2, 3, 4], (n) => {
                  return createBaseVNode("option", {
                    key: n,
                    value: n
                  }, toDisplayString(n), 9, _hoisted_7$1);
                }), 64))
              ], 40, _hoisted_6$1)
            ]),
            createBaseVNode("button", {
              class: "action-btn",
              onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("clear-completed"))
            }, "清空已完成"),
            createBaseVNode("button", {
              class: "action-btn",
              onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("clear-cancelled"))
            }, "清空已取消"),
            createBaseVNode("button", {
              class: "action-btn",
              onClick: _cache[2] || (_cache[2] = ($event) => _ctx.$emit(__props.pausedAll ? "resume-all" : "pause-all"))
            }, toDisplayString(__props.pausedAll ? "恢复排队" : "暂停排队"), 1)
          ])
        ]),
        createBaseVNode("div", _hoisted_8$1, [
          createBaseVNode("label", _hoisted_9$1, [
            _cache[13] || (_cache[13] = createTextVNode(" 启动扫描 ", -1)),
            createBaseVNode("select", {
              value: normalizedPolicy.value.startupScanMode,
              onChange: _cache[3] || (_cache[3] = ($event) => onPolicyChange("startupScanMode", $event))
            }, [..._cache[12] || (_cache[12] = [
              createBaseVNode("option", { value: "always" }, "自动", -1),
              createBaseVNode("option", { value: "manual" }, "仅手动", -1),
              createBaseVNode("option", { value: "off" }, "关闭", -1)
            ])], 40, _hoisted_10$1)
          ]),
          createBaseVNode("label", _hoisted_11$1, [
            _cache[15] || (_cache[15] = createTextVNode(" 搜索缓存 ", -1)),
            createBaseVNode("select", {
              value: normalizedPolicy.value.searchCacheMode,
              onChange: _cache[4] || (_cache[4] = ($event) => onPolicyChange("searchCacheMode", $event))
            }, [..._cache[14] || (_cache[14] = [
              createBaseVNode("option", { value: "current_track" }, "仅当前播放", -1),
              createBaseVNode("option", { value: "off" }, "关闭", -1)
            ])], 40, _hoisted_12$1)
          ]),
          createBaseVNode("label", _hoisted_13$1, [
            _cache[17] || (_cache[17] = createTextVNode(" 自动补全 ", -1)),
            createBaseVNode("select", {
              value: normalizedPolicy.value.autoRepairMode,
              onChange: _cache[5] || (_cache[5] = ($event) => onPolicyChange("autoRepairMode", $event))
            }, [..._cache[16] || (_cache[16] = [
              createBaseVNode("option", { value: "wifi_only" }, "仅 Wi-Fi", -1),
              createBaseVNode("option", { value: "always" }, "始终", -1),
              createBaseVNode("option", { value: "off" }, "关闭", -1)
            ])], 40, _hoisted_14$1)
          ]),
          createBaseVNode("label", _hoisted_15$1, [
            _cache[18] || (_cache[18] = createTextVNode(" 背景并发 ", -1)),
            createBaseVNode("select", {
              value: normalizedPolicy.value.maxBackgroundDispatch,
              onChange: _cache[6] || (_cache[6] = ($event) => onPolicyChange("maxBackgroundDispatch", $event))
            }, [
              (openBlock(), createElementBlock(Fragment, null, renderList([1, 2, 3, 4], (n) => {
                return createBaseVNode("option", {
                  key: n,
                  value: n
                }, toDisplayString(n), 9, _hoisted_17$1);
              }), 64))
            ], 40, _hoisted_16$1)
          ]),
          createBaseVNode("label", _hoisted_18$1, [
            _cache[19] || (_cache[19] = createTextVNode(" 总并发 ", -1)),
            createBaseVNode("select", {
              value: normalizedPolicy.value.maxGlobalDispatch,
              onChange: _cache[7] || (_cache[7] = ($event) => onPolicyChange("maxGlobalDispatch", $event))
            }, [
              (openBlock(), createElementBlock(Fragment, null, renderList([1, 2, 3, 4, 5, 6], (n) => {
                return createBaseVNode("option", {
                  key: n,
                  value: n
                }, toDisplayString(n), 9, _hoisted_20$1);
              }), 64))
            ], 40, _hoisted_19$1)
          ]),
          createBaseVNode("label", _hoisted_21$1, [
            createBaseVNode("input", {
              type: "checkbox",
              checked: normalizedPolicy.value.panelShowBackgroundTasks,
              onChange: _cache[8] || (_cache[8] = ($event) => onPolicyToggle("panelShowBackgroundTasks", $event))
            }, null, 40, _hoisted_22$1),
            _cache[20] || (_cache[20] = createBaseVNode("span", null, "显示后台任务", -1))
          ]),
          createBaseVNode("label", _hoisted_23$1, [
            createBaseVNode("input", {
              type: "checkbox",
              checked: normalizedPolicy.value.panelManualOnly,
              onChange: _cache[9] || (_cache[9] = ($event) => onPolicyToggle("panelManualOnly", $event))
            }, null, 40, _hoisted_24$1),
            _cache[21] || (_cache[21] = createBaseVNode("span", null, "仅手动任务", -1))
          ])
        ]),
        createBaseVNode("div", _hoisted_25$1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(tabs.value, (tab) => {
            return openBlock(), createElementBlock("button", {
              key: tab.key,
              class: normalizeClass(["tab-btn", { active: activeTab.value === tab.key }]),
              onClick: ($event) => activeTab.value = tab.key
            }, [
              createTextVNode(toDisplayString(tab.label) + " ", 1),
              createBaseVNode("span", null, toDisplayString(tab.count), 1)
            ], 10, _hoisted_26$1);
          }), 128))
        ]),
        createBaseVNode("div", _hoisted_27$1, [
          createVNode(ScrollSurface, null, {
            default: withCtx(() => [
              createVNode(VirtualList, {
                items: visibleTasks.value,
                "retain-text": "",
                "stable-content": "",
                "item-height": 136,
                buffer: 4,
                class: "task-list"
              }, {
                default: withCtx(({ item: task, active }) => [
                  createBaseVNode("article", _hoisted_28$1, [
                    createBaseVNode("div", _hoisted_29$1, [
                      createBaseVNode("p", _hoisted_30$1, toDisplayString(task.video?.title || "未命名任务"), 1),
                      createBaseVNode("p", _hoisted_31$1, [
                        createBaseVNode("span", null, toDisplayString(taskTypeLabel(task.type)), 1),
                        task.taskSource ? (openBlock(), createElementBlock("span", _hoisted_32$1, toDisplayString(taskSourceLabel(task.taskSource)), 1)) : createCommentVNode("", true),
                        createBaseVNode("span", null, toDisplayString(statusLabel(taskBusinessStatus(task))), 1),
                        task.speedKbps > 0 ? (openBlock(), createElementBlock("span", _hoisted_33$1, toDisplayString(formatSpeed(task.speedKbps)), 1)) : createCommentVNode("", true),
                        createBaseVNode("span", null, toDisplayString(formatProgress(task.progress)), 1),
                        task.watchdog?.stalled ? (openBlock(), createElementBlock("span", _hoisted_34$1, toDisplayString(watchdogLabel(task.watchdog)), 1)) : createCommentVNode("", true),
                        task.resourceDbCommit ? (openBlock(), createElementBlock("span", _hoisted_35$1, "已索引")) : createCommentVNode("", true),
                        task.resourceTier ? (openBlock(), createElementBlock("span", _hoisted_36$1, toDisplayString(resourceTierLabel(task.resourceTier)), 1)) : createCommentVNode("", true)
                      ]),
                      task.filePath && taskStatus(task) === "success" ? (openBlock(), createElementBlock("p", _hoisted_37$1, toDisplayString(compactPath(task.filePath)), 1)) : createCommentVNode("", true)
                    ]),
                    active ? (openBlock(), createElementBlock("div", _hoisted_38$1, [
                      canResumeTask(task) ? (openBlock(), createElementBlock("button", {
                        key: 0,
                        class: "control-btn start",
                        onClick: ($event) => _ctx.$emit("resume-task", task.id)
                      }, "继续排队", 8, _hoisted_39$1)) : canRetryTask(task) ? (openBlock(), createElementBlock("button", {
                        key: 1,
                        class: "control-btn retry",
                        onClick: ($event) => _ctx.$emit("retry-task", task.id)
                      }, "重试", 8, _hoisted_40$1)) : canPauseTask(task) ? (openBlock(), createElementBlock("button", {
                        key: 2,
                        class: "control-btn pause",
                        onClick: ($event) => _ctx.$emit("pause-task", task.id)
                      }, "暂停排队", 8, _hoisted_41$1)) : createCommentVNode("", true),
                      canCancelTask(task) ? (openBlock(), createElementBlock("button", {
                        key: 3,
                        class: "control-btn danger",
                        onClick: ($event) => _ctx.$emit("cancel-task", task.id)
                      }, "取消下载", 8, _hoisted_42$1)) : createCommentVNode("", true),
                      canDeleteTask(task) ? (openBlock(), createElementBlock("button", {
                        key: 4,
                        class: "control-btn delete",
                        onClick: ($event) => _ctx.$emit("delete-task", task.id)
                      }, "删除", 8, _hoisted_43$1)) : createCommentVNode("", true)
                    ])) : createCommentVNode("", true),
                    active ? (openBlock(), createElementBlock("div", _hoisted_44$1, [
                      createBaseVNode("div", {
                        class: "progress-bar",
                        style: normalizeStyle({ width: `${safeProgress(task.progress)}%` })
                      }, null, 4)
                    ])) : createCommentVNode("", true),
                    task.errorMessage && ["failed_retryable", "failed_final", "crashed"].includes(taskBusinessStatus(task)) ? (openBlock(), createElementBlock("p", _hoisted_45$1, [
                      createTextVNode(toDisplayString(task.errorMessage) + " ", 1),
                      task.errorInfo?.stage ? (openBlock(), createElementBlock("span", _hoisted_46$1, "· " + toDisplayString(task.errorInfo.stage), 1)) : createCommentVNode("", true)
                    ])) : createCommentVNode("", true)
                  ])
                ]),
                _: 1
              }, 8, ["items"])
            ]),
            _: 1
          }),
          visibleTasks.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_47$1, toDisplayString(emptyText.value), 1)) : createCommentVNode("", true)
        ])
      ]);
    };
  }
};
const DownloadTaskPanel = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-673e82a3"]]);
function useLocalMusicExclusions(startScan) {
  const visible = ref(false);
  const loading = ref(false);
  const songs = ref([]);
  const selectedIds = ref([]);
  async function open() {
    visible.value = true;
    selectedIds.value = [];
    loading.value = true;
    try {
      const response = await apiRequest("/api/playlist/scan-local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "listExcluded" })
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      songs.value = Array.isArray(data.songs) ? data.songs : [];
    } catch (error) {
      showGlobalToast(`读取已移除音乐失败：${error.message}`, { type: "error" });
    } finally {
      loading.value = false;
    }
  }
  async function restore() {
    if (!selectedIds.value.length || loading.value) return;
    loading.value = true;
    try {
      if (await startScan({ restoreExcludedIds: [...selectedIds.value] })) visible.value = false;
    } finally {
      loading.value = false;
    }
  }
  return { visible, loading, songs, selectedIds, open, restore };
}
const _hoisted_1 = { class: "playlist-slide-track" };
const _hoisted_2 = { class: "playlist-main-page" };
const _hoisted_3 = {
  key: 0,
  style: { "padding": "10px 15px" }
};
const _hoisted_4 = { style: { "display": "flex", "flex-direction": "column", "gap": "10px" } };
const _hoisted_5 = { style: { "flex": "1", "overflow": "hidden", "text-overflow": "ellipsis", "white-space": "nowrap" } };
const _hoisted_6 = { style: { "position": "relative" } };
const _hoisted_7 = {
  key: 0,
  style: { "background": "rgba(0,0,0,0.04)", "border-radius": "12px", "padding": "10px 12px", "font-size": "13px", "color": "#555" }
};
const _hoisted_8 = { style: { "display": "flex", "justify-content": "space-between", "margin-bottom": "6px" } };
const _hoisted_9 = { style: { "color": "#999", "font-size": "12px" } };
const _hoisted_10 = { style: { "background": "rgba(0,0,0,0.1)", "border-radius": "4px", "height": "4px", "overflow": "hidden" } };
const _hoisted_11 = ["disabled"];
const _hoisted_12 = {
  key: 0,
  class: "playlist-input-overlay"
};
const _hoisted_13 = { class: "playlist-input-dialog" };
const _hoisted_14 = { class: "playlist-input-body excluded-list" };
const _hoisted_15 = { key: 0 };
const _hoisted_16 = { key: 1 };
const _hoisted_17 = ["value"];
const _hoisted_18 = { class: "dialog-buttons" };
const _hoisted_19 = ["disabled"];
const _hoisted_20 = ["disabled"];
const _hoisted_21 = {
  key: 0,
  class: "playlist-input-overlay"
};
const _hoisted_22 = { class: "folder-browser-dialog" };
const _hoisted_23 = { class: "dialog-header" };
const _hoisted_24 = { class: "current-path" };
const _hoisted_25 = { style: { "font-size": "13px", "margin-left": "8px" } };
const _hoisted_26 = { class: "folder-list" };
const _hoisted_27 = ["onClick"];
const _hoisted_28 = { class: "folder-icon" };
const _hoisted_29 = { class: "folder-info" };
const _hoisted_30 = { class: "folder-name" };
const _hoisted_31 = {
  key: 0,
  class: "folder-count"
};
const _hoisted_32 = {
  key: 0,
  class: "empty-tip"
};
const _hoisted_33 = { class: "dialog-buttons" };
const _hoisted_34 = {
  class: "song-list-container",
  id: "songList"
};
const _hoisted_35 = ["onTouchstart"];
const _hoisted_36 = ["onClick"];
const _hoisted_37 = ["onClick"];
const _hoisted_38 = { class: "up-title-box" };
const _hoisted_39 = { class: "title static" };
const _hoisted_40 = { class: "down-singer-box" };
const _hoisted_41 = { class: "artist static" };
const _hoisted_42 = {
  key: 0,
  class: "empty-tip"
};
const _hoisted_43 = {
  key: 0,
  class: "fab-container"
};
const _hoisted_44 = {
  key: 0,
  class: "fab-menu"
};
const _hoisted_45 = {
  key: 1,
  class: "menu-item placeholder-gap",
  "aria-hidden": "true"
};
const _hoisted_46 = {
  key: 0,
  class: "count-badge"
};
const _hoisted_47 = {
  key: 0,
  class: "playlist-input-overlay"
};
const _hoisted_48 = { class: "playlist-input-dialog" };
const _hoisted_49 = { class: "playlist-input-body" };
const _hoisted_50 = {
  key: 0,
  class: "playlist-list"
};
const _hoisted_51 = ["onClick"];
const _hoisted_52 = ["src", "alt"];
const _hoisted_53 = { class: "playlist-info" };
const _hoisted_54 = { class: "playlist-name" };
const _hoisted_55 = { class: "playlist-count" };
const _hoisted_56 = { class: "create-new-section" };
const _hoisted_57 = { class: "dialog-buttons" };
const _hoisted_58 = ["disabled"];
const _hoisted_59 = {
  key: 0,
  class: "playlist-download-task-page"
};
const PLAYLIST_DETAIL_PAGE = "playlist-detail-view";
const BUFFER_SIZE = 3;
const HORIZONTAL_INTENT_RATIO = 1.2;
const PLAYLIST_DETAIL_DRAG_MINI_PLAYER_REASON = "playlist-detail-drag-sort";
const _sfc_main = /* @__PURE__ */ Object.assign({
  name: "PlaylistDetailView"
}, {
  __name: "PlaylistDetailView",
  props: ["id"],
  setup(__props) {
    const props = __props;
    const playlistDragListRef = ref(null);
    let playlistDragAutoAnimateController = null;
    const isPlaylistDragSorting = ref(false);
    async function logPropsId(step, extra = null) {
    }
    async function logDownloadTask(step, extra = null) {
      try {
        await apiRequest("/api/log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tag: "TY_download_task",
            step,
            propsId: props.id,
            extra,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          })
        });
      } catch (_) {
      }
    }
    const playerStore = usePlayerStore();
    const selectionStore = useSelectionStore();
    const isDetailSelectionMode = computed(() => selectionStore.currentPage === PLAYLIST_DETAIL_PAGE && selectionStore.isModeActive);
    selectionStore.setCurrentPage(PLAYLIST_DETAIL_PAGE);
    const loadingManager = useLoadingManager();
    const playlistStore = usePlaylistStore();
    const downloadTaskStore = useDownloadTaskStore();
    const cacheStore = useCacheStore();
    const { useSkinTarget } = useSkinThemeConfig();
    const playlistDetailCoverSkin = useSkinTarget("playlist_detail_cover");
    const pagePlaylistSkin = useSkinTarget("page_playlist");
    const playlistSongItemSkin = useSkinTarget("playlist_song_item");
    const { checking: integrityChecking, missingMap, checkPlaylistIntegrity } = useIntegrityCheck();
    const { handleTouchStart: originalTouchStart, handleTouchMove, handleTouchEnd: originalTouchEnd } = useSelection();
    const { closeMode: playlistActionsCloseMode } = usePlaylistActions();
    const businessMachine = reactive({
      state: { current: "idle" },
      transition(event, payload) {
        console.log(`[BSM PlaylistDetail] ${this.state.current} --${event}-->`, payload);
        switch (event) {
          case "LOAD":
            this.state.current = "loading";
            break;
          case "SUCCESS":
            this.state.current = "loaded";
            break;
          case "ERROR":
            this.state.current = "error";
            break;
          case "REFRESH":
            this.state.current = "refreshing";
            break;
          default:
            console.warn("[BSM PlaylistDetail] Unknown event:", event);
        }
      }
    });
    const pageLifecycle = usePageLifecycle();
    const { insertNext: handleSwipeInsertNext, resetBatch: resetSwipeBatch } = useSwipeInsertManager("playlist-detail");
    const songs = ref([]);
    function resolvePositiveNumber(value, fallback) {
      const number = Number(value);
      return Number.isFinite(number) && number > 0 ? number : fallback;
    }
    function resolveNonNegativeNumber(value, fallback) {
      const number = Number(value);
      return Number.isFinite(number) && number >= 0 ? number : fallback;
    }
    const songItemHeightValue = computed(() => {
      const raw = playlistSongItemSkin.value?.enabled ? playlistSongItemSkin.value?.itemHeight : pagePlaylistSkin.value?.songItemHeight;
      return Math.round(resolvePositiveNumber(raw, 83));
    });
    const songItemPaddingValue = computed(() => Math.round(
      resolveNonNegativeNumber(
        playlistSongItemSkin.value?.enabled ? playlistSongItemSkin.value?.itemPadding : 12,
        12
      )
    ));
    const songItemCoverSizeValue = computed(() => {
      const maxCoverSize = Math.max(0, songItemHeightValue.value - songItemPaddingValue.value * 2);
      const rawCoverSize = playlistSongItemSkin.value?.enabled ? playlistSongItemSkin.value?.coverSize : 56;
      return Math.round(Math.min(resolveNonNegativeNumber(rawCoverSize, 56), maxCoverSize));
    });
    const playlistListGapValue = computed(() => {
      const rawGap = playlistSongItemSkin.value?.enabled ? playlistSongItemSkin.value?.listGap : pagePlaylistSkin.value?.listGap;
      return Math.round(resolveNonNegativeNumber(rawGap, 8));
    });
    const songItemStrideValue = computed(() => {
      const itemHeight = songItemHeightValue.value || 83;
      return itemHeight + playlistListGapValue.value;
    });
    const playlistSongCardStyle = computed(() => ({
      height: `${songItemHeightValue.value}px`,
      minHeight: `${songItemHeightValue.value}px`,
      maxHeight: `${songItemHeightValue.value}px`,
      padding: `${songItemPaddingValue.value}px`
    }));
    const playlistSkeletonListStyle = computed(() => ({
      gap: `${playlistListGapValue.value}px`
    }));
    const playlistSkeletonCardStyle = computed(() => ({
      ...playlistSongCardStyle.value
    }));
    const playlistSkeletonContentStyle = computed(() => ({
      gap: "var(--ty-song-item-gap, 10px)"
    }));
    const playlistSkeletonCoverStyle = computed(() => ({
      width: `${songItemCoverSizeValue.value}px`,
      height: `${songItemCoverSizeValue.value}px`
    }));
    const playlistDetailCoverFrameStyle = computed(() => ({
      borderRadius: `${playlistDetailCoverSkin.value?.enabled ? Math.round(Number(playlistDetailCoverSkin.value?.radius || 8)) : Math.round(Number(pagePlaylistSkin.value?.coverRadius || 8))}px`,
      boxShadow: playlistDetailCoverSkin.value?.enabled && Number(playlistDetailCoverSkin.value?.shadow || 0) > 0 ? `0 12px ${Math.round(Number(playlistDetailCoverSkin.value.shadow || 0) * 1.1)}px rgba(12, 28, 40, 0.14)` : void 0
    }));
    const playlistDetailCoverImageStyle = computed(() => buildSkinMediaElementStyle(playlistDetailCoverSkin.value, {
      defaultFit: "contain",
      enabledOnly: true
    }));
    const isDownloadTaskPageEnabled = computed(() => props.id === "bili_downloads");
    const isDownloadTaskPageOpen = ref(false);
    const isDownloadPageSwitching = ref(false);
    const downloadTaskPanelKey = ref(0);
    let downloadPageTouchStartX = 0;
    let downloadPageTouchStartY = 0;
    let downloadPageTouchDeltaX = 0;
    let downloadPageTouchDeltaY = 0;
    let unregisterPageBackHandler = null;
    let playlistSongUpdatedListener = null;
    let playlistRefreshTimer = null;
    let playlistRefreshInFlight = false;
    function schedulePlaylistRefresh(reason = "external-update", delayMs = 180) {
      if (playlistRefreshTimer) {
        clearTimeout(playlistRefreshTimer);
        playlistRefreshTimer = null;
      }
      playlistRefreshTimer = setTimeout(async () => {
        playlistRefreshTimer = null;
        if (playlistRefreshInFlight) return;
        playlistRefreshInFlight = true;
        try {
          console.log(`[PlaylistDetailView] Scheduled refresh: ${reason}`);
          await refreshPlaylist();
        } finally {
          playlistRefreshInFlight = false;
        }
      }, Math.max(0, delayMs));
    }
    function handlePlaylistDetailBack() {
      if (showExcludedMusic.value) {
        if (!excludedMusicLoading.value) showExcludedMusic.value = false;
        return true;
      }
      if (showFolderBrowser.value) {
        showFolderBrowser.value = false;
        return true;
      }
      if (showDataEditDialog.value) {
        showDataEditDialog.value = false;
        return true;
      }
      if (showPlaylistDialog.value) {
        closePlaylistDialog();
        return true;
      }
      if (isMenuOpen.value) {
        isMenuOpen.value = false;
        return true;
      }
      if (isDownloadTaskPageEnabled.value && isDownloadTaskPageOpen.value) {
        switchDownloadTaskPage(false);
        return true;
      }
      if (isDetailSelectionMode.value) {
        void closeMode();
        return true;
      }
      return false;
    }
    function switchDownloadTaskPage(open) {
      if (!isDownloadTaskPageEnabled.value) return;
      if (isDownloadPageSwitching.value) return;
      if (isDownloadTaskPageOpen.value === open) return;
      isDownloadPageSwitching.value = true;
      isDownloadTaskPageOpen.value = open;
      if (open) {
        downloadTaskPanelKey.value += 1;
        downloadTaskStore.ensureInitializedNow();
      }
      logDownloadTask("toggle-subpage", {
        open,
        taskCount: downloadTaskStore.visibleTasks.length
      });
      setTimeout(() => {
        isDownloadPageSwitching.value = false;
      }, 320);
    }
    function toggleDownloadTaskPage() {
      switchDownloadTaskPage(!isDownloadTaskPageOpen.value);
    }
    function handleDownloadPageTouchStart(event) {
      if (!isDownloadTaskPageEnabled.value || isDownloadPageSwitching.value) return;
      const touch = event?.touches?.[0];
      if (!touch) return;
      downloadPageTouchStartX = touch.clientX;
      downloadPageTouchStartY = touch.clientY;
      downloadPageTouchDeltaX = 0;
      downloadPageTouchDeltaY = 0;
    }
    function handleDownloadPageTouchMove(event) {
      if (!isDownloadTaskPageEnabled.value || isDownloadPageSwitching.value) return;
      const touch = event?.touches?.[0];
      if (!touch) return;
      downloadPageTouchDeltaX = touch.clientX - downloadPageTouchStartX;
      downloadPageTouchDeltaY = touch.clientY - downloadPageTouchStartY;
    }
    function handleDownloadPageTouchEnd() {
      if (!isDownloadTaskPageEnabled.value || isDownloadPageSwitching.value) return;
      if (Math.abs(downloadPageTouchDeltaX) < 48) return;
      if (Math.abs(downloadPageTouchDeltaX) < Math.abs(downloadPageTouchDeltaY)) return;
      const edgeSize = 56;
      const fromLeftEdge = downloadPageTouchStartX <= edgeSize;
      const fromRightEdge = downloadPageTouchStartX >= window.innerWidth - edgeSize;
      const swipeRight = downloadPageTouchDeltaX > 48;
      const swipeLeft = downloadPageTouchDeltaX < -48;
      if (!isDownloadTaskPageOpen.value && (fromLeftEdge || fromRightEdge) && (swipeRight || swipeLeft)) {
        switchDownloadTaskPage(true);
        return;
      }
      if (isDownloadTaskPageOpen.value && (swipeRight || swipeLeft)) {
        switchDownloadTaskPage(false);
      }
    }
    function setDownloadParallelism(value) {
      downloadTaskStore.setParallelism(value);
      logDownloadTask("set-parallelism", { value });
    }
    function pauseAllDownloadTasks() {
      downloadTaskStore.pauseAll();
      logDownloadTask("pause-all");
    }
    function resumeAllDownloadTasks() {
      downloadTaskStore.resumeAll();
      logDownloadTask("resume-all");
    }
    function pauseDownloadTask(taskId) {
      downloadTaskStore.pauseTask(taskId);
      logDownloadTask("pause-task", { taskId });
    }
    function resumeDownloadTask(taskId) {
      downloadTaskStore.resumeTask(taskId);
      logDownloadTask("resume-task", { taskId });
    }
    function retryDownloadTask(taskId) {
      downloadTaskStore.retryTask(taskId);
      logDownloadTask("retry-task", { taskId });
    }
    function cancelDownloadTask(taskId) {
      downloadTaskStore.cancelTask(taskId);
      logDownloadTask("cancel-task", { taskId });
    }
    function deleteDownloadTask(taskId) {
      downloadTaskStore.deleteTask(taskId);
      logDownloadTask("delete-task", { taskId });
    }
    function clearCompletedDownloadTasks() {
      downloadTaskStore.clearCompletedTasks();
      logDownloadTask("clear-completed");
    }
    function clearCancelledDownloadTasks() {
      downloadTaskStore.clearCancelledTasks();
      logDownloadTask("clear-cancelled");
    }
    function updateDownloadPolicy(patch) {
      downloadTaskStore.updateDownloadPolicy(patch);
      logDownloadTask("update-download-policy", patch || {});
    }
    watch(() => props.id, (nextId) => {
      if (nextId === "bili_downloads") {
        downloadTaskStore.ensureInitializedNow();
        logDownloadTask("enter-bili-downloads", { taskCount: downloadTaskStore.visibleTasks.length });
      } else {
        if (isDownloadTaskPageOpen.value) {
          logDownloadTask("leave-bili-downloads", { taskCount: downloadTaskStore.visibleTasks.length });
        }
        isDownloadTaskPageOpen.value = false;
        isDownloadPageSwitching.value = false;
        downloadPageTouchStartX = 0;
        downloadPageTouchStartY = 0;
        downloadPageTouchDeltaX = 0;
        downloadPageTouchDeltaY = 0;
      }
    }, { immediate: true });
    const scanPath = ref("");
    const showFolderBrowser = ref(false);
    const currentBrowsePath = ref("/storage/emulated/0");
    const folders = ref([]);
    function ensureLocalFeaturePermission(scene = "local_music") {
      const granted = ensureAndroidFeaturePermission(scene);
      if (!granted) {
        showGlobalToast("请先授权存储权限后，再重试该功能。", { type: "warning" });
      }
      return granted;
    }
    async function loadFolders(path) {
      if (!ensureLocalFeaturePermission("browse_folders")) return;
      try {
        const encodedPath = encodeURIComponent(path);
        const res = await apiRequest(`/api/browse-folders?path=${encodedPath}`);
        if (res.ok) {
          const data = await res.json();
          currentBrowsePath.value = data.currentPath;
          folders.value = data.folders;
        } else {
          showGlobalToast("无法访问该文件夹", { type: "error" });
        }
      } catch (e) {
        showGlobalToast("加载失败: " + e.message, { type: "error" });
      }
    }
    async function handleFolderClick(folder) {
      await loadFolders(folder.path);
    }
    function confirmSelectFolder() {
      scanPath.value = currentBrowsePath.value === "/storage/emulated/0" ? "" : currentBrowsePath.value;
      showFolderBrowser.value = false;
    }
    watch(showFolderBrowser, (newVal) => {
      if (newVal) {
        if (!ensureLocalFeaturePermission("browse_folders")) {
          showFolderBrowser.value = false;
          return;
        }
        loadFolders(scanPath.value || "/storage/emulated/0");
      }
    });
    const {
      visible: showExcludedMusic,
      loading: excludedMusicLoading,
      songs: excludedMusicSongs,
      selectedIds: excludedMusicSelectedIds,
      open: openExcludedMusic,
      restore: restoreExcludedMusic
    } = useLocalMusicExclusions(handleRescan);
    const isScanning = ref(false);
    const scanProgressInfo = ref({ phase: "idle", total: 0, processed: 0, newCount: 0, count: 0, message: "" });
    let scanPollTimer = null;
    async function pollScanProgress(onDone) {
      try {
        const res = await apiRequest("/api/scan-progress");
        if (!res.ok) return;
        const result = await res.json();
        const data = result.data || result;
        scanProgressInfo.value = data;
        if (!data.isRunning) {
          clearInterval(scanPollTimer);
          scanPollTimer = null;
          isScanning.value = false;
          if (onDone) onDone(data);
        }
      } catch (e) {
      }
    }
    async function handleRescan({ restoreExcludedIds = [] } = {}) {
      if (isScanning.value) return false;
      const restoring = restoreExcludedIds.length > 0;
      if (!ensureLocalFeaturePermission("scan_local_music")) return;
      const pathLabel = scanPath.value ? `"${scanPath.value.split("/").pop()}"` : "全部";
      const confirmed = await showGlobalConfirm({
        title: restoring ? "重新导入所选音乐" : "确认扫描",
        message: restoring ? `重新导入所选 ${restoreExcludedIds.length} 首音乐；其他已移除项目继续排除。是否继续？` : `扫描${pathLabel}音乐，更新文件位置并同步缺失文件；已移除的音乐继续排除。是否继续？`,
        confirmText: "开始扫描",
        cancelText: "取消"
      });
      if (!confirmed) return;
      try {
        const res = await apiRequest("/api/playlist/scan-local", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: restoring ? "" : scanPath.value, restoreExcludedIds })
        });
        if (!res.ok) {
          const data2 = await res.json();
          toastMessage.value = "扫描失败: " + (data2.error || "未知错误");
          showToast.value = true;
          return;
        }
        const result = await res.json();
        const data = result.data || result;
        if (data.alreadyRunning) {
          isScanning.value = true;
        } else if (data.started) {
          isScanning.value = true;
          scanProgressInfo.value = { phase: "scanning", total: 0, processed: 0, newCount: 0, count: 0, message: "正在扫描..." };
        }
        const done = (finalData) => {
          if (finalData.phase === "error") {
            toastMessage.value = "扫描出错: " + (finalData.error || "未知错误");
            showToast.value = true;
          } else {
            const msg = finalData.newCount > 0 ? `扫描完成！新增 ${finalData.newCount} 首歌曲，总计 ${finalData.count} 首` : `扫描完成！未发现新歌曲，总计 ${finalData.count} 首`;
            toastMessage.value = msg;
            showToast.value = true;
          }
          void refreshPlaylist().then(() => emitPlaylistContentUpdated(props.id, "local-library-scan"));
        };
        clearInterval(scanPollTimer);
        scanPollTimer = setInterval(() => pollScanProgress(done), 600);
        pollScanProgress(done);
        return true;
      } catch (e) {
        isScanning.value = false;
        showGlobalToast("操作失败: " + e.message, { type: "error" });
      }
    }
    const isMenuOpen = ref(false);
    const isLoadingSongs = computed(
      () => businessMachine.state.current === "loading" || businessMachine.state.current === "refreshing"
    );
    const showPlaylistSkeleton = computed(() => isLoadingSongs.value && songs.value.length === 0);
    const isSortablePlaylist = computed(() => `${props.id || ""}`.startsWith("custom_"));
    const isUserCustomPlaylist = computed(() => `${props.id || ""}`.startsWith("custom_"));
    const isDownloadPlaylist = computed(() => `${props.id || ""}` === "bili_downloads");
    const isLocalMusicPlaylist = computed(() => props.id === "local_music");
    const canBatchDeleteInDetail = computed(() => isUserCustomPlaylist.value || isDownloadPlaylist.value || isLocalMusicPlaylist.value);
    const visibleRange = ref({ start: 0, end: 12 });
    const playlistRenderPaused = ref(false);
    const playlistHydrationActive = ref(true);
    const playlistHydrated = useRowHydration(
      songs,
      computed(() => ({ start: visibleRange.value.start, end: visibleRange.value.end + 1 })),
      computed(() => playlistHydrationActive.value && !playlistRenderPaused.value),
      (song) => song.hash_id ?? song.id
    );
    const isItemVisible = (index) => playlistHydrated.value.has(songs.value[index]?.hash_id ?? songs.value[index]?.id);
    let exitLongPressTimer = null;
    let scrollContainer = null;
    let lastPlaylistScrollTop = 0;
    let playlistScrollFrameId = 0;
    let playlistRestoreFrameId = 0;
    let playlistRestoreGeneration = 0;
    let playlistViewportActive = true;
    const playlistScrollActivity = createScrollActivity(() => scrollContainer, { onPhaseChange: (phase) => {
      playlistRenderPaused.value = phase === "fast";
    } });
    function cancelPlaylistViewportWork() {
      playlistHydrationActive.value = false;
      playlistScrollActivity.stop();
      ++playlistRestoreGeneration;
      if (playlistRestoreFrameId) cancelAnimationFrame(playlistRestoreFrameId);
      playlistRestoreFrameId = 0;
      if (playlistScrollFrameId) cancelAnimationFrame(playlistScrollFrameId);
      playlistScrollFrameId = 0;
      loadingManager.abortPreviousTasks(props.id);
      if (loadingManager.viewportInfo.playlistId === props.id) loadingManager.viewportInfo.playlistId = null;
    }
    let showPlaylistDialog = ref(false);
    let newPlaylistName = ref("");
    const existingPlaylists = ref([]);
    const selectedSongIds = ref([]);
    const loadedAudio = /* @__PURE__ */ new Map();
    const loadedCovers = /* @__PURE__ */ new Map();
    const selectionModeService = useSelectionModeMicroservice({
      selectionStore,
      playlistStore,
      isMenuOpen,
      closeModeImpl: playlistActionsCloseMode,
      getAllIds: () => songs.value.map((song) => getSongKey(song)).filter(Boolean),
      openAddToPlaylist: async (selectedIds) => {
        selectedSongIds.value = [...selectedIds];
        await loadExistingPlaylists();
        showPlaylistDialog.value = true;
      },
      getTracksBySelectedIds: (selectedIds) => resolveSelectedSongsByIds(selectedIds),
      getCurrentHashId: () => playerStore.currentHashId,
      playNextSource: "playlist_detail_batch_play_next",
      runDelete: async (selectedIds) => handleDeleteSelectedSongs(selectedIds)
    });
    const closeMode = selectionModeService.closeMode;
    const selectAll = selectionModeService.selectAll;
    const handleAction = selectionModeService.handleAction;
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
    function getSongKey(song) {
      return `${song?.hash_id || song?.id || ""}`.trim();
    }
    function sortPlaylistSongs(source = []) {
      return [...source].sort((a, b) => {
        const ak = a?.order ?? a?.sort_order;
        const bk = b?.order ?? b?.sort_order;
        if (ak != null || bk != null) return compareOrderKeysDesc(ak, bk, 3);
        return 0;
      });
    }
    function cloneSongSnapshot(source = []) {
      return Array.isArray(source) ? source.filter((song) => song && typeof song === "object").map((song) => ({ ...song })) : [];
    }
    function restorePlaylistSongsFromCache() {
      const cachedState = cacheStore.getPlaylistState(props.id);
      const cachedSongs = Array.isArray(cachedState?.songsSnapshot) ? cachedState.songsSnapshot : [];
      if (cachedSongs.length === 0) {
        return false;
      }
      songs.value = sortPlaylistSongs(cloneSongSnapshot(cachedSongs));
      return true;
    }
    function resolveSelectedSongsByIds(selectedIds) {
      if (!Array.isArray(selectedIds) || selectedIds.length === 0) return [];
      const songMap = /* @__PURE__ */ new Map();
      songs.value.forEach((song) => {
        const byId = `${song?.id || ""}`.trim();
        const byHash = `${song?.hash_id || ""}`.trim();
        if (byId) songMap.set(byId, song);
        if (byHash) songMap.set(byHash, song);
      });
      return selectedIds.map((id) => songMap.get(`${id || ""}`.trim())).filter(Boolean);
    }
    async function handleDeleteSelectedSongs(selectedIds) {
      if (!canBatchDeleteInDetail.value) {
        showGlobalToast("当前歌单暂不支持批量删除", { type: "warning" });
        return false;
      }
      const selectedSongs = resolveSelectedSongsByIds(selectedIds);
      const hashIds = Array.from(
        new Set(
          selectedSongs.map((song) => getSongKey(song)).filter(Boolean)
        )
      );
      if (!hashIds.length) {
        showGlobalToast("未找到可删除的歌曲", { type: "warning" });
        return false;
      }
      if (hashIds.length > 5) {
        const confirmed = await showGlobalConfirm({
          title: isLocalMusicPlaylist.value ? "移除本地音乐" : "批量删除",
          message: isLocalMusicPlaylist.value ? `从 App 移除 ${hashIds.length} 首，保留手机文件，后续扫描继续排除；可在“已移除音乐”手动导入。` : isDownloadPlaylist.value ? `已选择 ${hashIds.length} 首，确认删除记录并清理本地下载文件吗？` : `已选择 ${hashIds.length} 首，确认从当前歌单删除这些歌曲吗？`,
          confirmText: "删除",
          cancelText: "取消"
        });
        if (!confirmed) return false;
      }
      try {
        const response = await apiRequest("/api/playlist/batch-remove", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playlistId: props.id,
            hashIds,
            deleteFiles: isDownloadPlaylist.value
          })
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          showGlobalToast(result?.error || result?.message || `删除失败（HTTP ${response.status}）`, { type: "error" });
          return false;
        }
        await refreshPlaylist();
        emitPlaylistContentUpdated(props.id, isDownloadPlaylist.value ? "playlist-detail-batch-delete-download" : "playlist-detail-batch-delete");
        if (isDownloadPlaylist.value) {
          const cleanedPlaylistIds = Array.isArray(result?.cleanedPlaylistIds) ? result.cleanedPlaylistIds : [];
          cleanedPlaylistIds.map((playlistId) => `${playlistId || ""}`.trim()).filter((playlistId) => playlistId.startsWith("custom_")).forEach((playlistId) => {
            emitPlaylistContentUpdated(playlistId, "playlist-detail-linked-cleanup");
          });
        }
        const removed = Number(result?.removed ?? hashIds.length);
        const deletedFiles = Number(result?.deletedFiles ?? 0);
        if (isDownloadPlaylist.value) {
          showGlobalToast(`已删除 ${removed} 首下载歌曲，清理 ${deletedFiles} 个本地文件`);
        } else if (isLocalMusicPlaylist.value) {
          showGlobalToast(`已移除 ${removed} 首，源文件保留，可在“已移除音乐”重新导入`);
        } else {
          showGlobalToast(`已从歌单删除 ${removed} 首歌曲`);
        }
        return true;
      } catch (error) {
        console.error("批量删除失败:", error);
        showGlobalToast("批量删除失败: " + error.message, { type: "error" });
        return false;
      }
    }
    let swipeStartX = 0;
    let swipeStartY = 0;
    let swipeCurrentSong = null;
    const SWIPE_THRESHOLD = SWIPE_REVEAL.triggerThreshold;
    const INSERT_THRESHOLD = SWIPE_REVEAL.triggerThreshold;
    const MAX_SWIPE = SWIPE_REVEAL.maxSwipe;
    const SWIPE_INTENT_THRESHOLD = SWIPE_REVEAL.intentThreshold;
    let isSwipeGesture = false;
    const swipeOffset = ref(0);
    const swipeVisualSongId = ref("");
    function isSwipeVisualSong(song) {
      return swipeVisualSongId.value !== "" && swipeVisualSongId.value === song?.id;
    }
    function getSwipeStyle(song) {
      if (!isSwipeVisualSong(song)) return {};
      return getSwipeRevealContentStyle({
        offset: swipeOffset.value,
        phase: isSwipeGesture ? "dragging" : "settle",
        isDragging: isSwipeGesture
      });
    }
    function getInsertBackgroundStyle(song) {
      if (!isSwipeVisualSong(song) || swipeOffset.value >= 0) return {};
      return getSwipeRevealBackgroundStyle({
        offset: swipeOffset.value,
        direction: "left",
        accentRgb: SWIPE_REVEAL.insertAccentRgb,
        threshold: INSERT_THRESHOLD
      });
    }
    function isInsertIconVisible(song) {
      if (!isSwipeVisualSong(song)) return false;
      return isSwipeRevealIconVisible(swipeOffset.value, "left");
    }
    function shouldShakeInsertIcon(song) {
      if (!isSwipeVisualSong(song)) return false;
      return isSwipeRevealReady(swipeOffset.value, "left");
    }
    function isInsertActionReady(song) {
      if (!isSwipeVisualSong(song)) return false;
      return isSwipeRevealReady(swipeOffset.value, "left");
    }
    function clearSwipeVisual() {
      swipeCurrentSong = null;
      swipeVisualSongId.value = "";
      swipeOffset.value = 0;
      isSwipeGesture = false;
    }
    const showDataEditDialog = ref(false);
    const editingData = ref(null);
    const currentTrackId = computed(() => playerStore.currentTrack?.id);
    function openDataEdit(song) {
      if (isDetailSelectionMode.value) {
        showGlobalToast("多选模式下暂不支持编辑歌曲信息", { type: "warning" });
        return;
      }
      console.log("打开歌曲编辑对话框:", song);
      editingData.value = song;
      showDataEditDialog.value = true;
    }
    function handleDataSaved(updateData) {
      console.log("🎵 [PlaylistDetailView] handleDataSaved called with updateData:", updateData);
      if (editingData.value) {
        Object.assign(editingData.value, updateData);
      }
      const index = songs.value.findIndex((s) => s.id === editingData.value.id);
      if (index !== -1) {
        songs.value[index] = { ...songs.value[index], ...updateData };
        console.log("🎵 [PlaylistDetailView] updated songs array at index:", index);
        const playerStore2 = usePlayerStore();
        console.log("🎵 [PlaylistDetailView] checking currentTrack:", playerStore2.currentTrack?.id || playerStore2.currentTrack?.hash_id, "vs editing:", editingData.value.id);
        if (playerStore2.currentTrack && (playerStore2.currentTrack.id === editingData.value.id || playerStore2.currentTrack.hash_id === editingData.value.id)) {
          console.log("🎵 [PlaylistDetailView] updating playerStore.currentTrack with:", updateData);
          playerStore2.currentTrack = { ...playerStore2.currentTrack, ...updateData };
          console.log("🎵 [PlaylistDetailView] playerStore.currentTrack updated, new lrc_user_path:", playerStore2.currentTrack.lrc_user_path);
        } else {
          console.log("🎵 [PlaylistDetailView] currentTrack does not match edited song");
        }
      }
    }
    const loadAudio = (songId) => {
      return new Promise((resolve) => {
        if (loadedAudio.has(songId)) {
          resolve();
          return;
        }
        const song = songs.value.find((s) => s.id === songId);
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
        if (loadedCovers.has(songId)) {
          resolve();
          return;
        }
        const song = songs.value.find((s) => s.id === songId);
        if (!song) {
          resolve();
          return;
        }
        const coverUrl = getSongCoverSrc(song) || `/api/cover/${song.id}`;
        prefetchImage(coverUrl).finally(() => {
          loadedCovers.set(songId, true);
          resolve();
        });
      });
    };
    const reorderCount = ref(0);
    const handleTouchStart = (e, type, id) => {
      const touch = e.touches?.[0];
      if (touch) {
        swipeStartX = touch.clientX;
        swipeStartY = touch.clientY;
        swipeCurrentSong = songs.value.find((song) => song.id === id);
        swipeVisualSongId.value = swipeCurrentSong?.id || "";
        swipeOffset.value = 0;
        isSwipeGesture = false;
      }
      if (isDetailSelectionMode.value) {
        exitLongPressTimer = setTimeout(() => {
          closeMode();
          if (window.navigator.vibrate) window.navigator.vibrate(20);
        }, 800);
      }
      originalTouchStart(e, type, id);
    };
    const handleTouchMoveWrapped = (e) => {
      if (!isDetailSelectionMode.value && swipeCurrentSong) {
        const touch = e.touches?.[0];
        if (touch) {
          const deltaX = touch.clientX - swipeStartX;
          const deltaY = Math.abs(touch.clientY - swipeStartY);
          const hasSwipeIntent = deltaX < -SWIPE_INTENT_THRESHOLD && Math.abs(deltaX) > deltaY * HORIZONTAL_INTENT_RATIO;
          if (hasSwipeIntent) {
            if (!isSwipeGesture) {
              isSwipeGesture = true;
              originalTouchEnd(e);
            }
            e.preventDefault();
            swipeOffset.value = resolveSwipeRevealOffset(deltaX, "left");
            return;
          }
        }
      }
      handleTouchMove(e);
    };
    const handleTouchEnd = (e) => {
      clearTimeout(exitLongPressTimer);
      if (!isDetailSelectionMode.value && swipeCurrentSong && isSwipeGesture) {
        const touch = e.changedTouches?.[0];
        if (touch) {
          const deltaX = touch.clientX - swipeStartX;
          const deltaY = Math.abs(touch.clientY - swipeStartY);
          if (deltaX < -SWIPE_THRESHOLD && Math.abs(deltaX) > deltaY * 1.5) {
            console.log("[PlaylistDetailView] 检测到左滑手势，插入下一首:", swipeCurrentSong.title);
            handleSwipeInsertNext(swipeCurrentSong);
            isSwipeGesture = false;
            swipeOffset.value = -MAX_SWIPE;
            window.setTimeout(() => {
              clearSwipeVisual();
            }, 300);
            if (window.navigator.vibrate) {
              window.navigator.vibrate(30);
            }
          } else {
            isSwipeGesture = false;
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
    function setupPlaylistDragAutoAnimate() {
      playlistDragAutoAnimateController?.disable?.();
      playlistDragAutoAnimateController = null;
    }
    const onDragStart = () => {
      isPlaylistDragSorting.value = true;
      playlistDragAutoAnimateController?.disable?.();
      playlistDragAutoAnimateController = null;
      playerStore.holdMiniPlayer(PLAYLIST_DETAIL_DRAG_MINI_PLAYER_REASON);
    };
    const onDragEnd = () => {
      playerStore.releaseMiniPlayer(PLAYLIST_DETAIL_DRAG_MINI_PLAYER_REASON);
      requestAnimationFrame(() => {
        isPlaylistDragSorting.value = false;
      });
    };
    const onDragChange = (evt) => {
      if (evt.moved) {
        const { element, newIndex } = evt.moved;
        const prev = songs.value[newIndex - 1];
        const next = songs.value[newIndex + 1];
        const prevKey = prev?.order ?? prev?.sort_order;
        const nextKey = next?.order ?? next?.sort_order;
        const { minLength, maxLength } = getOrderConstraints(songs.value.length);
        let newKey;
        try {
          newKey = getOrderKeyBetweenDesc(prevKey, nextKey, minLength, maxLength);
        } catch (e) {
          console.warn("Order key exhaustion:", e);
          toastMessage.value = "排序空间需优化，正在自动重排...";
          showToast.value = true;
          apiRequest("/api/playlist/rebalance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ playlistId: props.id })
          }).then(async () => {
            await refreshPlaylist();
            toastMessage.value = "优化完成，请重新操作";
            showToast.value = true;
          }).catch((err) => {
            showGlobalToast("重排失败: " + err.message, { type: "error" });
          });
          return;
        }
        element.order = newKey;
        if (element.sort_order) delete element.sort_order;
        apiRequest("/api/action/reorder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: element.id,
            playlistId: props.id,
            newOrder: newKey
          })
        }).then(() => {
          reorderCount.value++;
          console.log(`[Reorder] Count: ${reorderCount.value}`);
        }).catch(console.warn);
      }
    };
    const checkAndTriggerRebalance = () => {
      if (reorderCount.value > 30 && isSortablePlaylist.value) {
        console.log(`[Rebalance] Triggering rebalance for ${props.id} (Count: ${reorderCount.value})`);
        reorderCount.value = 0;
        try {
          apiRequest("/api/playlist/rebalance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ playlistId: props.id })
          });
        } catch (e) {
          console.warn("Rebalance request failed", e);
        }
      }
    };
    async function handleSongClick(song, index) {
      if (isDetailSelectionMode.value) {
        selectionStore.toggleItem(song.id);
      } else {
        console.log(`🎵 用户点击: ${formatTitle(song)} (索引: ${index})`);
        playerStore.playWithContext(songs.value, index, {
          contextId: props.id,
          source: "playlist_detail",
          triggerSource: "manual_user"
        });
        Promise.all([
          loadAudio(song.id),
          loadCover(song.id)
        ]).then(() => {
          const before = 1;
          const after = 2;
          const preloadStart = Math.max(0, index - before);
          const preloadEnd = Math.min(songs.value.length - 1, index + after);
          console.log(`🔊 预加载邻近音频和封面 [${preloadStart}-${preloadEnd}]...`);
          for (let i = preloadStart; i <= preloadEnd; i++) {
            if (i !== index) {
              const neighborSong = songs.value[i];
              loadAudio(neighborSong.id);
              loadCover(neighborSong.id);
            }
          }
        });
      }
    }
    async function refreshPlaylist() {
      try {
        await logPropsId("refreshPlaylist");
        const res = await apiRequest(`/api/playlist/${props.id}`);
        const data = await res.json();
        if (typeof data.reorder_count === "number") {
          reorderCount.value = data.reorder_count;
        }
        const rawSongs = Array.isArray(data.songs) ? data.songs : Object.values(data.songs || {});
        songs.value = sortPlaylistSongs(rawSongs);
        if (props.id === "local_music") {
          const byId = new Map(songs.value.map((song) => [getSongKey(song), song]));
          for (const queued of playlistStore.queue) {
            const fresh = byId.get(getSongKey(queued));
            if (!fresh || getSongKey(queued) === playerStore.currentHashId) continue;
            for (const field of ["src", "audio_local_path", "audio_bili_path", "local_media_id", "local_content_key"]) {
              if (fresh[field] !== void 0) queued[field] = fresh[field];
            }
          }
        }
        console.log("✅ 歌单数据已刷新");
      } catch (e) {
        console.error("刷新歌单数据失败:", e);
      }
    }
    async function loadExistingPlaylists() {
      try {
        await logPropsId("loadExistingPlaylists");
        const response = await apiRequest("/api/playlists");
        if (response.ok) {
          const data = await response.json();
          existingPlaylists.value = (data.playlists || []).filter((p) => p.isCustom === true && p.id !== props.id);
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
        console.log("📤 发送添加到歌单请求:", payload);
        const response = await apiRequest("/api/playlist/batch-add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (response.ok) {
          const playlist = existingPlaylists.value.find((p) => p.id === playlistId);
          showGlobalToast(`✅ 已添加 ${selectedSongIds.value.length} 首歌曲到歌单《${playlist?.name || "歌单"}》`);
          emitPlaylistContentUpdated(playlistId, "playlist-detail-batch-add");
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
        const firstSongIndex = songs.value.findIndex((song) => selectedSongIds.value.includes(song.id));
        const firstSong = songs.value[firstSongIndex];
        const coverUrl = getSongCoverSrc(firstSong) || `/api/cover/${firstSong?.id}`;
        const payload = {
          playlistName,
          coverUrl,
          songIds: selectedSongIds.value
        };
        console.log("📤 发送创建歌单请求:", payload);
        const response = await apiRequest("/api/playlist/custom/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
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
    pageLifecycle.onMounted(async () => {
      selectionStore.setCurrentPage(PLAYLIST_DETAIL_PAGE);
      try {
        await logPropsId("onMounted");
        restorePlaylistSongsFromCache();
        businessMachine.transition("LOAD");
        const res = await apiRequest(`/api/playlist/${props.id}`);
        const data = await res.json();
        if (typeof data.reorder_count === "number") {
          reorderCount.value = data.reorder_count;
          console.log(`Initialized reorderCount: ${reorderCount.value}`);
        }
        const rawSongs = Array.isArray(data.songs) ? data.songs : Object.values(data.songs || {});
        const sortedSongs = sortPlaylistSongs(rawSongs);
        songs.value = sortedSongs;
        await logPropsId("loadingManager.initPlaylist");
        loadingManager.initPlaylist(props.id, sortedSongs);
        loadingManager.markTextLoaded(props.id, Array.from({ length: sortedSongs.length }, (_, i) => i));
        scrollContainer = document.getElementById("songList");
        if (scrollContainer) {
          scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
        }
        await nextTick();
        setupPlaylistDragAutoAnimate();
        if (scrollContainer) {
          const itemHeight = songItemStrideValue.value;
          const containerHeight = scrollContainer.clientHeight;
          const scrollTop = scrollContainer.scrollTop;
          const startIndex = Math.floor(scrollTop / itemHeight);
          const visibleCount = Math.ceil(containerHeight / itemHeight);
          const endIndex = Math.min(startIndex + visibleCount, songs.value.length - 1);
          console.log(`📍 初始化视口: [${startIndex}, ${endIndex}], 可见数量: ${visibleCount}`);
          visibleRange.value = {
            start: Math.max(0, startIndex - BUFFER_SIZE),
            end: Math.min(songs.value.length - 1, endIndex + BUFFER_SIZE)
          };
          loadingManager.updateViewport(startIndex, endIndex, visibleCount, props.id);
        }
        if (!playlistSongUpdatedListener && typeof window !== "undefined") {
          playlistSongUpdatedListener = (evt) => {
            const payload = evt?.detail || {};
            const playlistId = `${payload?.playlistId || ""}`.trim();
            if (!playlistId || playlistId !== props.id) return;
            const shouldForceRefresh = payload?.refreshPlaylist === true;
            if (shouldForceRefresh) {
              cacheStore.clearPlaylistState(props.id);
              schedulePlaylistRefresh(payload?.reason || "playlist-content-updated", 0);
              return;
            }
            const songId = `${payload?.songId || payload?.hashId || payload?.id || ""}`.trim();
            const src = `${payload?.src || ""}`.trim();
            const cover = `${payload?.cover || ""}`.trim();
            if (songId) {
              songs.value.forEach((song) => {
                const sid = `${song?.hash_id || song?.id || ""}`.trim();
                if (!sid || sid !== songId) return;
                if (src) song.src = src;
                if (cover) song.cover = cover;
              });
            }
            if (props.id === "bili_downloads") {
              schedulePlaylistRefresh("playlist-song-updated");
            }
          };
          window.addEventListener("playlist-song-updated", playlistSongUpdatedListener);
        }
        setTimeout(() => {
          checkPlaylistIntegrity(props.id, songs.value);
        }, 1500);
        businessMachine.transition("SUCCESS");
      } catch (e) {
        console.error("加载歌曲列表失败:", e);
        businessMachine.transition("ERROR", { message: e.message || "加载失败" });
      }
    });
    function handleScroll() {
      if (!playlistViewportActive || !scrollContainer || songs.value.length === 0) return;
      if (!scrollContainer.isConnected) return;
      playlistScrollActivity.mark();
      lastPlaylistScrollTop = scrollContainer.scrollTop;
      if (playlistScrollFrameId) return;
      playlistScrollFrameId = requestAnimationFrame(syncPlaylistViewport);
    }
    function syncPlaylistViewport() {
      playlistScrollFrameId = 0;
      if (!playlistViewportActive || !scrollContainer || songs.value.length === 0) return;
      const itemHeight = songItemStrideValue.value;
      const containerHeight = scrollContainer.clientHeight;
      const scrollTop = scrollContainer.scrollTop;
      lastPlaylistScrollTop = scrollTop;
      const startIndex = Math.floor(scrollTop / itemHeight);
      const visibleCount = Math.ceil(containerHeight / itemHeight);
      const endIndex = Math.min(startIndex + visibleCount, songs.value.length - 1);
      const nextRange = {
        start: Math.max(0, startIndex - BUFFER_SIZE),
        end: Math.min(songs.value.length - 1, endIndex + BUFFER_SIZE)
      };
      if (nextRange.start !== visibleRange.value.start || nextRange.end !== visibleRange.value.end) {
        visibleRange.value = nextRange;
      }
      const previous = loadingManager.viewportInfo;
      if (previous.playlistId === props.id && previous.startIndex === startIndex && previous.endIndex === endIndex && previous.visibleCount === visibleCount) return;
      loadingManager.updateViewport(startIndex, endIndex, visibleCount, props.id);
    }
    watch(songItemStrideValue, () => nextTick(handleScroll), { flush: "post" });
    pageLifecycle.onActivated(async ({ shouldRestore } = {}) => {
      playlistViewportActive = true;
      playlistHydrationActive.value = true;
      const restoreGeneration = ++playlistRestoreGeneration;
      selectionStore.setCurrentPage(PLAYLIST_DETAIL_PAGE);
      console.log(`========== [PlaylistDetailView] ACTIVATED ==========`);
      console.log(`[PlaylistDetailView] pageKey: ${pageLifecycle.pageKey}`);
      console.log(`[PlaylistDetailView] props.id: ${props.id}`);
      console.log(`[PlaylistDetailView] isCached: ${cacheStore.cachedViews.includes(pageLifecycle.pageKey)}`);
      console.log(`[PlaylistDetailView] shouldRestore: ${shouldRestore}`);
      console.log(`[PlaylistDetailView] songs count before restore: ${songs.value.length}`);
      if (!unregisterPageBackHandler) {
        unregisterPageBackHandler = registerBackHandler(handlePlaylistDetailBack);
      }
      resetSwipeBatch();
      const cachedState = cacheStore.getPlaylistState(props.id);
      console.log(`[PlaylistDetailView] Cached state retrieved:`, cachedState);
      const shouldForceRefresh = props.id === "bili_downloads";
      if (shouldForceRefresh || songs.value.length === 0) {
        console.log("[PlaylistDetailView] Fetching playlist from API...");
        if (!shouldForceRefresh) {
          restorePlaylistSongsFromCache();
        }
        businessMachine.transition("LOAD");
        try {
          await logPropsId("onActivated");
          const res = await apiRequest(`/api/playlist/${props.id}`);
          const data = await res.json();
          const rawSongs = Array.isArray(data.songs) ? data.songs : Object.values(data.songs || {});
          songs.value = sortPlaylistSongs(rawSongs);
          console.log("✅ 歌单数据已从 API 刷新");
          businessMachine.transition("SUCCESS");
        } catch (e) {
          console.error("刷新歌单数据失败:", e);
          businessMachine.transition("ERROR", { message: e.message || "刷新失败" });
        }
      } else {
        console.log("[PlaylistDetailView] Using cached songs, skipping API fetch");
      }
      if (cachedState.scrollPosition > 0) {
        let restoreAttempts = 0;
        const restoreScroll = () => {
          playlistRestoreFrameId = 0;
          if (!playlistViewportActive || restoreGeneration !== playlistRestoreGeneration) return;
          const target = scrollContainer || document.getElementById("songList");
          if (!target) {
            if (restoreAttempts < 12) {
              restoreAttempts += 1;
              playlistRestoreFrameId = requestAnimationFrame(restoreScroll);
            }
            return;
          }
          scrollContainer = target;
          target.scrollTop = cachedState.scrollPosition;
          handleScroll();
          console.log(`📍 已恢复滚动位置: ${cachedState.scrollPosition}px`);
        };
        nextTick(() => {
          if (playlistViewportActive && restoreGeneration === playlistRestoreGeneration) {
            playlistRestoreFrameId = requestAnimationFrame(restoreScroll);
          }
        });
      }
      nextTick(handleScroll);
    });
    pageLifecycle.onDeactivated(() => {
      playlistViewportActive = false;
      cancelPlaylistViewportWork();
      console.log(`========== [PlaylistDetailView] DEACTIVATED ==========`);
      console.log(`[PlaylistDetailView] pageKey: ${pageLifecycle.pageKey}`);
      console.log(`[PlaylistDetailView] props.id: ${props.id}`);
      console.log(`[PlaylistDetailView] isCached before check: ${cacheStore.cachedViews.includes(pageLifecycle.pageKey)}`);
      console.log(`[PlaylistDetailView] songs count before save: ${songs.value.length}`);
      if (typeof unregisterPageBackHandler === "function") {
        unregisterPageBackHandler();
        unregisterPageBackHandler = null;
      }
      isDownloadTaskPageOpen.value = false;
      isDownloadPageSwitching.value = false;
      const pageKey = pageLifecycle.pageKey;
      if (cacheStore.cachedViews.includes(pageKey)) {
        console.log(`[PlaylistDetailView] Saving state to cache...`);
        checkAndTriggerRebalance();
        const scrollPosition = scrollContainer?.isConnected ? scrollContainer.scrollTop : lastPlaylistScrollTop;
        cacheStore.savePlaylistState(props.id, {
          scrollPosition,
          selectedItems: Array.from(selectionStore.selectedIds),
          songsSnapshot: cloneSongSnapshot(songs.value)
        });
        console.log(`💾 Saved PlaylistDetailView [${props.id}] state: scroll=${scrollPosition}px, selected=${selectionStore.selectedIds.size} items`);
        if (props.id?.startsWith("custom_") && window.Android?.onPlaylistExit) {
          console.log(`[EXIT] Saving playlist snapshot: ${props.id}, songs: ${songs.value.length}`);
          window.Android.onPlaylistExit(props.id, JSON.stringify(songs.value));
        }
      } else {
        console.log(`[PlaylistDetailView] 页面已被状态机移除缓存，跳过保存`);
      }
    });
    checkAndTriggerRebalance();
    onBeforeUnmount(() => {
      playlistViewportActive = false;
      cancelPlaylistViewportWork();
      console.log("[PlaylistDetailView] onBeforeUnmount called");
      playerStore.releaseMiniPlayer(PLAYLIST_DETAIL_DRAG_MINI_PLAYER_REASON);
      playlistDragAutoAnimateController?.disable?.();
      playlistDragAutoAnimateController = null;
      console.log("[PlaylistDetailView] unregisterPageBackHandler type:", typeof unregisterPageBackHandler);
      console.log("[PlaylistDetailView] unregisterPageBackHandler value:", unregisterPageBackHandler);
      if (typeof unregisterPageBackHandler === "function") {
        console.log("[PlaylistDetailView] Calling unregisterPageBackHandler...");
        unregisterPageBackHandler();
        console.log("[PlaylistDetailView] unregisterPageBackHandler called successfully");
        unregisterPageBackHandler = null;
      } else {
        console.warn("[PlaylistDetailView] unregisterPageBackHandler is not a function, skipping");
      }
      isDownloadTaskPageOpen.value = false;
      isDownloadPageSwitching.value = false;
      (async () => {
        await logPropsId();
      })();
      void closeMode(true);
      if (playlistRefreshTimer) {
        clearTimeout(playlistRefreshTimer);
        playlistRefreshTimer = null;
      }
      playlistRefreshInFlight = false;
      if (playlistSongUpdatedListener) {
        window.removeEventListener("playlist-song-updated", playlistSongUpdatedListener);
        playlistSongUpdatedListener = null;
      }
      if (scrollContainer) {
        const shouldPreserveForTempRoute = cacheStore.routeNavigation?.direction === "temp" && cacheStore.routeNavigation?.restoreKey === pageLifecycle.pageKey;
        if (shouldPreserveForTempRoute) {
          cacheStore.savePlaylistState(props.id, {
            scrollPosition: scrollContainer.isConnected ? scrollContainer.scrollTop : lastPlaylistScrollTop,
            selectedItems: Array.from(selectionStore.selectedIds),
            songsSnapshot: cloneSongSnapshot(songs.value)
          });
        }
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
      if (playlistScrollFrameId) {
        cancelAnimationFrame(playlistScrollFrameId);
        playlistScrollFrameId = 0;
      }
      loadingManager.clearPlaylistCache(props.id);
      if (props.id?.startsWith("custom_") && window.Android?.onPlaylistExit) {
        console.log(`[EXIT] onBeforeUnmount 保存歌单快照: ${props.id}，共${songs.value.length}首`);
        window.Android.onPlaylistExit(props.id, JSON.stringify(songs.value));
      }
    });
    return (_ctx, _cache) => {
      const _component_Toast = resolveComponent("Toast");
      const _directive_marquee = resolveDirective("marquee");
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("div", {
          class: normalizeClass(["playlist-detail-wrapper", {
            "download-task-enabled": isDownloadTaskPageEnabled.value,
            "download-task-open": isDownloadTaskPageOpen.value,
            "download-page-switching": isDownloadTaskPageEnabled.value && isDownloadPageSwitching.value
          }]),
          onTouchstartPassive: handleDownloadPageTouchStart,
          onTouchmovePassive: handleDownloadPageTouchMove,
          onTouchend: handleDownloadPageTouchEnd
        }, [
          createBaseVNode("div", _hoisted_1, [
            createBaseVNode("div", _hoisted_2, [
              __props.id === "local_music" ? (openBlock(), createElementBlock("div", _hoisted_3, [
                createBaseVNode("div", _hoisted_4, [
                  createBaseVNode("div", {
                    onClick: _cache[0] || (_cache[0] = ($event) => showFolderBrowser.value = true),
                    style: { "background": "rgba(0,0,0,0.04)", "border": "1px solid rgba(0,0,0,0.1)", "border-radius": "8px", "padding": "10px 12px", "font-size": "13px", "color": "#333", "cursor": "pointer", "display": "flex", "align-items": "center", "gap": "8px" }
                  }, [
                    _cache[18] || (_cache[18] = createBaseVNode("span", { style: { "font-size": "16px" } }, "📁", -1)),
                    createBaseVNode("span", _hoisted_5, toDisplayString(scanPath.value || "全部音频"), 1),
                    _cache[19] || (_cache[19] = createBaseVNode("span", { style: { "font-size": "12px", "color": "#999" } }, "点击选择", -1))
                  ]),
                  createBaseVNode("div", _hoisted_6, [
                    isScanning.value ? (openBlock(), createElementBlock("div", _hoisted_7, [
                      createBaseVNode("div", _hoisted_8, [
                        createBaseVNode("span", null, toDisplayString(scanProgressInfo.value.message || "扫描中..."), 1),
                        createBaseVNode("span", _hoisted_9, toDisplayString(scanProgressInfo.value.total > 0 ? `${scanProgressInfo.value.processed}/${scanProgressInfo.value.total}` : ""), 1)
                      ]),
                      createBaseVNode("div", _hoisted_10, [
                        createBaseVNode("div", {
                          style: normalizeStyle({
                            height: "100%",
                            borderRadius: "4px",
                            background: "linear-gradient(90deg, #6c8ebf, #8dbad8)",
                            width: scanProgressInfo.value.total > 0 ? `${Math.min(100, Math.round(scanProgressInfo.value.processed / scanProgressInfo.value.total * 100))}%` : "30%",
                            transition: scanProgressInfo.value.total > 0 ? "width 0.3s ease" : "none",
                            animation: scanProgressInfo.value.total === 0 ? "scanIndeterminate 1.5s linear infinite" : "none"
                          })
                        }, null, 4)
                      ])
                    ])) : (openBlock(), createElementBlock("div", {
                      key: 1,
                      onClick: handleRescan,
                      style: { "background": "rgba(0,0,0,0.04)", "border-radius": "12px", "padding": "12px", "display": "flex", "align-items": "center", "justify-content": "center", "gap": "8px", "font-size": "14px", "color": "#666", "cursor": "pointer" }
                    }, [
                      _cache[20] || (_cache[20] = createBaseVNode("span", { style: { "font-size": "16px" } }, "🔄", -1)),
                      createBaseVNode("span", null, toDisplayString(scanPath.value ? "扫描选定路径" : "扫描全部音乐"), 1)
                    ]))
                  ])
                ])
              ])) : createCommentVNode("", true),
              __props.id === "local_music" ? (openBlock(), createElementBlock("button", {
                key: 1,
                class: "local-library-manage",
                type: "button",
                disabled: isScanning.value,
                onClick: _cache[1] || (_cache[1] = (...args) => unref(openExcludedMusic) && unref(openExcludedMusic)(...args))
              }, "已移除音乐 · 手动重新导入", 8, _hoisted_11)) : createCommentVNode("", true),
              createVNode(Transition, { name: "fade" }, {
                default: withCtx(() => [
                  unref(showExcludedMusic) ? (openBlock(), createElementBlock("div", _hoisted_12, [
                    createBaseVNode("div", _hoisted_13, [
                      _cache[21] || (_cache[21] = createBaseVNode("h3", null, "已移除音乐", -1)),
                      _cache[22] || (_cache[22] = createBaseVNode("p", { class: "excluded-help" }, "手机源文件保留，扫描时继续排除。选择需要重新导入的项目。", -1)),
                      createBaseVNode("div", _hoisted_14, [
                        unref(excludedMusicLoading) ? (openBlock(), createElementBlock("p", _hoisted_15, "正在读取…")) : !unref(excludedMusicSongs).length ? (openBlock(), createElementBlock("p", _hoisted_16, "暂无已移除音乐")) : createCommentVNode("", true),
                        (openBlock(true), createElementBlock(Fragment, null, renderList(unref(excludedMusicSongs), (song) => {
                          return openBlock(), createElementBlock("label", {
                            key: song.hash_id || song.id,
                            class: "excluded-item"
                          }, [
                            withDirectives(createBaseVNode("input", {
                              type: "checkbox",
                              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => isRef(excludedMusicSelectedIds) ? excludedMusicSelectedIds.value = $event : null),
                              value: song.hash_id || song.id
                            }, null, 8, _hoisted_17), [
                              [vModelCheckbox, unref(excludedMusicSelectedIds)]
                            ]),
                            createBaseVNode("span", null, [
                              createBaseVNode("strong", null, toDisplayString(unref(formatTitle)(song)), 1),
                              createBaseVNode("small", null, toDisplayString(unref(formatArtistProducer)(song)), 1)
                            ])
                          ]);
                        }), 128))
                      ]),
                      createBaseVNode("div", _hoisted_18, [
                        createBaseVNode("button", {
                          class: "btn-cancel",
                          disabled: unref(excludedMusicLoading),
                          onClick: _cache[3] || (_cache[3] = ($event) => showExcludedMusic.value = false)
                        }, "关闭", 8, _hoisted_19),
                        createBaseVNode("button", {
                          class: "btn-confirm",
                          disabled: unref(excludedMusicLoading) || !unref(excludedMusicSelectedIds).length,
                          onClick: _cache[4] || (_cache[4] = (...args) => unref(restoreExcludedMusic) && unref(restoreExcludedMusic)(...args))
                        }, "重新导入所选", 8, _hoisted_20)
                      ])
                    ])
                  ])) : createCommentVNode("", true)
                ]),
                _: 1
              }),
              createVNode(Transition, { name: "fade" }, {
                default: withCtx(() => [
                  showFolderBrowser.value ? (openBlock(), createElementBlock("div", _hoisted_21, [
                    createBaseVNode("div", _hoisted_22, [
                      createBaseVNode("div", _hoisted_23, [
                        _cache[23] || (_cache[23] = createBaseVNode("h3", null, "选择扫描文件夹", -1)),
                        createBaseVNode("button", {
                          onClick: _cache[5] || (_cache[5] = ($event) => showFolderBrowser.value = false),
                          class: "close-btn"
                        }, "✕")
                      ]),
                      createBaseVNode("div", _hoisted_24, [
                        _cache[24] || (_cache[24] = createBaseVNode("span", { style: { "font-size": "12px", "color": "#999" } }, "当前位置:", -1)),
                        createBaseVNode("span", _hoisted_25, toDisplayString(currentBrowsePath.value), 1)
                      ]),
                      createBaseVNode("div", _hoisted_26, [
                        (openBlock(true), createElementBlock(Fragment, null, renderList(folders.value, (folder) => {
                          return openBlock(), createElementBlock("div", {
                            key: folder.path,
                            class: "folder-item",
                            onClick: ($event) => handleFolderClick(folder)
                          }, [
                            createBaseVNode("span", _hoisted_28, toDisplayString(folder.isParent ? "⬆️" : "📁"), 1),
                            createBaseVNode("div", _hoisted_29, [
                              createBaseVNode("p", _hoisted_30, toDisplayString(folder.name), 1),
                              !folder.isParent && folder.audioCount > 0 ? (openBlock(), createElementBlock("p", _hoisted_31, toDisplayString(folder.audioCount) + " 首音频 ", 1)) : createCommentVNode("", true)
                            ])
                          ], 8, _hoisted_27);
                        }), 128)),
                        folders.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_32, "此文件夹为空")) : createCommentVNode("", true)
                      ]),
                      createBaseVNode("div", _hoisted_33, [
                        createBaseVNode("button", {
                          class: "btn-cancel",
                          onClick: _cache[6] || (_cache[6] = ($event) => showFolderBrowser.value = false)
                        }, "取消"),
                        createBaseVNode("button", {
                          class: "btn-confirm",
                          onClick: confirmSelectFolder
                        }, toDisplayString(currentBrowsePath.value === "/storage/emulated/0" ? "扫描全部" : "选择此文件夹"), 1)
                      ])
                    ])
                  ])) : createCommentVNode("", true)
                ]),
                _: 1
              }),
              createVNode(_component_Toast, {
                visible: _ctx.showToast,
                message: _ctx.toastMessage,
                duration: 2e3,
                onHide: _cache[7] || (_cache[7] = ($event) => _ctx.showToast = false)
              }, null, 8, ["visible", "message"]),
              createVNode(ScrollSurface, null, {
                default: withCtx(() => [
                  createBaseVNode("div", _hoisted_34, [
                    createVNode(Transition, { name: "playlist-skeleton-fade" }, {
                      default: withCtx(() => [
                        showPlaylistSkeleton.value ? (openBlock(), createElementBlock("div", {
                          key: 0,
                          class: "playlist-song-drag-list playlist-song-skeleton-list",
                          style: normalizeStyle(playlistSkeletonListStyle.value),
                          "aria-hidden": "true"
                        }, [
                          (openBlock(), createElementBlock(Fragment, null, renderList(8, (item) => {
                            return createBaseVNode("div", {
                              key: `playlist-skeleton-${item}`,
                              class: "song-box playlist-song-skeleton-item",
                              style: normalizeStyle(playlistSkeletonCardStyle.value)
                            }, [
                              createBaseVNode("div", {
                                class: "song-content",
                                style: normalizeStyle(playlistSkeletonContentStyle.value)
                              }, [
                                createBaseVNode("div", {
                                  class: "left-box-song playlist-song-skeleton-cover",
                                  style: normalizeStyle(playlistSkeletonCoverStyle.value)
                                }, null, 4),
                                _cache[25] || (_cache[25] = createBaseVNode("div", { class: "right-box" }, [
                                  createBaseVNode("div", { class: "playlist-song-skeleton-line playlist-song-skeleton-line-title" }),
                                  createBaseVNode("div", { class: "playlist-song-skeleton-line playlist-song-skeleton-line-subtitle" })
                                ], -1))
                              ], 4)
                            ], 4);
                          }), 64))
                        ], 4)) : createCommentVNode("", true)
                      ]),
                      _: 1
                    }),
                    withDirectives(createVNode(unref(draggable), {
                      ref_key: "playlistDragListRef",
                      ref: playlistDragListRef,
                      list: songs.value,
                      "item-key": "id",
                      tag: "div",
                      class: normalizeClass(["playlist-song-drag-list", { "is-drag-sorting": isPlaylistDragSorting.value }]),
                      handle: ".drag-handle",
                      disabled: isDetailSelectionMode.value || !isSortablePlaylist.value,
                      animation: 150,
                      scroll: true,
                      "scroll-sensitivity": 50,
                      "scroll-speed": 25,
                      delay: 150,
                      "delay-on-touch-only": true,
                      "touch-start-threshold": 5,
                      "force-fallback": true,
                      "fallback-tolerance": 0,
                      "fallback-on-body": true,
                      "fallback-class": "sortable-fallback",
                      "ghost-class": "sortable-ghost",
                      "drag-class": "sortable-drag",
                      "chosen-class": "sortable-chosen",
                      onStart: onDragStart,
                      onEnd: onDragEnd,
                      onChange: onDragChange
                    }, {
                      item: withCtx(({ element: song, index }) => [
                        createBaseVNode("div", {
                          class: normalizeClass(["song-box", {
                            "is-playing": currentTrackId.value === song.id && !isDetailSelectionMode.value,
                            "is-selected": isDetailSelectionMode.value && unref(selectionStore).selectedIds.has(song.id),
                            "mode-selection": isDetailSelectionMode.value
                          }]),
                          style: normalizeStyle(playlistSongCardStyle.value),
                          onTouchstart: ($event) => handleTouchStart($event, "song", song.id),
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
                              class: normalizeClass(["insert-icon action-reveal-icon", {
                                visible: isInsertIconVisible(song),
                                shake: shouldShakeInsertIcon(song),
                                armed: isInsertActionReady(song)
                              }])
                            }, [..._cache[26] || (_cache[26] = [
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
                          createBaseVNode("div", {
                            class: "song-content",
                            style: normalizeStyle(getSwipeStyle(song))
                          }, [
                            createBaseVNode("div", {
                              class: "left-box-song",
                              style: normalizeStyle(playlistDetailCoverFrameStyle.value),
                              onClick: withModifiers(($event) => openDataEdit(song), ["stop"])
                            }, [
                              isItemVisible(index) ? (openBlock(), createBlock(DeferredThumbnail, {
                                key: 0,
                                src: unref(getSongCoverSrc)(song),
                                enabled: !playlistRenderPaused.value,
                                "fallback-src": `/api/cover/random?seed=${song.id}`,
                                eager: "",
                                class: "playlist-cover-thumbnail",
                                "image-style": playlistDetailCoverImageStyle.value,
                                onLoadEnd: (result) => result?.ok && unref(loadingManager).markCoverLoaded(props.id, index)
                              }, null, 8, ["src", "enabled", "fallback-src", "image-style", "onLoadEnd"])) : createCommentVNode("", true)
                            ], 12, _hoisted_36),
                            createBaseVNode("div", {
                              class: "right-box",
                              onClick: ($event) => handleSongClick(song, index)
                            }, [
                              createBaseVNode("div", _hoisted_38, [
                                withDirectives((openBlock(), createElementBlock("p", _hoisted_39, [
                                  createTextVNode(toDisplayString(unref(formatTitle)(song)), 1)
                                ])), [
                                  [_directive_marquee, currentTrackId.value === song.id && !playlistRenderPaused.value]
                                ])
                              ]),
                              createBaseVNode("div", _hoisted_40, [
                                withDirectives((openBlock(), createElementBlock("p", _hoisted_41, [
                                  createTextVNode(toDisplayString(unref(formatArtistProducer)(song)), 1)
                                ])), [
                                  [_directive_marquee, currentTrackId.value === song.id && !playlistRenderPaused.value]
                                ])
                              ])
                            ], 8, _hoisted_37),
                            isSortablePlaylist.value ? (openBlock(), createElementBlock("div", {
                              key: 0,
                              class: "drag-handle",
                              onClick: _cache[8] || (_cache[8] = withModifiers(() => {
                              }, ["stop"])),
                              onTouchstart: _cache[9] || (_cache[9] = withModifiers(() => {
                              }, ["stop"]))
                            }, "≡", 32)) : createCommentVNode("", true)
                          ], 4)
                        ], 46, _hoisted_35)
                      ]),
                      _: 1
                    }, 8, ["list", "class", "disabled"]), [
                      [vShow, songs.value.length > 0]
                    ]),
                    !isLoadingSongs.value && songs.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_42, " 歌单内暂无歌曲 ")) : createCommentVNode("", true)
                  ])
                ]),
                _: 1
              }),
              createVNode(Transition, { name: "fade" }, {
                default: withCtx(() => [
                  isDetailSelectionMode.value ? (openBlock(), createElementBlock("div", _hoisted_43, [
                    createVNode(Transition, { name: "slide-up" }, {
                      default: withCtx(() => [
                        isMenuOpen.value ? (openBlock(), createElementBlock("div", _hoisted_44, [
                          canBatchDeleteInDetail.value ? (openBlock(), createElementBlock("div", {
                            key: 0,
                            class: "menu-item delete danger-soft",
                            onClick: _cache[10] || (_cache[10] = ($event) => unref(handleAction)("delete"))
                          }, toDisplayString(isLocalMusicPlaylist.value ? "从本地音乐移除" : "删除"), 1)) : createCommentVNode("", true),
                          canBatchDeleteInDetail.value ? (openBlock(), createElementBlock("div", _hoisted_45)) : createCommentVNode("", true),
                          createBaseVNode("div", {
                            class: "menu-item",
                            onClick: _cache[11] || (_cache[11] = (...args) => unref(selectAll) && unref(selectAll)(...args))
                          }, "全选"),
                          createBaseVNode("div", {
                            class: "menu-item",
                            onClick: _cache[12] || (_cache[12] = ($event) => unref(handleAction)("playNext"))
                          }, "优先播放"),
                          createBaseVNode("div", {
                            class: "menu-item",
                            onClick: _cache[13] || (_cache[13] = ($event) => unref(handleAction)("addToPlaylist"))
                          }, "收藏到歌单"),
                          _cache[27] || (_cache[27] = createBaseVNode("div", { class: "menu-divider" }, null, -1)),
                          createBaseVNode("div", {
                            class: "menu-item cancel",
                            onClick: _cache[14] || (_cache[14] = (...args) => unref(closeMode) && unref(closeMode)(...args))
                          }, "退出选择")
                        ])) : createCommentVNode("", true)
                      ]),
                      _: 1
                    }),
                    createBaseVNode("button", {
                      class: "fab-main-btn",
                      onClick: _cache[15] || (_cache[15] = ($event) => isMenuOpen.value = !isMenuOpen.value)
                    }, [
                      unref(selectionStore).selectedIds.size > 0 ? (openBlock(), createElementBlock("span", _hoisted_46, toDisplayString(unref(selectionStore).selectedIds.size), 1)) : createCommentVNode("", true),
                      _cache[28] || (_cache[28] = createBaseVNode("svg", {
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
                  unref(showPlaylistDialog) ? (openBlock(), createElementBlock("div", _hoisted_47, [
                    createBaseVNode("div", _hoisted_48, [
                      _cache[30] || (_cache[30] = createBaseVNode("h3", null, "收藏到歌单", -1)),
                      createBaseVNode("div", _hoisted_49, [
                        existingPlaylists.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_50, [
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
                              }, null, 8, _hoisted_52),
                              createBaseVNode("div", _hoisted_53, [
                                createBaseVNode("p", _hoisted_54, toDisplayString(pl.name), 1),
                                createBaseVNode("p", _hoisted_55, toDisplayString(pl.count) + " 首", 1)
                              ])
                            ], 8, _hoisted_51);
                          }), 128))
                        ])) : createCommentVNode("", true),
                        createBaseVNode("div", _hoisted_56, [
                          _cache[29] || (_cache[29] = createBaseVNode("p", { class: "create-label" }, "或创建新歌单", -1)),
                          withDirectives(createBaseVNode("input", {
                            "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => isRef(newPlaylistName) ? newPlaylistName.value = $event : newPlaylistName = $event),
                            type: "text",
                            placeholder: "请输入歌单名称",
                            maxlength: "30",
                            onKeyup: withKeys(createNewPlaylist, ["enter"])
                          }, null, 544), [
                            [vModelText, unref(newPlaylistName)]
                          ])
                        ])
                      ]),
                      createBaseVNode("div", _hoisted_57, [
                        createBaseVNode("button", {
                          class: "btn-cancel",
                          onClick: closePlaylistDialog
                        }, "取消"),
                        createBaseVNode("button", {
                          class: "btn-confirm",
                          onClick: createNewPlaylist,
                          disabled: !unref(newPlaylistName).trim()
                        }, "创建", 8, _hoisted_58)
                      ])
                    ])
                  ])) : createCommentVNode("", true)
                ]),
                _: 1
              })
            ]),
            isDownloadTaskPageEnabled.value ? (openBlock(), createElementBlock("section", _hoisted_59, [
              (openBlock(), createBlock(DownloadTaskPanel, {
                key: downloadTaskPanelKey.value,
                tasks: unref(downloadTaskStore).visibleTasks,
                policy: unref(downloadTaskStore).policy,
                "native-stats": unref(downloadTaskStore).nativeStats,
                parallelism: unref(downloadTaskStore).parallelism,
                "paused-all": unref(downloadTaskStore).pausedAll,
                onSetParallelism: setDownloadParallelism,
                onPauseAll: pauseAllDownloadTasks,
                onResumeAll: resumeAllDownloadTasks,
                onPauseTask: pauseDownloadTask,
                onResumeTask: resumeDownloadTask,
                onRetryTask: retryDownloadTask,
                onCancelTask: cancelDownloadTask,
                onDeleteTask: deleteDownloadTask,
                onClearCompleted: clearCompletedDownloadTasks,
                onClearCancelled: clearCancelledDownloadTasks,
                onUpdateDownloadPolicy: updateDownloadPolicy
              }, null, 8, ["tasks", "policy", "native-stats", "parallelism", "paused-all"]))
            ])) : createCommentVNode("", true)
          ]),
          isDownloadTaskPageEnabled.value && !isDetailSelectionMode.value ? (openBlock(), createElementBlock("button", {
            key: 0,
            class: "download-task-toggle-btn",
            onClick: toggleDownloadTaskPage
          }, toDisplayString(isDownloadTaskPageOpen.value ? "返回" : "任务"), 1)) : createCommentVNode("", true)
        ], 34),
        createVNode(DataEditDialog, {
          visible: showDataEditDialog.value,
          "onUpdate:visible": _cache[17] || (_cache[17] = ($event) => showDataEditDialog.value = $event),
          data: editingData.value,
          "is-playlist": false,
          onSaved: handleDataSaved
        }, null, 8, ["visible", "data"])
      ], 64);
    };
  }
});
const PlaylistDetailView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-118aac66"]]);
export {
  PlaylistDetailView as default
};
