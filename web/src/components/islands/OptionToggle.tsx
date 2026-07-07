import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { options } from "../../content/options";
import { sound } from "../../lib/sound";
import "./OptionToggle.css";

export default function OptionToggle() {
  const [opt, setOpt] = useState<"5" | "6">("5");
  const reduce = useReducedMotion();
  const anim = reduce
    ? { initial: false as const, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -12 },
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
      };
  const pick = (v: "5" | "6") => {
    if (v !== opt) {
      setOpt(v);
      sound.click();
    }
  };

  return (
    <div>
      <div className="opt-switch" role="group" aria-label="Pilih opsi">
        {(["5", "6"] as const).map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={opt === v}
            className={`${opt === v ? "on" : ""} ${v === "6" ? "six" : ""}`}
            onClick={() => pick(v)}
          >
            <span className="lbl">{v === "5" ? options.five.tab : options.six.tab}</span>
            {opt === v && (
              <motion.span
                layoutId="thumb"
                className={`thumb ${v === "6" ? "six" : ""}`}
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }}
                style={{ left: 0, right: 0 }}
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {opt === "5" ? (
          <motion.div key="p5" className="opt-panel" {...anim}>
            <div className="opt-hero">
              <div>
                <span className="opt-kicker">{options.five.kicker}</span>
                <h3 className="opt-title">{options.five.title}</h3>
                <p className="opt-lead">{options.five.lead}</p>
                <div className="opt-tags">
                  {options.five.tags.map((t, i) => (
                    <span key={t} className={`tag ${i === 0 ? "tag-watt" : i === 2 ? "tag-flow" : ""}`}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="opt-card">
                <span className="card-kicker">Attestation on-chain</span>
                <p className="card-note">{options.five.attestationNote}</p>
                <pre className="opt-att">{options.five.attestation.join("\n")}</pre>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="p6" className="opt-panel" {...anim}>
            <div className="opt-hero">
              <div>
                <span className="opt-kicker flow">{options.six.kicker}</span>
                <h3 className="opt-title">{options.six.title}</h3>
                <p className="opt-lead">{options.six.lead}</p>
                <div className="opt-tags">
                  {options.six.tags.map((t, i) => (
                    <span key={t} className={`tag ${i === 0 ? "tag-flow" : i === 2 ? "tag-heat" : ""}`}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="opt-card">
                <span className="card-kicker">{options.six.whyDemoTitle}</span>
                <ul className="opt-why">
                  {options.six.whyDemo.map((w) => (
                    <li key={w}>
                      <b>›</b>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="opt-card" style={{ marginTop: "0.75rem" }}>
              <span className="card-kicker">Dua aliran nilai</span>
              <div className="flow2" style={{ marginTop: "0.75rem" }}>
                <div className="side">
                  <h4 style={{ color: "var(--color-watt)" }}>{options.six.valueStreams.a.title}</h4>
                  <p>
                    {options.six.valueStreams.a.body}{" "}
                    <b>{options.six.valueStreams.a.emphasis}</b>
                  </p>
                </div>
                <div className="mid">
                  <span className="plus">＋</span>
                  {options.six.valueStreams.mid}
                </div>
                <div className="side">
                  <h4 style={{ color: "var(--color-flow)" }}>{options.six.valueStreams.b.title}</h4>
                  <p>
                    {options.six.valueStreams.b.body}{" "}
                    <b>{options.six.valueStreams.b.emphasis}</b>
                  </p>
                </div>
              </div>
              <p className="prod-note">{options.six.prodNote}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
