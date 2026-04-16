import express from 'express';
import {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  getMyRestaurants,
  updateRestaurant,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/restaurantController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getRestaurants);
router.get('/my/all', protect, authorize('vendor', 'admin'), getMyRestaurants);
router.get('/:id', getRestaurantById);

// Protected Vendor routes
router.post('/', protect, authorize('vendor', 'admin'), createRestaurant);
router.put('/:id', protect, authorize('vendor', 'admin'), updateRestaurant);
router.post('/:id/menu', protect, authorize('vendor', 'admin'), addMenuItem);
router.put('/:id/menu/:menuItemId', protect, authorize('vendor', 'admin'), updateMenuItem);
router.delete('/:id/menu/:menuItemId', protect, authorize('vendor', 'admin'), deleteMenuItem);

export default router;
