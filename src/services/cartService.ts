import logger from '../logger/logger';
import { CartContent, Product, UsersCart } from '../types/types';
import { fetchProducts, productExists } from './productsService';

const usersCart: UsersCart[] = [];
let products: Product[] = [];

/**
 * Updates the user's cart with the specified product.
 * If the user's cart doesn't exist, it creates a new one.
 * @param userId The ID of the user whose cart is being updated.
 * @param productId The ID of the product to add to the cart.
 * @returns The updated cart content.
 */
async function updateCart(userId: number, productId: number): Promise<CartContent> {
  try {
    let cartByUserId = usersCart.find((c: UsersCart) => c.userId === userId);
    if (!cartByUserId) {
      cartByUserId = {
        userId: userId,
        content: {
          grandTotal: 0,
          productList: [],
        },
      };
      usersCart.push(cartByUserId);
    }
    products = await fetchProducts();
    const productToAdd = products.find((product: Product) => product.id === productId);

    if (productToAdd !== undefined && !productExists(cartByUserId.content, productId)) {
      cartByUserId.content.productList.push(productToAdd);
      cartByUserId.content.grandTotal += productToAdd.price;
      logger.info(`Product added to cart successfully for user id: ${userId}`);
    } else {
      logger.info(`Product not added to cart successfully for user id: ${userId}`);
    }

    return cartByUserId.content;
  } catch (error) {
    logger.error('Error updating cart:', error);
    throw new Error('Error updating cart.');
  }
}

export { updateCart };
