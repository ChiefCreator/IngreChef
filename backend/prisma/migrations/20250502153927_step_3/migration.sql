/*
  Warnings:

  - The `category` column on the `Recipe` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `difficulty` column on the `Recipe` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `cuisine` column on the `Recipe` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `steps` on the `Recipe` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('SOUPS', 'MAIN_DISHES', 'SIDE_DISHES', 'SALADS', 'SNACKS', 'DESSERTS', 'BAKERY_PRODUCTS');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "Cuisine" AS ENUM ('RUSSIAN', 'BELARUSIAN');

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "category",
ADD COLUMN     "category" "Category",
DROP COLUMN "difficulty",
ADD COLUMN     "difficulty" "Difficulty",
DROP COLUMN "cuisine",
ADD COLUMN     "cuisine" "Cuisine",
DROP COLUMN "steps",
ADD COLUMN     "steps" JSONB NOT NULL;
