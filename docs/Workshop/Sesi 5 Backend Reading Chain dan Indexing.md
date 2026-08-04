# Sesi 5 - Backend 1: Reading the Chain dan Indexing

- Tanggal: Minggu, 2 Agustus 2026, 19.30-21.30 WIB
- Mentor: Fajar Jati Nugroho (@Beatless16) dan Fajar Ramadhan (@xfajarrr)
- Sumber: Notion (Welcome Builders, page id 052951605d9883c5ba6801d77707f7ed)
- Konversi: 3 Agustus 2026, lewat Notion internal API (loadPageChunk + syncRecordValues untuk toggle children)

> [!NOTE]
> Materi ini mengindeks kontrak Sesi 4 (BountyFactory + BountyEscrow) yang sudah
> deploy di BSC testnet (chain 97). Dua pendekatan indexing diajarkan: (1) custom
> backend Bun + Hono + viem + SQLite, (2) Ponder framework. Alamat kontrak di
> bawah adalah deployment workshop mentor, bukan deployment milik SURIOTA di
> `~/reward-token`. Saat implementasi, ganti dengan alamat sendiri.

> [!WARNING]
> Ini arsip verbatim materi mentor. Kode blok dipertahankan persis apa adanya.
> Hanya em-dash di prosa yang diubah jadi hyphen untuk kepatuhan gaya markdown.

---

> [!NOTE]
> **What You'll Learn In This Lesson** (callout template Notion, diikuti blok
> daftar isi otomatis yang tidak punya teks sendiri).


# 🧰 Install Tools

Sudah punya? Cek dulu - yang error berarti belum ke-install:

```bash
git --version && node -v && npm -v && bun -v && forge --version
```

Node.js + npm - lewat nvm biar gampang ganti versi:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
# tutup-buka terminal, lalu:
nvm install 22
nvm use 22
```

Windows: winget install OpenJS.NodeJS.LTS (atau pakai nvm-windows).

Bun - runtime yang kita pakai malam ini:

```bash
curl -fsSL https://bun.sh/install | bash
```

Windows (PowerShell): powershell -c "irm bun.sh/install.ps1 | iex"

Foundry (forge/cast) - harusnya sudah dari Sesi 3; kalau belum:

```bash
curl -L https://foundry.paradigm.xyz | bash && foundryup
```

> [!TIP]
> Habis install apa pun: tutup-buka terminal dulu biar PATH-nya kebaca, baru cek
> versi lagi.


# 📚 Setup Backend

Bangun dari nol dengan bun init:

```bash
mkdir backend && cd backend
bun init -y
rm index.ts   # entry point kita nanti di src/index.ts
bun add hono viem
mkdir -p src/lib src/indexer src/services src/routes
```

Ganti bagian scripts di package.json:

```json
"scripts": {
  "dev": "bun run --hot src/index.ts"
}
```

Isi file satu per satu dari section 📄 Kode lengkap di bawah - urutannya: config → contracts → lib/ → indexer/ → services/ → routes/ → index.ts. Terakhir:

```bash
bun dev
```


# 🗺️ Peta kode (backend/src/)

| File | Isi |
| --- | --- |
| config.ts | RPC (fallback+rank), alamat kontrak, konstanta |
| contracts.ts | ABI + event (parseAbi) |
| lib/chain.ts · lib/db.ts | viem client · SQLite (skema + query idempotent) |
| indexer/ | handlers (log→DB) · backfill (scan per 999 block + checkpoint) · watch (real-time) |
| services/bounty.ts | readContract  • multicall (6 view = 1 request) |
| routes/api.ts | /board · /bounty/:escrow · /wallet/:address · /balance/:address · /health |


# 📄 Kode lengkap (klik untuk expand)

<details><summary>src/config.ts - konfigurasi</summary>

```typescript
// config.ts = satu tempat untuk semua konfigurasi & konstanta

// RPC publik bisa mati kapan saja → daftar fallback, .env dicoba pertama
export const RPC_URLS = [
  process.env.RPC_URL,
  "https://bsc-testnet.drpc.org",
  "https://97.rpc.thirdweb.com",
  "https://bsc-testnet-rpc.publicnode.com",
  "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
].filter(Boolean) as string[];

