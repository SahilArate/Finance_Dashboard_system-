import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { allowRoles } from '../middleware/role.middleware';
import { create, getAll, getOne, update, remove } from '../controllers/record.controller';

const router = Router();

// POST /api/records - Admin and Editor can create
router.post('/', protect, allowRoles('ADMIN', 'EDITOR'), create);

// GET /api/records - All roles can view
router.get('/', protect, allowRoles('ADMIN', 'EDITOR', 'ANALYST', 'VIEWER'), getAll);

// GET /api/records/:id - All roles can view
router.get('/:id', protect, allowRoles('ADMIN', 'EDITOR', 'ANALYST', 'VIEWER'), getOne);

// PUT /api/records/:id - Admin and Editor can update
router.put('/:id', protect, allowRoles('ADMIN', 'EDITOR'), update);

// DELETE /api/records/:id - Only Admin can delete
router.delete('/:id', protect, allowRoles('ADMIN'), remove);

export default router;