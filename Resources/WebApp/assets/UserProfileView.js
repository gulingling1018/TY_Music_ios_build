import { $ as useRouter, M as ref, c as computed, E as onMounted, H as onUnmounted, I as openBlock, g as createElementBlock, d as createBaseVNode, x as normalizeStyle, Y as toDisplayString, a7 as withDirectives, a3 as vModelText, l as createVNode, a6 as withCtx, f as createCommentVNode, T as Transition, a9 as withModifiers, F as Fragment, O as renderList, w as normalizeClass } from "./vendor.js";
import { _ as _export_sfc, ac as usePlayerStore, ad as usePlaylistStore, X as registerBackHandler, I as ImageCropperDialog, a3 as showGlobalToast, a4 as storage, U as readPlayerResumeCache } from "./index.js";
const _hoisted_1 = { class: "profile-view" };
const _hoisted_2 = { class: "profile-hero" };
const _hoisted_3 = { class: "profile-hero-content" };
const _hoisted_4 = ["src"];
const _hoisted_5 = { class: "hero-copy" };
const _hoisted_6 = { class: "profile-body" };
const _hoisted_7 = { class: "section-card profile-form-card" };
const _hoisted_8 = { class: "section-head" };
const _hoisted_9 = ["disabled"];
const _hoisted_10 = { class: "form-grid" };
const _hoisted_11 = { class: "field-block" };
const _hoisted_12 = { class: "field-block" };
const _hoisted_13 = { class: "section-card avatar-studio-card" };
const _hoisted_14 = { class: "avatar-studio-body" };
const _hoisted_15 = { class: "section-card password-card" };
const _hoisted_16 = { class: "collapse-indicator" };
const _hoisted_17 = {
  key: 0,
  class: "password-panel"
};
const _hoisted_18 = { class: "account-picker-dialog" };
const _hoisted_19 = { class: "account-list" };
const _hoisted_20 = ["onClick"];
const _hoisted_21 = ["src"];
const _hoisted_22 = { class: "acc-info" };
const _hoisted_23 = { class: "acc-name" };
const _hoisted_24 = { class: "acc-email" };
const _hoisted_25 = {
  key: 0,
  class: "acc-badge"
};
const _sfc_main = {
  __name: "UserProfileView",
  setup(__props) {
    const router = useRouter();
    const playerStore = usePlayerStore();
    const playlistStore = usePlaylistStore();
    const profileForm = ref({
      email: "",
      username: "",
      avatar_url: ""
    });
    const savingProfile = ref(false);
    const showPasswordForm = ref(false);
    const avatarCropperVisible = ref(false);
    const avatarInputRef = ref(null);
    const avatarEditorMediaUrl = ref("");
    const avatarObjectUrl = ref("");
    const avatarSrc = computed(() => {
      if (profileForm.value.avatar_url) return profileForm.value.avatar_url;
      return createDefaultAvatarDataUrl(profileForm.value.username || profileForm.value.email || "User");
    });
    const heroMediaStyle = computed(() => ({
      backgroundImage: `url("${avatarSrc.value}")`
    }));
    function createDefaultAvatarDataUrl(name = "User") {
      const safeName = `${name || "User"}`.trim().slice(0, 2) || "U";
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3db6ff"/><stop offset="100%" stop-color="#2f7fd6"/></linearGradient></defs><rect width="360" height="360" rx="180" fill="url(#g)"/><text x="180" y="204" text-anchor="middle" font-size="134" font-family="Arial, sans-serif" font-weight="700" fill="#ffffff">${safeName}</text></svg>`;
      return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
    }
    function readUserInfo() {
      try {
        return JSON.parse(localStorage.getItem("userInfo") || "{}");
      } catch {
        return {};
      }
    }
    function persistUserInfo(patch = {}) {
      const merged = { ...readUserInfo(), ...patch };
      localStorage.setItem("userInfo", JSON.stringify(merged));
    }
    function loadUserInfo() {
      const current = readUserInfo();
      profileForm.value = {
        email: current.email || "guest@local",
        username: current.username || "本地用户",
        avatar_url: current.avatar_url || ""
      };
      avatarEditorMediaUrl.value = avatarSrc.value;
    }
    function openAvatarStudio() {
      avatarEditorMediaUrl.value = avatarSrc.value;
      avatarCropperVisible.value = true;
    }
    function triggerAvatarInput() {
      avatarInputRef.value?.click();
    }
    function revokeAvatarObjectUrl() {
      if (avatarObjectUrl.value?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarObjectUrl.value);
      }
      avatarObjectUrl.value = "";
    }
    function handleAvatarChange(event) {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;
      revokeAvatarObjectUrl();
      avatarObjectUrl.value = URL.createObjectURL(file);
      avatarEditorMediaUrl.value = avatarObjectUrl.value;
      avatarCropperVisible.value = true;
    }
    function closeAvatarCropper() {
      avatarCropperVisible.value = false;
    }
    function saveAvatarFromEditor(payload) {
      const dataUrl = payload?.dataUrl;
      if (!dataUrl) {
        showGlobalToast("头像保存失败: 无法读取当前素材", { type: "error" });
        return;
      }
      profileForm.value.avatar_url = dataUrl;
      avatarEditorMediaUrl.value = dataUrl;
      avatarCropperVisible.value = false;
      revokeAvatarObjectUrl();
      persistUserInfo({
        username: profileForm.value.username,
        email: profileForm.value.email,
        avatar_url: dataUrl
      });
      showGlobalToast("头像已保存");
    }
    function resetAvatarToDefault() {
      const fallback = createDefaultAvatarDataUrl(profileForm.value.username || "User");
      profileForm.value.avatar_url = "";
      avatarEditorMediaUrl.value = fallback;
      avatarCropperVisible.value = false;
      revokeAvatarObjectUrl();
      persistUserInfo({
        username: profileForm.value.username,
        email: profileForm.value.email,
        avatar_url: ""
      });
      showGlobalToast("已恢复默认头像");
    }
    async function saveProfile() {
      const nextUsername = profileForm.value.username.trim();
      const nextEmail = profileForm.value.email.trim();
      if (!nextUsername) {
        showGlobalToast("用户名不能为空", { type: "warning" });
        return;
      }
      if (!nextEmail) {
        showGlobalToast("邮箱不能为空", { type: "warning" });
        return;
      }
      savingProfile.value = true;
      try {
        persistUserInfo({
          username: nextUsername,
          email: nextEmail,
          avatar_url: profileForm.value.avatar_url
        });
        profileForm.value.username = nextUsername;
        profileForm.value.email = nextEmail;
        showGlobalToast("资料已保存");
      } finally {
        savingProfile.value = false;
      }
    }
    const showAccountPicker = ref(false);
    const savedAccounts = ref([]);
    const currentUserId = ref(null);
    function handleSwitchAccount() {
      const accounts = [];
      const allKeys = Object.keys(localStorage);
      const userIds = /* @__PURE__ */ new Set();
      for (const key of allKeys) {
        const match = key.match(/^ty_(\d+)_lastActive$/);
        if (match) userIds.add(match[1]);
      }
      const current = readUserInfo();
      if (current?.id) {
        currentUserId.value = String(current.id);
        userIds.add(String(current.id));
      }
      for (const uid of userIds) {
        const raw = localStorage.getItem(`ty_${uid}_userInfo`);
        let acc = { id: uid, username: `用户${uid}`, email: "", avatar: null };
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            acc = {
              id: uid,
              username: parsed.username || acc.username,
              email: parsed.email || "",
              avatar: parsed.avatar_url || null
            };
          } catch {
          }
        }
        accounts.push(acc);
      }
      savedAccounts.value = accounts;
      showAccountPicker.value = true;
    }
    async function switchToAccount(acc) {
      if (String(acc.id) === currentUserId.value) {
        showAccountPicker.value = false;
        return;
      }
      const savedToken = localStorage.getItem(`ty_${acc.id}_token`) || "";
      try {
        const infoRaw = localStorage.getItem(`ty_${acc.id}_userInfo`);
        const localInfo = infoRaw ? JSON.parse(infoRaw) : { id: acc.id, username: acc.username, email: acc.email };
        storage.touchActiveTime();
        if (currentUserId.value) {
          localStorage.setItem(`ty_${currentUserId.value}_token`, localStorage.getItem("userToken") || "");
          localStorage.setItem(`ty_${currentUserId.value}_userInfo`, localStorage.getItem("userInfo") || "");
        }
        localStorage.setItem("userToken", savedToken);
        localStorage.setItem("userInfo", JSON.stringify(localInfo));
        storage.switchToUser(acc.id);
        storage.touchActiveTime();
        showAccountPicker.value = false;
        showGlobalToast(`已切换到 ${acc.username || acc.email}`);
        setTimeout(() => location.reload(), 400);
      } catch (error) {
        showGlobalToast(`切换失败: ${error.message}`, { type: "error" });
      }
    }
    function handleLogout() {
      if (playerStore.audio) {
        try {
          playerStore.audio.pause();
        } catch {
        }
      }
      playerStore.isPlaying = false;
      try {
        playerStore.flushResumeState();
      } catch {
      }
      storage.touchActiveTime();
      localStorage.removeItem("userToken");
      localStorage.removeItem("userInfo");
      storage.switchToGuest();
      const cachedRaw = storage.get(`playlist_cache_${playlistStore.mode}`);
      if (cachedRaw) {
        try {
          const cached = JSON.parse(cachedRaw);
          playlistStore.queue = Array.isArray(cached.songs) ? cached.songs.map((track) => track && typeof track === "object" ? { ...track } : track) : [];
        } catch {
          playlistStore.queue = [];
        }
      } else {
        playlistStore.queue = [];
      }
      const resumeSnapshot = readPlayerResumeCache();
      const saved = resumeSnapshot?.resume;
      const savedHashId = saved?.currentHashId ?? null;
      let resumeTrack = null;
      if (savedHashId) {
        resumeTrack = playlistStore.queue.find((item) => (item?.hash_id ?? item?.id) === savedHashId) || null;
        const cachedTrack = resumeSnapshot?.currentTrack;
        const cachedHashId = cachedTrack?.hash_id ?? cachedTrack?.id ?? null;
        if (!resumeTrack && cachedHashId === savedHashId) {
          resumeTrack = cachedTrack;
        }
      }
      if (resumeTrack) {
        playerStore.currentTrack = resumeTrack;
        playerStore.currentHashId = savedHashId;
        const seekTime = Math.max(0, Number(saved?.currentTime ?? 0) || 0);
        if (typeof playerStore._applyInitialTrackTiming === "function") {
          playerStore._applyInitialTrackTiming(resumeTrack, seekTime);
        } else {
          playerStore.currentTime = seekTime;
          playerStore.duration = Math.max(0, Number(resumeTrack?.duration ?? 0) || 0);
          playerStore.progress = playerStore.duration > 0 ? Math.min(100, Math.max(0, playerStore.currentTime / playerStore.duration * 100)) : 0;
        }
      } else {
        playerStore.currentTrack = null;
        playerStore.currentHashId = null;
        if (typeof playerStore._applyTimingState === "function") {
          playerStore._applyTimingState({
            currentTime: 0,
            duration: 0,
            source: "none",
            trustedForEnd: false
          });
        } else {
          playerStore.currentTime = 0;
          playerStore.duration = 0;
          playerStore.progress = 0;
        }
      }
      router.replace("/account");
    }
    const unregisterBack = registerBackHandler(() => {
      if (showAccountPicker.value) {
        showAccountPicker.value = false;
        return true;
      }
      if (avatarCropperVisible.value) {
        avatarCropperVisible.value = false;
        return true;
      }
      return false;
    });
    onMounted(() => {
      loadUserInfo();
    });
    onUnmounted(() => {
      unregisterBack();
      revokeAvatarObjectUrl();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("section", _hoisted_2, [
          createBaseVNode("div", {
            class: "profile-hero-media",
            style: normalizeStyle(heroMediaStyle.value)
          }, null, 4),
          _cache[7] || (_cache[7] = createBaseVNode("div", { class: "profile-hero-frost" }, null, -1)),
          createBaseVNode("div", _hoisted_3, [
            createBaseVNode("button", {
              class: "hero-avatar-button",
              type: "button",
              onClick: openAvatarStudio
            }, [
              createBaseVNode("img", {
                src: avatarSrc.value,
                alt: "头像",
                class: "hero-avatar"
              }, null, 8, _hoisted_4),
              _cache[5] || (_cache[5] = createBaseVNode("span", { class: "hero-avatar-tip" }, "编辑头像", -1))
            ]),
            createBaseVNode("div", _hoisted_5, [
              _cache[6] || (_cache[6] = createBaseVNode("p", { class: "hero-kicker" }, "Account Info", -1)),
              createBaseVNode("h1", null, toDisplayString(profileForm.value.username || "本地用户"), 1),
              createBaseVNode("p", null, toDisplayString(profileForm.value.email || "guest@local"), 1)
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_6, [
          createBaseVNode("section", _hoisted_7, [
            createBaseVNode("div", _hoisted_8, [
              _cache[8] || (_cache[8] = createBaseVNode("div", null, [
                createBaseVNode("h2", null, "基础资料"),
                createBaseVNode("p", null, "用户名、邮箱和头像均保存在本地设备。")
              ], -1)),
              createBaseVNode("button", {
                class: "primary-btn",
                disabled: savingProfile.value,
                onClick: saveProfile
              }, toDisplayString(savingProfile.value ? "保存中..." : "保存资料"), 9, _hoisted_9)
            ]),
            createBaseVNode("div", _hoisted_10, [
              createBaseVNode("label", _hoisted_11, [
                _cache[9] || (_cache[9] = createBaseVNode("span", null, "用户名", -1)),
                withDirectives(createBaseVNode("input", {
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => profileForm.value.username = $event),
                  class: "info-input",
                  maxlength: "50",
                  placeholder: "输入用户名"
                }, null, 512), [
                  [
                    vModelText,
                    profileForm.value.username,
                    void 0,
                    { trim: true }
                  ]
                ])
              ]),
              createBaseVNode("label", _hoisted_12, [
                _cache[10] || (_cache[10] = createBaseVNode("span", null, "邮箱", -1)),
                withDirectives(createBaseVNode("input", {
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => profileForm.value.email = $event),
                  class: "info-input",
                  maxlength: "80",
                  placeholder: "输入邮箱"
                }, null, 512), [
                  [
                    vModelText,
                    profileForm.value.email,
                    void 0,
                    { trim: true }
                  ]
                ])
              ])
            ])
          ]),
          createBaseVNode("section", _hoisted_13, [
            createBaseVNode("div", { class: "section-head" }, [
              _cache[11] || (_cache[11] = createBaseVNode("div", null, [
                createBaseVNode("h2", null, "头像裁剪"),
                createBaseVNode("p", null, "固定裁剪框，拖动图片并缩放后保存。")
              ], -1)),
              createBaseVNode("button", {
                class: "secondary-btn",
                type: "button",
                onClick: openAvatarStudio
              }, " 编辑头像 ")
            ]),
            createBaseVNode("div", _hoisted_14, [
              _cache[12] || (_cache[12] = createBaseVNode("p", { class: "studio-hint" }, "保存后会同步刷新账号页顶部头像和背景。", -1)),
              createBaseVNode("input", {
                ref_key: "avatarInputRef",
                ref: avatarInputRef,
                type: "file",
                accept: "image/*",
                onChange: handleAvatarChange,
                style: { "display": "none" }
              }, null, 544),
              createBaseVNode("div", { class: "studio-actions" }, [
                createBaseVNode("button", {
                  class: "secondary-btn",
                  type: "button",
                  onClick: triggerAvatarInput
                }, "上传/切换"),
                createBaseVNode("button", {
                  class: "secondary-btn danger-btn",
                  type: "button",
                  onClick: resetAvatarToDefault
                }, "恢复默认")
              ])
            ])
          ]),
          createBaseVNode("section", _hoisted_15, [
            createBaseVNode("div", {
              class: "section-head compact-head",
              onClick: _cache[2] || (_cache[2] = ($event) => showPasswordForm.value = !showPasswordForm.value)
            }, [
              _cache[13] || (_cache[13] = createBaseVNode("div", null, [
                createBaseVNode("h2", null, "密码管理"),
                createBaseVNode("p", null, "账号系统已下线，仅保留说明入口。")
              ], -1)),
              createBaseVNode("span", _hoisted_16, toDisplayString(showPasswordForm.value ? "收起" : "展开"), 1)
            ]),
            createVNode(Transition, { name: "slide" }, {
              default: withCtx(() => [
                showPasswordForm.value ? (openBlock(), createElementBlock("div", _hoisted_17, [..._cache[14] || (_cache[14] = [
                  createBaseVNode("p", { class: "password-unavailable" }, "当前版本不再支持云端账号密码修改。", -1)
                ])])) : createCommentVNode("", true)
              ]),
              _: 1
            })
          ]),
          createBaseVNode("section", { class: "section-card account-actions" }, [
            createBaseVNode("button", {
              class: "action-row",
              type: "button",
              onClick: handleSwitchAccount
            }, [..._cache[15] || (_cache[15] = [
              createBaseVNode("span", { class: "action-icon" }, "🔄", -1),
              createBaseVNode("span", { class: "action-label" }, "切换账号", -1),
              createBaseVNode("span", { class: "action-arrow" }, "›", -1)
            ])]),
            createBaseVNode("button", {
              class: "action-row logout-btn",
              type: "button",
              onClick: handleLogout
            }, [..._cache[16] || (_cache[16] = [
              createBaseVNode("span", { class: "action-icon" }, "🚪", -1),
              createBaseVNode("span", { class: "action-label" }, "退出登录", -1),
              createBaseVNode("span", { class: "action-arrow" }, "›", -1)
            ])])
          ])
        ]),
        createVNode(Transition, { name: "fade" }, {
          default: withCtx(() => [
            showAccountPicker.value ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: "overlay-mask",
              onClick: _cache[4] || (_cache[4] = withModifiers(($event) => showAccountPicker.value = false, ["self"]))
            }, [
              createBaseVNode("div", _hoisted_18, [
                _cache[17] || (_cache[17] = createBaseVNode("h3", null, "切换账号", -1)),
                _cache[18] || (_cache[18] = createBaseVNode("p", { class: "picker-hint" }, "选择要切换的本地身份。", -1)),
                createBaseVNode("div", _hoisted_19, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(savedAccounts.value, (acc) => {
                    return openBlock(), createElementBlock("div", {
                      key: acc.id,
                      class: normalizeClass(["account-item", { active: acc.id === currentUserId.value }]),
                      onClick: ($event) => switchToAccount(acc)
                    }, [
                      createBaseVNode("img", {
                        src: acc.avatar || createDefaultAvatarDataUrl(acc.username || acc.email),
                        class: "acc-avatar"
                      }, null, 8, _hoisted_21),
                      createBaseVNode("div", _hoisted_22, [
                        createBaseVNode("span", _hoisted_23, toDisplayString(acc.username || "未命名"), 1),
                        createBaseVNode("span", _hoisted_24, toDisplayString(acc.email), 1)
                      ]),
                      acc.id === currentUserId.value ? (openBlock(), createElementBlock("span", _hoisted_25, "当前")) : createCommentVNode("", true)
                    ], 10, _hoisted_20);
                  }), 128))
                ]),
                createBaseVNode("button", {
                  class: "picker-cancel-btn",
                  type: "button",
                  onClick: _cache[3] || (_cache[3] = ($event) => showAccountPicker.value = false)
                }, "关闭")
              ])
            ])) : createCommentVNode("", true)
          ]),
          _: 1
        }),
        createVNode(ImageCropperDialog, {
          visible: avatarCropperVisible.value,
          src: avatarEditorMediaUrl.value,
          title: "编辑头像",
          "aspect-ratio": 1,
          "output-width": 720,
          "output-height": 720,
          "panel-max-width": 560,
          onClose: closeAvatarCropper,
          onRequestFile: triggerAvatarInput,
          onConfirm: saveAvatarFromEditor
        }, null, 8, ["visible", "src"])
      ]);
    };
  }
};
const UserProfileView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-dedf2a7e"]]);
export {
  UserProfileView as default
};
