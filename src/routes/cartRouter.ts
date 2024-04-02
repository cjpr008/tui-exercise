import express from 'express';
import { addToCart } from '../controller/cartController';
import logger from '../logger/logger';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();
router.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});
/**
 * Handles requests to add products to the user's cart.
 */
router.post('/item', authMiddleware, addToCart);

export default router;
