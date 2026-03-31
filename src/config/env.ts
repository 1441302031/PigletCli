export const DEEPSEEK_API_KEY_ENV = "DEEPSEEK_API_KEY";

export type DeepSeekEnvConfig = {
  apiKey: string;
  baseUrl: string;
};

export function getMissingDeepSeekApiKeyMessage() {
  return `${DEEPSEEK_API_KEY_ENV} is required. Configure it in your local environment before starting the CLI.`;
}

export function readDeepSeekEnv(
  env: NodeJS.ProcessEnv = process.env
): DeepSeekEnvConfig {
  const apiKey = env[DEEPSEEK_API_KEY_ENV]?.trim() ?? "";

  if (apiKey.length === 0) {
    throw new Error(getMissingDeepSeekApiKeyMessage());
  }

  return {
    apiKey,
    baseUrl: "https://api.deepseek.com"
  };
}
