/*
  Warnings:

  - You are about to drop the column `tags` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `birthDate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `displayName` on the `User` table. All the data in the column will be lost.
  - Added the required column `emotion` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Emotion" AS ENUM ('Lonely', 'Heartbroken', 'Hopeful', 'Grateful', 'Anxious', 'Confused', 'Regretful', 'Angry', 'BurnedOut', 'Loved', 'Guilty');

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "tags",
ADD COLUMN     "emotion" "Emotion" NOT NULL,
ADD COLUMN     "hasTriggerWarning" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "birthDate",
DROP COLUMN "displayName";
