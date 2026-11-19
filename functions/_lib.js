/* =========================================================
   weston — مكتبة الخادم المشتركة (Pages Functions)
   ========================================================= */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST,GET,OPTIONS",
  "Access-Control-Max-Age": "86400",
};

export const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { ...CORS, "Content-Type": "application/json; charset=utf-8" },
  });

export async function sha256(s) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(s)));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function rand(n = 32) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from(crypto.getRandomValues(new Uint8Array(n)))
    .map((b) => chars[b % chars.length])
    .join("");
}

export const DISPOSABLE = [
  "10minutemail.com", "guerrillamail.com", "guerrillamail.net", "tempmail.com",
  "temp-mail.org", "mailinator.com", "yopmail.com", "throwaway.email", "fakeinbox.com",
  "sharklasers.com", "getnada.com", "dispostable.com", "trashmail.com", "maildrop.cc",
  "harakirimail.com", "mailnesia.com", "emailondeck.com", "burnermail.io", "tempr.email",
  "discard.email", "mytemp.email", "tempail.com", "mailpoof.com", "mohmal.com",
  "fakemail.net", "generator.email", "inboxes.com", "fake-mail.net", "minutemail.com",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TTL = 60 * 60 * 24 * 365;

/* نطاقات مشبوهة (مش إيميل حقيقي) */
const SUSPECT_TLD = ["local", "test", "invalid", "example", "localhost", "lan", "internal", "home", "corp", "test", "domain"];

/* تحقق حقيقي: هل النطاق بيستقبل إيميلات؟ (DNS MX) */
export async function domainHasMx(domain) {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3500);
    const r = await fetch("https://dns.google/resolve?name=" + encodeURIComponent(domain) + "&type=MX", { signal: ctrl.signal });
    clearTimeout(timer);
    const d = await r.json();
    return !!(d && Array.isArray(d.Answer) && d.Answer.length);
  } catch (e) {
    return null; // مش متأكد — الشبكة فشلت
  }
}

export async function readBody(request) {
  try {
    const t = await request.text();
    return t ? JSON.parse(t) : {};
  } catch (e) {
    return {};
  }
}

export async function register(d, env) {
  const name = String(d.name || "").trim();
  const email = String(d.email || "").trim().toLowerCase();
  const password = String(d.password || "");
  if (!name) return json({ ok: false, msg: "اكتب اسمك" });
  if (!EMAIL_RE.test(email)) return json({ ok: false, msg: "الإيميل مش صحيح" });
  if (password.length < 6) return json({ ok: false, msg: "الباسورد 6 حروف على الأقل" });
  if (DISPOSABLE.includes(email.split("@")[1] || "")) {
    return json({ ok: false, msg: "الإيميلات المؤقتة مش مسموح بيها — استخدم إيميل حقيقي" });
  }
  const domain = email.split("@")[1] || "";
  if (SUSPECT_TLD.some((t) => domain.endsWith("." + t))) {
    return json({ ok: false, msg: "النطاق ده مش إيميل حقيقي — استخدم إيميل بيستقبل رسايل" });
  }
  const mx = await domainHasMx(domain);
  if (mx === false) {
    return json({ ok: false, msg: "النطاق ده مش بيستقبل إيميلات — تحقق من الإيميل" });
  }
  const key = "u:" + email;
  if (await env.weston.get(key)) {
    return json({ ok: false, msg: "الإيميل مستخدم بالفعل — سجّل دخول" });
  }
  const hash = await sha256(email + "::weston::" + password);
  const token = rand();
  await env.weston.put(key, JSON.stringify({ name, email, hash, token, createdAt: Date.now() }));
  await env.weston.put("t:" + token, email, { expirationTtl: TTL });
  await env.weston.put("p:" + email, JSON.stringify({ done: {}, plan: {} }));
  return json({ ok: true, msg: "تم إنشاء حسابك — أهلاً بيك " + name, token, name, email });
}

export async function login(d, env) {
  const email = String(d.email || "").trim().toLowerCase();
  const password = String(d.password || "");
  const raw = await env.weston.get("u:" + email);
  if (!raw) return json({ ok: false, msg: "مفيش حساب بالإيميل ده — اعمل حساب جديد" });
  let u;
  try { u = JSON.parse(raw); } catch (e) { return json({ ok: false, msg: "حساب غير صالح" }); }
  if (u.hash !== (await sha256(email + "::weston::" + password))) {
    return json({ ok: false, msg: "الباسورد غلط" });
  }
  const token = rand();
  u.token = token;
  await env.weston.put("u:" + email, JSON.stringify(u));
  await env.weston.put("t:" + token, email, { expirationTtl: TTL });
  if (!(await env.weston.get("p:" + email))) await env.weston.put("p:" + email, "{}");
  return json({ ok: true, msg: "أهلاً بيك " + u.name, token, name: u.name, email });
}

export async function logout(d, env) {
  const token = String(d.token || "");
  if (token) { try { await env.weston.delete("t:" + token); } catch (e) {} }
  return json({ ok: true });
}

