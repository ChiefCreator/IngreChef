import type { Request } from "express";

export function detectLang(req: Request) {
  const header = req.headers["accept-language"];

  if (!header) return "ru";

  const lang = header.split(",")[0].trim().toLowerCase();
  return ["ru", "en"].includes(lang) ? lang : "ru";
}