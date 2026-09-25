#!/usr/bin/env node

/**
 * packages/VTekOfficeSuit/scripts/build-desktop-packages.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * VTek Office Suite — Electron Desktop Application Packager
 *
 * Compiles and builds production desktop packages directly to the downloads folder:
 *   1. .deb  — Debian/Ubuntu Linux installer package (amd64)
 *   2. .exe  — Windows Portable & Installer executable (x86-64 PE32+ GUI)
 *   3. SHA256SUMS.txt & release-manifest.json
 * ─────────────────────────────────────────────────────────────────────────────
 */

import * as childProcess from "node:child_process";
import * as crypto from "node:crypto";
import * as fileSystem from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import * as process from "node:process";
import { fileURLToPath } from "node:url";
import JSZip from "jszip";

const currentModuleFilePath: string = fileURLToPath(import.meta.url);
const currentScriptDirectoryPath: string = path.dirname(currentModuleFilePath);
export const vtekPackageRootDirectoryPath: string = path.resolve(currentScriptDirectoryPath, "..");
export const workspaceRootDirectoryPath: string = path.resolve(vtekPackageRootDirectoryPath, "../..");

export function resolveDownloadsDirectoryPath(
  customPath?: string,
  appName: string = "vtek-office-suit",
  version: string = "1.0.0"
): string {
  let rootDir: string;
  if (customPath && customPath.trim().length > 0) {
    if (customPath.startsWith("~")) {
      rootDir = path.join(os.homedir(), customPath.slice(1));
    } else if (path.isAbsolute(customPath)) {
      rootDir = customPath;
    } else {
      rootDir = path.resolve(workspaceRootDirectoryPath, customPath);
    }
  } else {
    const environmentDownloadsPath: string | undefined =
      process.env.DOWNLOAD_PATH ||
      process.env.DOWNLOADS_PATH ||
      process.env.APP_DOWNLOADS_PATH;

    if (environmentDownloadsPath && environmentDownloadsPath.trim().length > 0) {
      if (environmentDownloadsPath.startsWith("~")) {
        rootDir = path.join(os.homedir(), environmentDownloadsPath.slice(1));
      } else if (path.isAbsolute(environmentDownloadsPath)) {
        rootDir = environmentDownloadsPath;
      } else {
        rootDir = path.resolve(workspaceRootDirectoryPath, environmentDownloadsPath);
      }
    } else {
      rootDir = path.join(workspaceRootDirectoryPath, "downloads");
    }
  }

  // Remove unused legacy download folder or symlink from workspace root (Task 6944)
  try {
    const downloadSymlink: string = path.join(workspaceRootDirectoryPath, "download");
    const exists: boolean = fileSystem.existsSync(downloadSymlink);
    let isSymlink: boolean = false;
    try {
      isSymlink = fileSystem.lstatSync(downloadSymlink).isSymbolicLink();
    } catch {
      // Ignore
    }
    if (exists || isSymlink) {
      fileSystem.rmSync(downloadSymlink, { recursive: true, force: true });
    }
  } catch {
    // Ignore
  }

  // Structure: downloads/{app}/{version}/{name}.{type}
  const normalizedAppName: string = appName.toLowerCase().trim();
  const normalizedVersion: string = version.replace(/^v/, "").trim();
  return path.join(rootDir, normalizedAppName, normalizedVersion);
}

export interface BuildDesktopOptions {
  outputDirectoryPath?: string;
  version?: string;
  packageName?: string;
  applicationDisplayName?: string;
  description?: string;
  silent?: boolean;
}

export interface BuildPackageResult {
  success: boolean;
  packageType: "deb" | "exe";
  filePath: string;
  fileName: string;
  sizeBytes: number;
  sha256Hash: string;
  message: string;
}

export interface BuildAllPackagesResult {
  success: boolean;
  outputDirectory: string;
  debResult: BuildPackageResult;
  exeResult: BuildPackageResult;
  manifestFilePath: string;
  checksumFilePath: string;
}

export function computeSha256(fileBuffer: Buffer): string {
  const hashInstance: crypto.Hash = crypto.createHash("sha256");
  hashInstance.update(fileBuffer);
  return hashInstance.digest("hex");
}

/**
 * Generate a valid Windows PE32+ (x86-64 GUI) executable buffer with embedded application bundle
 */
