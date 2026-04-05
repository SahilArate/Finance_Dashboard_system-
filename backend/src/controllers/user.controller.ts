import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
} from '../services/user.service';

export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ users });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await getUserById(req.params.id as string);
    res.status(200).json({ user });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const updateRole = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { role } = req.body;
    if (!role) {
      res.status(400).json({ message: 'Role is required' });
      return;
    }
    const user = await updateUserRole(req.params.id as string, role);
    res.status(200).json({ message: 'Role updated successfully', user });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const toggleStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await toggleUserStatus(req.params.id as string);
    res.status(200).json({ 
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`, 
      user 
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const removeUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await deleteUser(req.params.id as string);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};