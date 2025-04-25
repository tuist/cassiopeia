import { it, expect } from "vitest";
import { serve } from "@hono/node-server";
import { App } from "./app.js";
import getPort from "get-port";
import path from "path";
import { execa } from "execa";
import { temporaryDirectoryTask } from "tempy";

it("caches bazel builds", async () => {
  await runApp(async ({ port, cas, actionCache }) => {
    // Given/when
    await bazelBuild("bazel/go", "hello", { port });

    // Then
    expect(cas.size).not.toBe(0);
  });
});

async function bazelBuild(fixture, name, { port }) {
  await temporaryDirectoryTask(async (tmpDir) => {
    const fixtureDiretory = path.join(
      import.meta.dirname,
      "../fixtures",
      fixture,
    );

    await execa({
      stdio: "inherit",
      cwd: fixtureDiretory,
      env: {
        BAZEL_OUTPUT_USER_ROOT: tmpDir,
      },
    })`bazel clean`;
    await execa({
      stdio: "inherit",
      cwd: fixtureDiretory,
      env: {
        BAZEL_OUTPUT_USER_ROOT: tmpDir,
      },
    })`bazel build //:${name} --disk_cache= --remote_cache=http://localhost:${port} --remote_upload_local_results --noremote_accept_cached`;
  });
}

async function runApp(callback) {
  const { app, cas, actionCache } = App();
  const port = await getPort();
  console.log(`Serving in port: ${port}`);
  const server = serve({ fetch: app.fetch, port });
  await callback({ port, cas, actionCache });
  server.close?.();
}
