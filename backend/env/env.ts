const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const ENV = process.env.NODE_ENV || "development";
const basePath = path.resolve(process.cwd(), 'env');

const defaultEnvFile = path.join(basePath, ".env");
if (fs.existsSync(defaultEnvFile)) {
  dotenv.config({ path: defaultEnvFile });
}

const envFile = path.join(basePath, `.env.${ENV}`);
if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile, override: true });
}
