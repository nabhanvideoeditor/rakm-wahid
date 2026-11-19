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
        let d = await this.call("/me?token=" + encodeURIComponent(this.token));
        // لو الشبكة فشلت، جرّب تاني
        if (d && d.msg === "__offline__") {
          await new Promise((res) => setTimeout(res, 700));
          d = await this.call("/me?token=" + encodeURIComponent(this.token));
        }
        if (d && d.ok) {
          this.user = { email: d.email, name: d.name };
          this._cacheUser(this.user);
          return;
        }
        // الخادم أكد إن الجلسة منتهية → امسح
        if (d && d.msg && d.msg.indexOf("جلسة") !== -1) {
          this.token = null;
          try { localStorage.removeItem(this.tokenKey); } catch (e) {}
          this.user = null;
          return;
        }
        // أي فشل تاني (شبكة/بطء): اعتبر المستخدم مسجّل عشان ميفتحش من الأول
        const cached = this._readUserCache();
        if (cached && cached.email) {
          this.user = cached;
          // حدّث من السحابة في الخلفية
          this.call("/me?token=" + encodeURIComponent(this.token)).then((x) => {
            if (x && x.ok) { this.user = { email: x.email, name: x.name }; this._cacheUser(this.user); }
          }).catch(() => {});
          return;
        }
        this.user = null;
        return;
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

  _cacheUser(u) {
    try { if (u) localStorage.setItem("weston_user_cache", JSON.stringify({ name: u.name, email: u.email })); } catch (e) {}
  },
  _readUserCache() {
    try { return JSON.parse(localStorage.getItem("weston_user_cache") || "null"); } catch (e) { return null; }
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
          this._cacheUser(this.user);
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
        let r = await this.call("/login", { method: "POST", body: { email: em, password } });
        // لو الحساب مش موجود، جرّب تاني (KV بيتأخر أحيانًا ثواني)
        if (r && !r.ok && r.msg && r.msg.indexOf("مفيش حساب") !== -1) {
          await new Promise((res) => setTimeout(res, 900));
          r = await this.call("/login", { method: "POST", body: { email: em, password } });
        }
        if (r && r.ok) {
          this.token = r.token;
          this.user = { email: r.email, name: r.name };
          try { localStorage.setItem(this.tokenKey, this.token); } catch (e) {}
          this._cacheUser(this.user);
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
      localStorage.removeItem("weston_user_cache");
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

  /* ---------- مزوّدون الهوية ---------- */
  OAUTH: {
    googleClientId: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
    githubClientId: "YOUR_GITHUB_CLIENT_ID",
  },

  /* جوجل: فتح نافذة الاختيار وأخذ credential */
  async googleLogin() {
    const cid = this.OAUTH.googleClientId || "";
    if (!cid || cid.indexOf("YOUR_") === 0) {
      return { ok: false, msg: "تسجيل جوجل غير مُعدّ — ابعتلي الـ Client ID" };
    }
    return new Promise((resolve) => {
      let done = false;
      const finish = (r) => { if (!done) { done = true; resolve(r); } };
      try {
        if (typeof google === "undefined" || !google.accounts) {
          // السكربت لسه بيحمل
          const wait = setInterval(() => {
            if (typeof google !== "undefined" && google.accounts) { clearInterval(wait); start(); }
          }, 200);
          setTimeout(() => { clearInterval(wait); finish({ ok: false, msg: "تحميل جوجل فشل — حاول تاني" }); }, 8000);
        } else start();
      } catch (e) { finish({ ok: false, msg: "جوجل غير متاحة دلوقتي" }); }

      function start() {
        try {
          google.accounts.id.initialize({
            client_id: cid,
            callback: (resp) => {
              AUTH.call("/oauth/google", { method: "POST", body: { credential: resp.credential } })
                .then((r) => finish(r && r.ok ? r : { ok: false, msg: (r && r.msg) || "فشل تسجيل جوجل" }))
                .catch(() => finish({ ok: false, msg: "مشكلة شبكة" }));
            },
            auto_select: false,
          });
          // نرسم زرار جوجل خفي و نضغطه
          const holder = document.createElement("div");
          holder.style.cssText = "position:fixed;inset:0;z-index:99999;display:grid;place-items:center;background:rgba(0,0,0,.55)";
          holder.innerHTML = '<div style="background:#fff;padding:18px;border-radius:14px;direction:ltr"></div>';
          document.body.appendChild(holder);
          const btn = holder.querySelector("div");
          google.accounts.id.renderButton(btn, { theme: "outline", size: "large", text: "continue_with", locale: "ar", width: 280 });
          const cancel = document.createElement("button");
          cancel.textContent = "إلغاء";
          cancel.style.cssText = "margin-top:12px;width:100%;padding:10px;border:0;border-radius:10px;background:#eee;cursor:pointer";
          cancel.onclick = () => { holder.remove(); finish({ ok: false, msg: "ألغيت" }); };
          holder.querySelector("div").appendChild(cancel);
          const obs = new MutationObserver(() => {
            holder.querySelectorAll("iframe").forEach(() => {});
          });
          obs.observe(holder, { childList: true, subtree: true });
          // نتأكد إن الزرار ظهر
          setTimeout(() => { if (!holder.querySelector("iframe") && holder.isConnected) { /* لسه بيحمل */ } }, 1200);
        } catch (e) { finish({ ok: false, msg: "مشكلة في نافذة جوجل" }); }
      }
    });
  },

  /* جيت هاب: نافذة إذن ثم كود */
  async githubLogin() {
    const cid = this.OAUTH.githubClientId || "";
    if (!cid || cid.indexOf("YOUR_") === 0) {
      return { ok: false, msg: "تسجيل جيت هاب غير مُعدّ — ابعتلي الـ Client ID" };
    }
    const redirect = location.origin + location.pathname + "#oauth=github";
    const url = "https://github.com/login/oauth/authorize?client_id=" + encodeURIComponent(cid) + "&scope=" + encodeURIComponent("read:user user:email") + "&redirect_uri=" + encodeURIComponent(redirect);
    const w = window.open(url, "weston-github", "width=640,height=760,menubar=no,toolbar=no");
    if (!w) return { ok: false, msg: "المتصفح منع النافذة المنبثقة — اسمح بيها" };
    return new Promise((resolve) => {
      let done = false;
      const finish = (r) => { if (!done) { done = true; resolve(r); } };
      const timer = setInterval(() => {
        if (!w || w.closed) { clearInterval(timer); finish({ ok: false, msg: "قفلت النافذة — حاول تاني" }); return; }
        try {
          if (w.location && w.location.href && w.location.href.indexOf("oauth=github") !== -1) {
            const h = w.location.hash || "";
            const code = (h.match(/code=([^&]+)/) || [])[1];
            const err = (h.match(/error=([^&]+)/) || [])[1];
            clearInterval(timer);
            try { w.close(); } catch (e) {}
            if (err) return finish({ ok: false, msg: "جيت هاب رفض: " + err });
            if (!code) return finish({ ok: false, msg: "مفيش كود من جيت هاب" });
            this.call("/oauth/github", { method: "POST", body: { code } })
              .then((r) => finish(r && r.ok ? r : { ok: false, msg: (r && r.msg) || "فشل تسجيل جيت هاب" }))
              .catch(() => finish({ ok: false, msg: "مشكلة شبكة" }));
          }
        } catch (e) { /* لسه بيحمل */ }
      }, 400);
    });
  },

  async socialLogin(provider) {
    const r = provider === "google" ? await this.googleLogin() : await this.githubLogin();
    if (r && r.ok) {
      this.token = r.token;
      this.user = { email: r.email, name: r.name };
      try { localStorage.setItem(this.tokenKey, this.token); } catch (e) {}
      this._cacheUser(this.user);
    }
    return r;
  },

  initials(name) {
    const parts = String(name || "و").trim().split(/\s+/);
    return (parts[0][0] || "و") + (parts[1] ? parts[1][0] : "");
  },
};
