import { getUser, login, logout, register } from "./auth";
import { deleteNode, editNode, getNode, getPage, insertNode } from "./page";
import { createTable, pg } from "./postgres";
import dotenv from 'dotenv'

dotenv.config({path:"../.env"})

pg.connect().then(async () => {
  console.log("Postgres connected");

  createTable(pg);

  const server = Bun.serve({
    port: 8000,
    routes: {
      //! PING -------------------------

      "/ping": new Response("pong"),

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
      "/page/:id/node/:nodeId": {
        GET: getNode,
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
    },
    fetch(_req) {
      return new Response("Not Found", { status: 404 });
    },
    error(err) {
      console.error(err);
    },
  });

  console.log(`Listening on http://localhost:${server.port} ...`);
});
