import { CartContent } from '../types/types';
import { fetchProducts, productExists } from './productsService';

global.fetch = jest.fn();

describe('fetchProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch products from the API and return an array of Product objects', async () => {
    const mockProducts = [
      { id: 1, title: 'Product 1', description: 'Description 1', price: 10, thumbnail: 'thumbnail1.jpg' },
      { id: 2, title: 'Product 2', description: 'Description 2', price: 20, thumbnail: 'thumbnail2.jpg' },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ products: mockProducts }),
    });
    const products = await fetchProducts();

    expect(products).toEqual(mockProducts);

    expect(fetch).toHaveBeenCalledWith('https://dummyjson.com/products');
  });
});

describe('productExists', () => {
  it('should return true if the product exists in the cart content', () => {
    const cartContent: CartContent = {
      grandTotal: 10,
      productList: [
        {
          id: 1,
          title: 'Product Title',
          description: 'Product Description',
          price: 10,
          thumbnail: 'product-thumbnail.jpg',
        },
      ],
    };
    const productId = 1;

    const exists = productExists(cartContent, productId);

    expect(exists).toBe(true);
  });

  it('should return false if the product does not exist in the cart content', () => {
    const cartContent: CartContent = {
      grandTotal: 10,
      productList: [
        {
          id: 1,
          title: 'Product Title',
          description: 'Product Description',
          price: 10,
          thumbnail: 'product-thumbnail.jpg',
        },
      ],
    };
    const productId = 2;

    const exists = productExists(cartContent, productId);

    expect(exists).toBe(false);
  });

  it('should throw an error when fetching products fails', async () => {
    await expect(fetchProducts()).rejects.toThrow('Error fetching products.');
  });
});
