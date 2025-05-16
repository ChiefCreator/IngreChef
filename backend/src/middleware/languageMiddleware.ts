import type { Request, Response, NextFunction } from "express";

import { detectLang } from "../lib/lang";

const supportedLanguages = ["ru", "en"];

export function languageMiddleware(req: Request, res: Response, next: NextFunction) {
  let lang: string | undefined;

  if (typeof req.query.lang === "string" && supportedLanguages.includes(req.query.lang)) {
    lang = req.query.lang;
  }

  if (!lang && req.cookies?.lang && supportedLanguages.includes(req.cookies.lang)) {
    lang = req.cookies.lang;
  }

  if (!lang && req.headers["accept-language"]) {
    lang = detectLang(req);
  }

  if (!lang) {
    lang = "ru";
  }

  req.language = lang;

  res.cookie("lang", lang, { maxAge: 30 * 24 * 60 * 60 * 1000 });

  next();
}