import prisma from '../utils/prisma';

export const getDashboardSummary = async () => {
  // Get all non-deleted records
  const records = await prisma.financialRecord.findMany({
    where: { isDeleted: false },
  });

  // Total income
  const totalIncome = records
    .filter((r) => r.type === 'INCOME')
    .reduce((sum, r) => sum + r.amount, 0);

  // Total expenses
  const totalExpenses = records
    .filter((r) => r.type === 'EXPENSE')
    .reduce((sum, r) => sum + r.amount, 0);

  // Net balance
  const netBalance = totalIncome - totalExpenses;

  return {
    totalIncome,
    totalExpenses,
    netBalance,
    totalRecords: records.length,
  };
};

export const getCategoryWiseTotals = async () => {
  const records = await prisma.financialRecord.findMany({
    where: { isDeleted: false },
  });

  const categoryMap: Record<string, { income: number; expense: number }> = {};

  records.forEach((r) => {
    if (!categoryMap[r.category]) {
      categoryMap[r.category] = { income: 0, expense: 0 };
    }
    if (r.type === 'INCOME') {
      categoryMap[r.category].income += r.amount;
    } else {
      categoryMap[r.category].expense += r.amount;
    }
  });

  return categoryMap;
};

export const getMonthlyTrends = async () => {
  const records = await prisma.financialRecord.findMany({
    where: { isDeleted: false },
    orderBy: { date: 'asc' },
  });

  const monthlyMap: Record<string, { income: number; expense: number }> = {};

  records.forEach((r) => {
    const month = r.date.toISOString().slice(0, 7); // Format: 2024-01
    if (!monthlyMap[month]) {
      monthlyMap[month] = { income: 0, expense: 0 };
    }
    if (r.type === 'INCOME') {
      monthlyMap[month].income += r.amount;
    } else {
      monthlyMap[month].expense += r.amount;
    }
  });

  return monthlyMap;
};

export const getRecentActivity = async () => {
  const records = await prisma.financialRecord.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return records;
};

export const getWeeklyTrends = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const records = await prisma.financialRecord.findMany({
    where: {
      isDeleted: false,
      date: { gte: sevenDaysAgo },
    },
    orderBy: { date: 'asc' },
  });

  const weeklyMap: Record<string, { income: number; expense: number }> = {};

  records.forEach((r) => {
    const day = r.date.toISOString().slice(0, 10); // Format: 2024-01-15
    if (!weeklyMap[day]) {
      weeklyMap[day] = { income: 0, expense: 0 };
    }
    if (r.type === 'INCOME') {
      weeklyMap[day].income += r.amount;
    } else {
      weeklyMap[day].expense += r.amount;
    }
  });

  return weeklyMap;
};
