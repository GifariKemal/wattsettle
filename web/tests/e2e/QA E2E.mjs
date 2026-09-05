// Gate QA end to end untuk situs produk WattSettle.
//
// Suite sebelumnya menguji situs deck 18 halaman yang sudah dibongkar pada refactor Juli
// (/masalah, /simulator, /opsi, /penutup, navigasi panah keyboard). Rute-rute itu sudah
// 404 sejak lama, jadi gate ini praktis mati dan tidak lagi menjaga apa pun. Berkas ini
// menggantinya dengan pengujian terhadap tujuh halaman yang benar-benar ada.
//
// Satu tambahan yang paling berharga ada di bagian integritas tautan on-chain. Situs ini
// memajang alamat kontrak dan hash transaksi sebagai bukti, jadi tautan yang salah tujuan
// lebih buruk daripada tautan yang mati. Pernah terjadi: tautan "Kontrak WattSettle"
// menunjuk ke alamat TOKEN selama berbulan-bulan tanpa ada yang sadar.

import { chromium } from "playwright";
import { mkdir, writeFile, readFile } from "node:fs/promises";

const baseURL = process.env.QA_BASE_URL || "http://127.0.0.1:4326";
const screenshotDir = "reports/qa/screenshots";

const routes = ["/", "/cara-kerja", "/demo", "/enovatek", "/teknologi", "/roadmap", "/tentang"];

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

const failures = [];
const warnings = [];
const consoleEvents = [];

await mkdir(screenshotDir, { recursive: true });

const fail = (label, detail) => failures.push({ label, detail });
const warn = (label, detail) => warnings.push({ label, detail });
const expect = (condition, label, detail = "") => {
  if (!condition) fail(label, detail);
};

/** Baca nilai rantai dari satu sumber kebenaran situs, bukan menyalinnya ke test. */
async function readChainConfig() {
  const src = await readFile("src/content/site.ts", "utf8");
  const pick = (key) => src.match(new RegExp(`${key}:\\s*"([^"]+)"`))?.[1];
  return {
    token: pick("token"),
    contract: pick("contract"),
    agent: pick("agent"),
    settleTx: pick("settleTx"),
    rejectTx: pick("rejectTx"),
    lyingVerifierTx: pick("lyingVerifierTx"),
    scan: pick("scan"),
  };
}

async function pageDiagnostics(page, route, viewportName) {
  const diag = await page.evaluate(() => {
    const root = document.documentElement;
    const body = document.body;
    const main = document.querySelector("main");
    const rects = [...document.querySelectorAll("h1,h2,h3,p,table,pre,.proof-link,.fact")]
      .slice(0, 80)
      .map((el) => {
        const r = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          text: (el.textContent || "").trim().slice(0, 80),
          width: r.width,
          height: r.height,
          left: r.left,
          right: r.right,
        };
      });
    return {
      title: document.title,
      path: location.pathname,
      currentMenu: document.querySelectorAll(".menu-item[aria-current='true']").length,
      currentNav: document.querySelectorAll("[aria-current='page']").length,
      textLength: (main?.innerText || "").trim().length,
      h1Count: document.querySelectorAll("h1").length,
      scrollWidth: Math.max(root.scrollWidth, body.scrollWidth),
      clientWidth: root.clientWidth,
      scrollHeight: Math.max(root.scrollHeight, body.scrollHeight),
      menuOpen: root.classList.contains("menu-open"),
      inertMain: main?.hasAttribute("inert") || false,
      brokenImageCount: [...document.images].filter((img) => !img.complete || img.naturalWidth === 0).length,
      emptyLinks: [...document.querySelectorAll("a[href]")].filter((a) => {
        const h = a.getAttribute("href");
        return !h || h === "#" || h === "undefined" || h.includes("undefined");
      }).length,
      clipped: rects.filter((r) => r.width < 0 || r.height < 0 || r.right < -2 || r.left > innerWidth + 2),
    };
  });

  const at = `${route}`;
  expect(diag.title.includes("WattSettle"), `${viewportName} title`, `${at}: ${diag.title}`);
  expect(diag.h1Count === 1, `${viewportName} tepat satu h1`, `${at}: ${diag.h1Count}`);
  expect(diag.currentMenu === 1, `${viewportName} penanda menu aktif`, `${at}: ${diag.currentMenu}`);
  expect(diag.currentNav >= 1, `${viewportName} penanda nav aktif`, `${at}: ${diag.currentNav}`);
  expect(diag.textLength > 120, `${viewportName} halaman berisi`, `${at}: ${diag.textLength}`);
  expect(diag.brokenImageCount === 0, `${viewportName} gambar rusak`, `${at}: ${diag.brokenImageCount}`);
  expect(diag.emptyLinks === 0, `${viewportName} tautan kosong atau undefined`, `${at}: ${diag.emptyLinks}`);
  expect(
    diag.scrollWidth <= diag.clientWidth + 4,
    `${viewportName} overflow horizontal`,
    `${at}: ${diag.scrollWidth} > ${diag.clientWidth}`,
  );
  expect(!diag.menuOpen && !diag.inertMain, `${viewportName} menu tidak nyangkut terbuka`, `${at}`);
  if (diag.clipped.length) warn(`${viewportName} elemen terpotong`, { route, clipped: diag.clipped.slice(0, 3) });
  return diag;
}

