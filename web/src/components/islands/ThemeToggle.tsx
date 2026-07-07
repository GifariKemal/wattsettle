import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SunIcon, MoonStarsIcon } from "@phosphor-icons/react/dist/ssr";
import { getTheme, toggleTheme, type Theme } from "../../lib/theme";

export default function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>("dark");
  const reduce = useReducedMotion();

  useEffect(() => {
    setThemeState(getTheme());
    // tema bisa berubah lewat inline head-script saat navigasi → resync ikon
    const sync = () => setThemeState(getTheme());
    document.addEventListener("astro:after-swap", sync);
    return () => document.removeEventListener("astro:after-swap", sync);
  }, []);

  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={() => setThemeState(toggleTheme())}
      aria-label={dark ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
      title={dark ? "Mode terang" : "Mode gelap"}
      className="ctl-btn"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={reduce ? false : { y: 8, opacity: 0, rotate: -30 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={reduce ? { opacity: 0 } : { y: -8, opacity: 0, rotate: 30 }}
          transition={{ duration: reduce ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "flex" }}
        >
          {dark ? <MoonStarsIcon size={18} weight="duotone" /> : <SunIcon size={18} weight="duotone" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
