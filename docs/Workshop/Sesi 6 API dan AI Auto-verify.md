# Sesi 6 - Backend 2: API dan AI Auto-verify

- Tanggal: Minggu, 9 Agustus 2026, 19.30-21.30 WIB
- Mentor: Fajar Jati Nugroho (@Beatless16) dan Fajar Ramadhan (@xfajarrr)
- Sumber: Notion, page id 22295160-5d98-8274-a712-81cde7dcc2f2
- Konversi: 9 Agustus 2026, lewat Notion internal API (loadPageChunk plus syncRecordValues untuk toggle children)
- Hasil render: 112 blok, 24 blok kode, 20 toggle, 0 blok gagal diresolusi

> [!NOTE]
> Materi ini melanjutkan backend Sesi 5. Dua bagian: Part 1 menambah endpoint
> baca baru (`/pending`, `/leaderboard`, `/verdicts`) plus endpoint tulis pola
> relayer (backend yang tanda tangan dan bayar gas), Part 2 membangun juri AI:
> LLM membandingkan bukti kerjaan dengan aturan bounty, lalu putusannya dikirim
> ke chain lewat `fulfillVerification`. Alamat kontrak di materi adalah
> deployment mentor (`0xd3ec...` token, `0xfecc...` factory, block 124034703),
> bukan deployment SURIOTA di `~/reward-token`.

> [!WARNING]
> Ini arsip verbatim materi mentor. Blok kode dipertahankan persis apa adanya.
> Yang diubah hanya dua hal: (1) em-dash di prosa jadi hyphen untuk kepatuhan
> gaya markdown, (2) **API key OpenAI milik mentor yang ikut ter-publish di
> materi asli sudah disensor.** Key itu jangan dipakai, dan sebaiknya mentor
> diberi tahu supaya mencabutnya.

---

> [!NOTE]
>

  **What You'll Learn In This Lesson:**


*[table_of_contents] *


# 💠 Clone Starter


```bash
git clone https://github.com/DevWeb3Jogja/boootcamp-indonesia-web3-hacathon.git
cd boootcamp-indonesia-web3-hacathon/backend
bun install
```


# 📚 Setup Backend

Isi `.env` (salin dari `.env.example`), lalu cek: `bun dev` → `curl localhost:3000/board` harus ada isinya. Semua path di materi ini relatif ke folder `backend/`.


```bash
# RPC endpoint: drpc gratis (bisa ganti Nodereal / Alchemy / BNB official kalau rate-limit ketat)
RPC_URL=https://bsc-testnet.drpc.org

# Port API Hono (default 3000)
PORT=3000

# --- Wallet 1: relayer/panitia, buat endpoint tulis (/relay/*) ---
# Bayar gas DAN RWD-nya dipakai jadi hadiah. Kosongkan = /relay/* mati, sisanya jalan.
RELAYER_PK=

# --- Wallet 2: juri, buat `bun oracle` ---
# Cuma butuh tBNB buat gas. Kosongkan = juri mati, API tetap jalan.
ORACLE_PK=

# LLM juri - endpoint OpenAI-compatible, jadi provider bebas tanpa ubah kode.
# OpenAI langsung:
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-4o-mini
# atau lewat OpenRouter (bisa pakai model Claude):
# LLM_BASE_URL=https://openrouter.ai/api/v1
# LLM_MODEL=anthropic/claude-sonnet-4.5
LLM_API_KEY=<DISENSOR: key OpenAI mentor ikut ter-publish di materi asli. JANGAN dipakai, pakai key sendiri.>

# Jeda polling juri
POLL_INTERVAL_SECONDS=15
```

update `config` juga:


<details><summary>📋 `src/config.ts`</summary>


```typescript
export const RPC_URLS = [
  process.env.RPC_URL,
  "https://bnb-testnet.api.onfinality.io/public",
  "https://bsc-testnet-rpc.publicnode.com",
  "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
].filter(Boolean) as string[];

export const CONTRACTS = {
  rewardToken: "0xd3ec43f60e2ac1517c4dd80c0a23ad8d902eaf0f",
  bountyFactory: "0xfecc20bdaa28681bada577731b8a24f415cbca87",
} as const;

export const DEPLOY_BLOCK = 124_034_703n;
export const CHUNK = 9000n;
export const PORT = Number(process.env.PORT ?? 3000);

// dua wallet, dua peran
export const RELAYER_PK = process.env.RELAYER_PK as `0x${string}` | undefined; // panitia
export const ORACLE_PK = process.env.ORACLE_PK as `0x${string}` | undefined;   // juri

export const LLM = {
  baseUrl: (process.env.LLM_BASE_URL ?? "https://api.openai.com/v1").replace(/\/$/, ""),
  apiKey: process.env.LLM_API_KEY,
  model: process.env.LLM_MODEL ?? "gpt-4o-mini",
} as const;

export const POLL_INTERVAL_MS = Number(process.env.POLL_INTERVAL_SECONDS ?? 15) * 1000;
```


