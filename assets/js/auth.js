/* =========================================================
   weston — الحسابات
   وضعين:
   • سحابي (Firebase Auth) — الحساب يشتغل على كل الأجهزة
   • محلي (localStorage) — احتياطي لو مفيش إعداد سحابي
   ========================================================= */

const AUTH = {
  usersKey: "weston_users",
  sessionKey: "weston_session",
  anonKey: "weston-progress-v1",

  fb: null,
  fbReady: false,
  user: null,
  _pending: false,

  /* نطاقات إيميلات مؤقتة/وهمية — ممنوعة */
  DISPOSABLE: [
    "10minutemail.com", "10minutemail.net", "guerrillamail.com", "guerrillamail.net",
    "guerrillamail.org", "tempmail.com", "temp-mail.org", "temp-mail.io", "mailinator.com",
    "mailinator.net", "mailinator2.com", "yopmail.com", "yopmail.fr", "throwaway.email",
    "fakeinbox.com", "sharklasers.com", "grr.la", "getnada.com", "nada.email", "dispostable.com",
    "trashmail.com", "trashmail.net", "trash-mail.com", "mintemail.com", "maildrop.cc",
    "harakirimail.com", "spam4.me", "mailnesia.com", "tempinbox.com", "emailondeck.com",
    "burnermail.io", "tempr.email", "discard.email", "mailcatch.com", "mytemp.email",
    "jetable.org", "trbvm.com", "mail-temporaire.fr", "crazymailing.com", "tempmailo.com",
    "tempail.com", "tempmailaddress.com", "burner.kiwi", "mailpoof.com", "mohmal.com",
    "fakemail.net", "generator.email", "inboxes.com", "wegwerfmail.de", "wegwerfmail.net",
    "sogetthis.com", "mailde.de", "mailde.info", "temp-mail.com", "fake-mail.net",
    "mail-temporaire.com", "minutemail.com", "instantemailaddress.com", "emltmp.com",
  ],

  isConfigured() {
    try {
      return typeof FIREBASE_ENABLED !== "undefined" && FIREBASE_ENABLED && typeof FIREBASE_CONFIG !== "undefined";
    } catch (e) { return false; }
  },

  /* تجهيز الاتصال بالسحابة (أو الوضع المحلي) */
  async init() {
    if (this.isConfigured() && window.firebase) {
      try {
        if (!firebase.apps || !firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
        this.fb = firebase.auth();
        this.fbReady = true;
        // ننتظر أول حالة دخول عشان نعرف هل فيه جلسة محفوظة
        await new Promise((res) => {
          let done = false;
          let unsub = null;
          const finish = (u) => {
            if (done) return;
            done = true;
            this._setFbUser(u);
            if (unsub) { try { unsub(); } catch (e) {} }
            res();
          };
          unsub = this.fb.onAuthStateChanged((u) => finish(u));
          setTimeout(() => finish(null), 6000);
        });
        return true;
      } catch (e) {
        this.fbReady = false;
      }
    }
    // الوضع المحلي
    try {
      const em = localStorage.getItem(this.sessionKey);
      if (em) {
        const u = this.getUsers()[em];
        this.user = u ? { email: em, name: u.name } : null;
      }
    } catch (e) {}
    return false;
  },

  _setFbUser(u) {
    this.user = u ? { email: u.email, name: u.displayName || (u.email || "").split("@")[0] } : null;
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

  /* تحقق حقيقي: هل النطاق بيستقبل إيميلات؟ (DNS MX عبر Google DNS) */
  async verifyEmail(email) {
    const em = String(email || "").trim().toLowerCase();
    const domain = em.split("@")[1] || "";
    if (!domain) return { ok: false, msg: "اكتب إيميل صحيح" };
    if (this.DISPOSABLE.includes(domain)) {
      return { ok: false, msg: "الإيميلات المؤقتة مش مسموح بيها — استخدم إيميل حقيقي" };
    }
    try {
      const r = await fetch("https://dns.google/resolve?name=" + encodeURIComponent(domain) + "&type=MX");
      const d = await r.json();
      if (d && Array.isArray(d.Answer) && d.Answer.length) return { ok: true };
      return { ok: false, msg: "النطاق ده مش بيستقبل إيميلات — تحقق من الإيميل" };
    } catch (e) {
      return { ok: true };
    }
  },

  fbMsg(code) {
    const map = {
      "auth/email-already-in-use": "الإيميل مستخدم بالفعل — سجّل دخول",
      "auth/invalid-email": "الإيميل مش صحيح",
      "auth/weak-password": "الباسورد ضعيف — 6 حروف على الأقل",
      "auth/user-not-found": "مفيش حساب بالإيميل ده — اعمل حساب جديد",
      "auth/wrong-password": "الباسورد غلط",
      "auth/invalid-credential": "الإيميل أو الباسورد غلط",
      "auth/too-many-requests": "حاولت كتير — استنى شوية وجرّب تاني",
      "auth/network-request-failed": "مشكلة شبكة — تحقق من الاتصال",
      "auth/operation-not-allowed": "طريقة الدخول دي متعطلة — تواصل مع الدعم",
    };
    return map[code] || "حصل خطأ: " + code;
  },

  async register({ name, email, password }) {
    if (this._pending) return { ok: false, msg: "استنى لحظة…" };
    const em = (email || "").trim().toLowerCase();
    if (!name || !name.trim()) return { ok: false, msg: "اكتب اسمك" };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return { ok: false, msg: "الإيميل مش صحيح" };
    if (!password || password.length < 6) return { ok: false, msg: "الباسورد 6 حروف على الأقل" };
    this._pending = true;
    try {
      if (this.fbReady) {
        try {
          const cred = await this.fb.createUserWithEmailAndPassword(em, password);
          try { await cred.user.updateProfile({ displayName: name.trim() }); } catch (e) {}
          this._setFbUser(cred.user);
          return { ok: true, msg: "تم إنشاء حسابك — أهلاً بيك " + name.trim() };
        } catch (e) {
          return { ok: false, msg: this.fbMsg(e && e.code) };
        }
      }
      // الوضع المحلي
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

  async login({ email, password }) {
    if (this._pending) return { ok: false, msg: "استنى لحظة…" };
    const em = (email || "").trim().toLowerCase();
    this._pending = true;
    try {
      if (this.fbReady) {
        try {
          const cred = await this.fb.signInWithEmailAndPassword(em, password);
          this._setFbUser(cred.user);
          return { ok: true, msg: "أهلاً بيك " + (this.user ? this.user.name : "") };
        } catch (e) {
          return { ok: false, msg: this.fbMsg(e && e.code) };
        }
      }
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

  async logout() {
    if (this.fbReady) { try { await this.fb.signOut(); } catch (e) {} }
    try { localStorage.removeItem(this.sessionKey); } catch (e) {}
    this.user = null;
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
