import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import { GaugeIcon, FileCodeIcon, CpuIcon, CoinsIcon } from "@phosphor-icons/react/dist/ssr";
import { simNodes, scenarios, simulator, type SimScenario } from "../../content/simulator";
import { sound } from "../../lib/sound";
import "./Simulator.css";

const NODE_ICONS = [GaugeIcon, FileCodeIcon, CpuIcon, CoinsIcon];

const REDUCE =
  typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

type NodeState = "idle" | "active" | "approve" | "reject";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, REDUCE ? 0 : ms));
const hex = (n: number) =>
  "0x" + Array.from({ length: n }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("");

export default function Simulator() {
  const [states, setStates] = useState<NodeState[]>(["idle", "idle", "idle", "idle"]);
  const [vals, setVals] = useState<string[]>(["", "", "", ""]);
  const [conns, setConns] = useState<number[]>([0, 0, 0]);
  const [status, setStatus] = useState("siap");
  const [verdict, setVerdict] = useState<{ s: SimScenario; tx: string } | null>(null);
  const running = useRef(false);

  const setNode = (i: number, st: NodeState, v?: string) => {
    setStates((p) => p.map((x, j) => (j === i ? st : x)));
    if (v !== undefined) setVals((p) => p.map((x, j) => (j === i ? v : x)));
  };
  const setConn = (i: number, p: number) => setConns((c) => c.map((x, j) => (j === i ? p : x)));

  async function run(kind: "approve" | "reject") {
    if (running.current) return;
    running.current = true;
    const s = scenarios[kind];

    // reset
    setStates(["idle", "idle", "idle", "idle"]);
    setVals(["", "", "", ""]);
    setConns([0, 0, 0]);
    setVerdict(null);
    setStatus(s.ticks[0]);
    await sleep(120);

    setNode(0, "active", s.nodeValues[0]);
    sound.step();
    await sleep(720);

    setConn(0, 1);
    await sleep(480);
    setNode(1, "active", s.nodeValues[1]);
    sound.step();
    setStatus(s.ticks[1]);
    await sleep(720);

    setConn(1, 1);
    await sleep(480);
    setNode(2, "active", "bounds · z-score · cross-source");
    setStatus(s.ticks[2]);
    await sleep(950);

    const verdictKind: NodeState = kind === "approve" ? "approve" : "reject";
    setNode(2, verdictKind, s.nodeValues[2]);
    setConn(2, 1);
    await sleep(520);
    setNode(3, verdictKind, s.nodeValues[3]);
    setStatus(s.ticks[3]);
    kind === "approve" ? sound.approve() : sound.reject();
    setVerdict({ s, tx: hex(40) });

    running.current = false;
  }

  // auto-play sekali saat mount supaya halaman tak terlihat "belum load" (reduced-motion: isi instan)
  useEffect(() => {
    const t = setTimeout(() => run("approve"), REDUCE ? 0 : 750);
    return () => clearTimeout(t);
  }, []);

  const isReject = verdict?.s.key === "reject";

  return (
    <div className="sim">
      <div className="sim-stage">
        {simNodes.map((n, i) => (
          <Fragment key={i}>
            <div className={`sim-node ${states[i]}`}>
              <div className="glyph" aria-hidden="true">
                {(() => {
                  const I = NODE_ICONS[i];
                  return <I size={26} weight="duotone" />;
                })()}
              </div>
              <h4>{n.title}</h4>
              <div className="sub">{n.sub}</div>
              <div className="val">{vals[i]}</div>
            </div>
            {i < 3 && (
              <div
                className={`sim-conn ${isReject && i === 2 ? "reject" : ""}`}
                style={{ "--p": conns[i] } as CSSProperties}
                aria-hidden="true"
              />
            )}
          </Fragment>
        ))}
      </div>

      <div className="sim-controls">
        <button className="btn btn-primary" onClick={() => run("approve")}>
          Kirim pembacaan asli <span className="ic">✓</span>
        </button>
        <button className="btn btn-reject" onClick={() => run("reject")}>
          Kirim data palsu <span className="ic">✕</span>
        </button>
        <span className="sim-chip" aria-live="polite">{status}</span>
      </div>

      <div className={`sim-verdict ${verdict ? (isReject ? "no" : "ok") : ""}`} role="status" aria-live="polite">
        {!verdict ? (
          simulator.idle
        ) : (
          <>
            <span className={isReject ? "tag-no" : "tag-ok"}>
              {isReject ? "REJECT" : "APPROVE"}
            </span>{" "}
            · {verdict.s.verdict}
            <br />
            <span className="att-line">AI attestation:</span>
            {Object.entries(verdict.s.attestation).map(([k, v]) => (
              <span className="att-line" key={k}>
                {"  "}
                <span className="k">{k}</span>: {String(v)}
              </span>
            ))}
            <br />
            Settlement: <b style={{ color: isReject ? "var(--color-heat)" : "var(--color-watt)" }}>
              {verdict.s.settlement}
            </b>
            {!isReject && (
              <>
                <br />
                tx: <span className="tx">{verdict.tx}</span> ✓ confirmed
              </>
            )}
            <br />
            <span style={{ color: "var(--color-faint)" }}>{verdict.s.note}</span>
          </>
        )}
      </div>
    </div>
  );
}
