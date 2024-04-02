import { Request, Response } from 'express';
import logger from '../logger/logger';
import { updateCart } from '../services/cartService';
import { CartContent, ErrorInfo } from '../types/types';

/**
 * Adds a product to the user's cart.
 * @param req The request object containing the user id and product id.
 * @param res The response object for sending cart content or error message.
 * @returns A response containing the updated cart content if successful, otherwise an error message.
 */
export async function addToCart(req: Request, res: Response): Promise<Response<CartContent | ErrorInfo>> {
  try {
    logger.info(`Handling addToCart request for user id: ${req.user.id}`);

    const userId = req.user.id;
    if (!userId) {
      logger.error('Bad Request: User Id is missing.');
      return res.status(400).json({ error: 'Bad Request', message: 'User Id is missing.' });
    }

    const responseCart = await updateCart(userId, req.body.productId);
    return res.send(responseCart);
  } catch (error) {
    logger.error('Error processing request:', error);
    return res.status(500).send({ error: 'Internal Server Error', message: 'An unexpected error occurred.' });
  }
}
