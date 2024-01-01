-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `charge` INTEGER NULL DEFAULT 0,
    `payFirst` INTEGER NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Room` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roomName` VARCHAR(191) NOT NULL,
    `inviteRoom` VARCHAR(191) NOT NULL,
    `limit` INTEGER NULL DEFAULT 1,

    UNIQUE INDEX `Room_inviteRoom_key`(`inviteRoom`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserOnRoom` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idUser` INTEGER NOT NULL,
    `idRoom` INTEGER NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Person` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idRoom` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `charge` INTEGER NULL DEFAULT 0,
    `payFirst` INTEGER NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Expenditure` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idUser` INTEGER NOT NULL,
    `idRoom` INTEGER NOT NULL,
    `item` VARCHAR(191) NOT NULL,
    `qty` INTEGER NULL DEFAULT 1,
    `price` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `totalPrice` INTEGER NOT NULL,
    `createAt` DATETIME(3) NULL,
    `updateAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Total` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `balance` INTEGER NOT NULL,
    `idRoom` INTEGER NOT NULL,

    UNIQUE INDEX `Total_idRoom_key`(`idRoom`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CategoryName` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserOnRoom` ADD CONSTRAINT `UserOnRoom_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserOnRoom` ADD CONSTRAINT `UserOnRoom_idRoom_fkey` FOREIGN KEY (`idRoom`) REFERENCES `Room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Person` ADD CONSTRAINT `Person_idRoom_fkey` FOREIGN KEY (`idRoom`) REFERENCES `Room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expenditure` ADD CONSTRAINT `Expenditure_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expenditure` ADD CONSTRAINT `Expenditure_idRoom_fkey` FOREIGN KEY (`idRoom`) REFERENCES `Room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Total` ADD CONSTRAINT `Total_idRoom_fkey` FOREIGN KEY (`idRoom`) REFERENCES `Room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
