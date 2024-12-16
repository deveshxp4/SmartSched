/*
  Warnings:

  - You are about to drop the `AvailableTime` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RestrictedTime` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Timetable` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AvailableTime" DROP CONSTRAINT "AvailableTime_timetableId_fkey";

-- DropForeignKey
ALTER TABLE "RestrictedTime" DROP CONSTRAINT "RestrictedTime_timetableId_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_timetableId_fkey";

-- DropForeignKey
ALTER TABLE "Timetable" DROP CONSTRAINT "Timetable_userId_fkey";

-- DropTable
DROP TABLE "AvailableTime";

-- DropTable
DROP TABLE "RestrictedTime";

-- DropTable
DROP TABLE "Subject";

-- DropTable
DROP TABLE "Timetable";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100),
    "email" VARCHAR(100),
    "password" VARCHAR(200),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