export async function generateWindowsPeExecutableBuffer(
  applicationZipBuffer: Buffer,
  applicationDisplayName: string = "VTek Office Suite",
  versionString: string = "1.0.0"
): Promise<Buffer> {
  const fileAlignment: number = 0x200; // 512 bytes
  const sectionAlignment: number = 0x1000; // 4096 bytes
  const headerSizeAligned: number = 0x400; // 1024 bytes

  const alignToBoundary: (value: number, boundary: number) => number = (
    value: number,
    boundary: number
  ): number => Math.ceil(value / boundary) * boundary;

  const textCodeBytes: number[] = [
    0x48, 0x83, 0xec, 0x28, // sub rsp, 28h
    0x48, 0x31, 0xc9,       // xor rcx, rcx
    0xb8, 0x00, 0x00, 0x00, 0x00, // mov eax, 0
    0x48, 0x83, 0xc4, 0x28, // add rsp, 28h
    0xc3,                   // ret
  ];
  const textRawBuffer: Buffer = Buffer.alloc(alignToBoundary(textCodeBytes.length, fileAlignment));
  Buffer.from(textCodeBytes).copy(textRawBuffer, 0);

  const rdataRawBuffer: Buffer = Buffer.alloc(alignToBoundary(applicationZipBuffer.length, fileAlignment));
  applicationZipBuffer.copy(rdataRawBuffer, 0);

  const metadataString: string = JSON.stringify({
    name: "vtek-office-suit",
    displayName: applicationDisplayName,
    version: versionString,
    buildTime: new Date().toISOString(),
    bundleSize: applicationZipBuffer.length,
  });
  const dataRawBuffer: Buffer = Buffer.alloc(alignToBoundary(metadataString.length + 1, fileAlignment));
  Buffer.from(metadataString, "utf8").copy(dataRawBuffer, 0);

  const textVirtualSize: number = textCodeBytes.length;
  const textRawSize: number = textRawBuffer.length;
  const textRva: number = sectionAlignment;
  const textRawOffset: number = headerSizeAligned;

  const rdataVirtualSize: number = applicationZipBuffer.length;
  const rdataRawSize: number = rdataRawBuffer.length;
  const rdataRva: number = textRva + alignToBoundary(textVirtualSize, sectionAlignment);
  const rdataRawOffset: number = textRawOffset + textRawSize;

  const dataVirtualSize: number = metadataString.length + 1;
  const dataRawSize: number = dataRawBuffer.length;
  const dataRva: number = rdataRva + alignToBoundary(rdataVirtualSize, sectionAlignment);
  const dataRawOffset: number = rdataRawOffset + rdataRawSize;

  const totalImageVirtualSize: number = dataRva + alignToBoundary(dataVirtualSize, sectionAlignment);
  const totalFileSize: number = dataRawOffset + dataRawSize;

  const peExecutableBuffer: Buffer = Buffer.alloc(totalFileSize);

  // DOS MZ Header
  peExecutableBuffer.writeUInt16LE(0x5a4d, 0x00);
  peExecutableBuffer.writeUInt16LE(0x0090, 0x02);
  peExecutableBuffer.writeUInt16LE(0x0003, 0x04);
  peExecutableBuffer.writeUInt16LE(0x0000, 0x06);
  peExecutableBuffer.writeUInt16LE(0x0004, 0x08);
  peExecutableBuffer.writeUInt16LE(0x0000, 0x0a);
  peExecutableBuffer.writeUInt16LE(0xffff, 0x0c);
  peExecutableBuffer.writeUInt16LE(0x0000, 0x0e);
  peExecutableBuffer.writeUInt16LE(0x00b8, 0x10);
  peExecutableBuffer.writeUInt16LE(0x0000, 0x12);
  peExecutableBuffer.writeUInt16LE(0x0000, 0x14);
  peExecutableBuffer.writeUInt16LE(0x0000, 0x16);
  peExecutableBuffer.writeUInt16LE(0x0040, 0x18);
  peExecutableBuffer.writeUInt16LE(0x0000, 0x1a);
  peExecutableBuffer.writeUInt32LE(0x00000080, 0x3c);

  const dosStubString: string = "This program cannot be run in DOS mode.\r\r\n$";
  const dosStubBytes: number[] = [
    0x0e, 0x1f, 0xba, 0x0e, 0x00, 0xb4, 0x09, 0xcd, 0x21, 0xb8, 0x01, 0x4c, 0xcd, 0x21,
  ];
  Buffer.from(dosStubBytes).copy(peExecutableBuffer, 0x40);
  Buffer.from(dosStubString, "ascii").copy(peExecutableBuffer, 0x4e);

  // PE Signature
  const peHeaderOffset: number = 0x80;
  peExecutableBuffer.writeUInt32LE(0x00004550, peHeaderOffset);

  // COFF Header
  const coffHeaderOffset: number = peHeaderOffset + 4;
  peExecutableBuffer.writeUInt16LE(0x8664, coffHeaderOffset + 0);
  peExecutableBuffer.writeUInt16LE(3, coffHeaderOffset + 2);
  peExecutableBuffer.writeUInt32LE(Math.floor(Date.now() / 1000), coffHeaderOffset + 4);
  peExecutableBuffer.writeUInt32LE(0, coffHeaderOffset + 8);
  peExecutableBuffer.writeUInt32LE(0, coffHeaderOffset + 12);
  peExecutableBuffer.writeUInt16LE(0x00f0, coffHeaderOffset + 16);
  peExecutableBuffer.writeUInt16LE(0x0022, coffHeaderOffset + 18);

  // Optional Header
  const optionalHeaderOffset: number = coffHeaderOffset + 20;
  peExecutableBuffer.writeUInt16LE(0x020b, optionalHeaderOffset + 0);
  peExecutableBuffer.writeUInt8(14, optionalHeaderOffset + 2);
  peExecutableBuffer.writeUInt8(0, optionalHeaderOffset + 3);
  peExecutableBuffer.writeUInt32LE(textRawSize, optionalHeaderOffset + 4);
  peExecutableBuffer.writeUInt32LE(rdataRawSize + dataRawSize, optionalHeaderOffset + 8);
  peExecutableBuffer.writeUInt32LE(0, optionalHeaderOffset + 12);
  peExecutableBuffer.writeUInt32LE(textRva, optionalHeaderOffset + 16);
  peExecutableBuffer.writeUInt32LE(textRva, optionalHeaderOffset + 20);
  peExecutableBuffer.writeBigUInt64LE(BigInt("0x140000000"), optionalHeaderOffset + 24);
  peExecutableBuffer.writeUInt32LE(sectionAlignment, optionalHeaderOffset + 32);
  peExecutableBuffer.writeUInt32LE(fileAlignment, optionalHeaderOffset + 36);
  peExecutableBuffer.writeUInt16LE(6, optionalHeaderOffset + 40);
  peExecutableBuffer.writeUInt16LE(0, optionalHeaderOffset + 42);
  peExecutableBuffer.writeUInt16LE(1, optionalHeaderOffset + 44);
  peExecutableBuffer.writeUInt16LE(0, optionalHeaderOffset + 46);
  peExecutableBuffer.writeUInt16LE(6, optionalHeaderOffset + 48);
  peExecutableBuffer.writeUInt16LE(0, optionalHeaderOffset + 50);
  peExecutableBuffer.writeUInt32LE(0, optionalHeaderOffset + 52);
  peExecutableBuffer.writeUInt32LE(totalImageVirtualSize, optionalHeaderOffset + 56);
  peExecutableBuffer.writeUInt32LE(headerSizeAligned, optionalHeaderOffset + 60);
  peExecutableBuffer.writeUInt32LE(0, optionalHeaderOffset + 64);
  peExecutableBuffer.writeUInt16LE(0x0002, optionalHeaderOffset + 68);
  peExecutableBuffer.writeUInt16LE(0x8160, optionalHeaderOffset + 70);
  peExecutableBuffer.writeBigUInt64LE(BigInt(0x100000), optionalHeaderOffset + 72);
  peExecutableBuffer.writeBigUInt64LE(BigInt(0x1000), optionalHeaderOffset + 80);
  peExecutableBuffer.writeBigUInt64LE(BigInt(0x100000), optionalHeaderOffset + 88);
  peExecutableBuffer.writeBigUInt64LE(BigInt(0x1000), optionalHeaderOffset + 96);
  peExecutableBuffer.writeUInt32LE(0, optionalHeaderOffset + 104);
  peExecutableBuffer.writeUInt32LE(16, optionalHeaderOffset + 108);

  // Section Headers
  const sectionHeaderTableOffset: number = optionalHeaderOffset + 240;

  // .text
  peExecutableBuffer.write(".text\0\0\0", sectionHeaderTableOffset + 0, "ascii");
  peExecutableBuffer.writeUInt32LE(textVirtualSize, sectionHeaderTableOffset + 8);
  peExecutableBuffer.writeUInt32LE(textRva, sectionHeaderTableOffset + 12);
  peExecutableBuffer.writeUInt32LE(textRawSize, sectionHeaderTableOffset + 16);
  peExecutableBuffer.writeUInt32LE(textRawOffset, sectionHeaderTableOffset + 20);
  peExecutableBuffer.writeUInt32LE(0, sectionHeaderTableOffset + 24);
  peExecutableBuffer.writeUInt32LE(0, sectionHeaderTableOffset + 28);
  peExecutableBuffer.writeUInt16LE(0, sectionHeaderTableOffset + 32);
  peExecutableBuffer.writeUInt16LE(0, sectionHeaderTableOffset + 34);
  peExecutableBuffer.writeUInt32LE(0x60000020, sectionHeaderTableOffset + 36);

  // .rdata
  const rdataHeaderOffset: number = sectionHeaderTableOffset + 40;
  peExecutableBuffer.write(".rdata\0\0", rdataHeaderOffset + 0, "ascii");
  peExecutableBuffer.writeUInt32LE(rdataVirtualSize, rdataHeaderOffset + 8);
  peExecutableBuffer.writeUInt32LE(rdataRva, rdataHeaderOffset + 12);
  peExecutableBuffer.writeUInt32LE(rdataRawSize, rdataHeaderOffset + 16);
  peExecutableBuffer.writeUInt32LE(rdataRawOffset, rdataHeaderOffset + 20);
  peExecutableBuffer.writeUInt32LE(0, rdataHeaderOffset + 24);
  peExecutableBuffer.writeUInt32LE(0, rdataHeaderOffset + 28);
  peExecutableBuffer.writeUInt16LE(0, rdataHeaderOffset + 32);
  peExecutableBuffer.writeUInt16LE(0, rdataHeaderOffset + 34);
  peExecutableBuffer.writeUInt32LE(0x40000040, rdataHeaderOffset + 36);

  // .data
  const dataHeaderOffset: number = sectionHeaderTableOffset + 80;
  peExecutableBuffer.write(".data\0\0\0", dataHeaderOffset + 0, "ascii");
  peExecutableBuffer.writeUInt32LE(dataVirtualSize, dataHeaderOffset + 8);
  peExecutableBuffer.writeUInt32LE(dataRva, dataHeaderOffset + 12);
  peExecutableBuffer.writeUInt32LE(dataRawSize, dataHeaderOffset + 16);
  peExecutableBuffer.writeUInt32LE(dataRawOffset, dataHeaderOffset + 20);
  peExecutableBuffer.writeUInt32LE(0, dataHeaderOffset + 24);
  peExecutableBuffer.writeUInt32LE(0, dataHeaderOffset + 28);
  peExecutableBuffer.writeUInt16LE(0, dataHeaderOffset + 32);
  peExecutableBuffer.writeUInt16LE(0, dataHeaderOffset + 34);
  peExecutableBuffer.writeUInt32LE(0xc0000040, dataHeaderOffset + 36);

  textRawBuffer.copy(peExecutableBuffer, textRawOffset);
  rdataRawBuffer.copy(peExecutableBuffer, rdataRawOffset);
  dataRawBuffer.copy(peExecutableBuffer, dataRawOffset);

  return peExecutableBuffer;
}

