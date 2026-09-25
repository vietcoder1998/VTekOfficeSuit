import { describe, expect, it } from "vitest";
import * as fileSystem from "node:fs";
import * as path from "node:path";
import {
  buildAllDesktopPackages,
  resolveDesktopOutputDirectoryPath,
  type BuildAllPackagesResult,
} from "../scripts/build-desktop-packages.ts";

describe("Runner Loop Prevention and Packaging Isolation (Task 6960)", () => {
  const rawPackageRoot: string = path.resolve(__dirname, "..");
  const packageRoot: string = fileSystem.realpathSync(rawPackageRoot);
  const workspaceRoot: string = path.resolve(packageRoot, "../..");

  it("should resolve default desktop output directory to dist-electron inside VTekOfficeSuit", () => {
    const defaultOutputPath: string = resolveDesktopOutputDirectoryPath();
    expect(defaultOutputPath).toBe(path.join(packageRoot, "dist-electron"));
  });

  it("should not contain childProcess.execSync calling build.ts in buildAllDesktopPackages", () => {
    const buildScriptPath: string = path.join(packageRoot, "scripts", "build-desktop-packages.ts");
    expect(fileSystem.existsSync(buildScriptPath)).toBe(true);
    const content: string = fileSystem.readFileSync(buildScriptPath, "utf-8");

    // Must not call root build.ts with --downloads (which loops other apps)
    expect(content).not.toContain('rootBuildScriptPath = path.join(workspaceRootDirectoryPath, "scripts", "build.ts")');
    expect(content).not.toContain('childProcess.execSync(`npx tsx "${rootBuildScriptPath}" --downloads`');
  });

  it("should exclude VTekOfficeSuit from discoverAllWorkspaceApps in scripts/run-all.mjs", () => {
    const runAllScriptPath: string = path.join(workspaceRoot, "scripts", "run-all.mjs");
    expect(fileSystem.existsSync(runAllScriptPath)).toBe(true);
    const runAllContent: string = fileSystem.readFileSync(runAllScriptPath, "utf-8");

    // Verify VTekOfficeSuit is filtered out from discovered web apps
    expect(runAllContent).toContain('entry.name !== "VTekOfficeSuit"');
  });

  it("should build desktop deb and exe packages directly to target output without looping another app", async () => {
    const testOutputDir: string = path.join(packageRoot, "dist-test-runner");
    if (fileSystem.existsSync(testOutputDir)) {
      fileSystem.rmSync(testOutputDir, { recursive: true, force: true });
    }

    const result: BuildAllPackagesResult = await buildAllDesktopPackages({
      silent: true,
      outputDirectoryPath: testOutputDir,
    });

    expect(result.success).toBe(true);
    expect(result.outputDirectory).toBe(testOutputDir);
    expect(result.debResult.success).toBe(true);
    expect(result.exeResult.success).toBe(true);

    expect(fileSystem.existsSync(result.debResult.filePath)).toBe(true);
    expect(fileSystem.existsSync(result.exeResult.filePath)).toBe(true);

    // Verify that NO other workspace app directories were created in testOutputDir
    const entries: string[] = fileSystem.readdirSync(testOutputDir);
    expect(entries.some((entry: string): boolean => entry.toLowerCase().includes("word"))).toBe(false);
    expect(entries.some((entry: string): boolean => entry.toLowerCase().includes("excel"))).toBe(false);

    // Clean up test output
    fileSystem.rmSync(testOutputDir, { recursive: true, force: true });
  }, 30000);
});
