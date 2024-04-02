export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
};

export type User = {
  username: string;
  firstName: string;
  lastName: string;
  avatar: string;
  token: string;
};

export type TokenUser = {
  id: number | undefined;
  message?: string;
  name?: string;
};

export type CartPayload = {
  productId: number;
};

export type CartContent = {
  grandTotal: number;
  productList: Product[];
};

export type UsersCart = {
  userId: number;
  content: CartContent;
};

export type ErrorInfo = {
  error: string;
  message: string;
};
