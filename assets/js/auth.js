/* =========================================================
   weston — الحسابات (تسجيل / دخول / خروج)
   تخزين محلي على الجهاز — الباسورد متشفر SHA-256
   ========================================================= */

const AUTH = {
  usersKey: "weston_users",
  sessionKey: "weston_session",
  anonKey: "weston-progress-v1",

  getUsers() {
    try { return JSON.parse(localStorage.getItem(this.usersKey)) || {}; } catch (e) { return {}; }
  },
  saveUsers(u) { try { localStorage.setItem(this.usersKey, JSON.stringify(u)); } catch (e) {} },

  async hash(pw) {
    try {
      const enc = new TextEncoder().encode(String(pw || ""));
      const buf = await crypto.subtle.digest("SHA-256", enc);
      return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch (e) {
      // بديل بسيط لو Web Crypto مش متاح
      let h = 0;
      const s = String(pw || "");
      for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; }
      return "fb_" + Math.abs(h).toString(36);
    }
  },

  async register({ name, email, password }) {
    const users = this.getUsers();
    const em = (email || "").trim().toLowerCase();
    if (!name || !name.trim()) return { ok: false, msg: "اكتب اسمك" };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return { ok: false, msg: "الإيميل مش صحيح" };
    if (!password || password.length < 6) return { ok: false, msg: "الباسورد 6 حروف على الأقل" };
    if (users[em]) return { ok: false, msg: "الحساب ده موجود — سجّل دخول" };
    users[em] = {
      name: name.trim(), email: em,
      hash: await this.hash(password),
      createdAt: new Date().toISOString(),
    };
    this.saveUsers(users);
    this.setSession(em);
    return { ok: true, msg: "تم إنشاء حسابك — أهلاً بيك " + name.trim() };
  },

  async login({ email, password }) {
    const users = this.getUsers();
    const em = (email || "").trim().toLowerCase();
    const u = users[em];
    if (!u) return { ok: false, msg: "مفيش حساب بالإيميل ده — اعمل حساب جديد" };
    const hash = await this.hash(password);
    if (hash !== u.hash) return { ok: false, msg: "الباسورد غلط" };
    this.setSession(em);
    return { ok: true, msg: "أهلاً بيك " + u.name };
  },

  logout() {
    try { localStorage.removeItem(this.sessionKey); } catch (e) {}
  },

  setSession(em) {
    try { localStorage.setItem(this.sessionKey, em); } catch (e) {}
  },

  current() {
    const em = (() => { try { return localStorage.getItem(this.sessionKey); } catch (e) { return null; } })();
    if (!em) return null;
    const u = this.getUsers()[em];
    return u ? { email: em, name: u.name } : null;
  },

  /* مفتاح التقدم: لكل حساب تقدمه الخاص */
  progressKey() {
    const u = this.current();
    return u ? "weston_progress_" + u.email : this.anonKey;
  },

  initials(name) {
    const parts = String(name || "و").trim().split(/\s+/);
    return (parts[0][0] || "و") + (parts[1] ? parts[1][0] : "");
  },
};
