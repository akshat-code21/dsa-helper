/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `conversation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "conversation_userId_key" ON "conversation"("userId");
