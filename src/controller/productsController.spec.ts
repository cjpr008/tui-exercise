import { Request, Response } from 'express';
import { fetchProducts } from '../services/productsService';
import { getProducts } from './productsController';

jest.mock('../services/productsService', () => ({
  fetchProducts: jest.fn(),
}));

describe('getProducts', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  const mockJson = jest.fn();
  const mockStatus = jest.fn().mockReturnValue({ json: mockJson });

  beforeEach(() => {
    jest.clearAllMocks();
    req = {};
    res = {
      status: mockStatus,
      json: mockJson,
    };
  });

  it('should return products when fetchProducts succeeds', async () => {
    const products = [
      {
        id: 1,
        title: 'Example Product 1',
        description: 'Description of Example Product 1',
        price: 10,
        thumbnail: 'https://example.com/product-images/1/thumbnail.jpg',
      },
      {
        id: 2,
        title: 'Example Product 2',
        description: 'Description of Example Product 2',
        price: 20,
        thumbnail: 'https://example.com/product-images/2/thumbnail.jpg',
      },
    ];
    (fetchProducts as jest.Mock).mockResolvedValueOnce(products);
    await getProducts(req as Request, res as Response);

    expect(mockJson).toHaveBeenCalledWith(products);
  });
  it('should return 500 when fetchProducts throws an error', async () => {
    const errorMessage = 'An unexpected error occurred while fetching products.';
    (fetchProducts as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await getProducts(req as Request, res as Response);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({ error: 'Internal Server Error', message: errorMessage });
  });
});
