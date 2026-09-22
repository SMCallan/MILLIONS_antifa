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

// A satin bow: folded loops with their openings, a gathered knot, and tails
// with V-cut ends. Its knot sits at 45.5% of the height, on the ribbon's centre.
const BOW_SVG = `
<svg viewBox="0 0 400 330" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="rb-blur2" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2"/></filter>
    <filter id="rb-blur5" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>
    <linearGradient id="rb-loop" gradientUnits="userSpaceOnUse" x1="188" y1="150" x2="32" y2="112">
      <stop offset="0" stop-color="#4f0711"/>
      <stop offset="0.22" stop-color="#8a0e22"/>
      <stop offset="0.6" stop-color="#c9192f"/>
      <stop offset="0.9" stop-color="#b3132a"/>
      <stop offset="1" stop-color="#7a0c1c"/>
    </linearGradient>
    <linearGradient id="rb-loop-shade" gradientUnits="userSpaceOnUse" x1="0" y1="80" x2="0" y2="178">
      <stop offset="0" stop-color="#ff8f9c" stop-opacity="0.18"/>
      <stop offset="0.45" stop-color="#ff8f9c" stop-opacity="0"/>
      <stop offset="0.7" stop-color="#1e0004" stop-opacity="0.1"/>
      <stop offset="1" stop-color="#1e0004" stop-opacity="0.45"/>
    </linearGradient>
    <linearGradient id="rb-hole" gradientUnits="userSpaceOnUse" x1="64" y1="138" x2="168" y2="152">
      <stop offset="0" stop-color="#240206"/>
      <stop offset="0.6" stop-color="#4a0610"/>
      <stop offset="1" stop-color="#6e0b19"/>
    </linearGradient>
    <linearGradient id="rb-hole-top" gradientUnits="userSpaceOnUse" x1="0" y1="124" x2="0" y2="160">
      <stop offset="0" stop-color="#120002" stop-opacity="0.7"/>
      <stop offset="0.6" stop-color="#120002" stop-opacity="0"/>
    </linearGradient>

    <linearGradient id="rb-tail-across" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#650a17"/>
      <stop offset="0.4" stop-color="#bd152d"/>
      <stop offset="0.56" stop-color="#df2d46"/>
      <stop offset="1" stop-color="#730c1b"/>
    </linearGradient>
    <linearGradient id="rb-tail-along" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1e0004" stop-opacity="0.7"/>
      <stop offset="0.3" stop-color="#1e0004" stop-opacity="0"/>
      <stop offset="0.85" stop-color="#1e0004" stop-opacity="0"/>
      <stop offset="1" stop-color="#1e0004" stop-opacity="0.3"/>
    </linearGradient>
    <linearGradient id="rb-knot-across" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#4f0711"/>
      <stop offset="0.28" stop-color="#b3132a"/>
      <stop offset="0.5" stop-color="#e8384f"/>
      <stop offset="0.72" stop-color="#b3132a"/>
      <stop offset="1" stop-color="#4f0711"/>
    </linearGradient>
    <linearGradient id="rb-knot-ends" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1e0004" stop-opacity="0.55"/>
      <stop offset="0.22" stop-color="#1e0004" stop-opacity="0"/>
      <stop offset="0.78" stop-color="#1e0004" stop-opacity="0"/>
      <stop offset="1" stop-color="#1e0004" stop-opacity="0.6"/>
    </linearGradient>

    <path id="rb-loop-outline" d="M186 138C164 116 132 84 98 76 70 70 44 78 36 100 30 118 32 142 44 156 60 172 94 178 130 176 154 175 172 170 186 164Z"/>
    <clipPath id="rb-loop-clip"><use href="#rb-loop-outline"/></clipPath>
    <clipPath id="rb-tail-clip"><use href="#rb-tail-outline"/></clipPath>
    <path id="rb-tail-outline" d="M186 166C180 196 162 226 150 252 140 274 132 288 124 302L146 292 154 316C164 290 176 266 184 242 194 214 202 192 206 172Z"/>

    <g id="rb-loop-shape">
      <use href="#rb-loop-outline" fill="url(#rb-loop)"/>
      <use href="#rb-loop-outline" fill="url(#rb-loop-shade)"/>
      <g clip-path="url(#rb-loop-clip)">
      <path d="M184 140C168 124 148 108 124 100" fill="none" stroke="#1e0004" stroke-opacity="0.3" stroke-width="3" filter="url(#rb-blur2)"/>
      <path d="M184 158C166 164 146 168 122 169" fill="none" stroke="#1e0004" stroke-opacity="0.25" stroke-width="3" filter="url(#rb-blur2)"/>
      <path d="M176 134C154 112 124 92 96 88 74 86 56 95 46 110" fill="none" stroke="#ff9aa8" stroke-opacity="0.38" stroke-width="11" stroke-linecap="round" filter="url(#rb-blur5)"/>
      <path d="M170 128C150 108 124 90 98 84" fill="none" stroke="#ffe3e7" stroke-opacity="0.3" stroke-width="3" stroke-linecap="round" filter="url(#rb-blur2)"/>
      <path d="M72 163C102 172 140 170 176 161" fill="none" stroke="#ff8a97" stroke-opacity="0.22" stroke-width="7" stroke-linecap="round" filter="url(#rb-blur5)"/>
      <path fill="url(#rb-hole)" d="M166 152C140 140 104 126 78 126 62 126 58 136 68 144 90 158 130 160 166 154Z"/>
      <path fill="url(#rb-hole-top)" d="M166 152C140 140 104 126 78 126 62 126 58 136 68 144 90 158 130 160 166 154Z"/>
      <path d="M70 144C92 156 128 158 162 154" fill="none" stroke="#ff7486" stroke-opacity="0.35" stroke-width="3" filter="url(#rb-blur2)"/>
      </g>
      <path clip-path="url(#rb-loop-clip)" d="M42 102C34 118 36 138 48 154" fill="none" stroke="#2a0006" stroke-opacity="0.4" stroke-width="4" filter="url(#rb-blur2)"/>
      <use href="#rb-loop-outline" fill="none" stroke="#5c0914" stroke-opacity="0.3" stroke-width="1"/>
    </g>

    <g id="rb-tail-shape">
      <use href="#rb-tail-outline" fill="url(#rb-tail-across)"/>
      <use href="#rb-tail-outline" fill="url(#rb-tail-along)"/>
      <path clip-path="url(#rb-tail-clip)" d="M195 182C188 212 172 240 162 262 154 280 146 292 140 302" fill="none" stroke="#ffc9d0" stroke-opacity="0.3" stroke-width="5" stroke-linecap="round" filter="url(#rb-blur2)"/>
      <use href="#rb-tail-outline" fill="none" stroke="#5c0914" stroke-opacity="0.3" stroke-width="1"/>
    </g>
  </defs>

  <use href="#rb-tail-shape"/>
  <use href="#rb-tail-shape" transform="translate(400 0) scale(-1 1) rotate(-6 200 165)"/>

  <use href="#rb-loop-shape"/>
  <use href="#rb-loop-shape" transform="translate(400 0) scale(-1 1) rotate(3 186 151)"/>

  <path id="rb-knot" fill="url(#rb-knot-across)" d="M180 126C192 121 208 121 220 126 216 140 216 162 220 176 208 182 192 182 180 176 184 162 184 140 180 126Z"/>
  <path fill="url(#rb-knot-ends)" d="M180 126C192 121 208 121 220 126 216 140 216 162 220 176 208 182 192 182 180 176 184 162 184 140 180 126Z"/>
  <path d="M185 137C194 141 206 141 215 137M185 166C194 162 206 162 215 166" fill="none" stroke="#1e0004" stroke-opacity="0.35" stroke-width="1.6" filter="url(#rb-blur2)"/>
  <path d="M200 128C201 144 201 160 200 175" fill="none" stroke="#ffe3e7" stroke-opacity="0.45" stroke-width="5" stroke-linecap="round" filter="url(#rb-blur2)"/>
  <path d="M180 126C192 121 208 121 220 126 216 140 216 162 220 176 208 182 192 182 180 176 184 162 184 140 180 126Z" fill="none" stroke="#5c0914" stroke-opacity="0.35" stroke-width="1"/>
</svg>`;

