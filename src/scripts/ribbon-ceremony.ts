// Red ribbon ceremony for launching the site in front of an audience.
//
// Home.astro only imports this when the page is opened with ?ribbon, so normal
// visitors never download it. A red satin ribbon with a bow crosses the home
// page; clicking or tapping it, dragging across it, or pressing Enter, Space,
// or a presentation clicker's "next" key cuts it where it was hit. The halves
// swing down from the edges, the bow drops, confetti in the medallion's colours
// bursts from the cut, and the home film restarts from its first frame.
// Afterwards ?ribbon is dropped from the address, so a refresh shows the
// normal site and the link can be used again to rehearse.
//
// The styles are imported as text and added when the ceremony starts: a plain
// CSS import from this lazily loaded module is dropped from the production build.
import ribbonStyles from "./ribbon-ceremony.css?inline";

type Options = { label: string };

const CONFETTI_COLOURS = ["#2ec4b6", "#8ff0df", "#ffd21f", "#ff9f1c", "#006a2b", "#d0142c", "#ffffff"];

// Keys a presenter is likely to press: Enter and Space, plus what clickers send.
const CUT_KEYS = new Set(["Enter", " ", "ArrowRight", "ArrowDown", "PageDown"]);

const SCISSORS_PATHS =
  "<circle cx='6' cy='6' r='3'/><circle cx='6' cy='18' r='3'/>" +
  "<path d='M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12'/>";

// The bow, drawn flat in the site's poster style. Its knot sits at 49.5% of
// the height, on the ribbon's centre.
const BOW_SVG = `
<svg viewBox="0 0 240 210" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="rb-satin" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ff5a6e"/>
      <stop offset="0.45" stop-color="#e11d38"/>
      <stop offset="1" stop-color="#8f0017"/>
    </linearGradient>
    <linearGradient id="rb-deep" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#c3122c"/>
      <stop offset="1" stop-color="#6d0010"/>
    </linearGradient>
  </defs>
  <g stroke="#5c000d" stroke-opacity="0.55" stroke-width="1.5" stroke-linejoin="round">
    <path fill="url(#rb-deep)" d="M112 108 70 196l16-10 10 18 30-88Z"/>
    <path fill="url(#rb-deep)" d="M128 108l42 88-16-10-10 18-30-88Z"/>
    <path fill="url(#rb-satin)" d="M120 100C96 66 64 40 34 46 10 51 8 86 22 108c16 24 62 16 98-4Z"/>
    <path fill="url(#rb-deep)" d="M120 102c-24-10-50-14-70-8 16 10 46 14 70 12Z"/>
    <path fill="url(#rb-satin)" d="M120 100c24-34 56-60 86-54 24 5 26 40 12 62-16 24-62 16-98-4Z"/>
    <path fill="url(#rb-deep)" d="M120 102c24-10 50-14 70-8-16 10-46 14-70 12Z"/>
    <rect x="103" y="84" width="34" height="40" rx="11" fill="url(#rb-satin)"/>
  </g>
  <path d="M110 90c6-3 14-3 20 0" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="3" stroke-linecap="round"/>
</svg>`;

// The scissors cursor in two halves that pivot where the blades cross, so they
// can snip. Each half is a dark outline under a white stroke. The 24-unit icon
// sits 4 units inside a 32-unit box: at any angle every part stays within 13
// units of the pivot, leaving room for the drop shadow too, because anything
// outside the box gets clipped (Safari clips an element with a CSS filter to its
// own box). The pivot is at (16, 16), which the CSS transform-origin matches.
const cursorHalf = (ring: string, blade: string) => `
  <g stroke="#111" stroke-width="3.4">${ring}<path d="${blade}"/></g>
  <g stroke="#fff" stroke-width="1.7">${ring}<path d="${blade}"/></g>`;

const CURSOR_SVG = `
<svg viewBox="0 0 32 32" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <g class="ribbon-ceremony__cursor-half ribbon-ceremony__cursor-half--a">${cursorHalf("<circle cx='10' cy='10' r='3'/>", "M12.12 12.12 24 24")}</g>
  <g class="ribbon-ceremony__cursor-half ribbon-ceremony__cursor-half--b">${cursorHalf("<circle cx='10' cy='22' r='3'/>", "M12.12 19.88 24 8")}</g>
  <circle cx="16" cy="16" r="1" fill="#111"/>
</svg>`;

