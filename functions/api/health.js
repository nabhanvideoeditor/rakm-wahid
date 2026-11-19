import { json } from "../_lib.js";

export async function onRequestOptions() {
  return json({ ok: true }, 204);
}

export async function onRequest() {
  return json({ ok: true, service: "weston-auth", time: Date.now() });
}
