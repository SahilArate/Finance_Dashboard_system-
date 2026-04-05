import prisma from '../utils/prisma';

export const createRecord = async (data: {
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  date: string;
  notes?: string;
  userId: string;
}) => {
  const record = await prisma.financialRecord.create({
    data: {
      amount: data.amount,
      type: data.type,
      category: data.category,
      date: new Date(data.date),
      notes: data.notes,
      userId: data.userId,
    },
  });
  return record;
};

export const getAllRecords = async (filters: {
  type?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const where: any = { isDeleted: false };

  if (filters.type) where.type = filters.type;
  if (filters.category) where.category = filters.category;
  if (filters.startDate || filters.endDate) {
    where.date = {};
    if (filters.startDate) where.date.gte = new Date(filters.startDate);
    if (filters.endDate) where.date.lte = new Date(filters.endDate);
  }

  const records = await prisma.financialRecord.findMany({
    where,
    orderBy: { date: 'desc' },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return records;
};

export const getRecordById = async (id: string) => {
  const record = await prisma.financialRecord.findFirst({
    where: { id, isDeleted: false },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!record) {
    throw new Error('Record not found');
  }

  return record;
};

export const updateRecord = async (id: string, data: {
  amount?: number;
  type?: 'INCOME' | 'EXPENSE';
  category?: string;
  date?: string;
  notes?: string;
}) => {
  const record = await prisma.financialRecord.findFirst({
    where: { id, isDeleted: false },
  });

  if (!record) {
    throw new Error('Record not found');
  }

  const updated = await prisma.financialRecord.update({
    where: { id },
    data: {
      ...data,
      date: data.date ? new Date(data.date) : undefined,
    },
  });

  return updated;
};

export const deleteRecord = async (id: string) => {
  const record = await prisma.financialRecord.findFirst({
    where: { id, isDeleted: false },
  });

  if (!record) {
    throw new Error('Record not found');
  }

  // Soft delete
  await prisma.financialRecord.update({
    where: { id },
    data: { isDeleted: true },
  });

  return { message: 'Record deleted successfully' };
};