</details>


# ☾ Part 1 - API Smart Contract

PART 1 - API Smart Contract


## 1.1 Database (`src/lib/db.ts`)


<details><summary>📋 Tabel baru - tempel di dalam `db.exec(...)`</summary>


```sql
CREATE TABLE IF NOT EXISTS verdicts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  escrow     TEXT NOT NULL,
  worker     TEXT NOT NULL,
  eligible   INTEGER NOT NULL,
  alasan     TEXT NOT NULL,
  tx_hash    TEXT,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_verdicts_escrow ON verdicts(escrow);
```

Ganti juga baris PRAGMA (nanti ada 2 proses nulis):


```typescript
db.exec("PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;");
```


</details>


<details><summary>📋 Query baru - tempel di akhir file</summary>


```typescript
export type PendingRow = Pick<SubmissionRow, "escrow" | "worker" | "proof_uri" | "block_number" | "created_at">;

export const getPending = () =>
  db.prepare(`
    SELECT escrow, worker, proof_uri, block_number, created_at FROM submissions
    WHERE status = 'submitted' ORDER BY block_number ASC
  `).all() as PendingRow[];

// wei kelewat besar buat SUM() SQLite → hitung pakai BigInt di JS
export const getLeaderboard = () => {
  const rows = db.prepare("SELECT worker, reward_amount FROM submissions WHERE status = 'rewarded'")
    .all() as { worker: string; reward_amount: string | null }[];
  const skor = new Map<string, { wins: number; total: bigint }>();
  for (const r of rows) {
    const s = skor.get(r.worker) ?? { wins: 0, total: 0n };
    skor.set(r.worker, { wins: s.wins + 1, total: s.total + BigInt(r.reward_amount ?? 0) });
  }
  return [...skor]
    .map(([worker, s]) => ({ worker, wins: s.wins, total_reward: s.total.toString() }))
    .sort((a, b) => b.wins - a.wins);
};

export const insertVerdict = db.prepare(`
  INSERT INTO verdicts (escrow, worker, eligible, alasan, tx_hash, created_at)
  VALUES (@escrow, @worker, @eligible, @alasan, @txHash, @ts)
`);

export const getVerdicts = (escrow: string) =>
  db.prepare("SELECT * FROM verdicts WHERE escrow = ? ORDER BY id DESC").all(escrow);
```


</details>


<details><summary>📋 Kode Lengkap</summary>


