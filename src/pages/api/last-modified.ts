import type { APIRoute } from "astro";
import { execSync } from "child_process";

export const GET: APIRoute = async ({ url }) => {
  const file = url.searchParams.get("file");
  if (!file) {
    return new Response(JSON.stringify({ error: "Missing file param" }), {
      status: 400,
    });
  }
  try {
    const result = execSync(`git log -1 --format="%cI" -- "${file}"`, {
      encoding: "utf-8",
    });
    return new Response(JSON.stringify({ lastModified: result.trim() }), {
      status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ lastModified: null }), {
      status: 200,
    });
  }
};
