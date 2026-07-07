> 🗄️ **ARSIP.** Opsi ini sudah divalidasi dan bukan fokus submission. Disimpan sebagai referensi dan roadmap. Fokus aktif: [Opsi 5 WattSettle](<../02 Opsi 5 WattSettle.md>) · [Opsi 6 Enovatek](<../03 Opsi 6 Enovatek.md>) · [Codex 7 dan 8](<../Codex Opsi 7 8/>). Index arsip: [README](README.md).

---

# ProofOfAlpha, Definitive 1st-Place Strategy (Option 3)

**Indonesia Web3 Hackathon 2026 · Track: Finance & Commerce · Builder: Gifari Kemal Suryo (SURIOTA), solo**
**Theme fit: AI x Web3 · Deploy target: BNB Smart Chain Testnet (chainId 97) · Demo Day: 30 Aug 2026**

> **One-liner:** *A BNB-native trustless referee for trading agents. A neutral deterministic contract replays an autonomous agent's blind, commit-revealed signals against a price oracle and writes a non-forgeable, risk-adjusted score straight into the REAL ERC-8004 Reputation Registry, turning "trust my returns" into "verify my score."*
>
> **Repeatable tag:** **"Verify the score. Don't trust the story."**

---

## 0. Executive Decision

Build **ProofOfAlpha**. This document supersedes the raw concept and folds in the red-team fixes, all of which are now **verified against primary sources** (BSC-testnet deployment JSON, the EIP-8004 text, the reference-impl README, and the live competitor's repo). Two of the six "killshots" were based on stale assumptions and are **neutralized by evidence**: the design is *more* defensible than feared. The remaining risks are execution risks, fully mitigated below.

**Verified reality (load-bearing, cite in the deck):**
1. **All 3 ERC-8004 registries are LIVE on BSC testnet (chainId 97)**, deployed 2026-02-18 via CREATE2 SAFE singletons at vanity `0x8004…` addresses, version 2.0.0, `verifiedOnChain: true`. → *You cannot and must not fork them; you write INTO them.*
   - IdentityRegistry `0x8004A818BFB912233c491871b3d84c89A494BD9e`
   - ReputationRegistry `0x8004B663056A597Dffe9eCcC1965A193B7388713`
   - ValidationRegistry `0x8004Cb1BF31DAf7788923b405b754f57acEB4272`
2. **`giveFeedback` is PERMISSIONLESS** in the shipped v2 reference impl, *"New feedback can be added by any clientAddress"*: with the **only** restriction being the **self-feedback ban** (owner/approved-operator cannot rate their own agent, checked via Identity Registry). → **The mechanism keystone is TRUE and needs no `feedbackAuth` pre-authorization.** The agent literally cannot write its own score; a neutral external address must. That is exactly ProofOfAlpha's Settlement contract.
3. **Score encoding is `value:int128 + valueDecimals:uint8` (0 sampai 18)**, NOT a `uint8` 0 sampai 100. A 0 sampai 100 alpha score = `value=87, valueDecimals=0`. `getSummary(agentId, clientAddresses[], tag1, tag2)` returns `(uint64 count, int128 summaryValue, uint8 summaryValueDecimals)` and **requires a non-empty `clientAddresses[]`** (Sybil guard).
4. **Validation Registry is deployed but spec-flagged "still under active update"** → treat it as a *secondary* tag write; put the load-bearing score through the **stable Reputation Registry**.
5. **BNB is #1 for ERC-8004 agents: 39,072 agents / 39.9% share** (CryptoRank, 2026-03-17) > Base (19,273) + Ethereum (14,467). And **~99.95% are empty shells / only ~50 "real"** (LaPlace ERC-8004 Ecosystem Report). → The wedge writes itself.
6. **Binance Oracle testnet feed updates only every 24h** → a scripted **MockAggregator** on the identical `AggregatorV3Interface` is **mandatory** for a bar-by-bar 90-second demo, not optional.
7. **Nearest competitor Veil Signal Arena is confirmed distinct**: Move/Initia appchain, scores **human prose theses** (`thesis`+`evidence` strings) with a **flat points table** (base 10 + confidence/5 + mode bonus), **no oracle replay, no risk metrics, no ERC-8004**. Different chain, different trust model, no quant.

---

## 1. Final Framing & Sharpened Concept

**What it is (say this exactly):** ProofOfAlpha is **public infrastructure, a trustless referee, not a fund and not a bot.** It never takes custody, never touches PnL, never charges a % of AUM. Any strategy author (human quant *or* autonomous agent) registers an ERC-8004 identity and runs a **commit → settle → attest** loop against a neutral **Settlement contract**. Because ERC-8004 forbids self-feedback at the contract level, the score *must* come from an independent writer. Making that writer **one deterministic contract reading a price oracle**: not a human, not a staked committee, not a zkML rig, is the clean, novel, solo-buildable answer. Trust is minimized to *public code + public oracle*.

**The sharpened wedge (the ONE thing no competitor has):** *machine-replayable QUANT signals scored against a real price ORACLE with computed risk metrics.* Say it in one line:

> **"Veil proves you SAID it first. ProofOfAlpha proves the market would have PAID you for it."**

**Why it escapes the trading-bot trap:** it sells PROOF, not PnL. It does not care if a strategy wins, a loser earns an honest, immutable low score. This makes it **orthogonal and complementary** to BNB's own $36K PnL-ranked AI-Trading-Agents bounty: *that* ranks returns; *this* is the referee those winners plug into to prove their claims are real. Never a competitor, the Switzerland of agent reputation.

**Positioning sentence for judges:** *"BNB is already #1 on Earth for AI agents, 39,000 of them, and 99.95% are unverifiable shells that grade their own homework. I built the one thing that population is missing: proof."*

---

## 2. Target Winning Criteria (what we optimize every session for)

| # | Judge criterion | How ProofOfAlpha maxes it |
|---|---|---|
| 1 | **Autonomous AI-agent depth** (top-weighted) | A real LLM (reuse Hermes/Kimi tool-call) makes each **blind** call + rationale; loop runs commit→settle→attest with zero human touch; rationale hash committed on-chain. |
| 2 | **Working LIVE deterministic demo** | Byte-identical via owned MockAggregator; the live **on-chain cheat-revert** is the emotional core. |
| 3 | **BNB-native primitive usage** | Writes into the REAL `0x8004…` Reputation Registry singleton; Binance-Oracle-compatible interface; rides BNB's officially-backed #1 agent narrative. |
| 4 | **Mechanism-design novelty** | Deterministic contract AS the ERC-8004 validator; oracle-replay + on-chain Sharpe/maxDD/hit-rate vs prose-scoring/self-reporting prior art. |
| 5 | **Real-world impact / Finance fit** | Non-forgeable track record for the $2B+ influencer-loss / copy-trading problem; neutrality-as-moat business model. |
| 6 | **Pitch quality** | Named problem, adversarial money-shot, repeatable tag, credible solo-quant story. |

---

## 3. Sharpened Autonomous Agent Loop (the fix for AI-theater)

Per **bar** (a fixed interval the demo ticks), fully autonomous, anti-cheat built into the mechanism:

0. **AUTHORIZE / REGISTER (once, on-chain, shown in Act 0):** Agent mints its ERC-8004 Identity NFT (real registry) and, because `giveFeedback` is permissionless, the agent simply **is not** the one who can score itself; the self-feedback ban does the work. The agent keeps its own NFT ownership; Settlement is **never** its approved operator. *This visibly surrenders write-control, blind, before any price is known.*
1. **DECIDE (real AI):** the signal generator is wired to an **actual LLM tool-call** (reuse Hermes/Kimi + SUVA infra) that reads the committed price tape context and emits **direction + a one-line rationale**. Not a bare rule, a model decision. Kills the "where is the AI?" objection.
2. **COMMIT (blind):** post `commit(keccak256(dir, salt, rationaleHash))` **before** the oracle prints the next bar. Judges see only a hash.
3. **SETTLE (trustless):** after the oracle advances one bar, agent calls `reveal(dir, salt, rationaleHash)`. Settlement verifies the hash, reads the realized move from `AggregatorV3Interface`, computes that bar's realized return, and updates on-chain accumulators (cumReturn, sumSq for vol, runningMaxDD, wins/losses, barCount).
4. **ATTEST (autonomous):** once per scoring window Settlement folds accumulators into a single **0 sampai 100 score** and writes it via `giveFeedback(agentId, value=score, valueDecimals=0, tag1, tag2, …)` into the **stable Reputation Registry**: an immutable attestation the agent *cannot forge because it never computes it.* (Optional `validationResponse()` tag as a secondary "nice-to-have," not load-bearing.)
5. **QUERY (anyone):** the leaderboard dApp iterates the known agent set (from Identity `Transfer`/register events) and calls `getSummary(agentId, [settlementAddr], tag1, tag2)` per agent, ranking by cryptographically-proven risk-adjusted return.

**Trust primitive precedence (critical framing):** the **anti-cheat guarantee lives in the `keccak256` commit-reveal inside YOUR Settlement contract**, not in the 8004 write. The 8004 write is the **distribution/composability** layer ("we publish the resulting score into the canonical BNB registry where 39k agents live"). Both are true; keeping them distinct pre-empts any "self-attestation-by-proxy" objection.

---

## 4. MVP Scope Mapped to 9 Sunday Sessions

**Minimal contract surface:** exactly **ONE new contract, `Settlement.sol` (~200 sampai 300 LOC)** + a `MockAggregator.sol`. **Do NOT deploy or fork the registries**: they are live singletons; interoperate with the shipped ABI. (Ponytail discipline: stdlib/registry-native first; OZ `Math.sqrt` for the one sqrt; no proxies, no subgraph, no indexer.)

| Session | Deliverable | Definition of done |
|---|---|---|
| **S1** (env + truth) | Foundry env on chainId 97. **Day-1 non-negotiable:** pull the **deployed** Identity + Reputation ABIs from `0x8004…`, generate typed bindings, delete every "deploy registries" line. Deploy `MockAggregator` (exact `AggregatorV3Interface`). Register one Identity NFT in the REAL registry. | Agent NFT visible on `testnet.bscscan.com` / QuickNode 8004 explorer. |
| **S2** (commit-reveal, TDD) | `Settlement.commit(bytes32)` / `reveal(int8 dir, uint256 salt, bytes32 rationaleHash)` + **hash-mismatch revert test** (red→green). | Mismatched reveal reverts on-chain; test is the demo's Act-1 guarantee. |
| **S3** (risk math) | On-chain integer fixed-point: cumulative return, **max-drawdown, hit-rate** (Sharpe only if time). Guard `n<2` and `variance==0`. Lock exact demo score as a **constant** in a unit test. | Deterministic score for the scripted tape = known constant, asserted. |
| **S4** (attest) | Settlement writes via `giveFeedback(agentId, int128 value, uint8 valueDecimals, tag1='alpha', tag2='maxdd', …)`. Test: **Settlement can write, agent-owner CANNOT** (self-feedback ban). | Score readable via `getSummary(agentId,[settlement],…)`. |
| **S5** (real AI loop) | Python agent (web3.py) + **LLM tool-call** (Hermes/Kimi) emitting dir+rationale; scripted price tape; commit→wait-tick→reveal→read. | End-to-end one-agent loop runs headless, deterministic. |
| **S6** (leaderboard dApp) | Read-only dApp: enumerate agents from Identity events, `getSummary` per agent + `readAllFeedback`, render Sharpe/maxDD/hit-rate live. | Split-screen right panel reads REAL on-chain state. |
| **S7** (adversary) | Second "influencer" agent = a config file that BRAGS a huge self-claimed number but whose committed signals LOSE. Adversarial script for the cheat-revert. | Honest quant ranks #1, braggart last, on-chain. |
| **S8** (harden + pre-mine) | **Pre-mine ~14 bars on-chain pre-show**; wire stage run to **1 live bar + the cheat-revert**. Private/paid RPC, pre-funded wallet, pinned nonces. Rehearse to muscle memory. | Full 90s runs byte-identical 5x in a row. |
| **S9** (pitch + fallback) | Deck, tag-line rehearsal, **byte-identical fallback video one keystroke away**, repo hygiene pass. | Demo-Day-ready; ~2 sessions slack already consumed as insurance. |

**Slack:** the plan front-loads the two riskiest items (real registry ABI in S1, hash-revert in S2). S8, S9 exist purely for rehearsal + fallback. Realistic for the builder's Solidity/Foundry + Python/web3 stack.

---

## 5. Value / Token Model

**TOKEN-LESS by design, and defend it proactively.** A fee/reward token would give the operator an incentive to inflate scores, destroying the only thing being sold: neutrality. Memorize this line:

> *"No token, on purpose. A fee or reward token would give me a reason to inflate scores, which destroys the only thing I sell. I trust only the chain and the oracle, and I don't even hold your money."*

**Value capture (all post-hackathon, non-custodial), charge the READERS not the traders:**
1. **Read/Query API**: free on-chain reads (credibly neutral, like Etherscan); paid off-chain indexed API + webhooks for allocators wanting ranked/filtered risk-adjusted leaderboards ($29 sampai 299/mo tiers, mirroring 3Commas/ASCN pricing already in market).
2. **Allocation-gate licensing**: dHEDGE/Enzyme-style on-chain vaults + DAO treasuries pay to read a trustless allocation gate ("sort strategies by proven Sharpe, apply 15% max-DD circuit-breaker", the documented pro workflow, one-click).
3. **Optional flat validation fee**: small BNB fee per scoring-window write, paid by the agent that *wants* a proven score (aligns cost with beneficiary; gas-plus, never a % of AUM).
4. **Premium oracle feeds**: swap MockAggregator for licensed Binance/Chainlink feeds for exotic assets / higher-frequency windows.

**The token objection flip:** *"The allocators pay to read; I charge the readers, not the traders, because neutrality IS the product."*

---

## 6. Market Case (numbers, primary-sourced first)

**Lead with the unimpeachable BNB fact, not the shaky secondary stats:**
- **39,072 ERC-8004 agents on BNB Chain / 39.9% share** > Base (19,273) + Ethereum (14,467), CryptoRank via ethnews, 2026-03-17. BNB is the single largest on-chain AI-agent population on Earth.
- **~99.95% of ERC-8004 agents are empty shells; ~50 are "real"** (LaPlace ERC-8004 Ecosystem Report 2026). Every one self-reports; near-zero are verifiable. **This is the wedge.**
- **BNB officially backs ERC-8004** (deployed both mainnet+testnet 2026-02-04, paired with BAP-578 Non-Fungible-Agent) → co-marketing/native-primitive alignment judges reward.

**Problem-size support (secondary, use as color not headline):**
- Retail lost **~$2.3B in 2026 copying influencer trades**; only **23%** of "track records" verify under audit; **78%** of influencer traders underperform BTC buy-and-hold (CoinGecko Social Trading Report).
- Named **"Fake Track Record Scam"**: post winners, hide losers, no third-party verification, no timestamps, no equity curve. ProofOfAlpha supplies exactly those three missing primitives natively.

**Buyer market (Finance-track credibility):**
- Social Trading Platform market **$2.23B (2021) → $3.77B (2028)**, 7.8% CAGR.
- On-chain / DAO copy-trading TVL (dHEDGE, Enzyme) **+340% in 2026 to ~$780M**: the direct integration target.
- AI-agent crypto sector **~$8B market cap Q1 2026**; AI-DeFi TVL **>$14B (+340%)**. Every one of these agents self-reports → ProofOfAlpha is the missing scoring layer.
- Pro workflow already demands the exact output: Sharpe-weighted allocation + 15% max-DD circuit-breaker + on-chain verification. Verified signals showed **67% vs 41%** win rate, verification demonstrably has value.

---

## 7. Demo Day Pitch Table (sub-3-minute)

| Time | Beat | Script (compressed) | On-screen |
|---|---|---|---|
| **0:00 sampai 0:25** | **Hook + named problem** | Hold up phone. *"This AI agent says it made 340% last month. It's lying, and so is every leaderboard you've trusted. BNB is #1 on Earth for AI agents: 39,000 of them, 99.95% unverifiable shells that grade their own homework."* | Phone / one stat slide. |
| **0:25 sampai 0:50** | **Insight + what it is** (mechanism keystone) | *"ERC-8004 forbids self-feedback at the contract level, an agent can't rate itself. So a real score MUST come from a neutral writer. Everyone assumed that meant a staked committee or a zkML rig. It doesn't. It can be one deterministic contract reading a price oracle. ProofOfAlpha is that contract. Not a fund, not a bot, the trustless referee. It sells proof, not PnL."* | Architecture diagram. |
| **0:50 sampai 1:05** | **Unfair advantage** | *"Two moats. One, I'm a quant: MT5 bots, forex, gold, real backtesting and risk stacks; the scoring engine is my day job, computed on-chain. Two, BNB-native by design: I write into the SAME `0x8004…` Reputation Registry the 39,000 agents live in. Go verify my agent on BscScan right now."* | BscScan open on agent. |
| **1:05 sampai 2:20** | **LIVE DEMO, money shot** | Split screen. *"My oracle is a MockAggregator on the exact Binance-Oracle interface, I own the tape, so this is byte-identical every run, and mainnet-swappable."* **Act 1:** agent's LLM makes a blind call → only a hash on-chain → tick → reveal → score ticks. *"Watch me cheat."* Reveal a DIFFERENT winning signal → **contract REVERTS on-chain, live.** *"You cannot lie about what you predicted."* **Act 2:** the ~14 pre-mined bars are read live from the REAL registry, Sharpe/maxDD render from chain, not the agent's mouth. **Act 3:** the braggart influencer: self-claimed huge, on-chain proven near-zero → leaderboard ranks honest quant #1, braggart last. | Terminal ‖ live dApp. |
| **2:20 sampai 2:45** | **Impact + BNB/national button** | *"OKX, Phemex, they ask you to trust an exchange's numbers. This asks you to trust only the chain and the oracle. First genuinely trustless copy-trading leaderboard, public infra any vault or DAO reads on-chain. Built solo, in Jogja, on BNB, the chain already winning the agent race."* | Impact slide. |
| **2:45 sampai 3:00** | **Close + tag** | Hold phone up. *"Every trading agent tells you it makes money. ProofOfAlpha is the only place where the chain, not the agent, decides if that's true."* Drop on: **"Verify the score. Don't trust the story."** | Tag on screen. |

---

## 8. Demo Runbook (byte-identical or it dies on stage)

**Pre-show (do NOT live-mine 30-40 txs):**
1. Deploy MockAggregator + register both agent NFTs (honest + braggart) in the REAL registry.
2. **Pre-mine ~14 scripted bars on-chain** for the honest agent → real historical on-chain state (MORE impressive than a mock).
3. Pre-fund the stage wallet generously; use a **private/paid BSC-testnet RPC** (never the public data-seed); pin nonces.
4. Load the scripted price tape into MockAggregator; verify the locked score constant matches the S3 unit-test value.
5. Stage a **byte-identical fallback video**, one keystroke away.

**On stage (only these run live):**
- **1 fresh bar**: LLM blind call → commit (hash only) → tick oracle → reveal → score ticks up.
- **The cheat-revert**: attempt `reveal` with a mismatched signal → on-chain revert in front of judges. *(This single beat is the uniquely-defensible core, no PnL bot can show it.)*
- Read the pre-mined 14 bars + both agents' scores live via `getSummary` → leaderboard renders.

**Guards baked in (unit-tested):** `n<2` and `variance==0` branches; integer `sqrt` (OZ `Math.sqrt`) for Sharpe; score locked to a constant. Never headline a raw Sharpe number on 15 bars, frame the bars as *"a compressed replay of a longer pre-committed tape,"* lead with hit-rate + max-drawdown + the cheat-revert.

---

## 9. Repo Hygiene

- **Monorepo:** `/contracts` (Foundry: `Settlement.sol`, `MockAggregator.sol`, `test/`), `/agent` (Python web3.py + LLM tool-call, two config files `honest.toml` / `influencer.toml`), `/dapp` (read-only leaderboard), `/docs`.
- **Never commit secrets** (RPC keys, wallet PKs, LLM API keys → `.env` + `.env.example`; `.gitignore` enforced). Honor the standing SURIOTA rule: no credentials in any tracked file.
- **`deployments/bsc-testnet.json`** pins the REAL registry addresses + your Settlement + MockAggregator addresses + agent IDs, the "go verify" artifact.
- **README:** the one-liner, the tag, the verified addresses, a 3-command quickstart, and a "How it works / why it's trustless" section (self-feedback ban → neutral validator).
- **Tests are the spec:** hash-revert test, self-feedback-ban test, locked-score-constant test are the three that guarantee the demo. Keep them green in CI (GitHub Actions, `forge test`).
- **Foundry v1.7.1**, deterministic solc version pinned in `foundry.toml`. No proxies on Settlement (immutable).
- **License:** MIT/CC0 on your code (registries are CC0), reinforces the public-goods / neutral-infra story.

---

## 10. Kill-Shot Checklist (verified status + action)

| # | Killshot | Verified status | Non-negotiable action |
|---|---|---|---|
| 1 | "feedbackAuth means agent pre-authorizes writer → self-attestation-by-proxy" | **FALSE for shipped v2.** `giveFeedback` is **permissionless**; only the self-feedback ban applies. Mechanism is *stronger* than claimed. | Frame commit-reveal in Settlement as the trust primitive; 8004 write = distribution. Show agent keeps NFT, Settlement never operator. |
| 2 | "You can't deploy the 3 registries / ABI mismatch" | **TRUE, they're live singletons at `0x8004…`.** | S1 Day-1: pull deployed ABIs, generate bindings, delete all "deploy registries" lines. Encode score as `int128 value + valueDecimals=0`. Blanket-read is impossible → `getSummary` per agent with `[settlementAddr]`. **Flex it:** "same registry as 39k agents, verify on BscScan." |
| 3 | "AI-theater, it's a rule tape / Sharpe on 15 bars is meaningless" | Real risk on the top-weighted criterion. | Wire a **real LLM decision** (Hermes/Kimi) with rationale hash on-chain. Lead with hit-rate/maxDD + cheat-revert; Sharpe = footnote "meaningful at scale." |
| 4 | "Prior art thinner than claimed; Veil near-clone; Knidos chain error" | Veil confirmed **Move/Initia, prose-scoring, no oracle, no risk metrics, no 8004**: distinct. | Ship the wedge line ("Veil proves you said it first; ProofOfAlpha proves the market would have paid you"). Get **every** prior-art fact byte-correct (Knidos = Avalanche/custodial). |
| 5 | "Demo failure, 30-40 sequenced txs on public RPC" | Real execution risk. | Pre-mine 14 bars; live-run only 1 bar + cheat-revert. Private RPC, pinned nonces, guarded math, fallback video. |
| 6 | "Market hand-waving + weak business answer" | Fixable. | Lead with the primary-sourced BNB #1 + 99.95%-shells stats. Memorize the "charge readers, no token on purpose" moat answer. |

---

## 11. Victory Metric

**Primary (the win condition):** On Demo Day, a judge can open `testnet.bscscan.com` / the 8004 explorer and see **ProofOfAlpha's honest-quant agent carrying a risk-adjusted score in the SAME Reputation Registry as BNB's 39,000 agents**, AND watch a **cheating reveal get rejected on-chain, live**: a beat no live-PnL bot in the field can reproduce. If both are true and the run is byte-identical, the pitch has no factual attack surface.

**Secondary (leading indicators through the 9 sessions):**
- S2: hash-mismatch reverts (test green).
- S4: Settlement writes score; agent-owner write reverts (self-feedback ban test green).
- S6: leaderboard reads REAL on-chain `getSummary` for ≥2 agents.
- S8: full 90s demo runs byte-identical 5 consecutive times.

**Realistic P(1st place):** ~50 sampai 55% with all six fixes executed (up from the ~40 sampai 48% raw estimate), the ceiling is set by ProofOfWatt's physical-hardware moat, but ProofOfAlpha is a genuine 1st-place contender: uniquely-defensible adversarial demo, dead-center on the AI×Web3 theme, riding BNB's single hottest narrative, with a mechanism keystone that is now *verified true*, not merely asserted.
