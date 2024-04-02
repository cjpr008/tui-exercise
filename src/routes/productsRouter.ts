import express from 'express';
import { getProducts } from '../controller/productsController';
import logger from '../logger/logger';

const router = express.Router();
router.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});
/**
 * Retrieves and sends a list of products to the client.
 */
router.get('/list', getProducts);

export default router;
