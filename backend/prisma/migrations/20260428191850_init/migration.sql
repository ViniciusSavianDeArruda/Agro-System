-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_plantationId_fkey";

-- DropForeignKey
ALTER TABLE "Harvest" DROP CONSTRAINT "Harvest_plantationId_fkey";

-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_userId_fkey";

-- DropForeignKey
ALTER TABLE "Plantation" DROP CONSTRAINT "Plantation_userId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_userId_fkey";

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plantation" ADD CONSTRAINT "Plantation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_plantationId_fkey" FOREIGN KEY ("plantationId") REFERENCES "Plantation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harvest" ADD CONSTRAINT "Harvest_plantationId_fkey" FOREIGN KEY ("plantationId") REFERENCES "Plantation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
