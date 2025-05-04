import express, { Application } from "express";
import multer from "multer";
import { PrismaClient } from '@prisma/client'
import cors from "cors";
import dotenv from 'dotenv';
import path from "path";
dotenv.config();

import recipeRouter from "./src/modules/recipe/recipieRouter";
import cookbookRouter from "./src/modules/cookbook/cookbookRouter";

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

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/recipes", recipeRouter);
app.use("/api/cookbooks", cookbookRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