export function startRibbonCeremony({ label }: Options) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const style = document.createElement("style");
  style.textContent = ribbonStyles;
  document.head.append(style);

  const overlay = document.createElement("div");
  overlay.className = "ribbon-ceremony";
  overlay.style.setProperty("--ribbon-cursor", scissorsCursor());
  overlay.innerHTML = `
    <button type="button" class="ribbon-ceremony__band">
      <span class="ribbon-ceremony__half ribbon-ceremony__half--left"></span>
      <span class="ribbon-ceremony__half ribbon-ceremony__half--right"></span>
    </button>
    <div class="ribbon-ceremony__bow" aria-hidden="true">${BOW_SVG}</div>`;

  const band = overlay.querySelector<HTMLButtonElement>(".ribbon-ceremony__band")!;
  const [leftHalf, rightHalf] = overlay.querySelectorAll<HTMLElement>(".ribbon-ceremony__half");
  const bow = overlay.querySelector<HTMLElement>(".ribbon-ceremony__bow")!;
  // The label is spoken rather than shown: the scissors cursor says it visually.
  band.setAttribute("aria-label", label);

  document.body.append(overlay);
  band.focus({ preventScroll: true });

  const cursor = followingScissors(reducedMotion);
  const film = holdFilmAtStart();
  let cut = false;

  const cutAt = (clientX: number) => {
    if (cut) return;
    cut = true;

    const rect = band.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, rect.width * 0.08), rect.width * 0.92);
    band.style.setProperty("--cut", `${(x / rect.width) * 100}%`);
    overlay.classList.add("is-cut");
    cursor.cut();
    removeListeners();

    const drop = { duration: reducedMotion ? 300 : 1100, easing: "cubic-bezier(.5,0,.75,0)", fill: "forwards" as const };
    const settle = reducedMotion ? 300 : 1500;

    if (reducedMotion) {
      [leftHalf, rightHalf, bow].forEach((el) => el.animate([{ opacity: 1 }, { opacity: 0 }], drop));
    } else {
      // Each half is held at its outer end, so it swings down and dangles.
      const swing = (el: HTMLElement, angle: number) =>
        el.animate(
          [
            { transform: "rotate(0deg)" },
            { transform: `rotate(${angle * 1.08}deg)`, offset: 0.55 },
            { transform: `rotate(${angle * 0.94}deg)`, offset: 0.78 },
            { transform: `rotate(${angle}deg)` },
          ],
          { duration: 1300, easing: "cubic-bezier(.3,.05,.35,1)", fill: "forwards" },
        );
      swing(leftHalf, 88);
      swing(rightHalf, -88);
      bow.animate(
        [
          { transform: "translate(-50%, -49.5%) rotate(0deg)", opacity: 1 },
          { transform: "translate(-50%, 70vh) rotate(24deg)", opacity: 0 },
        ],
        drop,
      );
      burstConfetti(rect.left + x, rect.top + rect.height / 2);
    }

    film.release();
    dropRibbonFromAddress();

    window.setTimeout(() => {
      overlay
        .animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, fill: "forwards" })
        .finished.then(() => {
          overlay.remove();
          cursor.remove();
        });
    }, settle);
  };

  // Tap or click where the ribbon should be cut. Keyboard activation of the
  // focused ribbon has no pointer position, so it cuts at the bow.
  const bandCentreX = () => {
    const rect = band.getBoundingClientRect();
    return rect.left + rect.width / 2;
  };
  const onClick = (event: MouseEvent) => cutAt(event.detail === 0 ? bandCentreX() : event.clientX);
  const onCentreClick = () => cutAt(bandCentreX());

  // Dragging across the ribbon cuts it where the stroke crossed its centre line.
  let last: { x: number; y: number } | null = null;
  const onPointerDown = (event: PointerEvent) => {
    last = { x: event.clientX, y: event.clientY };
    cursor.press();
  };
  const onPointerMove = (event: PointerEvent) => {
    if (!last) return;
    const rect = band.getBoundingClientRect();
    const mid = rect.top + rect.height / 2;
    const crossed = (last.y - mid) * (event.clientY - mid) < 0;
    if (crossed) {
      const t = (mid - last.y) / (event.clientY - last.y);
      cutAt(last.x + t * (event.clientX - last.x));
    }
    last = { x: event.clientX, y: event.clientY };
  };
  const onPointerUp = () => {
    last = null;
    cursor.release();
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (!CUT_KEYS.has(event.key)) return;
    event.preventDefault();
    cutAt(bandCentreX());
  };

  band.addEventListener("click", onClick);
  bow.addEventListener("click", onCentreClick);
  overlay.addEventListener("pointerdown", onPointerDown);
  overlay.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("keydown", onKeyDown);

  function removeListeners() {
    band.removeEventListener("click", onClick);
    bow.removeEventListener("click", onCentreClick);
    overlay.removeEventListener("pointerdown", onPointerDown);
    overlay.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("keydown", onKeyDown);
  }
}

