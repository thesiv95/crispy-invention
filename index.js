import * as path from "https://deno.land/std@0.146.0/path/mod.ts";
import { Application, Router } from "https://deno.land/x/oak@v10.6.0/mod.ts";

let myAddress = '';

// The directory of this module
const moduleDir = path.dirname(path.fromFileUrl(import.meta.url));
// The public directory (with "index.html" in it)
const publicDir = path.join(moduleDir, "public");

function getPublicFile(...filePath) {
  return Deno.readFile(path.join(publicDir, ...filePath));
}

// Create a router
const router = new Router();


router.get("/", async (ctx, next) => {
  ctx.response.body = await getPublicFile("index.html");

  ctx.response.type = "text/html";
  await next();
});

router.get("/my-url", async (ctx, next) => {
  ctx.response.type = "json";
  ctx.response.body = { host: myAddress };
});

// Create the app
const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

function printStartupMessage({ hostname, port, secure }) {
  const address = new URL(
    `http${secure ? "s" : ""}://${
      hostname === "0.0.0.0" ? "localhost" : hostname
    }:${port}/`
  ).href;
  myAddress = address;
  console.log(`Listening at ${address}`);
  console.log("Use ctrl+c to stop");
}

app.addEventListener("listen", printStartupMessage);

// Start the server
await app.listen({ port: 8000 });
