import { Context, Next } from 'hono';
import { AuthService } from '../services/auth';

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized: No token provided' }, 401);
  }

  const token = authHeader.substring(7);
  
  try {
    const { userId } = AuthService.verifyAccessToken(token);
    c.set('userId', userId);
    await next();
  } catch (error) {
    return c.json({ error: 'Unauthorized: Invalid token' }, 401);
  }
};