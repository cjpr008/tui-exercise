import { authenticateUser, validateToken } from './authService';

const mockFetch = jest.fn();

beforeAll(() => {
  global.fetch = mockFetch;
});

describe('authenticateUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should authenticate user and return user data if successful', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({
        username: 'testuser',
        firstName: 'Carlos',
        lastName: 'Rocha',
        avatar: 'https://dummyjson.com/avatar.jpg',
        token: 'mockedToken123',
      }),
    });

    const user = await authenticateUser('testuser', 'password');

    expect(user).toEqual({
      username: 'testuser',
      firstName: 'Carlos',
      lastName: 'Rocha',
      avatar: 'https://dummyjson.com/avatar.jpg',
      token: 'mockedToken123',
    });
  });
  it('should return null if authentication status is 400', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 400,
    });

    const user = await authenticateUser('testuser', 'password');

    expect(user).toBeNull();
  });

  it('should throw an error if an error occurs during authentication', async () => {
    mockFetch.mockRejectedValueOnce('Dummy Error');

    await expect(authenticateUser('testuser', 'password')).rejects.toEqual(new Error('Error during authentication.'));
  });
});

describe('validateToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should validate token and return TokenUser object if token is valid', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({
        id: 1,
      }),
    });

    const tokenUser = await validateToken('mockedToken');

    expect(tokenUser).toEqual({ id: 1 });
  });
  it('should return an object with id set to undefined if message is Invalid/Expired Token', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({
        message: 'Invalid/Expired Token!',
      }),
    });

    const tokenUser = await validateToken('mockedToken123');

    expect(tokenUser).toEqual({ id: undefined });
  });
});
