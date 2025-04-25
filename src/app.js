import { Hono } from "hono";

export function App() {
  const app = new Hono();
  const cas = new Map(); // Content Addressable Storage
  const actionCache = new Map(); // Action Cache

  app.put("/cas/:hash", async (c) => {
    const { hash } = c.req.param();
    const buffer = new Uint8Array(await c.req.arrayBuffer());
    cas.set(hash, buffer);
    console.log(`[CAS PUT (custom)] hash=${hash}`);
    return c.text("OK", 200);
  });

  app.get("/cas/:hash", (c) => {
    const { hash } = c.req.param();
    const buffer = cas.get(hash);
    if (!buffer) return c.text("Not Found", 404);
    console.log(`[CAS GET (custom)] hash=${hash}`);
    return new Response(buffer, {
      headers: { "Content-Type": "application/octet-stream" },
    });
  });

  app.put("/ac/:hash", async (c) => {
    const { hash } = c.req.param();
    const buffer = new Uint8Array(await c.req.arrayBuffer());
    actionCache.set(hash, buffer);
    console.log(`[AC PUT (custom)] hash=${hash}`);
    return c.text("OK", 200);
  });

  app.get("/ac/:hash", (c) => {
    const { hash } = c.req.param();
    const buffer = actionCache.get(hash);
    if (!buffer) {
      console.log(`[AC GET (custom)] MISS hash=${hash}`);
      return c.text("Not Found", 404);
    }
    console.log(`[AC GET (custom)] HIT hash=${hash}`);
    return new Response(buffer, {
      headers: { "Content-Type": "application/octet-stream" },
    });
  });

  return {
    app,
    cas,
    actionCache,
  };
}

const { app } = App();
export default app;
