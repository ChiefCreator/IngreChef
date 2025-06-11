import path from "path";
require("./../../env/env");

export const UPLOAD_DIR = process.env.NODE_ENV === "development" ?  "uploads" : "dist/uploads";
export const UPLOAD_DIR_PATH = path.join(process.cwd(), UPLOAD_DIR);
