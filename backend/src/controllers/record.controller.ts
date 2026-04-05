import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import {
  createRecord,
  getAllRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
} from '../services/record.service';

export const create = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { amount, type, category, date, notes } = req.body;

    if (!amount || !type || !category || !date) {
      res.status(400).json({ message: 'Amount, type, category and date are required' });
      return;
    }

    if (!['INCOME', 'EXPENSE'].includes(type)) {
      res.status(400).json({ message: 'Type must be INCOME or EXPENSE' });
      return;
    }

    const record = await createRecord({
      amount: parseFloat(amount),
      type,
      category,
      date,
      notes,
      userId: req.user!.id,
    });

    res.status(201).json({ message: 'Record created successfully', record });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAll = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, category, startDate, endDate } = req.query;

    const records = await getAllRecords({
      type: type as string,
      category: category as string,
      startDate: startDate as string,
      endDate: endDate as string,
    });

    res.status(200).json({ count: records.length, records });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getOne = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const record = await getRecordById(req.params.id as string);
    res.status(200).json({ record });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const update = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { amount, type, category, date, notes } = req.body;

    if (type && !['INCOME', 'EXPENSE'].includes(type)) {
      res.status(400).json({ message: 'Type must be INCOME or EXPENSE' });
      return;
    }

    const record = await updateRecord(req.params.id as string, {
      amount: amount ? parseFloat(amount) : undefined,
      type,
      category,
      date,
      notes,
    });

    res.status(200).json({ message: 'Record updated successfully', record });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const remove = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await deleteRecord(req.params.id as string);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
