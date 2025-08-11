/*
  Warnings:

  - You are about to drop the column `debtsId` on the `Image` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Image" DROP CONSTRAINT "Image_debtsId_fkey";

-- AlterTable
ALTER TABLE "public"."Image" DROP COLUMN "debtsId";

-- AlterTable
ALTER TABLE "public"."Payments" ALTER COLUMN "month" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."ImageDebts" (
    "id" SERIAL NOT NULL,
    "img" TEXT NOT NULL,
    "debtsId" INTEGER,

    CONSTRAINT "ImageDebts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ImageDebts" ADD CONSTRAINT "ImageDebts_debtsId_fkey" FOREIGN KEY ("debtsId") REFERENCES "public"."Debts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
