import logger from '../logger/logger';
import { TokenUser, User } from '../types/types';

/**
 * Authenticates a user with the provided username and password.
 * @param username The username of the user.
 * @param password The password of the user.
 * @returns A Promise that resolves to a User object if authentication is successful, otherwise null.
 */
async function authenticateUser(username: string, password: string): Promise<User | null> {
  try {
    const authentication = await fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (authentication.status === 400) {
      return null;
    }

    const userData = await authentication.json();
    return {
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      avatar: userData.avatar,
      token: userData.token,
    };
  } catch (error) {
    logger.error('Error during authentication:', error);
    throw new Error('Error during authentication.');
  }
}

/**
 * Validates a token received from the user logged in.
 * @param token The token to validate.
 * @returns A Promise that resolves to a TokenUser object with the user ID if the token is valid, otherwise undefined.
 */
async function validateToken(token: string): Promise<TokenUser> {
  try {
    const checkUser: TokenUser = await fetch('https://dummyjson.com/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());

    if (checkUser.message === 'Invalid/Expired Token!') {
      return { id: undefined };
    } else {
      return {
        id: checkUser.id,
      };
    }
  } catch (error) {
    logger.error('Error during token validation:', error);
    throw new Error('Error during token validation.');
  }
}

export { validateToken, authenticateUser };
