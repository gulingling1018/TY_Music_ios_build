import { c as computed, I as openBlock, g as createElementBlock, d as createBaseVNode, w as normalizeClass, Y as toDisplayString, a9 as withModifiers, f as createCommentVNode, M as ref, l as createVNode, a6 as withCtx, F as Fragment, O as renderList, Z as unref, a as NSpace, B as Button, k as createTextVNode, N as NModal, e as createBlock, U as resolveDynamicComponent, $ as useRouter, X as storeToRefs, a5 as watch, H as onUnmounted, x as normalizeStyle, T as Transition, a7 as withDirectives, a1 as vModelRadio, a3 as vModelText, a0 as vModelCheckbox, a8 as withKeys, v as nextTick } from "./vendor.js";
import { _ as _export_sfc, ab as usePageLifecycle, a7 as useCacheStore, ac as usePlayerStore, ad as usePlaylistStore, al as useTimerStore, f as apiRequest, O as playbackEventTracker, W as readSkinThemeTarget, X as registerBackHandler, a3 as showGlobalToast } from "./index.js";
import { b as biliAuthService } from "./biliAuth.js";
const _hoisted_1$5 = { class: "card-status auth-status-row" };
const _sfc_main$7 = {
  __name: "AuthManagementCard",
  props: {
    state: {
      type: Object,
      required: true
    },
    actions: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const authStatus = computed(() => props.state.authStatus || {});
    const openAuthManagement = () => {
      props.actions.handleAuthManagement?.();
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "feature-card large primary",
        onClick: openAuthManagement
      }, [
        _cache[0] || (_cache[0] = createBaseVNode("div", { class: "card-icon" }, "🔐", -1)),
        _cache[1] || (_cache[1] = createBaseVNode("div", { class: "card-text" }, [
          createBaseVNode("h3", { class: "card-title" }, "账户授权管理"),
          createBaseVNode("p", { class: "card-description" }, "管理 Bilibili 授权状态。")
        ], -1)),
        createBaseVNode("div", _hoisted_1$5, [
          createBaseVNode("span", {
            class: normalizeClass(["status-badge", { active: authStatus.value.bilibili }])
          }, " Bilibili " + toDisplayString(authStatus.value.bilibili ? "已授权" : "未授权"), 3)
        ])
      ]);
    };
  }
};
const AuthManagementCard = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-d99a8bc8"]]);
const _sfc_main$6 = {
  __name: "BrowserCard",
  props: {
    state: {
      type: Object,
      required: true
    },
    actions: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const openBrowser = () => {
      props.actions.handleBrowserOpen?.();
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "feature-card small",
        onClick: openBrowser
      }, [..._cache[0] || (_cache[0] = [
        createBaseVNode("div", { class: "card-icon" }, "🌐", -1),
        createBaseVNode("div", { class: "card-text" }, [
          createBaseVNode("h3", { class: "card-title" }, "内置浏览器"),
          createBaseVNode("p", { class: "card-description" }, "登录 Bilibili 获取收藏夹链接")
        ], -1)
      ])]);
    };
  }
};
const _hoisted_1$4 = { class: "feature-card medium highlight" };
const _hoisted_2$3 = { class: "timer-quick-row" };
const _hoisted_3$2 = { class: "timer-quick-row" };
const _hoisted_4$2 = { class: "timer-countdown" };
const _sfc_main$5 = {
  __name: "TimerCard",
  props: {
    state: {
      type: Object,
      required: true
    },
    actions: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const customTimeMinutes = computed(() => Number(props.state.lastTimeMinutes || 0));
    const customSongCount = computed(() => Number(props.state.lastSongCount || 0));
    const showCustomTimePreset = computed(() => {
      const value = customTimeMinutes.value;
      return Number.isFinite(value) && value > 0 && ![30, 45, 60].includes(value);
    });
    const showCustomCountPreset = computed(() => {
      const value = customSongCount.value;
      return Number.isFinite(value) && value > 0 && ![7, 12, 20].includes(value);
    });
    const openTimerSetting = () => {
      props.actions.handleTimerSetting?.();
    };
    const startQuickTimer = (mode, value) => {
      props.actions.quickStartTimer?.(mode, value);
    };
    const cancelTimer = () => {
      props.actions.cancelTimer?.();
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$4, [
        createBaseVNode("div", {
          class: "card-icon",
          onClick: openTimerSetting
        }, "⏰"),
        createBaseVNode("div", { class: "card-text" }, [
          createBaseVNode("h3", {
            class: "card-title",
            onClick: openTimerSetting
          }, "定时关闭"),
          createBaseVNode("p", {
            class: "card-description",
            onClick: openTimerSetting
          }, "设置音乐播放定时关闭")
        ]),
        createBaseVNode("div", _hoisted_2$3, [
          createBaseVNode("button", {
            class: "quick-timer-btn",
            onClick: _cache[0] || (_cache[0] = withModifiers(($event) => startQuickTimer("time", 30), ["stop"]))
          }, [..._cache[8] || (_cache[8] = [
            createBaseVNode("span", { class: "btn-icon" }, "⏱️", -1),
            createBaseVNode("span", null, "30分钟", -1)
          ])]),
          createBaseVNode("button", {
            class: "quick-timer-btn",
            onClick: _cache[1] || (_cache[1] = withModifiers(($event) => startQuickTimer("time", 45), ["stop"]))
          }, [..._cache[9] || (_cache[9] = [
            createBaseVNode("span", { class: "btn-icon" }, "⏱️", -1),
            createBaseVNode("span", null, "45分钟", -1)
          ])]),
          createBaseVNode("button", {
            class: "quick-timer-btn",
            onClick: _cache[2] || (_cache[2] = withModifiers(($event) => startQuickTimer("time", 60), ["stop"]))
          }, [..._cache[10] || (_cache[10] = [
            createBaseVNode("span", { class: "btn-icon" }, "⏱️", -1),
            createBaseVNode("span", null, "60分钟", -1)
          ])]),
          showCustomTimePreset.value ? (openBlock(), createElementBlock("button", {
            key: 0,
            class: "quick-timer-btn custom",
            onClick: _cache[3] || (_cache[3] = withModifiers(($event) => startQuickTimer("time", customTimeMinutes.value), ["stop"]))
          }, [
            _cache[11] || (_cache[11] = createBaseVNode("span", { class: "btn-icon" }, "⏱️", -1)),
            createBaseVNode("span", null, toDisplayString(customTimeMinutes.value) + "分钟", 1)
          ])) : (openBlock(), createElementBlock("button", {
            key: 1,
            class: "quick-timer-btn custom",
            onClick: withModifiers(openTimerSetting, ["stop"])
          }, [..._cache[12] || (_cache[12] = [
            createBaseVNode("span", { class: "btn-icon" }, "⚙️", -1),
            createBaseVNode("span", null, "自定义", -1)
          ])]))
        ]),
        createBaseVNode("div", _hoisted_3$2, [
          createBaseVNode("button", {
            class: "quick-timer-btn",
            onClick: _cache[4] || (_cache[4] = withModifiers(($event) => startQuickTimer("count", 7), ["stop"]))
          }, [..._cache[13] || (_cache[13] = [
            createBaseVNode("span", { class: "btn-icon" }, "🎵", -1),
            createBaseVNode("span", null, "7首歌", -1)
          ])]),
          createBaseVNode("button", {
            class: "quick-timer-btn",
            onClick: _cache[5] || (_cache[5] = withModifiers(($event) => startQuickTimer("count", 12), ["stop"]))
          }, [..._cache[14] || (_cache[14] = [
            createBaseVNode("span", { class: "btn-icon" }, "🎵", -1),
            createBaseVNode("span", null, "12首歌", -1)
          ])]),
          createBaseVNode("button", {
            class: "quick-timer-btn",
            onClick: _cache[6] || (_cache[6] = withModifiers(($event) => startQuickTimer("count", 20), ["stop"]))
          }, [..._cache[15] || (_cache[15] = [
            createBaseVNode("span", { class: "btn-icon" }, "🎵", -1),
            createBaseVNode("span", null, "20首歌", -1)
          ])]),
          showCustomCountPreset.value ? (openBlock(), createElementBlock("button", {
            key: 0,
            class: "quick-timer-btn custom",
            onClick: _cache[7] || (_cache[7] = withModifiers(($event) => startQuickTimer("count", customSongCount.value), ["stop"]))
          }, [
            _cache[16] || (_cache[16] = createBaseVNode("span", { class: "btn-icon" }, "🎵", -1)),
            createBaseVNode("span", null, toDisplayString(customSongCount.value) + "首歌", 1)
          ])) : (openBlock(), createElementBlock("button", {
            key: 1,
            class: "quick-timer-btn custom",
            onClick: withModifiers(openTimerSetting, ["stop"])
          }, [..._cache[17] || (_cache[17] = [
            createBaseVNode("span", { class: "btn-icon" }, "⚙️", -1),
            createBaseVNode("span", null, "自定义", -1)
          ])]))
        ]),
        __props.state.timerActive ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass(["timer-status", { waiting: __props.state.timerWaitingForSongEnd }])
        }, [
          createBaseVNode("span", _hoisted_4$2, toDisplayString(__props.state.timerRemaining), 1),
          createBaseVNode("button", {
            class: "cancel-timer-btn",
            onClick: withModifiers(cancelTimer, ["stop"])
          }, "取消")
        ], 2)) : createCommentVNode("", true)
      ]);
    };
  }
};
const _sfc_main$4 = {
  __name: "ImportPlaylistCard",
  props: {
    state: {
      type: Object,
      required: true
    },
    actions: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const openImportDialog = () => {
      props.actions.handleImportPlaylist?.();
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "feature-card medium",
        onClick: openImportDialog
      }, [..._cache[0] || (_cache[0] = [
        createBaseVNode("div", { class: "card-icon" }, "📥", -1),
        createBaseVNode("div", { class: "card-text" }, [
          createBaseVNode("h3", { class: "card-title" }, "导入文件"),
          createBaseVNode("p", { class: "card-description" }, "SQL 文件作为搜索库；或从链接导入收藏夹")
        ], -1)
      ])]);
    };
  }
};
const _hoisted_1$3 = { class: "card-status" };
const _sfc_main$3 = {
  __name: "SkinEditorCard",
  props: {
    state: {
      type: Object,
      required: true
    },
    actions: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const openSkinEditor = () => {
      props.actions.handleSkinEditor?.();
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "feature-card medium highlight",
        onClick: openSkinEditor
      }, [
        _cache[1] || (_cache[1] = createBaseVNode("div", { class: "card-icon" }, "🎛", -1)),
        _cache[2] || (_cache[2] = createBaseVNode("div", { class: "card-text" }, [
          createBaseVNode("h3", { class: "card-title" }, "全局皮肤编辑器"),
          createBaseVNode("p", { class: "card-description" }, "开屏、容器、歌曲项目和配置导入导出统一管理，支持实时预览。")
        ], -1)),
        createBaseVNode("div", _hoisted_1$3, [
          createBaseVNode("span", {
            class: normalizeClass(["status-badge", { active: __props.state.splashSkinEnabled }])
          }, " 开屏 " + toDisplayString(__props.state.splashSkinEnabled ? "已启用" : "默认"), 3),
          _cache[0] || (_cache[0] = createBaseVNode("span", { class: "status-badge active" }, "v3 模板", -1))
        ])
      ]);
    };
  }
};
function readStorageStatus(bridge = globalThis.window?.Android) {
  if (typeof bridge?.getStorageMaintenanceStatus !== "function") return null;
  return JSON.parse(bridge.getStorageMaintenanceStatus());
}
function requestStorageMaintenance(bridge = globalThis.window?.Android) {
  if (typeof bridge?.requestStorageMaintenance !== "function") return false;
  bridge.requestStorageMaintenance();
  return true;
}
function storageMiB(bytes) {
  return `${(Math.max(0, Number(bytes) || 0) / 1048576).toFixed(1)} MiB`;
}
const _hoisted_1$2 = { key: 0 };
const _hoisted_2$2 = { key: 1 };
const _sfc_main$2 = {
  __name: "StorageCard",
  setup(__props) {
    const visible = ref(false), status = ref(null), message = ref("");
    const categories = [["covers_bytes", "持久与随机封面"], ["temporary_covers_bytes", "临时封面"], ["database_bytes", "数据库及事务文件"], ["temporary_audio_bytes", "临时音乐"], ["permanent_audio_bytes", "长期音乐"]];
    function refresh() {
      try {
        status.value = readStorageStatus();
        message.value = status.value ? "" : "请在手机 App 中查看存储占用";
      } catch {
        message.value = "暂时无法读取，请稍后刷新";
      }
    }
    function open() {
      visible.value = true;
      refresh();
    }
    function maintain() {
      message.value = requestStorageMaintenance() ? "已安排：停止播放并保持 App 前台闲置时执行，完成后可刷新占用。" : "当前环境不支持维护";
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("div", {
          class: "feature-card small",
          onClick: open
        }, [..._cache[1] || (_cache[1] = [
          createBaseVNode("div", { class: "card-icon" }, "🗄️", -1),
          createBaseVNode("div", { class: "card-text" }, [
            createBaseVNode("h3", { class: "card-title" }, "存储管理"),
            createBaseVNode("p", { class: "card-description" }, "空间占用与月度清理")
          ], -1)
        ])]),
        createVNode(unref(NModal), {
          show: visible.value,
          "onUpdate:show": _cache[0] || (_cache[0] = ($event) => visible.value = $event),
          preset: "card",
          title: "存储管理",
          style: { "width": "min(92vw, 480px)" }
        }, {
          default: withCtx(() => [
            _cache[4] || (_cache[4] = createBaseVNode("p", null, "保留当月完整明细；往月压缩归档，保留历史统计。闲置时自动压缩封面并清理可回收缓存。", -1)),
            status.value ? (openBlock(), createElementBlock("dl", _hoisted_1$2, [
              (openBlock(), createElementBlock(Fragment, null, renderList(categories, ([key, label]) => {
                return createBaseVNode("div", {
                  key,
                  class: "storage-row"
                }, [
                  createBaseVNode("dt", null, toDisplayString(label), 1),
                  createBaseVNode("dd", null, toDisplayString(unref(storageMiB)(status.value[key])), 1)
                ]);
              }), 64))
            ])) : createCommentVNode("", true),
            message.value ? (openBlock(), createElementBlock("p", _hoisted_2$2, toDisplayString(message.value), 1)) : createCommentVNode("", true),
            createVNode(unref(NSpace), null, {
              default: withCtx(() => [
                createVNode(unref(Button), { onClick: refresh }, {
                  default: withCtx(() => [..._cache[2] || (_cache[2] = [
                    createTextVNode("刷新占用", -1)
                  ])]),
                  _: 1
                }),
                createVNode(unref(Button), { onClick: maintain }, {
                  default: withCtx(() => [..._cache[3] || (_cache[3] = [
                    createTextVNode("安排维护", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["show"])
      ], 64);
    };
  }
};
const StorageCard = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-5a01ebfc"]]);
const accountCardPlugins = Object.freeze([
  { id: "storage", name: "存储管理", column: "left", order: 30, component: StorageCard },
  {
    id: "auth-management",
    name: "账户授权管理",
    column: "left",
    order: 10,
    component: AuthManagementCard
  },
  {
    id: "browser",
    name: "内置浏览器",
    column: "left",
    order: 20,
    component: _sfc_main$6
  },
  {
    id: "timer",
    name: "定时关闭",
    column: "right",
    order: 10,
    component: _sfc_main$5
  },
  {
    id: "import-playlist",
    name: "导入文件",
    column: "right",
    order: 20,
    component: _sfc_main$4
  },
  {
    id: "skin-editor",
    name: "皮肤编辑",
    column: "right",
    order: 30,
    component: _sfc_main$3
  }
]);
const _hoisted_1$1 = { class: "features-section" };
const _hoisted_2$1 = { class: "waterfall-container" };
const _hoisted_3$1 = { class: "waterfall-column" };
const _hoisted_4$1 = { class: "waterfall-column" };
const _sfc_main$1 = {
  __name: "AccountFeatureCardWall",
  props: {
    plugins: {
      type: Array,
      default: () => accountCardPlugins
    },
    state: {
      type: Object,
      required: true
    },
    actions: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const enabledPlugins = computed(() => {
      return props.plugins.filter((plugin) => plugin && plugin.component && plugin.enabled !== false).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    });
    const leftColumnPlugins = computed(() => {
      return enabledPlugins.value.filter((plugin) => plugin.column === "left");
    });
    const rightColumnPlugins = computed(() => {
      return enabledPlugins.value.filter((plugin) => plugin.column !== "left");
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$1, [
        createBaseVNode("div", _hoisted_2$1, [
          createBaseVNode("div", _hoisted_3$1, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(leftColumnPlugins.value, (plugin) => {
              return openBlock(), createBlock(resolveDynamicComponent(plugin.component), {
                key: plugin.id,
                state: __props.state,
                actions: __props.actions
              }, null, 8, ["state", "actions"]);
            }), 128))
          ]),
          createBaseVNode("div", _hoisted_4$1, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(rightColumnPlugins.value, (plugin) => {
              return openBlock(), createBlock(resolveDynamicComponent(plugin.component), {
                key: plugin.id,
                state: __props.state,
                actions: __props.actions
              }, null, 8, ["state", "actions"]);
            }), 128))
          ])
        ])
      ]);
    };
  }
};
const AccountFeatureCardWall = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-62573046"]]);
const _hoisted_1 = { class: "top-section-container" };
const _hoisted_2 = { class: "account-info-section" };
const _hoisted_3 = { class: "left-section" };
const _hoisted_4 = { class: "avatar-container" };
const _hoisted_5 = ["src"];
const _hoisted_6 = { class: "right-section" };
const _hoisted_7 = { class: "username" };
const _hoisted_8 = {
  key: 0,
  class: "user-email"
};
const _hoisted_9 = { class: "stat-item" };
const _hoisted_10 = { class: "stat-value" };
const _hoisted_11 = { class: "stat-item" };
const _hoisted_12 = { class: "stat-value" };
const _hoisted_13 = { class: "stat-item" };
const _hoisted_14 = { class: "stat-value" };
const _hoisted_15 = { class: "dialog-header" };
const _hoisted_16 = { class: "dialog-body" };
const _hoisted_17 = { class: "auth-item" };
const _hoisted_18 = { class: "auth-info" };
const _hoisted_19 = {
  key: 0,
  class: "auth-desc"
};
const _hoisted_20 = {
  key: 1,
  class: "auth-desc authorized-info"
};
const _hoisted_21 = ["disabled"];
const _hoisted_22 = { class: "dialog-body" };
const _hoisted_23 = { class: "import-options" };
const _hoisted_24 = { class: "import-option" };
const _hoisted_25 = ["disabled"];
const _hoisted_26 = { class: "import-option" };
const _hoisted_27 = ["disabled"];
const _hoisted_28 = {
  key: 0,
  class: "import-file"
};
const _hoisted_29 = ["disabled"];
const _hoisted_30 = {
  key: 0,
  class: "import-file-summary"
};
const _hoisted_31 = { class: "import-file-main" };
const _hoisted_32 = { class: "import-file-name" };
const _hoisted_33 = { class: "import-file-size" };
const _hoisted_34 = {
  key: 1,
  class: "import-confirm-panel"
};
const _hoisted_35 = {
  key: 2,
  class: "import-progress-panel"
};
const _hoisted_36 = { class: "import-progress-head" };
const _hoisted_37 = { class: "import-progress-track" };
const _hoisted_38 = { class: "import-progress-msg" };
const _hoisted_39 = { class: "import-progress-actions" };
const _hoisted_40 = {
  key: 1,
  class: "import-url"
};
const _hoisted_41 = { class: "import-mini-copy" };
const _hoisted_42 = { class: "import-mini-meter" };
const _hoisted_43 = { class: "import-mini-actions" };
const _hoisted_44 = { class: "dialog-header" };
const _hoisted_45 = { class: "dialog-body" };
const _hoisted_46 = { class: "timer-mode-selector" };
const _hoisted_47 = {
  key: 0,
  class: "timer-content"
};
const _hoisted_48 = { class: "quick-options" };
const _hoisted_49 = { class: "slider-group" };
const _hoisted_50 = {
  key: 1,
  class: "timer-content"
};
const _hoisted_51 = { class: "quick-options" };
const _hoisted_52 = { class: "slider-group" };
const _hoisted_53 = { class: "timer-option" };
const _hoisted_54 = { class: "checkbox-label" };
const _hoisted_55 = { class: "timer-actions" };
const _hoisted_56 = {
  key: 0,
  class: "dialog-overlay browser-overlay"
};
const _hoisted_57 = { class: "dialog-header browser-header" };
const _hoisted_58 = {
  key: 0,
  class: "browser-statusbar"
};
const _hoisted_59 = { class: "statusbar-url" };
const _hoisted_60 = {
  key: 0,
  class: "fav-detect-banner"
};
const _hoisted_61 = { class: "fav-detect-text" };
const _hoisted_62 = { class: "fav-detect-url" };
const _hoisted_63 = {
  key: 1,
  class: "browser-quickbar"
};
const _hoisted_64 = { class: "browser-body" };
const _hoisted_65 = {
  key: 0,
  class: "browser-loading"
};
const _hoisted_66 = ["src"];
const _hoisted_67 = {
  key: 2,
  class: "browser-placeholder"
};
const SCROLL_SWITCH_THRESHOLD = 100;
const IMPORT_CHUNK_SIZE = 256 * 1024;
const _sfc_main = /* @__PURE__ */ Object.assign({
  name: "account"
}, {
  __name: "AccountView",
  setup(__props) {
    const router = useRouter();
    const pageLifecycle = usePageLifecycle("account");
    const cacheStore = useCacheStore();
    const playerStore = usePlayerStore();
    const playlistStore = usePlaylistStore();
    const timerStore = useTimerStore();
    const featuresContainerRef = ref(null);
    const handleWheel = (event) => {
      if (!featuresContainerRef.value) return;
      const bottomContainer = featuresContainerRef.value;
      const scrollTop = bottomContainer.scrollTop;
      const scrollHeight = bottomContainer.scrollHeight;
      const clientHeight = bottomContainer.clientHeight;
      const maxScroll = scrollHeight - clientHeight;
      const deltaY = event.deltaY;
      if (deltaY > 0) {
        if (scrollTop < SCROLL_SWITCH_THRESHOLD) {
          event.preventDefault();
          bottomContainer.scrollTop = Math.min(scrollTop + deltaY, maxScroll);
        }
      } else {
        if (scrollTop > 0) {
          event.preventDefault();
          bottomContainer.scrollTop = Math.max(scrollTop + deltaY, 0);
        }
      }
    };
    const userAvatar = ref("");
    const username = ref("音乐爱好者");
    const userTagline = ref("");
    const splashSkinEnabled = ref(false);
    const accountHeroMediaStyle = computed(() => ({
      backgroundImage: `url("${userAvatar.value}")`
    }));
    function createDefaultAvatarDataUrl(name = "User") {
      const safeName = `${name || "User"}`.trim().slice(0, 2) || "U";
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3db6ff"/><stop offset="100%" stop-color="#2f7fd6"/></linearGradient></defs><rect width="240" height="240" rx="120" fill="url(#g)"/><text x="120" y="136" text-anchor="middle" font-size="94" font-family="Arial, sans-serif" font-weight="700" fill="#ffffff">${safeName}</text></svg>`;
      return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
    }
    const loadUserInfo = () => {
      const userInfoStr = localStorage.getItem("userInfo");
      if (userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr);
          username.value = userInfo.username || "音乐爱好者";
          userTagline.value = "本地离线模式";
          if (userInfo.avatar_url) {
            userAvatar.value = userInfo.avatar_url;
          } else {
            userAvatar.value = createDefaultAvatarDataUrl(userInfo.username || "User");
          }
        } catch (error) {
          console.error("解析用户信息失败:", error);
          username.value = "本地用户";
          userTagline.value = "本地离线模式";
          userAvatar.value = createDefaultAvatarDataUrl("本地");
        }
      } else {
        username.value = "本地用户";
        userTagline.value = "本地离线模式";
        userAvatar.value = createDefaultAvatarDataUrl("本地");
      }
    };
    const totalSongs = computed(() => {
      return playlistStore.queue?.length || 0;
    });
    const totalPlaylists = ref(0);
    const playTime = ref(0);
    const authStatus = ref({
      bilibili: false,
      bilibiliUser: null
    });
    const importType = ref("file");
    const importUrl = ref("");
    const selectedImportFile = ref(null);
    const isImporting = ref(false);
    const importJobId = ref("");
    const importJobState = ref("idle");
    const importProgressPercent = ref(0);
    const importProgressPhase = ref("等待导入");
    const importProgressMsg = ref("");
    const importAbortRequested = ref(false);
    let importStatusTimer = null;
    const selectedImportFileMeta = computed(() => {
      const file = selectedImportFile.value;
      if (!file) return { sizeLabel: "", kind: "" };
      const lower = (file.name || "").toLowerCase();
      const kind = lower.endsWith(".sql") ? "SQL dump" : lower.endsWith(".sqlite") ? "SQLite" : "数据库文件";
      return {
        sizeLabel: formatByteSize(file.size || 0),
        kind
      };
    });
    const canCancelImport = computed(
      () => isImporting.value && ["reading", "uploading", "receiving", "queued"].includes(importJobState.value)
    );
    const showImportMiniStatus = computed(
      () => !showImportDialog.value && importProgressMsg.value && (isImporting.value || importJobState.value === "success" || importJobState.value === "failed")
    );
    const showAuthDialog = ref(false);
    const showImportDialog = ref(false);
    const showTimerDialog = ref(false);
    const showBrowserDialog = ref(false);
    const {
      timerActive,
      timerWaitingForSongEnd,
      timerRemaining,
      lastTimeMinutes,
      lastSongCount
    } = storeToRefs(timerStore);
    const accountCardState = computed(() => ({
      authStatus: authStatus.value,
      timerActive: timerActive.value,
      timerWaitingForSongEnd: timerWaitingForSongEnd.value,
      timerRemaining: timerRemaining.value,
      lastTimeMinutes: lastTimeMinutes.value,
      lastSongCount: lastSongCount.value,
      splashSkinEnabled: splashSkinEnabled.value
    }));
    const timerMode = ref("time");
    const selectedTimeMinutes = ref(30);
    const selectedSongCount = ref(7);
    const finishCurrentSong = computed({
      get: () => timerStore.finishCurrentSong,
      set: (val) => timerStore.finishCurrentSong = val
    });
    const browserUrl = ref("");
    const browserIframeUrl = ref("");
    const browserSessionId = ref("");
    const browserCurrentRealUrl = ref("");
    const browserDetectedFavUrl = ref("");
    const browserLoading = ref(false);
    const browserIframeRef = ref(null);
    const shouldHideMiniPlayerInAccount = computed(
      () => showBrowserDialog.value || showAuthDialog.value || showImportDialog.value || showTimerDialog.value
    );
    watch(shouldHideMiniPlayerInAccount, (hidden) => {
      if (hidden) {
        playerStore.holdMiniPlayer("account-feature-dialog");
      } else {
        playerStore.releaseMiniPlayer("account-feature-dialog");
      }
    }, { immediate: true });
    function generateUUID() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        return (c === "x" ? r : r & 3 | 8).toString(16);
      });
    }
    function isBilibiliFavUrl(url) {
      if (!url) return false;
      return url.includes("space.bilibili.com") && url.includes("favlist") || url.includes("bilibili.com/medialist/play/ml") || url.includes("bilibili.com/favlist");
    }
    function onBrowserMessage(event) {
      if (!event.data) return;
      const { type, url } = event.data;
      if (type === "browser-url") {
        if (!url) return;
        browserCurrentRealUrl.value = url;
        browserUrl.value = url;
        if (isBilibiliFavUrl(url)) {
          browserDetectedFavUrl.value = url;
        }
      } else if (type === "bili-fav-import") {
        if (url && isBilibiliFavUrl(url)) {
          router.push({ name: "bili-favorite", query: { url } });
        }
      }
    }
    function saveAccountViewStateToCache() {
      cacheStore.savePageState("account", {
        featuresScrollTop: featuresContainerRef.value?.scrollTop || 0
      });
    }
    function restoreAccountViewStateFromCache() {
      const cachedState = cacheStore.getPageState("account");
      if (!cachedState || typeof cachedState !== "object") return;
      const scrollTop = Number(cachedState.featuresScrollTop || 0);
      nextTick(() => {
        if (featuresContainerRef.value) {
          featuresContainerRef.value.scrollTop = Math.max(0, scrollTop);
        }
      });
    }
    let unregisterBack = null;
    let browserMessageBound = false;
    function ensureBrowserMessageListener() {
      if (browserMessageBound) return;
      window.addEventListener("message", onBrowserMessage);
      browserMessageBound = true;
    }
    function removeBrowserMessageListener() {
      if (!browserMessageBound) return;
      window.removeEventListener("message", onBrowserMessage);
      browserMessageBound = false;
    }
    function ensureAccountBackHandler() {
      if (typeof unregisterBack === "function") return;
      unregisterBack = registerBackHandler(() => {
        if (showBrowserDialog.value) {
          const frameWindow = browserIframeRef.value?.contentWindow;
          try {
            if (browserIframeUrl.value && frameWindow?.history?.length > 1) {
              frameWindow.history.back();
              return true;
            }
          } catch (error) {
            console.warn("[AccountView] browser iframe back failed:", error);
          }
          showBrowserDialog.value = false;
          return true;
        }
        if (showAuthDialog.value) {
          showAuthDialog.value = false;
          return true;
        }
        if (showTimerDialog.value) {
          showTimerDialog.value = false;
          return true;
        }
        if (showImportDialog.value) {
          showImportDialog.value = false;
          return true;
        }
        return false;
      });
    }
    function removeAccountBackHandler() {
      if (typeof unregisterBack !== "function") return;
      unregisterBack();
      unregisterBack = null;
    }
    pageLifecycle.onMounted(async () => {
      loadUserInfo();
      loadSplashSkinConfig();
      await loadUserData();
      await loadListeningSummary();
      await loadAuthStatus();
      loadTimerPreferences();
      ensureBrowserMessageListener();
      ensureAccountBackHandler();
      restoreAccountViewStateFromCache();
    });
    pageLifecycle.onActivated(async ({ shouldRestore } = {}) => {
      ensureBrowserMessageListener();
      ensureAccountBackHandler();
      restoreAccountViewStateFromCache();
      if (shouldRestore) {
        return;
      }
      loadUserInfo();
      loadSplashSkinConfig();
      await loadListeningSummary();
      await loadAuthStatus();
    });
    pageLifecycle.onDeactivated(() => {
      saveAccountViewStateToCache();
      removeBrowserMessageListener();
      removeAccountBackHandler();
    });
    onUnmounted(() => {
      removeBrowserMessageListener();
      removeAccountBackHandler();
      stopImportStatusPolling();
      playerStore.releaseMiniPlayer("account-feature-dialog");
    });
    const loadUserData = async () => {
      try {
        const response = await apiRequest("/api/playlists");
        if (response.ok) {
          const data = await response.json();
          totalPlaylists.value = data.playlists?.length || 0;
        }
      } catch (error) {
        console.error("加载用户数据失败:", error);
      }
    };
    const loadListeningSummary = async () => {
      try {
        await playbackEventTracker.flush({ force: true });
        const response = await apiRequest("/api/account/listen-stats?period=history&scope=summary");
        if (!response.ok) return;
        const data = await response.json().catch(() => ({}));
        const totalListenSec = Number(data?.summary?.total_listen_sec || 0);
        playTime.value = Number.isFinite(totalListenSec) && totalListenSec > 0 ? Number((totalListenSec / 3600).toFixed(1)) : 0;
      } catch (error) {
        console.warn("load listening summary failed:", error);
      }
    };
    const loadAuthStatus = async () => {
      try {
        const biliStatus = await biliAuthService.checkStatus();
        authStatus.value.bilibili = biliStatus.authorized;
        authStatus.value.bilibiliUser = biliStatus.user;
        console.log("Bilibili 授权状态:", biliStatus);
      } catch (error) {
        console.error("加载授权状态失败:", error);
        authStatus.value.bilibili = false;
        authStatus.value.bilibiliUser = null;
      }
    };
    function loadSplashSkinConfig() {
      const splashTarget = readSkinThemeTarget("splash_screen");
      splashSkinEnabled.value = Boolean(splashTarget?.enabled && splashTarget?.mediaSrc);
    }
    function openSkinEditor() {
      router.push("/skin-studio");
    }
    const handleAvatarEdit = () => {
      router.push("/profile");
    };
    const handleOpenListenStats = () => {
      router.push("/listen-stats");
    };
    const handleAuthManagement = async () => {
      await loadAuthStatus();
      showAuthDialog.value = true;
    };
    const toggleAuth = async (platform) => {
      {
        if (authStatus.value.bilibili) {
          showGlobalToast("当前版本暂不支持取消 Bilibili 授权", { type: "info" });
          return;
        } else {
          try {
            await biliAuthService.openAuthWindow();
            await loadAuthStatus();
            if (authStatus.value.bilibili && authStatus.value.bilibiliUser) {
              showGlobalToast(`授权成功！欢迎，${authStatus.value.bilibiliUser.uname}`);
            } else {
              showGlobalToast("授权成功！");
            }
          } catch (error) {
            await loadAuthStatus();
            if (error.message !== "授权已取消") {
              showGlobalToast("授权失败：" + error.message, { type: "error" });
            }
          }
        }
      }
    };
    const handleImportPlaylist = () => {
      showImportDialog.value = true;
    };
    const handleFileImport = (event) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;
      const validExtensions = [".db", ".sqlite", ".sql"];
      const fileName = (file.name || "").toLowerCase();
      const hasValidExt = validExtensions.some((ext) => fileName.endsWith(ext));
      if (!hasValidExt) {
        showGlobalToast("仅支持 .db / .sqlite / .sql 格式的搜索库文件", { type: "warning" });
        return;
      }
      selectedImportFile.value = file;
      importJobState.value = "ready";
      importProgressPercent.value = 0;
      importProgressPhase.value = "等待确认";
      importProgressMsg.value = `${file.name} · ${formatByteSize(file.size || 0)}`;
    };
    const clearSelectedImportFile = () => {
      if (isImporting.value) return;
      selectedImportFile.value = null;
      importJobId.value = "";
      importJobState.value = "idle";
      importProgressPercent.value = 0;
      importProgressPhase.value = "等待导入";
      importProgressMsg.value = "";
    };
    const closeImportDialog = () => {
      showImportDialog.value = false;
    };
    function formatByteSize(bytes) {
      const size = Number(bytes || 0);
      if (size <= 0) return "0 B";
      if (size < 1024) return `${size} B`;
      const kb = size / 1024;
      if (kb < 1024) return `${kb.toFixed(1)} KB`;
      const mb = kb / 1024;
      if (mb < 1024) return `${mb.toFixed(1)} MB`;
      return `${(mb / 1024).toFixed(2)} GB`;
    }
    function parseAndroidResult(raw) {
      try {
        return JSON.parse(raw || "{}");
      } catch (error) {
        return { status: 500, error: error.message || "响应解析失败" };
      }
    }
    function requireAsyncImportBridge() {
      return typeof window.Android !== "undefined" && typeof window.Android.beginSearchDbImport === "function" && typeof window.Android.appendSearchDbImportChunk === "function" && typeof window.Android.finishSearchDbImport === "function" && typeof window.Android.getSearchDbImportStatus === "function";
    }
    function applyImportStatusPayload(payload = {}) {
      const nextProgress = Number(payload.progress ?? importProgressPercent.value);
      importJobState.value = payload.state || importJobState.value;
      importProgressPercent.value = Number.isFinite(nextProgress) ? Math.max(0, Math.min(100, nextProgress)) : importProgressPercent.value;
      importProgressPhase.value = payload.phase || importProgressPhase.value;
      importProgressMsg.value = payload.message || importProgressMsg.value;
    }
    function stopImportStatusPolling() {
      if (!importStatusTimer) return;
      clearInterval(importStatusTimer);
      importStatusTimer = null;
    }
    function startImportStatusPolling(jobId) {
      stopImportStatusPolling();
      const poll = () => {
        try {
          const parsed = parseAndroidResult(window.Android.getSearchDbImportStatus(jobId));
          if (parsed.status !== 200 && parsed.status !== 202) {
            throw new Error(parsed.error || "导入状态查询失败");
          }
          const payload = parsed.data || {};
          applyImportStatusPayload(payload);
          if (payload.state === "success") {
            stopImportStatusPolling();
            isImporting.value = false;
            const songs = Number(payload.songs || 0);
            showGlobalToast(songs > 0 ? `导入合并完成，当前共 ${songs} 首歌曲` : "导入合并完成");
          } else if (payload.state === "failed" || payload.state === "cancelled") {
            stopImportStatusPolling();
            isImporting.value = false;
            const message = payload.error || payload.message || "导入失败";
            if (payload.state === "cancelled") {
              showGlobalToast("已取消导入", { type: "info" });
            } else {
              showGlobalToast(message, { type: "error" });
            }
          }
        } catch (error) {
          stopImportStatusPolling();
          isImporting.value = false;
          importJobState.value = "failed";
          importProgressPercent.value = 100;
          importProgressPhase.value = "失败";
          importProgressMsg.value = error.message || "导入状态查询失败";
          showGlobalToast(importProgressMsg.value, { type: "error" });
        }
      };
      poll();
      importStatusTimer = setInterval(poll, 700);
    }
    function readBlobAsArrayBuffer(blob) {
      if (typeof blob.arrayBuffer === "function") {
        return blob.arrayBuffer();
      }
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("读取文件失败"));
        reader.onload = () => resolve(reader.result);
        reader.readAsArrayBuffer(blob);
      });
    }
    function arrayBufferToBase64(buffer) {
      const bytes = new Uint8Array(buffer);
      let binary = "";
      const step = 32768;
      for (let i = 0; i < bytes.length; i += step) {
        binary += String.fromCharCode(...bytes.subarray(i, i + step));
      }
      return btoa(binary);
    }
    async function confirmFileImport() {
      const file = selectedImportFile.value;
      if (!file || isImporting.value) return;
      if (!requireAsyncImportBridge()) {
        showGlobalToast("当前客户端版本不支持后台导入，请更新 Android 客户端", { type: "warning" });
        return;
      }
      isImporting.value = true;
      importAbortRequested.value = false;
      importJobState.value = "reading";
      importProgressPercent.value = 1;
      importProgressPhase.value = "准备文件";
      importProgressMsg.value = `准备导入 ${file.name}`;
      await new Promise((resolve) => requestAnimationFrame(resolve));
      try {
        const begin = parseAndroidResult(window.Android.beginSearchDbImport(file.name || "import.db", String(file.size || 0)));
        if (begin.status !== 202) {
          throw new Error(begin.error || "无法创建导入任务");
        }
        const jobId = begin.data?.jobId;
        if (!jobId) throw new Error("导入任务创建失败");
        importJobId.value = jobId;
        applyImportStatusPayload(begin.data);
        let offset = 0;
        let chunkIndex = 0;
        while (offset < file.size) {
          if (importAbortRequested.value) {
            window.Android.cancelSearchDbImport?.(jobId);
            throw new Error("已取消导入");
          }
          const end = Math.min(offset + IMPORT_CHUNK_SIZE, file.size);
          importJobState.value = "uploading";
          importProgressPhase.value = "读取文件";
          importProgressPercent.value = Math.max(1, Math.min(45, Math.round(end / file.size * 45)));
          importProgressMsg.value = `正在读取 ${formatByteSize(end)} / ${formatByteSize(file.size)}`;
          const buffer = await readBlobAsArrayBuffer(file.slice(offset, end));
          const append = parseAndroidResult(window.Android.appendSearchDbImportChunk(jobId, arrayBufferToBase64(buffer), String(chunkIndex)));
          if (append.status !== 202) {
            throw new Error(append.error || "文件分片写入失败");
          }
          applyImportStatusPayload(append.data);
          offset = end;
          chunkIndex += 1;
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
        importProgressPhase.value = "提交导入";
        importProgressMsg.value = "文件接收完成，正在提交后台导入";
        importProgressPercent.value = 50;
        const finish = parseAndroidResult(window.Android.finishSearchDbImport(jobId));
        if (finish.status !== 202) {
          throw new Error(finish.error || "提交导入失败");
        }
        applyImportStatusPayload(finish.data);
        startImportStatusPolling(jobId);
      } catch (error) {
        stopImportStatusPolling();
        isImporting.value = false;
        if (error.message === "已取消导入") {
          importJobState.value = "cancelled";
          importProgressPhase.value = "已取消";
          importProgressMsg.value = "导入已取消";
          importProgressPercent.value = 0;
          showGlobalToast("已取消导入", { type: "info" });
        } else {
          importJobState.value = "failed";
          importProgressPhase.value = "失败";
          importProgressMsg.value = error.message || "导入失败";
          importProgressPercent.value = 100;
          showGlobalToast(`导入失败：${importProgressMsg.value}`, { type: "error" });
        }
      }
    }
    const cancelFileImport = () => {
      importAbortRequested.value = true;
      if (importJobId.value && window.Android?.cancelSearchDbImport) {
        const parsed = parseAndroidResult(window.Android.cancelSearchDbImport(importJobId.value));
        if (parsed.data) applyImportStatusPayload(parsed.data);
      }
    };
    const dismissImportProgress = () => {
      if (isImporting.value) {
        showImportDialog.value = false;
        return;
      }
      stopImportStatusPolling();
      importJobId.value = "";
      importJobState.value = "idle";
      importProgressPercent.value = 0;
      importProgressPhase.value = "等待导入";
      importProgressMsg.value = "";
      selectedImportFile.value = null;
    };
    const handleUrlImport = () => {
      if (!importUrl.value.trim()) {
        showGlobalToast("请输入有效的歌单链接", { type: "warning" });
        return;
      }
      const url = importUrl.value.trim();
      if (url.includes("space.bilibili.com") && url.includes("favlist")) {
        console.log("【识别为Bilibili收藏夹链接】", url);
        showImportDialog.value = false;
        importUrl.value = "";
        setTimeout(() => {
          router.push({
            name: "bili-favorite",
            query: { url }
          });
        }, 150);
        return;
      }
      showGlobalToast(`导入链接: ${url}，该平台的导入功能开发中...`, { type: "info", duration: 3200 });
      showImportDialog.value = false;
      importUrl.value = "";
    };
    const handleTimerSetting = () => {
      loadTimerPreferences();
      showTimerDialog.value = true;
    };
    const quickStartTimer = (mode, value) => {
      if (mode === "time") {
        timerStore.startTimeTimer(value);
      } else {
        timerStore.startCountTimer(value);
      }
    };
    const confirmTimer = () => {
      saveTimerPreferences();
      if (timerMode.value === "time") {
        timerStore.startTimeTimer(selectedTimeMinutes.value);
      } else {
        timerStore.startCountTimer(selectedSongCount.value);
      }
      showTimerDialog.value = false;
    };
    const cancelTimer = () => {
      timerStore.cancelTimer();
    };
    const saveTimerPreferences = () => {
      localStorage.setItem("timer_pref_mode", timerMode.value);
      localStorage.setItem("timer_pref_minutes", selectedTimeMinutes.value.toString());
      localStorage.setItem("timer_pref_count", selectedSongCount.value.toString());
    };
    const loadTimerPreferences = () => {
      const prefMode = localStorage.getItem("timer_pref_mode");
      const prefMinutes = localStorage.getItem("timer_pref_minutes");
      const prefCount = localStorage.getItem("timer_pref_count");
      if (prefMode) timerMode.value = prefMode;
      if (prefMinutes) selectedTimeMinutes.value = parseInt(prefMinutes);
      if (prefCount) selectedSongCount.value = parseInt(prefCount);
    };
    const handleBrowserOpen = () => {
      if (typeof window.Android !== "undefined") {
        const biliUser = authStatus.value.bilibiliUser;
        const initialUrl = biliUser?.mid ? `https://space.bilibili.com/${biliUser.mid}/favlist` : "https://www.bilibili.com";
        window.Android.openBiliBrowser(initialUrl);
        return;
      }
      browserSessionId.value = generateUUID();
      browserCurrentRealUrl.value = "";
      browserDetectedFavUrl.value = "";
      browserIframeUrl.value = "";
      browserUrl.value = "";
      showBrowserDialog.value = true;
    };
    const openBilibili = () => {
      if (typeof window.Android !== "undefined") {
        window.Android.openBiliBrowser("https://www.bilibili.com");
        return;
      }
      browserUrl.value = "https://www.bilibili.com";
      loadBrowserUrl();
    };
    const openBilibiliSpace = () => {
      const biliUser = authStatus.value.bilibiliUser;
      const spaceUrl = biliUser?.mid ? `https://space.bilibili.com/${biliUser.mid}/favlist` : "https://space.bilibili.com";
      if (typeof window.Android !== "undefined") {
        window.Android.openBiliBrowser(spaceUrl);
        return;
      }
      browserUrl.value = spaceUrl;
      loadBrowserUrl();
    };
    const reloadBrowser = () => {
      if (browserIframeRef.value) {
        try {
          browserIframeRef.value.contentWindow.location.reload();
        } catch {
        }
      }
      if (browserUrl.value) loadBrowserUrl();
    };
    const importDetectedFav = () => {
      const url = browserDetectedFavUrl.value;
      if (!url) return;
      closeBrowser();
      setTimeout(() => {
        router.push({ name: "bili-favorite", query: { url } });
      }, 200);
    };
    const loadBrowserUrl = () => {
      if (!browserUrl.value.trim()) {
        return;
      }
      let input = browserUrl.value.trim();
      const isUrl = /^https?:\/\//i.test(input) || /\./.test(input) && !/\s/.test(input);
      let targetUrl;
      if (isUrl) {
        targetUrl = input.startsWith("http") ? input : "https://" + input;
      } else {
        targetUrl = `https://www.bing.com/search?q=${encodeURIComponent(input)}`;
      }
      const sid = browserSessionId.value || (browserSessionId.value = generateUUID());
      browserIframeUrl.value = `/api/browser-proxy?url=${encodeURIComponent(targetUrl)}&session=${encodeURIComponent(sid)}`;
      browserLoading.value = true;
    };
    const onIframeLoad = () => {
      browserLoading.value = false;
    };
    const closeBrowser = () => {
      showBrowserDialog.value = false;
    };
    const accountCardActions = {
      handleAuthManagement,
      handleBrowserOpen,
      handleTimerSetting,
      quickStartTimer,
      cancelTimer,
      handleImportPlaylist,
      handleSkinEditor: openSkinEditor
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "account-view",
        onWheel: handleWheel
      }, [
        createBaseVNode("div", _hoisted_1, [
          createBaseVNode("div", _hoisted_2, [
            createBaseVNode("div", {
              class: "account-hero-media",
              style: normalizeStyle(accountHeroMediaStyle.value)
            }, null, 4),
            _cache[32] || (_cache[32] = createBaseVNode("div", { class: "account-hero-frost" }, null, -1)),
            _cache[33] || (_cache[33] = createBaseVNode("div", { class: "account-focal-glow" }, null, -1)),
            createBaseVNode("div", _hoisted_3, [
              createBaseVNode("button", {
                class: "avatar-focus-button",
                type: "button",
                onClick: handleAvatarEdit
              }, [
                createBaseVNode("div", _hoisted_4, [
                  createBaseVNode("img", {
                    src: userAvatar.value,
                    alt: "用户头像",
                    class: "user-avatar"
                  }, null, 8, _hoisted_5)
                ]),
                _cache[27] || (_cache[27] = createBaseVNode("span", { class: "avatar-focus-tip" }, "本地资料", -1))
              ])
            ]),
            createBaseVNode("div", _hoisted_6, [
              _cache[31] || (_cache[31] = createBaseVNode("p", { class: "account-kicker" }, "Local Profile", -1)),
              createBaseVNode("h2", _hoisted_7, toDisplayString(username.value), 1),
              userTagline.value ? (openBlock(), createElementBlock("p", _hoisted_8, toDisplayString(userTagline.value), 1)) : createCommentVNode("", true),
              createBaseVNode("div", {
                class: "user-stats stats-entry",
                "data-skin-sandbox-pass-click": "1",
                onClick: handleOpenListenStats
              }, [
                createBaseVNode("div", _hoisted_9, [
                  createBaseVNode("span", _hoisted_10, toDisplayString(totalSongs.value), 1),
                  _cache[28] || (_cache[28] = createBaseVNode("span", { class: "stat-label" }, "首歌曲", -1))
                ]),
                createBaseVNode("div", _hoisted_11, [
                  createBaseVNode("span", _hoisted_12, toDisplayString(totalPlaylists.value), 1),
                  _cache[29] || (_cache[29] = createBaseVNode("span", { class: "stat-label" }, "个歌单", -1))
                ]),
                createBaseVNode("div", _hoisted_13, [
                  createBaseVNode("span", _hoisted_14, toDisplayString(playTime.value), 1),
                  _cache[30] || (_cache[30] = createBaseVNode("span", { class: "stat-label" }, "小时播放", -1))
                ])
              ])
            ])
          ])
        ]),
        createBaseVNode("div", {
          class: "bottom-section-container",
          ref_key: "featuresContainerRef",
          ref: featuresContainerRef
        }, [
          createVNode(AccountFeatureCardWall, {
            plugins: unref(accountCardPlugins),
            state: accountCardState.value,
            actions: accountCardActions
          }, null, 8, ["plugins", "state"])
        ], 512),
        createVNode(Transition, { name: "fade" }, {
          default: withCtx(() => [
            showAuthDialog.value ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: "dialog-overlay",
              onClick: _cache[3] || (_cache[3] = ($event) => showAuthDialog.value = false)
            }, [
              createBaseVNode("div", {
                class: "dialog-container",
                onClick: _cache[2] || (_cache[2] = withModifiers(() => {
                }, ["stop"]))
              }, [
                createBaseVNode("div", _hoisted_15, [
                  _cache[34] || (_cache[34] = createBaseVNode("h3", null, "账户授权管理", -1)),
                  createBaseVNode("button", {
                    class: "close-btn",
                    onClick: _cache[0] || (_cache[0] = ($event) => showAuthDialog.value = false)
                  }, "✕")
                ]),
                createBaseVNode("div", _hoisted_16, [
                  createBaseVNode("div", _hoisted_17, [
                    createBaseVNode("div", _hoisted_18, [
                      _cache[36] || (_cache[36] = createBaseVNode("div", { class: "platform-logo bili" }, "B", -1)),
                      createBaseVNode("div", null, [
                        _cache[35] || (_cache[35] = createBaseVNode("h4", null, "Bilibili", -1)),
                        !authStatus.value.bilibili ? (openBlock(), createElementBlock("p", _hoisted_19, "授权后可直接下载 Bilibili 音频")) : (openBlock(), createElementBlock("p", _hoisted_20, toDisplayString(authStatus.value.bilibiliUser?.uname || "已授权"), 1))
                      ])
                    ]),
                    createBaseVNode("button", {
                      class: normalizeClass(["auth-btn", { authorized: authStatus.value.bilibili }]),
                      disabled: authStatus.value.bilibili,
                      onClick: _cache[1] || (_cache[1] = ($event) => toggleAuth("bilibili"))
                    }, toDisplayString(authStatus.value.bilibili ? "已授权" : "授权登录"), 11, _hoisted_21)
                  ])
                ])
              ])
            ])) : createCommentVNode("", true)
          ]),
          _: 1
        }),
        createVNode(Transition, { name: "fade" }, {
          default: withCtx(() => [
            showImportDialog.value ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: "dialog-overlay",
              onClick: closeImportDialog
            }, [
              createBaseVNode("div", {
                class: "dialog-container",
                onClick: _cache[7] || (_cache[7] = withModifiers(() => {
                }, ["stop"]))
              }, [
                createBaseVNode("div", { class: "dialog-header" }, [
                  _cache[37] || (_cache[37] = createBaseVNode("h3", null, "导入文件", -1)),
                  createBaseVNode("button", {
                    class: "close-btn",
                    onClick: closeImportDialog
                  }, "✕")
                ]),
                createBaseVNode("div", _hoisted_22, [
                  createBaseVNode("div", _hoisted_23, [
                    createBaseVNode("label", _hoisted_24, [
                      withDirectives(createBaseVNode("input", {
                        type: "radio",
                        value: "file",
                        "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => importType.value = $event),
                        disabled: isImporting.value
                      }, null, 8, _hoisted_25), [
                        [vModelRadio, importType.value]
                      ]),
                      _cache[38] || (_cache[38] = createBaseVNode("span", null, "从文件导入 SQL（搜索库）", -1))
                    ]),
                    createBaseVNode("label", _hoisted_26, [
                      withDirectives(createBaseVNode("input", {
                        type: "radio",
                        value: "url",
                        "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => importType.value = $event),
                        disabled: isImporting.value
                      }, null, 8, _hoisted_27), [
                        [vModelRadio, importType.value]
                      ]),
                      _cache[39] || (_cache[39] = createBaseVNode("span", null, "从链接导入（B站收藏夹）", -1))
                    ])
                  ]),
                  importType.value === "file" ? (openBlock(), createElementBlock("div", _hoisted_28, [
                    createBaseVNode("label", {
                      class: normalizeClass(["import-file-picker", { disabled: isImporting.value }])
                    }, [
                      createBaseVNode("input", {
                        type: "file",
                        onChange: handleFileImport,
                        accept: ".db,.sqlite,.sql",
                        disabled: isImporting.value
                      }, null, 40, _hoisted_29),
                      createBaseVNode("span", null, toDisplayString(selectedImportFile.value ? "重新选择数据库文件" : "选择数据库文件"), 1)
                    ], 2),
                    _cache[41] || (_cache[41] = createBaseVNode("p", { class: "hint" }, "支持 music_cache.db、同结构 SQLite 或 MySQL SQL dump", -1)),
                    selectedImportFile.value ? (openBlock(), createElementBlock("div", _hoisted_30, [
                      createBaseVNode("div", _hoisted_31, [
                        createBaseVNode("span", _hoisted_32, toDisplayString(selectedImportFile.value.name), 1),
                        createBaseVNode("span", _hoisted_33, toDisplayString(selectedImportFileMeta.value.sizeLabel) + " · " + toDisplayString(selectedImportFileMeta.value.kind), 1)
                      ]),
                      !isImporting.value ? (openBlock(), createElementBlock("button", {
                        key: 0,
                        class: "import-clear-btn",
                        type: "button",
                        onClick: clearSelectedImportFile
                      }, "移除")) : createCommentVNode("", true)
                    ])) : createCommentVNode("", true),
                    selectedImportFile.value && !isImporting.value && importJobState.value !== "success" ? (openBlock(), createElementBlock("div", _hoisted_34, [
                      _cache[40] || (_cache[40] = createBaseVNode("p", null, "导入后会合并到当前离线搜索库，重复歌曲按 hash 更新。", -1)),
                      createBaseVNode("button", {
                        class: "import-btn primary",
                        type: "button",
                        onClick: confirmFileImport
                      }, "确认导入")
                    ])) : createCommentVNode("", true),
                    isImporting.value || importJobState.value === "success" || importJobState.value === "failed" ? (openBlock(), createElementBlock("div", _hoisted_35, [
                      createBaseVNode("div", _hoisted_36, [
                        createBaseVNode("span", null, toDisplayString(importProgressPhase.value), 1),
                        createBaseVNode("strong", null, toDisplayString(importProgressPercent.value) + "%", 1)
                      ]),
                      createBaseVNode("div", _hoisted_37, [
                        createBaseVNode("div", {
                          class: "import-progress-bar",
                          style: normalizeStyle({ width: `${importProgressPercent.value}%` })
                        }, null, 4)
                      ]),
                      createBaseVNode("p", _hoisted_38, toDisplayString(importProgressMsg.value), 1),
                      createBaseVNode("div", _hoisted_39, [
                        canCancelImport.value ? (openBlock(), createElementBlock("button", {
                          key: 0,
                          class: "import-secondary-btn",
                          type: "button",
                          onClick: cancelFileImport
                        }, " 取消 ")) : createCommentVNode("", true),
                        importJobState.value === "success" || importJobState.value === "failed" ? (openBlock(), createElementBlock("button", {
                          key: 1,
                          class: "import-secondary-btn",
                          type: "button",
                          onClick: dismissImportProgress
                        }, " 收起 ")) : createCommentVNode("", true)
                      ])
                    ])) : createCommentVNode("", true)
                  ])) : importType.value === "url" ? (openBlock(), createElementBlock("div", _hoisted_40, [
                    withDirectives(createBaseVNode("input", {
                      type: "text",
                      "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => importUrl.value = $event),
                      placeholder: "粘贴 B站 收藏夹链接",
                      class: "url-input"
                    }, null, 512), [
                      [vModelText, importUrl.value]
                    ]),
                    createBaseVNode("button", {
                      class: "import-btn",
                      onClick: handleUrlImport
                    }, "导入收藏夹")
                  ])) : createCommentVNode("", true)
                ])
              ])
            ])) : createCommentVNode("", true)
          ]),
          _: 1
        }),
        createVNode(Transition, { name: "fade" }, {
          default: withCtx(() => [
            showImportMiniStatus.value ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: normalizeClass(["import-mini-status", importJobState.value])
            }, [
              createBaseVNode("div", _hoisted_41, [
                createBaseVNode("span", null, toDisplayString(importProgressPhase.value), 1),
                createBaseVNode("strong", null, toDisplayString(importProgressMsg.value), 1)
              ]),
              createBaseVNode("div", _hoisted_42, [
                createBaseVNode("div", {
                  style: normalizeStyle({ width: `${importProgressPercent.value}%` })
                }, null, 4)
              ]),
              createBaseVNode("div", _hoisted_43, [
                createBaseVNode("button", {
                  type: "button",
                  onClick: _cache[8] || (_cache[8] = ($event) => showImportDialog.value = true)
                }, "查看"),
                !isImporting.value ? (openBlock(), createElementBlock("button", {
                  key: 0,
                  type: "button",
                  onClick: dismissImportProgress
                }, "关闭")) : createCommentVNode("", true)
              ])
            ], 2)) : createCommentVNode("", true)
          ]),
          _: 1
        }),
        createVNode(Transition, { name: "fade" }, {
          default: withCtx(() => [
            showTimerDialog.value ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: "dialog-overlay",
              onClick: _cache[23] || (_cache[23] = ($event) => showTimerDialog.value = false)
            }, [
              createBaseVNode("div", {
                class: "dialog-container medium",
                onClick: _cache[22] || (_cache[22] = withModifiers(() => {
                }, ["stop"]))
              }, [
                createBaseVNode("div", _hoisted_44, [
                  _cache[42] || (_cache[42] = createBaseVNode("h3", null, "设置定时关闭", -1)),
                  createBaseVNode("button", {
                    class: "close-btn",
                    onClick: _cache[9] || (_cache[9] = ($event) => showTimerDialog.value = false)
                  }, "✕")
                ]),
                createBaseVNode("div", _hoisted_45, [
                  createBaseVNode("div", _hoisted_46, [
                    createBaseVNode("button", {
                      class: normalizeClass(["mode-btn", { active: timerMode.value === "time" }]),
                      onClick: _cache[10] || (_cache[10] = ($event) => timerMode.value = "time")
                    }, " ⏱️ 按时间 ", 2),
                    createBaseVNode("button", {
                      class: normalizeClass(["mode-btn", { active: timerMode.value === "count" }]),
                      onClick: _cache[11] || (_cache[11] = ($event) => timerMode.value = "count")
                    }, " 🎵 按歌曲数 ", 2)
                  ]),
                  timerMode.value === "time" ? (openBlock(), createElementBlock("div", _hoisted_47, [
                    createBaseVNode("div", _hoisted_48, [
                      createBaseVNode("button", {
                        class: normalizeClass(["quick-option-btn", { selected: selectedTimeMinutes.value === 30 }]),
                        onClick: _cache[12] || (_cache[12] = ($event) => selectedTimeMinutes.value = 30)
                      }, " 30分钟 ", 2),
                      createBaseVNode("button", {
                        class: normalizeClass(["quick-option-btn", { selected: selectedTimeMinutes.value === 45 }]),
                        onClick: _cache[13] || (_cache[13] = ($event) => selectedTimeMinutes.value = 45)
                      }, " 45分钟 ", 2),
                      createBaseVNode("button", {
                        class: normalizeClass(["quick-option-btn", { selected: selectedTimeMinutes.value === 60 }]),
                        onClick: _cache[14] || (_cache[14] = ($event) => selectedTimeMinutes.value = 60)
                      }, " 60分钟 ", 2)
                    ]),
                    createBaseVNode("div", _hoisted_49, [
                      createBaseVNode("label", null, "自定义时间: " + toDisplayString(selectedTimeMinutes.value) + " 分钟", 1),
                      withDirectives(createBaseVNode("input", {
                        type: "range",
                        "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => selectedTimeMinutes.value = $event),
                        min: "1",
                        max: "180",
                        class: "timer-slider"
                      }, null, 512), [
                        [
                          vModelText,
                          selectedTimeMinutes.value,
                          void 0,
                          { number: true }
                        ]
                      ]),
                      _cache[43] || (_cache[43] = createBaseVNode("div", { class: "slider-labels" }, [
                        createBaseVNode("span", null, "1分钟"),
                        createBaseVNode("span", null, "180分钟")
                      ], -1))
                    ])
                  ])) : createCommentVNode("", true),
                  timerMode.value === "count" ? (openBlock(), createElementBlock("div", _hoisted_50, [
                    createBaseVNode("div", _hoisted_51, [
                      createBaseVNode("button", {
                        class: normalizeClass(["quick-option-btn", { selected: selectedSongCount.value === 7 }]),
                        onClick: _cache[16] || (_cache[16] = ($event) => selectedSongCount.value = 7)
                      }, " 7首歌 ", 2),
                      createBaseVNode("button", {
                        class: normalizeClass(["quick-option-btn", { selected: selectedSongCount.value === 12 }]),
                        onClick: _cache[17] || (_cache[17] = ($event) => selectedSongCount.value = 12)
                      }, " 12首歌 ", 2),
                      createBaseVNode("button", {
                        class: normalizeClass(["quick-option-btn", { selected: selectedSongCount.value === 20 }]),
                        onClick: _cache[18] || (_cache[18] = ($event) => selectedSongCount.value = 20)
                      }, " 20首歌 ", 2)
                    ]),
                    createBaseVNode("div", _hoisted_52, [
                      createBaseVNode("label", null, "自定义歌曲数: " + toDisplayString(selectedSongCount.value) + " 首", 1),
                      withDirectives(createBaseVNode("input", {
                        type: "range",
                        "onUpdate:modelValue": _cache[19] || (_cache[19] = ($event) => selectedSongCount.value = $event),
                        min: "1",
                        max: "50",
                        class: "timer-slider"
                      }, null, 512), [
                        [
                          vModelText,
                          selectedSongCount.value,
                          void 0,
                          { number: true }
                        ]
                      ]),
                      _cache[44] || (_cache[44] = createBaseVNode("div", { class: "slider-labels" }, [
                        createBaseVNode("span", null, "1首"),
                        createBaseVNode("span", null, "50首")
                      ], -1))
                    ])
                  ])) : createCommentVNode("", true),
                  createBaseVNode("div", _hoisted_53, [
                    createBaseVNode("label", _hoisted_54, [
                      withDirectives(createBaseVNode("input", {
                        type: "checkbox",
                        "onUpdate:modelValue": _cache[20] || (_cache[20] = ($event) => finishCurrentSong.value = $event)
                      }, null, 512), [
                        [vModelCheckbox, finishCurrentSong.value]
                      ]),
                      _cache[45] || (_cache[45] = createBaseVNode("span", null, "播完当前歌曲再关闭", -1))
                    ])
                  ]),
                  createBaseVNode("div", _hoisted_55, [
                    createBaseVNode("button", {
                      class: "btn-cancel",
                      onClick: _cache[21] || (_cache[21] = ($event) => showTimerDialog.value = false)
                    }, "取消"),
                    createBaseVNode("button", {
                      class: "btn-confirm",
                      onClick: confirmTimer
                    }, "确定")
                  ])
                ])
              ])
            ])) : createCommentVNode("", true)
          ]),
          _: 1
        }),
        createVNode(Transition, { name: "fade" }, {
          default: withCtx(() => [
            showBrowserDialog.value ? (openBlock(), createElementBlock("div", _hoisted_56, [
              createBaseVNode("div", {
                class: "dialog-container browser-container",
                onClick: _cache[26] || (_cache[26] = withModifiers(() => {
                }, ["stop"]))
              }, [
                createBaseVNode("div", _hoisted_57, [
                  _cache[46] || (_cache[46] = createBaseVNode("span", { class: "browser-lock" }, "🔒", -1)),
                  withDirectives(createBaseVNode("input", {
                    type: "text",
                    "onUpdate:modelValue": _cache[24] || (_cache[24] = ($event) => browserUrl.value = $event),
                    placeholder: "输入 Bilibili 收藏夹地址 或 搜索关键词...",
                    class: "browser-url-input",
                    onKeyup: withKeys(loadBrowserUrl, ["enter"])
                  }, null, 544), [
                    [vModelText, browserUrl.value]
                  ]),
                  createBaseVNode("button", {
                    class: "browser-btn",
                    onClick: loadBrowserUrl
                  }, "跳转"),
                  createBaseVNode("button", {
                    class: "browser-reload-btn",
                    onClick: reloadBrowser,
                    title: "刷新"
                  }, "⟳"),
                  createBaseVNode("button", {
                    class: "close-btn",
                    onClick: closeBrowser
                  }, "✕")
                ]),
                browserCurrentRealUrl.value ? (openBlock(), createElementBlock("div", _hoisted_58, [
                  createBaseVNode("span", _hoisted_59, toDisplayString(browserCurrentRealUrl.value), 1)
                ])) : createCommentVNode("", true),
                createVNode(Transition, { name: "slide-down" }, {
                  default: withCtx(() => [
                    browserDetectedFavUrl.value ? (openBlock(), createElementBlock("div", _hoisted_60, [
                      _cache[48] || (_cache[48] = createBaseVNode("span", { class: "fav-detect-icon" }, "📥", -1)),
                      createBaseVNode("div", _hoisted_61, [
                        _cache[47] || (_cache[47] = createBaseVNode("strong", null, "检测到 Bilibili 收藏夹！", -1)),
                        createBaseVNode("span", _hoisted_62, toDisplayString(browserDetectedFavUrl.value), 1)
                      ]),
                      createBaseVNode("button", {
                        class: "fav-import-btn",
                        onClick: importDetectedFav
                      }, "导入收藏夹"),
                      createBaseVNode("button", {
                        class: "fav-dismiss-btn",
                        onClick: _cache[25] || (_cache[25] = ($event) => browserDetectedFavUrl.value = ""),
                        title: "忽略"
                      }, "✕")
                    ])) : createCommentVNode("", true)
                  ]),
                  _: 1
                }),
                !browserIframeUrl.value ? (openBlock(), createElementBlock("div", _hoisted_63, [
                  createBaseVNode("button", {
                    class: "qb-btn bilibili",
                    onClick: openBilibili
                  }, "📺 Bilibili 首页"),
                  createBaseVNode("button", {
                    class: "qb-btn bilibili-space",
                    onClick: openBilibiliSpace
                  }, "⭐ 我的收藏")
                ])) : createCommentVNode("", true),
                createBaseVNode("div", _hoisted_64, [
                  browserLoading.value ? (openBlock(), createElementBlock("div", _hoisted_65, [..._cache[49] || (_cache[49] = [
                    createBaseVNode("div", { class: "browser-spinner" }, null, -1),
                    createBaseVNode("span", null, "加载中...", -1)
                  ])])) : createCommentVNode("", true),
                  browserIframeUrl.value ? (openBlock(), createElementBlock("iframe", {
                    key: 1,
                    ref_key: "browserIframeRef",
                    ref: browserIframeRef,
                    src: browserIframeUrl.value,
                    class: "browser-iframe",
                    sandbox: "allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation",
                    onLoad: onIframeLoad
                  }, null, 40, _hoisted_66)) : createCommentVNode("", true),
                  !browserIframeUrl.value ? (openBlock(), createElementBlock("div", _hoisted_67, [..._cache[50] || (_cache[50] = [
                    createBaseVNode("div", { class: "browser-placeholder-icon" }, "🌐", -1),
                    createBaseVNode("p", null, [
                      createTextVNode("以 "),
                      createBaseVNode("strong", null, "PC 端模式"),
                      createTextVNode(" 打开网站")
                    ], -1),
                    createBaseVNode("p", { class: "browser-hint" }, [
                      createTextVNode("登录 Bilibili 后，进入 "),
                      createBaseVNode("strong", null, "我的收藏夹"),
                      createTextVNode(" 页面，即可一键导入音乐")
                    ], -1)
                  ])])) : createCommentVNode("", true)
                ]),
                _cache[51] || (_cache[51] = createBaseVNode("div", { class: "browser-footer" }, [
                  createBaseVNode("span", { class: "browser-tip" }, "💡 通过代理以 PC 端加载，支持 Bilibili 登录。收藏夹链接将自动识别。")
                ], -1))
              ])
            ])) : createCommentVNode("", true)
          ]),
          _: 1
        })
      ], 32);
    };
  }
});
const AccountView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0fd8a1e8"]]);
export {
  AccountView as default
};