/**
 * Keeps the home film on its first frame while the ribbon is up, then plays it
 * from the start on the cut. The video mounts after hydration, so it is polled
 * for briefly; reduced-motion and data-saving visitors get no video at all.
 */
function holdFilmAtStart() {
  let video: HTMLVideoElement | null = null;
  let released = false;
  const hold = () => {
    if (!released) video?.pause();
  };

  const started = Date.now();
  const timer = window.setInterval(() => {
    video = document.querySelector<HTMLVideoElement>("figure video");
    if (video) {
      window.clearInterval(timer);
      video.pause();
      video.currentTime = 0;
      video.addEventListener("play", hold);
    } else if (Date.now() - started > 10_000) {
      window.clearInterval(timer);
    }
  }, 100);

  return {
    release() {
      released = true;
      window.clearInterval(timer);
      if (!video) return;
      video.removeEventListener("play", hold);
      video.currentTime = 0;
      video.play().catch(() => {});
    },
  };
}

/**
 * A scissors cursor that follows the mouse: it snips idly as it moves, opens
 * wide over the ribbon, snaps shut on a press and on the cut, and tilts with
 * the movement. A CSS cursor can only be a still image, so the real pointer is
 * hidden while the ceremony runs and this is drawn in its place. Touch screens
 * have no cursor, so they are left alone.
 */