// Alamat deployment workshop - salin dari broadcast/run-latest.json, jangan ketik manual
export const CONTRACTS = {
  rewardToken: "0xa94218dbdb142a10e32ef7b494105d27f47f7045",
  bountyFactory: "0xfed3881ffb229453f53c20ba377d10b857b08247",
} as const;

export const DEPLOY_BLOCK = 122_685_851n; // block deploy factory, titik awal scan
export const CHUNK = 999n; // muat di semua RPC gratis (thirdweb: maks 1000 block per getLogs)
export const PORT = Number(process.env.PORT ?? 3000);
```
</details>

<details><summary>src/contracts.ts - ABI & event</summary>

```typescript
// contracts.ts = semua definisi kontrak: ABI, event, label status
// Backend ini read-only → hanya function view yang benar-benar dipanggil

import { parseAbi, parseAbiItem } from "viem";

export const bountyFactoryAbi = parseAbi([
  "function totalBounties() view returns (uint256)",
]);

export const bountyEscrowAbi = parseAbi([
  "function status() view returns (uint8)",
  "function creator() view returns (address)",
  "function rewardAmount() view returns (uint256)",
  "function rulesURI() view returns (string)",
  "function worker() view returns (address)",
  "function proofURI() view returns (string)",
]);

export const rewardTokenAbi = parseAbi([
  "function balanceOf(address account) view returns (uint256)",
]);

// Event yang di-track (untuk getLogs / watchEvent)
export const bountyCreatedEvent = parseAbiItem(
  "event BountyCreated(uint256 indexed bountyId, address indexed escrow, address indexed creator, uint256 rewardAmount)"
);

// Tiga event escrow digabung - getLogs/watchEvent menerima banyak event + alamat sekaligus
export const escrowEvents = [
  parseAbiItem("event WorkSubmitted(address indexed worker, string proofURI)"),
  parseAbiItem("event RewardReleased(address indexed worker, uint256 rewardAmount)"),
  parseAbiItem("event WorkRejected(address indexed worker)"),
] as const;

// Enum Status di BountyEscrow.sol - urutan harus sama persis
export const statusLabel = ["MenungguDana", "Dibuka", "Disubmit", "Selesai", "Dibatalkan"] as const;
```
</details>

<details><summary>src/lib/chain.ts - viem client</summary>

```typescript
// lib/chain.ts = viem public client, read-only (getLogs, readContract, watchEvent)

import { createPublicClient, fallback, http } from "viem";
import { bscTestnet } from "viem/chains";
import { RPC_URLS } from "../config";

export const client = createPublicClient({
  chain: bscTestnet, // chainId 97, sudah tersedia di viem/chains
  // rank: transport diurutkan berdasarkan kesehatan, yang bermasalah tidak selalu dicoba pertama
  transport: fallback(RPC_URLS.map((url) => http(url)), { rank: true }),
});
```
</details>

<details><summary>src/lib/db.ts - SQLite</summary>

```typescript
// lib/db.ts = SQLite (bun:sqlite): skema, prepared statement, dan query
// 3 tabel: bounties, submissions, sync_checkpoint (block terakhir yang diproses)

import { Database } from "bun:sqlite";
import type { Address } from "viem";

// strict: bind {param} tanpa prefix "@" + error bila ada parameter terlewat
export const db = new Database("papan-sayembara.db", { create: true, strict: true });

db.exec("PRAGMA journal_mode = WAL;");

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
```
</details>

<details><summary>src/indexer/handlers.ts - log → database</summary>

```typescript
// indexer/handlers.ts = ambil log dari chain + terjemahkan jadi baris database

import type { Address } from "viem";
import { CONTRACTS } from "../config";
import { bountyCreatedEvent, escrowEvents } from "../contracts";
import { client } from "../lib/chain";
import { insertSubmission, markLatestSubmission, upsertBounty } from "../lib/db";

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Kadang semua RPC error bersamaan sesaat → ulangi dari awal daftar fallback
const withRetry = async <T>(fn: () => Promise<T>, tries = 5): Promise<T> => {
  for (let i = 1; ; i++) {
    try { return await fn(); } catch (e) { if (i >= tries) throw e; await sleep(1500 * i); }
  }
};

