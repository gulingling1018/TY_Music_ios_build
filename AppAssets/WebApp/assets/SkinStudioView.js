import { M as ref, c as computed, v as nextTick, $ as useRouter, a5 as watch, E as onMounted, H as onUnmounted, I as openBlock, g as createElementBlock, d as createBaseVNode, x as normalizeStyle, f as createCommentVNode, l as createVNode, a6 as withCtx, T as Transition, w as normalizeClass, Y as toDisplayString, F as Fragment, O as renderList, a7 as withDirectives, a0 as vModelCheckbox, Z as unref, e as createBlock, a8 as withKeys, a9 as withModifiers, a2 as vModelSelect, o as defineComponent, s as h } from "./vendor.js";
import { K as normalizeSkinMediaFit, y as getSkinMediaFitScale, _ as _export_sfc, ac as usePlayerStore, L as normalizeSkinThemeConfig, J as loadSkinThemeConfig, a1 as serializeSkinThemeConfig, c as SKIN_TARGET_SCHEMAS, j as buildSkinThemeCssVars, af as useResolvedSkinMediaSrc, z as getSongCoverSrc, R as processCoverUrl, X as registerBackHandler, I as ImageCropperDialog, a3 as showGlobalToast, a0 as saveSkinThemeConfig, h as applySkinThemeRuntime, a6 as syncNativeStartupSplash, $ as saveSkinMediaFile, p as createStandardSkinThemeTemplate, S as SKIN_SANDBOX_DRAFT_EVENT, g as applyResolvedSkinThemeMediaCssVars } from "./index.js";
function getTouchDistance(touchA, touchB) {
  const dx = touchB.clientX - touchA.clientX;
  const dy = touchB.clientY - touchA.clientY;
  return Math.hypot(dx, dy);
}
function getTouchCenter(touchA, touchB) {
  return {
    x: (touchA.clientX + touchB.clientX) / 2,
    y: (touchA.clientY + touchB.clientY) / 2
  };
}
function useGestureViewportEditor(options = {}) {
  const maxScale = Number(options.maxScale || 8);
  const minScaleRatio = Math.max(0.05, Number(options.minScaleRatio || 1));
  const edgeSlackRatio = Math.max(0, Number(options.edgeSlackRatio || 0));
  const edgeSlackPx = Math.max(0, Number(options.edgeSlackPx || 0));
  const allowEmptyViewport = Boolean(options.allowEmptyViewport);
  const scaleMode = options.scaleMode === "relative-fit" ? "relative-fit" : "natural-pixel";
  const snapThresholdPx = Math.max(0, Number(options.snapThresholdPx ?? 8));
  const snapPoints = Array.isArray(options.snapPoints) && options.snapPoints.length ? options.snapPoints : [0.25, 1 / 3, 0.5, 2 / 3, 0.75];
  const normalizedSnapPoints = snapPoints.map((value) => Number(value)).filter((value) => Number.isFinite(value) && value >= 0 && value <= 1);
  const viewportRef = ref(null);
  const mediaRef = ref(null);
  const scale = ref(1);
  const minScale = ref(0.05);
  const translateX = ref(0);
  const translateY = ref(0);
  const transformDirty = ref(false);
  const isDragging = ref(false);
  let dragState = { x: 0, y: 0, tx: 0, ty: 0 };
  let touchMode = "idle";
  let pinchState = {
    startDistance: 0,
    startScale: 1,
    startCenter: { x: 0, y: 0 },
    startTx: 0,
    startTy: 0
  };
  function resolveFitMode() {
    const rawFitMode = typeof options.fitMode === "function" ? options.fitMode() : options.fitMode;
    return normalizeSkinMediaFit(rawFitMode, "cover");
  }
  function getCoordinateScale() {
    const source = typeof options.sourceViewportSize === "function" ? options.sourceViewportSize() : null;
    return {
      x: source?.width > 0 ? (viewportRef.value?.clientWidth || source.width) / source.width : 1,
      y: source?.height > 0 ? (viewportRef.value?.clientHeight || source.height) / source.height : 1
    };
  }
  const mediaStyle = computed(() => {
    const commonStyle = {
      position: "absolute",
      maxWidth: "none",
      maxHeight: "none",
      transformOrigin: "center center",
      userSelect: "none",
      touchAction: "none",
      cursor: isDragging.value ? "grabbing" : "grab"
    };
    if (scaleMode === "relative-fit") {
      const coordinateScale = getCoordinateScale();
      return {
        ...commonStyle,
        inset: "0",
        width: "100%",
        height: "100%",
        objectFit: resolveFitMode(),
        objectPosition: "center center",
        transform: `translate(${translateX.value * coordinateScale.x}px, ${translateY.value * coordinateScale.y}px) scale(${scale.value})`
      };
    }
    return {
      ...commonStyle,
      top: "50%",
      left: "50%",
      transform: `translate(calc(-50% + ${translateX.value}px), calc(-50% + ${translateY.value}px)) scale(${scale.value})`
    };
  });
  function getMediaSize() {
    const mediaEl = mediaRef.value;
    if (!mediaEl) return { width: 0, height: 0 };
    const isVideo = typeof HTMLVideoElement !== "undefined" && mediaEl instanceof HTMLVideoElement || `${mediaEl.tagName || ""}`.toLowerCase() === "video";
    if (isVideo) {
      return {
        width: mediaEl.videoWidth || mediaEl.clientWidth || 0,
        height: mediaEl.videoHeight || mediaEl.clientHeight || 0
      };
    }
    return {
      width: mediaEl.naturalWidth || mediaEl.clientWidth || 0,
      height: mediaEl.naturalHeight || mediaEl.clientHeight || 0
    };
  }
  function getRenderedMediaSize(nextScale = scale.value) {
    const viewportEl = viewportRef.value;
    const { width, height } = getMediaSize();
    if (scaleMode !== "relative-fit") {
      return {
        width: width * nextScale,
        height: height * nextScale
      };
    }
    if (!viewportEl) {
      return { width: 0, height: 0 };
    }
    const viewportWidth = viewportEl.clientWidth || 0;
    const viewportHeight = viewportEl.clientHeight || 0;
    if (!width || !height || !viewportWidth || !viewportHeight) {
      return {
        width: viewportWidth * nextScale,
        height: viewportHeight * nextScale
      };
    }
    const fitScale = getSkinMediaFitScale(width, height, viewportWidth, viewportHeight, resolveFitMode());
    return {
      width: width * fitScale * nextScale,
      height: height * fitScale * nextScale
    };
  }
  function clampTranslation(nextTx, nextTy, nextScale = scale.value) {
    const viewportEl = viewportRef.value;
    const renderedSize = getRenderedMediaSize(nextScale);
    if (!viewportEl || !renderedSize.width || !renderedSize.height) {
      return { tx: nextTx, ty: nextTy };
    }
    const renderedWidth = renderedSize.width;
    const renderedHeight = renderedSize.height;
    const slackX = Math.max(edgeSlackPx, viewportEl.clientWidth * edgeSlackRatio);
    const slackY = Math.max(edgeSlackPx, viewportEl.clientHeight * edgeSlackRatio);
    const maxX = (allowEmptyViewport ? (renderedWidth + viewportEl.clientWidth) / 2 : Math.max(0, (renderedWidth - viewportEl.clientWidth) / 2)) + slackX;
    const maxY = (allowEmptyViewport ? (renderedHeight + viewportEl.clientHeight) / 2 : Math.max(0, (renderedHeight - viewportEl.clientHeight) / 2)) + slackY;
    const coordinateScale = getCoordinateScale();
    return {
      tx: Math.max(-maxX / coordinateScale.x, Math.min(maxX / coordinateScale.x, nextTx)),
      ty: Math.max(-maxY / coordinateScale.y, Math.min(maxY / coordinateScale.y, nextTy))
    };
  }
  function snapAxisToPoints(value, viewportSize, threshold = snapThresholdPx) {
    if (!snapThresholdPx) return value;
    if (!Number.isFinite(value)) return 0;
    const points = [0];
    if (viewportSize > 0) {
      normalizedSnapPoints.forEach((point) => {
        points.push((point - 0.5) * viewportSize);
      });
    }
    let bestValue = value;
    let bestDistance = threshold + 1;
    points.forEach((pointValue) => {
      const distance = Math.abs(value - pointValue);
      if (distance <= threshold && distance < bestDistance) {
        bestDistance = distance;
        bestValue = pointValue;
      }
    });
    return bestValue;
  }
  function snapTranslation(nextTx, nextTy, nextScale = scale.value) {
    const clamped = clampTranslation(nextTx, nextTy, nextScale);
    const viewportEl = viewportRef.value;
    if (!viewportEl) {
      return {
        tx: Math.abs(clamped.tx) <= snapThresholdPx ? 0 : clamped.tx,
        ty: Math.abs(clamped.ty) <= snapThresholdPx ? 0 : clamped.ty
      };
    }
    const coordinateScale = getCoordinateScale();
    const snapped = {
      tx: snapAxisToPoints(clamped.tx, (viewportEl.clientWidth || 0) / coordinateScale.x, snapThresholdPx / coordinateScale.x),
      ty: snapAxisToPoints(clamped.ty, (viewportEl.clientHeight || 0) / coordinateScale.y, snapThresholdPx / coordinateScale.y)
    };
    return clampTranslation(snapped.tx, snapped.ty, nextScale);
  }
  function applySnap(markDirty = true) {
    const snapped = snapTranslation(translateX.value, translateY.value, scale.value);
    const changed = Math.abs(snapped.tx - translateX.value) > 0.01 || Math.abs(snapped.ty - translateY.value) > 0.01;
    translateX.value = snapped.tx;
    translateY.value = snapped.ty;
    if (changed && markDirty) {
      transformDirty.value = true;
    }
    return snapped;
  }
  function fitToViewport(markDirty = false) {
    const viewportEl = viewportRef.value;
    const { width, height } = getMediaSize();
    if (!viewportEl || !width || !height) return;
    if (scaleMode === "relative-fit") {
      minScale.value = Math.max(0.05, Math.min(1, minScaleRatio));
      scale.value = 1;
      translateX.value = 0;
      translateY.value = 0;
      transformDirty.value = markDirty;
      return;
    }
    const widthScale = viewportEl.clientWidth / width;
    const heightScale = viewportEl.clientHeight / height;
    const fitScale = resolveFitMode() === "contain" ? Math.min(widthScale, heightScale) : Math.max(widthScale, heightScale);
    minScale.value = Math.max(0.05, Math.min(fitScale, fitScale * minScaleRatio));
    scale.value = fitScale;
    translateX.value = 0;
    translateY.value = 0;
    transformDirty.value = markDirty;
  }
  function resetTransformState(markDirty = false) {
    scale.value = 1;
    minScale.value = 0.05;
    translateX.value = 0;
    translateY.value = 0;
    transformDirty.value = markDirty;
  }
  function onMediaLoad() {
    nextTick(() => {
      fitToViewport(false);
    });
  }
  function beginDrag(clientX, clientY) {
    isDragging.value = true;
    dragState = {
      x: clientX,
      y: clientY,
      tx: translateX.value,
      ty: translateY.value
    };
  }
  function updateDrag(clientX, clientY) {
    if (!isDragging.value) return;
    const coordinateScale = getCoordinateScale();
    const dx = (clientX - dragState.x) / coordinateScale.x;
    const dy = (clientY - dragState.y) / coordinateScale.y;
    const clamped = clampTranslation(dragState.tx + dx, dragState.ty + dy);
    translateX.value = clamped.tx;
    translateY.value = clamped.ty;
    transformDirty.value = true;
  }
  function endDrag() {
    applySnap(true);
    isDragging.value = false;
  }
  function onPointerDown(event) {
    if (event.pointerType === "touch") return;
    beginDrag(event.clientX, event.clientY);
    event.currentTarget?.setPointerCapture?.(event.pointerId);
  }
  function onPointerMove(event) {
    if (event.pointerType === "touch") return;
    updateDrag(event.clientX, event.clientY);
  }
  function onPointerUp() {
    endDrag();
  }
  function onTouchStart(event) {
    if (event.touches.length >= 2) {
      const [touchA, touchB] = event.touches;
      touchMode = "pinch";
      pinchState = {
        startDistance: getTouchDistance(touchA, touchB),
        startScale: scale.value,
        startCenter: getTouchCenter(touchA, touchB),
        startTx: translateX.value,
        startTy: translateY.value
      };
      isDragging.value = false;
      return;
    }
    if (event.touches.length === 1) {
      touchMode = "drag";
      const [touch] = event.touches;
      beginDrag(touch.clientX, touch.clientY);
    }
  }
  function onTouchMove(event) {
    if (touchMode === "pinch" && event.touches.length >= 2) {
      event.preventDefault();
      const [touchA, touchB] = event.touches;
      const nextDistance = getTouchDistance(touchA, touchB);
      const distanceRatio = nextDistance / Math.max(1, pinchState.startDistance);
      const nextScale = Math.max(
        minScale.value,
        Math.min(maxScale, pinchState.startScale * distanceRatio)
      );
      const nextCenter = getTouchCenter(touchA, touchB);
      const coordinateScale = getCoordinateScale();
      const centerDx = (nextCenter.x - pinchState.startCenter.x) / coordinateScale.x;
      const centerDy = (nextCenter.y - pinchState.startCenter.y) / coordinateScale.y;
      const clamped = clampTranslation(
        pinchState.startTx + centerDx,
        pinchState.startTy + centerDy,
        nextScale
      );
      scale.value = nextScale;
      translateX.value = clamped.tx;
      translateY.value = clamped.ty;
      transformDirty.value = true;
      return;
    }
    if (touchMode === "drag" && event.touches.length === 1) {
      event.preventDefault();
      const [touch] = event.touches;
      updateDrag(touch.clientX, touch.clientY);
    }
  }
  function onTouchEnd(event) {
    if (event.touches.length >= 2) {
      const [touchA, touchB] = event.touches;
      pinchState = {
        startDistance: getTouchDistance(touchA, touchB),
        startScale: scale.value,
        startCenter: getTouchCenter(touchA, touchB),
        startTx: translateX.value,
        startTy: translateY.value
      };
      touchMode = "pinch";
      return;
    }
    if (event.touches.length === 1) {
      const [touch] = event.touches;
      touchMode = "drag";
      beginDrag(touch.clientX, touch.clientY);
      return;
    }
    touchMode = "idle";
    endDrag();
  }
  function captureViewportCanvas(type = "image/jpeg", quality = 0.92) {
    const viewportEl = viewportRef.value;
    const mediaEl = mediaRef.value;
    const { width, height } = getMediaSize();
    if (!viewportEl || !mediaEl || !width || !height) return null;
    const viewportWidth = viewportEl.clientWidth;
    const viewportHeight = viewportEl.clientHeight;
    const renderedSize = getRenderedMediaSize(scale.value);
    const renderedWidth = renderedSize.width || width * scale.value;
    const renderedHeight = renderedSize.height || height * scale.value;
    const sourceScaleX = renderedWidth / width;
    const sourceScaleY = renderedHeight / height;
    const coordinateScale = getCoordinateScale();
    const mediaLeft = viewportWidth / 2 + translateX.value * coordinateScale.x - renderedWidth / 2;
    const mediaTop = viewportHeight / 2 + translateY.value * coordinateScale.y - renderedHeight / 2;
    const srcX = -mediaLeft / sourceScaleX;
    const srcY = -mediaTop / sourceScaleY;
    const srcW = viewportWidth / sourceScaleX;
    const srcH = viewportHeight / sourceScaleY;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(Math.max(1, Math.min(srcW, width)));
    canvas.height = Math.round(Math.max(1, Math.min(srcH, height)));
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    try {
      ctx.drawImage(mediaEl, srcX, srcY, srcW, srcH, 0, 0, canvas.width, canvas.height);
      return {
        canvas,
        toBlob: () => new Promise((resolve) => {
          canvas.toBlob(resolve, type, quality);
        })
      };
    } catch (error) {
      console.warn("captureViewportCanvas failed:", error);
      return null;
    }
  }
  return {
    viewportRef,
    mediaRef,
    scale,
    minScale,
    translateX,
    translateY,
    transformDirty,
    mediaStyle,
    resetTransformState,
    fitToViewport,
    onMediaLoad,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    captureViewportCanvas,
    clampTranslation,
    snapTranslation,
    applySnap
  };
}
const _hoisted_1 = { class: "skin-studio-view" };
const _hoisted_2 = { class: "sandbox-preview-layer" };
const _hoisted_3 = ["src"];
const _hoisted_4 = ["title"];
const _hoisted_5 = { class: "drawer-head" };
const _hoisted_6 = { class: "drawer-scroll" };
const _hoisted_7 = { class: "drawer-section quick-switch-section" };
const _hoisted_8 = { class: "quick-switch-head" };
const _hoisted_9 = { class: "quick-switch-groups" };
const _hoisted_10 = { class: "quick-switch-chips" };
const _hoisted_11 = ["disabled", "onClick"];
const _hoisted_12 = { class: "drawer-section compact-row" };
const _hoisted_13 = { class: "enable-row" };
const _hoisted_14 = { class: "drawer-section compact-row" };
const _hoisted_15 = { class: "drawer-route-text" };
const _hoisted_16 = { class: "drawer-section drawer-save-section" };
const _hoisted_17 = ["disabled"];
const _hoisted_18 = { class: "drawer-section reference-section" };
const _hoisted_19 = { class: "reference-grid" };
const _hoisted_20 = { class: "reference-sample" };
const _hoisted_21 = {
  key: 0,
  class: "drawer-section"
};
const _hoisted_22 = { class: "segmented" };
const _hoisted_23 = ["onClick"];
const _hoisted_24 = { class: "button-grid media-action-grid" };
const _hoisted_25 = ["disabled"];
const _hoisted_26 = ["disabled"];
const _hoisted_27 = {
  key: 1,
  class: "drawer-section"
};
const _hoisted_28 = ["onKeydown"];
const _hoisted_29 = ["src"];
const _hoisted_30 = ["src"];
const _hoisted_31 = { key: 2 };
const _hoisted_32 = { class: "field-grid three" };
const _hoisted_33 = {
  key: 0,
  class: "select-field fit-select-field"
};
const _hoisted_34 = ["value"];
const _hoisted_35 = {
  key: 2,
  class: "drawer-section"
};
const _hoisted_36 = { class: "color-grid" };
const _hoisted_37 = {
  key: 3,
  class: "drawer-section"
};
const _hoisted_38 = { class: "field-grid" };
const _hoisted_39 = {
  key: 4,
  class: "drawer-section"
};
const _hoisted_40 = { class: "field-grid" };
const _hoisted_41 = {
  key: 5,
  class: "drawer-section"
};
const _hoisted_42 = { class: "field-grid" };
const _hoisted_43 = {
  key: 6,
  class: "drawer-section"
};
const _hoisted_44 = { class: "select-field" };
const _hoisted_45 = { class: "drawer-section" };
const _hoisted_46 = { class: "skin-video-editor-panel" };
const _hoisted_47 = { class: "skin-video-editor-head" };
const _hoisted_48 = ["src"];
const _hoisted_49 = { key: 1 };
const SANDBOX_MARK_ATTR = "data-skin-editable";
const SANDBOX_ZONE_ATTR = "data-skin-zone-id";
const SANDBOX_TARGET_ATTR = "data-skin-target-id";
const SANDBOX_HINT_ATTR = "data-skin-edit-hint";
const SANDBOX_LABEL_ATTR = "data-skin-edit-label";
const SANDBOX_ACTIVE_ATTR = "data-skin-editing";
const SANDBOX_PASS_CLICK_ATTR = "data-skin-sandbox-pass-click";
const SANDBOX_STYLE_ID = "skin-studio-editable-style";
const SANDBOX_MESSAGE_TYPE = "ty-skin-sandbox-action";
const _sfc_main = {
  __name: "SkinStudioView",
  setup(__props) {
    const NumberField = defineComponent({
      name: "NumberField",
      props: {
        modelValue: { type: Number, default: 0 },
        label: { type: String, required: true },
        min: { type: Number, default: void 0 },
        max: { type: Number, default: void 0 },
        step: { type: Number, default: 1 },
        unit: { type: String, default: "" }
      },
      emits: ["update:modelValue"],
      setup(props, { emit }) {
        return () => h("label", { class: "number-field" }, [
          h("span", props.label),
          h("div", { class: "number-input-wrap" }, [
            h("input", {
              type: "number",
              value: props.modelValue,
              min: props.min,
              max: props.max,
              step: props.step,
              inputmode: "decimal",
              onInput: (event) => emit("update:modelValue", Number(event.target.value))
            }),
            props.unit ? h("em", props.unit) : null
          ])
        ]);
      }
    });
    const TextField = defineComponent({
      name: "TextField",
      props: {
        modelValue: { type: String, default: "" },
        label: { type: String, required: true },
        placeholder: { type: String, default: "" }
      },
      emits: ["update:modelValue"],
      setup(props, { emit }) {
        return () => h("label", { class: "text-field" }, [
          h("span", props.label),
          h("input", {
            value: props.modelValue,
            placeholder: props.placeholder,
            onInput: (event) => emit("update:modelValue", event.target.value)
          })
        ]);
      }
    });
    const ColorField = defineComponent({
      name: "ColorField",
      props: {
        modelValue: { type: String, default: "#2f8fff" },
        label: { type: String, required: true }
      },
      emits: ["update:modelValue"],
      setup(props, { emit }) {
        return () => h("label", { class: "color-field" }, [
          h("span", props.label),
          h("input", {
            type: "color",
            value: props.modelValue,
            onInput: (event) => emit("update:modelValue", event.target.value)
          })
        ]);
      }
    });
    const router = useRouter();
    const playerStore = usePlayerStore();
    let unregisterSkinStudioBack = null;
    const SANDBOX_PAGE_LABELS = Object.freeze({
      home: "首页",
      search: "搜索页",
      account: "账号页",
      playlist: "歌单页",
      player: "播放页",
      other: "其他页面"
    });
    const GLOBAL_EDIT_ITEMS = Object.freeze([
      {
        id: "global-layout",
        label: "全局",
        targetId: "global_layout",
        hint: "全局页面底色、容器圆角和通用间距。"
      },
      {
        id: "splash-screen",
        label: "开屏",
        targetId: "splash_screen",
        hint: "开屏素材、动画和遮罩。"
      }
    ]);
    const ZONE_GROUP_META = Object.freeze({
      page_layout: "页面布局",
      page_sub_region: "页面子区",
      component_style: "组件样式"
    });
    const EDITABLE_ZONE_PRESETS = Object.freeze({
      account: [
        {
          id: "account-main",
          label: "账号布局",
          targetId: "page_account",
          groupId: "page_layout",
          hint: "账号页 Hero 与卡片间距、圆角。",
          selectors: [
            ".account-view .top-section-container",
            ".account-view .bottom-section-container",
            ".account-view .feature-card"
          ]
        },
        {
          id: "account-profile",
          label: "资料子页",
          targetId: "page_account",
          groupId: "page_sub_region",
          hint: "资料页 Hero、资料卡片与表单容器沿用账号页样式。",
          selectors: [
            ".profile-view .profile-hero",
            ".profile-view .profile-body",
            ".profile-view .section-card"
          ]
        },
        {
          id: "account-listen-stats",
          label: "收听统计",
          targetId: "page_account",
          groupId: "page_sub_region",
          hint: "收听统计卡片、榜单项和排行封面沿用账号页样式。",
          selectors: [
            ".listen-stats-view .stats-summary-card",
            ".listen-stats-view .rank-section",
            ".listen-stats-view .rank-item"
          ]
        },
        {
          id: "account-bili-favorite",
          label: "收藏夹列表",
          targetId: "bili_video_item",
          groupId: "component_style",
          hint: "Bilibili 收藏夹子页的视频列表独立样式组。",
          selectors: [
            ".bili-favorite-view .song-box",
            ".bili-favorite-view .left-box-song",
            ".bili-favorite-view .search-results"
          ]
        }
      ],
      search: [
        {
          id: "search-layout",
          label: "搜索顶部/布局",
          targetId: "page_search",
          groupId: "page_layout",
          hint: "搜索页顶部输入栏、页面背景和结果列表间距共用同一套设置。",
          selectors: [
            ".search-view .search-container",
            ".search-view .search-input",
            ".search-view .search-btn",
            ".search-view .bili-mode-switch",
            ".search-view .search-results",
            ".search-view .search-tips"
          ]
        },
        {
          id: "search-song-item",
          label: "搜索结果项",
          targetId: "search_song_item",
          groupId: "component_style",
          hint: "搜索页普通歌曲与 Bili 视频结果统一控制背景、Cover、文字和间距。",
          selectors: [".search-view .song-box"]
        },
        {
          id: "search-cover",
          label: "搜索 Cover",
          targetId: "playlist_detail_cover",
          groupId: "page_sub_region",
          hint: "搜索结果 Cover 子区变换。",
          selectors: [".search-view .song-box .left-box-song"]
        }
      ],
      home: [
        {
          id: "home-hero",
          label: "顶部播放区",
          targetId: "home_hero_panel",
          groupId: "page_sub_region",
          hint: "首页顶部播放区素材与视窗。",
          selectors: [".home-page-container .lastPlaylist-container .abode-box"]
        },
        {
          id: "home-list",
          label: "首页列表",
          targetId: "page_home",
          groupId: "page_layout",
          hint: "首页列表布局、列表间距与容器圆角。",
          selectors: [".home-page-container .mainPlaylist-container"]
        },
        {
          id: "home-cover",
          label: "歌单 Cover",
          targetId: "home_playlist_cover",
          groupId: "page_sub_region",
          hint: "首页歌单 Cover 子区变换。",
          selectors: [".home-page-container .mainPlaylist-container .Playlist-box .cover-box"]
        }
      ],
      playlist: [
        {
          id: "playlist-layout",
          label: "歌单布局",
          targetId: "page_playlist",
          groupId: "page_layout",
          hint: "歌单页列表高度、间距和圆角。",
          selectors: [".playlist-detail-wrapper .song-list-container"]
        },
        {
          id: "playlist-song-item",
          label: "歌曲项目",
          targetId: "playlist_song_item",
          groupId: "component_style",
          hint: "歌单页歌曲项目独立控制背景、文字、按钮与列表尺寸。",
          selectors: [".playlist-detail-wrapper .song-list-container .song-box"]
        },
        {
          id: "playlist-cover",
          label: "歌曲 Cover",
          targetId: "playlist_detail_cover",
          groupId: "page_sub_region",
          hint: "歌单页歌曲 Cover 子区变换。",
          selectors: [".playlist-detail-wrapper .song-list-container .left-box-song"]
        }
      ],
      player: [
        {
          id: "player-cover",
          label: "播放封面",
          targetId: "playlist_detail_cover",
          groupId: "page_sub_region",
          hint: "播放页封面/视频区域按真实比例取样，可调图片缩放与圆角。",
          selectors: [".player-container .album", ".player-container .album-img"]
        },
        {
          id: "player-controls",
          label: "播放控件",
          targetId: "player_controls",
          groupId: "component_style",
          hint: "播放页按钮、进度条和控制区间距独立样式组。",
          selectors: [".player-container .lower-section .progress", ".player-container .lower-section .controls"]
        }
      ],
      other: []
    });
    const MINI_PLAYER_ZONE_PRESET = Object.freeze({
      id: "mini-player",
      label: "迷你播放器",
      targetId: "mini_player",
      groupId: "component_style",
      hint: "迷你播放器独立样式组，不与歌曲列表样式强绑定。",
      selectors: [".mini-player", ".mini-player .mini-cover", ".mini-player .mini-progress-bar"]
    });
    const DRAWER_ZONE_PRESET = Object.freeze({
      id: "playlist-drawer-song-item",
      label: "抽屉歌曲项",
      targetId: "drawer_song_item",
      groupId: "component_style",
      hint: "抽屉式播放列表独立样式组，不与搜索页或歌单页绑定。",
      selectors: [".playlist-drawer .drawer-list .song-box"]
    });
    const STICKY_TARGET_IDS = /* @__PURE__ */ new Set(["global_layout", "splash_screen", "mini_player", "drawer_song_item"]);
    const targetSchemas = SKIN_TARGET_SCHEMAS;
    const draftConfig = ref(normalizeSkinThemeConfig(loadSkinThemeConfig()));
    const savedSnapshot = ref(serializeSkinThemeConfig(draftConfig.value));
    const selectedTargetId = ref("global_layout");
    const activeZoneId = ref("global-layout");
    const drawerOpen = ref(false);
    const activeHint = ref("点击仿真层高亮提示，进入对应参数编辑。");
    const importInputRef = ref(null);
    const mediaInputRef = ref(null);
    const sandboxFrameRef = ref(null);
    const sandboxRoutePath = ref("/");
    const sandboxRouteStack = ref(["/"]);
    const sandboxBindings = ref([]);
    const activeReference = ref(createEmptyReference());
    const isMediaUploading = ref(false);
    const skinImageEditorVisible = ref(false);
    const skinVideoEditorVisible = ref(false);
    let cleanupSandboxHashListener = null;
    let sandboxBindingSyncTimer = null;
    let sandboxMutationObserver = null;
    let sandboxPathPollTimer = null;
    const mediaTypes = [
      { value: "image", label: "图片" },
      { value: "video", label: "视频" },
      { value: "live2d", label: "Live2D" }
    ];
    const mediaFitOptions = [
      { value: "contain", label: "完整显示（不裁切）" },
      { value: "cover", label: "填满容器（允许裁切）" }
    ];
    const {
      viewportRef: gestureViewportRef,
      mediaRef: gestureMediaRef,
      scale: gestureScale,
      minScale: gestureMinScale,
      translateX: gestureTranslateX,
      translateY: gestureTranslateY,
      mediaStyle: gestureMediaStyle,
      onPointerDown: onGesturePointerDown,
      onPointerMove: onGesturePointerMove,
      onPointerUp: onGesturePointerUp,
      onTouchStart: onGestureTouchStart,
      onTouchMove: onGestureTouchMove,
      onTouchEnd: onGestureTouchEnd,
      snapTranslation: snapGestureTranslation
    } = useGestureViewportEditor({
      maxScale: 8,
      minScaleRatio: 0.28,
      edgeSlackRatio: 0.16,
      edgeSlackPx: 56,
      allowEmptyViewport: true,
      scaleMode: "relative-fit",
      fitMode: () => draftTarget.value?.mediaFit || "contain",
      sourceViewportSize: () => resolveEditorViewportSize(),
      snapThresholdPx: 10,
      snapPoints: [0.25, 1 / 3, 0.5, 2 / 3, 0.75]
    });
    const selectedSchema = computed(() => {
      return targetSchemas.find((schema) => schema.id === selectedTargetId.value) || targetSchemas[0];
    });
    const draftTarget = computed(() => {
      const schema = selectedSchema.value;
      if (!draftConfig.value.targets[schema.id]) {
        draftConfig.value.targets[schema.id] = JSON.parse(JSON.stringify(schema.defaultValue));
      }
      return draftConfig.value.targets[schema.id];
    });
    const sandboxCssVars = computed(() => buildSkinThemeCssVars(draftConfig.value));
    const isDirty = computed(() => serializeSkinThemeConfig(draftConfig.value) !== savedSnapshot.value);
    const currentTrack = computed(() => playerStore.currentTrack || {});
    const currentCover = computed(() => resolveSongCover(currentTrack.value));
    const isGestureTarget = computed(() => supports("transform") && "scale" in draftTarget.value);
    const gestureMediaSrc = computed(() => {
      return draftTarget.value.mediaSrc || activeReference.value.mediaSrc || resolveSchemaPreviewSrc(selectedSchema.value) || currentCover.value;
    });
    const gestureResolvedMediaSrc = useResolvedSkinMediaSrc(gestureMediaSrc);
    const gestureStageStyle = computed(() => {
      const ratio = resolveGestureAspectRatio();
      if (!Number.isFinite(ratio) || ratio <= 0) return {};
      return {
        aspectRatio: String(normalizeEditorAspectRatio(ratio)),
        "--gesture-aspect": String(normalizeEditorAspectRatio(ratio)),
        ...selectedTargetId.value === "splash_screen" ? { background: "#f2f5f8" } : {}
      };
    });
    const gestureToneOverlayStyle = computed(() => ({
      background: `rgba(0, 0, 0, ${Number(draftTarget.value.overlayOpacity || 0)})`
    }));
    const skinMediaEditorAspectRatio = computed(() => {
      const ratio = resolveGestureAspectRatio();
      return Number.isFinite(ratio) && ratio > 0 ? normalizeEditorAspectRatio(ratio) : 1;
    });
    const skinMediaEditorViewportSize = computed(() => resolveEditorViewportSize());
    const skinMediaEditorPanelMaxWidth = computed(() => {
      const ratio = skinMediaEditorAspectRatio.value;
      if (ratio < 0.7) return 520;
      if (ratio > 1.8) return 860;
      return 720;
    });
    const skinMediaEditorOutputSize = computed(() => {
      const ratio = skinMediaEditorAspectRatio.value;
      const width = ratio >= 1 ? 1440 : Math.round(1440 * ratio);
      const height = ratio >= 1 ? Math.round(width / ratio) : 1440;
      return {
        width: Math.max(360, width),
        height: Math.max(360, height)
      };
    });
    const skinImageEditorSrc = computed(() => draftTarget.value?.mediaType === "image" ? gestureResolvedMediaSrc.value : "");
    const skinImageEditorTransform = computed(() => {
      const scale = Number(draftTarget.value?.scale || 1);
      const tx = Math.round(Number(draftTarget.value?.translateX || 0));
      const ty = Math.round(Number(draftTarget.value?.translateY || 0));
      return [scale, 0, 0, scale, tx, ty];
    });
    const coverSizeLimits = computed(() => ({
      min: 0,
      max: resolveCoverSizeMax()
    }));
    function applyDraftGestureTransform({
      scale = Number(draftTarget.value?.scale || 1),
      translateX = Number(draftTarget.value?.translateX || 0),
      translateY = Number(draftTarget.value?.translateY || 0),
      snap = true
    } = {}) {
      if (!isGestureTarget.value) return;
      const nextScale = Math.max(gestureMinScale.value || 0.05, Math.min(8, Number(scale || 1)));
      const snapped = snap ? snapGestureTranslation(
        Number(translateX || 0),
        Number(translateY || 0),
        nextScale
      ) : { tx: Number(translateX || 0), ty: Number(translateY || 0) };
      const tx = Math.round(Number(snapped.tx || 0));
      const ty = Math.round(Number(snapped.ty || 0));
      draftTarget.value.scale = nextScale;
      draftTarget.value.translateX = tx;
      draftTarget.value.translateY = ty;
      gestureScale.value = nextScale;
      gestureTranslateX.value = tx;
      gestureTranslateY.value = ty;
    }
    const sandboxEntryUrl = computed(() => {
      if (typeof window === "undefined") return "#/";
      return `${window.location.href.split("#")[0]}#/?skinSandbox=1`;
    });
    const sandboxPageKey = computed(() => resolveSandboxPageKey(sandboxRoutePath.value));
    const sandboxPageLabel = computed(() => SANDBOX_PAGE_LABELS[sandboxPageKey.value] || SANDBOX_PAGE_LABELS.other);
    const quickSwitchGroups = computed(() => {
      const groups = [
        {
          id: "global",
          title: "全局与启动",
          items: GLOBAL_EDIT_ITEMS.map((item) => ({
            ...item,
            disabled: false
          }))
        }
      ];
      const pageGroups = /* @__PURE__ */ new Map();
      for (const zone of sandboxBindings.value) {
        const groupTitle = ZONE_GROUP_META[zone.groupId] || "页面控件";
        if (!pageGroups.has(zone.groupId)) {
          pageGroups.set(zone.groupId, {
            id: zone.groupId,
            title: groupTitle,
            items: []
          });
        }
        pageGroups.get(zone.groupId).items.push({
          id: zone.id,
          label: zone.label,
          targetId: zone.targetId,
          hint: zone.hint,
          disabled: !zone.matchCount
        });
      }
      return groups.concat(Array.from(pageGroups.values()));
    });
    const scalePercent = computed({
      get: () => Math.round(Number(draftTarget.value.scale || 1) * 100),
      set: (value) => {
        const nextScale = Math.max(gestureMinScale.value || 0.05, Number(value || 100) / 100);
        applyDraftGestureTransform({
          scale: nextScale,
          translateX: draftTarget.value.translateX,
          translateY: draftTarget.value.translateY
        });
      }
    });
    const translateXField = computed({
      get: () => Math.round(Number(draftTarget.value.translateX || 0)),
      set: (value) => {
        applyDraftGestureTransform({
          translateX: value,
          translateY: draftTarget.value.translateY
        });
      }
    });
    const translateYField = computed({
      get: () => Math.round(Number(draftTarget.value.translateY || 0)),
      set: (value) => {
        applyDraftGestureTransform({
          translateX: draftTarget.value.translateX,
          translateY: value
        });
      }
    });
    function resolveSandboxPageKey(path = "/") {
      const normalized = `${path || "/"}`.trim().replace(/\/+$/, "") || "/";
      if (normalized === "/" || normalized === "/home") return "home";
      if (normalized === "/playlist" || normalized.startsWith("/playlist/")) return "playlist";
      if (normalized === "/search") return "search";
      if (normalized === "/music-control") return "player";
      if (normalized === "/account" || normalized.startsWith("/account/") || ["/profile", "/listen-stats", "/bili-favorite"].includes(normalized)) return "account";
      return "other";
    }
    function parseSandboxPath(rawHash = "") {
      const hash = `${rawHash || ""}`.trim();
      if (!hash) return "/";
      const hashBody = hash.startsWith("#") ? hash.slice(1) : hash;
      if (!hashBody) return "/";
      const [pathPart] = hashBody.split("?");
      if (!pathPart) return "/";
      return pathPart.startsWith("/") ? pathPart : `/${pathPart}`;
    }
    function parseAspectRatioText(rawAspect = "") {
      const text = `${rawAspect || ""}`.trim();
      if (!text) return 0;
      const slashParts = text.split("/").map((part) => Number(part.trim()));
      if (slashParts.length === 2 && slashParts.every((value) => Number.isFinite(value) && value > 0)) {
        return slashParts[0] / slashParts[1];
      }
      const numeric = Number(text);
      return Number.isFinite(numeric) && numeric > 0 ? numeric : 0;
    }
    function getSandboxViewportAspectRatio() {
      const frameWindow = sandboxFrameRef.value?.contentWindow;
      if (!frameWindow) return 0;
      const width = Number(frameWindow.innerWidth || 0);
      const height = Number(frameWindow.innerHeight || 0);
      if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return 0;
      return width / height;
    }
    function getSandboxViewportSize() {
      const frameWindow = sandboxFrameRef.value?.contentWindow;
      if (!frameWindow) return { width: 0, height: 0 };
      const width = Number(frameWindow.innerWidth || 0);
      const height = Number(frameWindow.innerHeight || 0);
      if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
        return { width: 0, height: 0 };
      }
      return {
        width: Math.round(width),
        height: Math.round(height)
      };
    }
    function normalizeEditorAspectRatio(ratio) {
      const value = Number(ratio);
      if (!Number.isFinite(value) || value <= 0) return 1;
      return Math.max(0.28, Math.min(4.2, value));
    }
    function resolveEditorViewportSize() {
      if (selectedTargetId.value === "splash_screen" || selectedTargetId.value === "global_layout") {
        const viewportSize = getSandboxViewportSize();
        if (viewportSize.width > 0 && viewportSize.height > 0) return viewportSize;
      }
      const width = Number(activeReference.value.widthPx || 0);
      const height = Number(activeReference.value.heightPx || 0);
      if (Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
        return {
          width: Math.round(width),
          height: Math.round(height)
        };
      }
      const ratio = skinMediaEditorAspectRatio.value || 1;
      const fallbackWidth = ratio >= 1 ? 720 : Math.round(720 * ratio);
      const fallbackHeight = ratio >= 1 ? Math.round(720 / ratio) : 720;
      return {
        width: Math.max(1, fallbackWidth),
        height: Math.max(1, fallbackHeight)
      };
    }
    function resolveGestureAspectRatio() {
      if (selectedTargetId.value === "splash_screen" || selectedTargetId.value === "global_layout") {
        return getSandboxViewportAspectRatio() || parseAspectRatioText(selectedSchema.value?.previewAspect) || 9 / 16;
      }
      const referenceRatio = Number(activeReference.value.aspectRatio || 0);
      if (Number.isFinite(referenceRatio) && referenceRatio > 0) {
        return referenceRatio;
      }
      return parseAspectRatioText(selectedSchema.value?.previewAspect);
    }
    function resolveCoverSizeMax() {
      const fallbackMax = 160;
      const width = Number(activeReference.value.widthPx || 0);
      const height = Number(activeReference.value.heightPx || 0);
      const minByReference = Math.min(
        width > 0 ? width : Number.POSITIVE_INFINITY,
        height > 0 ? height : Number.POSITIVE_INFINITY
      );
      const referenceMax = Number.isFinite(minByReference) && minByReference > 0 ? Math.round(minByReference) : fallbackMax;
      const targetHeight = Math.round(Number(draftTarget.value.itemHeight || draftTarget.value.songItemHeight || 0));
      const dynamicMax = targetHeight > 0 ? Math.max(referenceMax, targetHeight) : referenceMax;
      return Math.max(0, dynamicMax);
    }
    function createEmptyReference() {
      return {
        id: "",
        label: "",
        matchCount: 0,
        sampleText: "",
        sizeText: "",
        radiusText: "",
        mediaSrc: "",
        aspectRatio: 0,
        widthPx: 0,
        heightPx: 0,
        mediaFitText: ""
      };
    }
    function resolveSchemaPreviewSrc(schema) {
      if (!schema?.id) return "";
      const previewSrc = `${schema.previewSrc || ""}`.trim();
      if (previewSrc && !previewSrc.startsWith("data:image/svg+xml")) return previewSrc;
      return `/api/cover/random?seed=${encodeURIComponent(`skin-${schema.id}`)}`;
    }
    function getCurrentZonePresets() {
      return [
        ...EDITABLE_ZONE_PRESETS[sandboxPageKey.value] || [],
        MINI_PLAYER_ZONE_PRESET,
        DRAWER_ZONE_PRESET
      ];
    }
    function clearSandboxBindingSyncTimer() {
      if (sandboxBindingSyncTimer) {
        window.clearTimeout(sandboxBindingSyncTimer);
        sandboxBindingSyncTimer = null;
      }
    }
    function clearSandboxMutationObserver() {
      if (sandboxMutationObserver) {
        sandboxMutationObserver.disconnect();
        sandboxMutationObserver = null;
      }
    }
    function bindSandboxMutationObserver() {
      clearSandboxMutationObserver();
      if (typeof MutationObserver === "undefined") return;
      const frameDoc = sandboxFrameRef.value?.contentDocument;
      if (!frameDoc?.body) return;
      sandboxMutationObserver = new MutationObserver((records) => {
        if (!records?.length) return;
        scheduleSandboxBindingSync(140);
      });
      sandboxMutationObserver.observe(frameDoc.body, {
        childList: true,
        subtree: true
      });
    }
    function scheduleSandboxBindingSync(delay = 120) {
      if (typeof window === "undefined") return;
      clearSandboxBindingSyncTimer();
      sandboxBindingSyncTimer = window.setTimeout(() => {
        syncSandboxThemeToFrame();
        syncSandboxEditableBindings();
      }, delay);
    }
    function ensureSandboxHighlightStyle(frameDoc) {
      if (!frameDoc || frameDoc.getElementById(SANDBOX_STYLE_ID)) return;
      const styleEl = frameDoc.createElement("style");
      styleEl.id = SANDBOX_STYLE_ID;
      styleEl.textContent = `
    :root[data-skin-editor-mode="on"] [${SANDBOX_MARK_ATTR}="1"] {
      position: relative;
      outline: 3px solid rgba(35, 188, 255, 0.92);
      outline-offset: -3px;
      box-shadow:
        0 0 0 2px rgba(7, 21, 36, 0.2),
        0 0 24px rgba(35, 188, 255, 0.36),
        inset 0 0 0 1px rgba(255, 255, 255, 0.38);
      cursor: pointer;
      transition: outline-color .18s ease, box-shadow .18s ease, filter .18s ease;
    }
    :root[data-skin-editor-mode="on"] [${SANDBOX_MARK_ATTR}="1"]::after {
      content: attr(${SANDBOX_LABEL_ATTR});
      position: absolute;
      right: 8px;
      top: 8px;
      z-index: 20;
      max-width: min(48%, 176px);
      padding: 2px 7px;
      border-radius: 999px;
      background: rgba(8, 20, 34, 0.74);
      color: #ffffff;
      font: 600 10px/1.15 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      letter-spacing: 0.005em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      pointer-events: none;
      opacity: 0;
      transform: translateY(-2px) scale(0.96);
      transition: opacity .16s ease, transform .16s ease, background-color .16s ease, color .16s ease;
      box-shadow: 0 3px 12px rgba(5, 15, 28, 0.2);
    }
    :root[data-skin-editor-mode="on"] [${SANDBOX_MARK_ATTR}="1"]:hover::after,
    :root[data-skin-editor-mode="on"] [${SANDBOX_MARK_ATTR}="1"][${SANDBOX_ACTIVE_ATTR}="1"]::after {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    :root[data-skin-editor-mode="on"] [${SANDBOX_MARK_ATTR}="1"] [${SANDBOX_MARK_ATTR}="1"] {
      outline-style: dashed;
      outline-width: 2px;
      outline-offset: -2px;
    }
    :root[data-skin-editor-mode="on"] [${SANDBOX_MARK_ATTR}="1"] [${SANDBOX_MARK_ATTR}="1"]::after {
      top: auto;
      bottom: 6px;
      right: 6px;
      max-width: min(62%, 150px);
      transform: none;
    }
    :root[data-skin-editor-mode="on"] [${SANDBOX_MARK_ATTR}="1"][${SANDBOX_ACTIVE_ATTR}="1"] {
      outline-color: rgba(255, 210, 91, 0.98);
      box-shadow:
        0 0 0 3px rgba(255, 210, 91, 0.32),
        0 0 30px rgba(255, 210, 91, 0.38),
        inset 0 0 0 1px rgba(255, 255, 255, 0.38);
      filter: brightness(1.02);
    }
    :root[data-skin-editor-mode="on"] [${SANDBOX_MARK_ATTR}="1"][${SANDBOX_ACTIVE_ATTR}="1"]::after {
      content: attr(${SANDBOX_LABEL_ATTR}) " · 编辑中";
      background: rgba(40, 28, 6, 0.94);
      color: #ffe7a3;
    }
  `;
      frameDoc.head?.appendChild(styleEl);
    }
    function clearSandboxEditableMarks(frameDoc) {
      if (!frameDoc) return;
      const markedNodes = frameDoc.querySelectorAll(`[${SANDBOX_MARK_ATTR}="1"]`);
      markedNodes.forEach((node) => {
        node.removeAttribute(SANDBOX_MARK_ATTR);
        node.removeAttribute(SANDBOX_ZONE_ATTR);
        node.removeAttribute(SANDBOX_TARGET_ATTR);
        node.removeAttribute(SANDBOX_HINT_ATTR);
        node.removeAttribute(SANDBOX_LABEL_ATTR);
        node.removeAttribute(SANDBOX_ACTIVE_ATTR);
        node.removeAttribute("title");
        node.removeEventListener("click", onSandboxEditableClick, true);
      });
    }
    function uniqueElementsBySelectors(frameDoc, selectors = []) {
      const seen = /* @__PURE__ */ new Set();
      const result = [];
      selectors.forEach((selector) => {
        if (!selector) return;
        let nodes = [];
        try {
          nodes = Array.from(frameDoc.querySelectorAll(selector));
        } catch {
          nodes = [];
        }
        nodes.forEach((node) => {
          if (!node || node.nodeType !== 1 || seen.has(node)) return;
          seen.add(node);
          result.push(node);
        });
      });
      return result;
    }
    function buildZoneReference(zone, node) {
      if (!node) {
        return {
          ...zone,
          matchCount: 0,
          sampleText: "",
          sizeText: "",
          radiusText: "",
          mediaSrc: "",
          aspectRatio: 0,
          widthPx: 0,
          heightPx: 0,
          mediaFitText: ""
        };
      }
      const frameWindow = sandboxFrameRef.value?.contentWindow;
      const styles = frameWindow?.getComputedStyle ? frameWindow.getComputedStyle(node) : null;
      const rect = node.getBoundingClientRect();
      const rawText = `${node.textContent || ""}`.replace(/\s+/g, " ").trim();
      const mediaNode = node.matches?.("img, video") ? node : node.querySelector?.("img, video");
      const mediaStyles = mediaNode && frameWindow?.getComputedStyle ? frameWindow.getComputedStyle(mediaNode) : null;
      const mediaSrc = mediaNode?.currentSrc || mediaNode?.src || "";
      const width = Math.max(0, Math.round(rect.width));
      const height = Math.max(0, Math.round(rect.height));
      return {
        ...zone,
        matchCount: 1,
        sampleText: rawText ? rawText.slice(0, 60) : "当前控件无可读文本，可直接观察实际布局。",
        sizeText: `${width} x ${height} px`,
        radiusText: styles?.borderRadius || "0px",
        mediaSrc,
        aspectRatio: width > 0 && height > 0 ? width / height : 0,
        widthPx: width,
        heightPx: height,
        mediaFitText: mediaStyles?.objectFit ? `${mediaStyles.objectFit}${mediaStyles.objectPosition ? ` / ${mediaStyles.objectPosition}` : ""}` : ""
      };
    }
    function ensureSelectedTargetForPage(bindings) {
      const available = bindings.filter((zone) => zone.matchCount > 0);
      if (!available.length) {
        activeZoneId.value = selectedTargetId.value;
        return;
      }
      const keep = available.find((zone) => zone.id === activeZoneId.value || zone.targetId === selectedTargetId.value);
      if (keep) {
        activeZoneId.value = keep.id;
        activeHint.value = keep.hint;
        return;
      }
      if (selectedTargetId.value === "global_layout" || selectedTargetId.value === "splash_screen") {
        activeZoneId.value = selectedTargetId.value === "global_layout" ? "global-layout" : "splash-screen";
        return;
      }
      const selectedGroup = selectedSchema.value?.group || "";
      const sibling = available.find((zone) => {
        if (zone.groupId !== "component_style") return false;
        const schema = targetSchemas.find((item) => item.id === zone.targetId);
        return schema?.group === selectedGroup;
      });
      if (sibling) {
        selectedTargetId.value = sibling.targetId;
        activeZoneId.value = sibling.id;
        activeHint.value = sibling.hint;
        return;
      }
      const first = available[0];
      selectedTargetId.value = first.targetId;
      activeZoneId.value = first.id;
      activeHint.value = first.hint;
    }
    function applyActiveZoneMark() {
      const frameDoc = sandboxFrameRef.value?.contentDocument;
      if (!frameDoc) return;
      const editableNodes = frameDoc.querySelectorAll(`[${SANDBOX_MARK_ATTR}="1"]`);
      editableNodes.forEach((node) => {
        const zoneId = node.getAttribute(SANDBOX_ZONE_ATTR);
        const active = zoneId === activeZoneId.value;
        if (active) {
          node.setAttribute(SANDBOX_ACTIVE_ATTR, "1");
        } else {
          node.removeAttribute(SANDBOX_ACTIVE_ATTR);
        }
      });
    }
    function updateActiveReference(bindings = sandboxBindings.value) {
      const selected = bindings.find((zone) => zone.id === activeZoneId.value) || bindings.find((zone) => zone.targetId === selectedTargetId.value);
      if (!selected) {
        activeReference.value = createEmptyReference();
        return;
      }
      activeReference.value = {
        id: selected.id,
        label: selected.label,
        matchCount: selected.matchCount,
        sampleText: selected.sampleText,
        sizeText: selected.sizeText,
        radiusText: selected.radiusText,
        mediaSrc: selected.mediaSrc || "",
        aspectRatio: selected.aspectRatio || 0,
        widthPx: selected.widthPx || 0,
        heightPx: selected.heightPx || 0,
        mediaFitText: selected.mediaFitText || ""
      };
    }
    function syncSandboxEditableBindings() {
      const frameDoc = sandboxFrameRef.value?.contentDocument;
      if (!frameDoc) return;
      ensureSandboxHighlightStyle(frameDoc);
      frameDoc.documentElement.setAttribute("data-skin-editor-mode", "on");
      clearSandboxEditableMarks(frameDoc);
      const nextBindings = [];
      const presets = getCurrentZonePresets();
      presets.forEach((zone) => {
        const nodes = uniqueElementsBySelectors(frameDoc, zone.selectors);
        const reference = buildZoneReference(zone, nodes[0] || null);
        reference.matchCount = nodes.length;
        nextBindings.push(reference);
        nodes.forEach((node) => {
          node.setAttribute(SANDBOX_MARK_ATTR, "1");
          node.setAttribute(SANDBOX_ZONE_ATTR, zone.id);
          node.setAttribute(SANDBOX_TARGET_ATTR, zone.targetId);
          node.setAttribute(SANDBOX_HINT_ATTR, zone.hint);
          node.setAttribute(SANDBOX_LABEL_ATTR, zone.label);
          node.setAttribute("title", `${zone.label} · 点击编辑`);
          node.addEventListener("click", onSandboxEditableClick, { capture: true });
        });
      });
      sandboxBindings.value = nextBindings;
      ensureSelectedTargetForPage(nextBindings);
      applyActiveZoneMark();
      updateActiveReference(nextBindings);
    }
    function clearSandboxHashListener() {
      if (typeof cleanupSandboxHashListener === "function") {
        cleanupSandboxHashListener();
        cleanupSandboxHashListener = null;
      }
    }
    function syncSandboxPathFromFrame() {
      const frameWindow = sandboxFrameRef.value?.contentWindow;
      if (!frameWindow) return;
      let nextPath = "/";
      try {
        nextPath = parseSandboxPath(frameWindow.location.hash);
      } catch {
        nextPath = "/";
      }
      recordSandboxPath(nextPath);
    }
    function getCurrentSandboxPath() {
      const frameWindow = sandboxFrameRef.value?.contentWindow;
      if (!frameWindow) return sandboxRoutePath.value || "/";
      try {
        return parseSandboxPath(frameWindow.location.hash);
      } catch {
        return sandboxRoutePath.value || "/";
      }
    }
    function recordSandboxPath(path = "/") {
      const normalizedPath = `${path || "/"}`.trim() || "/";
      sandboxRoutePath.value = normalizedPath;
      const stack = sandboxRouteStack.value;
      const current = stack[stack.length - 1];
      if (current === normalizedPath) return;
      stack.push(normalizedPath);
      if (stack.length > 60) {
        sandboxRouteStack.value = stack.slice(-60);
      }
    }
    function replaceSandboxPath(path = "/") {
      const normalizedPath = `${path || "/"}`.trim() || "/";
      sandboxRoutePath.value = normalizedPath;
      sandboxRouteStack.value = [normalizedPath];
    }
    function clearSandboxPathPolling() {
      if (sandboxPathPollTimer) {
        window.clearInterval(sandboxPathPollTimer);
        sandboxPathPollTimer = null;
      }
    }
    function startSandboxPathPolling() {
      clearSandboxPathPolling();
      const frameWindow = sandboxFrameRef.value?.contentWindow;
      if (!frameWindow) return;
      let lastPath = sandboxRoutePath.value;
      sandboxPathPollTimer = window.setInterval(() => {
        let nextPath = "/";
        try {
          nextPath = parseSandboxPath(frameWindow.location.hash);
        } catch {
          nextPath = "/";
        }
        if (nextPath === lastPath) return;
        lastPath = nextPath;
        recordSandboxPath(nextPath);
        scheduleSandboxBindingSync(160);
      }, 260);
    }
    function bindSandboxHashListener() {
      clearSandboxHashListener();
      const frameWindow = sandboxFrameRef.value?.contentWindow;
      if (!frameWindow) return;
      const onHashChange = () => {
        syncSandboxPathFromFrame();
        scheduleSandboxBindingSync(180);
      };
      frameWindow.addEventListener("hashchange", onHashChange);
      cleanupSandboxHashListener = () => {
        frameWindow.removeEventListener("hashchange", onHashChange);
      };
      syncSandboxPathFromFrame();
    }
    function syncSandboxThemeToFrame() {
      const frameDoc = sandboxFrameRef.value?.contentDocument;
      const frameWindow = sandboxFrameRef.value?.contentWindow;
      if (!frameDoc) return;
      const frameRoot = frameDoc.documentElement;
      const frameStyle = frameRoot.style;
      const sandboxDraftConfig = normalizeSkinThemeConfig(draftConfig.value);
      if (frameWindow) {
        frameWindow.__TY_SKIN_SANDBOX_DRAFT_CONFIG = sandboxDraftConfig;
        try {
          frameWindow.dispatchEvent(new frameWindow.CustomEvent(SKIN_SANDBOX_DRAFT_EVENT, { detail: sandboxDraftConfig }));
        } catch {
          frameWindow.dispatchEvent(new CustomEvent(SKIN_SANDBOX_DRAFT_EVENT, { detail: sandboxDraftConfig }));
        }
      }
      Object.entries(buildSkinThemeCssVars(sandboxDraftConfig)).forEach(([name, value]) => {
        frameStyle.setProperty(name, value);
      });
      void applyResolvedSkinThemeMediaCssVars(sandboxDraftConfig, frameStyle);
      const songTarget = sandboxDraftConfig.targets?.song_item || {};
      frameRoot.classList.toggle("ty-skin-song-item-on", Boolean(songTarget.enabled));
      frameRoot.classList.toggle(
        "ty-skin-song-live2d-meta-on",
        Boolean(songTarget.enabled && songTarget.mediaType === "live2d" && songTarget.live2dModelUrl)
      );
      frameRoot.dataset.tySkinVersion = String(draftConfig.value.version || 3);
    }
    function shouldBypassSandboxEditableClick(event) {
      const rawTarget = event?.target;
      const targetNode = rawTarget?.nodeType === 1 ? rawTarget : rawTarget?.parentElement;
      if (!targetNode?.closest) return false;
      return Boolean(targetNode.closest([
        `[${SANDBOX_PASS_CLICK_ATTR}="1"]`,
        "input",
        "textarea",
        "select",
        "option",
        "button",
        "a[href]",
        '[contenteditable="true"]',
        '[role="button"]'
      ].join(", ")));
    }
    function onSandboxEditableClick(event) {
      if (shouldBypassSandboxEditableClick(event)) return;
      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === "function") {
        event.stopImmediatePropagation();
      }
      const node = event.target?.closest?.(`[${SANDBOX_MARK_ATTR}="1"]`);
      if (!node) return;
      const targetId = node.getAttribute(SANDBOX_TARGET_ATTR) || "";
      const zoneId = node.getAttribute(SANDBOX_ZONE_ATTR) || "";
      const hint = node.getAttribute(SANDBOX_HINT_ATTR) || "";
      if (!targetId) return;
      openTarget(targetId, hint, zoneId);
    }
    function supports(capability) {
      return selectedSchema.value.capabilities?.includes(capability);
    }
    function resolveSongCover(song) {
      return getSongCoverSrc(song) || processCoverUrl(song) || `/api/cover/random?seed=${encodeURIComponent(song?.hash_id || song?.id || "skin-song")}`;
    }
    function handleSandboxFrameLoad() {
      bindSandboxHashListener();
      startSandboxPathPolling();
      bindSandboxMutationObserver();
      scheduleSandboxBindingSync(180);
    }
    function openTarget(targetId, hint = "", zoneId = "") {
      selectedTargetId.value = targetId;
      activeZoneId.value = zoneId || targetId;
      activeHint.value = hint || "点击仿真层高亮提示，进入对应参数编辑。";
      drawerOpen.value = true;
      nextTick(() => {
        syncGestureFromDraft();
        applyActiveZoneMark();
        updateActiveReference();
      });
    }
    function openQuickSwitch(item) {
      if (!item || item.disabled) return;
      openTarget(item.targetId, item.hint, item.id);
    }
    function openSandboxFloatingEditor() {
      openSandboxDrawerFromFrame();
    }
    function openSandboxDrawerFromFrame(payload = {}) {
      const payloadTargetId = `${payload?.targetId || ""}`.trim();
      const payloadZoneId = `${payload?.zoneId || ""}`.trim();
      if (payloadTargetId) {
        const matched = sandboxBindings.value.find((zone) => {
          return zone.targetId === payloadTargetId && (!payloadZoneId || zone.id === payloadZoneId);
        });
        openTarget(payloadTargetId, matched?.hint || activeHint.value, matched?.id || payloadZoneId || payloadTargetId);
        return;
      }
      const current = sandboxBindings.value.find((zone) => zone.id === activeZoneId.value && zone.matchCount > 0) || sandboxBindings.value.find((zone) => zone.targetId === selectedTargetId.value && zone.matchCount > 0) || sandboxBindings.value.find((zone) => zone.matchCount > 0);
      if (current) {
        openTarget(current.targetId, current.hint, current.id);
        return;
      }
      openTarget(selectedTargetId.value || "global_layout", activeHint.value, activeZoneId.value || "global-layout");
    }
    function isQuickItemActive(item) {
      if (!item) return false;
      if (item.id === activeZoneId.value) return true;
      if (item.targetId === selectedTargetId.value && (item.id === "global-layout" || item.id === "splash-screen")) {
        return true;
      }
      return false;
    }
    function closeDrawer() {
      drawerOpen.value = false;
    }
    function resetSandboxToHome() {
      const frameWindow = sandboxFrameRef.value?.contentWindow;
      if (!frameWindow) return;
      frameWindow.location.hash = "#/?skinSandbox=1";
      replaceSandboxPath("/");
      scheduleSandboxBindingSync(220);
    }
    function performSandboxBack() {
      const currentSandboxPath = getCurrentSandboxPath();
      recordSandboxPath(currentSandboxPath);
      if (sandboxRouteStack.value.length <= 1) {
        router.back();
        return;
      }
      const frameWindow = sandboxFrameRef.value?.contentWindow;
      if (!frameWindow) return;
      const stack = [...sandboxRouteStack.value];
      stack.pop();
      const previousPath = stack[stack.length - 1] || "/";
      sandboxRouteStack.value = stack;
      sandboxRoutePath.value = previousPath;
      const queryPrefix = previousPath.includes("?") ? "&" : "?";
      const targetHash = previousPath.includes("skinSandbox=1") ? `#${previousPath}` : `#${previousPath}${queryPrefix}skinSandbox=1`;
      frameWindow.location.hash = targetHash;
      scheduleSandboxBindingSync(220);
    }
    function handleSandboxMessage(event) {
      const frameWindow = sandboxFrameRef.value?.contentWindow;
      if (!frameWindow || event.source !== frameWindow) return;
      const currentOrigin = window.location.origin;
      const hasOpaqueLocalOrigin = !currentOrigin || currentOrigin === "null" || currentOrigin === "file://";
      if (!hasOpaqueLocalOrigin && event.origin !== currentOrigin) return;
      const data = event.data || {};
      if (data.type !== SANDBOX_MESSAGE_TYPE) return;
      if (data.action === "open-editor") {
        openSandboxDrawerFromFrame(data.payload || {});
        return;
      }
      if (data.action === "save") {
        saveAll();
        return;
      }
      if (data.action === "exit-sandbox") {
        performSandboxBack();
      }
    }
    function triggerImport() {
      importInputRef.value?.click();
    }
    function triggerMediaUpload() {
      mediaInputRef.value?.click();
    }
    function openSkinMediaEditor() {
      if (!draftTarget.value?.mediaSrc || !gestureResolvedMediaSrc.value) {
        triggerMediaUpload();
        return;
      }
      if (draftTarget.value.mediaType === "video") {
        skinVideoEditorVisible.value = true;
        nextTick(() => {
          syncGestureFromDraft();
        });
        return;
      }
      if (draftTarget.value.mediaType === "image") {
        skinImageEditorVisible.value = true;
      }
    }
    function closeSkinImageEditor() {
      skinImageEditorVisible.value = false;
    }
    function closeSkinVideoEditor() {
      skinVideoEditorVisible.value = false;
    }
    function handleSkinImageTransformConfirm(payload) {
      const transform = Array.isArray(payload?.transform) ? payload.transform : null;
      if (!transform) {
        closeSkinImageEditor();
        return;
      }
      const [a = 1, b = 0, , d = 1, e = 0, f = 0] = transform;
      if (payload.mediaFit) draftTarget.value.mediaFit = payload.mediaFit;
      const nextScale = Math.max(0.05, Math.min(8, Math.sqrt(Number(a) ** 2 + Number(b) ** 2) || Number(d) || 1));
      applyDraftGestureTransform({
        scale: nextScale,
        translateX: Number(e || 0),
        translateY: Number(f || 0),
        snap: false
      });
      closeSkinImageEditor();
      nextTick(syncSandboxThemeToFrame);
    }
    function applySavedMediaAsset(savedAsset) {
      draftTarget.value.mediaSrc = savedAsset.mediaSrc;
      draftTarget.value.mediaType = savedAsset.mediaType;
      draftTarget.value.mediaAsset = savedAsset.mediaAsset;
      const defaultFit = selectedTargetId.value === "global_layout" ? "cover" : "contain";
      if ("mediaFit" in draftTarget.value) draftTarget.value.mediaFit = defaultFit;
      if ("mediaSize" in draftTarget.value) draftTarget.value.mediaSize = defaultFit;
      if ("scale" in draftTarget.value) draftTarget.value.scale = 1;
      if ("translateX" in draftTarget.value) draftTarget.value.translateX = 0;
      if ("translateY" in draftTarget.value) draftTarget.value.translateY = 0;
      draftTarget.value.enabled = true;
      if (selectedTargetId.value === "splash_screen") draftTarget.value.overlayOpacity = 0;
      nextTick(() => {
        syncGestureFromDraft();
        syncSandboxThemeToFrame();
      });
    }
    function resetMediaFitTransform() {
      applyDraftGestureTransform({ scale: 1, translateX: 0, translateY: 0 });
    }
    async function handleMediaFileSelect(event) {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;
      isMediaUploading.value = true;
      try {
        const savedAsset = await saveSkinMediaFile(file);
        applySavedMediaAsset(savedAsset);
        showGlobalToast("素材已保存，可在视窗内继续缩放和拖动");
      } catch (error) {
        showGlobalToast(`素材保存失败: ${error?.message || "无法写入本地素材"}`, { type: "error" });
      } finally {
        isMediaUploading.value = false;
      }
    }
    function clearMediaAsset() {
      if (!("mediaSrc" in draftTarget.value)) return;
      skinImageEditorVisible.value = false;
      skinVideoEditorVisible.value = false;
      draftTarget.value.mediaSrc = "";
      delete draftTarget.value.mediaAsset;
      if ("live2dModelUrl" in draftTarget.value) draftTarget.value.live2dModelUrl = "";
      if ("mediaType" in draftTarget.value) draftTarget.value.mediaType = "image";
      const defaultFit = selectedTargetId.value === "global_layout" ? "cover" : "contain";
      if ("mediaFit" in draftTarget.value) draftTarget.value.mediaFit = defaultFit;
      if ("mediaSize" in draftTarget.value) draftTarget.value.mediaSize = defaultFit;
      if ("scale" in draftTarget.value) draftTarget.value.scale = 1;
      if ("translateX" in draftTarget.value) draftTarget.value.translateX = 0;
      if ("translateY" in draftTarget.value) draftTarget.value.translateY = 0;
      nextTick(syncGestureFromDraft);
      nextTick(syncSandboxThemeToFrame);
      showGlobalToast("当前目标素材已清空", { type: "info" });
    }
    function handleImportFile(event) {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        try {
          const parsed = JSON.parse(String(loadEvent.target?.result || "{}"));
          draftConfig.value = normalizeSkinThemeConfig(parsed);
          openTarget("global_layout", "已导入配置，可继续在仿真层检查。", "global-layout");
          showGlobalToast("皮肤配置已导入，保存后生效");
        } catch (error) {
          showGlobalToast(`导入失败: ${error.message}`, { type: "error" });
        }
      };
      reader.readAsText(file);
    }
    const isSavingSkin = ref(false);
    async function saveAll() {
      if (isSavingSkin.value) return;
      isSavingSkin.value = true;
      try {
        const saved = saveSkinThemeConfig(draftConfig.value);
        applySkinThemeRuntime(saved);
        await syncNativeStartupSplash(saved);
        draftConfig.value = saved;
        savedSnapshot.value = serializeSkinThemeConfig(saved);
        nextTick(() => {
          syncSandboxThemeToFrame();
          syncSandboxEditableBindings();
        });
        showGlobalToast("皮肤配置已保存");
      } catch (error) {
        showGlobalToast(`保存未完成: ${error?.message || "请重试"}`, { type: "error" });
      } finally {
        isSavingSkin.value = false;
      }
    }
    function resetSelectedTarget() {
      const schema = selectedSchema.value;
      draftConfig.value.targets[schema.id] = JSON.parse(JSON.stringify(schema.defaultValue));
      nextTick(() => {
        syncGestureFromDraft();
        syncSandboxThemeToFrame();
        syncSandboxEditableBindings();
      });
      showGlobalToast("当前目标已恢复默认", { type: "info" });
    }
    function downloadJson(config, filename) {
      const blob = new Blob([serializeSkinThemeConfig(config)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    function exportCurrent() {
      downloadJson(draftConfig.value, "ty-music-skin.json");
    }
    function exportTemplate() {
      downloadJson(createStandardSkinThemeTemplate(), "ty-music-skin-template.json");
    }
    function handleGestureMediaLoad() {
      gestureMinScale.value = 0.05;
      nextTick(syncGestureFromDraft);
    }
    function syncGestureFromDraft() {
      if (!isGestureTarget.value) return;
      const nextScale = Math.max(gestureMinScale.value || 0.05, Number(draftTarget.value.scale || 1));
      gestureScale.value = nextScale;
      gestureTranslateX.value = Number(draftTarget.value.translateX || 0);
      gestureTranslateY.value = Number(draftTarget.value.translateY || 0);
    }
    watch([gestureScale, gestureTranslateX, gestureTranslateY], () => {
      if (!drawerOpen.value || !isGestureTarget.value) return;
      draftTarget.value.scale = Number(gestureScale.value || 1);
      draftTarget.value.translateX = Math.round(Number(gestureTranslateX.value || 0));
      draftTarget.value.translateY = Math.round(Number(gestureTranslateY.value || 0));
    });
    watch(selectedTargetId, () => {
      nextTick(() => {
        syncGestureFromDraft();
        applyActiveZoneMark();
        updateActiveReference();
      });
    });
    watch(activeZoneId, () => {
      nextTick(() => {
        applyActiveZoneMark();
        updateActiveReference();
      });
    });
    watch(() => draftTarget.value.mediaSrc, () => {
      nextTick(syncGestureFromDraft);
    });
    watch(drawerOpen, (open) => {
      if (open) {
        playerStore.holdMiniPlayer("skin-studio-drawer");
      } else {
        playerStore.releaseMiniPlayer("skin-studio-drawer");
      }
    });
    watch(draftConfig, () => {
      nextTick(() => {
        syncSandboxThemeToFrame();
        applyActiveZoneMark();
        updateActiveReference();
      });
    }, { deep: true });
    watch(sandboxPageKey, (nextKey, previousKey) => {
      if (nextKey !== previousKey && !STICKY_TARGET_IDS.has(selectedTargetId.value)) {
        activeZoneId.value = "";
      }
      scheduleSandboxBindingSync(160);
      window.setTimeout(() => scheduleSandboxBindingSync(0), 520);
    });
    onMounted(() => {
      window.addEventListener("message", handleSandboxMessage);
      unregisterSkinStudioBack = registerBackHandler(() => {
        if (skinImageEditorVisible.value) {
          closeSkinImageEditor();
          return true;
        }
        if (skinVideoEditorVisible.value) {
          closeSkinVideoEditor();
          return true;
        }
        if (drawerOpen.value) {
          closeDrawer();
          return true;
        }
        performSandboxBack();
        return true;
      });
      scheduleSandboxBindingSync(220);
    });
    onUnmounted(() => {
      skinImageEditorVisible.value = false;
      skinVideoEditorVisible.value = false;
      playerStore.releaseMiniPlayer("skin-studio-drawer");
      window.removeEventListener("message", handleSandboxMessage);
      unregisterSkinStudioBack?.();
      unregisterSkinStudioBack = null;
      clearSandboxBindingSyncTimer();
      clearSandboxMutationObserver();
      clearSandboxHashListener();
      clearSandboxPathPolling();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("section", {
          class: "sandbox-shell",
          style: normalizeStyle(sandboxCssVars.value)
        }, [
          createBaseVNode("div", _hoisted_2, [
            createBaseVNode("iframe", {
              ref_key: "sandboxFrameRef",
              ref: sandboxFrameRef,
              class: "sandbox-frame",
              src: sandboxEntryUrl.value,
              title: "TY Music Sandbox",
              onLoad: handleSandboxFrameLoad
            }, null, 40, _hoisted_3)
          ])
        ], 4),
        !drawerOpen.value ? (openBlock(), createElementBlock("button", {
          key: 0,
          class: "studio-floating-edit-btn",
          type: "button",
          title: `编辑 ${sandboxPageLabel.value}`,
          onClick: openSandboxFloatingEditor
        }, [..._cache[47] || (_cache[47] = [
          createBaseVNode("span", null, "编", -1)
        ])], 8, _hoisted_4)) : createCommentVNode("", true),
        createVNode(Transition, { name: "drawer-mask" }, {
          default: withCtx(() => [
            drawerOpen.value ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: "drawer-mask",
              onClick: closeDrawer
            })) : createCommentVNode("", true)
          ]),
          _: 1
        }),
        createVNode(Transition, { name: "drawer" }, {
          default: withCtx(() => [
            drawerOpen.value ? (openBlock(), createElementBlock("aside", {
              key: 0,
              class: normalizeClass(["edit-drawer", { "is-global-container-drawer": selectedTargetId.value === "global_layout" }])
            }, [
              _cache[68] || (_cache[68] = createBaseVNode("div", { class: "drawer-grip" }, null, -1)),
              createBaseVNode("header", _hoisted_5, [
                createBaseVNode("div", null, [
                  createBaseVNode("span", null, toDisplayString(selectedSchema.value.permissionZone), 1),
                  createBaseVNode("h2", null, toDisplayString(selectedSchema.value.title), 1),
                  createBaseVNode("p", null, toDisplayString(activeHint.value), 1)
                ]),
                createBaseVNode("button", {
                  type: "button",
                  onClick: closeDrawer
                }, "完成")
              ]),
              createBaseVNode("div", _hoisted_6, [
                createBaseVNode("section", _hoisted_7, [
                  createBaseVNode("div", _hoisted_8, [
                    _cache[48] || (_cache[48] = createBaseVNode("h3", null, "快速切换", -1)),
                    createBaseVNode("span", null, toDisplayString(sandboxPageLabel.value), 1)
                  ]),
                  createBaseVNode("div", _hoisted_9, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(quickSwitchGroups.value, (group) => {
                      return openBlock(), createElementBlock("div", {
                        key: group.id,
                        class: "quick-switch-group"
                      }, [
                        createBaseVNode("p", null, toDisplayString(group.title), 1),
                        createBaseVNode("div", _hoisted_10, [
                          (openBlock(true), createElementBlock(Fragment, null, renderList(group.items, (item) => {
                            return openBlock(), createElementBlock("button", {
                              key: item.id,
                              class: normalizeClass(["quick-switch-chip", { active: isQuickItemActive(item), disabled: item.disabled }]),
                              type: "button",
                              disabled: item.disabled,
                              onClick: ($event) => openQuickSwitch(item)
                            }, toDisplayString(item.label), 11, _hoisted_11);
                          }), 128))
                        ])
                      ]);
                    }), 128))
                  ])
                ]),
                createBaseVNode("section", _hoisted_12, [
                  createBaseVNode("label", _hoisted_13, [
                    withDirectives(createBaseVNode("input", {
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => draftTarget.value.enabled = $event),
                      type: "checkbox"
                    }, null, 512), [
                      [vModelCheckbox, draftTarget.value.enabled]
                    ]),
                    createBaseVNode("span", null, toDisplayString(draftTarget.value.enabled ? "已启用当前编辑目标" : "关闭当前编辑目标"), 1)
                  ]),
                  createBaseVNode("button", {
                    class: "plain-btn danger",
                    type: "button",
                    onClick: resetSelectedTarget
                  }, "恢复默认")
                ]),
                createBaseVNode("section", _hoisted_14, [
                  createBaseVNode("span", _hoisted_15, "当前仿真页面：" + toDisplayString(sandboxPageLabel.value) + " · " + toDisplayString(sandboxRoutePath.value), 1),
                  createBaseVNode("button", {
                    class: "plain-btn tiny",
                    type: "button",
                    onClick: resetSandboxToHome
                  }, "回到首页")
                ]),
                createBaseVNode("section", _hoisted_16, [
                  _cache[49] || (_cache[49] = createBaseVNode("div", null, [
                    createBaseVNode("h3", null, "编辑改动"),
                    createBaseVNode("p", null, "样式参数只在此抽屉内修改；沙盒页面仅负责预览、打开抽屉和退出。")
                  ], -1)),
                  createBaseVNode("button", {
                    class: "primary-action-btn",
                    type: "button",
                    disabled: isSavingSkin.value,
                    onClick: saveAll
                  }, toDisplayString(isSavingSkin.value ? "正在保存" : isDirty.value ? "保存皮肤" : "已保存"), 9, _hoisted_17)
                ]),
                createBaseVNode("section", _hoisted_18, [
                  _cache[55] || (_cache[55] = createBaseVNode("h3", null, "真实数据参考", -1)),
                  createBaseVNode("div", _hoisted_19, [
                    createBaseVNode("article", null, [
                      _cache[50] || (_cache[50] = createBaseVNode("span", null, "高亮控件", -1)),
                      createBaseVNode("strong", null, toDisplayString(activeReference.value.label || "未匹配控件"), 1)
                    ]),
                    createBaseVNode("article", null, [
                      _cache[51] || (_cache[51] = createBaseVNode("span", null, "匹配元素", -1)),
                      createBaseVNode("strong", null, toDisplayString(activeReference.value.matchCount || 0) + " 个", 1)
                    ]),
                    createBaseVNode("article", null, [
                      _cache[52] || (_cache[52] = createBaseVNode("span", null, "示例尺寸", -1)),
                      createBaseVNode("strong", null, toDisplayString(activeReference.value.sizeText || "暂无"), 1)
                    ]),
                    createBaseVNode("article", null, [
                      _cache[53] || (_cache[53] = createBaseVNode("span", null, "示例圆角", -1)),
                      createBaseVNode("strong", null, toDisplayString(activeReference.value.radiusText || "暂无"), 1)
                    ]),
                    createBaseVNode("article", null, [
                      _cache[54] || (_cache[54] = createBaseVNode("span", null, "图片显示", -1)),
                      createBaseVNode("strong", null, toDisplayString(activeReference.value.mediaFitText || "按实际元素取样"), 1)
                    ])
                  ]),
                  createBaseVNode("p", _hoisted_20, toDisplayString(activeReference.value.sampleText || "当前页面暂未抓取到可用文本数据。"), 1)
                ]),
                supports("media") ? (openBlock(), createElementBlock("section", _hoisted_21, [
                  _cache[56] || (_cache[56] = createBaseVNode("h3", null, "素材", -1)),
                  createBaseVNode("div", _hoisted_22, [
                    (openBlock(), createElementBlock(Fragment, null, renderList(mediaTypes, (type) => {
                      return createBaseVNode("button", {
                        key: type.value,
                        type: "button",
                        class: normalizeClass({ active: draftTarget.value.mediaType === type.value }),
                        onClick: ($event) => draftTarget.value.mediaType = type.value
                      }, toDisplayString(type.label), 11, _hoisted_23);
                    }), 64))
                  ]),
                  createBaseVNode("div", _hoisted_24, [
                    createBaseVNode("button", {
                      class: "full-btn media-upload-btn",
                      type: "button",
                      disabled: isMediaUploading.value,
                      onClick: triggerMediaUpload
                    }, toDisplayString(isMediaUploading.value ? "素材保存中..." : "上传图片/视频"), 9, _hoisted_25),
                    createBaseVNode("button", {
                      class: "plain-btn",
                      type: "button",
                      disabled: !draftTarget.value.mediaSrc,
                      onClick: clearMediaAsset
                    }, " 清空素材 ", 8, _hoisted_26)
                  ]),
                  createBaseVNode("input", {
                    ref_key: "mediaInputRef",
                    ref: mediaInputRef,
                    type: "file",
                    accept: "image/*,video/*",
                    class: "hidden-input",
                    onChange: handleMediaFileSelect
                  }, null, 544),
                  createVNode(unref(TextField), {
                    modelValue: draftTarget.value.mediaSrc,
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => draftTarget.value.mediaSrc = $event),
                    label: "素材地址",
                    placeholder: "skin-asset:// / https:// / 本地资源路径"
                  }, null, 8, ["modelValue"]),
                  draftTarget.value.mediaType === "live2d" ? (openBlock(), createBlock(unref(TextField), {
                    key: 0,
                    modelValue: draftTarget.value.live2dModelUrl,
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => draftTarget.value.live2dModelUrl = $event),
                    label: "Live2D 模型地址",
                    placeholder: "model3.json 地址"
                  }, null, 8, ["modelValue"])) : createCommentVNode("", true),
                  "mediaOpacity" in draftTarget.value ? (openBlock(), createBlock(unref(NumberField), {
                    key: 1,
                    modelValue: draftTarget.value.mediaOpacity,
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => draftTarget.value.mediaOpacity = $event),
                    label: "素材透明度",
                    min: 0,
                    max: 0.7,
                    step: 0.01,
                    unit: "0-0.7"
                  }, null, 8, ["modelValue"])) : createCommentVNode("", true)
                ])) : createCommentVNode("", true),
                isGestureTarget.value ? (openBlock(), createElementBlock("section", _hoisted_27, [
                  _cache[59] || (_cache[59] = createBaseVNode("h3", null, "素材视窗", -1)),
                  createBaseVNode("div", {
                    class: "gesture-stage gesture-stage-preview",
                    style: normalizeStyle(gestureStageStyle.value),
                    ref_key: "gestureViewportRef",
                    ref: gestureViewportRef,
                    role: "button",
                    tabindex: "0",
                    onClick: openSkinMediaEditor,
                    onKeydown: withKeys(withModifiers(openSkinMediaEditor, ["prevent"]), ["enter"])
                  }, [
                    unref(gestureResolvedMediaSrc) && draftTarget.value.mediaType !== "video" ? (openBlock(), createElementBlock("img", {
                      key: 0,
                      ref_key: "gestureMediaRef",
                      ref: gestureMediaRef,
                      src: unref(gestureResolvedMediaSrc),
                      style: normalizeStyle(unref(gestureMediaStyle)),
                      alt: "gesture media",
                      draggable: "false",
                      onLoad: handleGestureMediaLoad
                    }, null, 44, _hoisted_29)) : unref(gestureResolvedMediaSrc) ? (openBlock(), createElementBlock("video", {
                      key: 1,
                      ref_key: "gestureMediaRef",
                      ref: gestureMediaRef,
                      src: unref(gestureResolvedMediaSrc),
                      style: normalizeStyle(unref(gestureMediaStyle)),
                      autoplay: "",
                      muted: "",
                      loop: "",
                      playsinline: "",
                      onLoadedmetadata: handleGestureMediaLoad
                    }, null, 44, _hoisted_30)) : (openBlock(), createElementBlock("span", _hoisted_31, "上传素材后点击进入编辑")),
                    selectedTargetId.value === "splash_screen" ? (openBlock(), createElementBlock("i", {
                      key: 3,
                      class: "gesture-tone-overlay",
                      style: normalizeStyle(gestureToneOverlayStyle.value)
                    }, null, 4)) : createCommentVNode("", true),
                    _cache[57] || (_cache[57] = createBaseVNode("i", { class: "gesture-frame" }, null, -1))
                  ], 44, _hoisted_28),
                  createBaseVNode("div", _hoisted_32, [
                    createVNode(unref(NumberField), {
                      modelValue: scalePercent.value,
                      "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => scalePercent.value = $event),
                      label: "缩放",
                      min: 5,
                      max: 800,
                      unit: "%"
                    }, null, 8, ["modelValue"]),
                    createVNode(unref(NumberField), {
                      modelValue: translateXField.value,
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => translateXField.value = $event),
                      label: "X 偏移",
                      min: -1200,
                      max: 1200,
                      unit: "px"
                    }, null, 8, ["modelValue"]),
                    createVNode(unref(NumberField), {
                      modelValue: translateYField.value,
                      "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => translateYField.value = $event),
                      label: "Y 偏移",
                      min: -1200,
                      max: 1200,
                      unit: "px"
                    }, null, 8, ["modelValue"])
                  ]),
                  "mediaFit" in draftTarget.value ? (openBlock(), createElementBlock("label", _hoisted_33, [
                    _cache[58] || (_cache[58] = createBaseVNode("span", null, "图片适配", -1)),
                    withDirectives(createBaseVNode("select", {
                      "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => draftTarget.value.mediaFit = $event),
                      onChange: resetMediaFitTransform
                    }, [
                      (openBlock(), createElementBlock(Fragment, null, renderList(mediaFitOptions, (option) => {
                        return createBaseVNode("option", {
                          key: option.value,
                          value: option.value
                        }, toDisplayString(option.label), 9, _hoisted_34);
                      }), 64))
                    ], 544), [
                      [vModelSelect, draftTarget.value.mediaFit]
                    ])
                  ])) : createCommentVNode("", true)
                ])) : createCommentVNode("", true),
                supports("colors") ? (openBlock(), createElementBlock("section", _hoisted_35, [
                  _cache[60] || (_cache[60] = createBaseVNode("h3", null, "颜色", -1)),
                  createBaseVNode("div", _hoisted_36, [
                    "accentColor" in draftTarget.value ? (openBlock(), createBlock(unref(ColorField), {
                      key: 0,
                      modelValue: draftTarget.value.accentColor,
                      "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => draftTarget.value.accentColor = $event),
                      label: "强调色"
                    }, null, 8, ["modelValue"])) : createCommentVNode("", true),
                    "pageBackground" in draftTarget.value ? (openBlock(), createBlock(unref(ColorField), {
                      key: 1,
                      modelValue: draftTarget.value.pageBackground,
                      "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => draftTarget.value.pageBackground = $event),
                      label: "页面底色"
                    }, null, 8, ["modelValue"])) : createCommentVNode("", true),
                    "surfaceColor" in draftTarget.value ? (openBlock(), createBlock(unref(ColorField), {
                      key: 2,
                      modelValue: draftTarget.value.surfaceColor,
                      "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => draftTarget.value.surfaceColor = $event),
                      label: "容器底色"
                    }, null, 8, ["modelValue"])) : createCommentVNode("", true),
                    "backgroundColor" in draftTarget.value ? (openBlock(), createBlock(unref(ColorField), {
                      key: 3,
                      modelValue: draftTarget.value.backgroundColor,
                      "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => draftTarget.value.backgroundColor = $event),
                      label: "歌曲底色"
                    }, null, 8, ["modelValue"])) : createCommentVNode("", true),
                    "textColor" in draftTarget.value ? (openBlock(), createBlock(unref(ColorField), {
                      key: 4,
                      modelValue: draftTarget.value.textColor,
                      "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => draftTarget.value.textColor = $event),
                      label: "主文字"
                    }, null, 8, ["modelValue"])) : createCommentVNode("", true),
                    "mutedTextColor" in draftTarget.value ? (openBlock(), createBlock(unref(ColorField), {
                      key: 5,
                      modelValue: draftTarget.value.mutedTextColor,
                      "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => draftTarget.value.mutedTextColor = $event),
                      label: "副文字"
                    }, null, 8, ["modelValue"])) : createCommentVNode("", true),
                    "progressColor" in draftTarget.value ? (openBlock(), createBlock(unref(ColorField), {
                      key: 6,
                      modelValue: draftTarget.value.progressColor,
                      "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => draftTarget.value.progressColor = $event),
                      label: "进度条"
                    }, null, 8, ["modelValue"])) : createCommentVNode("", true),
                    "playingColor" in draftTarget.value ? (openBlock(), createBlock(unref(ColorField), {
                      key: 7,
                      modelValue: draftTarget.value.playingColor,
                      "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => draftTarget.value.playingColor = $event),
                      label: "播放高亮"
                    }, null, 8, ["modelValue"])) : createCommentVNode("", true),
                    "buttonColor" in draftTarget.value ? (openBlock(), createBlock(unref(ColorField), {
                      key: 8,
                      modelValue: draftTarget.value.buttonColor,
                      "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => draftTarget.value.buttonColor = $event),
                      label: "按钮颜色"
                    }, null, 8, ["modelValue"])) : createCommentVNode("", true)
                  ])
                ])) : createCommentVNode("", true),
                supports("radius") ? (openBlock(), createElementBlock("section", _hoisted_37, [
                  _cache[61] || (_cache[61] = createBaseVNode("h3", null, "圆角", -1)),
                  createBaseVNode("div", _hoisted_38, [
                    "pageRadius" in draftTarget.value ? (openBlock(), createBlock(unref(NumberField), {
                      key: 0,
                      modelValue: draftTarget.value.pageRadius,
                      "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => draftTarget.value.pageRadius = $event),
                      label: "页面圆角",
                      min: 0,
                      max: 48,
                      unit: "px"
                    }, null, 8, ["modelValue"])) : createCommentVNode("", true),
                    "containerRadius" in draftTarget.value ? (openBlock(), createBlock(unref(NumberField), {
                      key: 1,
                      modelValue: draftTarget.value.containerRadius,
                      "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => draftTarget.value.containerRadius = $event),
                      label: "子容器圆角",
                      min: 0,
                      max: 48,
                      unit: "px"
                    }, null, 8, ["modelValue"])) : createCommentVNode("", true),
                    "itemRadius" in draftTarget.value ? (openBlock(), createBlock(unref(NumberField), {
                      key: 2,
                      modelValue: draftTarget.value.itemRadius,
                      "onUpdate:modelValue": _cache[19] || (_cache[19] = ($event) => draftTarget.value.itemRadius = $event),
                      label: "列表项圆角",
                      min: 0,
                      max: 48,
                      unit: "px"
                    }, null, 8, ["modelValue"])) : createCommentVNode("", true),
                    "coverRadius" in draftTarget.value ? (openBlock(), createBlock(unref(NumberField), {
                      key: 3,
                      modelValue: draftTarget.value.coverRadius,
                      "onUpdate:modelValue": _cache[20] || (_cache[20] = ($event) => draftTarget.value.coverRadius = $event),
                      label: "Cover 圆角",
                      min: 0,
                      max: 48,
                      unit: "px"
                    }, null, 8, ["modelValue"])) : createCommentVNode("", true),
                    "buttonRadius" in draftTarget.value ? (openBlock(), createBlock(unref(NumberField), {
                      key: 4,
                      modelValue: draftTarget.value.buttonRadius,
                      "onUpdate:modelValue": _cache[21] || (_cache[21] = ($event) => draftTarget.value.buttonRadius = $event),
                      label: "按钮圆角",
                      min: 0,
                      max: 999,
                      unit: "px"
                    }, null, 8, ["modelValue"])) : createCommentVNode("", true),
                    "progressRadius" in draftTarget.value ? (openBlock(), createBlock(unref(NumberField), {
                      key: 5,
                      modelValue: draftTarget.value.progressRadius,
                      "onUpdate:modelValue": _cache[22] || (_cache[22] = ($event) => draftTarget.value.progressRadius = $event),
                      label: "进度条圆角",
                      min: 0,
                      max: 999,
                      unit: "px"
                    }, null, 8, ["modelValue"])) : createCommentVNode("", true),
                    "radius" in draftTarget.value ? (openBlock(), createBlock(unref(NumberField), {
                      key: 6,
                      modelValue: draftTarget.value.radius,
                      "onUpdate:modelValue": _cache[23] || (_cache[23] = ($event) => draftTarget.value.radius = $event),
                      label: "当前区域圆角",
                      min: 0,
                      max: 48,
                      unit: "px"
                    }, null, 8, ["modelValue"])) : createCommentVNode("", true)
                  ])
                ])) : createCommentVNode("", true),
                supports("spacing") ? (openBlock(), createElementBlock("section", _hoisted_39, [
                  _cache[62] || (_cache[62] = createBaseVNode("h3", null, "布局尺寸", -1)),
                  createBaseVNode("div", _hoisted_40, [
                    "pagePadding" in draftTarget.value ? (openBlock(), createBlock(unref(NumberField), {
                      key: 0,
                      modelValue: draftTarget.value.pagePadding,
                      "onUpdate:modelValue": _cache[24] || (_cache[24] = ($event) => draftTarget.value.pagePadding = $event),
                      label: "页面内距",
                      min: 0,
                      max: 36,
                      unit: "px"
                    }, null, 8, ["modelValue"])) : createCommentVNode("", true),
                    "cardGap" in draftTarget.value ? (openBlock(), createBlock(unref(NumberField), {
                      key: 1,
                      modelValue: draftTarget.value.cardGap,
                      "onUpdate:modelValue": _cache[25] || (_cache[25] = ($event) => draftTarget.value.cardGap = $event),
                      label: "卡片间距",
                      min: 0,
                      max: 36,
                      unit: "px"
                    }, null, 8, ["modelValue"])) : createCommentVNode("", true),
                    "listGap" in draftTarget.value ? (openBlock(), createBlock(unref(NumberField), {
                      key: 2,
                      modelValue: draftTarget.value.listGap,
                      "onUpdate:modelValue": _cache[26] || (_cache[26] = ($event) => draftTarget.value.listGap = $event),
                      label: "列表间距",
                      min: 0,
                      max: 36,
                      unit: "px"
                    }, null, 8, ["modelValue"])) : createCommentVNode("", true),
                    "itemPadding" in draftTarget.value ? (openBlock(), createBlock(unref(NumberField), {
                      key: 3,
                      modelValue: draftTarget.value.itemPadding,
                      "onUpdate:modelValue": _cache[27] || (_cache[27] = ($event) => draftTarget.value.itemPadding = $event),
                      label: "歌曲内距",
                      min: 0,
                      max: 36,
                      unit: "px"
                    }, null, 8, ["modelValue"])) : createCommentVNode("", true),
                    "itemGap" in draftTarget.value ? (openBlock(), createBlock(unref(NumberField), {
                      key: 4,
                      modelValue: draftTarget.value.itemGap,
                      "onUpdate:modelValue": _cache[28] || (_cache[28] = ($event) => draftTarget.value.itemGap = $event),
                      label: "歌曲元素间距",
                      min: 0,
                      max: 36,
                      unit: "px"
                    }, null, 8, ["modelValue"])) : createCommentVNode("", true),
                    "itemHeight" in draftTarget.value ? (openBlock(), createBlock(unref(NumberField), {
                      key: 5,
                      modelValue: draftTarget.value.itemHeight,
                      "onUpdate:modelValue": _cache[29] || (_cache[29] = ($event) => draftTarget.value.itemHeight = $event),
                      label: "歌曲高度",
                      min: 58,
                      max: 128,
                      unit: "px"
                    }, null, 8, ["modelValue"])) : createCommentVNode("", true),
                    "songItemHeight" in draftTarget.value ? (openBlock(), createBlock(unref(NumberField), {
                      key: 6,
                      modelValue: draftTarget.value.songItemHeight,
                      "onUpdate:modelValue": _cache[30] || (_cache[30] = ($event) => draftTarget.value.songItemHeight = $event),
                      label: "歌单歌曲高度",
                      min: 58,
                      max: 128,
                      unit: "px"
                    }, null, 8, ["modelValue"])) : createCommentVNode("", true),
                    "coverSize" in draftTarget.value ? (openBlock(), createBlock(unref(NumberField), {
                      key: 7,
                      modelValue: draftTarget.value.coverSize,
                      "onUpdate:modelValue": _cache[31] || (_cache[31] = ($event) => draftTarget.value.coverSize = $event),
                      label: "Cover 尺寸",
                      min: coverSizeLimits.value.min,
                      max: coverSizeLimits.value.max,
                      unit: "px"
                    }, null, 8, ["modelValue", "min", "max"])) : createCommentVNode("", true)
                  ])
                ])) : createCommentVNode("", true),
                supports("overlay") ? (openBlock(), createElementBlock("section", _hoisted_41, [
                  _cache[63] || (_cache[63] = createBaseVNode("h3", null, "遮罩与模糊", -1)),
                  createBaseVNode("div", _hoisted_42, [
                    "overlayOpacity" in draftTarget.value ? (openBlock(), createBlock(unref(NumberField), {
                      key: 0,
                      modelValue: draftTarget.value.overlayOpacity,
                      "onUpdate:modelValue": _cache[32] || (_cache[32] = ($event) => draftTarget.value.overlayOpacity = $event),
                      label: "遮罩透明度",
                      min: 0,
                      max: 0.85,
                      step: 0.01,
                      unit: "0-0.85"
                    }, null, 8, ["modelValue"])) : createCommentVNode("", true),
                    "heroOverlayOpacity" in draftTarget.value ? (openBlock(), createBlock(unref(NumberField), {
                      key: 1,
                      modelValue: draftTarget.value.heroOverlayOpacity,
                      "onUpdate:modelValue": _cache[33] || (_cache[33] = ($event) => draftTarget.value.heroOverlayOpacity = $event),
                      label: "Hero 遮罩",
                      min: 0,
                      max: 0.85,
                      step: 0.01,
                      unit: "0-0.85"
                    }, null, 8, ["modelValue"])) : createCommentVNode("", true),
                    "blur" in draftTarget.value ? (openBlock(), createBlock(unref(NumberField), {
                      key: 2,
                      modelValue: draftTarget.value.blur,
                      "onUpdate:modelValue": _cache[34] || (_cache[34] = ($event) => draftTarget.value.blur = $event),
                      label: "模糊",
                      min: 0,
                      max: 36,
                      unit: "px"
                    }, null, 8, ["modelValue"])) : createCommentVNode("", true),
                    "heroBlur" in draftTarget.value ? (openBlock(), createBlock(unref(NumberField), {
                      key: 3,
                      modelValue: draftTarget.value.heroBlur,
                      "onUpdate:modelValue": _cache[35] || (_cache[35] = ($event) => draftTarget.value.heroBlur = $event),
                      label: "Hero 模糊",
                      min: 0,
                      max: 36,
                      unit: "px"
                    }, null, 8, ["modelValue"])) : createCommentVNode("", true),
                    "shadow" in draftTarget.value ? (openBlock(), createBlock(unref(NumberField), {
                      key: 4,
                      modelValue: draftTarget.value.shadow,
                      "onUpdate:modelValue": _cache[36] || (_cache[36] = ($event) => draftTarget.value.shadow = $event),
                      label: "阴影",
                      min: 0,
                      max: 64,
                      unit: "px"
                    }, null, 8, ["modelValue"])) : createCommentVNode("", true)
                  ])
                ])) : createCommentVNode("", true),
                supports("animation") ? (openBlock(), createElementBlock("section", _hoisted_43, [
                  _cache[66] || (_cache[66] = createBaseVNode("h3", null, "开屏动画", -1)),
                  createBaseVNode("label", _hoisted_44, [
                    _cache[65] || (_cache[65] = createBaseVNode("span", null, "动画类型", -1)),
                    withDirectives(createBaseVNode("select", {
                      "onUpdate:modelValue": _cache[37] || (_cache[37] = ($event) => draftTarget.value.animationName = $event)
                    }, [..._cache[64] || (_cache[64] = [
                      createBaseVNode("option", { value: "fade-scale" }, "淡入缩放", -1),
                      createBaseVNode("option", { value: "fade" }, "淡入", -1),
                      createBaseVNode("option", { value: "rise" }, "上浮", -1),
                      createBaseVNode("option", { value: "soft-zoom" }, "柔和缩放", -1),
                      createBaseVNode("option", { value: "none" }, "关闭", -1)
                    ])], 512), [
                      [vModelSelect, draftTarget.value.animationName]
                    ])
                  ]),
                  createVNode(unref(NumberField), {
                    modelValue: draftTarget.value.animationDurationMs,
                    "onUpdate:modelValue": _cache[38] || (_cache[38] = ($event) => draftTarget.value.animationDurationMs = $event),
                    label: "持续时间",
                    min: 200,
                    max: 5e3,
                    unit: "ms"
                  }, null, 8, ["modelValue"])
                ])) : createCommentVNode("", true),
                createBaseVNode("section", _hoisted_45, [
                  _cache[67] || (_cache[67] = createBaseVNode("h3", null, "配置交换", -1)),
                  createBaseVNode("div", { class: "button-grid" }, [
                    createBaseVNode("button", {
                      class: "plain-btn",
                      type: "button",
                      onClick: exportCurrent
                    }, "导出当前皮肤"),
                    createBaseVNode("button", {
                      class: "plain-btn",
                      type: "button",
                      onClick: exportTemplate
                    }, "导出标准模板"),
                    createBaseVNode("button", {
                      class: "plain-btn",
                      type: "button",
                      onClick: triggerImport
                    }, "导入皮肤配置")
                  ]),
                  createBaseVNode("input", {
                    ref_key: "importInputRef",
                    ref: importInputRef,
                    type: "file",
                    accept: "application/json,.json",
                    class: "hidden-input",
                    onChange: handleImportFile
                  }, null, 544)
                ])
              ])
            ], 2)) : createCommentVNode("", true)
          ]),
          _: 1
        }),
        createVNode(ImageCropperDialog, {
          visible: skinImageEditorVisible.value,
          src: skinImageEditorSrc.value,
          title: `编辑 ${selectedSchema.value.title}`,
          "aspect-ratio": skinMediaEditorAspectRatio.value,
          "output-width": skinMediaEditorOutputSize.value.width,
          "output-height": skinMediaEditorOutputSize.value.height,
          "panel-max-width": skinMediaEditorPanelMaxWidth.value,
          "source-viewport-width": skinMediaEditorViewportSize.value.width,
          "source-viewport-height": skinMediaEditorViewportSize.value.height,
          "initial-transform": skinImageEditorTransform.value,
          "transform-only": true,
          "media-fit": draftTarget.value.mediaFit || "contain",
          "preview-background": selectedTargetId.value === "splash_screen" ? "#f2f5f8" : draftConfig.value.targets.global_layout.pageBackground,
          "overlay-opacity": selectedTargetId.value === "splash_screen" ? Number(draftTarget.value.overlayOpacity || 0) : 0,
          onClose: closeSkinImageEditor,
          onRequestFile: triggerMediaUpload,
          onConfirm: handleSkinImageTransformConfirm
        }, null, 8, ["visible", "src", "title", "aspect-ratio", "output-width", "output-height", "panel-max-width", "source-viewport-width", "source-viewport-height", "initial-transform", "media-fit", "preview-background", "overlay-opacity"]),
        createVNode(Transition, { name: "drawer-mask" }, {
          default: withCtx(() => [
            skinVideoEditorVisible.value ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: "skin-video-editor-sheet",
              onClick: withModifiers(closeSkinVideoEditor, ["self"])
            }, [
              createBaseVNode("div", _hoisted_46, [
                createBaseVNode("header", _hoisted_47, [
                  createBaseVNode("h3", null, "编辑 " + toDisplayString(selectedSchema.value.title), 1),
                  createBaseVNode("button", {
                    type: "button",
                    onClick: closeSkinVideoEditor
                  }, "完成")
                ]),
                createBaseVNode("div", {
                  class: "gesture-stage skin-video-editor-stage",
                  style: normalizeStyle(gestureStageStyle.value),
                  ref_key: "gestureViewportRef",
                  ref: gestureViewportRef,
                  onPointerdown: _cache[39] || (_cache[39] = withModifiers((...args) => unref(onGesturePointerDown) && unref(onGesturePointerDown)(...args), ["prevent"])),
                  onPointermove: _cache[40] || (_cache[40] = withModifiers((...args) => unref(onGesturePointerMove) && unref(onGesturePointerMove)(...args), ["prevent"])),
                  onPointerup: _cache[41] || (_cache[41] = (...args) => unref(onGesturePointerUp) && unref(onGesturePointerUp)(...args)),
                  onPointercancel: _cache[42] || (_cache[42] = (...args) => unref(onGesturePointerUp) && unref(onGesturePointerUp)(...args)),
                  onTouchstart: _cache[43] || (_cache[43] = withModifiers((...args) => unref(onGestureTouchStart) && unref(onGestureTouchStart)(...args), ["prevent"])),
                  onTouchmove: _cache[44] || (_cache[44] = withModifiers((...args) => unref(onGestureTouchMove) && unref(onGestureTouchMove)(...args), ["prevent"])),
                  onTouchend: _cache[45] || (_cache[45] = (...args) => unref(onGestureTouchEnd) && unref(onGestureTouchEnd)(...args)),
                  onTouchcancel: _cache[46] || (_cache[46] = (...args) => unref(onGestureTouchEnd) && unref(onGestureTouchEnd)(...args))
                }, [
                  unref(gestureResolvedMediaSrc) ? (openBlock(), createElementBlock("video", {
                    key: 0,
                    ref_key: "gestureMediaRef",
                    ref: gestureMediaRef,
                    src: unref(gestureResolvedMediaSrc),
                    style: normalizeStyle(unref(gestureMediaStyle)),
                    autoplay: "",
                    muted: "",
                    loop: "",
                    playsinline: "",
                    onLoadedmetadata: handleGestureMediaLoad
                  }, null, 44, _hoisted_48)) : (openBlock(), createElementBlock("span", _hoisted_49, "上传视频后可编辑位置")),
                  _cache[69] || (_cache[69] = createBaseVNode("i", { class: "gesture-frame" }, null, -1))
                ], 36)
              ])
            ])) : createCommentVNode("", true)
          ]),
          _: 1
        })
      ]);
    };
  }
};
const SkinStudioView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-36c529c0"]]);
export {
  SkinStudioView as default
};
