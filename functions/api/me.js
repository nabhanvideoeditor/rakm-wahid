import { me, json } from "../_lib.js";

export async function onRequestOptions() {
  return json({ ok: true }, 204);
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  return me(url.searchParams.get("token"), env);
}
