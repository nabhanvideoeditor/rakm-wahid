import { logout, json, readBody } from "../_lib.js";

export async function onRequestOptions() {
  return new Response(null, { status: 204 });
}

export async function onRequestPost({ request, env }) {
  return logout(await readBody(request), env);
}
