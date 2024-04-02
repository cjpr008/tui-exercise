import { parse } from 'cookie';
import { NextFunction, Request, Response } from 'express';
import { validateToken } from '../services/authService';
import authMiddleware from './authMiddleware';

jest.mock('cookie');
jest.mock('../services/authService');

describe('authMiddleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  const mockJson = jest.fn();
  const mockStatus = jest.fn().mockReturnValue({ json: mockJson });

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      headers: { cookie: 'Authorization=mockToken123' },
    };

    res = {
      status: mockStatus,
      json: mockJson,
    };

    next = jest.fn();
  });

  it('should call next() if authorization token is valid', async () => {
    (parse as jest.Mock).mockReturnValueOnce({ Authorization: 'mockToken123' });
    (validateToken as jest.Mock).mockResolvedValueOnce({ id: 1, username: 'testuser' });

    await authMiddleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({ id: 1, username: 'testuser' });
  });

  it('should return 401 if authorization token is missing', async () => {
    req = {
      headers: { cookie: '' },
    };
    (parse as jest.Mock).mockReturnValueOnce({});

    await authMiddleware(req as Request, res as Response, next);

    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockJson).toHaveBeenCalledWith({ error: 'Unauthorized', message: 'Authorization token is required.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if authorization token is invalid', async () => {
    (parse as jest.Mock).mockReturnValueOnce({ Authorization: 'invalidToken' });
    (validateToken as jest.Mock).mockResolvedValueOnce(null);

    await authMiddleware(req as Request, res as Response, next);

    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockJson).toHaveBeenCalledWith({ error: 'Unauthorized', message: 'Invalid authorization token.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 500 if an unexpected error occurs', async () => {
    (parse as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Mocked error');
    });

    await authMiddleware(req as Request, res as Response, next);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({ error: 'Internal Server Error', message: 'An unexpected error occurred.' });
    expect(next).not.toHaveBeenCalled();
  });
});
