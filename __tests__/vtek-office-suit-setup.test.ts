import { describe, expect, it } from "vitest";
import * as childProcess from "node:child_process";
import * as fileSystem from "node:fs";
import * as path from "node:path";

describe("VTekOfficeSuit Repository Setup Verification", () => {
  const packageRoot = path.resolve(__dirname, "..");
  const workspaceRoot = path.resolve(packageRoot, "../..");

  it("should have git remote origin pointing to https://github.com/vietcoder1998/VTekOfficeSuit.git", () => {
    const gitRemoteOutput = childProcess
      .execSync("git remote get-url origin", { cwd: packageRoot, encoding: "utf-8" })
      .trim();
    expect(gitRemoteOutput).toBe("https://github.com/vietcoder1998/VTekOfficeSuit.git");
  });

  it("should have canonical PROJECT_TARGET.md defining desktop app and packaging scope", () => {
    const targetFilePath = path.join(packageRoot, "PROJECT_TARGET.md");
    expect(fileSystem.existsSync(targetFilePath)).toBe(true);
    const content = fileSystem.readFileSync(targetFilePath, "utf-8");
    expect(content).toContain("Unified Electron Desktop Application Shell & Multi-Platform Distribution Packager");
    expect(content).toContain("downloads/");
  });

  it("should have README.md documenting setup, architecture, and desktop distribution", () => {
    const readmePath = path.join(packageRoot, "README.md");
    expect(fileSystem.existsSync(readmePath)).toBe(true);
    const content = fileSystem.readFileSync(readmePath, "utf-8");
    expect(content).toContain("VTekOfficeSuit");
    expect(content).toContain("Unified Electron Desktop Application & Multi-Platform Distribution Packager");
  });

  it("should have .standards/structure.md and .standards/designs.md conforming to Rule 68", () => {
    const structurePath = path.join(packageRoot, ".standards", "structure.md");
    const designsPath = path.join(packageRoot, ".standards", "designs.md");
    expect(fileSystem.existsSync(structurePath)).toBe(true);
    expect(fileSystem.existsSync(designsPath)).toBe(true);
  });

  it("should have .features/25-09-2026.md logging task queue per Rule 70", () => {
    const featuresPath = path.join(packageRoot, ".features", "25-09-2026.md");
    expect(fileSystem.existsSync(featuresPath)).toBe(true);
    const content = fileSystem.readFileSync(featuresPath, "utf-8");
    expect(content).toContain("setup repository with https://github.com/vietcoder1998/VTekOfficeSuit");
  });

  it("should have tsconfig.json and pass type-check", () => {
    const tsconfigPath = path.join(packageRoot, "tsconfig.json");
    expect(fileSystem.existsSync(tsconfigPath)).toBe(true);
  });

  it("should be registered in workspace root package.json workspaces and fetch-all scripts", () => {
    const rootPkgPath = path.join(workspaceRoot, "package.json");
    const rootPkg = JSON.parse(fileSystem.readFileSync(rootPkgPath, "utf-8"));
    expect(rootPkg.workspaces).toContain("packages/VTekOfficeSuit");

    const fetchAllPath = path.join(workspaceRoot, "scripts", "fetch-all.ts");
    const fetchAllContent = fileSystem.readFileSync(fetchAllPath, "utf-8");
    expect(fetchAllContent).toContain("https://github.com/vietcoder1998/VTekOfficeSuit.git");
  });

  it("should have downloads/ directory containing valid distribution packages", () => {
    const downloadsPath = path.join(packageRoot, "downloads");
    expect(fileSystem.existsSync(downloadsPath)).toBe(true);
    const vtekDownloadsPath = path.join(downloadsPath, "vtek-office-suit", "1.0.0");
    expect(fileSystem.existsSync(vtekDownloadsPath)).toBe(true);
    expect(fileSystem.existsSync(path.join(vtekDownloadsPath, "SHA256SUMS.txt"))).toBe(true);
    expect(fileSystem.existsSync(path.join(vtekDownloadsPath, "release-manifest.json"))).toBe(true);
  });
});
