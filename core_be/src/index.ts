import { getUser, login, logout, register } from "./auth";

import {
  addSection,
  deleteNode,
  editNode,
  getNode,
  getPage,
  getPageCSS,
  insertNode,
  updatePageCss,
} from "./page";
import { createTable, pg } from "./postgres";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3001",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Credentials": "true",
};

function addCorsHeaders(response: Response): Response {
  const newHeaders = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

type BunHandler = (req: any) => Response | Promise<Response>;
type RouteConfig = BunHandler | { [method: string]: BunHandler };

function withCors(handler: BunHandler): BunHandler {
  return async (req: any) => {
    const response = await handler(req);
    return addCorsHeaders(response);
  };
}

function wrapRoutesWithCors(
  routes: Record<string, RouteConfig>,
): Record<string, RouteConfig> {
  const wrappedRoutes: Record<string, RouteConfig> = {};

  for (const [path, config] of Object.entries(routes)) {
    if (typeof config === "function") {
      wrappedRoutes[path] = withCors(config);
    } else {
      const wrappedMethods: { [method: string]: BunHandler } = {};
      for (const [method, handler] of Object.entries(config)) {
        wrappedMethods[method] = withCors(handler);
      }
      wrappedRoutes[path] = wrappedMethods;
    }
  }

  return wrappedRoutes;
}

pg.connect().then(async () => {
  console.log("Postgres connected");
  createTable(pg);

  const server = Bun.serve({
    port: 8000,
    routes: wrapRoutesWithCors({
      //! PING -------------------------
      "/ping": () => new Response("pong"),

      //! AUTH -------------------------
      "/auth/register": {
        POST: register,
      },
      "/auth/login": {
        POST: login,
      },
      "/auth/logout": {
        POST: logout,
      },
      "/auth/user": {
        GET: getUser,
      },

      //! PAGE -------------------------
      "/page/:id": {
        GET: getPage,
      },
      "/page/:id/css": {
        GET: getPageCSS,
      },
      "/page/:id/node/:nodeId": {
        GET: getNode,
      },
      "/page/:id/edit/css": {
        POST: updatePageCss
      },
      "/page/:id/node/insert/:parentId": {
        POST: insertNode,
      },
      "/page/:id/node/edit/:nodeId": {
        POST: editNode,
      },
      "/page/:id/node/delete/:nodeId": {
        POST: deleteNode,
      },
      "/page/:id/section/add/:section_type/:template_index/node/:node_id": {
        POST: addSection,
      },
    }),
    fetch(req) {
      if (req.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: corsHeaders,
        });
      }

      return new Response("Not Found", {
        status: 404,
        headers: corsHeaders,
      });
    },
    error(err) {
      console.error(err);
      return new Response("Internal Server Error", {
        status: 500,
        headers: corsHeaders,
      });
    },
  });

  console.log(`Listening on http://localhost:${server.port} ...`);
});
