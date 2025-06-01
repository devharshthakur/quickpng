/*
  Warnings:

  - You are about to drop the `UploadedFile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UploadedFile";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "UploadedFileInfo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "originalName" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UPLOADED',
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UploadedFileInfo_fileName_key" ON "UploadedFileInfo"("fileName");

-- CreateIndex
CREATE UNIQUE INDEX "UploadedFileInfo_path_key" ON "UploadedFileInfo"("path");
