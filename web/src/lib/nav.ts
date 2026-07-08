// Navigasi produk multi-halaman + reveal. Tiap halaman = URL sendiri, transisi
// via Astro ClientRouter. Listener global dipasang sekali (window-flag, tahan
// re-eval modul); reveal + aria-current + fokus di-refresh per-halaman.

import { gsap } from "gsap";
import { pages } from "../content/nav";

const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
const root = document.documentElement;

function countUp(el: HTMLElement) {
  const end = Number(el.dataset.count || "0");
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  if (REDUCE) { el.textContent = prefix + end + suffix; return; }
  const o = { v: 0 };
  gsap.to(o, { v: end, duration: 1.3, ease: "power2.out", onUpdate: () => (el.textContent = prefix + Math.round(o.v) + suffix) });
}

const cleanPath = (p: string) => p.replace(/\/+$/, "") || "/";

function syncCurrent() {
  const here = cleanPath(location.pathname);
  document.querySelectorAll<HTMLAnchorElement>(".menu-item, .topnav-link").forEach((a) => {
    const at = cleanPath(new URL(a.href).pathname);
    const on = at === here;
    a.setAttribute("aria-current", a.classList.contains("topnav-link") ? (on ? "page" : "false") : String(on));
  });
}

// reveal on-scroll via IntersectionObserver (bukan sekaligus), plus count-up + bar
let io: IntersectionObserver | null = null;
function revealPage() {
  const main = document.getElementById("main");
  if (!main) return;
  io?.disconnect();
  if (REDUCE) {
    main.querySelectorAll<HTMLElement>(".rv").forEach((el) => el.classList.add("in"));
    main.querySelectorAll<HTMLElement>("[data-count]").forEach(countUp);
    main.querySelectorAll<HTMLElement>("[data-bar]").forEach((b) => (b.style.width = b.dataset.bar || "0%"));
    return;
  }
  io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      const el = en.target as HTMLElement;
      el.classList.add("in");
      el.querySelectorAll?.<HTMLElement>("[data-count]").forEach(countUp);
      if (el.dataset.count !== undefined) countUp(el);
      el.querySelectorAll?.<HTMLElement>("[data-bar]").forEach((b) => gsap.fromTo(b, { width: "0%" }, { width: b.dataset.bar || "0%", duration: 1.1, ease: "power2.out" }));
      io?.unobserve(el);
    }
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  main.querySelectorAll<HTMLElement>(".rv").forEach((el, i) => {
    if (el.dataset.delay === undefined) el.style.transitionDelay = `${Math.min((i % 6) * 55, 320)}ms`;
    io!.observe(el);
  });
  // elemen count/bar di atas fold tanpa .rv tetap dianimasikan
  main.querySelectorAll<HTMLElement>("[data-count], [data-bar]").forEach((el) => { if (!el.closest(".rv")) io!.observe(el); });
}

// ── Menu overlay sebagai dialog beraksesibel (mobile nav) ─────────────────
const menuEl = () => document.querySelector<HTMLElement>("[data-menu]");
const menuBtn = () => document.querySelector<HTMLElement>("[data-menu-toggle]");
let lastFocused: HTMLElement | null = null;

function setMenu(open: boolean) {
  root.classList.toggle("menu-open", open);
  const btn = menuBtn();
  const m = menuEl();
  btn?.setAttribute("aria-expanded", String(open));
  btn?.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
  m?.setAttribute("aria-hidden", String(!open));
  document.getElementById("main")?.toggleAttribute("inert", open);
  if (open) {
    lastFocused = document.activeElement as HTMLElement;
    m?.querySelector<HTMLElement>("a.menu-item")?.focus();
  } else {
    (lastFocused ?? btn)?.focus?.();
    lastFocused = null;
  }
}
const closeMenu = () => { if (root.classList.contains("menu-open")) setMenu(false); };

function wireOnce() {
  if ((window as any).__wsWired) return;
  (window as any).__wsWired = true;

  document.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    if (t.closest("[data-menu-toggle]")) setMenu(!root.classList.contains("menu-open"));
    else if (t.classList.contains("deck-menu")) closeMenu();
    else if (t.closest("a.menu-item")) closeMenu();
  });

  addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeMenu(); return; }
    if (!root.classList.contains("menu-open") || e.key !== "Tab") return;
    const items = [...(menuEl()?.querySelectorAll<HTMLElement>("a.menu-item") ?? [])];
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // Spotlight border mengikuti kursor (rAF-throttled, delegated)
  let sRaf = 0, sEl: HTMLElement | null = null, sMx = 50, sMy = 50;
  addEventListener("pointermove", (e) => {
    const el = (e.target as HTMLElement).closest?.(".spot") as HTMLElement | null;
    if (!el) return;
    sEl = el;
    const r = el.getBoundingClientRect();
    sMx = ((e.clientX - r.left) / r.width) * 100;
    sMy = ((e.clientY - r.top) / r.height) * 100;
    if (!sRaf) sRaf = requestAnimationFrame(() => {
      sRaf = 0;
      sEl?.style.setProperty("--mx", sMx + "%");
      sEl?.style.setProperty("--my", sMy + "%");
    });
  }, { passive: true });
}

const SPOT_SEL = ".bezel, .foot-cta, [data-spot]";

let firstLoad = true;
function onLoad() {
  root.classList.remove("menu-open");
  menuBtn()?.setAttribute("aria-expanded", "false");
  menuEl()?.setAttribute("aria-hidden", "true");
  document.getElementById("main")?.removeAttribute("inert");
  syncCurrent();
  revealPage();
  document.querySelectorAll<HTMLElement>(SPOT_SEL).forEach((el) => el.classList.add("spot"));
  wireOnce();
  if (!firstLoad) {
    const main = document.getElementById("main");
    if (main) { main.setAttribute("tabindex", "-1"); main.focus({ preventScroll: true }); }
  }
  firstLoad = false;
}

document.addEventListener("astro:page-load", onLoad);
void pages;