const now = () => Math.floor(Date.now() / 1000);

export const getFactoryLogs = (fromBlock: bigint, toBlock: bigint) =>
  withRetry(() => client.getLogs({ address: CONTRACTS.bountyFactory, event: bountyCreatedEvent, fromBlock, toBlock, strict: true }));

// Satu request untuk banyak alamat + banyak event sekaligus
export const getEscrowLogs = (address: Address[], fromBlock: bigint, toBlock: bigint) =>
  withRetry(() => client.getLogs({ address, events: escrowEvents, fromBlock, toBlock, strict: true }));

export const handleBountyCreated = (log: Awaited<ReturnType<typeof getFactoryLogs>>[number]) => {
  upsertBounty.run({
    bountyId: Number(log.args.bountyId),
    escrow: log.args.escrow,
    creator: log.args.creator,
    rewardAmount: log.args.rewardAmount.toString(),
    txHash: log.transactionHash,
    blockNumber: Number(log.blockNumber),
    ts: now(),
  });
  console.log("📦 bounty created  #%s by %s", log.args.bountyId, log.args.creator);
};

export const handleEscrowLog = (log: Awaited<ReturnType<typeof getEscrowLogs>>[number]) => {
  const escrow = log.address; // alamat escrow yang meng-emit event
  switch (log.eventName) {
    case "WorkSubmitted":
      insertSubmission.run({
        escrow,
        worker: log.args.worker,
        proofUri: log.args.proofURI,
        txHash: log.transactionHash,
        blockNumber: Number(log.blockNumber),
        ts: now(),
      });
      console.log("📝 work submitted  %s → %s", log.args.worker, escrow);
      break;
    case "RewardReleased":
      markLatestSubmission(escrow, "rewarded", log.args.rewardAmount.toString());
      console.log("✅ reward released %s wei → %s", log.args.rewardAmount, escrow);
      break;
    case "WorkRejected":
      markLatestSubmission(escrow, "rejected");
      console.log("❌ work rejected   %s", escrow);
      break;
  }
};
```
</details>

<details><summary>src/indexer/backfill.ts - scan riwayat</summary>

```typescript
// indexer/backfill.ts = scan riwayat event per chunk, checkpoint tiap chunk

import { CHUNK, DEPLOY_BLOCK } from "../config";
import { client } from "../lib/chain";
import { db, getCheckpoint, knownEscrows, setCheckpoint } from "../lib/db";
import { getEscrowLogs, getFactoryLogs, handleBountyCreated, handleEscrowLog, sleep } from "./handlers";

export const backfill = async () => {
  const checkpoint = getCheckpoint();
  let from = checkpoint > DEPLOY_BLOCK ? checkpoint + 1n : DEPLOY_BLOCK;
  const latest = await client.getBlockNumber();
  if (from > latest) return;

  console.log("🔄 backfill dari block %s → %s", from, latest);

  while (from <= latest) {
    const to = from + CHUNK - 1n > latest ? latest : from + CHUNK - 1n;
    // Factory dahulu, baru escrow - escrow yang lahir di chunk ini langsung ikut di-scan
    (await getFactoryLogs(from, to)).forEach(handleBountyCreated);
    const escrows = knownEscrows();
    if (escrows.length) (await getEscrowLogs(escrows, from, to)).forEach(handleEscrowLog);
    setCheckpoint(to); // mati di tengah? lanjut dari sini
    from = to + 1n;
    await sleep(50); // jaga jatah rate limit RPC gratis
  }

  const count = (t: string) => (db.prepare(`SELECT COUNT(*) c FROM ${t}`).get() as { c: number }).c;
  console.log("✅ backfill selesai | bounties: %d | submissions: %d", count("bounties"), count("submissions"));
};
```
</details>

<details><summary>src/indexer/watch.ts - real-time</summary>

```typescript
// indexer/watch.ts = pantau event baru real-time (watchEvent)

