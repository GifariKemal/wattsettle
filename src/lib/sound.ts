// Web Audio singleton — dibagi antar island (SoundToggle mengatur, Simulator memainkan).
// Default MATI. Semua fungsi no-op sampai user mengaktifkan suara / browser mendukung audio.

type Note = [freq: number, at: number];

class SoundManager {
  private ac: AudioContext | null = null;
  enabled = false;

  toggle(): boolean {
    this.enabled = !this.enabled;
    if (this.enabled && !this.ac) {
      try {
        const Ctx = window.AudioContext || (window as any).webkitAudioContext;
        this.ac = new Ctx();
      } catch {
        this.enabled = false;
      }
    }
    // autoplay policy: context bisa lahir "suspended" → resume di dalam gesture user
    if (this.enabled && this.ac?.state === "suspended") this.ac.resume();
    if (this.enabled) this.blip([[660, 0], [880, 0.08]], 0.12, "sine", 0.05);
    return this.enabled;
  }

  private blip(notes: Note[], dur: number, type: OscillatorType, vol: number) {
    if (!this.enabled || !this.ac) return;
    const ac = this.ac;
    for (const [f, t] of notes) {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = type;
      o.frequency.value = f;
      o.connect(g);
      g.connect(ac.destination);
      const now = ac.currentTime + t;
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(vol, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      o.start(now);
      o.stop(now + dur + 0.02);
    }
  }

  approve() { this.blip([[523, 0], [659, 0.09], [784, 0.18]], 0.5, "triangle", 0.07); }
  reject() { this.blip([[180, 0], [120, 0.12]], 0.4, "sawtooth", 0.06); }
  step() { this.blip([[420, 0]], 0.09, "sine", 0.03); }
  click() { this.blip([[520, 0]], 0.06, "sine", 0.035); }
}

export const sound = new SoundManager();
