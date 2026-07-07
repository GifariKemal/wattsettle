import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const baseURL = process.env.QA_BASE_URL || "http://127.0.0.1:4326";
const screenshotDir = "reports/qa/screenshots";
const routes = [
  "/",
  "/masalah",
  "/simulator",
  "/opsi",
  "/codex",
  "/mesin",
  "/aliran-uang",
  "/banding",
  "/swot",
  "/menang",
  "/moat",
  "/benchmark",
  "/skenario",
  "/peluang",
  "/path",
  "/referensi",
  "/prediksi",
  "/penutup",
];

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

const failures = [];
const warnings = [];
const consoleEvents = [];

await mkdir(screenshotDir, { recursive: true });

function fail(label, detail) {
  failures.push({ label, detail });
}

function warn(label, detail) {
  warnings.push({ label, detail });
}

function cleanPath(url) {
  return new URL(url).pathname.replace(/\/+$/, "") || "/";
}

async function waitForCleanPath(page, path) {
  await page.waitForFunction((expected) => {
    const clean = location.pathname.replace(/\/+$/, "") || "/";
    return clean === expected;
  }, path, { timeout: 8000 });
}

async function expect(condition, label, detail = "") {
  if (!condition) fail(label, detail);
}

async function pageDiagnostics(page, route, viewportName) {
  const diag = await page.evaluate(() => {
    const root = document.documentElement;
    const body = document.body;
    const main = document.querySelector("main");
    const currentMenu = [...document.querySelectorAll(".menu-item[aria-current='true']")].length;
    const currentRail = [...document.querySelectorAll(".deck-rail a[aria-current='true']")].length;
    const visibleText = (main?.innerText || "").trim();
    const rects = [...document.querySelectorAll("h1,h2,h3,p,.score-row,.flow-card,.sim,.sm,.swot-grid")]
      .slice(0, 80)
      .map((el) => {
        const r = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          cls: el.className?.toString?.() || "",
          text: (el.textContent || "").trim().slice(0, 80),
          width: r.width,
          height: r.height,
          top: r.top,
          left: r.left,
          right: r.right,
        };
      });
    const clipped = rects.filter((r) => r.width < 0 || r.height < 0 || r.right < -2 || r.left > innerWidth + 2);
    return {
      title: document.title,
      path: location.pathname,
      currentMenu,
      currentRail,
      textLength: visibleText.length,
      h1h2: [...document.querySelectorAll("h1,h2")].map((x) => x.textContent?.trim()).filter(Boolean),
      scrollWidth: Math.max(root.scrollWidth, body.scrollWidth),
      clientWidth: root.clientWidth,
      scrollHeight: Math.max(root.scrollHeight, body.scrollHeight),
      clientHeight: root.clientHeight,
      activeMenuOpen: root.classList.contains("menu-open"),
      inertMain: main?.hasAttribute("inert") || false,
      brokenImageCount: [...document.images].filter((img) => !img.complete || img.naturalWidth === 0).length,
      clipped,
    };
  });

  await expect(diag.title.includes("WattSettle"), `${viewportName} title`, `${route}: ${diag.title}`);
  await expect(diag.currentMenu === 1, `${viewportName} menu current`, `${route}: ${diag.currentMenu}`);
  await expect(diag.currentRail === 1, `${viewportName} rail current`, `${route}: ${diag.currentRail}`);
  await expect(diag.textLength > 120, `${viewportName} meaningful text`, `${route}: ${diag.textLength}`);
  await expect(diag.brokenImageCount === 0, `${viewportName} images`, `${route}: ${diag.brokenImageCount}`);
  await expect(diag.scrollWidth <= diag.clientWidth + 4, `${viewportName} horizontal overflow`, `${route}: ${diag.scrollWidth} > ${diag.clientWidth}`);
  await expect(!diag.activeMenuOpen && !diag.inertMain, `${viewportName} menu reset`, `${route}: menu=${diag.activeMenuOpen}, inert=${diag.inertMain}`);
  if (diag.clipped.length) warn(`${viewportName} clipped/offscreen sample`, { route, clipped: diag.clipped.slice(0, 3) });
  return diag;
}

async function clickByText(page, text) {
  const btn = page.getByRole("button", { name: new RegExp(text, "i") }).first();
  await btn.waitFor({ state: "visible", timeout: 6000 });
  await btn.click();
}

