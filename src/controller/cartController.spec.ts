import { Request, Response } from 'express';
import { updateCart } from '../services/cartService';
import { addToCart } from './cartController';

jest.mock('../services/cartService', () => ({
  updateCart: jest.fn(),
}));

describe('addToCart', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      user: { id: 1 },
      body: { productId: 'Test Product' },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  it('should return 400 if user id is missing', async () => {
    req.user = { id: undefined };

    await addToCart(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Bad Request', message: 'User Id is missing.' });
  });

  it('should call updateCart service and return response', async () => {
    const cartContent = {
      /* mocked cart content */
    };
    (updateCart as jest.Mock).mockResolvedValueOnce(cartContent);

    await addToCart(req as Request, res as Response);

    expect(updateCart).toHaveBeenCalledWith(1, 'Test Product');
    expect(res.send).toHaveBeenCalledWith(cartContent);
  });

  it('should return 500 if an unexpected error occurs', async () => {
    (updateCart as jest.Mock).mockRejectedValueOnce('Unexpected error');

    await addToCart(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({ error: 'Internal Server Error', message: 'An unexpected error occurred.' });
  });
});