import type { Address } from "viem";
import { CONTRACTS } from "../config";
import { bountyCreatedEvent, escrowEvents } from "../contracts";
import { client } from "../lib/chain";
import { knownEscrows } from "../lib/db";
import { handleBountyCreated, handleEscrowLog } from "./handlers";

export const watch = () => {
  const onError = (err: Error) => console.error("⚠️ watch error:", err.message);

  const watchEscrow = (address: Address) =>
    client.watchEvent({ address, events: escrowEvents, strict: true, onLogs: (logs) => logs.forEach(handleEscrowLog), onError });

  const escrows = knownEscrows();
  escrows.forEach(watchEscrow);

  // Escrow baru dari factory langsung ikut dipantau
  client.watchEvent({
    address: CONTRACTS.bountyFactory,
    event: bountyCreatedEvent,
    strict: true,
    onLogs: (logs) => logs.forEach((log) => { handleBountyCreated(log); watchEscrow(log.args.escrow); }),
    onError,
  });

  console.log("👀 watchEvent jalan: factory + %d escrow", escrows.length);
};
```
</details>

<details><summary>src/services/bounty.ts - baca state</summary>

```typescript
// services/bounty.ts = business logic: baca state chain + gabungan data on/off chain

import type { Address } from "viem";
import { CONTRACTS } from "../config";
import { bountyEscrowAbi, bountyFactoryAbi, rewardTokenAbi, statusLabel } from "../contracts";
import { client } from "../lib/chain";
import { getBoard } from "../lib/db";

// readContract = membaca function view di kontrak (gratis, tanpa gas)

// Detail escrow live dari chain - 6 view dalam SATU request via multicall
export const readEscrow = async (escrow: Address) => {
  const contract = { address: escrow, abi: bountyEscrowAbi } as const;
  const [status, creator, rewardAmount, rulesURI, worker, proofURI] = await client.multicall({
    contracts: [
      { ...contract, functionName: "status" },
      { ...contract, functionName: "creator" },
      { ...contract, functionName: "rewardAmount" },
      { ...contract, functionName: "rulesURI" },
      { ...contract, functionName: "worker" },
      { ...contract, functionName: "proofURI" },
    ],
    allowFailure: false,
  });
  return { status: statusLabel[status], creator, rewardAmount: rewardAmount.toString(), rulesURI, worker, proofURI };
};

// Gabungan: total live dari chain + data historis hasil indexing
export const board = async () => ({
  total: Number(await client.readContract({
    address: CONTRACTS.bountyFactory, abi: bountyFactoryAbi, functionName: "totalBounties",
  })),
  ...getBoard(),
});

// Saldo RWD sebuah wallet
export const balanceOf = (addr: Address) =>
  client.readContract({ address: CONTRACTS.rewardToken, abi: rewardTokenAbi, functionName: "balanceOf", args: [addr] });
```
</details>

<details><summary>src/routes/api.ts - endpoint REST</summary>

```typescript
// routes/api.ts = definisi endpoint REST (Hono)

import { Hono } from "hono";
import { cors } from "hono/cors";
import { isAddress } from "viem";
import { getBoard } from "../lib/db";
import { balanceOf, board, readEscrow } from "../services/bounty";

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

// GET /health → cek server hidup
app.get("/health", (c) => c.json({ ok: true, time: new Date().toISOString() }));
```
</details>

<details><summary>src/index.ts - entry point</summary>

```typescript
// index.ts = entry point: jalankan indexer, lalu sajikan API

import { PORT } from "./config";
import { backfill } from "./indexer/backfill";
import { watch } from "./indexer/watch";
import { app } from "./routes/api";

// Bila backfill gagal (RPC bermasalah), API tetap hidup - checkpoint melanjutkan di run berikutnya
await backfill().catch((e) => console.error("⚠️ backfill gagal, API tetap jalan:", e?.shortMessage ?? e));
watch();

