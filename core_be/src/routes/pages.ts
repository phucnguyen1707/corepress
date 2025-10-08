import { Hono } from 'hono';
import { PageService } from '../services/pages';
import { authMiddleware } from '../middleware/auth';

const pageRoutes = new Hono<{ Variables: { userId: string } }>();

// Create page
pageRoutes.post('/', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json();
  
  try {
    const page = await PageService.createPage({ ...body, userId });
    return c.json({ page });
  } catch (error) {
    return c.json({ error: (error as Error).message }, 400);
  }
});

// Get page by ID
pageRoutes.get('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id');
  const page = await PageService.getPageById(id);
  
  if (!page) {
    return c.json({ error: 'Page not found' }, 404);
  }
  
  return c.json({ page });
});

// Get pages by user ID
pageRoutes.get('/user/:userId', authMiddleware, async (c) => {
  const userId = c.req.param('userId');
  const pages = await PageService.getPagesByUserId(userId);
  return c.json({ pages });
});

// Update page
pageRoutes.put('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  
  try {
    const page = await PageService.updatePage(id, body);
    return c.json({ page });
  } catch (error) {
    return c.json({ error: (error as Error).message }, 400);
  }
});

// Delete page
pageRoutes.delete('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id');
  await PageService.deletePage(id);
  return c.json({ message: 'Page deleted successfully' });
});

export default pageRoutes;