async function routeSweep(context, viewport) {
  const page = await context.newPage();
  page.on("console", (msg) => {
    if (["error", "warning"].includes(msg.type())) {
      consoleEvents.push({ viewport: viewport.name, type: msg.type(), text: msg.text() });
    }
  });
  page.on("pageerror", (err) => consoleEvents.push({ viewport: viewport.name, type: "pageerror", text: err.message }));

  const diagnostics = [];
  for (const route of routes) {
    const response = await page.goto(`${baseURL}${route}`, { waitUntil: "networkidle", timeout: 20000 });
    expect(response?.ok(), `${viewport.name} status ${route}`, response?.status()?.toString() || "no response");
    diagnostics.push({ route, viewport: viewport.name, ...(await pageDiagnostics(page, route, viewport.name)) });
  }

  for (const shot of ["/", "/teknologi", "/demo"]) {
    await page.goto(`${baseURL}${shot}`, { waitUntil: "networkidle" });
    const name = shot === "/" ? "home" : shot.slice(1);
    await page.screenshot({ path: `${screenshotDir}/${viewport.name}-${name}.png`, fullPage: true });
  }

  await page.close();
  return diagnostics;
}

/** Rute yang sudah dihapus harus benar-benar 404, bukan diam-diam menyajikan halaman lain. */
async function removedRoutesAre404(context) {
  const page = await context.newPage();
  for (const gone of ["/simulator", "/penutup", "/peluang"]) {
    const response = await page.goto(`${baseURL}${gone}`, { waitUntil: "domcontentloaded" });
    expect(response?.status() === 404, `rute lama ${gone} harus 404`, response?.status()?.toString());
  }
  await page.close();
}

async function desktopInteractions(context) {
  const page = await context.newPage();
  page.on("pageerror", (err) => consoleEvents.push({ viewport: "interaction", type: "pageerror", text: err.message }));
  await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });

  const before = await page.locator("html").getAttribute("data-theme");
  await page.getByRole("button", { name: /mode/i }).first().click();
  await page.waitForTimeout(250);
  const after = await page.locator("html").getAttribute("data-theme");
  expect(before !== after, "toggle tema mengubah data-theme", `${before} -> ${after}`);

  // Tombol menu memang hanya untuk mobile. Kalau ia terlihat di desktop, breakpoint bocor.
  const menuVisibleOnDesktop = await page.locator("[data-menu-toggle]").isVisible();
  expect(!menuVisibleOnDesktop, "tombol menu tersembunyi di desktop", `visible=${menuVisibleOnDesktop}`);

  await page.close();
}

async function mobileInteractions(context) {
  const page = await context.newPage();
  page.on("pageerror", (err) => consoleEvents.push({ viewport: "interaction", type: "pageerror", text: err.message }));
  await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });

  const toggle = page.locator("[data-menu-toggle]");
  await toggle.waitFor({ state: "visible", timeout: 8000 });
  await toggle.click();
  await page.waitForTimeout(300);
  expect((await toggle.getAttribute("aria-expanded")) === "true", "menu mobile terbuka");
  expect((await page.locator("[data-menu]").getAttribute("aria-hidden")) === "false", "drawer terlihat");

  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  expect((await page.locator("[data-menu]").getAttribute("aria-hidden")) === "true", "Escape menutup drawer");

  // Menavigasi lewat drawer harus benar-benar berpindah halaman.
  await toggle.click();
  await page.waitForTimeout(300);
  await page.locator(".menu-item", { hasText: "Teknologi" }).first().click();
  await page.waitForURL(/\/teknologi\/?$/, { timeout: 8000 });
  expect(page.url().includes("/teknologi"), "navigasi dari drawer", page.url());

  await page.close();
}

/** Dua island interaktif di /demo, keduanya harus menampilkan jalur lolos DAN jalur tolak. */
async function demoIslands(context) {
  const page = await context.newPage();
  page.on("pageerror", (err) => consoleEvents.push({ viewport: "demo", type: "pageerror", text: err.message }));
  await page.goto(`${baseURL}/demo`, { waitUntil: "networkidle" });

  await page.getByRole("button", { name: /Kirim pembacaan asli/i }).click();
  await page.locator(".sim-verdict .tag-ok").first().waitFor({ state: "visible", timeout: 12000 });
  expect(true, "simulator jalur approve");

  await page.getByRole("button", { name: /Kirim data palsu/i }).click();
  await page.locator(".sim-verdict .tag-no").first().waitFor({ state: "visible", timeout: 12000 });
  expect(true, "simulator jalur reject");

  await page.locator(".sm-launch").scrollIntoViewIfNeeded();
  await page.locator(".sm-launch").click();
  await page.locator(".sm-out").first().waitFor({ state: "visible", timeout: 15000 });
  expect(true, "settle machine jalur jujur");

  await page.getByRole("button", { name: /^Curang$/i }).click();
  await page.locator(".sm-launch").click();
  await page.waitForTimeout(1200);
  expect(true, "settle machine jalur curang");

  await page.close();
}