async function interactionChecks(page) {
  await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });

  const htmlThemeBefore = await page.locator("html").getAttribute("data-theme");
  await page.getByRole("button", { name: /mode/i }).click();
  const htmlThemeAfter = await page.locator("html").getAttribute("data-theme");
  await expect(htmlThemeBefore !== htmlThemeAfter, "theme toggle", `${htmlThemeBefore} -> ${htmlThemeAfter}`);

  const soundButton = page.getByRole("button", { name: /toggle suara/i });
  await soundButton.click();
  await expect((await soundButton.getAttribute("aria-pressed")) === "true", "sound toggle on");
  await soundButton.click();
  await expect((await soundButton.getAttribute("aria-pressed")) === "false", "sound toggle off");

  const menuButton = page.locator("[data-menu-toggle]");
  await menuButton.click();
  await expect((await menuButton.getAttribute("aria-expanded")) === "true", "menu open");
  await expect((await page.locator("[data-menu]").getAttribute("aria-hidden")) === "false", "menu visible");
  await page.keyboard.press("Escape");
  await expect((await page.locator("[data-menu]").getAttribute("aria-hidden")) === "true", "menu escape close");

  await page.keyboard.press("End");
  await waitForCleanPath(page, "/penutup");
  await expect(cleanPath(page.url()) === "/penutup", "keyboard End navigation", page.url());
  await page.keyboard.press("Home");
  await waitForCleanPath(page, "/");
  await expect(cleanPath(page.url()) === "/", "keyboard Home navigation", page.url());
  await page.keyboard.press("ArrowRight");
  await waitForCleanPath(page, "/masalah");
  await expect(cleanPath(page.url()) === "/masalah", "keyboard next navigation", page.url());
  await page.keyboard.press("ArrowLeft");
  await waitForCleanPath(page, "/");
  await expect(cleanPath(page.url()) === "/", "keyboard prev navigation", page.url());

  await page.goto(`${baseURL}/simulator`, { waitUntil: "networkidle" });
  await clickByText(page, "Kirim pembacaan asli");
  await page.locator(".sim-verdict .tag-ok").waitFor({ state: "visible", timeout: 9000 });
  await clickByText(page, "Kirim data palsu");
  await page.locator(".sim-verdict .tag-no").waitFor({ state: "visible", timeout: 9000 });

  await page.goto(`${baseURL}/opsi`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Opsi 6/i }).click();
  await page.getByText(/Dua aliran nilai/i).waitFor({ state: "visible", timeout: 6000 });
  await page.getByRole("button", { name: /Opsi 5/i }).click();
  await page.getByText(/Attestation on-chain/i).waitFor({ state: "visible", timeout: 6000 });

  await page.goto(`${baseURL}/mesin`, { waitUntil: "networkidle" });
  await page.locator(".sm-launch").click();
  await page.locator(".sm-out .tag-ok, .sm-out .tag-no").first().waitFor({ state: "visible", timeout: 10000 });
  await page.getByRole("button", { name: /data palsu|curang|tamper/i }).first().click();
  await page.locator(".sm-launch").click();
  await page.locator(".sm-out .tag-no, .sm-stamp").first().waitFor({ state: "visible", timeout: 10000 });

  await page.goto(`${baseURL}/swot`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Opsi 6/i }).click();
  await page.getByText(/Weaknesses/i).waitFor({ state: "visible", timeout: 6000 });
  await page.getByRole("button", { name: /Kompetitor/i }).click();
  await page.getByText(/Gap vs WattSettle/i).waitFor({ state: "visible", timeout: 6000 });
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
    await expect(response?.ok(), `${viewport.name} status ${route}`, response?.status()?.toString() || "no response");
    diagnostics.push({ route, ...(await pageDiagnostics(page, route, viewport.name)) });
  }

  await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${screenshotDir}/${viewport.name}-home.png`, fullPage: true });
  await page.goto(`${baseURL}/codex`, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${screenshotDir}/${viewport.name}-codex.png`, fullPage: true });
  await page.goto(`${baseURL}/mesin`, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${screenshotDir}/${viewport.name}-mesin.png`, fullPage: true });

  await page.close();
  return diagnostics;
}

async function stressNavigation(context) {
  const page = await context.newPage();
  await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
  for (let i = 0; i < 54; i += 1) {
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(80);
  }
  const pathAfterNext = cleanPath(page.url());
  for (let i = 0; i < 54; i += 1) {
    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(80);
  }
  const pathAfterPrev = cleanPath(page.url());
  await expect(pathAfterNext === "/penutup", "stress next clamps at last", pathAfterNext);
  await expect(pathAfterPrev === "/", "stress prev clamps at first", pathAfterPrev);
  await page.close();
}

const browser = await chromium.launch();
const allDiagnostics = [];

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    reducedMotion: "reduce",
  });
  allDiagnostics.push(...(await routeSweep(context, viewport)));
  await context.close();
}

const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const page = await desktop.newPage();
page.on("console", (msg) => {
  if (["error", "warning"].includes(msg.type())) {
    consoleEvents.push({ viewport: "interaction", type: msg.type(), text: msg.text() });
  }
});
page.on("pageerror", (err) => consoleEvents.push({ viewport: "interaction", type: "pageerror", text: err.message }));
await interactionChecks(page);
await page.close();
await stressNavigation(desktop);
await desktop.close();

await browser.close();

const noisyConsole = consoleEvents.filter((event) => !/Failed to load resource: the server responded with a status of 404/.test(event.text));
if (noisyConsole.length) {
  fail("console errors/warnings", noisyConsole.slice(0, 20));
}

const report = {
  baseURL,
  checkedAt: new Date().toISOString(),
  routeCount: routes.length,
  viewports,
  diagnostics: allDiagnostics.map((d) => ({
    route: d.route,
    viewport: d.clientWidth < 700 ? "mobile" : "desktop",
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
  console.error(JSON.stringify({ ok: false, failures, warnings }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, routeCount: routes.length, warnings: warnings.length, screenshots: 6 }, null, 2));
