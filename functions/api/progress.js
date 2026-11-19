import { getProgress, saveProgress, json, readBody } from "../_lib.js";

export async function onRequestOptions() {
  return new Response(null, { status: 204 });
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  return getProgress(url.searchParams.get("token"), env);
}

export async function onRequestPost({ request, env }) {
  return saveProgress(await readBody(request), env);
}
