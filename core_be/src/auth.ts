import { extractUser } from "./helper";
import { pg } from "./postgres";

//! INTERFACE -----------------------------------------------------------------------------

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  session?: string;
  created_at?: Date;
}

//! CONTROLLER -----------------------------------------------------------------------------

// REGISTER
export const register = async (req: Bun.BunRequest): Promise<Response> => {
  const { name, email, password } = (await req.json()) as RegisterRequest;

  const hashPassword = await Bun.password.hash(password);

  const html_id = crypto.randomUUID();
  const body_id = crypto.randomUUID();
  const main_id = crypto.randomUUID();

  const pageData = {
    htmlNode: html_id,
    mainNode: main_id,
    nodes: {
      [html_id]: {
        attribute: {},
        tag: "html",
        children: [body_id],
      },
      [body_id]: {
        attribute: {},
        tag: "body",
        children: [main_id],
      },
      [main_id]: {
        attribute: {},
        tag: "main",
        children: [],
      },
    },
  };

  await pg.begin(async (tx) => {
    const [user] = await tx`
        INSERT INTO users (name, email, password)
        VALUES (${name}, ${email}, ${hashPassword})
        RETURNING id;
      `;

    await tx`
        INSERT INTO pages (name, user_id, data)
        VALUES ('New Page', ${user.id}, ${pageData});
      `;
  });

  return new Response(null, { status: 201 });
};

// LOGIN
export const login = async (req: Bun.BunRequest): Promise<Response> => {
  const { email, password } = (await req.json()) as LoginRequest;

  const [user]: [User] =
    await pg`SELECT password FROM users WHERE email = ${email};`;

  if (!user) {
    return new Response(null, { status: 401 });
  }

  const isPasswordCorrect = await Bun.password.verify(password, user.password!);

  if (!isPasswordCorrect) {
    return new Response(null, { status: 401 });
  }

  const session = crypto.randomUUID();

  await pg`UPDATE users SET session = ${session} WHERE email = ${email};`.execute();

  const maxAge = 7 * 24 * 60 * 60;

  const cookie = req.cookies;

  cookie.set("session", session, {
    maxAge,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return new Response(null, {
    status: 200,
  });
};

// LOGOUT
export const logout = async (req: Bun.BunRequest): Promise<Response> => {
  const cookie = req.cookies;

  cookie.delete("session");

  return new Response(null, {
    status: 200,
  });
};

// GET USER
export const getUser = async (req: Bun.BunRequest): Promise<Response> => {
  const user = await extractUser(req);

  if (!user) {
    return new Response(null, { status: 401 });
  }

  const pages =
    await pg`SELECT id, name FROM pages WHERE user_id = ${user.id};`;

  return new Response(JSON.stringify({ user, pages }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
