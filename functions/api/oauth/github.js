import { githubAuth, json, readBody } from "../_lib.js";

export async function onRequestOptions() {
  return new Response(null, { status: 204 });
}

export async function onRequestPost({ request, env }) {
  const d = await readBody(request);
  const code = String(d.code || "");
  if (!code) return json({ ok: false, msg: "لا كود من جيت هاب" });
  return githubAuth(code, env);
}
