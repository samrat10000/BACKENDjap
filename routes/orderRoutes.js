import express from 'express';
import { createOrder, getMyOrders, getOrders } from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/', protect, authorize('admin'), getOrders);

export default router;
