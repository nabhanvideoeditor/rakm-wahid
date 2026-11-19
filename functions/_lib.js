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
