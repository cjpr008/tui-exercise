import { parse } from 'cookie';
import { NextFunction, Request, Response } from 'express';
import logger from '../logger/logger';
import { validateToken } from '../services/authService';

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const cookies = parse(req.headers.cookie || '');
    const authorization = cookies.Authorization;
    if (!authorization) {
      logger.warn('Authorization token is missing.');
      return res.status(401).json({ error: 'Unauthorized', message: 'Authorization token is required.' });
    }

    const user = await validateToken(authorization);
    if (!user) {
      logger.warn('Invalid authorization token.');
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid authorization token.' });
    }

    req.user = user;

    next();
  } catch (error) {
    logger.error('Error in authentication middleware:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'An unexpected error occurred.' });
  }
}

export default authMiddleware;
