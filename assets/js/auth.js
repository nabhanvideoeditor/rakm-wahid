/* =========================================================
   weston — الحسابات + التقدم في السحابة
   الخادم: Cloudflare Pages Functions (/api/*)
   احتياطي محلي لو الخادم مش متاح
   ========================================================= */

const AUTH = {
  usersKey: "weston_users",
  sessionKey: "weston_session",
  tokenKey: "weston_token",
  anonKey: "weston-progress-v1",
  API: "https://rakm-wahid.pages.dev/api",

  cloud: false,
  token: null,
  user: null,
  _pending: false,

  DISPOSABLE: [
    "10minutemail.com", "guerrillamail.com", "guerrillamail.net", "tempmail.com",
    "temp-mail.org", "mailinator.com", "yopmail.com", "throwaway.email", "fakeinbox.com",
    "sharklasers.com", "getnada.com", "dispostable.com", "trashmail.com", "maildrop.cc",
    "harakirimail.com", "mailnesia.com", "emailondeck.com", "burnermail.io", "tempr.email",
    "discard.email", "mytemp.email", "tempail.com", "mailpoof.com", "mohmal.com",
    "fakemail.net", "generator.email", "inboxes.com", "fake-mail.net", "minutemail.com",
  ],

  /* ---------- اتصال بالخادم ---------- */
  async call(path, { method = "GET", body } = {}) {
    try {
      const r = await fetch(this.API + path, {
        method,
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: body ? JSON.stringify(body) : undefined,
      });
      const d = await r.json();
      return d || { ok: false, msg: "رد غير صالح" };
    } catch (e) {
      return { ok: false, msg: "__offline__" };
    }
  },

  /* ---------- تجهيز ---------- */
  async init() {
    // هل الخادم شغال؟
    const h = await this.call("/health");
    this.cloud = !!(h && h.ok);

    this.token = (() => { try { return localStorage.getItem(this.tokenKey); } catch (e) { return null; } })();

    if (this.cloud) {
      if (this.token) {
        const d = await this.call("/me?token=" + encodeURIComponent(this.token));
        if (d && d.ok) {
          this.user = { email: d.email, name: d.name };
          return;
        }
        this.token = null;
        try { localStorage.removeItem(this.tokenKey); } catch (e) {}
      }
      this.user = null;
      return;
    }

    // احتياطي محلي
    try {
      const em = localStorage.getItem(this.sessionKey);
      if (em) {
        const u = this.getUsers()[em];
        this.user = u ? { email: em, name: u.name } : null;
      }
    } catch (e) {}
  },

  current() { return this.user; },

  getUsers() {
    try { return JSON.parse(localStorage.getItem(this.usersKey)) || {}; } catch (e) { return {}; }
  },
  saveUsers(u) { try { localStorage.setItem(this.usersKey, JSON.stringify(u)); } catch (e) {} },
  setSession(em) { try { localStorage.setItem(this.sessionKey, em); } catch (e) {} },

  async hash(pw) {
    try {
      const enc = new TextEncoder().encode(String(pw || ""));
      const buf = await crypto.subtle.digest("SHA-256", enc);
      return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch (e) {
      let h = 0;
      const s = String(pw || "");
      for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; }
      return "fb_" + Math.abs(h).toString(36);
    }
  },

  async verifyEmail(email) {
    const em = String(email || "").trim().toLowerCase();
    const domain = em.split("@")[1] || "";
    if (!domain) return { ok: false, msg: "اكتب إيميل صحيح" };
    if (this.DISPOSABLE.includes(domain)) {
      return { ok: false, msg: "الإيميلات المؤقتة مش مسموح بيها — استخدم إيميل حقيقي" };
    }
    return { ok: true };
  },

  /* ---------- تسجيل ---------- */
  async register({ name, email, password }) {
    if (this._pending) return { ok: false, msg: "استنى لحظة…" };
    const em = (email || "").trim().toLowerCase();
    if (!name || !name.trim()) return { ok: false, msg: "اكتب اسمك" };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return { ok: false, msg: "الإيميل مش صحيح" };
    if (!password || password.length < 6) return { ok: false, msg: "الباسورد 6 حروف على الأقل" };
    this._pending = true;
    try {
      if (this.cloud) {
        const r = await this.call("/register", { method: "POST", body: { name: name.trim(), email: em, password } });
        if (r && r.ok) {
          this.token = r.token;
          this.user = { email: r.email, name: r.name || name.trim() };
          try { localStorage.setItem(this.tokenKey, this.token); } catch (e) {}
          return { ok: true, msg: r.msg };
        }
        if (r && r.msg && r.msg !== "__offline__") return { ok: false, msg: r.msg };
        // لو الخادم مش متاح → محلي
      }
      // محلي
      const users = this.getUsers();
      if (users[em]) return { ok: false, msg: "الحساب ده موجود — سجّل دخول" };
      const v = await this.verifyEmail(em);
      if (!v.ok) return { ok: false, msg: v.msg };
      users[em] = { name: name.trim(), email: em, hash: await this.hash(password), createdAt: new Date().toISOString() };
      this.saveUsers(users);
      this.setSession(em);
      this.user = { email: em, name: name.trim() };
      return { ok: true, msg: "تم إنشاء حسابك — أهلاً بيك " + name.trim() };
    } finally {
      this._pending = false;
    }
  },

  /* ---------- دخول ---------- */
  async login({ email, password }) {
    if (this._pending) return { ok: false, msg: "استنى لحظة…" };
    const em = (email || "").trim().toLowerCase();
    this._pending = true;
    try {
      if (this.cloud) {
        const r = await this.call("/login", { method: "POST", body: { email: em, password } });
        if (r && r.ok) {
          this.token = r.token;
          this.user = { email: r.email, name: r.name };
          try { localStorage.setItem(this.tokenKey, this.token); } catch (e) {}
          return { ok: true, msg: r.msg };
        }
        if (r && r.msg && r.msg !== "__offline__") return { ok: false, msg: r.msg };
      }
      // محلي
      const users = this.getUsers();
      const u = users[em];
      if (!u) return { ok: false, msg: "مفيش حساب بالإيميل ده — اعمل حساب جديد" };
      if ((await this.hash(password)) !== u.hash) return { ok: false, msg: "الباسورد غلط" };
      this.setSession(em);
      this.user = { email: em, name: u.name };
      return { ok: true, msg: "أهلاً بيك " + u.name };
    } finally {
      this._pending = false;
    }
  },

  /* ---------- خروج ---------- */
  async logout() {
    if (this.cloud && this.token) {
      await this.call("/logout", { method: "POST", body: { token: this.token } });
    }
    this.token = null;
    this.user = null;
    try {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.sessionKey);
    } catch (e) {}
  },

  /* ---------- التقدم في السحابة ---------- */
  async pushProgress(state) {
    if (!this.cloud || !this.token) return;
    try {
      await this.call("/progress", { method: "POST", body: { token: this.token, progress: { done: state.done || {}, plan: state.plan || {} } } });
    } catch (e) {}
  },
  async pullProgress() {
    if (!this.cloud || !this.token) return null;
    const d = await this.call("/progress?token=" + encodeURIComponent(this.token));
    if (d && d.ok && d.progress) return { done: d.progress.done || {}, plan: d.progress.plan || {} };
    return null;
  },

  progressKey() {
    const u = this.current();
    return u ? "weston_progress_" + u.email : this.anonKey;
  },

  initials(name) {
    const parts = String(name || "و").trim().split(/\s+/);
    return (parts[0][0] || "و") + (parts[1] ? parts[1][0] : "");
  },
};
