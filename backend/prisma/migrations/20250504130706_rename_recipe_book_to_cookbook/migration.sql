/*
  Warnings:

  - You are about to drop the column `likedAt` on the `FavoriteRecipes` table. All the data in the column will be lost.
  - You are about to drop the column `recipeId` on the `FavoriteRecipes` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `FavoriteRecipes` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `cookingTime` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Recipe` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,recipe_id]` on the table `FavoriteRecipes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `recipe_id` to the `FavoriteRecipes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `FavoriteRecipes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author_id` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cooking_time` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FavoriteRecipes" DROP CONSTRAINT "FavoriteRecipes_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteRecipes" DROP CONSTRAINT "FavoriteRecipes_userId_fkey";

-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_authorId_fkey";

-- DropIndex
DROP INDEX "FavoriteRecipes_userId_recipeId_key";

-- AlterTable
ALTER TABLE "FavoriteRecipes" DROP COLUMN "likedAt",
DROP COLUMN "recipeId",
DROP COLUMN "userId",
ADD COLUMN     "liked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "recipe_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "authorId",
DROP COLUMN "cookingTime",
DROP COLUMN "createdAt",
DROP COLUMN "imageUrl",
ADD COLUMN     "author_id" TEXT NOT NULL,
ADD COLUMN     "cooking_time" INTEGER NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "image_url" TEXT;

-- CreateTable
CREATE TABLE "UserSavedRecipe" (
    "id" TEXT NOT NULL,
    "cookbook_id" TEXT,
    "user_id" TEXT NOT NULL,
    "recipe_id" TEXT NOT NULL,

    CONSTRAINT "UserSavedRecipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cookbook" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Cookbook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSavedRecipe_cookbook_id_key" ON "UserSavedRecipe"("cookbook_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserSavedRecipe_user_id_recipe_id_key" ON "UserSavedRecipe"("user_id", "recipe_id");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteRecipes_user_id_recipe_id_key" ON "FavoriteRecipes"("user_id", "recipe_id");

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSavedRecipe" ADD CONSTRAINT "UserSavedRecipe_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSavedRecipe" ADD CONSTRAINT "UserSavedRecipe_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSavedRecipe" ADD CONSTRAINT "UserSavedRecipe_cookbook_id_fkey" FOREIGN KEY ("cookbook_id") REFERENCES "Cookbook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cookbook" ADD CONSTRAINT "Cookbook_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteRecipes" ADD CONSTRAINT "FavoriteRecipes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteRecipes" ADD CONSTRAINT "FavoriteRecipes_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