export async function getProgress(token, env) {
  if (!token) return json({ ok: false, msg: "مفيش جلسة" });
  const email = await env.weston.get("t:" + token);
  if (!email) return json({ ok: false, msg: "جلسة منتهية — سجّل دخول تاني" });
  const raw = await env.weston.get("p:" + email);
  let progress = {};
  try { progress = JSON.parse(raw || "{}"); } catch (e) { progress = {}; }
  return json({ ok: true, email, progress });
}

export async function saveProgress(d, env) {
  const token = String(d.token || "");
  const email = await env.weston.get("t:" + token);
  if (!email) return json({ ok: false, msg: "جلسة منتهية — سجّل دخول تاني" });
  const progress = d.progress && typeof d.progress === "object" ? d.progress : {};
  const safe = JSON.stringify(progress).slice(0, 2000000);
  await env.weston.put("p:" + email, safe);
  return json({ ok: true, saved: true });
}

export async function me(token, env) {
  if (!token) return json({ ok: false });
  const email = await env.weston.get("t:" + token);
  if (!email) return json({ ok: false });
  const raw = await env.weston.get("u:" + email);
  if (!raw) return json({ ok: false });
  let u;
  try { u = JSON.parse(raw); } catch (e) { return json({ ok: false }); }
  return json({ ok: true, name: u.name, email: u.email });
}

/* ---------- دخول اجتماعي (Google / GitHub) ---------- */
export async function oauthLogin({ email, name, provider }, env) {
  const em = String(email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(em)) return json({ ok: false, msg: "الإيميل من المزوّد مش صحيح" });
  const key = "u:" + em;
  let u = null;
  try { u = JSON.parse(await env.weston.get(key) || "null"); } catch (e) { u = null; }
  if (!u) {
    u = { name: String(name || em.split("@")[0]).trim(), email: em, provider: String(provider || "oauth"), hash: null, createdAt: Date.now() };
    await env.weston.put(key, JSON.stringify(u));
    await env.weston.put("p:" + em, JSON.stringify({ done: {}, plan: {} }));
  }
  const token = rand();
  u.token = token;
  await env.weston.put(key, JSON.stringify(u));
  await env.weston.put("t:" + token, em, { expirationTtl: TTL });
  return json({ ok: true, msg: "أهلاً بيك " + u.name, token, name: u.name, email: em, fresh: !u.hash });
}

/* جوجل: نتأكد من ID token عن طريق tokeninfo */
export async function googleAuth(credential, env) {
  const clientId = (env && env.GOOGLE_CLIENT_ID) || "";
  try {
    const r = await fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(credential));
    if (!r.ok) return json({ ok: false, msg: "تعذر التأكد من حساب جوجل" });
    const d = await r.json();
    if (!d || !d.email) return json({ ok: false, msg: "حساب جوجل غير صالح" });
    if (clientId && d.aud && d.aud !== clientId) return json({ ok: false, msg: "حساب جوجل من تطبيق تاني" });
    return oauthLogin({ email: d.email, name: d.name || d.email.split("@")[0], provider: "google" }, env);
  } catch (e) {
    return json({ ok: false, msg: "مشكلة في التأكد من جوجل" });
  }
}

/* جيت هاب: استبدال الكود ب access_token ثم الإيميل */
export async function githubAuth(code, env) {
  const cid = (env && env.GITHUB_CLIENT_ID) || "";
  const sec = (env && env.GITHUB_CLIENT_SECRET) || "";
  if (!cid || !sec) return json({ ok: false, msg: "تسجيل جيت هاب غير مُعدّ على الخادم" });
  try {
    const tr = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ client_id: cid, client_secret: sec, code }),
    });
    const td = await tr.json();
    if (!td || !td.access_token) return json({ ok: false, msg: "كود جيت هاب غير صالح" });
    const ur = await fetch("https://api.github.com/user", {
      headers: { Authorization: "Bearer " + td.access_token, "User-Agent": "weston", "Accept": "application/vnd.github+json" },
    });
    const u = await ur.json();
    if (!u || !u.id) return json({ ok: false, msg: "حساب جيت هاب غير صالح" });
    let email = u.email;
    if (!email) {
      const er = await fetch("https://api.github.com/user/emails", {
        headers: { Authorization: "Bearer " + td.access_token, "User-Agent": "weston", "Accept": "application/vnd.github+json" },
      });
      const emails = await er.json();
      if (Array.isArray(emails)) {
        const primary = emails.find((e) => e.primary && e.verified) || emails.find((e) => e.verified) || emails[0];
        email = primary && primary.email;
      }
    }
    if (!email) return json({ ok: false, msg: "جيت هاب مفيهوش إيميل عام — أضف إيميل في إعدادات حسابك" });
    return oauthLogin({ email, name: u.name || u.login, provider: "github" }, env);
  } catch (e) {
    return json({ ok: false, msg: "مشكلة في تسجيل جيت هاب" });
  }
}
