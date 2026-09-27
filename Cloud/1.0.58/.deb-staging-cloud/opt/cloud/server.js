// 2-TEK Standalone Next.js Server Wrapper
const path = require("node:path");
const fs = require("node:fs");
const Module = require("node:module");

process.env.NODE_ENV = process.env.NODE_ENV || "production";
process.env.PORT = process.env.PORT || "3018";
process.env.HOSTNAME = process.env.HOSTNAME || "0.0.0.0";

// Ensure Node module resolution can discover workspace and app node_modules
const candidateNodeModulesPaths = [
  path.join(__dirname, "node_modules"),
  path.join(__dirname, "..", "node_modules"),
  path.join(__dirname, "..", "..", "node_modules"),
  path.join(__dirname, "..", "..", "..", "node_modules"),
  path.join(process.cwd(), "node_modules"),
  process.env.WORKSPACE_ROOT ? path.join(process.env.WORKSPACE_ROOT, "node_modules") : null,
  process.env.NODE_PATH,
].filter((p) => Boolean(p) && fs.existsSync(p));

if (candidateNodeModulesPaths.length > 0) {
  process.env.NODE_PATH = candidateNodeModulesPaths.join(path.delimiter);
  if (typeof Module._initPaths === "function") {
    Module._initPaths();
  }
}

const candidateServerPaths = [
  path.join(__dirname, "packages", "Cloud", "server.js"),
  path.join(__dirname, ".next/standalone/packages/Cloud/server.js"),
  path.join(__dirname, ".next", "standalone", "server.js"),
  path.join(__dirname, "server-standalone.js"),
  path.join(require("node:os").homedir(), ".2tek", "Applications", "cloud", "server.js"),
  path.join(require("node:os").homedir(), ".2tek", "Applications", "cloud", "packages", "Cloud", "server.js"),
  process.env.WORKSPACE_ROOT ? path.join(process.env.WORKSPACE_ROOT, "packages", "Cloud", ".next", "standalone", "packages", "Cloud", "server.js") : null,
  process.env.WORKSPACE_ROOT ? path.join(process.env.WORKSPACE_ROOT, "packages", "Cloud", ".next", "standalone", "server.js") : null,
];

let standaloneExecuted = false;
for (const candidatePath of candidateServerPaths) {
  if (candidatePath && candidatePath !== __filename && fs.existsSync(candidatePath)) {
    try {
      require(candidatePath);
      standaloneExecuted = true;
      break;
    } catch (candidateError) {
      console.warn(
        "> Standalone candidate failed to load (" + candidatePath + "):",
        candidateError && candidateError.message ? candidateError.message : candidateError
      );
    }
  }
}

if (!standaloneExecuted) {
  const hasNextBuild = fs.existsSync(path.join(__dirname, ".next", "BUILD_ID"));
  if (hasNextBuild) {
    try {
      const { spawn } = require("node:child_process");
      const port = process.env.PORT;
      spawn("npx", ["next", "start", "-p", String(port)], {
        cwd: __dirname,
        stdio: "inherit",
        shell: process.platform === "win32",
      });
      standaloneExecuted = true;
    } catch {}
  }
}

if (!standaloneExecuted) {
  const http = require("node:http");
  const port = parseInt(process.env.PORT, 10);
  const hostname = process.env.HOSTNAME;
  const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`<!DOCTYPE html><html><head><title>Cloud Storage</title></head><body><h1>Cloud Storage</h1><p>Cloud storage manager, file permissions, and cloud resource viewer.</p></body></html>`);
  });
  server.listen(port, hostname, () => {
    console.log(`> Cloud Storage standalone running on http://${hostname}:${port}`);
  });
}
