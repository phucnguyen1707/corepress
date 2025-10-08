import { db } from '../db';
import { pageSections } from '../db/schema';
import { eq } from 'drizzle-orm';

export interface PageSectionInput {
  pageId: string;
  sectionType: string;
}

export interface PageSectionUpdate {
  sectionType?: string;
}

export class PageSectionService {
  static async createPageSection(input: PageSectionInput) {
    const [newSection] = await db.insert(pageSections).values(input).returning();
    return newSection;
  }

  static async getPageSectionById(id: string) {
    const [section] = await db.select().from(pageSections).where(eq(pageSections.id, id));
    return section || null;
  }

  static async getPageSectionsByPageId(pageId: string) {
    return db.select().from(pageSections).where(eq(pageSections.pageId, pageId));
  }

  static async updatePageSection(id: string, data: PageSectionUpdate) {
    const [updatedSection] = await db
      .update(pageSections)
      .set(data)
      .where(eq(pageSections.id, id))
      .returning();
    return updatedSection;
  }

  static async deletePageSection(id: string) {
    await db.delete(pageSections).where(eq(pageSections.id, id));
  }
}