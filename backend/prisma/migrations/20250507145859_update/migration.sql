/*
  Warnings:

  - A unique constraint covering the columns `[user_id,recipe_id,cookbook_id]` on the table `UserSavedRecipe` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UserSavedRecipe_user_id_recipe_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "UserSavedRecipe_user_id_recipe_id_cookbook_id_key" ON "UserSavedRecipe"("user_id", "recipe_id", "cookbook_id");
