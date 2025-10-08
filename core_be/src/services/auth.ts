import jwt from "jsonwebtoken";
import { db } from "../db";
import { users, refreshTokens } from "../db/schema";
import { eq, and, lt } from "drizzle-orm";
import { hashPassword, comparePassword } from "../utils/crypto";
import {
  validateUsername,
  validatePassword,
  validateName,
} from "../utils/validation";

export interface LoginInput {
  username: string;
  password: string;
}

export interface RegisterInput {
  username: string;
  name: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  name: string;
}

export class AuthService {
  // --- Helper methods for token generation ---
  private static generateAccessToken(userId: string): string {
    const expiresIn: any = process.env.ACCESS_TOKEN_EXPIRY || "15m";
    return jwt.sign({ userId, type: "access" }, process.env.JWT_SECRET!, {
      expiresIn,
    });
  }

  private static generateRefreshToken(userId: string): string {
    const expiresIn: any = process.env.REFRESH_TOKEN_EXPIRY || "7d";
    const token = jwt.sign(
      { userId, type: "refresh" },
      process.env.JWT_SECRET!,
      { expiresIn }
    );

    // Calculate expiry date for the database
    const expiresAt = new Date();
    const expiryMs = this.parseExpiryToMs(expiresIn);
    expiresAt.setTime(expiresAt.getTime() + expiryMs);

    // Save the refresh token to the database
    db.insert(refreshTokens)
      .values({
        token,
        userId,
        expiresAt,
      })
      .execute();

    return token;
  }

  // Helper to convert "1d", "15m" etc. to milliseconds
  private static parseExpiryToMs(expiry: string): number {
    const unit = expiry.slice(-1);
    const value = parseInt(expiry.slice(0, -1));
    switch (unit) {
      case "s":
        return value * 1000;
      case "m":
        return value * 60 * 1000;
      case "h":
        return value * 60 * 60 * 1000;
      case "d":
        return value * 24 * 60 * 60 * 1000;
      default:
        return 0;
    }
  }

  // --- Register now returns both tokens ---
  static async register(
    input: RegisterInput
  ): Promise<{ user: AuthUser; accessToken: string; refreshToken: string }> {
    const { username, name, password } = input;

    if (
      !validateUsername(username) ||
      !validateName(name) ||
      !validatePassword(password)
    ) {
      throw new Error("Invalid input");
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    if (existingUser.length > 0) {
      throw new Error("Username already exists");
    }

    const hashedPassword = await hashPassword(password);
    const [newUser] = await db
      .insert(users)
      .values({ username, name, password: hashedPassword })
      .returning();

    const accessToken = this.generateAccessToken(newUser.id);
    const refreshToken = this.generateRefreshToken(newUser.id);

    const user: AuthUser = {
      id: newUser.id,
      username: newUser.username,
      name: newUser.name,
    };

    return { user, accessToken, refreshToken };
  }

  // --- Login now returns both tokens ---
  static async login(
    input: LoginInput
  ): Promise<{ user: AuthUser; accessToken: string; refreshToken: string }> {
    const { username, password } = input;

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    if (!user || !(await comparePassword(password, user.password))) {
      throw new Error("Invalid credentials");
    }

    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    const authUser: AuthUser = {
      id: user.id,
      username: user.username,
      name: user.name,
    };

    return { user: authUser, accessToken, refreshToken };
  }

  // --- New method for refreshing tokens ---
  static async refreshSession(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (!refreshToken) {
      throw new Error("Refresh token is required");
    }

    // 1. Verify the JWT signature and type
    let payload: { userId: string; type: string };
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_SECRET!) as any;
      if (payload.type !== "refresh") {
        throw new Error("Invalid token type");
      }
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }

    // 2. Check if the token exists in the database and is not expired
    const [tokenRecord] = await db
      .select()
      .from(refreshTokens)
      .where(
        and(
          eq(refreshTokens.token, refreshToken),
          eq(refreshTokens.userId, payload.userId)
        )
      );

    if (!tokenRecord || new Date(tokenRecord.expiresAt) < new Date()) {
      // If the token is invalid/expired, clean up any other expired tokens for this user as a courtesy
      await db.delete(refreshTokens).where(
        and(
          eq(refreshTokens.userId, payload.userId),
          lt(refreshTokens.expiresAt, new Date())
        )
      );
      throw new Error("Refresh token not found or expired");
    }

    // 3. Delete the old refresh token (one-time use)
    await db.delete(refreshTokens).where(eq(refreshTokens.token, refreshToken));

    // 4. Clean up any other expired tokens for this user ---
    await db
      .delete(refreshTokens)
      .where(
        and(
          eq(refreshTokens.userId, payload.userId),
          lt(refreshTokens.expiresAt, new Date())
        )
      );

    // 5. Generate new tokens
    const newAccessToken = this.generateAccessToken(payload.userId);
    const newRefreshToken = this.generateRefreshToken(payload.userId);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  // --- New method for logging out ---
  static async logout(refreshToken: string): Promise<void> {
    if (!refreshToken) return;
    await db.delete(refreshTokens).where(eq(refreshTokens.token, refreshToken));
  }

  // --- Verify Access Token (used by middleware) ---
  static verifyAccessToken(token: string): { userId: string } {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
      if (payload.type !== "access") {
        throw new Error("Invalid token type");
      }
      return { userId: payload.userId };
    } catch (error) {
      throw new Error("Invalid access token");
    }
  }
}
