import React from "react";
import {render} from "ink";
import {App} from "./app.js";
import {getDeepSeekEnvDiagnostic} from "./config/env.js";
import {detectTerminalProfile} from "./config/terminal-profile.js";

render(
  <App
    boot={{
      productName: "PigLet CLI",
      version: "0.1.0",
      model: "deepseek-chat",
      cwd: process.cwd()
    }}
    terminalProfile={detectTerminalProfile()}
    configDiagnostic={getDeepSeekEnvDiagnostic()}
    onExit={() => {
      process.exit(0);
    }}
  />
);