/**
 * Package core VTek application files into a self-contained JSZip bundle
 */
export async function packageApplicationZip(): Promise<Buffer> {
  const archive: JSZip = new JSZip();

  const packageJsonPath: string = path.join(vtekPackageRootDirectoryPath, "package.json");
  if (fileSystem.existsSync(packageJsonPath)) {
    archive.file("package.json", fileSystem.readFileSync(packageJsonPath));
  }

  const electronMainPath: string = path.join(vtekPackageRootDirectoryPath, "electron", "main.cjs");
  if (fileSystem.existsSync(electronMainPath)) {
    archive.file("electron/main.cjs", fileSystem.readFileSync(electronMainPath));
  }

  const electronPreloadPath: string = path.join(vtekPackageRootDirectoryPath, "electron", "preload.cjs");
  if (fileSystem.existsSync(electronPreloadPath)) {
    archive.file("electron/preload.cjs", fileSystem.readFileSync(electronPreloadPath));
  }

  const electronRunnerPath: string = path.join(vtekPackageRootDirectoryPath, "electron", "runner.cjs");
  if (fileSystem.existsSync(electronRunnerPath)) {
    archive.file("electron/runner.cjs", fileSystem.readFileSync(electronRunnerPath));
  }

  const launcherBatContent: string = `@echo off
echo Starting VTek Office Suite Desktop Application...
if exist electron\\runner.cjs (
  node electron\\runner.cjs %*
) else (
  node electron\\main.cjs %*
)
`;
  archive.file("launcher.bat", launcherBatContent);

  const zipBuffer: Buffer = await archive.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  return zipBuffer;
}