console.log(`🚀 API jalan di http://localhost:${PORT}/board`);
export default { port: PORT, fetch: app.fetch };
```
</details>


# ☾ Indexing dengan Ponder

*[gambar lampiran Notion - banner Ponder, tidak diunduh]*


# 🧰 Setup Ponder

[https://ponder.sh/docs/get-started](https://ponder.sh/docs/get-started)

Scaffold dari nol:

```bash
bunx create-ponder ponder
cd ponder
bun install
```

Bikin .env.local (gitignored - jangan commit key):

```bash
# convention create-ponder: PONDER_RPC_URL_<chainId>
PONDER_RPC_URL_97=https://bsc-testnet.drpc.org
# kosong = PGlite (zero setup). Isi kalau mau Postgres.
DATABASE_URL=
```

Timpa file hasil scaffold dengan kode di toggle bawah - urutannya: ponder.config.ts → ponder.schema.ts → abis/ → src/index.ts → src/api/index.ts (jangan dihapus - wajib ada biar build lolos). Lalu:

```bash
bun run dev
```


# 📄 Kode lengkap (klik untuk expand)

<details><summary>ponder.config.ts - chain, kontrak, factory pattern</summary>

```typescript
import { parseAbiItem } from "abitype";
import { createConfig, factory } from "ponder";

import { BountyEscrowAbi } from "./abis/BountyEscrowAbi";
import { BountyFactoryAbi } from "./abis/BountyFactoryAbi";

// Event yang di-emit factory saat createBounty (parameter "escrow" = alamat child)
const bountyCreatedEvent = parseAbiItem(
  "event BountyCreated(uint256 indexed bountyId, address indexed escrow, address indexed creator, uint256 rewardAmount)",
);

// Deployment workshop (2 Agu 2026, verified) - salin dari SmartContract/broadcast/run-latest.json
const FACTORY = "0xfed3881ffb229453f53c20ba377d10b857b08247" as const;
const START_BLOCK = 122_685_851; // block deploy factory

export default createConfig({
  chains: {
    bscTestnet: {
      id: 97,
      // create-ponder convention: PONDER_RPC_URL_<chainId>
      rpc: process.env.PONDER_RPC_URL_97,
    },
  },
  contracts: {
    // Index factory sendiri (event BountyCreated)
    BountyFactory: {
      chain: "bscTestnet",
      abi: BountyFactoryAbi,
      address: FACTORY,
      startBlock: START_BLOCK,
    },
    // Index SEMUA escrow yang di-spawn factory (factory pattern)
    BountyEscrow: {
      chain: "bscTestnet",
      abi: BountyEscrowAbi,
      address: factory({
        address: FACTORY,
        event: bountyCreatedEvent,
        parameter: "escrow",
      }),
      startBlock: START_BLOCK,
    },
  },
});
```
</details>

<details><summary>ponder.schema.ts - skema tabel</summary>

```typescript
import { onchainTable } from "ponder";

// Siapa posting tugas apa
export const bounty = onchainTable("bounty", (t) => ({
  id: t.text().primaryKey(), // alamat escrow
  bountyId: t.integer().notNull(),
  creator: t.hex().notNull(),
  rewardAmount: t.bigint().notNull(),
  createdAtBlock: t.bigint().notNull(),
  createdAt: t.bigint().notNull(),
}));

// Siapa submit / klaim apa
export const submission = onchainTable("submission", (t) => ({
  id: t.text().primaryKey(), // `${escrow}-${worker}`
  bountyEscrow: t.hex().notNull(),
  worker: t.hex().notNull(),
  proofUri: t.text().notNull(),
  status: t.text().notNull(), // submitted | rewarded | rejected
  rewardAmount: t.bigint(),
  blockNumber: t.bigint().notNull(),
  submittedAt: t.bigint().notNull(),
}));
```
</details>

<details><summary>src/index.ts - event handlers</summary>

```typescript
import { ponder } from "ponder:registry";
import { bounty, submission } from "ponder:schema";

