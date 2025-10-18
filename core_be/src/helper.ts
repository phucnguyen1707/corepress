import type { User } from "./auth";
import { pg } from "./postgres";

export const extractUser = async (req: Bun.BunRequest) => {
  const cookie = req.cookies;

  const session = cookie.get("session");

  if (!session) {
    return null;
  }

  const [user]: [User] =
    await pg`SELECT id, name, email FROM users WHERE session = ${session};`;

  return user;
};
