import { Request, Response } from 'express';
import logger from '../logger/logger';
import { fetchProducts } from '../services/productsService';
import { ErrorInfo, Product } from '../types/types';

/**
 * Retrieves and sends a list of products to the client.
 * @param req The request object.
 * @param res The response object for sending product data or error message.
 * @returns A response containing the list of products if successful, otherwise an error message.
 */
export async function getProducts(req: Request, res: Response): Promise<Response<Product[] | ErrorInfo>> {
  try {
    const products = await fetchProducts();
    logger.info(`Fetching products.`);
    return res.json(products);
  } catch (error) {
    logger.error('Error fetching products:', error);
    return res
      .status(500)
      .json({ error: 'Internal Server Error', message: 'An unexpected error occurred while fetching products.' });
  }
}
