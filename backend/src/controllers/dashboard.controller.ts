import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import {
  getDashboardSummary,
  getCategoryWiseTotals,
  getMonthlyTrends,
  getRecentActivity,
  getWeeklyTrends,
} from '../services/dashboard.service';

export const summary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await getDashboardSummary();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const categoryTotals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await getCategoryWiseTotals();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const monthlyTrends = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await getMonthlyTrends();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const recentActivity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await getRecentActivity();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const weeklyTrends = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await getWeeklyTrends();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};