import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import pageRoutes from './routes/pages';
import pageSectionRoutes from './routes/pageSections';
import sectionHeaderRoutes from './routes/sectionHeaders';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors());
app.onError(errorHandler);

// Routes
app.route('/api/auth', authRoutes);
app.route('/api/users', userRoutes);
app.route('/api/pages', pageRoutes);
app.route('/api/page-sections', pageSectionRoutes);
app.route('/api/section-headers', sectionHeaderRoutes);

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

// Start server
const port = Number(process.env.PORT) || 8080;
console.log(`Server is running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};