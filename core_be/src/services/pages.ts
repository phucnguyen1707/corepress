import { db } from '../db';
import { pages } from '../db/schema';
import { eq } from 'drizzle-orm';

export interface PageInput {
  userId: string;
  pageType: string;
}

export interface PageUpdate {
  pageType?: string;
}

export class PageService {
  static async createPage(input: PageInput) {
    const [newPage] = await db.insert(pages).values(input).returning();
    return newPage;
  }

  static async getPageById(id: string) {
    const [page] = await db.select().from(pages).where(eq(pages.id, id));
    return page || null;
  }

  static async getPagesByUserId(userId: string) {
    return db.select().from(pages).where(eq(pages.userId, userId));
  }

  static async updatePage(id: string, data: PageUpdate) {
    const [updatedPage] = await db
      .update(pages)
      .set(data)
      .where(eq(pages.id, id))
      .returning();
    return updatedPage;
  }

  static async deletePage(id: string) {
    await db.delete(pages).where(eq(pages.id, id));
  }
}