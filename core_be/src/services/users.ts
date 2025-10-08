import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { AuthUser } from './auth';

export class UserService {
  static async getUserById(id: string): Promise<AuthUser | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) return null;

    return {
      id: user.id,
      username: user.username,
      name: user.name,
    };
  }

  static async updateUser(id: string, data: { name?: string; password?: string }): Promise<AuthUser> {
    const updateData: any = {};
    
    if (data.name) {
      updateData.name = data.name;
    }
    
    if (data.password) {
      updateData.password = await import('../utils/crypto').then(m => m.hashPassword(data.password!));
    }

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    return {
      id: updatedUser.id,
      username: updatedUser.username,
      name: updatedUser.name,
    };
  }

  static async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }
}