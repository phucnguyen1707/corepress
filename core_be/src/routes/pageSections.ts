import { Hono } from 'hono';
import { PageSectionService } from '../services/pageSections';
import { authMiddleware } from '../middleware/auth';

const pageSectionRoutes = new Hono();

// Create page section
pageSectionRoutes.post('/', authMiddleware, async (c) => {
  const body = await c.req.json();
  
  try {
    const section = await PageSectionService.createPageSection(body);
    return c.json({ section });
  } catch (error) {
    return c.json({ error: (error as Error).message }, 400);
  }
});

// Get page section by ID
pageSectionRoutes.get('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id');
  const section = await PageSectionService.getPageSectionById(id);
  
  if (!section) {
    return c.json({ error: 'Page section not found' }, 404);
  }
  
  return c.json({ section });
});

// Get page sections by page ID
pageSectionRoutes.get('/page/:pageId', authMiddleware, async (c) => {
  const pageId = c.req.param('pageId');
  const sections = await PageSectionService.getPageSectionsByPageId(pageId);
  return c.json({ sections });
});

// Update page section
pageSectionRoutes.put('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  
  try {
    const section = await PageSectionService.updatePageSection(id, body);
    return c.json({ section });
  } catch (error) {
    return c.json({ error: (error as Error).message }, 400);
  }
});

// Delete page section
pageSectionRoutes.delete('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id');
  await PageSectionService.deletePageSection(id);
  return c.json({ message: 'Page section deleted successfully' });
});

export default pageSectionRoutes;