function followingScissors(reducedMotion: boolean) {
  const inactive = { press() {}, release() {}, cut() {}, remove() {} };
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return inactive;

  const el = document.createElement("div");
  el.className = "ribbon-ceremony__cursor";
  el.setAttribute("aria-hidden", "true");
  el.innerHTML = CURSOR_SVG;
  document.body.append(el);
  document.documentElement.classList.add("ribbon-cursor-active");

  let x = 0;
  let y = 0;
  let tilt = 0;
  let targetTilt = 0;
  let lastX = 0;
  let lastTime = 0;
  let frame = 0;

  const draw = () => {
    targetTilt *= 0.88;
    tilt += (targetTilt - tilt) * 0.22;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${tilt.toFixed(2)}deg)`;
    frame = Math.abs(tilt) > 0.05 || Math.abs(targetTilt) > 0.05 ? requestAnimationFrame(draw) : 0;
  };

  const onMove = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    if (!reducedMotion && lastTime) {
      const speed = (event.clientX - lastX) / Math.max(event.timeStamp - lastTime, 8);
      targetTilt = Math.max(-1, Math.min(1, speed / 1.5)) * 20;
    }
    lastX = event.clientX;
    lastTime = event.timeStamp;
    x = event.clientX;
    y = event.clientY;
    el.classList.add("is-visible");
    const target = document.elementFromPoint(x, y);
    el.classList.toggle("is-ready", Boolean(target?.closest(".ribbon-ceremony__band, .ribbon-ceremony__bow")));
    if (!frame) frame = requestAnimationFrame(draw);
  };
  const onOut = (event: MouseEvent) => {
    if (!event.relatedTarget) el.classList.remove("is-visible");
  };

  window.addEventListener("pointermove", onMove);
  window.addEventListener("mouseout", onOut);

  const remove = () => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("mouseout", onOut);
    cancelAnimationFrame(frame);
    document.documentElement.classList.remove("ribbon-cursor-active");
    el.remove();
  };

  return {
    press: () => el.classList.add("is-shut"),
    release: () => el.classList.remove("is-shut"),
    // Snip shut on the cut, then fade and give the real pointer back.
    cut() {
      el.classList.add("is-shut");
      window.setTimeout(() => {
        el.classList.add("is-done");
        window.setTimeout(remove, 260);
      }, 380);
    },
    remove,
  };
}

function dropRibbonFromAddress() {
  const url = new URL(window.location.href);
  url.searchParams.delete("ribbon");
  window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
}

function scissorsCursor() {
  // Large white scissors with a dark outline, so the cursor reads on the red
  // ribbon from across a room. Browsers ignore cursors over 128px.
  const svg =
    "<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 24 24' fill='none' stroke-linecap='round' stroke-linejoin='round'>" +
    `<g stroke='#111' stroke-width='4'>${SCISSORS_PATHS}</g>` +
    `<g stroke='#fff' stroke-width='2'>${SCISSORS_PATHS}</g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 48 48, crosshair`;
}

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  spin: number;
  spinSpeed: number;
  flip: number;
  flipSpeed: number;
  colour: string;
};

/** Confetti from the cut, plus two bursts from the bottom corners. */
function burstConfetti(originX: number, originY: number) {
  const canvas = document.createElement("canvas");
  canvas.className = "ribbon-ceremony__confetti";
  canvas.setAttribute("aria-hidden", "true");
  document.body.append(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas.remove();

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const resize = () => {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
  };
  resize();
  window.addEventListener("resize", resize);

  const scale = Math.min(1, window.innerWidth / 1200) * 0.4 + 0.6;
  const make = (x: number, y: number, angle: number, spread: number, speed: number): Piece => {
    const a = angle + (Math.random() - 0.5) * spread;
    const v = speed * (0.55 + Math.random() * 0.75) * scale;
    return {
      x,
      y,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v,
      w: (6 + Math.random() * 6) * scale,
      h: (10 + Math.random() * 10) * scale,
      spin: Math.random() * Math.PI,
      spinSpeed: (Math.random() - 0.5) * 0.3,
      flip: Math.random() * Math.PI * 2,
      flipSpeed: 0.08 + Math.random() * 0.12,
      colour: CONFETTI_COLOURS[Math.floor(Math.random() * CONFETTI_COLOURS.length)],
    };
  };

  const h = window.innerHeight;
  const w = window.innerWidth;
  const pieces: Piece[] = [
    ...Array.from({ length: 160 }, () => make(originX, originY, -Math.PI / 2, Math.PI * 1.2, 17)),
    ...Array.from({ length: 70 }, () => make(0, h, -Math.PI / 3, 0.6, 24)),
    ...Array.from({ length: 70 }, () => make(w, h, (-2 * Math.PI) / 3, 0.6, 24)),
  ];

  const started = performance.now();
  let previous = started;
  const frame = (now: number) => {
    const dt = Math.min((now - previous) / 16.67, 3);
    previous = now;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    let alive = 0;
    for (const p of pieces) {
      p.vy += 0.32 * dt;
      p.vx *= Math.pow(0.985, dt);
      p.vy *= Math.pow(0.985, dt);
      p.x += p.vx * dt + Math.sin(p.flip) * 0.6;
      p.y += p.vy * dt;
      p.spin += p.spinSpeed * dt;
      p.flip += p.flipSpeed * dt;
      if (p.y > window.innerHeight + 40) continue;
      alive++;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.spin);
      ctx.scale(1, Math.cos(p.flip));
      ctx.fillStyle = p.colour;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    if (alive > 0 && now - started < 7000) {
      requestAnimationFrame(frame);
    } else {
      window.removeEventListener("resize", resize);
      canvas.remove();
    }
  };
  requestAnimationFrame(frame);
}
