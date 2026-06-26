// Running scoreboard for the craft stats
// Animates each element when it enters the viewport, then stops at its target.

(function () {
  function parseTarget(text) {
    const trimmed = (text || "").trim();
    // e.g. "50+" -> { value: 50, suffix: "+" }
    //      "100%" -> { value: 100, suffix: "%" }
    //      "12"   -> { value: 12, suffix: "" }
    const match = trimmed.match(/^(-?\d+(?:\.\d+)?)(.*)$/);
    if (!match) return { value: 0, suffix: trimmed };
    return { value: Number(match[1]), suffix: match[2] || "" };
  }

  function createCounter(el, { durationMs }) {
    const target = parseTarget(el.textContent);

    // Put element into a clean state
    el.setAttribute("data-score-started", "false");
    el.textContent = String(0) + target.suffix;

    let rafId = null;
    let startedAt = null;

    function step(ts) {
      if (!startedAt) startedAt = ts;
      const elapsed = ts - startedAt;

      const t = Math.min(1, elapsed / durationMs);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // easeInOutQuad

      const current = Math.round(target.value * eased);
      el.textContent = String(current) + target.suffix;

      if (t < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        // Ensure exact final value
        el.textContent = String(target.value) + target.suffix;
        el.setAttribute("data-score-started", "true");
      }
    }

    function start() {
      if (el.getAttribute("data-score-started") === "true") return;
      if (rafId) cancelAnimationFrame(rafId);
      startedAt = null;
      rafId = requestAnimationFrame(step);
    }

    return { start };
  }

  function initScoreboards() {
    const counterEls = Array.from(document.querySelectorAll("#craft [data-score]"));

    // If data-score isn't present, fallback to the .fs-2 in the craft stats.
    const targets =
      counterEls.length > 0
        ? counterEls
        : Array.from(document.querySelectorAll("#craft .fs-2"));

    if (!targets.length) return;

    const counters = targets.map((el) =>
      createCounter(el, { durationMs: 1200 })
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            counters[idx].start();
          }
        });
      },
      {
        threshold: 0.35,
      }
    );

    targets.forEach((el) => observer.observe(el));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initScoreboards);
  } else {
    initScoreboards();
  }
})();

