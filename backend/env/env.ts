const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const shouldLoadDotenv = process.env.USE_DOTENV === "true";
const ENV = process.env.NODE_ENV || "development";

if (shouldLoadDotenv) {
  const basePath = process.cwd();
  
  const defaultEnvFile = path.join(basePath, ".env");
  if (fs.existsSync(defaultEnvFile)) {
    dotenv.config({ path: defaultEnvFile });
  }
  
  const envFile = path.join(basePath, `/env/.env.${ENV}`);
  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile, override: true });
  }
}
