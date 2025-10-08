import { Hono } from 'hono';
import { SectionHeaderService } from '../services/sectionHeaders';
import { authMiddleware } from '../middleware/auth';

const sectionHeaderRoutes = new Hono();

// Create section header
sectionHeaderRoutes.post('/', authMiddleware, async (c) => {
  const body = await c.req.json();
  
  try {
    const header = await SectionHeaderService.createSectionHeader(body);
    return c.json({ header });
  } catch (error) {
    return c.json({ error: (error as Error).message }, 400);
  }
});

// Get section header by ID
sectionHeaderRoutes.get('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id');
  const header = await SectionHeaderService.getSectionHeaderById(id);
  
  if (!header) {
    return c.json({ error: 'Section header not found' }, 404);
  }
  
  return c.json({ header });
});

// Get section headers by section ID
sectionHeaderRoutes.get('/section/:sectionId', authMiddleware, async (c) => {
  const sectionId = c.req.param('sectionId');
  const headers = await SectionHeaderService.getSectionHeadersBySectionId(sectionId);
  return c.json({ headers });
});

// Update section header
sectionHeaderRoutes.put('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  
  try {
    const header = await SectionHeaderService.updateSectionHeader(id, body);
    return c.json({ header });
  } catch (error) {
    return c.json({ error: (error as Error).message }, 400);
  }
});

// Delete section header
sectionHeaderRoutes.delete('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id');
  await SectionHeaderService.deleteSectionHeader(id);
  return c.json({ message: 'Section header deleted successfully' });
});

export default sectionHeaderRoutes;