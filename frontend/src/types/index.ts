export interface User {
  id: string;
  name: string;
  email: string;
  role: 'VIEWER' | 'ANALYST' | 'EDITOR' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
}

export interface FinancialRecord {
  id: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  date: string;
  notes?: string;
  isDeleted: boolean;
  createdAt: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  totalRecords: number;
}

export interface CategoryTotals {
  [category: string]: {
    income: number;
    expense: number;
  };
}

export interface MonthlyTrends {
  [month: string]: {
    income: number;
    expense: number;
  };
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
}
