import express, { Application } from "express";
import multer from "multer";
import { PrismaClient } from '@prisma/client'
import cors from "cors";
import path from "path";

const cookieParser = require("cookie-parser");
const morgan = require('morgan');
require("./env/env");

import { logger } from "./logger/index";
import { errorHandler } from "./src/middleware/errorHandler";
import authRouter from "./src/modules/auth/authRouter";
import userRouter from "./src/modules/user/userRouter";
import recipeRouter from "./src/modules/recipe/recipieRouter";
import cookbookRouter from "./src/modules/cookbook/cookbookRouter";
import favoriteRouter from "./src/modules/favorite/favoriteRouter";
import ingredientRouter from "./src/modules/ingredient/ingredientRouter";
import generateRecipeRouter from "./src/modules/generate-recipe/generateRecipeRouter";

export const prisma = new PrismaClient();
const app: Application = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });

app.use(cors({
  origin: process.env.CLIENT_URL, 
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(morgan("combined", {
  stream: {
    write: (message: string) => logger.info(message.trim()),
  },
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/recipes", recipeRouter);
app.use("/api/favorites", favoriteRouter);
app.use("/api/cookbooks", cookbookRouter);
app.use("/api/generate-recipe", generateRecipeRouter);

app.use("/api/ingredients", ingredientRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
