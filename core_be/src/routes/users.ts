import { Hono } from 'hono';
import { UserService } from '../services/users';
import { authMiddleware } from '../middleware/auth';

const userRoutes = new Hono<{ Variables: { userId: string } }>();

// Get user by ID
userRoutes.get('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id');
  const user = await UserService.getUserById(id);
  
  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }
  
  return c.json({ user });
});

// Update user
userRoutes.put('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id');
  const userId = c.get('userId');
  
  if (id !== userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const body = await c.req.json();
    const user = await UserService.updateUser(id, body);
    return c.json({ user });
  } catch (error) {
    return c.json({ error: (error as Error).message }, 400);
  }
});

// Delete user
userRoutes.delete('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id');
  const userId = c.get('userId');
  
  if (id !== userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  await UserService.deleteUser(id);
  return c.json({ message: 'User deleted successfully' });
});

export default userRoutes;