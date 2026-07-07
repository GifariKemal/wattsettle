import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BarbellIcon, WarningCircleIcon, CompassIcon, ShieldWarningIcon } from "@phosphor-icons/react/dist/ssr";
import { swot, type Swot } from "../../content/swot";
import { sound } from "../../lib/sound";
import "./SwotBoard.css";

type Tab = "5" | "6" | "komp";
const QUAD = [
  { key: "s" as const, cls: "s", label: "Strengths", tag: "Internal +", Icon: BarbellIcon },
  { key: "w" as const, cls: "w", label: "Weaknesses", tag: "Internal −", Icon: WarningCircleIcon },
  { key: "o" as const, cls: "o", label: "Opportunities", tag: "Eksternal +", Icon: CompassIcon },
  { key: "t" as const, cls: "t", label: "Threats", tag: "Eksternal −", Icon: ShieldWarningIcon },
];

function Quadrants({ data }: { data: Swot }) {
  return (
    <div className="swot-grid">
      {QUAD.map((q) => (
        <div className={`swot-cell ${q.cls}`} key={q.key}>
          <div className="head">
            <span className="ic"><q.Icon size={19} weight="duotone" /></span>
            <b>{q.label}</b>
            <span className="tag">{q.tag}</span>
          </div>
          <ul>{data[q.key].map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
      ))}
    </div>
  );
}

export default function SwotBoard() {
  const [tab, setTab] = useState<Tab>("5");
  const reduce = useReducedMotion();
  const anim = reduce
    ? { initial: false as const, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
      };
  const pick = (v: Tab) => { if (v !== tab) { setTab(v); sound.click(); } };
  const tabs: { v: Tab; label: string }[] = [
    { v: "5", label: "Opsi 5" },
    { v: "6", label: "Opsi 6" },
    { v: "komp", label: "Kompetitor" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, width: "100%" }}>
      <div className="swot-switch" role="group" aria-label="Pilih tampilan SWOT">
        {tabs.map((t) => (
          <button key={t.v} type="button" aria-pressed={tab === t.v} className={tab === t.v ? "on" : ""} onClick={() => pick(t.v)}>
            <span className="lbl">{t.label}</span>
            {tab === t.v && <motion.span layoutId="swot-thumb" className="thumb" transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }} />}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === "5" && <motion.div key="5" className="swot-panel" {...anim}><Quadrants data={swot.five} /></motion.div>}
        {tab === "6" && <motion.div key="6" className="swot-panel" {...anim}><Quadrants data={swot.six} /></motion.div>}
        {tab === "komp" && (
          <motion.div key="komp" className="swot-panel" {...anim}>
            <div className="komp-wrap">
              <div className="komp-scroll">
                <table className="komp-table">
                  <thead><tr><th>Pemain</th><th>Apa yang dilakukan</th><th>Gap vs WattSettle</th></tr></thead>
                  <tbody>
                    {swot.competitors.map((c) => (
                      <tr key={c.name}><td className="nm">{c.name}</td><td>{c.does}</td><td>{c.gap}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="komp-verdict">{swot.verdict}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
