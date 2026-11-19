import { register, json } from "../_lib.js";

export async function onRequestOptions() {
  return json({ ok: true }, 204);
}

export async function onRequestPost({ request, env }) {
  try {
    return register(await request.json(), env);
  } catch (e) {
    return json({ ok: false, msg: "طلب غير صالح" }, 400);
  }
}
