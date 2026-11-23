(function() {
  "use strict";
  function normalizeCoverUrl(url) {
    if (!url) return "";
    return `${url}`.trim().replace(/^http:/, "https:");
  }
  function hashNumber(input) {
    const value = `${input || ""}`;
    let hash = 2166136261;
    for (let i = 0; i < value.length; i += 1) {
      hash = Math.imul(hash ^ value.charCodeAt(i), 16777619) >>> 0;
    }
    return hash >>> 0;
  }
  function buildPlaceholder(video, index) {
    const seed = video?.bvid || video?.url || video?.title || `bili-${index}`;
    const base = hashNumber(seed);
    const hue = base % 360;
    const accent = (hue + 34 + base % 28) % 360;
    return `linear-gradient(135deg, hsl(${hue} 74% 88%) 0%, hsl(${accent} 82% 78%) 100%)`;
  }
  self.onmessage = (event) => {
    const payload = event.data || {};
    if (payload.type !== "hydrate-bili-favorite-videos") return;
    const items = Array.isArray(payload.items) ? payload.items : [];
    const thumbnails = items.map((video, index) => ({
      coverUrl: normalizeCoverUrl(video?.cover),
      coverPlaceholder: buildPlaceholder(video, index)
    }));
    self.postMessage({
      type: "bili-favorite-videos-hydrated",
      jobId: payload.jobId,
      thumbnails
    });
  };
})();
