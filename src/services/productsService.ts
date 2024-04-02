import logger from '../logger/logger';
import { CartContent, Product } from '../types/types';

/**
 * Retrieves a list of products from an source API.
 * @returns A Promise that resolves to an array of Product objects.
 */
async function fetchProducts(): Promise<Product[]> {
  try {
    const rawData = await fetch('https://dummyjson.com/products').then((res) => res.json());

    let products: Product[] = [];
    products = rawData.products
      .sort((a: { title: string }, b: { title: string }) => a.title.localeCompare(b.title))
      .map((product: any) => ({
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        thumbnail: product.thumbnail,
      }));
    return products;
  } catch (error) {
    logger.error('Error fetching products:', error);
    throw new Error('Error fetching products.');
  }
}

/**
 * Checks if a product exists in the cart content.
 * @param cartContent The cart content object.
 * @param productId The ID of the product to check.
 * @returns True if the product exists in the cart, otherwise false.
 */
function productExists(cartContent: CartContent, productId: number): boolean {
  const exists = cartContent.productList.some((product) => product.id === productId);
  if (exists) {
    logger.info(`Product with ID ${productId} exists in the cart.`);
  } else {
    logger.info(`Product with ID ${productId} does not exist in the cart.`);
  }
  return exists;
}

export { productExists, fetchProducts };
