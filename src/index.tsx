import React from "react";
import {render} from "ink";
import {App} from "./app.js";

render(
  <App
    boot={{
      productName: "PigLet CLI",
      version: "0.1.0",
      model: "deepseek-chat",
      cwd: process.cwd()
    }}
  />
);
