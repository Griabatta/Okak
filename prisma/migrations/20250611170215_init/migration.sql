/*
  Warnings:

  - Added the required column `dayOfWeek` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ReferralToken" DROP CONSTRAINT "ReferralToken_createdById_fkey";

-- AlterTable
ALTER TABLE "ReferralToken" ALTER COLUMN "createdById" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "dayOfWeek" INTEGER NOT NULL,
ADD COLUMN     "isCombined" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "ReferralToken" ADD CONSTRAINT "ReferralToken_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
