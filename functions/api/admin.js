import { json, readBody } from "../_lib.js";

/* مفتاح المدير — يضبط مرة واحدة من صفحة لوحة المدير */
async function isAdmin(request, env, key) {
  const stored = await env.weston.get("admin:key");
  if (!stored) return false;
  return key === stored;
}

function keyFrom(request, url, body) {
  return (
    url.searchParams.get("key") ||
    (body && body.key) ||
    request.headers.get("x-admin-key") ||
    ""
  );
}

export async function onRequestOptions() {
  return new Response(null, { status: 204 });
}

/* قائمة المستخدمين */
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const key = keyFrom(request, url, null);
  if (!(await isAdmin(request, env, key))) {
    return json({ ok: false, msg: "غير مصرح — كلمة سر المدير غلط" }, 401);
  }
  let users = [];
  try {
    const list = await env.weston.list({ prefix: "u:" });
    for (const k of list.keys) {
      const raw = await env.weston.get(k.name);
      try {
        const u = JSON.parse(raw);
        users.push({
          name: u.name,
          email: u.email,
          createdAt: u.createdAt || null,
          lessons: 0,
        });
      } catch (e) {}
    }
    // عدد الدروس لكل مستخدم
    for (const u of users) {
      try {
        const p = await env.weston.get("p:" + u.email);
        if (p) {
          const d = JSON.parse(p);
          u.lessons = Object.keys(d.done || {}).length;
        }
      } catch (e) {}
    }
  } catch (e) {
    return json({ ok: false, msg: "خطأ في قراءة البيانات" }, 500);
  }
  users.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  return json({ ok: true, count: users.length, users });
}

/* إحصائيات سريعة */
export async function onRequestPost({ request, env }) {
  const body = await readBody(request);
  const key = keyFrom(request, new URL(request.url), body);
  const action = body.action || "";

  if (action === "setkey") {
    // تعيين مفتاح جديد (يتطلب المفتاح القديم لو موجود)
    const stored = await env.weston.get("admin:key");
    if (stored && stored !== body.oldKey) {
      return json({ ok: false, msg: "المفتاح القديم غلط" }, 401);
    }
    const nk = String(body.newKey || "").trim();
    if (nk.length < 6) return json({ ok: false, msg: "المفتاح الجديد 6 حروف على الأقل" });
    await env.weston.put("admin:key", nk);
    return json({ ok: true, msg: "تم ضبط مفتاح المدير" });
  }

  if (!(await isAdmin(request, env, key))) {
    return json({ ok: false, msg: "غير مصرح — كلمة سر المدير غلط" }, 401);
  }

  if (action === "remove") {
    const email = String(body.email || "").trim().toLowerCase();
    if (!email) return json({ ok: false, msg: "مفيش إيميل" });
    await env.weston.delete("u:" + email);
    await env.weston.delete("p:" + email);
    // مسح الجلسات
    try {
      const list = await env.weston.list({ prefix: "t:" });
      for (const k of list.keys) {
        const em = await env.weston.get(k.name);
        if (em === email) await env.weston.delete(k.name);
      }
    } catch (e) {}
    return json({ ok: true, msg: "تم حذف " + email });
  }

  if (action === "stats") {
    const list = await env.weston.list({ prefix: "u:" });
    const tlist = await env.weston.list({ prefix: "t:" });
    let totalLessons = 0;
    for (const k of tlist.keys) {
      const em = await env.weston.get(k.name);
      const p = em ? await env.weston.get("p:" + em) : null;
      if (p) { try { totalLessons += Object.keys(JSON.parse(p).done || {}).length; } catch (e) {} }
    }
    return json({
      ok: true,
      users: list.keys.length,
      activeSessions: tlist.keys.length,
      totalLessons,
    });
  }

  return json({ ok: false, msg: "أمر غير معروف" }, 400);
}
