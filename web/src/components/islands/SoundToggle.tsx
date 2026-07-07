import { useState } from "react";
import { SpeakerSimpleHighIcon, SpeakerSimpleSlashIcon } from "@phosphor-icons/react/dist/ssr";
import { sound } from "../../lib/sound";

export default function SoundToggle() {
  // init dari singleton: state suara bertahan lintas navigasi ClientRouter
  const [on, setOn] = useState(() => sound.enabled);
  return (
    <button
      type="button"
      onClick={() => setOn(sound.toggle())}
      aria-pressed={on}
      title={on ? "Matikan suara" : "Nyalakan suara"}
      aria-label="Toggle suara"
      className={`ctl-btn${on ? " on" : ""}`}
    >
      {on ? <SpeakerSimpleHighIcon size={18} weight="duotone" /> : <SpeakerSimpleSlashIcon size={18} weight="regular" />}
    </button>
  );
}