/**
 * Integritas tautan on-chain. Ini bagian yang paling penting di berkas ini.
 *
 * Situs memajang alamat dan hash sebagai BUKTI, jadi tautan yang menunjuk ke tujuan salah
 * jauh lebih berbahaya daripada tautan mati: pembaca mengira sudah memverifikasi padahal
 * belum. Test ini membandingkan tautan yang benar-benar ter-render dengan satu sumber
 * kebenaran di src/content/site.ts.
 */
async function onChainIntegrity(context, chain) {
  const page = await context.newPage();
  await page.goto(`${baseURL}/teknologi`, { waitUntil: "networkidle" });

  const hrefs = await page.locator("a[href]").evaluateAll((els) => els.map((e) => e.getAttribute("href")));
  const html = await page.content();

  const wants = [
    ["tautan kontrak", `${chain.scan}/address/${chain.contract}`],
    ["tautan token", `${chain.scan}/token/${chain.token}`],
    ["tautan tx settlement", `${chain.scan}/tx/${chain.settleTx}`],
    ["tautan tx verifier berbohong", `${chain.scan}/tx/${chain.lyingVerifierTx}`],
  ];
  for (const [label, url] of wants) {
    expect(hrefs.includes(url), `${label} ada dan tepat`, url);
  }

  // Alamat kontrak harus TERBACA sebagai teks, bukan hanya tersembunyi di href.
  expect(html.includes(chain.contract), "alamat kontrak tampil sebagai teks", chain.contract);

  // Jebakan yang pernah benar-benar terjadi: tautan kontrak dibangun dari alamat token,
  // sehingga keduanya menunjuk ke tempat yang sama.
  expect(
    chain.contract.toLowerCase() !== chain.token.toLowerCase(),
    "alamat kontrak dan token tidak boleh sama",
    `${chain.contract} vs ${chain.token}`,
  );
  expect(
    !hrefs.includes(`${chain.scan}/address/${chain.token}`),
    "tautan kontrak tidak boleh menunjuk ke alamat token",
  );

  // Tidak boleh ada sisa alamat kontrak lama di halaman mana pun.
  const superseded = ["0xdA149c0939c0C3450EDE5c8a0A0e8cF3AF36481a", "0x12B6A6475509069A0c6053F99Efc53771349B8E7"];
  for (const route of routes) {
    await page.goto(`${baseURL}${route}`, { waitUntil: "domcontentloaded" });
    const body = (await page.content()).toLowerCase();
    for (const old of superseded) {
      expect(!body.includes(old.toLowerCase()), `alamat kontrak usang di ${route}`, old);
    }
  }

  await page.close();
}

// ---------------------------------------------------------------------------

const chain = await readChainConfig();
for (const [key, value] of Object.entries(chain)) {
  expect(Boolean(value), `site.ts memuat ${key}`, String(value));
}

const browser = await chromium.launch();
const allDiagnostics = [];

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    reducedMotion: "reduce",
  });
  allDiagnostics.push(...(await routeSweep(context, viewport)));
  if (viewport.name === "mobile") await mobileInteractions(context);
  await context.close();
}

const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
await removedRoutesAre404(desktop);
await desktopInteractions(desktop);
await demoIslands(desktop);
await onChainIntegrity(desktop, chain);
await desktop.close();

await browser.close();

// 404 pada aset opsional bukan kegagalan gate, tetapi tetap dicatat.
const noisyConsole = consoleEvents.filter((e) => !/status of 404/.test(e.text));
if (noisyConsole.length) fail("console error atau warning", noisyConsole.slice(0, 20));

const report = {
  baseURL,
  checkedAt: new Date().toISOString(),
  routeCount: routes.length,
  viewports,
  chain,
  diagnostics: allDiagnostics.map((d) => ({
    route: d.route,
    viewport: d.viewport,
    title: d.title,
    textLength: d.textLength,
    scroll: `${d.scrollWidth}x${d.scrollHeight}`,
  })),
  warnings,
  consoleEvents: noisyConsole,
  failures,
};
await writeFile("reports/qa/qa-report.json", JSON.stringify(report, null, 2));

if (failures.length) {
  console.error(JSON.stringify({ ok: false, failureCount: failures.length, failures, warnings }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    { ok: true, routeCount: routes.length, viewports: viewports.length, warnings: warnings.length },
    null,
    2,
  ),
);
