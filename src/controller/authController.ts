import { Request, Response } from 'express';
import logger from '../logger/logger';
import { authenticateUser } from '../services/authService';
import { ErrorInfo, User } from '../types/types';

/**
 * Handles user login requests, authenticating users with provided credentials.
 * @param req The request object containing username and password.
 * @param res The response object for sending login status and user data.
 * @returns A response containing user data if login is successful, otherwise an error message.
 */
export async function login(req: Request, res: Response): Promise<Response<User | ErrorInfo>> {
  try {
    logger.info(`Handling login request for username: ${req.body.username}`);

    if (!req.body.username || !req.body.password) {
      logger.error('Insufficient Data: Username and password are required fields.');
      return res
        .status(400)
        .json({ error: 'Insufficient Data', message: 'Username and password are required fields.' });
    }

    const user = await authenticateUser(req.body.username, req.body.password);
    if (!user) {
      logger.warn('Invalid credentials: The provided username or password is incorrect.');
      return res
        .status(401)
        .json({ error: 'Invalid credentials', message: 'The provided username or password is incorrect.' });
    }

    logger.info(`User ${user.username} authenticated successfully.`);
    res.cookie('Authorization', user.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return res.status(200).json({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      token: user.token,
    });
  } catch (error) {
    logger.error('Error during login:', error);
    return res
      .status(500)
      .json({ error: 'Internal Server Error', message: 'An unexpected error occurred during login.' });
  }
}
