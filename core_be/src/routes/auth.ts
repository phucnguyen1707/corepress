import { Hono } from 'hono';
import { AuthService } from '../services/auth';
import { authMiddleware } from '../middleware/auth';

const authRoutes = new Hono<{ Variables: { userId: string } }>();

// Register
authRoutes.post('/register', async (c) => {
  try {
    const body = await c.req.json();
    const { user, accessToken, refreshToken } = await AuthService.register(body);
    return c.json({ user, accessToken, refreshToken });
  } catch (error) {
    return c.json({ error: (error as Error).message }, 400);
  }
});

// Login
authRoutes.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const { user, accessToken, refreshToken } = await AuthService.login(body);
    return c.json({ user, accessToken, refreshToken });
  } catch (error) {
    return c.json({ error: (error as Error).message }, 400);
  }
});

// Refresh session
authRoutes.post('/refresh', async (c) => {
  try {
    const body = await c.req.json();
    const { refreshToken } = body;
    const tokens = await AuthService.refreshSession(refreshToken);
    return c.json(tokens);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 401);
  }
});

// Logout
authRoutes.post('/logout', async (c) => {
  try {
    const body = await c.req.json();
    const { refreshToken } = body;
    await AuthService.logout(refreshToken);
    return c.json({ message: 'Logged out successfully' });
  } catch (error) {
    // We don't expose errors during logout for security
    return c.json({ message: 'Logged out successfully' });
  }
});

// Get current user
authRoutes.get('/me', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const user = await (await import('../services/users')).UserService.getUserById(userId);
  
  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }
  
  return c.json({ user });
});

export default authRoutes;