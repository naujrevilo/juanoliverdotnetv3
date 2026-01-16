import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ cookies, request, redirect }) => {
  const formData = await request.formData();
  const newStatus =
    (formData.get("status") as string) || "Todos los sistemas operativos";

  cookies.set("site-status", newStatus, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });

  return redirect("/");
};
