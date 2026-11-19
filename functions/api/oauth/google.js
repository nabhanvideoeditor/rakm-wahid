import { googleAuth, json, readBody } from "../../_lib.js";

export async function onRequestOptions() {
  return new Response(null, { status: 204 });
}

export async function onRequestPost({ request, env }) {
  const d = await readBody(request);
  const credential = String(d.credential || d.token || "");
  if (!credential) return json({ ok: false, msg: "لا بيانات من جوجل" });
  return googleAuth(credential, env);
}
