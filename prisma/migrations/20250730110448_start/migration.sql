-- CreateTable
CREATE TABLE "public"."Admin" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Debtor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "sellerId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Debtor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Seller" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Debts" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "period" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "note" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "debtorId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Debts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Sms" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "sent" BOOLEAN NOT NULL,
    "exampleId" INTEGER,
    "debtorId" INTEGER,

    CONSTRAINT "Sms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Example" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Example_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payments" (
    "id" SERIAL NOT NULL,
    "amount" BIGINT NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "debtorId" INTEGER,
    "debtsId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Image" (
    "id" SERIAL NOT NULL,
    "img" TEXT NOT NULL,
    "debtsId" INTEGER,
    "debtorId" INTEGER,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Phone" (
    "id" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "debtorId" INTEGER,

    CONSTRAINT "Phone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "public"."Admin"("email");

-- AddForeignKey
ALTER TABLE "public"."Debtor" ADD CONSTRAINT "Debtor_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "public"."Seller"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Debts" ADD CONSTRAINT "Debts_debtorId_fkey" FOREIGN KEY ("debtorId") REFERENCES "public"."Debtor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Sms" ADD CONSTRAINT "Sms_exampleId_fkey" FOREIGN KEY ("exampleId") REFERENCES "public"."Example"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Sms" ADD CONSTRAINT "Sms_debtorId_fkey" FOREIGN KEY ("debtorId") REFERENCES "public"."Debtor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payments" ADD CONSTRAINT "Payments_debtorId_fkey" FOREIGN KEY ("debtorId") REFERENCES "public"."Debtor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payments" ADD CONSTRAINT "Payments_debtsId_fkey" FOREIGN KEY ("debtsId") REFERENCES "public"."Debts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_debtsId_fkey" FOREIGN KEY ("debtsId") REFERENCES "public"."Debts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_debtorId_fkey" FOREIGN KEY ("debtorId") REFERENCES "public"."Debtor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Phone" ADD CONSTRAINT "Phone_debtorId_fkey" FOREIGN KEY ("debtorId") REFERENCES "public"."Debtor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
