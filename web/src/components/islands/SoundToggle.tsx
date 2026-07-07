import { useState } from "react";
import { SpeakerSimpleHighIcon, SpeakerSimpleSlashIcon } from "@phosphor-icons/react/dist/ssr";
import { sound } from "../../lib/sound";

export default function SoundToggle() {
  const [on, setOn] = useState(false);
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
