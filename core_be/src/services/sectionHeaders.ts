import { db } from '../db';
import { sectionHeaders } from '../db/schema';
import { eq } from 'drizzle-orm';

export interface SectionHeaderInput {
  sectionId: string;
  title: string;
  logoUrl?: string;
  imageUrl?: string;
}

export interface SectionHeaderUpdate {
  title?: string;
  logoUrl?: string;
  imageUrl?: string;
}

export class SectionHeaderService {
  static async createSectionHeader(input: SectionHeaderInput) {
    const [newHeader] = await db.insert(sectionHeaders).values(input).returning();
    return newHeader;
  }

  static async getSectionHeaderById(id: string) {
    const [header] = await db.select().from(sectionHeaders).where(eq(sectionHeaders.id, id));
    return header || null;
  }

  static async getSectionHeadersBySectionId(sectionId: string) {
    return db.select().from(sectionHeaders).where(eq(sectionHeaders.sectionId, sectionId));
  }

  static async updateSectionHeader(id: string, data: SectionHeaderUpdate) {
    const [updatedHeader] = await db
      .update(sectionHeaders)
      .set(data)
      .where(eq(sectionHeaders.id, id))
      .returning();
    return updatedHeader;
  }

  static async deleteSectionHeader(id: string) {
    await db.delete(sectionHeaders).where(eq(sectionHeaders.id, id));
  }
}