```typescript
// lib/db.ts = SQLite (bun:sqlite): skema, prepared statement, dan query
// 3 tabel: bounties, submissions, sync_checkpoint (block terakhir yang diproses)

import { Database } from "bun:sqlite";
import type { Address } from "viem";

// strict: bind {param} tanpa prefix "@" + error bila ada parameter terlewat
export const db = new Database("papan-sayembara.db", { create: true, strict: true });

// WAL = baca & tulis barengan; busy_timeout = sabar antre kalau proses lain lagi nulis
// (dua proses pakai file ini: `bun dev` untuk indexer/API dan `bun oracle` untuk juri)
db.exec("PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;");

db.exec(`
  CREATE TABLE IF NOT EXISTS bounties (
    bounty_id    INTEGER PRIMARY KEY,
    escrow       TEXT UNIQUE NOT NULL,
    creator      TEXT NOT NULL,
    reward_amount TEXT NOT NULL,
    tx_hash      TEXT NOT NULL,
    block_number INTEGER NOT NULL,
    created_at   INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS submissions (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    escrow        TEXT NOT NULL,
    worker        TEXT NOT NULL,
    proof_uri     TEXT NOT NULL,
    status        TEXT NOT NULL, -- 'submitted' | 'rewarded' | 'rejected'
    reward_amount TEXT,
    tx_hash       TEXT UNIQUE NOT NULL, -- UNIQUE → tidak ada baris ganda
    block_number  INTEGER NOT NULL,
    created_at    INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_submissions_escrow ON submissions(escrow);
  CREATE INDEX IF NOT EXISTS idx_submissions_worker ON submissions(worker);

  CREATE TABLE IF NOT EXISTS sync_checkpoint (
    id          INTEGER PRIMARY KEY CHECK (id = 1),
    last_block  INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS verdicts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    escrow     TEXT NOT NULL,
    worker     TEXT NOT NULL,
    eligible   INTEGER NOT NULL, -- 0/1; chain cuma simpan hasilnya, alasan AI hidup di sini
    alasan     TEXT NOT NULL,
    tx_hash    TEXT,
    created_at INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_verdicts_escrow ON verdicts(escrow);
`);

// Bentuk baris tabel (dipakai di services/routes)
export type BountyRow = {
  bounty_id: number; escrow: string; creator: string; reward_amount: string;
  tx_hash: string; block_number: number; created_at: number;
};
export type SubmissionRow = {
  id: number; escrow: string; worker: string; proof_uri: string; status: string;
  reward_amount: string | null; tx_hash: string; block_number: number; created_at: number;
};

// Block terakhir yang sudah diproses (untuk backfill)
export const getCheckpoint = (): bigint => {
  const row = db.prepare("SELECT last_block FROM sync_checkpoint WHERE id = 1").get() as { last_block: number } | undefined;
  return BigInt(row?.last_block ?? 0);
};

export const setCheckpoint = (block: bigint) =>
  db.prepare("INSERT INTO sync_checkpoint (id, last_block) VALUES (1, ?1) ON CONFLICT(id) DO UPDATE SET last_block = ?1")
    .run(Number(block));

// Daftar alamat escrow yang sudah dikenal indexer
export const knownEscrows = () =>
  (db.prepare("SELECT escrow FROM bounties").all() as { escrow: string }[]).map((r) => r.escrow as Address);

// Insert bounty (ON CONFLICT DO NOTHING = idempotent)
export const upsertBounty = db.prepare(`
  INSERT INTO bounties (bounty_id, escrow, creator, reward_amount, tx_hash, block_number, created_at)
  VALUES (@bountyId, @escrow, @creator, @rewardAmount, @txHash, @blockNumber, @ts)
  ON CONFLICT(bounty_id) DO NOTHING
`);

// Insert submission (OR IGNORE + tx_hash UNIQUE = idempotent)
export const insertSubmission = db.prepare(`
  INSERT OR IGNORE INTO submissions (escrow, worker, proof_uri, status, tx_hash, block_number, created_at)
  VALUES (@escrow, @worker, @proofUri, 'submitted', @txHash, @blockNumber, @ts)
`);

// Update status submission terakhir pada escrow tertentu (tanpa match = no-op)
export const markLatestSubmission = (escrow: string, status: string, rewardAmount?: string) =>
  db.prepare(`
    UPDATE submissions SET status = ?, reward_amount = ?
    WHERE id = (SELECT id FROM submissions WHERE escrow = ? ORDER BY id DESC LIMIT 1)
  `).run(status, rewardAmount ?? null, escrow);

// Query untuk API: daftar bounty + submission hasil indexing
export const getBoard = () => ({
  bounties: db.prepare("SELECT * FROM bounties ORDER BY block_number DESC").all() as BountyRow[],
  submissions: db.prepare("SELECT * FROM submissions ORDER BY block_number DESC").all() as SubmissionRow[],
});

// Submission yang masih menunggu penilaian (dipakai agent-oracle via GET /pending)
export type PendingRow = Pick<SubmissionRow, "escrow" | "worker" | "proof_uri" | "block_number" | "created_at">;

export const getPending = () =>
  db.prepare(`
    SELECT escrow, worker, proof_uri, block_number, created_at FROM submissions
    WHERE status = 'submitted' ORDER BY block_number ASC
  `).all() as PendingRow[];

// Peringkat worker: jumlah menang + total reward (BigInt di JS - wei kelewat besar buat SUM SQLite)
export const getLeaderboard = () => {
  const rows = db.prepare("SELECT worker, reward_amount FROM submissions WHERE status = 'rewarded'")
    .all() as { worker: string; reward_amount: string | null }[];
  const skor = new Map<string, { wins: number; total: bigint }>();
  for (const r of rows) {
    const s = skor.get(r.worker) ?? { wins: 0, total: 0n };
    skor.set(r.worker, { wins: s.wins + 1, total: s.total + BigInt(r.reward_amount ?? 0) });
  }
  return [...skor]
    .map(([worker, s]) => ({ worker, wins: s.wins, total_reward: s.total.toString() }))
    .sort((a, b) => b.wins - a.wins);
};

// Verdict AI: hasil + alasan (chain cuma tahu true/false - alasannya disimpan off-chain)
export const insertVerdict = db.prepare(`
  INSERT INTO verdicts (escrow, worker, eligible, alasan, tx_hash, created_at)
  VALUES (@escrow, @worker, @eligible, @alasan, @txHash, @ts)
`);

export const getVerdicts = (escrow: string) =>
  db.prepare("SELECT * FROM verdicts WHERE escrow = ? ORDER BY id DESC").all(escrow);

```


</details>


## 1.2 Endpoint baca (`src/routes/api.ts`)


<details><summary>📋 Ganti import `../lib/db` + tempel 4 route di atas `/health`</summary>


```typescript
import { getBoard, getLeaderboard, getPending, getVerdicts, insertVerdict } from "../lib/db";
```


```typescript
app.get("/pending", (c) => c.json({ pending: getPending() }));

app.get("/leaderboard", (c) => c.json({ leaderboard: getLeaderboard() }));

app.post("/verdicts", async (c) => {
  const b = await c.req.json().catch(() => null);
  const valid = b && isAddress(b.escrow) && isAddress(b.worker)
    && typeof b.eligible === "boolean" && typeof b.alasan === "string";
  if (!valid) return c.json({ error: "butuh: escrow, worker, eligible (boolean), alasan" }, 400);
  insertVerdict.run({
    escrow: b.escrow.toLowerCase(), worker: b.worker.toLowerCase(), eligible: b.eligible ? 1 : 0,
    alasan: b.alasan, txHash: b.tx_hash ?? null, ts: Date.now(),
  });
  return c.json({ ok: true }, 201);
});

app.get("/verdicts/:escrow", (c) => {
  const escrow = c.req.param("escrow");
  if (!isAddress(escrow)) return c.json({ error: "alamat tidak valid" }, 400);
  return c.json({ verdicts: getVerdicts(escrow.toLowerCase()) });
});
```


</details>


<details><summary>📋 Kode Lengkap</summary>


```typescript
// routes/api.ts = definisi endpoint REST (Hono)

import { Hono } from "hono";
import { cors } from "hono/cors";
import { isAddress } from "viem";
import { getBoard, getLeaderboard, getPending, getVerdicts, insertVerdict } from "../lib/db";
import { relayerWallet } from "../lib/wallet";
import { balanceOf, board, readEscrow } from "../services/bounty";
import { createBounty, relayerAddress, submitWork } from "../services/relayer";

export const app = new Hono();

app.use("/*", cors()); // izinkan frontend localhost memanggil API

app.onError((err, c) => {
  console.error("api error:", err);
  return c.json({ error: "internal error" }, 500);
});
app.notFound((c) => c.json({ error: "route tidak ditemukan" }, 404));

// GET /board → semua bounty + submission (hasil indexing + total live)
app.get("/board", async (c) => c.json(await board()));

// GET /bounty/:escrow → detail satu bounty (live dari chain)
app.get("/bounty/:escrow", async (c) => {
  const escrow = c.req.param("escrow");
  if (!isAddress(escrow)) return c.json({ error: "alamat tidak valid" }, 400);
  return c.json(await readEscrow(escrow));
});

// GET /wallet/:address → bounty yang dibuat + submission milik wallet tersebut
app.get("/wallet/:address", (c) => {
  const addr = c.req.param("address").toLowerCase();
  if (!isAddress(addr)) return c.json({ error: "alamat tidak valid" }, 400);
  const { bounties, submissions } = getBoard();
  return c.json({
    bounties: bounties.filter((b) => b.creator.toLowerCase() === addr),
    submissions: submissions.filter((s) => s.worker.toLowerCase() === addr),
  });
});

// GET /balance/:address → saldo token RWD
app.get("/balance/:address", async (c) => {
  const addr = c.req.param("address");
  if (!isAddress(addr)) return c.json({ error: "alamat tidak valid" }, 400);
  return c.json({ balance: (await balanceOf(addr)).toString() });
});

// GET /pending → submission yang menunggu penilaian (dikonsumsi agent-oracle)
app.get("/pending", (c) => c.json({ pending: getPending() }));

// GET /leaderboard → peringkat worker berdasarkan jumlah reward yang diterima
app.get("/leaderboard", (c) => c.json({ leaderboard: getLeaderboard() }));

// POST /verdicts → agent-oracle lapor hasil + alasan AI (chain cuma simpan true/false)
app.post("/verdicts", async (c) => {
  const b = await c.req.json().catch(() => null);
  const valid = b && isAddress(b.escrow) && isAddress(b.worker)
    && typeof b.eligible === "boolean" && typeof b.alasan === "string";
  if (!valid) return c.json({ error: "butuh: escrow, worker, eligible (boolean), alasan" }, 400);
  // lowercase biar konsisten dengan tabel submissions (alamat dari body bisa checksummed)
  insertVerdict.run({
    escrow: b.escrow.toLowerCase(), worker: b.worker.toLowerCase(), eligible: b.eligible ? 1 : 0,
    alasan: b.alasan, txHash: b.tx_hash ?? null, ts: Date.now(),
  });
  return c.json({ ok: true }, 201);
});

// GET /verdicts/:escrow → riwayat penilaian AI untuk satu bounty (beserta alasannya)
app.get("/verdicts/:escrow", (c) => {
  const escrow = c.req.param("escrow");
  if (!isAddress(escrow)) return c.json({ error: "alamat tidak valid" }, 400);
  return c.json({ verdicts: getVerdicts(escrow.toLowerCase()) });
});

// --- Endpoint TULIS: backend yang tanda tangan & bayar gas (relayer) ---

// Semua route di bawah butuh RELAYER_PK; tanpa itu backend cuma bisa baca
app.use("/relay/*", async (c, next) => {
  if (!relayerWallet) return c.json({ error: "relayer mati: isi RELAYER_PK di .env" }, 503);
  await next();
});

// POST /relay/bounty → bikin bounty baru (approve + createBounty dalam satu panggilan)
app.post("/relay/bounty", async (c) => {
  const b = await c.req.json().catch(() => null);
  if (!b || typeof b.reward !== "string" || typeof b.rules_uri !== "string")
    return c.json({ error: "butuh: reward (string, mis. \"10\"), rules_uri" }, 400);
  return c.json(await createBounty(b.reward, b.rules_uri, Number(b.deadline_jam ?? 24)), 201);
});

// POST /relay/bounty/:escrow/submit → kirim bukti kerjaan ke satu bounty
app.post("/relay/bounty/:escrow/submit", async (c) => {
  const escrow = c.req.param("escrow");
  const b = await c.req.json().catch(() => null);
  if (!isAddress(escrow)) return c.json({ error: "alamat tidak valid" }, 400);
  if (!b || typeof b.proof_uri !== "string") return c.json({ error: "butuh: proof_uri" }, 400);
  return c.json(await submitWork(escrow, b.proof_uri));
});

// GET /health → cek server hidup + status relayer
app.get("/health", (c) =>
  c.json({ ok: true, relayer: relayerAddress() ?? "mati", time: new Date().toISOString() }));

```


</details>


## 1.3 Endpoint tulis / relayer


<details><summary>📋 `src/lib/wallet.ts` - file baru</summary>


```typescript
import { createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { bscTestnet } from "viem/chains";
import { ORACLE_PK, RELAYER_PK } from "../config";
import { transport } from "./chain";

const walletFrom = (pk?: `0x${string}`) =>
  pk ? createWalletClient({ account: privateKeyToAccount(pk), chain: bscTestnet, transport }) : null;

// null = PK belum diisi → fitur terkait mati, sisanya tetap hidup
export const relayerWallet = walletFrom(RELAYER_PK); // panitia
export const oracleWallet = walletFrom(ORACLE_PK);   // juri
```

Di `src/lib/chain.ts`, export `transport`-nya biar dipakai bareng:


```typescript
export const transport = fallback(RPC_URLS.map((url) => http(url)), { rank: true });

export const client = createPublicClient({ chain: bscTestnet, transport });
```


</details>


<details><summary>📋 `src/contracts.ts` - tambah function tulis ke ABI</summary>


```typescript
export const bountyFactoryAbi = parseAbi([
  "function totalBounties() view returns (uint256)",
  "function oracle() view returns (address)",
  "function createBounty(uint256 rewardAmount, string rulesURI, uint256 submissionDeadline) returns (address)",
]);

export const bountyEscrowAbi = parseAbi([
  "function status() view returns (uint8)",
  "function creator() view returns (address)",
  "function rewardAmount() view returns (uint256)",
  "function rulesURI() view returns (string)",
  "function worker() view returns (address)",
  "function proofURI() view returns (string)",
  "function submitWork(string proofURI)",
  "function fulfillVerification(bool eligible)",
]);

export const rewardTokenAbi = parseAbi([
  "function balanceOf(address account) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
]);
```


</details>


<details><summary>📋 `src/services/relayer.ts` - file baru</summary>


```typescript
import { maxUint256, parseEther, parseEventLogs, type Address } from "viem";
import { CONTRACTS } from "../config";
import { bountyCreatedEvent, bountyEscrowAbi, bountyFactoryAbi, rewardTokenAbi } from "../contracts";
import { client } from "../lib/chain";
import { relayerWallet } from "../lib/wallet";

const wallet = () => {
  if (!relayerWallet) throw new Error("RELAYER_PK belum diisi");
  return relayerWallet;
};

// gasPrice eksplisit = tx legacy (BSC testnet nolak EIP-1559)
const gasPrice = () => client.getGasPrice();

export const relayerAddress = () => relayerWallet?.account.address;

// factory narik RWD lewat transferFrom → butuh approve dulu (sekali seumur wallet)
const ensureApproval = async (amount: bigint) => {
  const allowance = await client.readContract({
    address: CONTRACTS.rewardToken, abi: rewardTokenAbi, functionName: "allowance",
    args: [wallet().account.address, CONTRACTS.bountyFactory],
  });
  if (allowance >= amount) return;
  const hash = await wallet().writeContract({
    address: CONTRACTS.rewardToken, abi: rewardTokenAbi, functionName: "approve",
    args: [CONTRACTS.bountyFactory, maxUint256], gasPrice: await gasPrice(),
  });
  await client.waitForTransactionReceipt({ hash });
};

export const createBounty = async (reward: string, rulesURI: string, deadlineJam: number) => {
  const amount = parseEther(reward);
  await ensureApproval(amount);

  const deadline = BigInt(Math.floor(Date.now() / 1000) + deadlineJam * 3600);
  const hash = await wallet().writeContract({
    address: CONTRACTS.bountyFactory, abi: bountyFactoryAbi, functionName: "createBounty",
    args: [amount, rulesURI, deadline], gasPrice: await gasPrice(),
  });
  const receipt = await client.waitForTransactionReceipt({ hash });

  // escrow lahir di dalam tx → alamatnya cuma ada di event
  const [log] = parseEventLogs({ abi: [bountyCreatedEvent], logs: receipt.logs });
  return { hash, escrow: log?.args.escrow, bountyId: Number(log?.args.bountyId ?? -1) };
};

export const submitWork = async (escrow: Address, proofURI: string) => {
  const hash = await wallet().writeContract({
    address: escrow, abi: bountyEscrowAbi, functionName: "submitWork",
    args: [proofURI], gasPrice: await gasPrice(),
  });
  const receipt = await client.waitForTransactionReceipt({ hash });
  return { hash, sukses: receipt.status === "success" };
};
```


</details>


<details><summary>📋 `src/routes/api.ts` - 2 route tulis + gerbang 503</summary>


```typescript
import { relayerWallet } from "../lib/wallet";
import { createBounty, relayerAddress, submitWork } from "../services/relayer";
```


```typescript
app.use("/relay/*", async (c, next) => {
  if (!relayerWallet) return c.json({ error: "relayer mati: isi RELAYER_PK di .env" }, 503);
  await next();
});

app.post("/relay/bounty", async (c) => {
  const b = await c.req.json().catch(() => null);
  if (!b || typeof b.reward !== "string" || typeof b.rules_uri !== "string")
    return c.json({ error: "butuh: reward (string), rules_uri" }, 400);
  return c.json(await createBounty(b.reward, b.rules_uri, Number(b.deadline_jam ?? 24)), 201);
});

app.post("/relay/bounty/:escrow/submit", async (c) => {
  const escrow = c.req.param("escrow");
  const b = await c.req.json().catch(() => null);
  if (!isAddress(escrow)) return c.json({ error: "alamat tidak valid" }, 400);
  if (!b || typeof b.proof_uri !== "string") return c.json({ error: "butuh: proof_uri" }, 400);
  return c.json(await submitWork(escrow, b.proof_uri));
});
```

`/health` boleh sekalian nampilkan relayer:


```typescript
app.get("/health", (c) =>
  c.json({ ok: true, relayer: relayerAddress() ?? "mati", time: new Date().toISOString() }));
```


</details>


## 🧪 Testing :


```bash
curl -s localhost:3000/pending
curl -s localhost:3000/leaderboard
curl -s localhost:3000/health

# bikin bounty (butuh RELAYER_PK di .env)
curl -s -X POST localhost:3000/relay/bounty -H 'content-type: application/json' \
  -d '{"reward":"5","rules_uri":"https://raw.githubusercontent.com/DevWeb3Jogja/boootcamp-indonesia-web3-hacathon/da87a895de207bb6cea797a4e52d6903216fa15a/DEMO-RULES.md"}'

# submit bukti
curl -s -X POST localhost:3000/relay/bounty/0xESCROW/submit \
  -H 'content-type: application/json' \
  -d '{"proof_uri":"https://raw.githubusercontent.com/DevWeb3Jogja/boootcamp-indonesia-web3-hacathon/da87a895de207bb6cea797a4e52d6903216fa15a/backend/README.md"}'
```


# ☾ Part 2 - AI Oracle


## 2.1 Otak juri


<details><summary>📋 `src/services/judge.ts`</summary>


```typescript
import { LLM } from "../config";

const SYSTEM_PROMPT =
  "Kamu adalah oracle verifikasi untuk Papan Sayembara (bounty board) on-chain. " +
  "Tugasmu menilai apakah bukti kerjaan (proof) memenuhi aturan bounty (rules). " +
  "Nilai dengan ketat: kalau bukti tidak jelas, tidak lengkap, atau tidak bisa dicek, tolak. " +
  'Jawab HANYA dengan JSON valid: {"eligible": true/false, "alasan": "penjelasan singkat"}';

const fetchText = async (uri: string, maxChars = 8000) => {
  const url = uri.startsWith("ipfs://") ? `https://ipfs.io/ipfs/${uri.slice(7)}` : uri;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
    if (!res.ok) throw new Error(String(res.status));
    return (await res.text()).slice(0, maxChars);
  } catch {
    return null;
  }
};

export const judgeSubmission = async (rulesUri: string, proofUri: string, worker: string) => {
  // proof/rules jadi DATA di dalam JSON, bukan instruksi (anti prompt injection)
  const soal = JSON.stringify({
    rulesURI: rulesUri,
    rules_isi: (await fetchText(rulesUri)) ?? "(gagal diambil, nilai dari URI saja)",
    proofURI: proofUri,
    proof_isi: (await fetchText(proofUri)) ?? "(gagal diambil, nilai dari URI saja)",
    worker,
  });

  const res = await fetch(`${LLM.baseUrl}/chat/completions`, {
    method: "POST",
    headers: { authorization: `Bearer ${LLM.apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      model: LLM.model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: soal },
      ],
      temperature: 0,
    }),
    signal: AbortSignal.timeout(120_000),
  });
  if (!res.ok) throw new Error(`LLM ${res.status}: ${await res.text()}`);
  const content: string = (await res.json()).choices[0].message.content;

  const verdict = JSON.parse(content.slice(content.indexOf("{"), content.lastIndexOf("}") + 1));
  return { eligible: Boolean(verdict.eligible), alasan: String(verdict.alasan ?? "") };
};
```


</details>


## 2.2 Kirim verdict


<details><summary>📋 `src/services/oracle.ts`</summary>


```typescript
import type { Address } from "viem";
import { CONTRACTS } from "../config";
import { bountyEscrowAbi, bountyFactoryAbi } from "../contracts";
import { client } from "../lib/chain";
import { oracleWallet } from "../lib/wallet";

export const oracleOnchain = () =>
  client.readContract({ address: CONTRACTS.bountyFactory, abi: bountyFactoryAbi, functionName: "oracle" });

export const sendVerdict = async (escrow: Address, eligible: boolean) => {
  if (!oracleWallet) throw new Error("ORACLE_PK belum diisi");
  const hash = await oracleWallet.writeContract({
    address: escrow, abi: bountyEscrowAbi, functionName: "fulfillVerification",
    args: [eligible], gasPrice: await client.getGasPrice(),
  });
  const receipt = await client.waitForTransactionReceipt({ hash });
  return { hash, sukses: receipt.status === "success" };
};
```


</details>


## 2.3 Loop juri


<details><summary>📋 `src/oracle.ts` - entry point ke-2</summary>


```typescript
import { getAddress } from "viem";
import { POLL_INTERVAL_MS } from "./config";
import { getPending, insertVerdict } from "./lib/db";
import { oracleWallet } from "./lib/wallet";
import { readEscrow } from "./services/bounty";
import { judgeSubmission } from "./services/judge";
import { oracleOnchain, sendVerdict } from "./services/oracle";

if (!oracleWallet) throw new Error("ORACLE_PK belum diisi - cek .env");

const oracle = await oracleOnchain();
console.log(`Wallet juri    : ${oracleWallet.account.address}`);
console.log(`Oracle on-chain: ${oracle}`);
if (oracle.toLowerCase() !== oracleWallet.account.address.toLowerCase())
  console.log("PERINGATAN: wallet juri BUKAN oracle di factory. Tx bakal revert BukanOracle.");

const judged = new Set<string>();

console.log(`Juri AI jalan, polling tiap ${POLL_INTERVAL_MS / 1000} detik.`);
while (true) {
  try {
    // antrean langsung dari SQLite - tanpa HTTP
    for (const item of getPending()) {
      const escrow = getAddress(item.escrow);
      const key = `${escrow}:${item.proof_uri}`;
      if (judged.has(key)) continue;

      // DB itu cache → cek ulang ke chain sebelum kirim tx
      const e = await readEscrow(escrow);
      if (e.status !== "Disubmit") { judged.add(key); continue; }

      console.log(`\n[${escrow}]\n  worker: ${e.worker}\n  proof : ${e.proofURI}`);

      const { eligible, alasan } = await judgeSubmission(e.rulesURI, e.proofURI, e.worker);
      console.log(`  verdict AI: ${eligible ? "ELIGIBLE" : "DITOLAK"} (${alasan})`);

      const { hash, sukses } = await sendVerdict(escrow, eligible);
      console.log(`  tx: ${hash} (${sukses ? "sukses" : "GAGAL"})`);
      judged.add(key);

      if (sukses) insertVerdict.run({
        escrow: escrow.toLowerCase(), worker: e.worker.toLowerCase(),
        eligible: eligible ? 1 : 0, alasan, txHash: hash, ts: Date.now(),
      });
    }
  } catch (e) {
    console.log(`Error loop (lanjut lagi): ${e}`);
  }
  await Bun.sleep(POLL_INTERVAL_MS);
}
```


</details>


<details><summary>📋 `package.json` + `.env`</summary>


```json
"scripts": { "dev": "bun run --hot src/index.ts", "oracle": "bun run src/oracle.ts" }
```


```bash
RPC_URL=https://bsc-testnet.drpc.org
PORT=3000

RELAYER_PK=   # panitia - butuh tBNB DAN RWD
ORACLE_PK=    # juri - butuh tBNB, didaftarkan via setOracle

LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-4o-mini
LLM_API_KEY=

POLL_INTERVAL_SECONDS=15
```


</details>


## 🧪 Testing :


```bash
  # pastikan `bun dev` jalan di terminal lain
  # 1. bikin bounty sendiri (wallet kamu harus punya RWD)
  curl -s -X POST localhost:3000/relay/bounty -H 'content-type: application/json' \
    -d '{"reward":"5","rules_uri":"https://raw.githubusercontent.com/DevWeb3Jogja/boootcam
  p-indonesia-web3-hacathon/da87a895de207bb6cea797a4e52d6903216fa15a/DEMO-RULES.md"}'
  # → catat "escrow" dari balasannya

  # 2. submit bukti ke bounty tadi
  curl -s -X POST localhost:3000/relay/bounty/0xESCROW/submit \
    -H 'content-type: application/json' \
    -d
  '{"proof_uri":"https://gist.githubusercontent.com/FjrREPO/3f704cf309365d851eb6f2efbd9ec190/raw/03fe854b1547265f6d9a6d21e136fed5dec86442/PROOF.md"}'

  # 3. masuk antrean juri
  curl -s localhost:3000/pending

  # 4. setelah mentor menjalankan juri
  curl -s localhost:3000/verdicts/0xESCROW
  curl -s localhost:3000/leaderboard
```


*[button] *


> [!NOTE]
>

  **Next Lesson:**

  -