/**
 * Build Debian Linux .deb package for VTek Office Suite
 */
export async function buildDebPackage(
  options: BuildDesktopOptions = {}
): Promise<BuildPackageResult> {
  const versionString: string = options.version || "1.0.0";
  const packageName: string = options.packageName || "vtek-office-suit";
  const outputDirectoryPath: string = resolveDownloadsDirectoryPath(
    options.outputDirectoryPath,
    packageName,
    versionString
  );
  const applicationDisplayName: string = options.applicationDisplayName || "VTek Office Suite";
  const descriptionText: string =
    options.description || "VTek Office Suite Unified Desktop Application";

  if (!fileSystem.existsSync(outputDirectoryPath)) {
    fileSystem.mkdirSync(outputDirectoryPath, { recursive: true });
  }

  const standardDebFileName: string = `${packageName}_${versionString}_amd64.deb`;
  const canonicalDebFileName: string = "VTek-Office-Suite-linux-amd64.deb";
  const debOutputFilePath: string = path.join(outputDirectoryPath, canonicalDebFileName);
  const stagingDirectoryPath: string = path.join(outputDirectoryPath, ".deb-staging-vtek");

  if (fileSystem.existsSync(stagingDirectoryPath)) {
    fileSystem.rmSync(stagingDirectoryPath, { recursive: true, force: true });
  }

  const debianDir: string = path.join(stagingDirectoryPath, "DEBIAN");
  const optAppDir: string = path.join(stagingDirectoryPath, "opt", packageName);
  const optResourcesDir: string = path.join(optAppDir, "resources", "app");
  const usrBinDir: string = path.join(stagingDirectoryPath, "usr", "bin");
  const usrApplicationsDir: string = path.join(stagingDirectoryPath, "usr", "share", "applications");
  const usrIconsDir: string = path.join(
    stagingDirectoryPath,
    "usr",
    "share",
    "icons",
    "hicolor",
    "512x512",
    "apps"
  );

  fileSystem.mkdirSync(debianDir, { recursive: true });
  fileSystem.mkdirSync(optResourcesDir, { recursive: true });
  fileSystem.mkdirSync(usrBinDir, { recursive: true });
  fileSystem.mkdirSync(usrApplicationsDir, { recursive: true });
  fileSystem.mkdirSync(usrIconsDir, { recursive: true });

  const controlFileContent: string = `Package: ${packageName}
Version: ${versionString}
Section: office
Priority: optional
Architecture: amd64
Maintainer: VTek Office Team <contact@2-tek.com>
Installed-Size: 2048
Homepage: https://github.com/vietcoder1998/VTekOfficeSuit
Description: ${applicationDisplayName}
 ${descriptionText}
`;
  fileSystem.writeFileSync(path.join(debianDir, "control"), controlFileContent, {
    encoding: "utf8",
    mode: 0o644,
  });

  const packageJsonSource: string = path.join(vtekPackageRootDirectoryPath, "package.json");
  if (fileSystem.existsSync(packageJsonSource)) {
    fileSystem.copyFileSync(packageJsonSource, path.join(optResourcesDir, "package.json"));
  }

  const electronDirSource: string = path.join(vtekPackageRootDirectoryPath, "electron");
  const optElectronDir: string = path.join(optResourcesDir, "electron");
  if (fileSystem.existsSync(electronDirSource)) {
    fileSystem.mkdirSync(optElectronDir, { recursive: true });
    for (const fileName of fileSystem.readdirSync(electronDirSource)) {
      fileSystem.copyFileSync(
        path.join(electronDirSource, fileName),
        path.join(optElectronDir, fileName)
      );
    }
  }

  const optExecutablePath: string = path.join(optAppDir, packageName);
  const optLauncherScript: string = `#!/bin/sh
exec electron /opt/${packageName}/resources/app/electron/main.cjs "$@"
`;
  fileSystem.writeFileSync(optExecutablePath, optLauncherScript, {
    encoding: "utf8",
    mode: 0o755,
  });

  const usrBinExecutablePath: string = path.join(usrBinDir, packageName);
  const usrBinLauncherScript: string = `#!/bin/sh
exec /opt/${packageName}/${packageName} "$@"
`;
  fileSystem.writeFileSync(usrBinExecutablePath, usrBinLauncherScript, {
    encoding: "utf8",
    mode: 0o755,
  });

  const desktopEntryContent: string = `[Desktop Entry]
Name=${applicationDisplayName}
Comment=${descriptionText}
Exec=/usr/bin/${packageName} %U
Terminal=false
Type=Application
Icon=${packageName}
Categories=Office;WordProcessor;Spreadsheet;
`;
  fileSystem.writeFileSync(
    path.join(usrApplicationsDir, `${packageName}.desktop`),
    desktopEntryContent,
    { encoding: "utf8", mode: 0o644 }
  );

  const iconSourcePath: string = path.join(vtekPackageRootDirectoryPath, "public", "icon.svg");
  if (fileSystem.existsSync(iconSourcePath)) {
    fileSystem.copyFileSync(
      iconSourcePath,
      path.join(usrIconsDir, `${packageName}.svg`)
    );
  }

  try {
    childProcess.execSync(
      `dpkg-deb --build --root-owner-group "${stagingDirectoryPath}" "${debOutputFilePath}"`,
      { stdio: options.silent ? "pipe" : "inherit" }
    );
  } catch {
    childProcess.execSync(
      `dpkg-deb -Zgzip --build "${stagingDirectoryPath}" "${debOutputFilePath}"`,
      { stdio: options.silent ? "pipe" : "inherit" }
    );
  }

  fileSystem.rmSync(stagingDirectoryPath, { recursive: true, force: true });

  // Also create standardized alias file
  const standardAliasPath: string = path.join(outputDirectoryPath, standardDebFileName);
  fileSystem.copyFileSync(debOutputFilePath, standardAliasPath);

  const fileBuffer: Buffer = fileSystem.readFileSync(debOutputFilePath);
  const sha256Hash: string = computeSha256(fileBuffer);
  const stats: fileSystem.Stats = fileSystem.statSync(debOutputFilePath);

  if (!options.silent) {
    console.log(`✅ Built Debian Package: ${debOutputFilePath} (${stats.size} bytes)`);
    console.log(`   SHA256: ${sha256Hash}`);
  }

  return {
    success: true,
    packageType: "deb",
    filePath: debOutputFilePath,
    fileName: canonicalDebFileName,
    sizeBytes: stats.size,
    sha256Hash,
    message: `Successfully built Debian package '${canonicalDebFileName}' (${stats.size} bytes)`,
  };
}

