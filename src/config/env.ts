import {existsSync, readFileSync} from "node:fs";
import {join} from "node:path";

export const DEEPSEEK_API_KEY_ENV = "DEEPSEEK_API_KEY";
const LOCAL_ENV_FILES = [".env.local", ".env.deepseek.local"] as const;

export type DeepSeekEnvConfig = {
  apiKey: string;
  baseUrl: string;
};

export type DeepSeekEnvSource =
  | "process.env"
  | ".env.local"
  | ".env.deepseek.local"
  | "missing";

export type DeepSeekEnvDiagnostic = {
  apiKey: string;
  baseUrl: string;
  source: DeepSeekEnvSource;
  isConfigured: boolean;
  message: string;
  searched: string[];
};

type FileSystem = {
  existsSync: (path: string) => boolean;
  readFileSync: (path: string, encoding: "utf8") => string;
};

type ReadEnvOptions = {
  env?: NodeJS.ProcessEnv;
  cwd?: string;
  fs?: FileSystem;
};

function parseEnvFile(contents: string) {
  return contents.split(/\r?\n/).reduce<Record<string, string>>((acc, line) => {
    const trimmedLine = line.trim();

    if (
      trimmedLine.length === 0 ||
      trimmedLine.startsWith("#") ||
      !trimmedLine.includes("=")
    ) {
      return acc;
    }

    const [rawKey, ...rawValueParts] = trimmedLine.split("=");
    const key = rawKey.trim();
    const value = rawValueParts.join("=").trim().replace(/^['"]|['"]$/g, "");

    if (key.length > 0) {
      acc[key] = value;
    }

    return acc;
  }, {});
}

function getConfiguredMessage(source: Exclude<DeepSeekEnvSource, "missing">) {
  return `DeepSeek config loaded from ${source}.`;
}

function getMissingMessage() {
  return "Missing DEEPSEEK_API_KEY. Add it to .env.local, .env.deepseek.local, or export it before launch.";
}

export function getDeepSeekEnvDiagnostic(
  options: ReadEnvOptions = {}
): DeepSeekEnvDiagnostic {
  const env = options.env ?? process.env;
  const cwd = options.cwd ?? process.cwd();
  const fs = options.fs ?? {existsSync, readFileSync};
  const baseUrl = "https://api.deepseek.com";
  const processValue = env[DEEPSEEK_API_KEY_ENV]?.trim() ?? "";

  if (processValue.length > 0) {
    return {
      apiKey: processValue,
      baseUrl,
      source: "process.env",
      isConfigured: true,
      message: getConfiguredMessage("process.env"),
      searched: []
    };
  }

  for (const fileName of LOCAL_ENV_FILES) {
    const filePath = join(cwd, fileName);

    if (!fs.existsSync(filePath)) {
      continue;
    }

    const parsed = parseEnvFile(fs.readFileSync(filePath, "utf8"));
    const apiKey = parsed[DEEPSEEK_API_KEY_ENV]?.trim() ?? "";

    if (apiKey.length === 0) {
      continue;
    }

    return {
      apiKey,
      baseUrl,
      source: fileName,
      isConfigured: true,
      message: getConfiguredMessage(fileName),
      searched: [fileName]
    };
  }

  return {
    apiKey: "",
    baseUrl,
    source: "missing",
    isConfigured: false,
    message: getMissingMessage(),
    searched: [...LOCAL_ENV_FILES]
  };
}

export function getMissingDeepSeekApiKeyMessage() {
  return getMissingMessage();
}

export function readDeepSeekEnv(
  options: ReadEnvOptions = {}
): DeepSeekEnvConfig {
  const diagnostic = getDeepSeekEnvDiagnostic(options);

  if (!diagnostic.isConfigured) {
    throw new Error(diagnostic.message);
  }

  return {
    apiKey: diagnostic.apiKey,
    baseUrl: diagnostic.baseUrl
  };
}