// Ceremonial scissors pointing up at the ribbon: steel blades, dark handles.
// Each half pivots on the screw at (60, 104) so CSS can snip them open and shut.
const SCISSORS_HALF = `
  <path fill="url(#sc-steel)" d="M60 110 55 40C54 22 56 12 60 2 63 14 65 30 65 56L64 110Z"/>
  <path d="M60.5 8C62.5 22 63.5 42 63.5 100" fill="none" stroke="#fff" stroke-opacity="0.7" stroke-width="1.2"/>
  <path fill="url(#sc-handle)" fill-rule="evenodd" d="M58 100 66 104 78 146C96 146 108 160 106 178 104 196 86 206 70 200 54 194 50 176 58 162L66 150ZM72 164C62 168 62 186 72 190 84 194 94 184 92 172 90 162 80 160 72 164Z"/>
  <path d="M82 150C96 152 104 164 102 178" fill="none" stroke="#fff" stroke-opacity="0.18" stroke-width="2" stroke-linecap="round"/>`;

const SCISSORS_SVG = `
<svg viewBox="0 0 120 210" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sc-steel" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#7d8691"/>
      <stop offset="0.45" stop-color="#e9edf1"/>
      <stop offset="0.55" stop-color="#ffffff"/>
      <stop offset="0.78" stop-color="#b3bbc4"/>
      <stop offset="1" stop-color="#65707c"/>
    </linearGradient>
    <linearGradient id="sc-handle" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#46464d"/>
      <stop offset="1" stop-color="#101012"/>
    </linearGradient>
    <radialGradient id="sc-screw" cx="0.4" cy="0.35" r="0.7">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="1" stop-color="#8e959d"/>
    </radialGradient>
  </defs>
  <g class="ribbon-ceremony__blade ribbon-ceremony__blade--a">${SCISSORS_HALF}</g>
  <g class="ribbon-ceremony__blade ribbon-ceremony__blade--b"><g transform="translate(120 0) scale(-1 1)">${SCISSORS_HALF}</g></g>
  <circle cx="60" cy="104" r="6" fill="url(#sc-screw)" stroke="#5a6068" stroke-width="0.8"/>
  <circle cx="60" cy="104" r="1.6" fill="#5a6068"/>
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
    <div class="ribbon-ceremony__bow" aria-hidden="true">${BOW_SVG}</div>
    <div class="ribbon-ceremony__scissors" aria-hidden="true">${SCISSORS_SVG}</div>`;

  const band = overlay.querySelector<HTMLButtonElement>(".ribbon-ceremony__band")!;
  const [leftHalf, rightHalf] = overlay.querySelectorAll<HTMLElement>(".ribbon-ceremony__half");
  const bow = overlay.querySelector<HTMLElement>(".ribbon-ceremony__bow")!;
  const scissors = overlay.querySelector<HTMLElement>(".ribbon-ceremony__scissors")!;
  // The label is spoken rather than shown: the scissors say it visually.
  band.setAttribute("aria-label", label);

  document.body.append(overlay);
  band.focus({ preventScroll: true });

  const film = holdFilmAtStart();
  let cut = false;

  const cutAt = (clientX: number) => {
    if (cut) return;
    cut = true;

    const rect = band.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, rect.width * 0.08), rect.width * 0.92);
    band.style.setProperty("--cut", `${(x / rect.width) * 100}%`);
    overlay.classList.add("is-cut");
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
          { transform: "translate(-50%, -45.5%) rotate(0deg)", opacity: 1 },
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
        .finished.then(() => overlay.remove());
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
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (!CUT_KEYS.has(event.key)) return;
    event.preventDefault();
    cutAt(bandCentreX());
  };

  band.addEventListener("click", onClick);
  bow.addEventListener("click", onCentreClick);
  scissors.addEventListener("click", onCentreClick);
  overlay.addEventListener("pointerdown", onPointerDown);
  overlay.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("keydown", onKeyDown);

  function removeListeners() {
    band.removeEventListener("click", onClick);
    bow.removeEventListener("click", onCentreClick);
    scissors.removeEventListener("click", onCentreClick);
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

function dropRibbonFromAddress() {
  const url = new URL(window.location.href);
  url.searchParams.delete("ribbon");
  window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
}

function scissorsCursor() {
  // White scissors with a dark outline, so the cursor reads on the red ribbon.
  const svg =
    "<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke-linecap='round' stroke-linejoin='round'>" +
    `<g stroke='#111' stroke-width='4'>${SCISSORS_PATHS}</g>` +
    `<g stroke='#fff' stroke-width='2'>${SCISSORS_PATHS}</g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 24 24, crosshair`;
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
