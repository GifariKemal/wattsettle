// Navigasi multi-halaman + reveal. Tiap halaman = URL sendiri; transisi via
// Astro ClientRouter. Listener global dipasang sekali (window-flag, tahan
// re-eval modul); reveal + aria-current + fokus di-refresh per-halaman.

import { gsap } from "gsap";
import { navigate } from "astro:transitions/client";
import { pages, href } from "../content/nav";

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
  document.querySelectorAll<HTMLAnchorElement>(".menu-item, .deck-rail a").forEach((a) => {
    const at = cleanPath(new URL(a.href).pathname);
    a.setAttribute("aria-current", at === here ? "true" : "false");
  });
}

function revealPage() {
  const main = document.getElementById("main");
  if (!main) return;
  main.querySelectorAll<HTMLElement>(".rv").forEach((el, i) => {
    if (el.dataset.delay === undefined) el.style.transitionDelay = `${Math.min(i * 55, 480)}ms`;
    el.classList.add("in");
  });
  main.querySelectorAll<HTMLElement>("[data-count]").forEach(countUp);
  main.querySelectorAll<HTMLElement>("[data-bar]").forEach((bar) => {
    const target = bar.dataset.bar || "0%";
    REDUCE ? (bar.style.width = target) : gsap.fromTo(bar, { width: "0%" }, { width: target, duration: 1.1, ease: "power2.out", delay: 0.15 });
  });
}

// ── Menu overlay sebagai dialog beraksesibel ──────────────────────────────
const menuEl = () => document.querySelector<HTMLElement>("[data-menu]");
const menuBtn = () => document.querySelector<HTMLElement>("[data-menu-toggle]");
let lastFocused: HTMLElement | null = null;

function setMenu(open: boolean) {
  root.classList.toggle("menu-open", open);
  const btn = menuBtn();
  const m = menuEl();
  btn?.setAttribute("aria-expanded", String(open));
  btn?.setAttribute("aria-label", open ? "Tutup daftar halaman" : "Buka daftar halaman");
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
    if (t.closest("[data-menu-toggle]")) {
      setMenu(!root.classList.contains("menu-open"));
    } else if (t.classList.contains("deck-menu")) {
      closeMenu(); // klik backdrop
    }
  });

  addEventListener("keydown", (e) => {
    const el = e.target as HTMLElement;
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.isContentEditable;
    const open = root.classList.contains("menu-open");

    if (e.key === "Escape") { closeMenu(); return; }

    // focus trap saat menu terbuka
    if (open && e.key === "Tab") {
      const items = [...(menuEl()?.querySelectorAll<HTMLElement>("a.menu-item") ?? [])];
      if (items.length) {
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
      return;
    }
    if (typing || open) return;

    const goto = (h?: string) => { if (h) { e.preventDefault(); navigate(h); } };
    const nextEl = document.querySelector<HTMLAnchorElement>("[data-nav-next]");
    const prevEl = document.querySelector<HTMLAnchorElement>("[data-nav-prev]");
    switch (e.key) {
      case "ArrowRight": case "PageDown": goto(nextEl?.getAttribute("href") || undefined); break;
      case "ArrowLeft": case "PageUp": goto(prevEl?.getAttribute("href") || undefined); break;
      case "Home": goto("/"); break;
      case "End": goto(href(pages[pages.length - 1].slug)); break;
    }
  });

  // swipe horizontal → prev/next
  let sx = 0, sy = 0, on = false;
  addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; on = true; }, { passive: true });
  addEventListener("touchend", (e) => {
    if (!on) return; on = false;
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      const el = document.querySelector<HTMLAnchorElement>(dx < 0 ? "[data-nav-next]" : "[data-nav-prev]");
      const h = el?.getAttribute("href");
      if (h) navigate(h);
    }
  }, { passive: true });

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

const SPOT_SEL =
  ".bezel,.opt-card,.predict,.ref,.cell,.stat,.score-row,.party,.engine,.moat-main,.komp-verdict,.strategy,.sm-node,.sm-out,.sm-meter,.path li";

let firstLoad = true;
function onLoad() {
  // pastikan menu tertutup + state chrome ter-reset setelah pindah halaman
  root.classList.remove("menu-open");
  menuBtn()?.setAttribute("aria-expanded", "false");
  menuEl()?.setAttribute("aria-hidden", "true");
  document.getElementById("main")?.removeAttribute("inert");
  syncCurrent();
  revealPage();
  document.getElementById("main")?.querySelectorAll<HTMLElement>(SPOT_SEL).forEach((el) => el.classList.add("spot"));
  wireOnce();
  // fokus konten utama pada navigasi (bukan load pertama) → SR mengumumkan slide baru
  if (!firstLoad) {
    const main = document.getElementById("main");
    if (main) { main.setAttribute("tabindex", "-1"); main.focus({ preventScroll: true }); }
  }
  firstLoad = false;
}

document.addEventListener("astro:page-load", onLoad);
