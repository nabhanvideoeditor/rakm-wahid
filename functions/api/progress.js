import { getProgress, saveProgress, json } from "../_lib.js";

export async function onRequestOptions() {
  return json({ ok: true }, 204);
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  return getProgress(url.searchParams.get("token"), env);
}

export async function onRequestPost({ request, env }) {
  try {
    return saveProgress(await request.json(), env);
  } catch (e) {
    return json({ ok: false, msg: "طلب غير صالح" }, 400);
  }
}
