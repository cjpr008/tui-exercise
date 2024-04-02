import express from 'express';
import { login } from '../controller/authController';
import logger from '../logger/logger';

const router = express.Router();

router.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

/**
 * Handles user login requests, authenticating users with provided credentials.
 */
router.post('/login', login);

export default router;
