-- CreateEnum
CREATE TYPE "BagType" AS ENUM ('PAPER_BAG', 'PLASTIC_BAG', 'CARDBOARD_BOX', 'THERMAL_BAG', 'ECO_BAG', 'MULTIPLE_PIECES');

-- CreateEnum
CREATE TYPE "PackagingColor" AS ENUM ('WHITE', 'BROWN', 'BLACK', 'RED', 'BLUE', 'GREEN', 'YELLOW', 'ORANGE', 'PURPLE', 'GREY', 'KRAFT', 'OTHER');

-- CreateEnum
CREATE TYPE "BrandingStyle" AS ENUM ('MINIMALIST', 'COLORFUL', 'PLAIN', 'PREMIUM', 'UNBRANDED');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "areas" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "restaurants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packaging_entries" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "bagType" "BagType" NOT NULL,
    "primaryColor" "PackagingColor" NOT NULL,
    "secondaryColor" "PackagingColor",
    "brandingStyle" "BrandingStyle" NOT NULL,
    "distinctiveTags" TEXT[],
    "freeNotes" TEXT,
    "photoUrl" TEXT NOT NULL,
    "submitterEmail" TEXT,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT,

    CONSTRAINT "packaging_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "areas_name_key" ON "areas"("name");

-- CreateIndex
CREATE UNIQUE INDEX "areas_slug_key" ON "areas"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "restaurants_name_key" ON "restaurants"("name");

-- CreateIndex
CREATE UNIQUE INDEX "restaurants_slug_key" ON "restaurants"("slug");

-- AddForeignKey
ALTER TABLE "packaging_entries" ADD CONSTRAINT "packaging_entries_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packaging_entries" ADD CONSTRAINT "packaging_entries_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
