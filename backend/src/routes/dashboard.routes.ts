import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { allowRoles } from '../middleware/role.middleware';
import {
  summary,
  categoryTotals,
  monthlyTrends,
  recentActivity,
  weeklyTrends,
} from '../controllers/dashboard.controller';

const router = Router();

// GET /api/dashboard/summary - All roles can view
router.get('/summary', protect, allowRoles('ADMIN', 'EDITOR', 'ANALYST', 'VIEWER'), summary);

// GET /api/dashboard/categories - Analyst and above
router.get('/categories', protect, allowRoles('ADMIN', 'EDITOR', 'ANALYST'), categoryTotals);

// GET /api/dashboard/monthly - Analyst and above
router.get('/monthly', protect, allowRoles('ADMIN', 'EDITOR', 'ANALYST'), monthlyTrends);

// GET /api/dashboard/weekly - Analyst and above
router.get('/weekly', protect, allowRoles('ADMIN', 'EDITOR', 'ANALYST'), weeklyTrends);

// GET /api/dashboard/recent - Analyst and above
router.get('/recent', protect, allowRoles('ADMIN', 'EDITOR', 'ANALYST'), recentActivity);

export default router;