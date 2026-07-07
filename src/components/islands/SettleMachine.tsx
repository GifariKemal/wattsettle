import { Fragment, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { GaugeIcon, FileCodeIcon, CpuIcon, CoinsIcon } from "@phosphor-icons/react/dist/ssr";
import { machine, type Mode, type Source } from "../../content/machine";
import { sound } from "../../lib/sound";
import "./SettleMachine.css";

const ICONS = { meter: GaugeIcon, contract: FileCodeIcon, ai: CpuIcon, settle: CoinsIcon } as const;
type NodeState = "idle" | "active" | "scan" | "approve" | "reject";

const hex = (n: number) =>
  "0x" + Array.from({ length: n }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("");
const round = (v: number) => (Number.isInteger(v) ? v : Math.round(v * 10) / 10);

type Verdict = {
  ok: boolean;
  reason: string;
  code: string;
  anomalyBps: number;
  value: number;
  fee: number;
  tx: string;
};

function judge(src: Source, value: number, tamper: boolean): Omit<Verdict, "tx"> {
  const mid = (src.expLo + src.expHi) / 2;
  const anomalyBps = Math.min(9999, Math.round((Math.abs(value - mid) / mid) * 10000));
  const fee = round(value * 0.01);
  if (tamper)
    return { ok: false, reason: src.tamperReason, code: "cross-source", anomalyBps: 9700, value, fee };
  if (value > src.nameplate)
    return { ok: false, reason: `di luar batas fisik · melebihi nameplate ${src.nameplate} ${src.unit}`, code: "nameplate", anomalyBps: Math.max(8200, anomalyBps), value, fee };
  if (value < src.expLo)
    return { ok: false, reason: "di bawah rentang wajar · kemungkinan under-report", code: "under", anomalyBps, value, fee };
  if (value > src.expHi)
    return { ok: false, reason: "di atas rentang wajar · kemungkinan inflasi", code: "over", anomalyBps, value, fee };
  return { ok: true, reason: "pembacaan wajar dalam rentang fisik", code: "ok", anomalyBps, value, fee };
}

export default function SettleMachine() {
  const [mode, setMode] = useState<Mode>("5");
  const [srcIdx, setSrcIdx] = useState(0);
  const m = machine.modes[mode];
  const src = m.sources[srcIdx];

  const [value, setValue] = useState<number>(src.start);
  const [tamper, setTamper] = useState(false);

  const [states, setStates] = useState<NodeState[]>(["idle", "idle", "idle", "idle"]);
  const [chips, setChips] = useState<string[]>(["", "", "", ""]);
  const [conns, setConns] = useState<number[]>([0, 0, 0]);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [stats, setStats] = useState({ runs: 0, paid: 0, caught: 0 });
  const running = useRef(false);
  const reduce = useReducedMotion();
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));

  const reset = () => {
    setStates(["idle", "idle", "idle", "idle"]);
    setChips(["", "", "", ""]);
    setConns([0, 0, 0]);
    setVerdict(null);
  };

  // ganti mode / sumber → skin baru + reset mesin
  const pickMode = (v: Mode) => {
    if (v === mode || running.current) return;
    sound.click();
    setMode(v);
    setSrcIdx(0);
    setValue(machine.modes[v].sources[0].start);
    setTamper(false);
    reset();
  };
  const pickSource = (i: number) => {
    if (i === srcIdx || running.current) return;
    sound.click();
    setSrcIdx(i);
    setValue(m.sources[i].start);
    setTamper(false);
    reset();
  };

  const setNode = (i: number, st: NodeState, chip?: string) => {
    setStates((p) => p.map((x, j) => (j === i ? st : x)));
    if (chip !== undefined) setChips((p) => p.map((x, j) => (j === i ? chip : x)));
  };
  const setConn = (i: number, v: number) => setConns((c) => c.map((x, j) => (j === i ? v : x)));

  async function run() {
    if (running.current) return;
    running.current = true;
    reset();
    const runNo = stats.runs + 1;
    await sleep(90);

    setNode(0, "active", `${round(value)} ${src.unit} · EIP-712 ✓`);
    sound.step();
    await sleep(680);

    setConn(0, 1);
    await sleep(430);
    setNode(1, "active", `nonce ${1180 + runNo} · anti-replay ✓`);
    sound.step();
    await sleep(680);

    setConn(1, 1);
    await sleep(430);
    setNode(2, "scan", "memindai… bounds · z-score · cross-source");
    await sleep(1150);

    const v: Verdict = { ...judge(src, value, tamper), tx: hex(40) };
    const kind: NodeState = v.ok ? "approve" : "reject";
    setNode(2, kind, `anomali ${v.anomalyBps} bps · ${v.ok ? "lolos" : v.code}`);
    setConn(2, 1);
    await sleep(520);
    setNode(3, kind, v.ok ? `+${round(v.value)} ${m.token} · fee 1%` : `0 ${m.token} · ditolak`);
    v.ok ? sound.approve() : sound.reject();
    setVerdict(v);
    setStats((s) => ({ runs: s.runs + 1, paid: s.paid + (v.ok ? 1 : 0), caught: s.caught + (v.ok ? 0 : 1) }));
    running.current = false;
  }

  // status input live
  const pct = (val: number) => ((val - src.min) / (src.max - src.min)) * 100;
  const inBand = value >= src.expLo && value <= src.expHi;
  const status = tamper ? "curang" : inBand ? "wajar" : "anomali";

  const accentVar = m.accent === "watt" ? "var(--color-watt)" : "var(--color-flow)";
  const rootStyle = { "--accent": accentVar } as CSSProperties;
  const isReject = verdict && !verdict.ok;

  return (
    <div className="sm" style={rootStyle} data-mode={mode}>
      {/* Kontrol atas: mode + skor */}
      <div className="sm-top">
        <div className="sm-modes" role="group" aria-label="Pilih opsi">
          {(["5", "6"] as const).map((v) => (
            <button key={v} type="button" aria-pressed={mode === v} className={`sm-mode ${v === "6" ? "six" : ""}`} onClick={() => pickMode(v)}>
              <span>{machine.modes[v].tab}</span>
              {mode === v && <motion.span layoutId="sm-thumb" className={`sm-thumb ${v === "6" ? "six" : ""}`} transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }} />}
            </button>
          ))}
        </div>
        <div className="sm-score" aria-live="polite">
          <span><b>{stats.runs}</b> {machine.labels.statRuns}</span>
          <span className="ok"><b>{stats.paid}</b> {machine.labels.statPaid}</span>
          <span className="no"><b>{stats.caught}</b> {machine.labels.statCaught}</span>
        </div>
      </div>

      <div className="sm-grid">
        {/* INPUT */}
        <div className="sm-col sm-input">
          <span className="sm-lab">{machine.labels.input}</span>

          {m.sources.length > 1 && (
            <div className="sm-src">
              {m.sources.map((s, i) => (
                <button key={s.id} type="button" className={i === srcIdx ? "on" : ""} aria-pressed={i === srcIdx} onClick={() => pickSource(i)}>{s.label}</button>
              ))}
            </div>
          )}

          <div className="sm-meter">
            <div className="sm-meter-head">
              <span className="sm-dev">{m.device}</span>
              <span className={`sm-stat sm-stat-${status}`}>{status}</span>
            </div>
            <div className="sm-read">
              <b>{round(value)}</b><span className="u">{src.unit}</span>
            </div>
            <div className="sm-srchint">{src.label} · {src.sub}</div>

            <div className={`sm-slider ${tamper ? "off" : ""}`}>
              <div className="sm-band" style={{ left: `${pct(src.expLo)}%`, width: `${pct(src.expHi) - pct(src.expLo)}%` }} aria-hidden="true" />
              <div className="sm-plate" style={{ left: `${pct(src.nameplate)}%` }} aria-hidden="true" title={`nameplate ${src.nameplate}`} />
              <input
                type="range" min={src.min} max={src.max} step={src.step} value={value}
                disabled={tamper || running.current}
                aria-label={`Pembacaan ${src.unit}`}
                onChange={(e) => setValue(Number(e.target.value))}
              />
            </div>
            <div className="sm-scale"><span>0</span><span className="band-lab">wajar {src.expLo}–{src.expHi}</span><span>{src.max}</span></div>
          </div>

          <div className="sm-tamper">
            <div className="sm-seg" role="group" aria-label="Mode data">
              <button type="button" className={!tamper ? "on" : ""} aria-pressed={!tamper} onClick={() => !running.current && setTamper(false)}>{machine.labels.honest}</button>
              <button type="button" className={`red ${tamper ? "on" : ""}`} aria-pressed={tamper} onClick={() => !running.current && setTamper(true)}>{machine.labels.tamper}</button>
            </div>
            <p className="sm-thint">{tamper ? `Kirim skenario: “${src.tamperLabel}” — ${machine.hintTamper}` : machine.hintHonest}</p>
          </div>

          <button className="sm-launch" type="button" onClick={run}>
            {stats.runs === 0 ? machine.labels.launch : machine.labels.again}
            <span className="ic">→</span>
          </button>
        </div>

        {/* PROSES + OUTPUT */}
        <div className="sm-col sm-flow">
          <span className="sm-lab">{machine.labels.process}</span>
          <div className="sm-stage">
            {machine.stations.map((n, i) => {
              const I = ICONS[n.icon];
              return (
                <Fragment key={n.key}>
                  <div className={`sm-node ${states[i]}`}>
                    <div className="sm-glyph" aria-hidden="true"><I size={24} weight="duotone" /></div>
                    <h4>{n.title}</h4>
                    <div className="sm-sub">{n.sub}</div>
                    <div className="sm-chip">{chips[i]}{states[i] === "scan" && <span className="sm-scanbar" aria-hidden="true" />}</div>
                  </div>
                  {i < 3 && <div className={`sm-conn ${isReject && i === 2 ? "reject" : ""}`} style={{ "--p": conns[i] } as CSSProperties} aria-hidden="true" />}
                </Fragment>
              );
            })}
          </div>

          <span className="sm-lab out">{machine.labels.output}</span>
          <div className={`sm-out ${verdict ? (isReject ? "no" : "ok") : ""}`} role="status" aria-live="polite">
            <AnimatePresence mode="wait">
              {!verdict ? (
                <motion.p key="idle" className="sm-idle" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{machine.labels.idle}</motion.p>
              ) : (
                <motion.div key={verdict.tx} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}>
                  <div className="sm-vhead">
                    <span className={isReject ? "tag-no" : "tag-ok"}>{isReject ? "REJECT" : "APPROVE"}</span>
                    <span className="sm-vreason">{verdict.reason}</span>
                  </div>

                  {!isReject ? (
                    <>
                      <div className="sm-att">
                        <span><span className="k">approved</span>: true</span>
                        <span><span className="k">reading</span>: {round(verdict.value)} {src.unit}</span>
                        <span><span className="k">expectedRange</span>: {src.expLo}–{src.expHi} {src.unit}</span>
                        <span><span className="k">anomalyBps</span>: {verdict.anomalyBps}</span>
                        <span><span className="k">crossCheck</span>: OK</span>
                        <span><span className="k">modelHash</span>: {hex(4).slice(0, 8)}…</span>
                      </div>
                      <div className="sm-pay">
                        <div className="sm-coins" aria-hidden="true">
                          {!reduce && [0, 1, 2, 3, 4].map((i) => (
                            <motion.span key={verdict.tx + i} className="sm-coin"
                              initial={{ x: 0, y: 0, opacity: 0, scale: 0.6 }}
                              animate={{ x: 78, y: 0, opacity: [0, 1, 1, 0], scale: 1 }}
                              transition={{ duration: 0.9, delay: i * 0.1, ease: "easeInOut" }}>◎</motion.span>
                          ))}
                        </div>
                        <div className="sm-payline">
                          <b>+{round(verdict.value)} {m.token}</b> → {m.payee}<span className="fee"> · fee 1% ({verdict.fee}) → treasury</span>
                        </div>
                      </div>
                      <div className="sm-tx">tx: <span className="hash">{verdict.tx.slice(0, 22)}…</span> ✓ confirmed</div>
                    </>
                  ) : (
                    <div className="sm-reject">
                      <motion.span className="sm-stamp"
                        initial={reduce ? false : { scale: 1.6, rotate: -18, opacity: 0 }}
                        animate={{ scale: 1, rotate: -8, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 320, damping: 16 }}>DITOLAK</motion.span>
                      <div className="sm-rlines">
                        <span><span className="k">approved</span>: false · <span className="k">anomalyBps</span>: {verdict.anomalyBps}</span>
                        <span><b>0 {m.token} dibayar</b> · penolakan tercatat permanen on-chain</span>
                        <span className="dim">garbage-in ditolak — signature valid, data tak lolos plausibilitas.</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
