import { Request, Response } from 'express';
import { authenticateUser } from '../services/authService';
import { login } from './authController';

jest.mock('../services/authService', () => ({
  authenticateUser: jest.fn(),
}));

describe('login', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  const mockJson = jest.fn();
  const mockStatus = jest.fn().mockReturnValue({ json: mockJson });

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: {},
    };
    res = {
      status: mockStatus,
      json: mockJson,
      cookie: jest.fn(),
    };
  });

  it('should return 400 if username or password is missing', async () => {
    req.body = {};

    await login(req as Request, res as Response);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'Insufficient Data',
      message: 'Username and password are required fields.',
    });
  });

  it('should return 401 if authentication fails', async () => {
    req.body = { username: 'testuser', password: 'wrongpass123' };
    (authenticateUser as jest.Mock).mockResolvedValueOnce(null);

    await login(req as Request, res as Response);

    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'Invalid credentials',
      message: 'The provided username or password is incorrect.',
    });
  });

  it('should return user data and set cookie if authentication succeeds', async () => {
    const user = {
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      avatar: 'test.jpg',
      token: 'mockedToken123',
    };
    req.body = { username: 'testuser', password: 'testpassword' };
    (authenticateUser as jest.Mock).mockResolvedValueOnce(user);

    await login(req as Request, res as Response);

    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      token: user.token,
    });
    expect(res.cookie).toHaveBeenCalledWith('Authorization', user.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
  });

  it('should return 500 if an unexpected error occurs', async () => {
    req.body = { username: 'testuser', password: 'testpassword' };
    (authenticateUser as jest.Mock).mockRejectedValueOnce('Unexpected error');

    await login(req as Request, res as Response);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred during login.',
    });
  });
});