// Factory: BountyCreated → row bounty
ponder.on("BountyFactory:BountyCreated", async ({ event, context }) => {
  const { bountyId, escrow, creator, rewardAmount } = event.args;

  await context.db
    .insert(bounty)
    .values({
      id: escrow,
      bountyId: Number(bountyId),
      creator,
      rewardAmount,
      createdAtBlock: event.block.number,
      createdAt: event.block.timestamp,
    })
    .onConflictDoNothing();

  console.log(`📦 bounty #${bountyId} by ${creator} → ${escrow}`);
});

// Escrow: WorkSubmitted
ponder.on("BountyEscrow:WorkSubmitted", async ({ event, context }) => {
  const escrow = event.log.address;
  const { worker, proofURI } = event.args;

  await context.db
    .insert(submission)
    .values({
      id: `${escrow}-${worker}`,
      bountyEscrow: escrow,
      worker,
      proofUri: proofURI,
      status: "submitted",
      blockNumber: event.block.number,
      submittedAt: event.block.timestamp,
    })
    .onConflictDoUpdate({
      proofUri: proofURI,
      status: "submitted",
      blockNumber: event.block.number,
      submittedAt: event.block.timestamp,
    });

  console.log(`📝 submit ${worker} @ ${escrow}`);
});

// Escrow: RewardReleased
ponder.on("BountyEscrow:RewardReleased", async ({ event, context }) => {
  const escrow = event.log.address;
  const { worker, rewardAmount } = event.args;

  await context.db
    .update(submission, { id: `${escrow}-${worker}` })
    .set({ status: "rewarded", rewardAmount });

  console.log(`✅ reward ${worker} @ ${escrow}`);
});

// Escrow: WorkRejected
ponder.on("BountyEscrow:WorkRejected", async ({ event, context }) => {
  const escrow = event.log.address;
  const { worker } = event.args;

  await context.db
    .update(submission, { id: `${escrow}-${worker}` })
    .set({ status: "rejected" });

  console.log(`❌ reject ${worker} @ ${escrow}`);
});
```
</details>

<details><summary>src/api/index.ts - GraphQL endpoint</summary>

```typescript
import { db } from "ponder:api";
import schema from "ponder:schema";
import { Hono } from "hono";
import { client, graphql } from "ponder";

// Minimal API supaya `ponder dev` build lolos.
// REST workshop (board, wallet, AI verify) = ../backend - bukan di sini.
const app = new Hono();

app.use("/sql/*", client({ db, schema }));
app.use("/", graphql({ db, schema }));
app.use("/graphql", graphql({ db, schema }));

export default app;
```
</details>

<details><summary>abis/BountyFactoryAbi.ts - ABI</summary>

```typescript
// abis/BountyFactoryAbi.ts
export const BountyFactoryAbi = [
  {
    type: "event",
    name: "BountyCreated",
    inputs: [
      { name: "bountyId", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "escrow", type: "address", indexed: true, internalType: "address" },
      { name: "creator", type: "address", indexed: true, internalType: "address" },
      { name: "rewardAmount", type: "uint256", indexed: false, internalType: "uint256" },
    ],
    anonymous: false,
  },
  {
    type: "function",
    name: "totalBounties",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
] as const;
```
</details>

<details><summary>abis/BountyEscrowAbi.ts - ABI</summary>

```typescript
// abis/BountyEscrowAbi.ts
export const BountyEscrowAbi = [
  {
    type: "event",
    name: "WorkSubmitted",
    inputs: [
      { name: "worker", type: "address", indexed: true, internalType: "address" },
      { name: "proofURI", type: "string", indexed: false, internalType: "string" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RewardReleased",
    inputs: [
      { name: "worker", type: "address", indexed: true, internalType: "address" },
      { name: "rewardAmount", type: "uint256", indexed: false, internalType: "uint256" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "WorkRejected",
    inputs: [
      { name: "worker", type: "address", indexed: true, internalType: "address" },
    ],
    anonymous: false,
  },
] as const;
```
</details>

> [!NOTE]
> **Next Lesson:** tautan ke halaman Sesi 6 (masih berjudul "Sesi 6 Soon" saat
> arsip ini dibuat, belum ada isi).
