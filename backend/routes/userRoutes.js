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
import {
  loginLimiter,
  registerLimiter,
  passwordResetLimiter,
} from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, admin, getUsers)
  .post(registerLimiter, registerUser);
router.post('/logout', logoutUser);
router.post('/login', loginLimiter, authUser);
router.post('/forgot-password', passwordResetLimiter, forgotPassword);
router.post('/reset-password/:token', passwordResetLimiter, resetPassword);
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
