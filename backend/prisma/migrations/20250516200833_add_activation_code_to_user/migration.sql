/*
  Warnings:

  - A unique constraint covering the columns `[activation_code]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activation_code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_activation_code_key" ON "User"("activation_code");
