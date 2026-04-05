import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { allowRoles } from '../middleware/role.middleware';
import {
  getUsers,
  getUser,
  updateRole,
  toggleStatus,
  removeUser,
} from '../controllers/user.controller';

const router = Router();

// GET /api/users - Admin and Analyst can view all users
router.get('/', protect, allowRoles('ADMIN', 'ANALYST'), getUsers);

// GET /api/users/:id - Admin and Analyst can view a user
router.get('/:id', protect, allowRoles('ADMIN', 'ANALYST'), getUser);

// PATCH /api/users/:id/role - Only Admin can change roles
router.patch('/:id/role', protect, allowRoles('ADMIN'), updateRole);

// PATCH /api/users/:id/status - Only Admin can activate/deactivate
router.patch('/:id/status', protect, allowRoles('ADMIN'), toggleStatus);

// DELETE /api/users/:id - Only Admin can delete
router.delete('/:id', protect, allowRoles('ADMIN'), removeUser);

export default router;