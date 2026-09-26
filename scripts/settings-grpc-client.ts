/**
 * settings-grpc-client.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Package-local gRPC client in VTekOfficeSuit for requesting and synchronizing
 * settings XML instance data with OfficePack (port 50052).
 *
 * Implements:
 * - In starting default settings of packages/VTekOfficeSuit auto use settings loaded by settings instance
 * - When settings (save), call gRPC to handle instance of OfficePack and update XML file
 *
 * Rules:
 * - Rule 16 (< 500 lines)
 * - Rule 25 (Zero Any, Full Word Descriptive Naming)
 * - Rule 26 (Prefer Switch-Case)
 * - Rule 29 (EOF integrity: exact 1 newline)
 * - Rule 44 (Explicit Variable Typing Before =)
 * - Rule 66 (Package-Local gRPC)
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface VTekOfficeSuitSettingsInstanceRequestOptions {
  readonly instanceId?: string;
  readonly projectName?: string;
  readonly tabSettings?: string;
  readonly targetPath?: string;
  readonly rootDir?: string;
  readonly timeoutMs?: number;
}

export interface VTekOfficeSuitSettingsInstanceSaveOptions {
  readonly instanceId?: string;
  readonly projectName?: string;
  readonly tabSettings?: string;
  readonly targetPath?: string;
  readonly properties?: Record<string, string | number | boolean>;
  readonly xmlContent?: string;
  readonly timeoutMs?: number;
}

export interface VTekOfficeSuitSettingsInstanceResult {
  readonly success: boolean;
  readonly project: string;
  readonly tab: string;
  readonly instance: string;
  readonly properties: Record<string, string | number | boolean>;
  readonly filePath?: string;
  readonly rawContent?: string;
  readonly error?: string;
}

export async function loadVTekOfficeSuitSettingsInstanceViaGrpc(
  options: VTekOfficeSuitSettingsInstanceRequestOptions = {}
): Promise<VTekOfficeSuitSettingsInstanceResult> {
  const targetProject: string = (options.projectName || "vtekofficesuit").trim().toLowerCase();
  const targetTab: string = (options.tabSettings || "general").trim().toLowerCase();
  const targetInstance: string = (options.instanceId || "default").trim();

  // 1. Direct Node.js runtime resolution (SSR / server / tests)
  if (typeof window === "undefined") {
    try {
      const { lc_settings_config_engine } = await import(
        "../../OfficePack/sources/server/services/settings/lc-settings-config-engine"
      );
      const readResult = lc_settings_config_engine.readSettingsInstanceSync({
        projectName: targetProject,
        tabSettings: targetTab,
        instanceId: targetInstance,
        targetPath: options.targetPath,
        rootDir: options.rootDir,
      });

      const nodeSuccessResult: VTekOfficeSuitSettingsInstanceResult = {
        success: readResult.success,
        project: readResult.project,
        tab: readResult.tab,
        instance: readResult.instance,
        properties: readResult.properties,
        filePath: readResult.filePath,
        rawContent: readResult.rawContent,
        error: readResult.error,
      };
      return nodeSuccessResult;
    } catch {
      // Direct engine not available, proceed to fetch proxy
    }
  }

  // 2. Client-side browser invocation via Next.js gRPC API route proxy
  if (typeof window !== "undefined" && typeof window.fetch === "function") {
    const candidateEndpoints: string[] = [
      "/api/vtekofficesuit/grpc",
      "/api/office/grpc",
      "/api/settings/grpc",
    ];

    for (const endpointUrl of candidateEndpoints) {
      try {
        const httpResponse: Response = await fetch(endpointUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "settings.load_instance",
            payload: {
              projectName: targetProject,
              tabSettings: targetTab,
              instanceId: targetInstance,
              targetPath: options.targetPath,
              rootDir: options.rootDir,
            },
            options: {
              timeoutMs: options.timeoutMs || 8000,
            },
          }),
        });

        if (httpResponse.ok) {
          const responseJson: Record<string, unknown> = (await httpResponse.json()) as Record<string, unknown>;
          if (responseJson && responseJson.dataJson && typeof responseJson.dataJson === "string") {
            const parsedData: Record<string, unknown> = JSON.parse(responseJson.dataJson);
            if (parsedData && parsedData.properties && typeof parsedData.properties === "object") {
              const clientSuccessResult: VTekOfficeSuitSettingsInstanceResult = {
                success: true,
                project: String(parsedData.project || targetProject),
                tab: String(parsedData.tab || targetTab),
                instance: String(parsedData.instance || targetInstance),
                properties: parsedData.properties as Record<string, string | number | boolean>,
                filePath: typeof parsedData.filePath === "string" ? parsedData.filePath : undefined,
                rawContent: typeof parsedData.rawContent === "string" ? parsedData.rawContent : undefined,
              };
              return clientSuccessResult;
            }
          }
        }
      } catch {
        continue;
      }
    }
  }

  const failureResult: VTekOfficeSuitSettingsInstanceResult = {
    success: false,
    project: targetProject,
    tab: targetTab,
    instance: targetInstance,
    properties: {},
    error: "OfficePack gRPC settings service unreachable",
  };
  return failureResult;
}

export async function saveVTekOfficeSuitSettingsInstanceViaGrpc(
  options: VTekOfficeSuitSettingsInstanceSaveOptions = {}
): Promise<{ success: boolean; filePath?: string; error?: string }> {
  const targetProject: string = (options.projectName || "vtekofficesuit").trim().toLowerCase();
  const targetTab: string = (options.tabSettings || "general").trim().toLowerCase();
  const targetInstance: string = (options.instanceId || "default").trim();

  // 1. Direct Node.js runtime resolution
  if (typeof window === "undefined") {
    try {
      const { lc_settings_config_engine } = await import(
        "../../OfficePack/sources/server/services/settings/lc-settings-config-engine"
      );
      const writeResult = lc_settings_config_engine.saveSettingsInstanceSync({
        projectName: targetProject,
        tabSettings: targetTab,
        instanceId: targetInstance,
        targetPath: options.targetPath,
        properties: options.properties,
        xmlContent: options.xmlContent,
      });
      return {
        success: writeResult.success,
        filePath: writeResult.filePath,
        error: writeResult.error,
      };
    } catch (saveError: unknown) {
      const errorMessage: string = saveError instanceof Error ? saveError.message : "Error saving";
      return { success: false, error: errorMessage };
    }
  }

  // 2. Client-side browser invocation via Next.js gRPC API route proxy
  if (typeof window !== "undefined" && typeof window.fetch === "function") {
    const candidateEndpoints: string[] = [
      "/api/vtekofficesuit/grpc",
      "/api/office/grpc",
      "/api/settings/grpc",
    ];

    for (const endpointUrl of candidateEndpoints) {
      try {
        const httpResponse: Response = await fetch(endpointUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "settings.save_instance",
            payload: {
              projectName: targetProject,
              tabSettings: targetTab,
              instanceId: targetInstance,
              targetPath: options.targetPath,
              properties: options.properties,
              xmlContent: options.xmlContent,
            },
            options: {
              timeoutMs: options.timeoutMs || 8000,
            },
          }),
        });

        if (httpResponse.ok) {
          const responseJson: Record<string, unknown> = (await httpResponse.json()) as Record<string, unknown>;
          return {
            success: Boolean(responseJson.success),
            filePath: typeof responseJson.filePath === "string" ? responseJson.filePath : undefined,
            error: typeof responseJson.error === "string" ? responseJson.error : undefined,
          };
        }
      } catch {
        continue;
      }
    }
  }

  return { success: false, error: "OfficePack gRPC service unreachable" };
}
