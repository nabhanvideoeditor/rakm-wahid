/* =========================================================
   weston — مؤثرات صوتية تقنية (Web Audio API)
   مولّدة برمجياً — مفيش ملفات خارجية
   ========================================================= */

const SOUND = {
  enabled: true,
  ctx: null,

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  },

  /* نغمة أساسية */
  tone(freq, dur = 0.1, type = "sine", vol = 0.05, delay = 0, glideTo = null) {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx) return;
    try {
      const t0 = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t0);
      if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
      gain.gain.setValueAtTime(0, t0);
      gain.gain.linearRampToValueAtTime(vol, t0 + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.02);
    } catch (e) { /* تجاهل */ }
  },

  /* نقرة واجهة */
  click() { this.tone(920, 0.055, "sine", 0.045); },

  /* تنقل بين الصفحات */
  nav() {
    this.tone(520, 0.07, "triangle", 0.04);
    this.tone(780, 0.09, "triangle", 0.032, 0.05);
  },

  /* إنجاز / إكمال درس — نغمة صاعدة */
  success() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this.tone(f, 0.13, "sine", 0.045, i * 0.07));
    this.tone(2093, 0.22, "sine", 0.02, 0.3);
  },

  /* إشعار */
  notify() {
    this.tone(440, 0.1, "sine", 0.045);
    this.tone(660, 0.12, "sine", 0.038, 0.08);
  },

  /* إرسال رسالة */
  send() {
    this.tone(700, 0.045, "square", 0.018);
    this.tone(1050, 0.06, "sine", 0.028, 0.04);
  },

  /* استقبال رد */
  receive() {
    this.tone(1050, 0.05, "sine", 0.025);
    this.tone(700, 0.07, "sine", 0.022, 0.05);
  },

  /* فتح لوحة */
  open() { this.tone(380, 0.08, "sine", 0.035, 0, 620); },

  /* خطأ */
  error() { this.tone(220, 0.16, "sawtooth", 0.035); this.tone(180, 0.18, "sawtooth", 0.03, 0.1); },

  toggle() {
    this.enabled = !this.enabled;
    if (this.enabled) this.notify();
    return this.enabled;
  },
};
