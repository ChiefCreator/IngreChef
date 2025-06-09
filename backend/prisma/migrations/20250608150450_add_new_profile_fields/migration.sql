-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'UNSPECIFIED');

-- CreateEnum
CREATE TYPE "CookingLevel" AS ENUM ('NOVICE', 'INTERMEDIATE', 'EXPERT');

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "allergies" TEXT[],
ADD COLUMN     "cookingLevel" "CookingLevel",
ADD COLUMN     "dietaryRestrictions" TEXT[],
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "weight" DOUBLE PRECISION;
