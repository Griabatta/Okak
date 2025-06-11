/*
  Warnings:

  - You are about to drop the column `groupId` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the `Association` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Association" DROP CONSTRAINT "Association_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_groupId_fkey";

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "groupId";

-- DropTable
DROP TABLE "Association";

-- CreateTable
CREATE TABLE "GroupSchedule" (
    "groupId" INTEGER NOT NULL,
    "scheduleId" INTEGER NOT NULL,

    CONSTRAINT "GroupSchedule_pkey" PRIMARY KEY ("groupId","scheduleId")
);

-- AddForeignKey
ALTER TABLE "GroupSchedule" ADD CONSTRAINT "GroupSchedule_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupSchedule" ADD CONSTRAINT "GroupSchedule_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