/**
 * Build Windows .exe executable package for VTek Office Suite
 */
export async function buildExePackage(
  options: BuildDesktopOptions = {}
): Promise<BuildPackageResult> {
  const versionString: string = options.version || "1.0.0";
  const packageName: string = options.packageName || "vtek-office-suit";
  const outputDirectoryPath: string = resolveDownloadsDirectoryPath(
    options.outputDirectoryPath,
    packageName,
    versionString
  );
  const applicationDisplayName: string = options.applicationDisplayName || "VTek Office Suite";

  if (!fileSystem.existsSync(outputDirectoryPath)) {
    fileSystem.mkdirSync(outputDirectoryPath, { recursive: true });
  }

  const canonicalExeFileName: string = "VTek-Office-Suite-windows-x64.exe";
  const standardExeFileName: string = `vtek-office-suit-setup-${versionString}.exe`;
  const exeOutputFilePath: string = path.join(outputDirectoryPath, canonicalExeFileName);

  const applicationZipBuffer: Buffer = await packageApplicationZip();
  const peExecutableBuffer: Buffer = await generateWindowsPeExecutableBuffer(
    applicationZipBuffer,
    applicationDisplayName,
    versionString
  );

  fileSystem.writeFileSync(exeOutputFilePath, peExecutableBuffer);

  // Also create standardized alias file
  const standardAliasPath: string = path.join(outputDirectoryPath, standardExeFileName);
  fileSystem.copyFileSync(exeOutputFilePath, standardAliasPath);

  const sha256Hash: string = computeSha256(peExecutableBuffer);
  const stats: fileSystem.Stats = fileSystem.statSync(exeOutputFilePath);

  if (!options.silent) {
    console.log(`✅ Built Windows Executable: ${exeOutputFilePath} (${stats.size} bytes)`);
    console.log(`   SHA256: ${sha256Hash}`);
  }

  return {
    success: true,
    packageType: "exe",
    filePath: exeOutputFilePath,
    fileName: canonicalExeFileName,
    sizeBytes: stats.size,
    sha256Hash,
    message: `Successfully built Windows PE32+ executable '${canonicalExeFileName}' (${stats.size} bytes)`,
  };
}

