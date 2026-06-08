/*
  Warnings:

  - You are about to drop the `Auction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bid` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItemSubmission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaymentMethod` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Bid] DROP CONSTRAINT [Bid_auctionId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Bid] DROP CONSTRAINT [Bid_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ItemSubmission] DROP CONSTRAINT [ItemSubmission_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Notification] DROP CONSTRAINT [Notification_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[PaymentMethod] DROP CONSTRAINT [PaymentMethod_userId_fkey];

-- AlterTable
ALTER TABLE [dbo].[credenciales_web] ALTER COLUMN [passwordHash] VARCHAR(255) NULL;

-- DropTable
DROP TABLE [dbo].[Auction];

-- DropTable
DROP TABLE [dbo].[Bid];

-- DropTable
DROP TABLE [dbo].[ItemSubmission];

-- DropTable
DROP TABLE [dbo].[Notification];

-- DropTable
DROP TABLE [dbo].[PaymentMethod];

-- DropTable
DROP TABLE [dbo].[User];

-- CreateTable
CREATE TABLE [dbo].[documentos] (
    [identificador] INT NOT NULL,
    [frente] VARBINARY(max) NOT NULL,
    [dorso] VARBINARY(max) NOT NULL,
    CONSTRAINT [documentos_pkey] PRIMARY KEY CLUSTERED ([identificador])
);

-- AddForeignKey
ALTER TABLE [dbo].[documentos] ADD CONSTRAINT [documentos_identificador_fkey] FOREIGN KEY ([identificador]) REFERENCES [dbo].[personas]([identificador]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
