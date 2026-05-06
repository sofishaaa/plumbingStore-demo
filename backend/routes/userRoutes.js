import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
  forgotPassword,
  resetPassword,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

const router = express.Router();

router.route('/').get(protect, admin, getUsers).post(registerUser);
router.post('/logout', logoutUser);
router.post('/login', authUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router
  .route('/:id')
  .get(protect, admin, checkObjectId, getUserById)
  .delete(protect, admin, checkObjectId, deleteUser)
  .put(protect, admin, checkObjectId, updateUser);

export default router;
