#!/usr/bin/env node

/**
 * packages/VTekOfficeSuit/scripts/build-desktop-packages.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * VTek Office Suite — Build Runner CLI
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { spawn } from "node:child_process";
import * as fileSystem from "node:fs";
import * as path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFilePath);
const packageRoot = path.resolve(currentDir, "..");
const workspaceRoot = path.resolve(packageRoot, "../..");
const targetTsScript = path.join(currentDir, "build-desktop-packages.ts");

function findTsx() {
  const isWin = process.platform === "win32";
  const binName = isWin ? "tsx.cmd" : "tsx";
  const candidates = [
    path.join(workspaceRoot, "node_modules", ".bin", binName),
    path.join(packageRoot, "node_modules", ".bin", binName),
  ];
  for (const c of candidates) {
    if (fileSystem.existsSync(c)) return c;
  }
  return "tsx";
}

const tsxBin = findTsx();
const cliArgs = process.argv.slice(2);

const child = spawn(
  tsxBin,
  [
    "-e",
    `
    import { buildAllDesktopPackages, buildDebPackage, buildExePackage } from './build-desktop-packages.ts';
    const args = process.argv.slice(1);
    const isDeb = args.includes('--deb');
    const isExe = args.includes('--exe');
    async function run() {
      if (isDeb && !isExe) {
        await buildDebPackage();
      } else if (isExe && !isDeb) {
        await buildExePackage();
      } else {
        await buildAllDesktopPackages();
      }
    }
    run().catch(err => {
      console.error(err);
      process.exit(1);
    });
  `,
    "--",
    ...cliArgs,
  ],
  {
    cwd: currentDir,
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "production" },
  }
);

child.on("exit", (code) => {
  process.exit(code || 0);
});
