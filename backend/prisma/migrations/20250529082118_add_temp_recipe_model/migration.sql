-- CreateTable
CREATE TABLE "TempRecipe" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "category" "Category",
    "difficulty" "Difficulty",
    "cuisine" "Cuisine",
    "cooking_time" INTEGER NOT NULL,
    "ingredients" TEXT[],
    "steps" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author_id" TEXT NOT NULL,

    CONSTRAINT "TempRecipe_pkey" PRIMARY KEY ("id")
);
