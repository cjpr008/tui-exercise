import { TokenUser } from './types';

declare global {
  namespace Express {
    interface Request {
      user: TokenUser;
    }
  }
}
