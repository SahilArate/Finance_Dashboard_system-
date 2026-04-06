import bcrypt from 'bcryptjs';
import prisma from './utils/prisma';

async function main() {
  // Create Admin
  const existingAdmin = await prisma.user.findUnique({ where: { email: 'admin@finance.com' } });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: { name: 'Super Admin', email: 'admin@finance.com', password: hashedPassword, role: 'ADMIN' },
    });
    console.log('Admin created!');
  }

  // Create Sahil
  const existingSahil = await prisma.user.findUnique({ where: { email: 'sahil@example.com' } });
  if (!existingSahil) {
    const hashedPassword = await bcrypt.hash('1234', 10);
    await prisma.user.create({
      data: { name: 'Sahil Arate', email: 'sahil@example.com', password: hashedPassword, role: 'ANALYST' },
    });
    console.log('Sahil created!');
  }

  // Create Rohit
  const existingRohit = await prisma.user.findUnique({ where: { email: 'rohit@example.com' } });
  if (!existingRohit) {
    const hashedPassword = await bcrypt.hash('1234', 10);
    await prisma.user.create({
      data: { name: 'Rohit Sharma', email: 'rohit@example.com', password: hashedPassword, role: 'EDITOR' },
    });
    console.log('Rohit created!');
  }

  // Get all users for linking records
  const sahil = await prisma.user.findUnique({ where: { email: 'sahil@example.com' } });
  const rohit = await prisma.user.findUnique({ where: { email: 'rohit@example.com' } });

  // Sample Financial Records
  const records = [
    { amount: 85000, type: 'INCOME' as const, category: 'Salary', date: new Date('2024-01-01'), notes: 'Monthly salary', userId: sahil!.id },
    { amount: 12000, type: 'EXPENSE' as const, category: 'Rent', date: new Date('2024-01-05'), notes: 'Office rent', userId: sahil!.id },
    { amount: 5000, type: 'EXPENSE' as const, category: 'Food', date: new Date('2024-01-10'), notes: 'Team lunch', userId: rohit!.id },
    { amount: 25000, type: 'INCOME' as const, category: 'Freelance', date: new Date('2024-01-15'), notes: 'Freelance project', userId: rohit!.id },
    { amount: 85000, type: 'INCOME' as const, category: 'Salary', date: new Date('2024-02-01'), notes: 'Monthly salary', userId: sahil!.id },
    { amount: 12000, type: 'EXPENSE' as const, category: 'Rent', date: new Date('2024-02-05'), notes: 'Office rent', userId: sahil!.id },
    { amount: 8000, type: 'EXPENSE' as const, category: 'Travel', date: new Date('2024-02-12'), notes: 'Business trip', userId: rohit!.id },
    { amount: 15000, type: 'INCOME' as const, category: 'Consulting', date: new Date('2024-02-20'), notes: 'Consulting fees', userId: rohit!.id },
    { amount: 85000, type: 'INCOME' as const, category: 'Salary', date: new Date('2024-03-01'), notes: 'Monthly salary', userId: sahil!.id },
    { amount: 12000, type: 'EXPENSE' as const, category: 'Rent', date: new Date('2024-03-05'), notes: 'Office rent', userId: sahil!.id },
    { amount: 3500, type: 'EXPENSE' as const, category: 'Utilities', date: new Date('2024-03-08'), notes: 'Electricity bill', userId: rohit!.id },
    { amount: 20000, type: 'INCOME' as const, category: 'Freelance', date: new Date('2024-03-18'), notes: 'Freelance project', userId: rohit!.id },
    { amount: 85000, type: 'INCOME' as const, category: 'Salary', date: new Date('2024-04-01'), notes: 'Monthly salary', userId: sahil!.id },
    { amount: 12000, type: 'EXPENSE' as const, category: 'Rent', date: new Date('2024-04-05'), notes: 'Office rent', userId: sahil!.id },
    { amount: 6000, type: 'EXPENSE' as const, category: 'Food', date: new Date('2024-04-14'), notes: 'Team dinner', userId: rohit!.id },
    { amount: 30000, type: 'INCOME' as const, category: 'Consulting', date: new Date('2024-04-22'), notes: 'Consulting fees', userId: rohit!.id },
    { amount: 85000, type: 'INCOME' as const, category: 'Salary', date: new Date('2024-05-01'), notes: 'Monthly salary', userId: sahil!.id },
    { amount: 12000, type: 'EXPENSE' as const, category: 'Rent', date: new Date('2024-05-05'), notes: 'Office rent', userId: sahil!.id },
    { amount: 4500, type: 'EXPENSE' as const, category: 'Utilities', date: new Date('2024-05-10'), notes: 'Internet bill', userId: rohit!.id },
    { amount: 18000, type: 'INCOME' as const, category: 'Freelance', date: new Date('2024-05-25'), notes: 'Freelance project', userId: rohit!.id },
  ];

  // Only seed if no records exist
  const existingRecords = await prisma.financialRecord.count();
  if (existingRecords === 0) {
    await prisma.financialRecord.createMany({ data: records });
    console.log('Sample records created!');
  } else {
    console.log('Records already exist, skipping...');
  }

  console.log('Seed completed!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());