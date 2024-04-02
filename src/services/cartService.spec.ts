import { updateCart } from './cartService';

jest.mock('./productsService', () => ({
  fetchProducts: jest.fn(),
  productExists: jest.fn(),
}));

describe('updateCart', () => {
  let mockFetchProducts: jest.Mock;
  let mockProductExists: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockFetchProducts = require('./productsService').fetchProducts as jest.Mock;
    mockFetchProducts.mockReset();

    mockProductExists = require('./productsService').productExists as jest.Mock;
    mockProductExists.mockReset();
  });

  it('should update user cart with a product', async () => {
    const productToAdd1 = { id: 1, price: 10 };
    const userId = 1;
    const productId1 = 1;
    const productId2 = 2;
    const productToAdd2 = { id: 2, price: 20 };

    mockFetchProducts.mockResolvedValueOnce([productToAdd1]);
    mockFetchProducts.mockResolvedValueOnce([productToAdd2]);
    mockProductExists.mockReturnValueOnce(false);
    mockProductExists.mockReturnValueOnce(false);

    let updatedCart = await updateCart(userId, productId1);
    expect(mockProductExists).toHaveBeenCalledWith(updatedCart, productId1);

    updatedCart = await updateCart(userId, productId2);
    expect(mockProductExists).toHaveBeenCalledWith(updatedCart, productId2);

    expect(updatedCart).toEqual({
      grandTotal: 30,
      productList: [
        { id: 1, price: 10 },
        { id: 2, price: 20 },
      ],
    });
    expect(mockFetchProducts).toBeCalledTimes(2);
  });
});
