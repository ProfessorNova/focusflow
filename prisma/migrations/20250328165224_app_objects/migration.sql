-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('Low', 'Mid', 'High');

-- CreateEnum
CREATE TYPE "Assignee" AS ENUM ('User', 'Team');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('Open', 'Pending', 'InReview', 'Closed');

-- CreateEnum
CREATE TYPE "Tag" AS ENUM ('Bug', 'Feature', 'Improvement', 'Task', 'Documentation', 'Enhancement', 'Hotfix', 'Optimization', 'Research', 'Chore', 'Meeting', 'Admin', 'Finance', 'Personal', 'Health', 'Event');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lastLogin" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "teamLeaderId" INTEGER NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "teaser" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "priority" "TaskPriority" NOT NULL,
    "assignee" "Assignee" NOT NULL,
    "tags" "Tag"[],
    "status" "TaskStatus" NOT NULL,
    "userId" INTEGER,
    "teamId" INTEGER,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TeamToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TeamToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TeamToUser_B_index" ON "_TeamToUser"("B");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_teamLeaderId_fkey" FOREIGN KEY ("teamLeaderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamToUser" ADD CONSTRAINT "_TeamToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamToUser" ADD CONSTRAINT "_TeamToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
