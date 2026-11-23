import { _ as _export_sfc, f as apiRequest } from "./index.js";
import { M as ref, c as computed, I as openBlock, g as createElementBlock, d as createBaseVNode, Y as toDisplayString, F as Fragment, O as renderList, w as normalizeClass, f as createCommentVNode } from "./vendor.js";
const _hoisted_1 = { class: "listen-stats-view" };
const _hoisted_2 = { class: "stats-summary-card" };
const _hoisted_3 = { class: "summary-grid" };
const _hoisted_4 = { class: "summary-item" };
const _hoisted_5 = { class: "summary-value" };
const _hoisted_6 = { class: "summary-item" };
const _hoisted_7 = { class: "summary-value" };
const _hoisted_8 = { class: "summary-item" };
const _hoisted_9 = { class: "summary-value" };
const _hoisted_10 = { class: "rank-section" };
const _hoisted_11 = { class: "section-header" };
const _hoisted_12 = { class: "period-tip" };
const _hoisted_13 = { class: "period-switch-row" };
const _hoisted_14 = ["disabled", "onClick"];
const _hoisted_15 = {
  key: 0,
  class: "section-loading"
};
const _hoisted_16 = {
  key: 1,
  class: "section-empty"
};
const _hoisted_17 = {
  key: 2,
  class: "rank-list"
};
const _hoisted_18 = { class: "rank-index" };
const _hoisted_19 = ["src"];
const _hoisted_20 = { class: "rank-main" };
const _hoisted_21 = { class: "rank-title" };
const _hoisted_22 = { class: "rank-sub" };
const _hoisted_23 = { class: "rank-duration" };
const _hoisted_24 = {
  key: 3,
  class: "section-refreshing"
};
const _hoisted_25 = ["disabled"];
const _hoisted_26 = { class: "rank-section" };
const _hoisted_27 = { class: "section-header" };
const _hoisted_28 = { class: "period-tip" };
const _hoisted_29 = { class: "period-switch-row" };
const _hoisted_30 = ["disabled", "onClick"];
const _hoisted_31 = {
  key: 0,
  class: "section-loading"
};
const _hoisted_32 = {
  key: 1,
  class: "section-empty"
};
const _hoisted_33 = {
  key: 2,
  class: "rank-list"
};
const _hoisted_34 = { class: "rank-index" };
const _hoisted_35 = ["src"];
const _hoisted_36 = { class: "rank-main" };
const _hoisted_37 = { class: "rank-title" };
const _hoisted_38 = { class: "rank-sub" };
const _hoisted_39 = { class: "rank-duration" };
const _hoisted_40 = {
  key: 3,
  class: "section-refreshing"
};
const _hoisted_41 = {
  key: 0,
  class: "top20-hint"
};
const _hoisted_42 = ["disabled"];
const _hoisted_43 = {
  key: 0,
  class: "error-text"
};
const DEFAULT_RANK_LIMIT = 20;
const _sfc_main = /* @__PURE__ */ Object.assign({
  name: "ListenStatsView"
}, {
  __name: "ListenStatsView",
  setup(__props) {
    const periodOptions = [
      { value: "history", label: "历史" },
      { value: "day", label: "日度" },
      { value: "week", label: "周度" },
      { value: "month", label: "月度" },
      { value: "year", label: "年度" }
    ];
    const periodLabelMap = {
      history: "历史",
      day: "日度",
      week: "周度",
      month: "月度",
      year: "年度"
    };
    const playlistPeriod = ref("history");
    const songPeriod = ref("history");
    const playlistLoading = ref(false);
    const songLoading = ref(false);
    const errorMessage = ref("");
    const summary = ref({
      total_listen_sec: 0,
      playlist_count: 0,
      song_count: 0
    });
    const playlistRows = ref([]);
    const songRows = ref([]);
    const playlistRankingsTotal = ref(0);
    const songRankingsTotal = ref(0);
    const playlistExpanded = ref(false);
    const songExpandStage = ref("collapsed");
    let playlistRequestToken = 0;
    let songRequestToken = 0;
    const playlistPeriodLabel = computed(() => periodLabelMap[playlistPeriod.value] || "历史");
    const songPeriodLabel = computed(() => periodLabelMap[songPeriod.value] || "历史");
    const playlistInitialLoading = computed(() => playlistLoading.value && playlistRows.value.length === 0);
    const playlistRefreshing = computed(() => playlistLoading.value && playlistRows.value.length > 0);
    const songInitialLoading = computed(() => songLoading.value && songRows.value.length === 0);
    const songRefreshing = computed(() => songLoading.value && songRows.value.length > 0);
    const visiblePlaylistRows = computed(() => {
      if (playlistExpanded.value) return playlistRows.value;
      return playlistRows.value.slice(0, 3);
    });
    const visibleSongRows = computed(() => {
      if (songExpandStage.value === "all") return songRows.value;
      if (songExpandStage.value === "top20") return songRows.value.slice(0, 20);
      return songRows.value.slice(0, 3);
    });
    const playlistExpandActionText = computed(() => {
      return playlistExpanded.value ? "收起" : `展开全部（${playlistRankingsTotal.value}）`;
    });
    const showSongTop20Hint = computed(() => {
      return songExpandStage.value === "top20" && songRankingsTotal.value > 20;
    });
    const songExpandActionText = computed(() => {
      if (songExpandStage.value === "collapsed") return "展开详情";
      if (songExpandStage.value === "top20" && songRankingsTotal.value > songRows.value.length) {
        return `展开全部（${songRankingsTotal.value}）`;
      }
      if (songExpandStage.value === "top20" && songRankingsTotal.value > 20) {
        return `展开全部（${songRankingsTotal.value}）`;
      }
      return "收起";
    });
    function buildStatsUrl(params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value === void 0 || value === null || value === "") return;
        searchParams.set(key, String(value));
      });
      return `/api/account/listen-stats?${searchParams.toString()}`;
    }
    async function requestStats(params) {
      const response = await apiRequest(buildStatsUrl(params));
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    }
    function applySummary(data) {
      summary.value = data?.summary || { total_listen_sec: 0, playlist_count: 0, song_count: 0 };
    }
    function applyPlaylistRankings(data) {
      const rows = Array.isArray(data?.playlist_rankings) ? data.playlist_rankings : [];
      playlistRows.value = rows;
      const total = Number(data?.playlist_rankings_total);
      playlistRankingsTotal.value = Number.isFinite(total) && total >= rows.length ? total : rows.length;
    }
    function applySongRankings(data) {
      const rows = Array.isArray(data?.song_rankings) ? data.song_rankings : [];
      songRows.value = rows;
      const total = Number(data?.song_rankings_total);
      songRankingsTotal.value = Number.isFinite(total) && total >= rows.length ? total : rows.length;
    }
    async function loadInitialStats() {
      playlistLoading.value = true;
      songLoading.value = true;
      errorMessage.value = "";
      try {
        const data = await requestStats({
          period: "history",
          scope: "all",
          playlistLimit: DEFAULT_RANK_LIMIT,
          songLimit: DEFAULT_RANK_LIMIT
        });
        applySummary(data);
        applyPlaylistRankings(data);
        applySongRankings(data);
      } catch (error) {
        console.error("load listen stats failed:", error);
        errorMessage.value = `加载失败：${error.message || "未知错误"}`;
      } finally {
        playlistLoading.value = false;
        songLoading.value = false;
      }
    }
    async function loadPlaylistRanking(period = playlistPeriod.value, { limit = DEFAULT_RANK_LIMIT } = {}) {
      const token = ++playlistRequestToken;
      playlistLoading.value = true;
      errorMessage.value = "";
      try {
        const data = await requestStats({
          period,
          scope: "playlist",
          playlistLimit: limit
        });
        if (token !== playlistRequestToken) return;
        applyPlaylistRankings(data);
      } catch (error) {
        if (token !== playlistRequestToken) return;
        console.error("load playlist listen ranking failed:", error);
        errorMessage.value = `歌单榜加载失败：${error.message || "未知错误"}`;
      } finally {
        if (token === playlistRequestToken) {
          playlistLoading.value = false;
        }
      }
    }
    async function loadSongRanking(period = songPeriod.value, { limit = DEFAULT_RANK_LIMIT } = {}) {
      const token = ++songRequestToken;
      songLoading.value = true;
      errorMessage.value = "";
      try {
        const data = await requestStats({
          period,
          scope: "song",
          songLimit: limit
        });
        if (token !== songRequestToken) return;
        applySongRankings(data);
      } catch (error) {
        if (token !== songRequestToken) return;
        console.error("load song listen ranking failed:", error);
        errorMessage.value = `单曲榜加载失败：${error.message || "未知错误"}`;
      } finally {
        if (token === songRequestToken) {
          songLoading.value = false;
        }
      }
    }
    function changePlaylistPeriod(period) {
      if (playlistPeriod.value === period || playlistLoading.value) return;
      playlistPeriod.value = period;
      playlistExpanded.value = false;
      loadPlaylistRanking(period);
    }
    function changeSongPeriod(period) {
      if (songPeriod.value === period || songLoading.value) return;
      songPeriod.value = period;
      songExpandStage.value = "collapsed";
      loadSongRanking(period);
    }
    async function handlePlaylistExpandAction() {
      if (playlistExpanded.value) {
        playlistExpanded.value = false;
        return;
      }
      if (playlistRankingsTotal.value > playlistRows.value.length) {
        await loadPlaylistRanking(playlistPeriod.value, { limit: 0 });
      }
      playlistExpanded.value = true;
    }
    async function handleSongExpandAction() {
      if (songExpandStage.value === "collapsed") {
        songExpandStage.value = songRankingsTotal.value > 20 ? "top20" : "all";
        return;
      }
      if (songExpandStage.value === "top20" && songRankingsTotal.value > songRows.value.length) {
        await loadSongRanking(songPeriod.value, { limit: 0 });
        songExpandStage.value = "all";
        return;
      }
      if (songExpandStage.value === "top20" && songRankingsTotal.value > 20) {
        songExpandStage.value = "all";
        return;
      }
      songExpandStage.value = "collapsed";
    }
    function formatHours(seconds) {
      const totalSeconds = Number(seconds);
      if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return "0.0";
      return (totalSeconds / 3600).toFixed(1);
    }
    function formatDuration(seconds) {
      const totalSeconds = Math.max(0, Number(seconds) || 0);
      const hours = Math.floor(totalSeconds / 3600);
      const mins = Math.floor(totalSeconds % 3600 / 60);
      const secs = Math.floor(totalSeconds % 60);
      if (hours > 0) return `${hours}h ${mins}m`;
      if (mins > 0) return `${mins}m ${secs}s`;
      return `${secs}s`;
    }
    function resolveSongCover(row) {
      const cover = `${row?.cover || ""}`.trim();
      if (cover) return cover;
      const hashId = `${row?.hash_id || ""}`.trim();
      return hashId ? `/api/cover/${hashId}` : "/api/cover/random?seed=listen-stats";
    }
    loadInitialStats();
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("section", _hoisted_2, [
          _cache[3] || (_cache[3] = createBaseVNode("h2", { class: "summary-title" }, "收听时长统计", -1)),
          _cache[4] || (_cache[4] = createBaseVNode("p", { class: "summary-subtitle" }, "统计范围仅包含下载的歌曲", -1)),
          createBaseVNode("div", _hoisted_3, [
            createBaseVNode("div", _hoisted_4, [
              createBaseVNode("span", _hoisted_5, toDisplayString(formatHours(summary.value.total_listen_sec)), 1),
              _cache[0] || (_cache[0] = createBaseVNode("span", { class: "summary-label" }, "总播放时长（h）", -1))
            ]),
            createBaseVNode("div", _hoisted_6, [
              createBaseVNode("span", _hoisted_7, toDisplayString(Number(summary.value.playlist_count || 0)), 1),
              _cache[1] || (_cache[1] = createBaseVNode("span", { class: "summary-label" }, "歌单条目", -1))
            ]),
            createBaseVNode("div", _hoisted_8, [
              createBaseVNode("span", _hoisted_9, toDisplayString(Number(summary.value.song_count || 0)), 1),
              _cache[2] || (_cache[2] = createBaseVNode("span", { class: "summary-label" }, "歌曲条目", -1))
            ])
          ])
        ]),
        createBaseVNode("section", _hoisted_10, [
          createBaseVNode("div", _hoisted_11, [
            _cache[5] || (_cache[5] = createBaseVNode("h3", null, "歌单时长榜", -1)),
            createBaseVNode("span", _hoisted_12, toDisplayString(playlistPeriodLabel.value), 1)
          ]),
          createBaseVNode("div", _hoisted_13, [
            (openBlock(), createElementBlock(Fragment, null, renderList(periodOptions, (item) => {
              return createBaseVNode("button", {
                key: item.value,
                class: normalizeClass(["period-btn", { active: playlistPeriod.value === item.value }]),
                disabled: playlistLoading.value,
                onClick: ($event) => changePlaylistPeriod(item.value)
              }, toDisplayString(item.label), 11, _hoisted_14);
            }), 64))
          ]),
          createBaseVNode("div", {
            class: normalizeClass(["rank-body", { "is-refreshing": playlistRefreshing.value }])
          }, [
            playlistInitialLoading.value ? (openBlock(), createElementBlock("div", _hoisted_15, "加载中...")) : playlistRows.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_16, "暂无歌单时长数据")) : (openBlock(), createElementBlock("div", _hoisted_17, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(visiblePlaylistRows.value, (row) => {
                return openBlock(), createElementBlock("article", {
                  key: row.playlist_id,
                  class: "rank-item"
                }, [
                  createBaseVNode("div", _hoisted_18, toDisplayString(row.rank), 1),
                  createBaseVNode("img", {
                    class: "rank-cover",
                    src: row.cover,
                    alt: "cover"
                  }, null, 8, _hoisted_19),
                  createBaseVNode("div", _hoisted_20, [
                    createBaseVNode("h4", _hoisted_21, toDisplayString(row.playlist_name || row.playlist_id), 1),
                    createBaseVNode("p", _hoisted_22, toDisplayString(Number(row.active_track_count || 0)) + " / " + toDisplayString(Number(row.track_count || 0)) + " 首有时长", 1)
                  ]),
                  createBaseVNode("div", _hoisted_23, toDisplayString(formatDuration(row.total_listen_sec)), 1)
                ]);
              }), 128))
            ])),
            playlistRefreshing.value ? (openBlock(), createElementBlock("div", _hoisted_24, "更新中...")) : createCommentVNode("", true)
          ], 2),
          playlistRankingsTotal.value > 3 ? (openBlock(), createElementBlock("button", {
            key: 0,
            class: "expand-btn",
            disabled: playlistLoading.value,
            onClick: handlePlaylistExpandAction
          }, toDisplayString(playlistExpandActionText.value), 9, _hoisted_25)) : createCommentVNode("", true)
        ]),
        createBaseVNode("section", _hoisted_26, [
          createBaseVNode("div", _hoisted_27, [
            _cache[6] || (_cache[6] = createBaseVNode("h3", null, "单曲时长榜", -1)),
            createBaseVNode("span", _hoisted_28, toDisplayString(songPeriodLabel.value), 1)
          ]),
          createBaseVNode("div", _hoisted_29, [
            (openBlock(), createElementBlock(Fragment, null, renderList(periodOptions, (item) => {
              return createBaseVNode("button", {
                key: `song-${item.value}`,
                class: normalizeClass(["period-btn", { active: songPeriod.value === item.value }]),
                disabled: songLoading.value,
                onClick: ($event) => changeSongPeriod(item.value)
              }, toDisplayString(item.label), 11, _hoisted_30);
            }), 64))
          ]),
          createBaseVNode("div", {
            class: normalizeClass(["rank-body", { "is-refreshing": songRefreshing.value }])
          }, [
            songInitialLoading.value ? (openBlock(), createElementBlock("div", _hoisted_31, "加载中...")) : songRows.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_32, "暂无单曲时长数据")) : (openBlock(), createElementBlock("div", _hoisted_33, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(visibleSongRows.value, (row) => {
                return openBlock(), createElementBlock("article", {
                  key: row.hash_id,
                  class: "rank-item"
                }, [
                  createBaseVNode("div", _hoisted_34, toDisplayString(row.rank), 1),
                  createBaseVNode("img", {
                    class: "rank-cover",
                    src: resolveSongCover(row),
                    alt: "cover"
                  }, null, 8, _hoisted_35),
                  createBaseVNode("div", _hoisted_36, [
                    createBaseVNode("h4", _hoisted_37, toDisplayString(row.title || row.hash_id), 1),
                    createBaseVNode("p", _hoisted_38, toDisplayString(row.artist || "未知歌手"), 1)
                  ]),
                  createBaseVNode("div", _hoisted_39, toDisplayString(formatDuration(row.total_listen_sec)), 1)
                ]);
              }), 128))
            ])),
            songRefreshing.value ? (openBlock(), createElementBlock("div", _hoisted_40, "更新中...")) : createCommentVNode("", true)
          ], 2),
          showSongTop20Hint.value ? (openBlock(), createElementBlock("p", _hoisted_41, "当前展示前 20 项，点击可继续展开。")) : createCommentVNode("", true),
          songRankingsTotal.value > 3 ? (openBlock(), createElementBlock("button", {
            key: 1,
            class: "expand-btn",
            disabled: songLoading.value,
            onClick: handleSongExpandAction
          }, toDisplayString(songExpandActionText.value), 9, _hoisted_42)) : createCommentVNode("", true)
        ]),
        errorMessage.value ? (openBlock(), createElementBlock("p", _hoisted_43, toDisplayString(errorMessage.value), 1)) : createCommentVNode("", true)
      ]);
    };
  }
});
const ListenStatsView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b402e219"]]);
export {
  ListenStatsView as default
};