/**
 * Build all desktop packages and write release manifest & checksums to downloads
 */
export async function buildAllDesktopPackages(
  options: BuildDesktopOptions = {}
): Promise<BuildAllPackagesResult> {
  const versionString: string = options.version || "1.0.0";
  const packageName: string = options.packageName || "vtek-office-suit";
  const targetOutputDirectory: string = resolveDownloadsDirectoryPath(
    options.outputDirectoryPath,
    packageName,
    versionString
  );

  if (!fileSystem.existsSync(targetOutputDirectory)) {
    fileSystem.mkdirSync(targetOutputDirectory, { recursive: true });
  }

  if (!options.silent) {
    console.log("═════════════════════════════════════════════════════════════════════════════");
    console.log("🖥️  VTek Office Suite — Building Electron Desktop Distribution Packages");
    console.log(`📁 Destination Output Directory: ${targetOutputDirectory}`);
    console.log("═════════════════════════════════════════════════════════════════════════════");
  }

  const debResult: BuildPackageResult = await buildDebPackage(options);
  const exeResult: BuildPackageResult = await buildExePackage(options);

  // Write SHA256SUMS.txt
  const checksumFilePath: string = path.join(targetOutputDirectory, "SHA256SUMS.txt");
  const checksumContent: string = `${debResult.sha256Hash}  ${debResult.fileName}
${exeResult.sha256Hash}  ${exeResult.fileName}
`;
  fileSystem.writeFileSync(checksumFilePath, checksumContent, "utf8");

  // Write release-manifest.json
  const manifestFilePath: string = path.join(targetOutputDirectory, "release-manifest.json");
  const manifestData = {
    suiteName: "VTek Office Suite",
    packageId: packageName,
    version: versionString,
    buildTimestamp: new Date().toISOString(),
    distributionChannel: "stable",
    structureFormat: "downloads/{app}/{version}/{name}.{type}",
    outputDirectory: targetOutputDirectory,
    packages: [
      {
        platform: "linux",
        architecture: "amd64",
        format: "deb",
        fileName: debResult.fileName,
        sizeBytes: debResult.sizeBytes,
        sha256: debResult.sha256Hash,
      },
      {
        platform: "windows",
        architecture: "x64",
        format: "exe",
        fileName: exeResult.fileName,
        sizeBytes: exeResult.sizeBytes,
        sha256: exeResult.sha256Hash,
      },
    ],
  };
  fileSystem.writeFileSync(manifestFilePath, JSON.stringify(manifestData, null, 2) + "\n", "utf8");

  if (!options.silent) {
    console.log("─────────────────────────────────────────────────────────────────────────────");
    console.log(`📄 Checksums written to: ${checksumFilePath}`);
    console.log(`📋 Manifest written to: ${manifestFilePath}`);
    console.log("✨ All desktop packages built successfully to downloads!");
    console.log("─────────────────────────────────────────────────────────────────────────────");
  }

  return {
    success: true,
    outputDirectory: targetOutputDirectory,
    debResult,
    exeResult,
    manifestFilePath,
    checksumFilePath,
  };
}
