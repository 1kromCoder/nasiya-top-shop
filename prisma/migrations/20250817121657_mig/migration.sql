/*
  Warnings:

  - You are about to drop the column `exampleId` on the `Sms` table. All the data in the column will be lost.
  - You are about to drop the column `sent` on the `Sms` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Sms" DROP CONSTRAINT "Sms_exampleId_fkey";

-- AlterTable
ALTER TABLE "public"."Sms" DROP COLUMN "exampleId",
DROP COLUMN "sent";
