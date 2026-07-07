import { spawn } from "node:child_process";
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("../../dist", import.meta.url)));
const port = Number(process.env.QA_PORT || 4326);
const host = "127.0.0.1";
const baseURL = `http://${host}:${port}`;
const headerFile = join(root, "_headers");

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function sendFile(response, filePath) {
  response.writeHead(200, { "content-type": types[extname(filePath)] || "application/octet-stream", ...productionHeaders });
  createReadStream(filePath).pipe(response);
}

function parseProductionHeaders() {
  if (!existsSync(headerFile)) return {};
  const headers = {};
  for (const rawLine of readFileSync(headerFile, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line === "/*") continue;
    const split = line.indexOf(":");
    if (split > 0) headers[line.slice(0, split)] = line.slice(split + 1).trim();
  }
  return headers;
}

const productionHeaders = parseProductionHeaders();

function resolveRequestPath(url = "/") {
  const decoded = decodeURIComponent(new URL(url, baseURL).pathname);
  const normalized = normalize(decoded).replace(/^([/\\])+/, "");
  const candidate = resolve(root, normalized);
  if (candidate !== root && !candidate.startsWith(root + sep)) return null;

  if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  if (existsSync(candidate) && statSync(candidate).isDirectory()) {
    const index = join(candidate, "index.html");
    if (existsSync(index)) return index;
  }

  const pretty = join(root, normalized, "index.html");
  if (existsSync(pretty)) return pretty;
  return null;
}

function run(command, args, options = {}) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: process.platform === "win32",
      ...options,
    });
    child.on("exit", (code) => {
      code === 0 ? resolveRun() : rejectRun(new Error(`${command} ${args.join(" ")} exited with ${code}`));
    });
    child.on("error", rejectRun);
  });
}

const server = createServer((request, response) => {
  const filePath = resolveRequestPath(request.url);
  if (!filePath) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }
  sendFile(response, filePath);
});

await new Promise((resolveListen, rejectListen) => {
  server.once("error", rejectListen);
  server.listen(port, host, resolveListen);
});

try {
  await run("node", ["tests/e2e/QA E2E.mjs"], {
    env: { ...process.env, QA_BASE_URL: baseURL },
  });
} finally {
  await new Promise((resolveClose) => server.close(resolveClose));
}
