/*
  Warnings:

  - You are about to drop the column `profileBanner` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `FriendRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FriendShip` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_senderId_fkey";

-- DropForeignKey
ALTER TABLE "FriendShip" DROP CONSTRAINT "FriendShip_user1Id_fkey";

-- DropForeignKey
ALTER TABLE "FriendShip" DROP CONSTRAINT "FriendShip_user2Id_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "profileBanner",
DROP COLUMN "profilePicture";

-- DropTable
DROP TABLE "FriendRequest";

-- DropTable
DROP TABLE "FriendShip";

-- DropEnum
DROP TYPE "Status";
